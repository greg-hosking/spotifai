import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LogIn from './pages/LogIn';
import Callback from './pages/Callback';
import Home from './pages/Home';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/log-in' element={<LogIn />} />
        <Route path='/callback' element={<Callback />} />
        <Route path='/home' element={<Home />} />
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
