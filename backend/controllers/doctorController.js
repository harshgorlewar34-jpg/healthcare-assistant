const Doctor = require('../models/Doctor');
const Department = require('../models/Department');

const getAllDoctors = async (req, res) => {
  try {
    const { department, specialization, search } = req.query;
    let query = {};

    if (department) {
      // Allow filtering by department ID or department name
      if (department.match(/^[0-9a-fA-F]{24}$/)) {
        query.department = department;
      } else {
        const deptDoc = await Department.findOne({
          name: { $regex: department, $options: 'i' },
        });
        if (deptDoc) {
          query.department = deptDoc._id;
        }
      }
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate('department', 'name code location icon')
      .sort({ rating: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching doctors' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('department');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllDoctors, getDoctorById };
