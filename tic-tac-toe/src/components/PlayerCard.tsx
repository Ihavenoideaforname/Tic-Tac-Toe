import styles from '../styles/PlayerCardStyles.module.css';

interface Props {
  name: string;
  avatar: string;
  symbol: 'X' | 'O';
  isActive: boolean;
  timeLeft?: number;
}

const getDangerLevel = (timeLeft: number) => {
    if (timeLeft > 20) return 0;
    if (timeLeft > 15) return 1;
    if (timeLeft > 10) return 2;
    if (timeLeft > 5) return 3;
    return 4;
};

export default function PlayerCard({name, avatar, symbol, isActive, timeLeft}: Props) {
    const danger = timeLeft !== undefined ? getDangerLevel(timeLeft) : 0;
    let shakeClass = '';

    if(danger === 3) {
      shakeClass = styles['shake-slight'];
    }
    if(danger === 4) {
      shakeClass = styles['shake-strong'];
    }

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <div className={styles.row}>
        <img
          className={`${styles.avatar} ${
            symbol === 'X' ? styles.avatarX : styles.avatarO
          }`}
        src={avatar || '/default-avatar.jpg'}
        alt={name}
        />

        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div
            className={styles.symbol}
            style={{ color: symbol === 'X' ? '#2563eb' : '#dc2626' }}
          >
            {symbol}
          </div>
        </div>
      </div>

      {timeLeft !== undefined && (
        <div
          className={`${styles.timer} ${shakeClass}`}
          style={{ '--danger': danger } as React.CSSProperties}
        >
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
