"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const socketHandler_1 = require("./socket/socketHandler");
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    transports: ['websocket', 'polling'],
    allowEIO3: true
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', healthRoutes_1.default);
app.use('/', roomRoutes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, '../../tic-tac-toe/build')));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path_1.default.join(__dirname, '../../tic-tac-toe/build/index.html'));
});
(0, socketHandler_1.setupSocket)(io);
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
