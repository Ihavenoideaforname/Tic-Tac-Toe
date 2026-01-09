"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomService_1 = require("../services/roomService");
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({ status: 'ok', rooms: roomService_1.rooms.size });
});
exports.default = router;
