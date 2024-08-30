import { Schema, model } from 'mongoose';

interface IReading {
  clientId: string;
  measureType: 'WATER' | 'GAS';
  value: number;
  date: Date;
  confirmed: boolean;
  imageUrl: string;
  guid: string;
}

const readingSchema = new Schema<IReading>({
  clientId: { type: String, required: true },
  measureType: { type: String, enum: ['WATER', 'GAS'], required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  confirmed: { type: Boolean, default: false },
  imageUrl: { type: String, required: true },
  guid: { type: String, required: true },
});

export default model<IReading>('Reading', readingSchema);
