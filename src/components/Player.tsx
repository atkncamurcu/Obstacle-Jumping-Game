import { useGameStore } from '../store/gameStore';
import { getSkinById } from '../utils/skins';

const Player = () => {
  const { playerPosition, isJumping, activePowerup, hasDoubleJumped, currentSkinId } = useGameStore();
  
  // Get the selected skin
  const selectedSkin = getSkinById(currentSkinId);
  
  // Player dimensions
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 60; // Increased height a bit
  const GROUND_HEIGHT = 50; // Ground height in GameArea
  
  return (
    <div
      className="player"
      style={{
        position: 'absolute',
        left: `${playerPosition.x}px`,
        bottom: `${GROUND_HEIGHT + playerPosition.y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
        backgroundColor: selectedSkin.mainColor, // Apply skin color
        borderRadius: selectedSkin.headShape || '50% 50% 0 0', // Apply head shape
        transition: isJumping ? 'none' : 'left 0.1s ease-out', // Smooth transition only for horizontal movement
        zIndex: 10,
        // Opacity for invisibility powerup
        opacity: activePowerup === 'invisibility' ? 0.5 : 1,
        // Glow effect for invisibility powerup and double jump
        boxShadow: activePowerup === 'invisibility' 
          ? '0 0 20px 10px rgba(0, 191, 255, 0.7)' 
          : hasDoubleJumped
          ? '0 0 15px 5px rgba(255, 215, 0, 0.8)' // Gold glow for double jump
          : selectedSkin.special && selectedSkin.special.effect === 'glow'
          ? `0 0 15px 5px ${selectedSkin.special.effectColor}` // Special skin effect
          : '0 5px 15px rgba(0, 0, 0, 0.3)',
        animation: hasDoubleJumped 
          ? 'pulse 0.5s infinite' 
          : selectedSkin.special && selectedSkin.special.effect === 'sparkle' 
          ? 'pulse 1.5s infinite' 
          : 'none' // Animation for double jump or special skin effect
      }}
    >
      {/* Eye */}
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
      
      {/* Legs */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '10px',
          width: '10px',
          height: '15px',
          backgroundColor: selectedSkin.secondaryColor, // Secondary color for legs
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
          backgroundColor: selectedSkin.secondaryColor, // Secondary color for legs
          borderRadius: '0 0 5px 5px'
        }}
      />
    </div>
  );
};

export default Player;