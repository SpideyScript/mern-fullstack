const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
{
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    urgency: {
        type: String,
        enum: ["Flexible", "Today", "Urgent"],
        default: "Flexible"
    },

    preferredDate: {
        type: Date
    },

    budget: {
        type: Number
    },

    images: [{
        type: String
    }],

    status: {
        type: String,
        enum: [
            "Open",
            "Quoted",
            "Booked",
            "Completed",
            "Cancelled"
        ],
        default: "Open"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model(
    "ServiceRequest",
    serviceRequestSchema
);