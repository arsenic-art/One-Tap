const mongoose = require("mongoose");

const UserSavedVehicleInformationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["Car", "Bike", "Truck", "Bus"],
      trim: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },

    modelYear: {
      type: Number,
      required: true,
      min: 1886, 
      max: new Date().getFullYear() + 1,
    },

    vehicleColor: {
      type: String,
      trim: true,
    },

    licensePlate: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
      match: [
        /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{4}$/,
        "Please use a valid Indian license plate format",
      ],
    },

    currentMileage: {
      type: Number,
      min: 0,
      max: 1000000,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSavedVehicleInformationSchema.index(
  { userId: 1, isPrimary: 1 },
  { unique: true, partialFilterExpression: { isPrimary: true } }
);

UserSavedVehicleInformationSchema.index(
  { userId: 1, licensePlate: 1 },
  { unique: true }
);

const UserSavedVehicleInformation = mongoose.model(
  "UserSavedVehicleInformation",
  UserSavedVehicleInformationSchema
);

module.exports = UserSavedVehicleInformation;
