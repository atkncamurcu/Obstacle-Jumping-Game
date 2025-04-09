import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import SkinSelector from './SkinSelector';
import { SKINS } from '../utils/skins';

interface StartScreenProps {
  isGameOver?: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ isGameOver = false }) => {
  const { startGame, highScore, totalScore, unlockedSkins, score, isGameOver: storeGameOver } = useGameStore();
  const [showSkinSelector, setShowSkinSelector] = useState(false);
  
  return (
    <div
      className="start-screen"
      style={{
        width: '100%',
        maxWidth: '1100px',
        height: '600px',
        margin: '0 auto',
        backgroundColor: '#87CEEB',
        borderRadius: '8px',
        border: '2px solid #333',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Arkaplan Dekorasyonu */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          width: '100%',
          height: '50px',
          backgroundColor: '#8B4513',
          borderTop: '5px solid #556B2F'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '100px',
          width: '30px',
          height: '100px',
          backgroundColor: '#4CAF50',
          borderRadius: '5px 5px 0 0'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '150px',
          width: '40px',
          height: '70px',
          backgroundColor: '#4CAF50',
          borderRadius: '5px 5px 0 0'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '300px',
          width: '25px',
          height: '120px',
          backgroundColor: '#4CAF50',
          borderRadius: '5px 5px 0 0'
        }}
      />
      
      {/* Oyun Başlığı */}
      <h1
        style={{
          fontSize: '46px', // Daha da büyütüldü
          marginBottom: '10px',
          textShadow: '3px 3px 5px rgba(0, 0, 0, 0.5)',
          color: '#FF5722'
        }}
      >
        Engel Atlama Oyunu
      </h1>
      
      <p
        style={{
          fontSize: '18px', // 16px'den büyültüldü
          marginBottom: '30px', // 20px'den büyültüldü
          maxWidth: '600px',
          lineHeight: '1.5',
          color: '#333'
        }}
      >
        Engellerin üzerinden atlayarak puan topla! Ne kadar uzun süre hayatta kalabileceksin?
      </p>
      
      {(isGameOver || storeGameOver) && (
        <>
          <p
            style={{
              fontSize: '26px',
              marginBottom: '12px',
              color: '#FF5252',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(255, 82, 82, 0.4)', 
              letterSpacing: '1px'
            }}
          >
            Oyun Bitti!
          </p>

          <div 
            style={{
              backgroundColor: 'rgba(38, 119, 153, 0.7)',
              padding: '15px 20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '220px',
              textAlign: 'center',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '15px',
                  margin: '0 0 2px',
                  color: '#FFFFFF',
                  fontWeight: 'normal',
                  letterSpacing: '0.5px'
                }}
              >
                Bu Oyundaki Puan
              </p>
              <p
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  margin: '0',
                  color: '#FFEB3B', /* Daha parlak sarı */
                  textShadow: '0 0 10px rgba(255, 235, 59, 0.7)',
                  lineHeight: '1.1'
                }}
              >
                {score}
              </p>
            </div>

            <div style={{height: '1px', background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)', margin: '3px 0'}}></div>

            <div>
              <p
                style={{
                  fontSize: '15px',
                  margin: '0 0 2px',
                  color: '#FFFFFF',
                  fontWeight: 'normal',
                  letterSpacing: '0.5px'
                }}
              >
                Toplam Puan
              </p>
              <p
                style={{
                  fontSize: '26px',
                  fontWeight: 'bold',
                  margin: '0',
                  color: '#8BC34A', /* Daha parlak yeşil */
                  textShadow: '0 0 8px rgba(139, 195, 74, 0.6)',
                  lineHeight: '1.1'
                }}
              >
                {totalScore}
              </p>
            </div>
          </div>
        </>
      )}

      {!(isGameOver || storeGameOver) && highScore > 0 && (
        <p
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#2196F3'
          }}
        >
          En Yüksek Skor: {highScore}
        </p>
      )}

      {!(isGameOver || storeGameOver) && totalScore > 0 && (
        <p
          style={{
            fontSize: '16px',
            marginBottom: '20px', 
            color: '#FF5722'
          }}
        >
          Toplam Puan: {totalScore}
        </p>
      )}
      
      <button
        onClick={startGame}
        style={{
          width: '200px',
          padding: '12px 0',
          fontSize: isGameOver || storeGameOver ? '20px' : '20px',
          backgroundColor: isGameOver || storeGameOver ? '#FF5252' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          zIndex: 10,
          marginBottom: '12px',
          marginTop: '3px',
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        }}
      >
        {isGameOver || storeGameOver ? 'Yeniden Başlat' : 'Oyunu Başlat'}
      </button>

      <button
        onClick={() => setShowSkinSelector(true)}
        style={{
          width: '200px',
          padding: '10px 0',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          zIndex: 10,
          marginBottom: '18px',
          letterSpacing: '0.5px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        }}
      >
        Karakter Seç ({unlockedSkins.length}/{SKINS.length})
      </button>

      {!isGameOver && !storeGameOver && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0', backgroundColor: 'rgba(0, 0, 0, 0.15)', padding: '10px 15px', borderRadius: '10px', width: '190px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: '#333',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#FFF'
            }}>SPACE</span>
            <span style={{ fontSize: '14px', color: '#555' }}>Zıpla</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: '#333',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#FFF'
            }}>R</span>
            <span style={{ fontSize: '14px', color: '#555' }}>Yeniden başlat</span>
          </div>
        </div>
      )}

      {/* Skin seçimi modal'i */}
      {showSkinSelector && <SkinSelector onClose={() => setShowSkinSelector(false)} />}
    </div>
  );
};

export default StartScreen;