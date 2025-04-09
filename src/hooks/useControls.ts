import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Klavye kontrollerini yönetmek için özel hook
 */
export const useControls = () => {
  const {
    isPlaying,
    isGameOver,
    isPaused,
    startGame,
    resumeGame,
    resetGame,
  } = useGameStore();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Her durumda Space tuşunun scroll etmesini engelle
      if (e.code === 'Space') {
        e.preventDefault();
      }

      if (!isPlaying && (e.code === 'Space' || e.code === 'Enter')) {
        // Oyun başlatma
        if (isGameOver) {
          resetGame();
        }
        startGame();
        return;
      }
      
      // Duraklatma kontrolü
      if (e.code === 'KeyP') {
        if (isPlaying && !isPaused) {
          // Oyunu duraklat
          useGameStore.getState().pauseGame();
        } else if (isPlaying && isPaused) {
          // Oyunu devam ettir
          resumeGame();
        }
        return;
      }
      
      // Oyun aktifken ve duraklatılmamışken kontrolleri işle
      if (isPlaying && !isPaused) {
        const { jump } = useGameStore.getState();
        
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault(); // Scrollu engelle
          jump();
        }
      }
    };
    
    // Tuş basma olaylarını dinle
    window.addEventListener('keydown', handleKeyDown);
    
    // Temizlik fonksiyonu
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isGameOver, isPaused, startGame, resumeGame, resetGame]);
  
  // Mobil dokunmatik kontroller için metodlar
  const touchControls = {
    jump: () => {
      if (isPlaying && !isPaused) {
        useGameStore.getState().jump();
      }
    },
  };
  
  return { touchControls };
};
