const mongoose = require('mongoose');

const mechanicApplicationSchema = new mongoose.Schema(
  {
    mechanicID : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mechanic',
      required: true,
      unique: true,
    },
    fullStoreName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'],
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    experienceYears: {
      type: Number,
      required: true,
      min: 0,
      max: 60,
    },

    vehicleSpecialization: {
      type: String,
      enum: ['Bike', 'Car', 'Both'],
      required: true,
    },

    


    servicesProvided: [
      {
        type: String,
        enum: [
          'Emergency Roadside Assistance',
          'Mobile Oil Change',
          'Brake Inspection & Repair',
          'Battery Replacement',
          'Tire Services',
          'Engine Diagnostics',
          'AC System Service',
          'Pre-Purchase Inspection',
          'Preventive Maintenance',
        ],
      },
    ],

    certifications: {
      type: String,
      trim: true,
    },

    availability: {
      workingDays: {
        type: [String], // ["Mon", "Tue"]
      },
      workingHours: {
        start: String, // "09:00"
        end: String,   // "18:00"
      },
      emergencyAvailable: {
        type: Boolean,
        default: false,
      },
    },

    bio: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending',
    },

    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MechanicApplication = mongoose.model(
  'MechanicApplication',
  mechanicApplicationSchema
);

module.exports = MechanicApplication;
