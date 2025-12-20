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
      required: true,
    },

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
      type: String, 
      required: true,
    },

    alternateDate: {
      type: Date,
    },

    alternateTime: {
      type: String,
    },

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

    problemDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    rushFee: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

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
