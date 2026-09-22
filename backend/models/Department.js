const mongoose = require('mongoose');
const { createModelProxy } = require('./modelProxy');
const { memoryDepartments } = require('../config/memoryStore');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    headOfDepartment: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Main Block, Level 1',
    },
    contactPhone: {
      type: String,
      default: '+1 (800) 555-0199',
    },
    icon: {
      type: String,
      default: 'Activity',
    },
    commonConditions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MongooseDept = mongoose.models.Department || mongoose.model('Department', departmentSchema);
module.exports = createModelProxy('Department', MongooseDept, memoryDepartments);
