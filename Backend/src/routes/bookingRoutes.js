const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { validateBooking } = require("../middlewares/validateRequest");

router.post("/bookings", validateBooking, createBooking);

module.exports = router;
