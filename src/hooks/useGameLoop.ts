import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Oyun döngüsünü yönetmek için özel hook
 */
export const useGameLoop = () => {
  const {
    isPlaying,
    isPaused,
    updateObstacles,
    addObstacle,
    obstacleFrequency,
    level,
    score
  } = useGameStore();
  
  // requestAnimationFrame için referans
  const animationFrameRef = useRef<number | null>(null);
  
  // Engel oluşturma zamanlayıcısı için referans
  const obstacleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Skor artırma zamanlayıcısı için referans
  const scoreTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ana oyun döngüsü
  useEffect(() => {
    if (!isPlaying || isPaused) return;
    
    // Oyun döngüsü fonksiyonu - her frame'de çalışır
    const gameLoop = () => {
      // Engelleri güncelle ve çarpışma kontrolü yap
      updateObstacles();
      
      // Bir sonraki frame için tekrar çağır
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Döngüyü başlat
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    // Engel oluşturma zamanlayıcısını ayarla
    // Seviye arttıkça engeller daha sık gelecek
    obstacleTimerRef.current = setInterval(() => {
      addObstacle();
    }, obstacleFrequency);
    
    // Temizlik fonksiyonu
    return () => {
      // Animation frame'i iptal et
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Zamanlayıcıları temizle
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
      
      if (scoreTimerRef.current) {
        clearInterval(scoreTimerRef.current);
      }
    };
  }, [isPlaying, isPaused, updateObstacles, addObstacle, obstacleFrequency, level]);
  
  // Oyun durumu değiştiğinde (duraklatıldığında, bittiğinde) temizlik yap
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
      
      if (scoreTimerRef.current) {
        clearInterval(scoreTimerRef.current);
      }
    };
  }, []);
  
  return {
    score,
    level,
  };
};
