import { useEffect, useState } from 'react';

const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

type Player = 'O' | 'X' | null;
const START_TIME = 30;

export function GameLogic(timed: boolean, allowHistory: boolean) {
    const [history, setHistory] = useState<Player[][]>([Array(9).fill(null)]);
    const [step, setStep] = useState(0);
    const [xNext, setXNext] = useState(true);
    const [p1Time, setP1Time] = useState(START_TIME);
    const [p2Time, setP2Time] = useState(START_TIME);
    const [timeoutWinner, setTimeoutWinner] = useState<Player>(null);

    const squares = history[step];

    const winnerLine = LINES.find(([a,b,c]) =>
        squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
    );

    const winner = timeoutWinner ?? (winnerLine ? squares[winnerLine[0]] : null);
    const draw = !winner && squares.every(Boolean);

    useEffect(() => {
        if(!timed || winner || draw) {
            return;
        }

        const timer = setInterval(() => {
            if(xNext) {
                setP1Time(t => t <= 1 ? (setTimeoutWinner('X'), 0) : t - 1);
            } 
            else {
                setP2Time(t => t <= 1 ? (setTimeoutWinner('O'), 0) : t - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [xNext, timed, winner, draw]);

    const makeMove = (i: number) => {
        if(squares[i] || winner || draw) {
            return;
        }

        const next = squares.slice();
        next[i] = xNext ? 'O' : 'X';

        setHistory(h => [...h.slice(0, step + 1), next]);
        setStep(s => s + 1);
        setXNext(x => !x);
    };

    const undo = () => allowHistory && step > 0 && !winner && (
        setStep(s => s - 1), setXNext(x => !x)
    );

    const redo = () => allowHistory && step < history.length - 1 && !winner && (
        setStep(s => s + 1), setXNext(x => !x)
    );

    const reset = () => {
        setHistory([Array(9).fill(null)]);
        setStep(0);
        setXNext(true);
        setP1Time(START_TIME);
        setP2Time(START_TIME);
        setTimeoutWinner(null);
    };

    return {
        squares, xNext, winner, winnerLine, draw, timeoutWinner,
        p1Time, p2Time,
        makeMove, undo, redo, reset,
        canUndo: allowHistory && step > 0 && !winner,
        canRedo: allowHistory && step < history.length - 1 && !winner,
    };
}