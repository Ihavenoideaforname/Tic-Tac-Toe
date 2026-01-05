import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Square from '../components/Square';
import PlayerCard from '../components/PlayerCard';
import StatusBar from '../components/StatusBar';
import EndGameModal from '../components/EndGameModal';
import { GameLogic } from '../hooks/GameLogic';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/GamePageStyles.module.css';

export default function GameBoard() {
  const navigate = useNavigate();
  const { type, mode, roomCode } = useParams<{
    type?: string;
    mode? : string;
    roomCode?: string;
  }>();

  const [showEndModal, setShowEndModal] = useState(false);

  useEffect(() => {
    if(type !== 'local' && type !== 'online') {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if(mode !== 'regular' && mode !== 'timed') {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if(type === 'online' && !roomCode) {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }
  });

  const backClick = () => {
    if(type === 'online') {
      navigate('/room');
    }
    else {
      navigate('/mode/local');
    }
  };

  const game = GameLogic(mode === 'timed' ? true : false, type === 'local' ? true : false);

  useEffect(() => {
    if(type !== 'local') {
      return;
    }

    if(game.winner || game.draw) {
      const timer = setTimeout(() => setShowEndModal(true), 1000);
      return () => clearTimeout(timer);
    }

    setShowEndModal(false);
  }, [game.winner, game.draw, type]);

  return (
    <div className={shared["page-container"]}>
      <div className={shared["page-card"]}>
        <button className={shared["back-button"]} onClick={() => backClick()}>← Back</button>
        <h1 className={shared["page-title"]}>Tic-Tac-Toe</h1>
        <div className={styles["players"]}>
          <PlayerCard name="Player 1" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
            symbol="O" isActive={game.xNext} timeLeft={mode === 'timed' ? game.p1Time : undefined}/>
          <PlayerCard name="Player 2" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
            symbol="X" isActive={!game.xNext} timeLeft={mode === 'timed' ? game.p2Time : undefined}/>
        </div>

        <StatusBar winner={game.winner} isDraw={game.draw} xNext={game.xNext} timeoutWinner={game.timeoutWinner}/>

        <div className={styles["board"]}>
          {game.squares.map((v,i) => (
            <Square key={i} value={v} isWinning={game.winnerLine?.includes(i) ?? false} onClick={() => game.makeMove(i)} />
          ))}
        </div>

        <div className={styles["controls"]}>
          {type === 'local' && (
            <>
              <button className={!game.canUndo ? shared["disabled-button"] : `${shared["primary-button"]} ${styles["undo"]}`} onClick={game.undo} disabled={!game.canUndo}>Undo</button>
              <button className={!game.canRedo ? shared["disabled-button"] : `${shared["primary-button"]} ${styles["redo"]}`} onClick={game.redo} disabled={!game.canRedo}>Redo</button>
            </>
          )}
        </div>
        <EndGameModal open={showEndModal} title={game.draw ? "It's a draw!" : `${game.winner === "O" ? "Player 1" : "Player 2"} wins!`}
          onRematch={() => { game.reset(); setShowEndModal(false);}}
          onExit={() => navigate('/')} />
      </div>
    </div>
  );
}
