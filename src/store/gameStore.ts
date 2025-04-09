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
  // Oyun durumu
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  
  // Oyuncu durumu
  playerPosition: PlayerPosition;
  isJumping: boolean;
  canDoubleJump: boolean; // Çift zıplama için flag
  hasDoubleJumped: boolean; // Çift zıplama yaptı mı?
  
  // Karakter kişiselleştirme
  currentSkinId: string;
  unlockedSkins: string[];
  totalScore: number; // Tüm oyunlarda kazanılan toplam puan
  
  // Güçlendirmeler
  activePowerup: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints' | null;
  powerupTimer: number | null;
  bulletPosition: PlayerPosition | null; // Silah güçlendirmesi için mermi pozisyonu
  originalObstacleSpeed: number; // Zaman yavaşlatma için orijinal hızı sakla
  pointsMultiplier: number; // Puan çarpanı
  
  // Oyun skorları
  score: number;
  highScore: number;
  
  // Güçlendirmeler ve yetenekler için fonksiyonlar
  activatePowerup: (powerupType: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles') => void;
  shootBullet: () => void;
  
  // Engeller
  obstacles: Obstacle[];
  obstacleSpeed: number;
  obstacleFrequency: number;
  
  // Zorluk seviyesi
  level: number;
  
  // Metodlar
  startGame: () => void;
  endGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  
  // Oyuncu kontrolü
  jump: () => void;
  updatePlayerPosition: (position: Partial<PlayerPosition>) => void;
  
  // Karakter yetenekleri
  activateAbility: (abilityType: 'triple_jump' | 'shield' | 'magnet' | 'time_warp' | 'teleport' | 'size_change' | 'gravity_shift' | 'dash') => void;
  useAbility: () => void;
  
  // Engel yönetimi
  addObstacle: () => void;
  removeObstacle: (id: number) => void;
  updateObstacles: () => void;
  
  // Skor yönetimi
  increaseScore: () => void;
  updateHighScore: () => void;
  
  // Seviye zorluğu
  increaseLevel: () => void;
  
  // Karakter kişiselleştirme
  setSkin: (skinId: string) => boolean;
  unlockSkin: (skinId: string) => boolean;
  checkAndUnlockSkins: () => void;
}

// Oyun alanı boyutları
const GAME_WIDTH = 800;
const GAME_HEIGHT = 350;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 60;
const GROUND_HEIGHT = 50;
const JUMP_HEIGHT = 180;
const JUMP_DURATION = 500; // milisaniye

// Oyuncunun sol tarafa yakın konumu
const PLAYER_FIXED_X = 150; // Ekranın sol tarafına yakın konumlandırma

// Initial state
const initialState = {
  isPlaying: false,
  isGameOver: false,
  isPaused: false,
  
  playerPosition: { x: PLAYER_FIXED_X, y: 0 }, // Konumu sol tarafa yakın olarak ayarlandı
  isJumping: false,
  canDoubleJump: false,
  hasDoubleJumped: false,
  
  // Karakter kişiselleştirme
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
        // Efsanevi karakter için özel bir başlangıç puanı kontrolü
        const { currentSkinId } = get();
        const startScore = currentSkinId === 'legendary' ? 100 : 0;
        
        set({
          isPlaying: true,
          isGameOver: false,
          isPaused: false,
          score: startScore,
          obstacles: [],
          playerPosition: { x: PLAYER_FIXED_X, y: 0 }, // Başlangıç konumu sol tarafa yakın
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
        // Oyun sona erdiğinde ana sayfaya otomatik dönüş kaldırıldı
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
        
        // İlk zıplama kontrolü
        if (!isJumping) {
          // İlk zıplama
          set({ 
            isJumping: true, 
            canDoubleJump: true, 
            hasDoubleJumped: false
          });
          
          // Yukarı zıplama
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
          
          // Aşağı inme
          const jumpDown = () => {
            const { playerPosition, hasDoubleJumped } = get();
            let currentHeight = JUMP_HEIGHT;
            const fallStep = 10;
            
            const fallInterval = setInterval(() => {
              const currentState = get();
              
              // Eğer çift zıplama yapıldıysa, inişi iptal et ve tekrar zıpla
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
          // Çift zıplama
          set({ hasDoubleJumped: true, canDoubleJump: false });
          
          // İkinci zıplama için yeni yüksekliğe çık
          const doubleJumpUp = () => {
            const { playerPosition } = get();
            let startHeight = playerPosition.y;
            let targetHeight = startHeight + JUMP_HEIGHT / 1.5; // Daha kısa bir ikinci zıplama
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
          
          // İkinci zıplamadan sonra aşağı inme
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
        
        // Seviyeye göre engel özellikleri
        const minHeight = 30 + level * 5;
        const maxHeight = 70 + level * 5;
        const height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
        
        const width = 30;
        const speed = get().obstacleSpeed;
        
        // Güçlendirme ekleme olasılığı - eğer aktif güçlendirme yoksa
        const shouldAddPowerup = !activePowerup && Math.random() < 0.3; // %30 olasılık
        
        // Rastgele güçlendirme tipi seç
        let powerupType = undefined;
        if (shouldAddPowerup) {
          const powerupTypes = ['invisibility', 'slowTime', 'gun', 'shrinkObstacles', 'doublePoints'];
          const randomIndex = Math.floor(Math.random() * powerupTypes.length);
          powerupType = powerupTypes[randomIndex] as 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints';
        }
        
        const newObstacle: Obstacle = {
          id: Date.now(),
          x: GAME_WIDTH,
          y: 0, // Yerde olacak şekilde
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
        
        // Mermi pozisyonunu güncelle (eğer silah güçlendirmesi aktifse)
        let updatedBulletPosition = bulletPosition;
        if (bulletPosition) {
          // Mermi hareket hızı
          const BULLET_SPEED = 10;
          
          // Mermiyi ileri hareket ettir
          updatedBulletPosition = { ...bulletPosition, x: bulletPosition.x + BULLET_SPEED };
          
          // Mermi ekranın dışına çıktıysa temizle
          if (updatedBulletPosition.x > GAME_WIDTH) {
            updatedBulletPosition = null;
          }
          
          // Mermi pozisyonunu güncelle
          set({ bulletPosition: updatedBulletPosition });
        }
        
        // Engelleri hareket ettir
        const updatedObstacles = obstacles.map(obstacle => {
          // Eğer engel yok edilmişse işlem yapma
          if (obstacle.destroyed) {
            return { ...obstacle, x: obstacle.x - obstacleSpeed };
          }
          
          // Mermi ile engel çarpışma kontrolü
          if (bulletPosition && 
              bulletPosition.x < obstacle.x + obstacle.width &&
              bulletPosition.x + 10 > obstacle.x && // Mermi genişliği 10px varsayalım
              bulletPosition.y < obstacle.height &&
              bulletPosition.y + 5 > 0) { // Mermi yüksekliği 5px varsayalım
            
            // Engel vuruldu, skoru artır ve mermiyi temizle
            get().increaseScore();
            set({ bulletPosition: null });
            
            // Engeli yok et (görünmez yap ama skor için hala geçilmiş sayılsın)
            return { 
              ...obstacle, 
              x: obstacle.x - obstacleSpeed, 
              destroyed: true,
              passed: true
            };
          }
          
          // Eğer engel geçildiyse ve daha önce sayılmadıysa skoru artır
          if (obstacle.x + obstacle.width < playerPosition.x && !obstacle.passed) {
            get().increaseScore();
            return { ...obstacle, x: obstacle.x - obstacleSpeed, passed: true };
          }
          
          // Güçlendirme alma kontrolü - zıplama durumunda ve engelin üzerinde güçlendirme varsa
          if (isJumping && 
              obstacle.hasPowerup && 
              !activePowerup &&
              playerPosition.x < obstacle.x + obstacle.width &&
              playerPosition.x + PLAYER_WIDTH > obstacle.x && 
              playerPosition.y >= obstacle.height) {
          
          // Güçlendirme toplandı
          if (obstacle.powerupType) {
          get().activatePowerup(obstacle.powerupType);
          }
          
          // Güçlendirmeyi kaldır
            return { ...obstacle, x: obstacle.x - obstacleSpeed, hasPowerup: false, powerupType: undefined };
          }
          
          return { ...obstacle, x: obstacle.x - obstacleSpeed };
        });
        
        // Ekrandan çıkan engelleri temizle
        const filteredObstacles = updatedObstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
        
        // Çarpışma kontrolü
        const collision = filteredObstacles.some(obstacle => {
          // Eğer engel yok edilmişse çarpışma yok
          if (obstacle.destroyed) return false;
          
          // Eğer görünmezlik güçlendirmesi aktifse çarpışma yok
          if (activePowerup === 'invisibility') return false;
          
          // Basit bir dikdörtgen çarpışma kontrolü
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
        
        // Puan çarpanına göre puan ekleme
        const basePoints = 10; // Standart puan
        const pointsToAdd = basePoints * pointsMultiplier;
        
        const newScore = score + pointsToAdd;
        const newTotalScore = totalScore + pointsToAdd;
        
        set({ score: newScore, totalScore: newTotalScore });
        
        // Her 100 puanda bir seviye yükselt
        if (Math.floor(newScore / 100) > Math.floor(score / 100)) {
          get().increaseLevel();
        }
        
        // Yeni puana göre skinlerin kilidini aç
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
        
        // Seviye arttıkça oyun zorlaşır
        const newLevel = level + 1;
        const newSpeed = obstacleSpeed + 1;
        const newFrequency = Math.max(500, obstacleFrequency - 100);
        
        set({
          level: newLevel,
          obstacleSpeed: newSpeed,
          obstacleFrequency: newFrequency
        });
      },
      
      // Güçlendirmeyi aktif etme fonksiyonu
      activatePowerup: (powerupType: 'invisibility' | 'slowTime' | 'gun' | 'shrinkObstacles' | 'doublePoints') => {
        const { powerupTimer, obstacleSpeed } = get();
        
        // Eğer önceki bir zamanlayıcı varsa temizle
        if (powerupTimer) {
          clearTimeout(powerupTimer);
        }
        
        // Güçlendirme tipine göre özel işlemler
        if (powerupType === 'slowTime') {
          // Engel hızını yarıya düşür
          set({ 
            originalObstacleSpeed: obstacleSpeed,
            obstacleSpeed: obstacleSpeed / 2 
          });
        } else if (powerupType === 'shrinkObstacles') {
          // Engelleri küçült - Bu işlem Obstacle bileşeninde yapılacak
        } else if (powerupType === 'gun') {
          // Silah güçlendirmesi için gerekli başlangıç ayarları
          set({ bulletPosition: null });
        } else if (powerupType === 'doublePoints') {
          // 2 katı puan güçlendirmesi
          set({ pointsMultiplier: 2 });
        }
        
        // Güçlendirmeyi aktif et
        set({ activePowerup: powerupType });
        
        // 10 saniye sonra güçlendirmeyi kapat
        const timer = setTimeout(() => {
          // Güçlendirme sonunda yapılacak temizlikler
          if (powerupType === 'slowTime') {
            // Engel hızını orijinal değerine geri döndür
            set({ obstacleSpeed: get().originalObstacleSpeed });
          } else if (powerupType === 'doublePoints') {
            // Puan çarpanını geri döndür
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
      
      // Silah güçlendirmesi için ateş etme fonksiyonu
      shootBullet: () => {
        const { activePowerup, playerPosition, bulletPosition } = get();
        
        // Silah güçlendirmesi aktif değilse veya mevcut bir mermi varsa işlemi iptal et
        if (activePowerup !== 'gun' || bulletPosition) return;
        
        // Oyuncunun pozisyonundan yeni bir mermi oluştur
        set({
          bulletPosition: {
            x: playerPosition.x + PLAYER_WIDTH, // Karakterin önünden ateş et
            y: playerPosition.y + PLAYER_HEIGHT / 2 // Karakterin ortasından ateş et
          }
        });
      },
      
      // Karakter yeteneği aktivasyonu
      activateAbility: (abilityType) => {
        const { currentSkinId, activeAbility, abilityTimer, abilityLastUsed } = get();
        const currentSkin = getSkinById(currentSkinId);
        
        // Karakterin yeteneği yoksa işlemi iptal et
        if (!currentSkin.ability || currentSkin.ability.type !== abilityType) {
          return;
        }
        
        // Soğuma süresini kontrol et
        const currentTime = Date.now();
        const cooldownTime = currentSkin.ability.cooldown || 10000; // Varsayılan 10 saniye
        
        if (currentTime - abilityLastUsed < cooldownTime) {
          // Soğuma süresi dolmamışsa işlemi iptal et
          const remainingCooldown = Math.ceil((cooldownTime - (currentTime - abilityLastUsed)) / 1000);
          console.log(`Yetenek hala soğumada. ${remainingCooldown} saniye kaldı.`);
          return;
        }

        // Eğer önceki bir zamanlayıcı varsa temizle
        if (abilityTimer) {
          clearTimeout(abilityTimer);
        }
        
        // Yeteneklere özel işlemler
        switch (abilityType) {
          case 'shield':
            // Koruyucu kalkan aktif et
            set({ hasShield: true });
            break;
            
          case 'time_warp':
            // Zamanı yavaşlat
            const { obstacleSpeed } = get();
            set({ 
              originalObstacleSpeed: obstacleSpeed,
              obstacleSpeed: obstacleSpeed / 3 // Üçte birine düşür
            });
            break;
            
          case 'size_change':
            // Karakteri küçült
            set({ isSmall: true });
            break;
            
          case 'teleport':
            // Karakteri ileri ışınla
            const { playerPosition } = get();
            set({ 
              playerPosition: { 
                ...playerPosition, 
                x: playerPosition.x + 200 // 200 piksel ileri ışınlan
              } 
            });
            // Teleport için yeteneği hemen kapat, süre yok
            set({ 
              activeAbility: null,
              abilityLastUsed: currentTime,
              abilityTimer: null
            });
            return; // Yeteneğin süresi olmadığı için erken dön
            
          case 'dash':
            // Hızlı koşma
            const dashPosition = get().playerPosition;
            set({ 
              playerPosition: { 
                ...dashPosition, 
                x: dashPosition.x + 150 // 150 piksel ileri atla
              } 
            });
            break;
            
          case 'magnet':
            // Güçlendirmeleri çek - bu mantik updateObstacles içinde işlenecek
            break;
            
          case 'triple_jump':
            // Üç kez zıplama yeteneği - bu zaten jump metodu içinde işleniyor
            break;
        }
        
        // Yeteneği aktif et
        set({ 
          activeAbility: abilityType,
          abilityLastUsed: currentTime
        });
        
        // Yeteneğin süresi varsa zamanlayıcı kur
        if (currentSkin.ability.duration) {
          const timer = setTimeout(() => {
            // Yetenek süresinin sonunda temizlik işlemleri
            switch (abilityType) {
              case 'shield':
                set({ hasShield: false });
                break;
                
              case 'time_warp':
                // Engel hızını orijinal değerine geri döndür
                set({ obstacleSpeed: get().originalObstacleSpeed });
                break;
                
              case 'size_change':
                // Karakteri normal boyuta geri getir
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
          // Süresi olmayan yetenekler için (triple_jump gibi) direkt aktif et
          set({ 
            activeAbility: abilityType,
            abilityTimer: null
          });
        }
      },
      
      // Aktif yeteneği kullan (oyun içi bir tuşa basıldığında)
      useAbility: () => {
        const { currentSkinId, isPlaying, activeAbility } = get();
        
        if (!isPlaying) return;
        
        const currentSkin = getSkinById(currentSkinId);
        
        // Karakterin yeteneği yoksa işlemi iptal et
        if (!currentSkin.ability) {
          return;
        }
        
        // Eğer yetenek zaten aktifse, işlemi iptal et
        if (activeAbility) {
          return;
        }
        
        // Yeteneği aktif et
        get().activateAbility(currentSkin.ability.type);
      },
      
      // Karakter skin'ini değiştir
      setSkin: (skinId) => {
        const { unlockedSkins } = get();
        
        // Skin kilidi açılmış mı kontrol et
        if (unlockedSkins.includes(skinId)) {
          set({ currentSkinId: skinId });
          return true;
        }
        
        return false; // Skin kilidi açılmamış
      },
      
      // Belirli bir skin'in kilidini aç
      unlockSkin: (skinId) => {
        const { unlockedSkins } = get();
        
        // Zaten kilidi açılmış mı kontrol et
        if (unlockedSkins.includes(skinId)) {
          return false;
        }
        
        set({ unlockedSkins: [...unlockedSkins, skinId] });
        return true;
      },
      
      // Toplam puana göre açılabilecek skinleri kontrol et ve aç
      checkAndUnlockSkins: () => {
        const { totalScore } = get();
        const unlockedSkins = getUnlockedSkins(totalScore).map(skin => skin.id);
        set({ unlockedSkins });
      },
    }),
    {
      name: 'engel-atlama-oyunu', // localStorage key
      partialize: (state) => ({
        highScore: state.highScore,
        unlockedSkins: state.unlockedSkins,
        currentSkinId: state.currentSkinId,
        totalScore: state.totalScore
      }),
    }
  )
);