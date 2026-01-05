import { useState, useEffect } from "react";
import styles from "../styles/BackgroundStyles.module.css";

type SymbolType = "O" | "X";

interface GridCell {
  value: SymbolType | null;
}

const Background = () => {
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [gridSize, setGridSize] = useState({ rows: 8, cols: 8 });

  useEffect(() => {
    const updateGridSize = () => {
      const rows = Math.max(1, Math.floor(window.innerHeight / 100));
      const cols = Math.max(1, Math.floor(window.innerWidth / 100));
      setGridSize({ rows, cols });
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  useEffect(() => {
    const totalSquares = gridSize.rows * gridSize.cols;
    setGrid(Array.from({ length: totalSquares }, () => ({ value: null })));

    let isMounted = true;

    const intervalId = window.setInterval(() => {
      if(!isMounted) {
        return;
      }

      setGrid((prev) => {
        const emptyIndices = prev.map((cell, i) => (cell.value === null ? i : -1)).filter((i) => i !== -1);

        if(emptyIndices.length === 0) {
          return Array(totalSquares).fill(null).map(() => ({ value: null, symbol: 'O' }));
        }

        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const filledCount = prev.length - emptyIndices.length;
        const symbol: SymbolType = filledCount % 2 === 0 ? "O" : "X";

        const newGrid = [...prev];
        newGrid[randomIndex] = { value: symbol };
        return newGrid;
      });
    }, Math.random() * 3000 + 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [gridSize]);

  return (
    <div className={styles["background-container"]}
      style={{ gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`, gridTemplateRows: `repeat(${gridSize.rows}, 1fr)` }} >
      {grid.map((cell, i) => (
        <div key={i} className={styles["background-square"]}
          style={{ color: cell.value === "X" ? "rgba(99, 102, 241, 0.6)" : cell.value === "O" ? "rgba(239, 68, 68, 0.6)" : "transparent", }} >
          {cell.value}
        </div>
      ))}
    </div>
  );
};

export default Background;
