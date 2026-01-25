import styles from '../styles/StatusBarStyles.module.css';

interface Props {
    winner: string | null;
    isDraw: boolean;
    xNext: boolean;
    timeoutWinner?: string | null;
    currentPlayerName?: string;
}

export default function StatusBar({winner, isDraw, xNext, timeoutWinner, currentPlayerName,}: Props) {
    let text: string;
    let statusClass = styles['status-playing'];

    if (timeoutWinner) {
        text = `${timeoutWinner} wins by timeout!`;
        statusClass = styles['status-winner'];
    } 
    else if (winner) {
        text = `${winner} wins!`;
        statusClass = styles['status-winner'];
    } 
    else if (isDraw) {
        text = `It's a draw!`;
        statusClass = styles['status-draw'];
    } 
    else {
        text = `Current turn: ${currentPlayerName ?? '—'}`;
    }

    return (
      <div className={styles['status-container']}>
        <div className={`${styles.status} ${statusClass}`}>
          {text}
        </div>
      </div>
    );
}
