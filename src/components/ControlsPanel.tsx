import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const ControlsPanel: React.FC = () => {
  const { startGame, pauseGame, resumeGame, resetGame, isPlaying, isPaused, isGameOver, activePowerup } = useGameStore();
  
  // Functions for mobile touch controls
  const handleJump = () => {
    const { jump } = useGameStore.getState();
    jump();
  };
  
  // Listen for keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "P" key to pause/resume the game
      if (e.code === 'KeyP') {
        if (isPlaying && !isGameOver) {
          if (isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
      }
      
      // "R" key to restart the game
      if (e.code === 'KeyR') {
        if (isGameOver || !isPlaying) {
          resetGame();
          startGame();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isPaused, isGameOver, pauseGame, resumeGame, resetGame, startGame]);
  
  return (
    <>
      {/* Computer Controls Description */}
      <div
        className="keyboard-controls"
        style={{
          width: '800px',
          margin: '5px auto',
          padding: '8px',
          backgroundColor: '#F5F5F5',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '14px' }}>Controls</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 6px',
                backgroundColor: '#E0E0E0',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              SPACE
            </span>
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Jump</span>
          </div>
          
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 6px',
                backgroundColor: '#E0E0E0',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              SPACE (x2)
            </span>
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Double Jump</span>
          </div>
          
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 6px',
                backgroundColor: '#E0E0E0',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              P
            </span>
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Pause/Resume</span>
          </div>
          
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 6px',
                backgroundColor: '#E0E0E0',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              R
            </span>
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Restart</span>
          </div>
          
          {/* Firing information when gun powerup is active */}
          {activePowerup === 'gun' && (
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 6px',
                  backgroundColor: '#E74C3C',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: 'white'
                }}
              >
                X / F
              </span>
              <span style={{ marginLeft: '5px', fontSize: '12px' }}>Fire</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ControlsPanel;