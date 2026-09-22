const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const ChatHistory = require('../models/ChatHistory');

const departmentsData = [
  {
    name: 'Cardiology',
    code: 'CARD',
    description: 'Comprehensive cardiac care, interventional cardiology, heart failure clinic, and advanced electrophysiology.',
    headOfDepartment: 'Dr. Robert Chen, MD, FACC',
    location: 'Block A, 3rd Floor',
    contactPhone: '+1 (800) 555-0111',
    icon: 'Heart',
    commonConditions: ['Hypertension', 'Coronary Artery Disease', 'Arrhythmia', 'Heart Murmur'],
  },
  {
    name: 'Neurology',
    code: 'NEUR',
    description: 'Diagnosis and surgical/medical management of brain, spine, and central nervous system disorders.',
    headOfDepartment: 'Dr. Elena Rostova, MD, PhD',
    location: 'Block B, 4th Floor',
    contactPhone: '+1 (800) 555-0112',
    icon: 'Brain',
    commonConditions: ['Migraine', 'Epilepsy', 'Parkinsonism', 'Stroke Rehabilitation'],
  },
  {
    name: 'Pediatrics',
    code: 'PED',
    description: 'Child wellness, pediatric emergency care, neonatal intensive care, and immunization programs.',
    headOfDepartment: 'Dr. Marcus Vance, MD, FAAP',
    location: 'Children’s Pavilion, 2nd Floor',
    contactPhone: '+1 (800) 555-0113',
    icon: 'Baby',
    commonConditions: ['Childhood Asthma', 'Vaccinations', 'Growth Disorders', 'Viral Fevers'],
  },
  {
    name: 'Orthopedics & Joint Care',
    code: 'ORTH',
    description: 'Minimally invasive arthroscopy, sports injury rehabilitation, joint replacement, and fracture care.',
    headOfDepartment: 'Dr. Sarah Jenkins, MS (Ortho)',
    location: 'Block A, 1st Floor',
    contactPhone: '+1 (800) 555-0114',
    icon: 'Bone',
    commonConditions: ['Osteoarthritis', 'ACL Tears', 'Spinal Disc Herniation', 'Fractures'],
  },
  {
    name: 'Oncology',
    code: 'ONCO',
    description: 'Targeted medical oncology, chemotherapy suites, surgical tumor resections, and radiation therapy.',
    headOfDepartment: 'Dr. Arvind Patel, MD, DM',
    location: 'Cancer Care Wing, 5th Floor',
    contactPhone: '+1 (800) 555-0115',
    icon: 'ShieldAlert',
    commonConditions: ['Breast Cancer Screening', 'Leukemia', 'Lung Cancer', 'Chemo Follow-up'],
  },
  {
    name: 'Dermatology & Skin Health',
    code: 'DERM',
    description: 'Clinical dermatology, pediatric skin care, cosmetic dermatology, and allergic skin patch testing.',
    headOfDepartment: 'Dr. Chloe Mitchell, MD (Derm)',
    location: 'Outpatient Plaza, Level 2',
    contactPhone: '+1 (800) 555-0116',
    icon: 'Sparkles',
    commonConditions: ['Eczema', 'Psoriasis', 'Acne Vulgaris', 'Allergic Dermatitis'],
  },
  {
    name: 'General Medicine',
    code: 'GENM',
    description: 'Primary care, adult preventive health, chronic disease management, and internal medicine consults.',
    headOfDepartment: 'Dr. David Kim, MD, FACP',
    location: 'Main OPD Block, Level 1',
    contactPhone: '+1 (800) 555-0117',
    icon: 'Stethoscope',
    commonConditions: ['Diabetes Mellitus', 'Seasonal Flu', 'Metabolic Syndrome', 'Fatigue'],
  },
  {
    name: 'Radiology & Diagnostic Imaging',
    code: 'RAD',
    description: '3T MRI, 128-slice CT scans, ultrasound 4D, digital mammography, and interventional radiography.',
    headOfDepartment: 'Dr. Patricia Hayes, MD, FACR',
    location: 'Basement Level 1, Diagnostic Wing',
    contactPhone: '+1 (800) 555-0118',
    icon: 'Scan',
    commonConditions: ['MRI Brain/Spine', 'CT Chest/Abdomen', 'Ultrasound Doppler', 'Digital X-Rays'],
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      ChatHistory.deleteMany({}),
    ]);

    console.log('[Seed] Seeding departments...');
    const insertedDepts = await Department.insertMany(departmentsData);
    const deptMap = {};
    insertedDepts.forEach((d) => {
      deptMap[d.code] = d._id;
    });

    console.log('[Seed] Seeding doctors...');
    const doctorsData = [
      {
        name: 'Robert Chen',
        specialization: 'Senior Interventional Cardiologist',
        department: deptMap['CARD'],
        qualification: 'MD, DM (Cardiology), FACC',
        experienceYears: 18,
        consultationFee: 120,
        opdTimings: '09:00 AM - 01:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        roomNumber: 'OPD Room 301',
        rating: 4.9,
        reviewCount: 340,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
        bio: 'Leading cardiologist with over 3,000 successful coronary interventions and heart valve procedures.',
      },
      {
        name: 'Aisha Al-Mansoor',
        specialization: 'Non-Invasive Cardiologist & Echo Specialist',
        department: deptMap['CARD'],
        qualification: 'MBBS, MD (Medicine), Fellowship in Echocardiography',
        experienceYears: 11,
        consultationFee: 95,
        opdTimings: '02:00 PM - 06:00 PM',
        availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
        roomNumber: 'OPD Room 303',
        rating: 4.8,
        reviewCount: 195,
        avatar: 'https://images.unsplash.com/photo-1594824813583-a9d7eb098e94?w=300&auto=format&fit=crop&q=80',
        bio: 'Expert in stress echocardiography, cardiac MRI interpretation, and preventive cardiology.',
      },
      {
        name: 'Elena Rostova',
        specialization: 'Consultant Neurologist',
        department: deptMap['NEUR'],
        qualification: 'MD, PhD (Neurosciences), FAAN',
        experienceYears: 15,
        consultationFee: 130,
        opdTimings: '10:00 AM - 02:00 PM',
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
        roomNumber: 'OPD Room 402',
        rating: 4.9,
        reviewCount: 280,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
        bio: 'Renowned for stroke management protocols, intractable migraine solutions, and neuromuscular disease care.',
      },
      {
        name: 'Marcus Vance',
        specialization: 'Pediatrician & Neonatologist',
        department: deptMap['PED'],
        qualification: 'MD (Pediatrics), FAAP',
        experienceYears: 14,
        consultationFee: 85,
        opdTimings: '08:30 AM - 01:30 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        roomNumber: 'OPD Room 204 (Children Wing)',
        rating: 4.9,
        reviewCount: 410,
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
        bio: 'Gentle, empathetic pediatrician beloved by families for child developmental milestones and adolescent medicine.',
      },
      {
        name: 'Sarah Jenkins',
        specialization: 'Orthopedic Surgeon & Sports Medicine',
        department: deptMap['ORTH'],
        qualification: 'MS (Ortho), MCh, Fellowship in Arthroscopy',
        experienceYears: 16,
        consultationFee: 110,
        opdTimings: '11:00 AM - 04:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        roomNumber: 'OPD Room 112',
        rating: 4.8,
        reviewCount: 220,
        avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop&q=80',
        bio: 'Specialist in robotic-assisted knee replacements, rotator cuff repair, and elite athletic injury recovery.',
      },
      {
        name: 'Arvind Patel',
        specialization: 'Medical Oncologist & Hematologist',
        department: deptMap['ONCO'],
        qualification: 'MD (Internal Med), DM (Medical Oncology), ESMO Certified',
        experienceYears: 20,
        consultationFee: 150,
        opdTimings: '10:00 AM - 03:00 PM',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        roomNumber: 'Cancer Care Suite 501',
        rating: 5.0,
        reviewCount: 310,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
        bio: 'Pioneer in precision immunotherapy and genomic tumor profiling with compassionate patient-centric guidance.',
      },
      {
        name: 'Chloe Mitchell',
        specialization: 'Consultant Dermatologist & Dermatosurgeon',
        department: deptMap['DERM'],
        qualification: 'MD, DVD, Fellowship in Lasers & Aesthetic Med',
        experienceYears: 9,
        consultationFee: 90,
        opdTimings: '01:00 PM - 06:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        roomNumber: 'Skin Care Suite 210',
        rating: 4.7,
        reviewCount: 165,
        avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&auto=format&fit=crop&q=80',
        bio: 'Specializing in chronic inflammatory skin conditions, mole mapping, and advanced laser treatments.',
      },
      {
        name: 'David Kim',
        specialization: 'Consultant Internal Medicine & Geriatrician',
        department: deptMap['GENM'],
        qualification: 'MD (General Medicine), FACP',
        experienceYears: 17,
        consultationFee: 75,
        opdTimings: '08:00 AM - 01:00 PM, 04:00 PM - 07:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        roomNumber: 'OPD Room 102',
        rating: 4.9,
        reviewCount: 520,
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
        bio: 'Comprehensive diagnostic acumen for multi-system conditions, hypertension, diabetes control, and elderly care.',
      },
    ];

    const insertedDoctors = await Doctor.insertMany(doctorsData);

    console.log('[Seed] Seeding sample demo patients...');
    const patientJohn = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1 (555) 234-5678',
      age: 42,
      gender: 'male',
      medicalRecordNumber: 'MED-1001',
      role: 'patient',
    });

    const patientSarah = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'password123',
      phone: '+1 (555) 987-6543',
      age: 36,
      gender: 'female',
      medicalRecordNumber: 'MED-1002',
      role: 'patient',
    });

    console.log('[Seed] Seeding sample appointments...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(10, 30, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 6);
    nextWeek.setHours(14, 0, 0, 0);

    await Appointment.create([
      {
        patient: patientJohn._id,
        doctor: insertedDoctors[0]._id, // Dr. Robert Chen
        department: deptMap['CARD'],
        appointmentDate: tomorrow,
        timeSlot: '10:30 AM',
        status: 'scheduled',
        reason: 'Routine Annual Cardiac Checkup & ECG review',
        tokenNumber: 'TK-5021',
      },
      {
        patient: patientJohn._id,
        doctor: insertedDoctors[7]._id, // Dr. David Kim
        department: deptMap['GENM'],
        appointmentDate: nextWeek,
        timeSlot: '09:00 AM',
        status: 'scheduled',
        reason: 'Fasting Blood Sugar & Blood Pressure consultation',
        tokenNumber: 'TK-5022',
      },
    ]);

    console.log('[Seed] Database successfully populated!');
    console.log('   Demo Login: john@example.com / password123 (MRN: MED-1001)');
    console.log('   Demo Login: sarah@example.com / password123 (MRN: MED-1002)');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    throw err;
  }
};

// If run directly from terminal
if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  connectDB().then(async () => {
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  });
}

module.exports = { seedDatabase };
