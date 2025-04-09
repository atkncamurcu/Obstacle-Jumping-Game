import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSkinById, DEFAULT_SKIN_ID, getUnlockedSkins } from '../utils/skins';

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  passed: boolean;
  hasPowerup?: boolean;
  powerupType?: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints';
  destroyed?: boolean; // Silah güçlendirmesi için
}

export interface PlayerPosition {
  x: number;
  y: number;
}

interface GameState {
  // Game state
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  
  // Player state
  playerPosition: PlayerPosition;
  isJumping: boolean;
  canDoubleJump: boolean; // Flag for double jump
  hasDoubleJumped: boolean; // Has performed double jump?
  
  // Character customization
  currentSkinId: string;
  unlockedSkins: string[];
  totalScore: number; // Total score earned across all games
  
  // Powerups
  activePowerup: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints' | null;
  powerupTimer: number | null;
  bulletPosition: PlayerPosition | null; // Bullet position for gun powerup
  originalObstacleSpeed: number; // Store original speed for slow time
  pointsMultiplier: number; // Points multiplier
  
  // Game scores
  score: number;
  highScore: number;
  
  // Functions for powerups and abilities
  activatePowerup: (powerupType: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles') => void;
  shootBullet: () => void;
  
  // Obstacles
  obstacles: Obstacle[];
  obstacleSpeed: number;
  obstacleFrequency: number;
  
  // Difficulty level
  level: number;
  
  // Methods
  startGame: () => void;
  endGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  
  // Player control
  jump: () => void;
  updatePlayerPosition: (position: Partial<PlayerPosition>) => void;
  
  // Character abilities
  activateAbility: (abilityType: 'triple_jump' | 'shield' | 'magnet' | 'time_warp' | 'teleport' | 'size_change' | 'gravity_shift' | 'dash') => void;
  useAbility: () => void;
  
  // Obstacle management
  addObstacle: () => void;
  removeObstacle: (id: number) => void;
  updateObstacles: () => void;
  
  // Score management
  increaseScore: () => void;
  updateHighScore: () => void;
  
  // Difficulty level
  increaseLevel: () => void;
  
  // Character customization
  setSkin: (skinId: string) => boolean;
  unlockSkin: (skinId: string) => boolean;
  checkAndUnlockSkins: () => void;
}

// Game area dimensions
const GAME_WIDTH = 800;
const GAME_HEIGHT = 350;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 60;
const GROUND_HEIGHT = 50;
const JUMP_HEIGHT = 180;
const JUMP_DURATION = 500; // milisaniye

// Player's position fixed near the left side
const PLAYER_FIXED_X = 150; // Ekranın sol tarafına yakın konumlandırma

// Initial state
const initialState = {
  isPlaying: false,
  isGameOver: false,
  isPaused: false,
  
  playerPosition: { x: PLAYER_FIXED_X, y: 0 }, // Position set near the left side
  isJumping: false,
  canDoubleJump: false,
  hasDoubleJumped: false,
  
  // Character customization
  currentSkinId: DEFAULT_SKIN_ID,
  unlockedSkins: [DEFAULT_SKIN_ID],
  totalScore: 0,
  
  activePowerup: null,
  powerupTimer: null,
  bulletPosition: null,
  originalObstacleSpeed: 5,
  pointsMultiplier: 1,
  
  score: 0,
  highScore: localStorage.getItem('highScore') ? Number(localStorage.getItem('highScore')) : 0,
  
  obstacles: [],
  obstacleSpeed: 5,
  obstacleFrequency: 1500, // milisaniye
  
  level: 1,
};

export const useGameStore = create<GameState>(
  persist(
    (set, get) => ({
      ...initialState,
      
      startGame: () => {
        // Legendary character special starting score check
        const { currentSkinId } = get();
        const startScore = currentSkinId === 'legendary' ? 100 : 0;
        
        set({
          isPlaying: true,
          isGameOver: false,
          isPaused: false,
          score: startScore,
          obstacles: [],
          playerPosition: { x: PLAYER_FIXED_X, y: 0 }, // Starting position near left side
          isJumping: false,
          canDoubleJump: false,
          hasDoubleJumped: false,
          activePowerup: null,
          powerupTimer: null,
          bulletPosition: null,
          originalObstacleSpeed: 5,
          pointsMultiplier: 1,
          level: 1,
          obstacleSpeed: 5,
          obstacleFrequency: 1500,
        });
      },
      
      endGame: () => {
        const { score } = get();
        set({ isPlaying: false, isGameOver: true });
        get().updateHighScore();
        // Game automatically returns to main screen when ended (removed)
      },
      
      pauseGame: () => set({ isPaused: true }),
      
      resumeGame: () => set({ isPaused: false }),
      
      resetGame: () => set({
        ...initialState,
        highScore: get().highScore,
        currentSkinId: get().currentSkinId,
        unlockedSkins: get().unlockedSkins,
        totalScore: get().totalScore
      }),
      
      jump: () => {
        const { 
          isPlaying, 
          isPaused, 
          isJumping, 
          canDoubleJump, 
          hasDoubleJumped
        } = get();
        
        if (!isPlaying || isPaused) return;
        
        // First jump check
        if (!isJumping) {
          // First jump
          set({ 
            isJumping: true, 
            canDoubleJump: true, 
            hasDoubleJumped: false
          });
          
          // Jump up
          const jumpUp = () => {
            const { playerPosition } = get();
            let currentHeight = 0;
            const jumpStep = 10;
            
            const jumpInterval = setInterval(() => {
              if (currentHeight >= JUMP_HEIGHT) {
                clearInterval(jumpInterval);
                jumpDown();
                return;
              }
              
              currentHeight += jumpStep;
              set({ playerPosition: { ...playerPosition, y: currentHeight } });
            }, 20);
          };
          
          // Coming down
          const jumpDown = () => {
            const { playerPosition, hasDoubleJumped } = get();
            let currentHeight = JUMP_HEIGHT;
            const fallStep = 10;
            
            const fallInterval = setInterval(() => {
              const currentState = get();
              
              // If double jump was performed, cancel descent and jump again
              if (currentState.hasDoubleJumped) {
                clearInterval(fallInterval);
                return;
              }
              
              if (currentHeight <= 0) {
                clearInterval(fallInterval);
                set({ 
                  isJumping: false, 
                  canDoubleJump: false,
                  hasDoubleJumped: false,
                  playerPosition: { ...playerPosition, y: 0 }
                });
                return;
              }
              
              currentHeight -= fallStep;
              set({ playerPosition: { ...playerPosition, y: currentHeight } });
            }, 20);
          };
          
          jumpUp();
        } 
        else if (canDoubleJump && !hasDoubleJumped) {
          // Double jump
          set({ hasDoubleJumped: true, canDoubleJump: false });
          
          // Second jump to new height
          const doubleJumpUp = () => {
            const { playerPosition } = get();
            let startHeight = playerPosition.y;
            let targetHeight = startHeight + JUMP_HEIGHT / 1.5; // Shorter second jump
            let currentHeight = startHeight;
            const jumpStep = 10;
            
            const jumpInterval = setInterval(() => {
              if (currentHeight >= targetHeight) {
                clearInterval(jumpInterval);
                doubleJumpDown(targetHeight);
                return;
              }
              
              currentHeight += jumpStep;
              set({ playerPosition: { ...playerPosition, y: currentHeight } });
            }, 20);
          };
          
          // Coming down after second jump
          const doubleJumpDown = (maxHeight: number) => {
            const { playerPosition } = get();
            let currentHeight = maxHeight;
            const fallStep = 10;
            
            const fallInterval = setInterval(() => {
              if (currentHeight <= 0) {
                clearInterval(fallInterval);
                set({ 
                  isJumping: false, 
                  canDoubleJump: false,
                  hasDoubleJumped: false,
                  playerPosition: { ...playerPosition, y: 0 }
                });
                return;
              }
              
              currentHeight -= fallStep;
              set({ playerPosition: { ...playerPosition, y: currentHeight } });
            }, 20);
          };
          
          doubleJumpUp();
        }
      },
      
      updatePlayerPosition: (position) => {
        set({ playerPosition: { ...get().playerPosition, ...position } });
      },
      
      addObstacle: () => {
        const { obstacles, level, activePowerup } = get();
        
        // Obstacle properties based on level
        const minHeight = 30 + level * 5;
        const maxHeight = 70 + level * 5;
        const height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
        
        const width = 30;
        const speed = get().obstacleSpeed;
        
        // Powerup adding probability - only if no active powerup
        const shouldAddPowerup = !activePowerup && Math.random() < 0.3; // %30 olasılık
        
        // Select random powerup type
        let powerupType = undefined;
        if (shouldAddPowerup) {
          const powerupTypes = ['invisibility', 'slowTime', 'gun', 'shrinkObstacles', 'doublePoints'];
          const randomIndex = Math.floor(Math.random() * powerupTypes.length);
          powerupType = powerupTypes[randomIndex] as 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints';
        }
        
        const newObstacle: Obstacle = {
          id: Date.now(),
          x: GAME_WIDTH,
          y: 0, // Will be positioned on the ground
          width,
          height,
          speed,
          passed: false,
          hasPowerup: shouldAddPowerup,
          powerupType: shouldAddPowerup ? powerupType : undefined,
          destroyed: false
        };
        
        set({ obstacles: [...obstacles, newObstacle] });
      },
      
      removeObstacle: (id) => {
        const { obstacles } = get();
        set({ obstacles: obstacles.filter(obstacle => obstacle.id !== id) });
      },
      
      updateObstacles: () => {
        const { 
          obstacles, 
          playerPosition, 
          isPlaying, 
          isPaused, 
          obstacleSpeed, 
          score, 
          isJumping, 
          activePowerup,
          bulletPosition
        } = get();
        
        if (!isPlaying || isPaused) return;
        
        // Update bullet position (if gun powerup is active)
        let updatedBulletPosition = bulletPosition;
        if (bulletPosition) {
          // Bullet movement speed
          const BULLET_SPEED = 10;
          
          // Move bullet forward
          updatedBulletPosition = { ...bulletPosition, x: bulletPosition.x + BULLET_SPEED };
          
          // Clear bullet if it goes off screen
          if (updatedBulletPosition.x > GAME_WIDTH) {
            updatedBulletPosition = null;
          }
          
          // Update bullet position
          set({ bulletPosition: updatedBulletPosition });
        }
        
        // Move obstacles
        const updatedObstacles = obstacles.map(obstacle => {
          // Don't process if obstacle is destroyed
          if (obstacle.destroyed) {
            return { ...obstacle, x: obstacle.x - obstacleSpeed };
          }
          
          // Bullet collision with obstacle check
          if (bulletPosition && 
              bulletPosition.x < obstacle.x + obstacle.width &&
              bulletPosition.x + 10 > obstacle.x && // Mermi genişliği 10px varsayalım
              bulletPosition.y < obstacle.height &&
              bulletPosition.y + 5 > 0) { // Mermi yüksekliği 5px varsayalım
            
            // Obstacle hit, increase score and clear bullet
            get().increaseScore();
            set({ bulletPosition: null });
            
            // Destroy obstacle (make invisible but still count as passed for score)
            return { 
              ...obstacle, 
              x: obstacle.x - obstacleSpeed, 
              destroyed: true,
              passed: true
            };
          }
          
          // If obstacle is passed and not previously counted, increase score
          if (obstacle.x + obstacle.width < playerPosition.x && !obstacle.passed) {
            get().increaseScore();
            return { ...obstacle, x: obstacle.x - obstacleSpeed, passed: true };
          }
          
          // Powerup collection check - when jumping and obstacle has powerup
          if (isJumping && 
              obstacle.hasPowerup && 
              !activePowerup &&
              playerPosition.x < obstacle.x + obstacle.width &&
              playerPosition.x + PLAYER_WIDTH > obstacle.x && 
              playerPosition.y >= obstacle.height) {
          
          // Powerup collected
          if (obstacle.powerupType) {
          get().activatePowerup(obstacle.powerupType);
          }
          
          // Remove powerup
            return { ...obstacle, x: obstacle.x - obstacleSpeed, hasPowerup: false, powerupType: undefined };
          }
          
          return { ...obstacle, x: obstacle.x - obstacleSpeed };
        });
        
        // Remove obstacles that have gone off screen
        const filteredObstacles = updatedObstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
        
        // Collision detection
        const collision = filteredObstacles.some(obstacle => {
          // If obstacle is destroyed, no collision
          if (obstacle.destroyed) return false;
          
          // If invisibility powerup is active, no collision
          if (activePowerup === 'invisibility') return false;
          
          // Simple rectangle collision check
          return (
            playerPosition.x < obstacle.x + obstacle.width &&
            playerPosition.x + PLAYER_WIDTH > obstacle.x &&
            playerPosition.y < obstacle.height &&
            playerPosition.y + PLAYER_HEIGHT > 0
          );
        });
        
        if (collision) {
          get().endGame();
        } else {
          set({ obstacles: filteredObstacles });
        }
      },
      
      increaseScore: () => {
        const { score, level, totalScore, pointsMultiplier } = get();
        
        // Add points based on multiplier
        const basePoints = 10; // Standard points
        const pointsToAdd = basePoints * pointsMultiplier;
        
        const newScore = score + pointsToAdd;
        const newTotalScore = totalScore + pointsToAdd;
        
        set({ score: newScore, totalScore: newTotalScore });
        
        // Increase level every 100 points
        if (Math.floor(newScore / 100) > Math.floor(score / 100)) {
          get().increaseLevel();
        }
        
        // Unlock skins based on new score
        get().checkAndUnlockSkins();
      },
      
      updateHighScore: () => {
        const { score, highScore } = get();
        
        if (score > highScore) {
          localStorage.setItem('highScore', String(score));
          set({ highScore: score });
        }
      },
      
      increaseLevel: () => {
        const { level, obstacleSpeed, obstacleFrequency } = get();
        
        // Level increases as game gets harder
        const newLevel = level + 1;
        const newSpeed = obstacleSpeed + 1;
        const newFrequency = Math.max(500, obstacleFrequency - 100);
        
        set({
          level: newLevel,
          obstacleSpeed: newSpeed,
          obstacleFrequency: newFrequency
        });
      },
      
      // Powerup activation function
      activatePowerup: (powerupType: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints') => {
        const { powerupTimer, obstacleSpeed } = get();
        
        // Clear previous timer if exists
        if (powerupTimer) {
          clearTimeout(powerupTimer);
        }
        
        // Special actions based on powerup type
        if (powerupType === 'slowTime') {
          // Reduce obstacle speed to half
          set({ 
            originalObstacleSpeed: obstacleSpeed,
            obstacleSpeed: obstacleSpeed / 2 
          });
        } else if (powerupType === 'shrinkObstacles') {
          // Shrink obstacles - This is handled in the Obstacle component
        } else if (powerupType === 'gun') {
          // Initial settings for gun powerup
          set({ bulletPosition: null });
        } else if (powerupType === 'doublePoints') {
          // 2x points powerup
          set({ pointsMultiplier: 2 });
        }
        
        // Activate the powerup
        set({ activePowerup: powerupType });
        
        // Deactivate powerup after 10 seconds
        const timer = setTimeout(() => {
          // Cleanup actions when powerup ends
          if (powerupType === 'slowTime') {
            // Restore obstacle speed to original value
            set({ obstacleSpeed: get().originalObstacleSpeed });
          } else if (powerupType === 'doublePoints') {
            // Restore points multiplier
            set({ pointsMultiplier: 1 });
          }
          
          set({ 
            activePowerup: null, 
            powerupTimer: null,
            bulletPosition: null
          });
        }, 10000);
        
        set({ powerupTimer: timer as unknown as number });
      },
      
      // Function for firing with gun powerup
      shootBullet: () => {
        const { activePowerup, playerPosition, bulletPosition } = get();
        
        // If gun powerup isn't active or a bullet already exists, cancel
        if (activePowerup !== 'gun' || bulletPosition) return;
        
        // Create a new bullet from player's position
        set({
          bulletPosition: {
            x: playerPosition.x + PLAYER_WIDTH, // Fire from front of character
            y: playerPosition.y + PLAYER_HEIGHT / 2 // Fire from middle of character
          }
        });
      },
      
      // Character ability activation
      activateAbility: (abilityType) => {
        const { currentSkinId, activeAbility, abilityTimer, abilityLastUsed } = get();
        const currentSkin = getSkinById(currentSkinId);
        
        // If character has no ability, cancel
        if (!currentSkin.ability || currentSkin.ability.type !== abilityType) {
          return;
        }
        
        // Check cooldown time
        const currentTime = Date.now();
        const cooldownTime = currentSkin.ability.cooldown || 10000; // Varsayılan 10 saniye
        
        if (currentTime - abilityLastUsed < cooldownTime) {
          // If cooldown hasn't completed, cancel
          const remainingCooldown = Math.ceil((cooldownTime - (currentTime - abilityLastUsed)) / 1000);
          console.log(`Ability still cooling down. ${remainingCooldown} seconds left.`);
          return;
        }

        // If a previous timer exists, clear it
        if (abilityTimer) {
          clearTimeout(abilityTimer);
        }
        
        // Ability-specific actions
        switch (abilityType) {
          case 'shield':
            // Activate protective shield
            set({ hasShield: true });
            break;
            
          case 'time_warp':
            // Slow down time
            const { obstacleSpeed } = get();
            set({ 
              originalObstacleSpeed: obstacleSpeed,
              obstacleSpeed: obstacleSpeed / 3 // Reduce to one-third
            });
            break;
            
          case 'size_change':
            // Shrink character
            set({ isSmall: true });
            break;
            
          case 'teleport':
            // Teleport character forward
            const { playerPosition } = get();
            set({ 
              playerPosition: { 
                ...playerPosition, 
                x: playerPosition.x + 200 // Teleport 200 pixels forward
              } 
            });
            // Teleport has no duration, close ability immediately
            set({ 
              activeAbility: null,
              abilityLastUsed: currentTime,
              abilityTimer: null
            });
            return; // Yeteneğin süresi olmadığı için erken dön
            
          case 'dash':
            // Quick dash forward
            const dashPosition = get().playerPosition;
            set({ 
              playerPosition: { 
                ...dashPosition, 
                x: dashPosition.x + 150 // Jump 150 pixels forward
              } 
            });
            break;
            
          case 'magnet':
            // Magnet to pull powerups - this logic will be handled in updateObstacles
            break;
            
          case 'triple_jump':
            // Triple jump ability - already handled in jump method
            break;
        }
        
        // Activate the ability
        set({ 
          activeAbility: abilityType,
          abilityLastUsed: currentTime
        });
        
        // If ability has a duration, set a timer
        if (currentSkin.ability.duration) {
          const timer = setTimeout(() => {
            // Cleanup actions at the end of ability duration
            switch (abilityType) {
              case 'shield':
                set({ hasShield: false });
                break;
                
              case 'time_warp':
                // Restore obstacle speed to original value
                set({ obstacleSpeed: get().originalObstacleSpeed });
                break;
                
              case 'size_change':
                // Restore character size to normal
                set({ isSmall: false });
                break;
            }
            
            set({ 
              activeAbility: null, 
              abilityTimer: null
            });
          }, currentSkin.ability.duration);
          
          set({ abilityTimer: timer as unknown as number });
        } else {
          // Set a timer for abilities with no duration (like triple_jump)
          set({ 
            activeAbility: abilityType,
            abilityTimer: null
          });
        }
      },
      
      // Use active ability (when pressed in-game)
      useAbility: () => {
        const { currentSkinId, isPlaying, activeAbility } = get();
        
        if (!isPlaying) return;
        
        const currentSkin = getSkinById(currentSkinId);
        
        // If character has no ability, cancel
        if (!currentSkin.ability) {
          return;
        }
        
        // If ability is already active, cancel
        if (activeAbility) {
          return;
        }
        
        // Activate the ability
        get().activateAbility(currentSkin.ability.type);
      },
      
      // Change character skin
      setSkin: (skinId) => {
        const { unlockedSkins } = get();
        
        // Check if skin is unlocked
        if (unlockedSkins.includes(skinId)) {
          set({ currentSkinId: skinId });
          return true; // Successfully unlocked
        }
        
        return false; // Skin is not unlocked
      },
      
      // Unlock a specific skin
      unlockSkin: (skinId) => {
        const { unlockedSkins } = get();
        
        // Check if already unlocked
        if (unlockedSkins.includes(skinId)) {
          return false;
        }
        
        set({ unlockedSkins: [...unlockedSkins, skinId] });
        return true;
      },
      
      // Check and unlock skins based on total score
      checkAndUnlockSkins: () => {
        const { totalScore } = get();
        const unlockedSkins = getUnlockedSkins(totalScore).map(skin => skin.id);
        set({ unlockedSkins });
      },
    }),
    {
      name: 'obstacle-jumping-game', // localStorage key
      partialize: (state) => ({
        highScore: state.highScore,
        unlockedSkins: state.unlockedSkins,
        currentSkinId: state.currentSkinId,
        totalScore: state.totalScore
      }),
    }
  )
);