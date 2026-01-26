import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css'
import styles from '../styles/AuthPageStyles.module.css';
import loginStyles from '../styles/LoginPageStyles.module.css';



export default function AuthPage() {
  const navigate = useNavigate();

  const continueAsGuest = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/type');
};

  return (
    <div className={shared['page-container']}>
        <div className={shared['page-card']}>
            <h1 className={shared['page-title']}>Tic-Tac-Toe</h1>
            <button className={loginStyles['login-button']} onClick={() => navigate('/login')}>🔓 Login</button>
            <button className={loginStyles['login-button']} onClick={() => navigate('/register')}>📝 Register</button>
            <div className={styles['or-text']}>OR</div>
            <button className={`${shared['primary-button']} ${styles['guest-button']}`} onClick={continueAsGuest}>👤 Continue as Guest</button>
        </div>
    </div>
  );
}