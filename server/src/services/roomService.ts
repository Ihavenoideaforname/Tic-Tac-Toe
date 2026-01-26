import { Room } from '../types';

export const rooms = new Map<string, Room>();

export const createRoom = (
  code: string,
  mode: 'regular' | 'timed'
): Room => ({
  code,
  players: {},
  gameState: {
    squares: Array(9).fill(null),
    xNext: true,
    p1Time: 30,
    p2Time: 30,
    winner: null,
    draw: false,
    timeoutWinner: null,
    winnerLine: null,
  },
  mode,
  rematchRequests: new Set(),
});