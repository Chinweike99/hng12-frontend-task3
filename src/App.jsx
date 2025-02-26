import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextProcessor from '../TextProcessor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <TextProcessor />
    </div>
  )
}

export default App
