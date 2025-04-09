import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

// Güçlendirme tipine göre adını döndüren yardımcı fonksiyon
const getPowerupName = (powerupType: string): string => {
  switch (powerupType) {
    case 'invisibility':
      return 'Görünmezlik';
    case 'slowTime':
      return 'Zaman Yavaşlatma';
    case 'gun':
      return 'Silah';
    case 'shrinkObstacles':
      return 'Engel Küçültme';
    default:
      return 'Güçlendirme';
  }
};

// Güçlendirme tipine göre rengini döndüren yardımcı fonksiyon
const getPowerupColor = (powerupType: string | null): string => {
  switch (powerupType) {
    case 'invisibility':
      return '#00BFFF'; // Mavi
    case 'slowTime':
      return '#9B59B6'; // Mor
    case 'gun':
      return '#E74C3C'; // Kırmızı
    case 'shrinkObstacles':
      return '#2ECC71'; // Yeşil
    default:
      return '#FFC107'; // Sarı
  }
};

const ScoreBoard: React.FC = () => {
  const { score, highScore, level, activePowerup } = useGameStore();
  const [powerupTimer, setPowerupTimer] = useState<number>(0);
  
  // Aktif güçlendirme için geri sayım
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (activePowerup) {
      setPowerupTimer(10); // 10 saniye
      
      interval = setInterval(() => {
        setPowerupTimer(prev => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPowerupTimer(0);
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activePowerup]);
  
  return (
    <div
      className="score-board"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '900px', // 800'den 900'e genişletildi
        margin: '5px auto',
        padding: '5px',
        backgroundColor: '#FFF',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Aktif güçlendirme göstergesi */}
      {activePowerup && (
        <div
          className="active-powerup"
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: getPowerupColor(activePowerup),
            borderRadius: '15px',
            padding: '5px 15px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: `0 0 10px ${getPowerupColor(activePowerup)}`
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFF',
              marginRight: '10px'
            }}
          >
            {activePowerup ? getPowerupName(activePowerup) : ''}
          </div>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: getPowerupColor(activePowerup)
            }}
          >
            {powerupTimer}
          </div>
        </div>
      )}
      <div
        className="current-score"
        style={{
          textAlign: 'center',
          flex: 1
        }}
      >
        <h3 style={{ margin: '0 0 2px', color: '#333', fontSize: '14px' }}>Skor</h3>
        <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#FF5722' }}>{score}</p>
      </div>
      
      <div
        className="high-score"
        style={{
          textAlign: 'center',
          flex: 1,
          borderLeft: '1px solid #EEE',
          borderRight: '1px solid #EEE'
        }}
      >
        <h3 style={{ margin: '0 0 2px', color: '#333', fontSize: '14px' }}>En Yüksek Skor</h3>
        <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2196F3' }}>{highScore}</p>
      </div>
      
      <div
        className="level"
        style={{
          textAlign: 'center',
          flex: 1
        }}
      >
        <h3 style={{ margin: '0 0 2px', color: '#333', fontSize: '14px' }}>Seviye</h3>
        <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>{level}</p>
      </div>
      
    </div>
  );
};

export default ScoreBoard;