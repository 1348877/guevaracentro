import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login';

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h1>Bienvenido, {user.usuario?.nombre || user.usuario?.telefono || user.usuario?.email}</h1>
      <button onClick={() => setUser(null)} style={{margin:'1rem', borderRadius:8, padding:8}}>Cerrar sesión</button>
      {/* Aquí puedes renderizar el resto de tu app protegida */}
    </>
  )
}

export default App
