const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { submitQuote, getQuotesByRequest } = require("../controllers/quoteController");

router.post(
    "/create",
    authMiddleware,
    roleMiddleware("provider"),
    submitQuote
);

router.get(
    "/request/:requestId",
    authMiddleware,
    getQuotesByRequest
);

module.exports = router;