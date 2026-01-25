import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Square from '../components/Square';
import PlayerCard from '../components/PlayerCard';
import StatusBar from '../components/StatusBar';
import EndGameModal from '../components/EndGameModal';
import ConnectionModal from '../components/ConnectionModal';
import { GameLogic } from '../hooks/GameLogic';
import { useSocket } from '../hooks/useSocket';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/GamePageStyles.module.css';

export default function GameBoard() {
  const navigate = useNavigate();
  const { type, mode, roomCode } = useParams<{
    type?: string;
    mode?: string;
    roomCode?: string;
  }>();

  const [showEndModal, setShowEndModal] = useState(false);
  const storedUser = localStorage.getItem('user');
  const localAvatar = storedUser
  ? JSON.parse(storedUser).avatar
  : undefined;

  const isOnline = type === 'online';
  
  const gameMode: 'regular' | 'timed' = mode === 'timed' ? 'timed' : 'regular';

  const localGame = GameLogic(gameMode === 'timed', type === 'local');
  const {
    gameState: onlineState,
    mySymbol,
    isWaiting,
    error,
    rematchRequested,
    playerNames,
    playerAvatars,
    createRoom,
    joinRoom,
    makeMove: socketMove,
    requestRematch,
    rejectRematch,
    leaveRoom
  } = useSocket(isOnline ? roomCode : undefined);

  useEffect(() => {
    if (type !== 'local' && type !== 'online') {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if (mode !== 'regular' && mode !== 'timed') {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if (type === 'online' && !roomCode) {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }
  }, [type, mode, roomCode, navigate]);

  useEffect(() => {
    if (isOnline && roomCode) {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get('action');

      if (!action || (action !== 'create' && action !== 'join')) {
        console.error('Invalid action parameter');
        navigate('/room', { replace: true });
        return;
      }

      if (action === 'create') {
        createRoom(roomCode, gameMode);
      } 
      else {
        joinRoom(roomCode, gameMode);
      }
    }
  }, [isOnline, roomCode, gameMode, createRoom, joinRoom, navigate]);

  useEffect(() => {
    if (!isOnline && (localGame.winner || localGame.draw)) {
      const timer = setTimeout(() => setShowEndModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [localGame.winner, localGame.draw, isOnline]);

  useEffect(() => {
    if (isOnline && onlineState && (onlineState.winner || onlineState.draw)) {
      const timer = setTimeout(() => setShowEndModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, onlineState]);

  const backClick = () => {
    if (isOnline) {
      leaveRoom();
      navigate('/room');
    } else {
      navigate('/mode/local');
    }
  };

  const handleMove = (index: number) => {
    if (isOnline) {
      socketMove(index);
    } else {
      localGame.makeMove(index);
    }
  };

  const handleRematch = () => {
    if (isOnline) {
      requestRematch();
      setShowEndModal(false);
    } 
    else {
      localGame.reset();
      setShowEndModal(false);
    }
  };

  const handleRematchResponse = (accept: boolean) => {
    if (accept) {
      requestRematch();
      setShowEndModal(false);
    } 
    else {
      rejectRematch();
      navigate('/');
    }
  };

  const handleExitGame = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  if (isOnline) {
    leaveRoom();
  }
  if (isLoggedIn) {
    navigate('/main-menu');
  } else {
    navigate('/');
  }
};


  const game = isOnline && onlineState ? {
    squares: onlineState.squares,
    xNext: onlineState.xNext,
    winner: onlineState.winner,
    draw: onlineState.draw,
    timeoutWinner: onlineState.timeoutWinner,
    p1Time: onlineState.p1Time,
    p2Time: onlineState.p2Time,
    winnerLine: null
  } : localGame;

  const canMove = isOnline ? (
    mySymbol !== null && 
    mySymbol === (game.xNext ? 'O' : 'X') && 
    !game.winner && 
    !game.draw
  ) : true;

  useEffect(() => {
    if (isOnline) {
      console.log('Current turn:', game.xNext ? 'O' : 'X');
      console.log('My symbol:', mySymbol);
      console.log('Can I move?', canMove);
    }
  }, [game.xNext, mySymbol, canMove, isOnline]);

  useEffect(() => {
    if (error) {
      console.log('Error state changed:', error);
      console.log('Error modal should be open:', !!error);
    }
  }, [error]);

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button className={shared['back-button']} onClick={backClick}>
          ← Back
        </button>
        <h1 className={shared['page-title']}>Tic-Tac-Toe</h1>
        
        <div className={styles['players']}>
          <PlayerCard
            name={playerNames?.O || 'Player 1'}
            avatar={isOnline? playerAvatars?.O || '/default-avatar.jpg': localAvatar}
            symbol="O"
            isActive={game.xNext}
            timeLeft={gameMode === 'timed' ? game.p1Time : undefined}
          />
          <PlayerCard
            name={playerNames?.X || 'Player 2'}
            avatar={isOnline? playerAvatars?.X || '/default-avatar.jpg': '/default-avatar.jpg'}
            symbol="X"
            isActive={!game.xNext}
            timeLeft={gameMode === 'timed' ? game.p2Time : undefined}
          />
        </div>

        <StatusBar
          winner={game.winner}
          isDraw={game.draw}
          xNext={game.xNext}
          timeoutWinner={game.timeoutWinner}
        />

        <div className={styles['board']}>
          {game.squares.map((v, i) => (
            <Square
              key={i}
              value={v}
              isWinning={game.winnerLine?.includes(i) ?? false}
              onClick={() => canMove && handleMove(i)}
            />
          ))}
        </div>

        {!isOnline && (
          <div className={styles['controls']}>
            <button
              className={
                !localGame.canUndo
                  ? shared['disabled-button']
                  : `${shared['primary-button']} ${styles['undo']}`
              }
              onClick={localGame.undo}
              disabled={!localGame.canUndo}
            >
              Undo
            </button>
            <button
              className={
                !localGame.canRedo
                  ? shared['disabled-button']
                  : `${shared['primary-button']} ${styles['redo']}`
              }
              onClick={localGame.redo}
              disabled={!localGame.canRedo}
            >
              Redo
            </button>
          </div>
        )}

        <EndGameModal
          open={showEndModal && !isWaiting && !rematchRequested}
          title={
            game.draw
              ? "It's a draw!"
              : `${game.winner === 'O' ? 'Player 1' : 'Player 2'} wins!`
          }
          onRematch={handleRematch}
          onExit={handleExitGame}
        />

        <ConnectionModal
          open={isWaiting && !error && !rematchRequested}
          type="waiting"
          message={
            isOnline && roomCode && !showEndModal
              ? `Room Code: ${roomCode}\nWaiting for opponent to join...`
              : 'Waiting for opponent to accept rematch...'
          }
        />

        <ConnectionModal
          open={rematchRequested}
          type="rematch-request"
          onAccept={() => handleRematchResponse(true)}
          onReject={() => handleRematchResponse(false)}
        />

        <ConnectionModal
          open={!!error}
          type="error"
          message={error || undefined}
          onReject={() => {
            if (isOnline) leaveRoom();
            navigate('/');
          }}
        />
      </div>
    </div>
  );
}