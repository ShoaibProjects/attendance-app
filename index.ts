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
mongoose.connect(mongoUri).then(() => console.log('MongoDB connected'));

app.use('/zoom', zoomRoutes);

// For local development
if (process.env.NODE_ENV !== 'production') {
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
exports.default = app;