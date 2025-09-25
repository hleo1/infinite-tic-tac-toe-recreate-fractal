import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="w-screen min-h-screen bg-gray-200 font-sans flex flex-col">
      <header className = "flex justify-center text-5xl">
        Infinite Tic Tac Toe
      </header>

      <div className="flex justify-center items-center flex-1">
        <div className="bg-gray-400 w-[400px] h-[400px]"></div>
      </div>

    </div>
      
    </>
  )
}

export default App
