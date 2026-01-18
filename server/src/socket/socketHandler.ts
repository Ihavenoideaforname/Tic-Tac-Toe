import { Server, Socket } from 'socket.io';
import { rooms, createRoom } from '../services/roomService';
import { registerGameEvents } from './gameEvents';
import { startTimer } from '../utils/timerManager';

const handlePlayerLeave = (io: Server, socketId: string, code: string) => {
  const room = rooms.get(code);
  if (!room) return;

  const wasInRoom = room.players[socketId] !== undefined;
  
  if (wasInRoom) {
    delete room.players[socketId];
    
    const remainingPlayers = Object.keys(room.players).length;
    if (remainingPlayers > 0) {
      io.to(code).emit('player-left');
      console.log(`Player left room ${code}. ${remainingPlayers} player(s) remaining.`);
    }
  }

  if (Object.keys(room.players).length === 0) {
    rooms.delete(code);
    console.log(`Room ${code} deleted (empty)`);
  }
};

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
      
      console.log(`Room created: ${code} by ${socket.id}`);
    });

    socket.on('join-room', ({ code }) => {
      const room = rooms.get(code);
      
      if (!room) {
        socket.emit('room-error', { message: 'Room does not exist' });
        return;
      }

      const playerCount = Object.keys(room.players).length;
      if (playerCount >= 2) {
        socket.emit('room-error', { message: 'Room is full' });
        return;
      }

      if (room.players[socket.id]) {
        socket.emit('room-error', { message: 'You are already in this room' });
        return;
      }

      room.players[socket.id] = {
        playerId: socket.id,
        symbol: 'X',
        name: 'Player 2',
      };

      socket.join(code);
      
      console.log(`Player joined room: ${code} - ${socket.id} as X`);

      io.to(code).emit('game-start', {
        gameState: room.gameState,
        players: room.players,
        mode: room.mode,
      });

      if (room.mode === 'timed') {
        startTimer(code, io);
      }
    });

    socket.on('validate-room', ({ code }) => {
      const room = rooms.get(code);
      
      if (!room) {
        socket.emit('room-error', { message: 'Room does not exist' });
        return;
      }

      const playerCount = Object.keys(room.players).length;
      if (playerCount >= 2) {
        socket.emit('room-error', { message: 'Room is full' });
        return;
      }

      socket.emit('room-valid', { code });
    });

    socket.on('get-room-info', ({ code }) => {
      const room = rooms.get(code);
      
      if (!room) {
        socket.emit('room-error', { message: 'Room does not exist' });
        return;
      }

      const playerCount = Object.keys(room.players).length;
      if (playerCount >= 2) {
        socket.emit('room-error', { message: 'Room is full' });
        return;
      }

      socket.emit('room-info', { mode: room.mode });
    });

    socket.on('leave-room', ({ code }) => {
      handlePlayerLeave(io, socket.id, code);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      for (const [code, room] of rooms.entries()) {
        if (room.players[socket.id]) {
          handlePlayerLeave(io, socket.id, code);
          break;
        }
      }
    });

    registerGameEvents(io, socket);
  });
};