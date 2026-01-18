import { useNavigate } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css'
import styles from '../styles/AuthPageStyles.module.css';

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className={shared['page-container']}>
        <div className={shared['page-card']}>
            <h1 className={shared['page-title']}>Tic-Tac-Toe</h1>
            <button className={shared['disabled-button']} disabled>🔒 Login (Coming Soon)</button>
            <button className={shared['disabled-button']} disabled>🔒 Register (Coming Soon)</button>
            <div className={styles['or-text']}>OR</div>
            <button className={`${shared['primary-button']} ${styles['guest-button']}`} onClick={() => navigate('/type')}>👤 Continue as Guest</button>
        </div>
    </div>
  );
}
