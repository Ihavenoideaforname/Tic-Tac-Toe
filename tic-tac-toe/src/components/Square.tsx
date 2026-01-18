import styles from '../styles/SquareStyles.module.css';

interface Props {
    value: 'X' | 'O' | null;
    onClick: () => void;
    isWinning: boolean;
}

export default function Square({ value, onClick, isWinning }: Props) {
  return (
    <button onClick={onClick} className={[
        styles["square"],
        value === 'X' && styles["x"],
        value === 'O' && styles["o"],
        isWinning && styles["win"],
      ].filter(Boolean).join(' ')}>
        {value}
    </button>
  );
}
