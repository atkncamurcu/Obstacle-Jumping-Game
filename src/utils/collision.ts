import { PlayerPosition, Obstacle } from '../store/gameStore';

// Oyuncu ve engel boyutlarını tanımla
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const GROUND_HEIGHT = 50;

/**
 * İki dikdörtgen arasında çarpışma kontrolü yapar
 */
export const detectRectangleCollision = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

/**
 * Oyuncu ve engel arasında çarpışma kontrolü yapar
 */
export const checkPlayerObstacleCollision = (
  playerPosition: PlayerPosition,
  obstacle: Obstacle
) => {
  // Oyuncu dikdörtgenini oluştur
  const playerRect = {
    x: playerPosition.x,
    y: GROUND_HEIGHT + playerPosition.y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  };
  
  // Engel dikdörtgenini oluştur
  const obstacleRect = {
    x: obstacle.x,
    y: GROUND_HEIGHT,
    width: obstacle.width,
    height: obstacle.height,
  };
  
  // Çarpışma kontrolü
  return detectRectangleCollision(playerRect, obstacleRect);
};

/**
 * Tüm engeller için çarpışma kontrolü yapar
 */
export const checkCollisions = (
  playerPosition: PlayerPosition,
  obstacles: Obstacle[]
) => {
  // Herhangi bir engelle çarpışma olup olmadığını kontrol et
  return obstacles.some(obstacle => 
    checkPlayerObstacleCollision(playerPosition, obstacle)
  );
};

/**
 * Engelin oyuncu tarafından geçilip geçilmediğini kontrol eder
 */
export const isObstaclePassed = (
  playerPosition: PlayerPosition,
  obstacle: Obstacle
) => {
  // Engelin sağ kenarı oyuncunun sol kenarından daha solda ise, engel geçilmiştir
  return obstacle.x + obstacle.width < playerPosition.x && !obstacle.passed;
};
