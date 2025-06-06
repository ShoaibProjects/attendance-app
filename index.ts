import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import zoomRoutes from './zoomHandler';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import attendanceRoutes from './routes/attendanceRoutes';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db';

let isConnected = false; // Prevent multiple connections

const connectToMongo = async () => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  const start = Date.now();
  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`MongoDB connected in ${Date.now() - start} ms`);
  } catch (err) {
    console.error('CRITICAL: MongoDB connection error on startup:', err);
    // Don't throw – allow the app to start (important for serverless)
  }
};

// Immediately connect
connectToMongo();

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/zoom', zoomRoutes);

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel / serverless
export default app;
