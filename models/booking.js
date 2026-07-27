const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        default: 'PENDING',
    },
    lockedUntil: {
        type: Date,
        default: null,
    },
    weatherProtected: {
        type: Boolean,
        default: false,
    },
    weatherStatus: {
        type: String,
        enum: ['none', 'active', 'claimed_voucher', 'rescheduled'],
        default: 'none',
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
