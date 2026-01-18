import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/EndGameModalStyles.module.css';

type Props = {
  open: boolean;
  type: 'waiting' | 'rematch-request' | 'error';
  message?: string;
  onAccept?: () => void;
  onReject?: () => void;
};

export default function ConnectionModal({ open, type, message, onAccept, onReject }: Props) {
  if (!open) {
    return null;
  }

  const renderContent = () => {
    switch (type) {
      case 'waiting':
        const hasRoomCode = message?.includes('Room Code:');
        const messageParts = hasRoomCode ? message?.split('\n') || [] : [];
        
        return (
          <>
            <div className={styles.spinner}></div>
            {hasRoomCode && messageParts.length > 1 ? (
              <>
                <p className={styles.code}>
                  {messageParts[0]}
                </p>
                <p className={styles.message}>
                  {messageParts[1]}
                </p>
              </>
            ) : (
              <p className={styles.message}>
                {message || 'Loading...'}
              </p>
            )}
          </>
        );

      case 'rematch-request':
        return (
          <>
            <p className={styles.message}>
              {message || 'Opponent wants a rematch!'}
            </p>
            <div className={styles.actions}>
              <button
                className={`${shared['primary-button']} ${styles.rematch}`}
                onClick={onAccept}
              >
                Accept
              </button>
              <button
                className={`${shared['primary-button']} ${styles.exit}`}
                onClick={onReject}
              >
                Decline
              </button>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <h2 className={styles.title}>Oops!</h2>
            <p className={styles.message}>
              {message || 'Something went wrong'}
            </p>
            <div className={styles.actions}>
              <button
                className={`${shared['primary-button']} ${styles.exit}`}
                onClick={onReject}
              >
                Return to Menu
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {renderContent()}
      </div>
    </div>
  );
}