"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const roomService_1 = require("../services/roomService");
const gameEvents_1 = require("./gameEvents");
const timerManager_1 = require("../utils/timerManager");
const handlePlayerLeave = (io, socketId, code) => {
    const room = roomService_1.rooms.get(code);
    if (!room)
        return;
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
        roomService_1.rooms.delete(code);
        console.log(`Room ${code} deleted (empty)`);
    }
};
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on('create-room', ({ code, mode }) => {
            if (roomService_1.rooms.has(code)) {
                socket.emit('room-error', { message: 'Room already exists' });
                return;
            }
            const room = (0, roomService_1.createRoom)(code, mode);
            room.players[socket.id] = {
                playerId: socket.id,
                symbol: 'O',
                name: 'Player 1',
            };
            roomService_1.rooms.set(code, room);
            socket.join(code);
            socket.emit('room-created', {
                code,
                symbol: 'O',
                waiting: true,
            });
            console.log(`Room created: ${code} by ${socket.id}`);
        });
        socket.on('join-room', ({ code }) => {
            const room = roomService_1.rooms.get(code);
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
                (0, timerManager_1.startTimer)(code, io);
            }
        });
        socket.on('validate-room', ({ code }) => {
            const room = roomService_1.rooms.get(code);
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
            const room = roomService_1.rooms.get(code);
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
            for (const [code, room] of roomService_1.rooms.entries()) {
                if (room.players[socket.id]) {
                    handlePlayerLeave(io, socket.id, code);
                    break;
                }
            }
        });
        (0, gameEvents_1.registerGameEvents)(io, socket);
    });
};
exports.setupSocket = setupSocket;
