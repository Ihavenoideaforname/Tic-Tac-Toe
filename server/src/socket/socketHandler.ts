import { Server } from 'socket.io';
import { rooms, createRoom } from '../services/roomService';
import { registerGameEvents } from './gameEvents';
import { startTimer } from '../utils/timerManager';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('create-room', ({ code, mode }) => {
      if (rooms.has(code)) {
        socket.emit('room-error', { message: 'Room already exists' });
        return;
      }

      const room = createRoom(code, mode);
      room.players[socket.id] = {
        playerId: socket.id,
        symbol: 'O',
        name: 'Player 1',
      };

      rooms.set(code, room);
      socket.join(code);

      socket.emit('room-created', {
        code,
        symbol: 'O',
        waiting: true,
      });
    });

    socket.on('join-room', ({ code }) => {
      const room = rooms.get(code);
      if (!room) return;

      room.players[socket.id] = {
        playerId: socket.id,
        symbol: 'X',
        name: 'Player 2',
      };

      socket.join(code);

      io.to(code).emit('game-start', {
        gameState: room.gameState,
        players: room.players,
        mode: room.mode,
      });

      if (room.mode === 'timed') {
        startTimer(code, io);
      }
    });

    registerGameEvents(io, socket);
  });
};