import { useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';

type Player = 'O' | 'X' | null;

interface GameState {
  squares: Player[];
  xNext: boolean;
  p1Time: number;
  p2Time: number;
  winner: Player;
  draw: boolean;
  timeoutWinner: Player;
}

type GameMode = 'regular' | 'timed';
type SocketType = ReturnType<typeof io>;

interface UseSocketReturn {
  socket: SocketType | null;
  gameState: GameState | null;
  mySymbol: Player;
  isConnected: boolean;
  isWaiting: boolean;
  error: string | null;
  rematchRequested: boolean;
  createRoom: (code: string, mode: GameMode) => void;
  joinRoom: (code: string, mode: GameMode) => void;
  makeMove: (index: number) => void;
  requestRematch: () => void;
  rejectRematch: () => void;
  leaveRoom: () => void;
}

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const useSocket = (roomCode: string | undefined): UseSocketReturn => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mySymbol, setMySymbol] = useState<Player>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  
  const gameActiveRef = useRef(false);
  const isWaitingRef = useRef(false);

  useEffect(() => {
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  useEffect(() => {
    isWaitingRef.current = isWaiting;
  }, [isWaiting]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('room-created', ({ symbol, waiting }: { symbol: Player; waiting: boolean }) => {
      setMySymbol(symbol);
      setIsWaiting(waiting);
    });

    newSocket.on('game-start', ({ gameState, players }: { gameState: GameState; players: any }) => {
      setGameState(gameState);
      setIsWaiting(false);
      setGameActive(true);
      
      console.log('Game started! Players:', players);
      console.log('My socket ID:', newSocket.id);
      
      const myPlayer = players[newSocket.id];
      if (myPlayer) {
        console.log('I am playing as:', myPlayer.symbol);
        setMySymbol(myPlayer.symbol as Player);
      } else {
        console.error('Could not find my player data!');
      }
    });

    newSocket.on('game-update', ({ gameState }: { gameState: GameState }) => {
      setGameState(gameState);
    });

    newSocket.on('room-error', ({ message }: { message: string }) => {
      setError(message);
      setIsWaiting(false);
    });

    newSocket.on('player-left', () => {
      console.log('player-left event received');
      console.log('gameActive:', gameActiveRef.current);
      console.log('isWaiting:', isWaitingRef.current);
      
      if(gameActiveRef.current || isWaitingRef.current) {
        console.log('Setting error: Opponent left the game');
        setError('Opponent left the game');
        setGameActive(false);
        setIsWaiting(false);
        setRematchRequested(false);
      } 
      else {
        console.log('Game not active and not waiting, ignoring player-left');
      }
    });

    newSocket.on('rematch-requested', () => {
      console.log('Rematch requested by opponent');
      setRematchRequested(true);
    });

    newSocket.on('rematch-accepted', ({ gameState }: { gameState: GameState }) => {
      console.log('Rematch accepted! Starting new game');
      setGameState(gameState);
      setRematchRequested(false);
      setIsWaiting(false);
      setGameActive(true);
    });

    newSocket.on('rematch-rejected', () => {
      setError('Opponent rejected rematch');
      setRematchRequested(false);
      setIsWaiting(false);
      setGameActive(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = useCallback((code: string, mode: GameMode) => {
    if (socket) {
      socket.emit('create-room', { code, mode });
      setIsWaiting(true);
      setError(null);
    }
  }, [socket]);

  const joinRoom = useCallback((code: string, mode: GameMode) => {
    if (socket) {
      socket.emit('join-room', { code, mode });
      setError(null);
    }
  }, [socket]);

  const makeMove = useCallback((index: number) => {
    if (socket && roomCode) {
      socket.emit('make-move', { code: roomCode, index });
    }
  }, [socket, roomCode]);

  const requestRematch = useCallback(() => {
    if (socket && roomCode) {
      socket.emit('request-rematch', { code: roomCode });
      setIsWaiting(true);
    }
  }, [socket, roomCode]);

  const rejectRematch = useCallback(() => {
    if (socket && roomCode) {
      socket.emit('reject-rematch', { code: roomCode });
    }
  }, [socket, roomCode]);

  const leaveRoom = useCallback(() => {
    if (socket && roomCode) {
      socket.emit('leave-room', { code: roomCode });
    }
  }, [socket, roomCode]);

  return {
    socket,
    gameState,
    mySymbol,
    isConnected,
    isWaiting,
    error,
    rematchRequested,
    createRoom,
    joinRoom,
    makeMove,
    requestRematch,
    rejectRematch,
    leaveRoom
  };
};