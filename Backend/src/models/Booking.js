const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String
  },

  vehicle: {
    make: String,
    model: String,
    year: Number,
    color: String,
    licensePlate: String,
    mileage: Number
  },

  services: {
    main: [{ type: Number }],
    additional: [{ type: String }]
  },

  schedule: {
    preferredDate: Date,
    preferredTime: String,
    alternateDate: Date,
    alternateTime: String,
    urgency: {
      type: String,
      enum: ["emergency", "urgent", "normal", "flexible"]
    }
  },

  problemDescription: String,
  specialInstructions: String,

  pricing: {
    estimatedTotal: Number,
    finalTotal: Number
  },

  contactPreference: {
    type: String,
    enum: ["phone", "email"]
  },

  marketingConsent: Boolean,

  status: {
    type: String,
    enum: ["pending", "confirmed", "assigned", "completed", "cancelled"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
