import { Server, Socket } from 'socket.io';
import User from '../models/User';
import { rooms } from '../services/roomService';
import { checkWinner } from '../services/gameService';
import { startTimer } from '../utils/timerManager';

export const registerGameEvents = (io: Server, socket: Socket) => {
  socket.on('make-move', async ({ code, index }) => {
    const room = rooms.get(code);
    if (!room) return;

    const player = room.players[socket.id];
    if (!player) return;

    const { gameState } = room;
    const currentPlayer = gameState.xNext ? 'O' : 'X';

    if (player.symbol !== currentPlayer) return;
    if (gameState.squares[index]) return;
    if (gameState.winner || gameState.draw) return;

    gameState.squares[index] = currentPlayer;
    gameState.xNext = !gameState.xNext;

    const winnerLine = checkWinner(gameState.squares);
    if (winnerLine) {
  gameState.winner = gameState.squares[winnerLine[0]];
  gameState.winnerLine = winnerLine;

  const winnerSymbol = gameState.winner;

  for (const playerId in room.players) {
    const p = room.players[playerId];
    if (!p.userId) continue;

    if (p.symbol === winnerSymbol) {
      await User.findByIdAndUpdate(p.userId, { $inc: { wins: 1 } });
    } else {
      await User.findByIdAndUpdate(p.userId, { $inc: { losses: 1 } });
    }
  }
}
else if (gameState.squares.every(Boolean)) {
  gameState.draw = true;

  for (const playerId in room.players) {
    const p = room.players[playerId];
    if (!p.userId) continue;

    await User.findByIdAndUpdate(p.userId, { $inc: { draws: 1 } });
  }
}


    io.to(code).emit('game-update', { gameState });
  });

  socket.on('request-rematch', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;

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
        winnerLine: null,
      };

      room.rematchRequests.clear();
      io.to(code).emit('rematch-accepted', { gameState: room.gameState });

      if (room.mode === 'timed') {
        startTimer(code, io);
      }
    }
  });

  socket.on('reject-rematch', ({ code }) => {
    socket.to(code).emit('rematch-rejected');
  });
};