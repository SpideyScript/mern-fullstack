const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
    {
        serviceRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceRequest",
            required: true
        },
        
        serviceman: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProviderProfile", // Assuming servicemen are also stored in the User collection or a Serviceman collection
            required: true
        },

        estimatedPrice: {
            type: Number,
            required: true
        },

        estimatedArrivalTime: {
            type: String, // Stored as a string to accommodate values like "Within 30 minutes", "1-2 hours", etc.
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Withdrawn"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

// Optional: Prevents a serviceman from submitting multiple quotes for the exact same service request
quoteSchema.index({ serviceRequest: 1, serviceman: 1 }, { unique: true });

module.exports = mongoose.model("Quote", quoteSchema);