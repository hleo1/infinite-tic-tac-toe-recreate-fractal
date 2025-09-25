import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="w-screen min-h-screen bg-gray-200 font-sans flex flex-col">
      <header className = "flex flex-col items-center">
        <h1 className = "text-5xl">Infinite Tic Tac Toe</h1>
        <div className = "flex gap-2">
           <div id ="create-game">
            <button className="border border-gray-300 px-5 py-3 rounded-2xl hover:cursor-pointer">
              Create Game
            </button>
           </div>

           <div id ="join-game" className = "bg-white w-100 rounded-xl flex items-center px-2 gap-4">
            <input className = "w-50 border border-black rounded-lg" placeholder="GAME ID" />
            <button className="border border-gray-300 px-2 py-1 rounded-lg">
              JOIN
            </button>
           </div>

        </div>
      </header>

      <div className="flex justify-center items-center flex-1">
        <div className="grid grid-cols-3 gap-2"> 
          {Array(9).fill("").map((elem) => (<div className="bg-gray-300 w-20 h-20
           rounded-2xl border border-gray-400"></div>))}
        </div>
      </div>
    </div>
      
    </>
  )
}

export default App
