import React, { useState } from 'react';
import Square from "../square/Square";
import './Board.css';

function calculateWinner(squares: (string | null)[]): { winner: string | null; line: number[] | null } {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
  
    for(let line of lines) {
        const [a, b, c] = line;
        
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line };
        }
    }
    
    return { winner: null, line: null };
}

export default function Board() {
    const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const { winner, line } = calculateWinner(squares);
    const isDraw = !winner && squares.every(sq => sq !== null);

    const handleClick = (i: number) => {
        if (squares[i] || winner) return;

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    };

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
    };

    const getStatus = () => {
        if (winner) {
            return `Winner: ${winner}`;
        } else if (isDraw) {
            return "It's a Draw!";
        } else {
            return `Next player: ${xIsNext ? 'X' : 'O'}`;
        }
    };

    return (
        <div className="game-container">
            <div className="game-card">
                <h1 className="game-title">Tic-Tac-Toe</h1>
        
                <div className="status-container">
                    <div className={`status ${winner ? 'status-winner' : isDraw ? 'status-draw' : 'status-playing'}`}>
                        {getStatus()}
                    </div>
                </div>

                <div className="board">
                    {squares.map((sq, i) => (
                        <Square
                            key={i}
                            value={sq}
                            onClick={() => handleClick(i)}
                            isWinning={line ? line.includes(i) : false}
                        />
                    ))}
                </div>

                <button onClick={resetGame} className="reset-button">New Game</button>
            </div>
        </div>
    );
}