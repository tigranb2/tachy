import { useEffect, useState } from 'react';
import './App.css';

import NavBar from './components/NavBar';
import TimePage from './pages/TimePage';

function App() {

  return (
    <div className="App">
      <header>
          <NavBar />
        </header>
      <TimePage />
    </div>
  )
}

export default App
