const mongoose = require("mongoose");

const ServiceBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSavedVehicleInformation",
      required: true,
    },

    // =====================
    // SERVICE SELECTION
    // =====================
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Emergency Roadside Assistance",
        "Mobile Oil Change",
        "Brake Inspection & Repair",
        "Battery Replacement",
        "Tire Services",
        "Engine Diagnostics",
        "AC System Service",
        "Pre-Purchase Inspection",
        "Preventive Maintenance",
      ],
    },

    basePrice: {
      type: Number,
      required: true, // price at time of booking
    },

    // =====================
    // URGENCY & SCHEDULING
    // =====================
    urgency: {
      type: String,
      enum: ["Emergency", "Urgent", "Normal", "Flexible"],
      required: true,
    },

    preferredDate: {
      type: Date,
      required: true,
    },

    preferredTime: {
      type: String, // "10:00 AM - 12:00 PM"
      required: true,
    },

    alternateDate: {
      type: Date,
    },

    alternateTime: {
      type: String,
    },

    // =====================
    // OPTIONAL SERVICES
    // =====================
    optionalServices: [
      {
        name: {
          type: String,
          enum: [
            "Oil Level Check",
            "Fluid Top-off",
            "Battery Test",
            "Tire Pressure Check",
            "Visual Inspection",
          ],
        },
        price: {
          type: Number,
        },
      },
    ],

    // =====================
    // USER INPUT
    // =====================
    problemDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // =====================
    // PRICING SUMMARY
    // =====================
    rushFee: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // =====================
    // BOOKING STATUS
    // =====================
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Mechanic Assigned",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ServiceBooking = mongoose.model(
  "ServiceBooking",
  ServiceBookingSchema
);

module.exports = ServiceBooking;
