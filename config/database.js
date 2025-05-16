const mongoose = require('mongoose');
require('dotenv').config();

// Use MongoDB Atlas connection string from environment variables or default to the provided one
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://darshilaggarwal55:abcdefgh@cluster0.tfvjenr.mongodb.net/quicknote?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 