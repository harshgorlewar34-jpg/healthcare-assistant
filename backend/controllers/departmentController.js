const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    
    // Attach doctor count to each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const doctorCount = await Doctor.countDocuments({ department: dept._id });
        return {
          ...dept.toObject(),
          doctorCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: departmentsWithCounts.length,
      data: departmentsWithCounts,
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching departments' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    const doctors = await Doctor.find({ department: department._id });
    return res.status(200).json({
      success: true,
      data: {
        ...department.toObject(),
        doctors,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllDepartments, getDepartmentById };
