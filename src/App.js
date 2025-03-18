import { useState } from 'react';
import './App.css';

function App() {
  const ROWS = 6;
  const COLS = 7;
  const EMPTY = null;
  const PLAYER1 = 'red';
  const PLAYER2 = 'yellow';

  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  function createEmptyBoard() {
    return Array(COLS).fill().map(() => Array(ROWS).fill(EMPTY));
  }

  const dropToken = (col) => {
    if (gameOver) return;

    const newBoard = board.map((col) => [...col]);
    const row = newBoard[col].lastIndexOf(EMPTY);

    if (row === -1) return;

    newBoard[col][row] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, col, row)) {
      setWinner(currentPlayer);
      setGameOver(true);
      return;
    }

    if (newBoard.every((col) => col.every((cell) => cell !== EMPTY))) {
      setGameOver(true);
      return;
    }

    setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1);
  };

  const checkWinner = (board, col, row) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      count += countInDirection(board, col, row, dx, dy);
      count += countInDirection(board, col, row, -dx, -dy);
      if (count >= 4) return true;
    }

    return false;
  };

  const countInDirection = (board, col, row, dx, dy) => {
    let count = 0;
    let color = board[col][row];

    while (true) {
      col += dx;
      row += dy;
      if (
        col < 0 || col >= COLS ||
        row < 0 || row >= ROWS ||
        board[col][row] !== color
      ) break;

      count++;
    }

    return count;
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER1);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Connect Four</h1>

      <div className="game-info">
        {gameOver ? (
          <div>
            {winner ? <h2>Winner: <span style={{ color: winner }}>{winner}</span></h2> : <h2>It's a draw!</h2>}
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <h2>Current Player: <span style={{ color: currentPlayer }}>{currentPlayer}</span></h2>
        )}
      </div>

      <div className="game-board">
        {Array(COLS).fill().map((_, col) => (
          <button key={col} onClick={() => dropToken(col)} disabled={gameOver || board[col][0] !== EMPTY}>▼</button>
        ))}

        <div className="board">
          {Array(ROWS).fill().map((_, row) => (
            <div key={row} className="row">
              {Array(COLS).fill().map((_, col) => (
                <div key={col} className="cell">
                  {board[col][row] && (
                    <div className="token" style={{ backgroundColor: board[col][row] }}></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;