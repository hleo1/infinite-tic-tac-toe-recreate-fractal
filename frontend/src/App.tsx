import { useState, useEffect } from 'react'
import { io } from "socket.io-client";

import './App.css'

type Player = "X" | "O"

type Cell = Player | undefined

type gameStatus = "ongoing" | "tied" | "X" | "O"

type TicTacToe = {
    id: number;
    board: Cell[][];
    gameStatus: gameStatus;
    currentPlayer: Player;
}

const socket = io("http://localhost:3000"); // 👈 connect once


function App() {
  const [gameState, setGameState] = useState<TicTacToe>();

  const [gameID, setGameID] = useState<number>();

  // useEffect(() => {
  //   console.log(gameState)
  // }, [gameState])

  const createGame = async () => {
    const response = await fetch("http://localhost:3000/create-game")
    setGameState(await response.json())
  }

  const joinGame = async () => {
    const response = await fetch("http://localhost:3000/join-game/" + gameID);
    let data = await response.json();
    setGameState(data);
  
    // 👇 join socket room
    socket.emit("join-game", gameID);
  };

  useEffect(() => {
    socket.on("game-update", (newState) => {
      setGameState(newState);
    });
  
    return () => {
      socket.off("game-update");
    };
  }, []);

  
  const buttonClick = async (order: number) => {
    let row = Math.floor(order / 3);
    let col = order % 3; 

    const response = await fetch("http://localhost:3000/make-move/" + gameState?.id +  "/" + row + "/" + col);
    setGameState(await response.json())
  }



  return (
    <>
    <div className="w-screen min-h-screen bg-gray-200 font-sans flex flex-col">
      <header className = "flex flex-col items-center">
        <h1 className = "text-5xl">Infinite Tic Tac Toe</h1>
        <div className = "flex gap-2">
           <div id ="create-game">
            <button className="border border-gray-300 px-5 py-3 rounded-2xl hover:cursor-pointer" onClick={createGame}>
              Create Game
            </button>
           </div>

           <div id ="join-game" className = "bg-white w-100 rounded-xl flex items-center px-2 gap-4">
            <input
              className="w-50 border border-black rounded-lg"
              placeholder="GAME ID"
              type="text"
              value={gameID ?? ""}
              onChange={e => setGameID(Number(e.target.value))}
            />
            <button className="border border-gray-300 px-2 py-1 rounded-lg" onClick ={joinGame}>
              JOIN
            </button>
           </div>

        </div>
      </header>


      {gameState?.id && (
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="grid grid-cols-3 gap-2">
            {gameState?.board.flat().map((elem, index) => (
              <div
                key={index}
                className="bg-gray-300 w-20 h-20 rounded-2xl border border-gray-400 flex items-center justify-center text-2xl cursor-pointer"
                onClick={() => buttonClick(index)}
              >
                {elem}
              </div>
            ))}
          </div>
          <div>
            <div>Game ID: {gameState.id}</div>
            <button onClick={async () => {
              let response = await fetch("http://localhost:3000/reset/" + gameState.id);
              setGameState(await response.json())
            }}>Reset</button>
          </div>
        </div>
      )}
      


    </div>
      
    </>
  )
}

export default App
