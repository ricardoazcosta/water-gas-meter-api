import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import meterRoutes from './routes/meterRoutes';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!);

app.use('/api/meters', meterRoutes);

export default app;
