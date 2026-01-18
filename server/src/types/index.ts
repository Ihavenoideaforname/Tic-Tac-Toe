export type Player = 'O' | 'X' | null;

export interface Room {
  code: string;
  players: {
    [socketId: string]: {
      playerId: string;
      symbol: Player;
      name: string;
    };
  };
  gameState: {
    squares: Player[];
    xNext: boolean;
    p1Time: number;
    p2Time: number;
    winner: Player;
    draw: boolean;
    timeoutWinner: Player;
  };
  mode: 'regular' | 'timed';
  rematchRequests: Set<string>;
}