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
  
  // Zustand set fonksiyonuna erişim için store'u doğrudan kullan
  const setGameState = useGameStore.setState;
  
  // Oyun döngüsü için requestAnimationFrame referansı
  const gameLoopRef = useRef<number | null>(null);
  
  // Obstacle oluşturma zamanlayıcısı
  const obstacleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Oyun döngüsü
  useEffect(() => {
    if (!isPlaying) return;
    
    // Oyun döngüsü fonksiyonu
    const gameLoop = () => {
      updateObstacles();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Döngüyü başlat
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    // Engel oluşturma zamanlayıcısı
    obstacleTimerRef.current = setInterval(() => {
      addObstacle();
    }, obstacleFrequency);
    
    // Temizlik fonksiyonu
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
    };
  }, [isPlaying, obstacleFrequency, level, updateObstacles, addObstacle]);
  
  // Klavye olaylarını dinle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Her durumda Space tuşunun scroll etmesini engelle
      if (e.code === 'Space') {
        e.preventDefault();
      }

      if (!isPlaying) {
        // Oyun başlamadığında sadece "R" tuşu ile başlamayı sağla
        // Space tuşunu sadece oyun içinde zıplama için kullan
        if (e.code === 'KeyR') {
          resetGame();
          startGame();
        }
        return;
      }
      
      // Oyun aktifken kontroller
      const { jump, shootBullet } = useGameStore.getState();
      
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault(); // Tarayıcının varsayılan davranışını engelle (scroll)
        jump();
      }
      
      // "X" tuşu ile silah güçlendirmesi aktifken ateş etme
      if ((e.code === 'KeyX' || e.code === 'KeyF') && useGameStore.getState().activePowerup === 'gun') {
        e.preventDefault();
        shootBullet();
      }

      // "R" tuşu ile yeniden başlatma
      if (e.code === 'KeyR') {
        // Oyun bitmişse veya devam ediyorken yeniden başlatabilir
        resetGame();
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isGameOver, startGame, resetGame]);
  
  // Game Over durumu için useEffect
  // NOT: Otomatik ana sayfaya dönüş kaldırıldı
  useEffect(() => {
    // Sadece referans için boş useEffect bırakıldı
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