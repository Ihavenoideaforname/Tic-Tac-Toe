import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/GameTypeSelectionStyles.module.css';

export default function GameTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className={shared["page-container"]}>
      <div className={shared["page-card"]}>
        <button className={shared["back-button"]} onClick={() => navigate("/main-menu")}>← Back</button>
        <h1 className={shared["page-title"]}>Select Game Type</h1>
        <div className={shared["button-container"]}>
          <button className={`${shared["primary-button"]} ${styles["game-type-local"]}`} onClick={() => navigate('/mode/local')}>
            👥 Local Multiplayer
          </button>
          <button
            className={`${shared["primary-button"]} ${styles["game-type-online"]}`} onClick={() => navigate('/room')}>
            🌐 Online Multiplayer
          </button>
        </div>
      </div>
    </div>
  );
}
