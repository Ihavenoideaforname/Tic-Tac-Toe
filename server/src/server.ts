import express from 'express';
import { createServer } from 'http';
import path from "path";
import cors from 'cors';
import { Server } from 'socket.io';

import { setupSocket } from './socket/socketHandler';
import roomRoutes from './routes/roomRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/', roomRoutes);

app.use(express.static(path.join(__dirname, '../../tic-tac-toe/build')));

app.get('*', (req, res) => {
  if(req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '../../tic-tac-toe/build/index.html'));
});

setupSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});