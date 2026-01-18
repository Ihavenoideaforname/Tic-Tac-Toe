"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomCodeGenerator_1 = require("../utils/roomCodeGenerator");
const router = (0, express_1.Router)();
router.get('/generate-room-code', (req, res) => {
    const code = (0, roomCodeGenerator_1.generateRoomCode)();
    res.json({ code });
});
exports.default = router;
