import { useGameStore } from '../store/gameStore';
import Player from './Player';
import Obstacle from './Obstacle';
import { getUnlockedSkins } from '../utils/skins';

const GameArea = () => {
  const {
    isPlaying,
    isGameOver,
    obstacles,
    playerPosition,
    level,
    bulletPosition,
    activePowerup,
    score,
    totalScore
  } = useGameStore();
  
  // Game area dimensions
  const GAME_WIDTH = 1000; // Maksimum genişlik
  const GAME_HEIGHT = 550; // Yükseklik
  
  return (
    <div 
      className="game-area"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: `${GAME_WIDTH}px`,
        height: `${GAME_HEIGHT}px`,
        backgroundColor: '#87CEEB', // Sky color
        overflow: 'hidden',
        border: '2px solid #333',
        borderRadius: '8px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Sky Effect (clouds) */}
      <div 
        className="clouds"
        style={{
          position: 'absolute',
          top: '20px',
          left: '100px',
          width: '100px',
          height: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '25px'
        }}
      />
      
      <div 
        className="clouds"
        style={{
          position: 'absolute',
          top: '50px',
          left: '300px',
          width: '120px',
          height: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '30px'
        }}
      />
      
      {/* Game Title (only show when not in start screen) */}
      {!isPlaying && !isGameOver && (
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px', 
            position: 'absolute',
            top: '30px',
            left: '0',
            width: '100%',
            color: '#FF5722',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)'
          }}
        >
          Obstacle Jumping Game
        </div>
      )}
      
      {/* Ground */}
      <div 
        className="ground"
        style={{
          position: 'absolute',
          bottom: '0',
          width: '100%',
          height: '50px',
          backgroundColor: '#8B4513', // Brown ground
          borderTop: '5px solid #556B2F' // Green grass
        }}
      />
      
      {/* Player */}
      <Player />
      
      {/* Obstacles */}
      {obstacles.map(obstacle => (
        <Obstacle 
          key={obstacle.id} 
          obstacle={obstacle} 
        />
      ))}
      
      {/* Bullets (for gun powerup) */}
      {bulletPosition && (
        <div
          style={{
            position: 'absolute',
            left: `${bulletPosition.x}px`,
            bottom: `${50 + bulletPosition.y}px`,
            width: '10px',
            height: '5px',
            backgroundColor: '#E74C3C',
            borderRadius: '2px',
            boxShadow: '0 0 5px rgba(231, 76, 60, 0.8)',
            zIndex: 5
          }}
        />
      )}
      
      {/* Game Over screen */}
      {isGameOver && (
        <div
        className="game-over"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          textAlign: 'center',
          width: '80%',
          maxWidth: '400px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
        }}
        >
        <h2 style={{fontSize: '24px', margin: '0 0 10px', color: '#FF5722'}}>Game Over!</h2>
        <p style={{margin: '0 0 5px', fontSize: '14px'}}>Level: {level}</p>
        <div style={{height: '2px', background: 'linear-gradient(to right, transparent, #FFC107, transparent)', margin: '10px 0'}}></div>
        <p style={{margin: '0 0 5px', fontSize: '20px', fontWeight: 'bold', color: '#FFC107'}}>Score This Game: {score}</p>
        <div style={{height: '2px', background: 'linear-gradient(to right, transparent, #4CAF50, transparent)', margin: '10px 0'}}></div>
        <p style={{margin: '0 0 10px', fontSize: '16px', color: '#4CAF50'}}>Total Score: {totalScore}</p>

        {/* Newly unlocked skins */}
        {getUnlockedSkins(totalScore).length > getUnlockedSkins(totalScore - score).length && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '5px', 
            padding: '10px',
            marginBottom: '15px'
          }}>
            <p style={{margin: '0 0 5px', fontSize: '14px', color: '#3498db'}}>Congratulations! You've unlocked new character(s):</p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
              {getUnlockedSkins(totalScore)
                .filter(skin => getUnlockedSkins(totalScore - score).findIndex(s => s.id === skin.id) === -1)
                .map(skin => (
                  <div key={skin.id} style={{ 
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '10px' 
                  }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      backgroundColor: skin.mainColor,
                      borderRadius: '50%',
                      marginRight: '5px',
                      verticalAlign: 'middle' 
                    }}></span>
                    <span>{skin.name}</span>
                  </div>
                ))
              }
            </div>
          </div>  
        )}

        <div style={{marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px'}}>
          <p style={{margin: '0', fontSize: '14px'}}>
            Press <span style={{backgroundColor: '#333', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold'}}>“R”</span> key to restart.
          </p>
        </div>
        </div>
      )}
      
      {/* Level indicator */}
      <div
        className="level-indicator"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '14px'
        }}
      >
        Level: {level}
      </div>
      
      {/* Active powerup indicator */}
      {activePowerup && (
        <div
          className="active-powerup"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: activePowerup === 'doublePoints' ? 'rgba(255, 193, 7, 0.8)' :
                          activePowerup === 'invisibility' ? 'rgba(76, 175, 80, 0.8)' :
                          activePowerup === 'slowTime' ? 'rgba(33, 150, 243, 0.8)' :
                          activePowerup === 'gun' ? 'rgba(244, 67, 54, 0.8)' :
                          'rgba(156, 39, 176, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            zIndex: 100,
            animation: 'pulsate 2s infinite'
          }}
        >
          {activePowerup === 'doublePoints' && (
            <>
              <span style={{ fontSize: '16px' }}>💰</span>
              <span>2x Points!</span>
            </>
          )}
          {activePowerup === 'invisibility' && (
            <>
              <span style={{ fontSize: '16px' }}>👻</span>
              <span>Invisibility!</span>
            </>
          )}
          {activePowerup === 'slowTime' && (
            <>
              <span style={{ fontSize: '16px' }}>⏰</span>
              <span>Slow Time!</span>
            </>
          )}
          {activePowerup === 'gun' && (
            <>
              <span style={{ fontSize: '16px' }}>🔫</span>
              <span>Gun! (Press X key)</span>
            </>
          )}
          {activePowerup === 'shrinkObstacles' && (
            <>
              <span style={{ fontSize: '16px' }}>🔍</span>
              <span>Small Obstacles!</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GameArea;