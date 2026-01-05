import styles from '../styles/StatusBarStyles.module.css';

interface Props {
    winner: 'X' | 'O' | null;
    isDraw: boolean;
    xNext: boolean;
    timeoutWinner?: 'X' | 'O' | null;
}

export default function StatusBar({winner, isDraw, xNext, timeoutWinner}: Props) {
    let text: string;
    let statusClass = styles['status-playing'];

    if(timeoutWinner) {
        text = `Player ${timeoutWinner === 'O' ? '1' : '2'} wins by timeout!`;
        statusClass = styles['status-winner'];
    } 
    else if (winner) {
        text = `Player ${winner === 'O' ? '1' : '2'} wins!`;
        statusClass = styles['status-winner'];
    } 
    else if (isDraw) {
        text = `It's a draw!`;
        statusClass = styles['status-draw'];
    } 
    else {
        text = `Current turn: Player ${xNext ? '1' : '2'}`;
    }

    return (
      <div className={styles['status-container']}>
        <div className={`${styles.status} ${statusClass}`}>
          {text}
        </div>
      </div>
    );
}
