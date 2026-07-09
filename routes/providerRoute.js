const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");
const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    createProfile
}
    =
    require("../controllers/providerController");

router.post(
    "/create-profile",
    authMiddleware,
    roleMiddleware("provider"),
    createProfile
);
router.get("/test", (req, res) => {
    res.send("Provider route working");
});

module.exports = router;