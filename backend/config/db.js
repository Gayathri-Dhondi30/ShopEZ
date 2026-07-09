const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    console.log('Attempting to connect to MongoDB URI...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000 // 4 seconds connection timeout limit
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary database connection failed: ${error.message}`);
    console.log('Starting local in-memory MongoDB database fallback service...');
    try {
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Failed to start In-Memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
