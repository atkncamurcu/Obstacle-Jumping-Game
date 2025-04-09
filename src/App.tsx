import React, { useEffect } from 'react';
import Game from './components/Game';
import { useGameStore } from './store/gameStore';

const App: React.FC = () => {
  const { highScore } = useGameStore();
  
  // Load high score from localStorage when page loads
  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      useGameStore.setState({ highScore: Number(savedHighScore) });
    }
  }, []);
  
  return (
    <div className="app-container" style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: '15px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <header style={{ marginBottom: '10px' }}>
        <h1 style={{ color: '#333', margin: '0 0 5px', fontSize: '28px' }}>Obstacle Jumping Game</h1>
        <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Jump over obstacles to progress and collect points!</p>
      </header>
      
      <main>
        <Game />
      </main>
    </div>
  );
};

export default App;
