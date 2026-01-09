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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.HOST_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } 
      else {
        callback(new Error('Origin not allowed'));
      }
    },
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/', roomRoutes);

app.use(express.static(path.join(__dirname, '../../tic-tac-toe/build')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../tic-tac-toe/build/index.html'));
});

setupSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});