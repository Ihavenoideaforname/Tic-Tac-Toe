import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/MainMenuPage.module.css';
import { useNavigate } from 'react-router-dom';


export default function MainMenuPage() {
  const navigate = useNavigate();

  return (
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        <button className={shared['back-button']} onClick={() => navigate('/')}>
          ← Back
        </button>

        <h1 className={shared['page-title']}>Main Menu</h1>

        <div className={shared['button-container']}>
          <button className={`${shared['primary-button']} ${styles['play-button']}`} onClick={() => navigate('/type')}>🎮 Graj</button>

          <button className={shared['disabled-button']} disabled>🏆 Tablica wyników (TBD) </button>

          <button className={shared['disabled-button']} disabled>👤 Profil (TBD) </button>
        </div>
      </div>
    </div>
  );
}
