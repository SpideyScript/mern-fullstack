const Quote = require("../models/Quote"); // Path to your Quote model
const ProviderProfile = require("../models/ProviderProfile"); // Path to your ProviderProfile model
const ServiceRequest = require("../models/ServiceRequest"); // Path to your ServiceRequest model


exports.submitQuote = async (req, res) => {
    try {
        const { serviceRequest, estimatedPrice, estimatedArrivalTime, message } = req.body;

        // 1. Validate required fields from the form
        if (!serviceRequest || !estimatedPrice || !estimatedArrivalTime || !message) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // 2. Find the logged-in user's ProviderProfile using their user ID (from auth middleware)
        const provider = await ProviderProfile.findOne({ userId: req.user._id });
        if (!provider) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only registered service providers can submit quotes."
            });
        }

        // 3. Check if the service request actually exists and is still open
        const requestExists = await ServiceRequest.findById(serviceRequest);
        if (!requestExists) {
            return res.status(404).json({ success: false, message: "Service request not found." });
        }
        if (requestExists.status !== "Open" && requestExists.status !== "Quoted") {
            return res.status(400).json({ success: false, message: "This request is no longer accepting quotes." });
        }

        // 4. Check if this provider has already sent a quote for this request (Prevents duplicates)
        const existingQuote = await Quote.findOne({ serviceRequest, serviceman: provider._id });
        if (existingQuote) {
            return res.status(400).json({ success: false, message: "You have already submitted a quote for this request." });
        }

        // 5. Create and save the new quote
        const newQuote = await Quote.create({
            serviceRequest,
            serviceman: provider._id,
            estimatedPrice,
            estimatedArrivalTime,
            message
        });

        // 6. Optional: Update the ServiceRequest status to "Quoted" if it was "Open"
        if (requestExists.status === "Open") {
            requestExists.status = "Quoted";
            await requestExists.save();
        }

        res.status(201).json({
            success: true,
            message: "Quote submitted successfully!",
            data: newQuote
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


exports.getQuotesByRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find all quotes for this request, populating the professional profile and the underlying user details
        const quotes = await Quote.find({ serviceRequest: requestId })
            .populate({
                path: "serviceman",
                select: "experience rating totalJobs profileImage",
                populate: {
                    path: "userId",
                    select: "name email" // Fetches provider's name from User collection
                }
            })
            .sort({ createdAt: -1 }); // Newest quotes first

        res.status(200).json({
            success: true,
            count: quotes.length,
            data: quotes
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
