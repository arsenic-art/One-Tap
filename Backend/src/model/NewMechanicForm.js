const mongoose = require('mongoose');

const mechanicApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Please fill a valid phone number']
  },
  location: {
    type: String,
    required: [true, 'Location/City is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters long']
  },
  experience: {
    type: String,
    required: [true, 'Years of experience is required'],
    enum: {
      values: ['0-1', '1-2', '3-5', '6-10', '10+'],
      message: 'Invalid experience level selected'
    }
  },
  specialization: {
    type: [String],
    required: [true, 'At least one specialization is required'],
    enum: {
      values: [
        'Engine Repair',
        'Brake Systems',
        'Suspension & Steering',
        'Electrical Systems',
        'HVAC',
        'Transmission',
        'Tire Services',
        'Diagnostic Services',
        'Oil Change & Fluids',
        'Exhaust Systems'
      ],
      message: 'Invalid specialization selected'
    }
  },
  certifications: {
    type: String,
    trim: true,
    default: ''
  },
  workingHours: {
    type: String,
    enum: {
      values: ['morning', 'afternoon', 'evening', 'flexible', ''],
      message: 'Invalid working hours selected'
    },
    default: ''
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    required: [true, 'Professional bio is required'],
    trim: true,
    minlength: [50, 'Bio must be at least 50 characters long'],
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  previousWork: {
    type: String,
    trim: true,
    default: ''
  },
  references: {
    type: String,
    trim: true,
    default: ''
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const MechanicApplication = mongoose.model('MechanicApplication', mechanicApplicationSchema);

module.exports = MechanicApplication;
