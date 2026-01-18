import { useNavigate, useSearchParams } from 'react-router-dom';
import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/ErrorPageStyles.module.css';

export default function ErrorPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const code = params.get('code') ?? '500';
  const message = params.get('message') ?? 'Something went wrong';

  return (
    <div className={shared["page-container"]}>
      <div className={shared["page-card"]}>
        <h1 className={shared["page-title"]}>Error</h1>

        <div className={styles["code"]}>Code: {code}</div>
        <p className={styles["message"]}>{message}</p>

        <button className={`${shared["primary-button"]} ${styles["error-escape"]}`} onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  );
}
