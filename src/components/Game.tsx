import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import GameArea from './GameArea';
import ScoreBoard from './ScoreBoard';
import ControlsPanel from './ControlsPanel';
import StartScreen from './StartScreen';
import useSound from 'use-sound';
import { getSkinById } from '../utils/skins';

const Game = () => {
  const {
    isPlaying,
    isGameOver,
    startGame,
    resetGame,
    updateObstacles,
    addObstacle,
    obstacleFrequency,
    level
  } = useGameStore();
  
  // Use store directly to access Zustand set function
  const setGameState = useGameStore.setState;
  
  // Reference for requestAnimationFrame game loop
  const gameLoopRef = useRef<number | null>(null);
  
  // Obstacle creation timer
  const obstacleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Game loop
  useEffect(() => {
    if (!isPlaying) return;
    
    // Game loop function
    const gameLoop = () => {
      updateObstacles();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Start the loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    // Obstacle creation timer
    obstacleTimerRef.current = setInterval(() => {
      addObstacle();
    }, obstacleFrequency);
    
    // Cleanup function
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
    };
  }, [isPlaying, obstacleFrequency, level, updateObstacles, addObstacle]);
  
  // Listen for keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling with Space key in all cases
      if (e.code === 'Space') {
        e.preventDefault();
      }

      if (!isPlaying) {
        // When game hasn't started, only allow "R" key to start
        // Use Space key only for jumping during gameplay
        if (e.code === 'KeyR') {
          resetGame();
          startGame();
        }
        return;
      }
      
      // Controls while game is active
      const { jump, shootBullet } = useGameStore.getState();
      
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault(); // Prevent default browser behavior (scrolling)
        jump();
      }
      
      // Fire with "X" key when gun powerup is active
      if ((e.code === 'KeyX' || e.code === 'KeyF') && useGameStore.getState().activePowerup === 'gun') {
        e.preventDefault();
        shootBullet();
      }

      // Restart with "R" key
      if (e.code === 'KeyR') {
        // Can restart whether game is over or still in progress
        resetGame();
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isGameOver, startGame, resetGame]);
  
  // useEffect for Game Over state
  // NOTE: Automatic return to main page was removed
  useEffect(() => {
    // Empty useEffect left for reference only
  }, [isGameOver]);
  
  return (
    <div className="game-container">
      {!isPlaying ? (
        <StartScreen isGameOver={isGameOver} />
      ) : (
        <>
          <GameArea />
          <ScoreBoard />
          <ControlsPanel />
        </>
      )}
    </div>
  );
};

export default Game;