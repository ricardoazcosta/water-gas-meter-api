import { Router } from 'express';
import { uploadReading, confirmReading, listReadings } from '../controllers/meterControllers';

const router = Router();

router.post('/upload', uploadReading);
router.patch('/confirm', confirmReading);
router.get('/list', listReadings);

export default router;
