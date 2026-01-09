"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = exports.rooms = void 0;
exports.rooms = new Map();
const createRoom = (code, mode) => ({
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
    },
    mode,
    rematchRequests: new Set(),
});
exports.createRoom = createRoom;
