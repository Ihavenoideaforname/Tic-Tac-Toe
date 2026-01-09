"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGameEvents = void 0;
const roomService_1 = require("../services/roomService");
const gameService_1 = require("../services/gameService");
const timerManager_1 = require("../utils/timerManager");
const registerGameEvents = (io, socket) => {
    socket.on('make-move', ({ code, index }) => {
        const room = roomService_1.rooms.get(code);
        if (!room)
            return;
        const player = room.players[socket.id];
        if (!player)
            return;
        const { gameState } = room;
        const currentPlayer = gameState.xNext ? 'O' : 'X';
        if (player.symbol !== currentPlayer)
            return;
        if (gameState.squares[index])
            return;
        if (gameState.winner || gameState.draw)
            return;
        gameState.squares[index] = currentPlayer;
        gameState.xNext = !gameState.xNext;
        const winnerLine = (0, gameService_1.checkWinner)(gameState.squares);
        if (winnerLine) {
            gameState.winner = gameState.squares[winnerLine[0]];
        }
        else if (gameState.squares.every(Boolean)) {
            gameState.draw = true;
        }
        io.to(code).emit('game-update', { gameState });
    });
    socket.on('request-rematch', ({ code }) => {
        const room = roomService_1.rooms.get(code);
        if (!room)
            return;
        room.rematchRequests.add(socket.id);
        socket.to(code).emit('rematch-requested');
        if (room.rematchRequests.size === 2) {
            room.gameState = {
                squares: Array(9).fill(null),
                xNext: true,
                p1Time: 30,
                p2Time: 30,
                winner: null,
                draw: false,
                timeoutWinner: null,
            };
            room.rematchRequests.clear();
            io.to(code).emit('rematch-accepted', { gameState: room.gameState });
            if (room.mode === 'timed') {
                (0, timerManager_1.startTimer)(code, io);
            }
        }
    });
    socket.on('reject-rematch', ({ code }) => {
        socket.to(code).emit('rematch-rejected');
    });
};
exports.registerGameEvents = registerGameEvents;
