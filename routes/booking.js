const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/booking.js");
const isLoggedIn = require("../middleware.js"); // Make sure this exports the middleware function properly

// Note: middleware.js likely exports `module.exports.isLoggedIn = ...`, let's check it.
// Assuming it's `const { isLoggedIn } = require("../middleware.js");` based on standard patterns, but I'll write `const { isLoggedIn } = require("../middleware.js")` instead to be safe if it exports multiple. Let me check app.js... it does `const isLoggedIn=require("./middleware.js");` which implies it might be a direct export or not used correctly in app.js. I'll check middleware.js.

router.get("/api", bookingController.getBookingsForListing);

// Using standard function wrappers in case isLoggedIn is an object
router.post("/", (req, res, next) => {
    // Basic auth check inline if middleware isn't clearly imported
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in to create a booking!");
        return res.redirect("/login");
    }
    next();
}, bookingController.createBooking);

router.get("/:bookingId/payment", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}, bookingController.renderPayment);

router.post("/:bookingId/stripe-session", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}, bookingController.createStripeSession);

router.get("/:bookingId/confirm", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}, bookingController.confirmBooking);

router.post("/:bookingId/weather/claim-voucher", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}, bookingController.claimWeatherVoucher);

router.post("/:bookingId/weather/reschedule", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}, bookingController.rescheduleBooking);

module.exports = router;
