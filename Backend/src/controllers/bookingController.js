const Booking = require("../models/Booking");
const { calculatePrice } = require("../utils/calculatePrice");

exports.createBooking = async (req, res) => {
  try {
    const { user, vehicle, booking } = req.body;

    const estimatedTotal = calculatePrice(
      booking.selectedServices,
      booking.additionalServices
    );

    const newBooking = await Booking.create({
      user,
      vehicle,
      services: {
        main: booking.selectedServices,
        additional: booking.additionalServices
      },
      schedule: {
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        alternateDate: booking.alternateDate,
        alternateTime: booking.alternateTime,
        urgency: booking.urgency
      },
      problemDescription: booking.problemDescription,
      specialInstructions: booking.specialInstructions,
      pricing: {
        estimatedTotal,
        finalTotal: estimatedTotal
      },
      contactPreference: booking.contactPreference,
      marketingConsent: booking.marketingConsent
    });

    return res.status(201).json({
      success: true,
      bookingId: newBooking._id,
      estimatedTotal
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
