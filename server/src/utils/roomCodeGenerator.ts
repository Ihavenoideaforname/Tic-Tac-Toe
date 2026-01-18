import { rooms } from '../services/roomService';

export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    attempts++;

    if(attempts >= maxAttempts) {
      code = Date.now()
        .toString(36)
        .toUpperCase()
        .slice(-6)
        .padStart(6, 'X');
      break;
    }
  }while (rooms.has(code));

  return code;
};