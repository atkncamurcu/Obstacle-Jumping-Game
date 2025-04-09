import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const ControlsPanel: React.FC = () => {
  const { startGame, pauseGame, resumeGame, resetGame, isPlaying, isPaused, isGameOver, activePowerup } = useGameStore();
  
  // Mobil dokunmatik kontroller için fonksiyonlar
  const handleJump = () => {
    const { jump } = useGameStore.getState();
    jump();
  };
  
  // Klavye olaylarını dinle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "P" tuşu ile oyunu duraklat/devam ettir
      if (e.code === 'KeyP') {
        if (isPlaying && !isGameOver) {
          if (isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
      }
      
      // "R" tuşu ile oyunu yeniden başlat
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
      {/* Bilgisayar Kontrolleri Açıklaması */}
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
        <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '14px' }}>Kontroller</h3>
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
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Zıpla</span>
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
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Çift Zıplama</span>
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
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Duraklat/Devam Et</span>
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
            <span style={{ marginLeft: '5px', fontSize: '12px' }}>Yeniden Başlat</span>
          </div>
          
          {/* Silah güçlendirmesi aktifken ateş etme bilgisi */}
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
              <span style={{ marginLeft: '5px', fontSize: '12px' }}>Ateş Et</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ControlsPanel;