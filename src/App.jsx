import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='App'>
      <h1>SpotifAI</h1>
      <h2>AI-powered playlist generator</h2>
      <button>LOG IN WITH SPOTIFY</button>
    </div>
  );
}

export default App;
