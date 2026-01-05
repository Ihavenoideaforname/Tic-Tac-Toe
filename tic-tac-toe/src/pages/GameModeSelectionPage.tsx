import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/GameModeSelectionStyles.module.css';

export default function GameModeSelection() {
  const navigate = useNavigate();
  const { type, roomCode } = useParams<{
    type?: string;
    roomCode?: string;
  }>();

  useEffect(() => {
    if(type !== 'local' && type !== 'online') {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }

    if(type === 'online' && !roomCode) {
      navigate('/error?code=404&message=Page not found', { replace: true });
      return;
    }
  }, [type, roomCode, navigate]);

  if(type !== 'local' && type !== 'online') {
    return null;
  }

  const goToGame = (mode: 'regular' | 'timed') => {
    if(type === 'online') {
      navigate(`/game/online/${mode}/${roomCode}`);
    }
    else {
      navigate(`/game/local/${mode}`);
    }
  };

  const backClick = () => {
    if(type === 'online') {
      navigate('/room');
    }
    else {
      navigate('/type');
    }
  };

  return (
    <div className={shared["page-container"]}>
      <div className={shared["page-card"]}>
        <button className={shared["back-button"]} onClick={() => backClick()}>← Back</button>
        <h1 className={shared["page-title"]}>Select Game Mode</h1>

        <div className={shared["button-container"]}>
          <button className={`${shared["primary-button"]} ${styles["game-mode-regular"]}`} onClick={() => goToGame('regular')}>
            ⚡ Regular Mode
          </button>

          <button className={`${shared["primary-button"]} ${styles["game-mode-timed"]}`} onClick={() => goToGame('timed')}>
            ⏱️ Timed Mode
          </button>
        </div>
      </div>
    </div>
  );
}
