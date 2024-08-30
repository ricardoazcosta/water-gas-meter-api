import { Request, Response } from 'express';
import Reading from '../models/Reading';
import geminiClient from '../utils/geminiClient';

export const uploadReading = async (req: Request, res: Response) => {
  const { clientId, measureType, imageBase64 } = req.body;

  // Validar os dados
  if (!clientId || !measureType || !imageBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verificar se já existe uma leitura no mês
  const existingReading = await Reading.findOne({
    clientId,
    measureType,
    date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
  });

  if (existingReading) {
    return res.status(400).json({ error: 'Reading already exists for this month' });
  }

  // Consultar o Gemini API
  try {
    const response = await geminiClient.post('/v1/read', {
      image: imageBase64,
    });

    const { imageUrl, guid, value } = response.data;

    const newReading = new Reading({
      clientId,
      measureType,
      value,
      imageUrl,
      guid,
    });

    await newReading.save();

    res.status(201).json({ imageUrl, guid, value });
  } catch (error) {
    res.status(500).json({ error: 'Error reading the meter' });
  }
};

export const confirmReading = async (req: Request, res: Response) => {
  const { guid, newValue } = req.body;

  // Validar os dados
  if (!guid || newValue === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const reading = await Reading.findOne({ guid });

  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' });
  }

  if (reading.confirmed) {
    return res.status(400).json({ error: 'Reading already confirmed' });
  }

  reading.value = newValue;
  reading.confirmed = true;

  await reading.save();

  res.status(200).json({ message: 'Reading confirmed' });
};

export const listReadings = async (req: Request, res: Response) => {
  const { clientId } = req.query;
  let { measureType } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: 'Client ID is required' });
  }

  const query: any = { clientId };

  if (measureType) {
    measureType = (measureType as string).toUpperCase();
    if (measureType !== 'WATER' && measureType !== 'GAS') {
      return res.status(400).json({ error: 'Invalid measure type' });
    }
    query.measureType = measureType;
  }

  const readings = await Reading.find(query);

  res.status(200).json(readings);
};
