import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          计数是 {count}
        </button>
        <p>
          编辑 <code>src/App.jsx</code> 并保存以测试 HMR
        </p>
      </div>
      <p className="read-the-docs">
        点击 Vite 和 React 的 logo 了解更多信息
      </p>
    </div>
  )
}

export default App

