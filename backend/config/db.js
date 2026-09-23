const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medibot';

  try {
    // Attempt standard connection with 1.5-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`[Database] MongoDB connected successfully to: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`[Database] External MongoDB not active (${err.message}).`);
    console.log(`[Database] Initializing Instant In-Memory Medical Database Fallback...`);
    
    // Auto-seed the in-memory store
    const { seedDatabase } = require('../seeds/seed');
    await seedDatabase();
    console.log(`[Database] In-Memory Medical Database ready with sample departments, doctors & patients!`);
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Error disconnecting database:', err);
  }
};

module.exports = { connectDB, disconnectDB };
