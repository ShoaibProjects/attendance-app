import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import zoomRoutes from './zoomHandler';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db';

// --- IMPORTANT CHANGE HERE: Add a .catch() to handle connection errors ---
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('CRITICAL: MongoDB connection error on startup:', err);
    // Do NOT re-throw here for serverless functions, as it would cause the function to crash
    // and prevent it from sending any response.
    // However, if the connection is truly critical for *all* operations,
    // you might want to consider a different pattern (like connection reuse).
    // For now, logging the error and letting the app *try* to run is better than crashing.
  });

app.use('/zoom', zoomRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
exports.default = app;