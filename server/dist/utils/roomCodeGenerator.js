"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomCode = void 0;
const roomService_1 = require("../services/roomService");
const generateRoomCode = () => {
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
        if (attempts >= maxAttempts) {
            code = Date.now()
                .toString(36)
                .toUpperCase()
                .slice(-6)
                .padStart(6, 'X');
            break;
        }
    } while (roomService_1.rooms.has(code));
    return code;
};
exports.generateRoomCode = generateRoomCode;
