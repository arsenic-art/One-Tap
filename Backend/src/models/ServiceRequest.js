const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },

    problemType: {
      type: String,
      enum: ["Bike", "Car", "Both"],
      required: true,
    },

    serviceType: {
      type: String,
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
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in-progress",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },

    userLocation: {
      address: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    estimatedAmount: {
      type: Number,
      min: 0,
    },

    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

serviceRequestSchema.index({ userId: 1, mechanicId: 1 });
serviceRequestSchema.index({ mechanicId: 1, status: 1 });
serviceRequestSchema.index({ userId: 1, status: 1 });
module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
