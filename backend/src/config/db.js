const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Override DNS servers to fix local SRV resolution timeouts on Windows
    dns.setServers(['1.1.1.1', '8.8.8.8']);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error Details]:`, error);
    throw error;
  }
};

module.exports = connectDB;
