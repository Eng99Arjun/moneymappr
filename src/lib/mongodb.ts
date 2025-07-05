import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!;

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: any, promise: any } | undefined;
}

let cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // ✅ Reuse existing connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'moneymappr', // replace if you're using a different db name
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


export default connectDB;
