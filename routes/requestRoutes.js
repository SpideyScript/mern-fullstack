const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Import the controller functions
const {
    createRequest,
    getCustomerRequests,
    getAvailableRequests,
    getRequestById
} = require("../controllers/requestController");

// 1. Create a new service request
router.post(
    "/create",
    authMiddleware,
    roleMiddleware("customer"),
    createRequest
);

// 2. Get all requests created by the logged-in customer (for their dashboard)
router.get(
    "/my-requests",
    authMiddleware,
    getCustomerRequests
);

// 3. Get open requests with optional filters (for professionals to browse)
router.get(
    "/browse",
    authMiddleware,
    getAvailableRequests
);

// 4. Get a single specific request detail by its ID
router.get(
    "/:id",
    authMiddleware,
    getRequestById
);

module.exports = router;