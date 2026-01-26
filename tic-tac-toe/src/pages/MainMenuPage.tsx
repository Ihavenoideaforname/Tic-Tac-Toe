import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/MainMenuPage.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';
import { useNavigate } from 'react-router-dom';


export default function MainMenuPage() {
  const navigate = useNavigate();
  const handleLogout = () => {localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); };
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    
    <div className={shared['page-container']}>
      <div className={shared['page-card']}>
        {!isLoggedIn && (
          <button className={shared['back-button']} onClick={() => navigate('/')}>
            ← Back
          </button>
        )}

        <h1 className={shared['page-title']}>Main Menu</h1>

        <div className={shared['button-container']}>
          <button className={`${shared['primary-button']} ${styles['play-button']}`} onClick={() => navigate('/type')}>🎮 Graj</button>

          <button className={shared['secondary-button']} onClick={() => navigate('/hall-of-fame')} >🏆 Tablica wyników </button>

          <button className={`${loginStyles['login-button']} ${styles['login-button']}`} onClick={() => navigate('/profile')}>👤 Profil </button>

          <button className={shared['logout-button']} onClick={handleLogout} > 🚪 Wyloguj się </button>
        </div>
      </div>
    </div>
  );
}
