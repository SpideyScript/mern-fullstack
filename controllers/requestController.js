const ServiceRequest = require("../models/ServiceRequest");

exports.createRequest = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            city,
            address,
            urgency,
            preferredDate,
            budget
        } = req.body;

        const request = await ServiceRequest.create({

            customer: req.user._id,

            title,

            description,

            category,

            city,

            address,

            urgency,

            preferredDate,

            budget

        });

        res.status(201).json({

            success: true,

            message: "Problem posted successfully.",

            request

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getCustomerRequests = async (req, res) => {
    try {
        // Find requests where the customer matches the logged-in user id (from auth middleware)
        const requests = await ServiceRequest.find({ customer: req.user._id })
            .sort({ createdAt: -1 }); // Newest requests first

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve your requests.",
            error: error.message
        });
    }
};

exports.getAvailableRequests = async (req, res) => {
    try {
        const { category, city, urgency } = req.query;

        // Build an adaptable query object. We only want 'Open' jobs.
        let queryCondition = { status: "Open" };

        // Apply optional marketplace filters if the professional passes them in the query string
        if (category) queryCondition.category = category;
        if (city) queryCondition.city = new RegExp(city, 'i'); // Case-insensitive matching
        if (urgency) queryCondition.urgency = urgency;

        const requests = await ServiceRequest.find(queryCondition)
            .populate("customer", "name email phone") // Pull public contact info of the poster
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch available market listings.",
            error: error.message
        });
    }
};
exports.getRequestById = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id)
            .populate("customer", "name email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Service request not found."
            });
        }

        res.status(200).json({
            success: true,
            request
        });
    } catch (error) {
        // Fallback for invalid MongoDB Object IDs
        if (error.kind === "ObjectId") {
            return res.status(404).json({
                success: false,
                message: "Invalid Request Identification Number structure."
            });
        }
        res.status(500).json({
            success: false,
            message: "Server encountered an error fetching the document details.",
            error: error.message
        });
    }
};