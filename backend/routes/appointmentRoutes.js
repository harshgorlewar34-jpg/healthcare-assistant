const express = require('express');
const router = express.Router();
const {
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// All appointment management routes require authentication
router.use(protect);

router.get('/', getMyAppointments);
router.post('/', bookAppointment);
router.delete('/:id', cancelAppointment);
router.patch('/:id/reschedule', rescheduleAppointment);

module.exports = router;
