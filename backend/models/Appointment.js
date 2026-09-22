const mongoose = require('mongoose');
const { createModelProxy } = require('./modelProxy');
const { memoryAppointments } = require('../config/memoryStore');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
    reason: {
      type: String,
      default: 'General Consultation',
    },
    tokenNumber: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseAppointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
module.exports = createModelProxy('Appointment', MongooseAppointment, memoryAppointments);
