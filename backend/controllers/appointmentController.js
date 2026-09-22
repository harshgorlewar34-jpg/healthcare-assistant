const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor')
      .populate('department')
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching appointments' });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, appointmentDate, and timeSlot',
      });
    }

    const doctor = await Doctor.findById(doctorId).populate('department');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Generate token number e.g. #TK-9281
    const tokenNumber = 'TK-' + Math.floor(1000 + Math.random() * 9000);

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      department: doctor.department._id,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason: reason || 'General Health Consultation',
      tokenNumber,
      status: 'scheduled',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('department');

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: populatedAppointment,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
    if (timeSlot) appointment.timeSlot = timeSlot;
    appointment.status = 'rescheduled';
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('department');

    return res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
};
