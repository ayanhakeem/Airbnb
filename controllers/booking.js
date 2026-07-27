const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51PXaB5RpFhMvE6FzD5H78X...'); // standard placeholder key


module.exports.createBooking = async (req, res, next) => {
    let { id } = req.params;
    let { startDate, endDate, weatherProtected } = req.body;

    if (!startDate || !endDate) {
        req.flash("error", "Start Date and End Date are required");
        return res.redirect(`/listings/${id}`);
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (startDate >= endDate) {
        req.flash("error", "End Date must be after Start Date");
        return res.redirect(`/listings/${id}`);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check for double booking
        const overlappingBookings = await Booking.find({
            listing: id,
            $or: [
                { status: 'CONFIRMED' },
                { status: 'PENDING', lockedUntil: { $gt: new Date() } }
            ],
            startDate: { $lt: endDate },
            endDate: { $gt: startDate }
        }).session(session);

        if (overlappingBookings.length > 0) {
            await session.abortTransaction();
            session.endSession();
            req.flash("error", "These dates are already booked or locked by another user.");
            return res.redirect(`/listings/${id}`);
        }

        // Lock dates for 10 minutes
        const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);
        
        const newBooking = new Booking({
            listing: id,
            user: req.user._id,
            startDate,
            endDate,
            status: 'PENDING',
            lockedUntil,
            weatherProtected: weatherProtected === 'true' || weatherProtected === true,
            weatherStatus: (weatherProtected === 'true' || weatherProtected === true) ? 'active' : 'none'
        });

        await newBooking.save({ session });
        await session.commitTransaction();
        session.endSession();

        // Emit Socket.io event to notify other clients
        const io = req.app.get('io');
        if (io) {
            io.emit('datesLocked', {
                listingId: id,
                startDate,
                endDate,
                bookingId: newBooking._id
            });
        }

        req.flash("success", "Dates locked successfully. Proceed to payment.");
        res.redirect(`/listings/${id}/bookings/${newBooking._id}/payment`);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

module.exports.renderPayment = async (req, res, next) => {
    let { id, bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect(`/listings/${id}`);
    }
    
    // Check if the lock expired
    if (booking.status === 'PENDING' && booking.lockedUntil < new Date()) {
        booking.status = 'CANCELLED';
        await booking.save();
        req.flash("error", "Booking lock expired. Please try booking again.");
        
        // Notify others the dates are available again
        const io = req.app.get('io');
        if (io) {
            io.emit('datesUnlocked', {
                listingId: id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                bookingId: booking._id
            });
        }
        
        return res.redirect(`/listings/${id}`);
    }

    res.render("listings/payment.ejs", { booking, listing: booking.listing });
};

module.exports.createStripeSession = async (req, res, next) => {
    let { id, bookingId } = req.params;
    const { promoCode } = req.body;
    try {
        const booking = await Booking.findById(bookingId).populate("listing");
        if (!booking) {
            return next(new ExpressError(404, "Booking not found"));
        }

        // Calculate total amount based on nights booked
        const differenceInTime = booking.endDate.getTime() - booking.startDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        const totalNights = differenceInDays > 0 ? differenceInDays : 1;
        let finalPrice = booking.listing.price * totalNights;

        let discountDesc = "";
        if (promoCode === "WANDER10") {
            finalPrice = finalPrice * 0.90;
            discountDesc = " (10% host promo applied)";
        } else if (promoCode === "WANDER15") {
            finalPrice = finalPrice * 0.85;
            discountDesc = " (15% host promo applied)";
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: booking.listing.title,
                        description: `Booking for dates: ${booking.startDate.toDateString()} to ${booking.endDate.toDateString()}${discountDesc}`,
                    },
                    unit_amount: Math.round(finalPrice) * 100, // Stripe expects amount in paise
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/listings/${id}/bookings/${bookingId}/confirm`,
            cancel_url: `${req.protocol}://${req.get('host')}/listings/${id}/bookings/${bookingId}/payment`,
        });

        res.redirect(303, session.url);
    } catch (err) {
        next(err);
    }
};

module.exports.confirmBooking = async (req, res, next) => {
    let { id, bookingId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await Booking.findById(bookingId).session(session);

        if (!booking) {
            throw new ExpressError(404, "Booking not found");
        }

        if (booking.status === 'PENDING' && booking.lockedUntil < new Date()) {
            booking.status = 'CANCELLED';
            await booking.save({ session });
            await session.commitTransaction();
            session.endSession();
            
            const io = req.app.get('io');
            if (io) {
                io.emit('datesUnlocked', {
                    listingId: id,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    bookingId: booking._id
                });
            }

            req.flash("error", "Booking lock expired.");
            return res.redirect(`/listings/${id}`);
        }

        booking.status = 'CONFIRMED';
        booking.lockedUntil = null;
        await booking.save({ session });

        await session.commitTransaction();
        session.endSession();

        const io = req.app.get('io');
        if (io) {
            io.emit('bookingConfirmed', {
                listingId: id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                bookingId: booking._id
            });
        }

        req.flash("success", "Payment successful! Booking confirmed.");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

module.exports.getBookingsForListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bookings = await Booking.find({
            listing: id,
            $or: [
                { status: 'CONFIRMED' },
                { status: 'PENDING', lockedUntil: { $gt: new Date() } }
            ]
        }).select('startDate endDate status');
        
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

module.exports.myBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 });
        res.render("bookings/index.ejs", { bookings });
    } catch (err) {
        next(err);
    }
};

module.exports.claimWeatherVoucher = async (req, res, next) => {
    let { bookingId } = req.params;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/bookings");
        }
        booking.weatherStatus = 'claimed_voucher';
        await booking.save();
        req.flash("success", "Congratulations! Simulated 25% discount voucher (WEATHER25) has been added to your profile.");
        res.redirect("/bookings");
    } catch (err) {
        next(err);
    }
};

module.exports.rescheduleBooking = async (req, res, next) => {
    let { bookingId } = req.params;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/bookings");
        }
        
        // Simulating rescheduling to a sunny weekend by shifting dates by 14 days
        const newStart = new Date(booking.startDate);
        newStart.setDate(newStart.getDate() + 14);
        const newEnd = new Date(booking.endDate);
        newEnd.setDate(newEnd.getDate() + 14);

        booking.startDate = newStart;
        booking.endDate = newEnd;
        booking.weatherStatus = 'rescheduled';
        await booking.save();
        
        req.flash("success", `Rescheduled successfully to a sunny weekend! New dates: ${newStart.toDateString()} to ${newEnd.toDateString()}`);
        res.redirect("/bookings");
    } catch (err) {
        next(err);
    }
};
