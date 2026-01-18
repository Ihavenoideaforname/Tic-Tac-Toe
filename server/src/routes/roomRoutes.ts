import { Router } from 'express';
import { generateRoomCode } from '../utils/roomCodeGenerator';

const router = Router();

router.get('/generate-room-code', (req, res) => {
  const code = generateRoomCode();
  res.json({ code });
});

export default router;