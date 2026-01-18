import { rooms } from '../services/roomService';
import { Server } from 'socket.io';

const timers = new Map<string, NodeJS.Timeout>();

export const startTimer = (code: string, io: Server) => {
  const room = rooms.get(code);
  if (!room) return;

  if (timers.has(code)) {
    clearInterval(timers.get(code)!);
  }

  const timer = setInterval(() => {
    const room = rooms.get(code);
    if (!room) {
      clearInterval(timer);
      timers.delete(code);
      return;
    }

    const { gameState } = room;

    if (gameState.winner || gameState.draw) {
      clearInterval(timer);
      timers.delete(code);
      return;
    }

    if (gameState.xNext) {
      gameState.p1Time--;
      if (gameState.p1Time <= 0) {
        gameState.p1Time = 0;
        gameState.timeoutWinner = 'X';
        gameState.winner = 'X';
        clearInterval(timer);
        timers.delete(code);
      }
    } 
    else {
      gameState.p2Time--;
      if (gameState.p2Time <= 0) {
        gameState.p2Time = 0;
        gameState.timeoutWinner = 'O';
        gameState.winner = 'O';
        clearInterval(timer);
        timers.delete(code);
      }
    }

    io.to(code).emit('game-update', { gameState });
  }, 1000);

  timers.set(code, timer);
};