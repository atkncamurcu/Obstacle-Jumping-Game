import { useGameStore } from '../store/gameStore';
import { getSkinById } from '../utils/skins';

const Player = () => {
  const { playerPosition, isJumping, activePowerup, hasDoubleJumped, currentSkinId } = useGameStore();
  
  // Seçilen skin'i al
  const selectedSkin = getSkinById(currentSkinId);
  
  // Oyuncu boyutları
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 60; // Yüksekliği biraz artır
  const GROUND_HEIGHT = 50; // GameArea'daki ground yüksekliği
  
  return (
    <div
      className="player"
      style={{
        position: 'absolute',
        left: `${playerPosition.x}px`,
        bottom: `${GROUND_HEIGHT + playerPosition.y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
        backgroundColor: selectedSkin.mainColor, // Skin rengini uygula
        borderRadius: selectedSkin.headShape || '50% 50% 0 0', // Kafa şeklini uygula
        transition: isJumping ? 'none' : 'left 0.1s ease-out', // Sadece yatay hareket için smooth transition
        zIndex: 10,
        // Görünmezlik güçlendirmesi için opasite
        opacity: activePowerup === 'invisibility' ? 0.5 : 1,
        // Görünmezlik güçlendirmesi ve çift zıplama için parlama efekti
        boxShadow: activePowerup === 'invisibility' 
          ? '0 0 20px 10px rgba(0, 191, 255, 0.7)' 
          : hasDoubleJumped
          ? '0 0 15px 5px rgba(255, 215, 0, 0.8)' // Çift zıplama için altın parıltısı
          : selectedSkin.special && selectedSkin.special.effect === 'glow'
          ? `0 0 15px 5px ${selectedSkin.special.effectColor}` // Özel skin efekti
          : '0 5px 15px rgba(0, 0, 0, 0.3)',
        animation: hasDoubleJumped 
          ? 'pulse 0.5s infinite' 
          : selectedSkin.special && selectedSkin.special.effect === 'sparkle' 
          ? 'pulse 1.5s infinite' 
          : 'none' // Çift zıplama veya özel skin efekti için animasyon
      }}
    >
      {/* Göz */}
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          left: '15px',
          width: '20px',
          height: '10px',
          backgroundColor: selectedSkin.eyeColor || 'white',
          borderRadius: '50%'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '2px',
            left: '12px',
            width: '6px',
            height: '6px',
            backgroundColor: 'black',
            borderRadius: '50%'
          }}
        />
      </div>
      
      {/* Bacaklar */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '10px',
          width: '10px',
          height: '15px',
          backgroundColor: selectedSkin.secondaryColor, // Bacaklar için ikincil renk
          borderRadius: '0 0 5px 5px'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '10px',
          width: '10px',
          height: '15px',
          backgroundColor: selectedSkin.secondaryColor, // Bacaklar için ikincil renk
          borderRadius: '0 0 5px 5px'
        }}
      />
    </div>
  );
};

export default Player;