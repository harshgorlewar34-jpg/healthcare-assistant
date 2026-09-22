const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[Database] No MONGODB_URI set — activating in-memory data store.');
    await seedMemoryStore();
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] ✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] ⚠️  External MongoDB connection failed: ${err.message}`);
    console.log('[Database] Activating in-memory fallback data store...');
    await seedMemoryStore();
  }
};

const seedMemoryStore = async () => {
  const { seedDatabase } = require('../seeds/seed');
  await seedDatabase();
  console.log('[Database] ✅ In-memory data store ready with sample hospital data!');
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
