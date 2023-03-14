
import { useState } from 'react'


function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      style={{backgroundColor: isWinningSquare ? 'lightgreen' : null}}
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}


export default function Game() {
  const [history, setHistory] = useState([{board: Array(9).fill(null), move: null}]);
  const [currentMove, setCurrentMove] = useState(0)
  const [historyDirection, setHistoryDirection] = useState(true)
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, move) {
    const nextHistory = [...history.slice(0, currentMove + 1), {board: nextSquares, move: move}]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description
    let realMove = parseInt(squares.move) + 1
    if(move === currentMove) {
      return (
        <li key={move}>
          {`You are at move #${move}`}{move > 0 && ` [${(realMove % 3 === 0 ? '3':realMove % 3)},${(Math.ceil(realMove / 3))}]`}
        </li>
        )
    }

    if(move > 0) {
      description = 'Go to move #' + move + ' [' + (realMove % 3 === 0 ? '3':realMove % 3) + ',' + (Math.ceil(realMove / 3)) + ']'
    } else {
      description = 'Go to game start'
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares.board} history={history} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="game-actions">
          {`Toggle history direction: `}
          <button onClick={() => setHistoryDirection(!historyDirection)}>{historyDirection ? `Bottom to top` : `Top to bottom`}</button>
        </div>
        <ol reversed={!historyDirection}>{historyDirection ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function Board({squares, xIsNext, history, onPlay}) {

  const [winner, winningArray] = calculateWinner(squares)
  let status

  if(winner) {
    status = "Winner: " + winner
  } else if (history.length === 10) {
    status = "Game ended in draw"
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  function isWinningSquare(index) {
    return winningArray && winningArray.includes(index)
  }

  function handleClick(i) {
    if(squares[i] || winner) {
      return
    }
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : 'O';
    onPlay(nextSquares, i.toString())
  }

  function generateBoard() {

    const boardArray = []

    const squaresArray =  squares.map((value, index) => {
      return <Square isWinningSquare={isWinningSquare(index)} key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
    })

    for (let i = 0; i < 3; i++) {
      boardArray.push(
        <div key={i} className="board-row">
          {squaresArray.slice(i*3,i*3+3)}
        </div>
      )
    }

    return boardArray
  }

  return (
    <>
      <div className='status'>{status}</div>
      {generateBoard()}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a,b,c]];
    }
  }
  return [];
}