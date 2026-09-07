const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ravindu_portfolio';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`[DB] Connection failed: ${err.message}`);
    console.error('[DB] API routes will keep running in degraded mode (frontend falls back to embedded data).');
  }
}

mongoose.connection.on('disconnected', () => console.warn('[DB] MongoDB disconnected'));

module.exports = connectDB;
