import React from 'react';
import { Obstacle as ObstacleType } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';

interface ObstacleProps {
  obstacle: ObstacleType;
}

// Helper function that returns color based on powerup type
const getPowerupColor = (powerupType: string, alpha: number = 1): string => {
  switch (powerupType) {
    case 'invisibility':
      return `rgba(0, 191, 255, ${alpha})`; // Blue
    case 'slowTime':
      return `rgba(155, 89, 182, ${alpha})`; // Purple
    case 'gun':
      return `rgba(231, 76, 60, ${alpha})`; // Red
    case 'shrinkObstacles':
      return `rgba(46, 204, 113, ${alpha})`; // Green
    case 'doublePoints':
      return `rgba(255, 193, 7, ${alpha})`; // Yellow
    default:
      return `rgba(255, 193, 7, ${alpha})`; // Yellow
  }
};

// Helper function that returns icon based on powerup type
const getPowerupIcon = (powerupType: string): string => {
  switch (powerupType) {
    case 'invisibility':
      return '👻'; // Ghost
    case 'slowTime':
      return '⏱️'; // Clock
    case 'gun':
      return '🔫'; // Gun
    case 'shrinkObstacles':
      return '🔍'; // Magnifier (shrink)
    case 'doublePoints':
      return '💰'; // Money bag (double points)
    default:
      return '?';
  }
};

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const { x, width, height, hasPowerup, powerupType, destroyed } = obstacle;
  const { activePowerup } = useGameStore();
  
  // Ground height
  const GROUND_HEIGHT = 50;
  
  return (
    <div
      className="obstacle"
      style={{
        position: 'absolute',
        left: `${x}px`,
        bottom: `${GROUND_HEIGHT}px`,
        // Reduce size if shrink obstacles powerup is active
        width: activePowerup === 'shrinkObstacles' ? `${width * 0.6}px` : `${width}px`,
        height: activePowerup === 'shrinkObstacles' ? `${height * 0.6}px` : `${height}px`,
        backgroundColor: destroyed ? 'transparent' : '#4CAF50', // Make invisible if destroyed
        borderRadius: '5px 5px 0 0',
        boxShadow: destroyed ? 'none' : '2px 2px 5px rgba(0, 0, 0, 0.3)',
        opacity: destroyed ? 0 : 1,
        transition: 'width 0.3s, height 0.3s' // Transition animation for shrinking
      }}
    >
      {!destroyed && (
        <>
          {/* Obstacle details */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              width: '100%',
              height: '10px',
              backgroundColor: '#388E3C', // Dark green top part
              borderRadius: '5px 5px 0 0'
            }}
          />
          
          {/* Lines */}
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
      
      {/* Powerup display */}
      {hasPowerup && powerupType && (
        <div
          style={{
            position: 'absolute',
            top: '-20px', // Show above the obstacle
            left: '50%',
            transform: 'translateX(-50%)',
            width: '25px',
            height: '25px',
            backgroundColor: getPowerupColor(powerupType), // Color based on powerup type
            borderRadius: '50%',
            boxShadow: `0 0 10px ${getPowerupColor(powerupType, 0.8)}`, // Glowing effect
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#FFF',
            animation: 'float 1s infinite alternate', // Light movement animation
          }}
        >
          {getPowerupIcon(powerupType)}
        </div>
      )}
    </div>
  );
};

export default Obstacle;