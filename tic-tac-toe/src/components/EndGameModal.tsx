import shared from '../styles/SharedStyles.module.css';
import styles from '../styles/EndGameModalStyles.module.css';

type Props = {
    open: boolean;
    title: string;
    onRematch: () => void;
    onExit: () => void;
};

export default function EndGameModal({ open, title, onRematch, onExit }: Props) {
  if(!open) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.actions}>
          <button className={`${shared["primary-button"]} ${styles.rematch}`} onClick={onRematch}>
            Rematch
          </button>

          <button className={`${shared["primary-button"]} ${styles.exit}`} onClick={onExit}>
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
