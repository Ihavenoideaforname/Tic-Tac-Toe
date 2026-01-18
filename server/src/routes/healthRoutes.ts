import { Router } from 'express';
import { rooms } from '../services/roomService';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size });
});

export default router;