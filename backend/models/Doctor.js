const mongoose = require('mongoose');
const { createModelProxy } = require('./modelProxy');
const { memoryDoctors } = require('../config/memoryStore');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    opdTimings: {
      type: String,
      default: '09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM',
    },
    availableDays: [
      {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    ],
    roomNumber: {
      type: String,
      default: 'OPD Room 101',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 120,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    isAvailableToday: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseDoctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
module.exports = createModelProxy('Doctor', MongooseDoctor, memoryDoctors);
