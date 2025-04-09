import React from 'react';
import { Obstacle as ObstacleType } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';

interface ObstacleProps {
  obstacle: ObstacleType;
}

// Powerup tipine göre renk döndüren yardımcı fonksiyon
const getPowerupColor = (powerupType: string, alpha: number = 1): string => {
  switch (powerupType) {
    case 'invisibility':
      return `rgba(0, 191, 255, ${alpha})`; // Mavi
    case 'slowTime':
      return `rgba(155, 89, 182, ${alpha})`; // Mor
    case 'gun':
      return `rgba(231, 76, 60, ${alpha})`; // Kırmızı
    case 'shrinkObstacles':
      return `rgba(46, 204, 113, ${alpha})`; // Yeşil
    case 'doublePoints':
      return `rgba(255, 193, 7, ${alpha})`; // Sarı
    default:
      return `rgba(255, 193, 7, ${alpha})`; // Sarı
  }
};

// Powerup tipine göre simge döndüren yardımcı fonksiyon
const getPowerupIcon = (powerupType: string): string => {
  switch (powerupType) {
    case 'invisibility':
      return '👻'; // Hayalet
    case 'slowTime':
      return '⏱️'; // Saat
    case 'gun':
      return '🔫'; // Silah
    case 'shrinkObstacles':
      return '🔍'; // Küçültme
    case 'doublePoints':
      return '💰'; // Para çantası (iki kat puan)
    default:
      return '?';
  }
};

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const { x, width, height, hasPowerup, powerupType, destroyed } = obstacle;
  const { activePowerup } = useGameStore();
  
  // Zemin yüksekliği
  const GROUND_HEIGHT = 50;
  
  return (
    <div
      className="obstacle"
      style={{
        position: 'absolute',
        left: `${x}px`,
        bottom: `${GROUND_HEIGHT}px`,
        // Engel küçültme güçlendirmesi aktifse boyutları küçült
        width: activePowerup === 'shrinkObstacles' ? `${width * 0.6}px` : `${width}px`,
        height: activePowerup === 'shrinkObstacles' ? `${height * 0.6}px` : `${height}px`,
        backgroundColor: destroyed ? 'transparent' : '#4CAF50', // Yok edilmişse görünmez yap
        borderRadius: '5px 5px 0 0',
        boxShadow: destroyed ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.3)',
        opacity: destroyed ? 0 : 1,
        transition: 'width 0.3s, height 0.3s' // Küçültme için geçiş animasyonu
      }}
    >
      {!destroyed && (
        <>
          {/* Engel detayları */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              width: '100%',
              height: '10px',
              backgroundColor: '#388E3C', // Koyu yeşil üst kısım
              borderRadius: '5px 5px 0 0'
            }}
          />
          
          {/* Çizgiler */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: `${10 + index * 15}px`,
                left: '5px',
                width: `${width - 10}px`,
                height: '5px',
                backgroundColor: '#388E3C',
                opacity: 0.7
              }}
            />
          ))}
        </>
      )}
      
      {/* Güçlendirme (Powerup) gösterimi */}
      {hasPowerup && powerupType && (
        <div
          style={{
            position: 'absolute',
            top: '-20px', // Engelin üzerinde gösterme
            left: '50%',
            transform: 'translateX(-50%)',
            width: '25px',
            height: '25px',
            backgroundColor: getPowerupColor(powerupType), // Powerup tipine göre renk
            borderRadius: '50%',
            boxShadow: `0 0 10px ${getPowerupColor(powerupType, 0.8)}`, // Parlayan efekt
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#FFF',
            animation: 'float 1s infinite alternate', // Hafif hareket animasyonu
          }}
        >
          {getPowerupIcon(powerupType)}
        </div>
      )}
    </div>
  );
};

export default Obstacle;