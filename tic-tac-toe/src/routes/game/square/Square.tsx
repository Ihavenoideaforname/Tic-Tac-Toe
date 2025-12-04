import React from 'react';
import './Square.css';

interface SquareProps {
    value: string | null;
    onClick: () => void;
    isWinning: boolean;
}

export default function Square({ value, onClick, isWinning }: SquareProps) {
    return (
        <button onClick={onClick} className={`square ${isWinning ? 'square-winning' : ''}`}>
            <span className={`square-value ${value === 'X' ? 'value-x' : 'value-o'}`}>
                {value}
            </span>
        </button>
    );
}