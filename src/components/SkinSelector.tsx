import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { SKINS, Skin } from '../utils/skins';

interface SkinSelectorProps {
  onClose: () => void;
}

const SkinSelector: React.FC<SkinSelectorProps> = ({ onClose }) => {
  const { currentSkinId, unlockedSkins, totalScore, setSkin } = useGameStore();
  const [selectedSkinId, setSelectedSkinId] = useState(currentSkinId);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewSkin, setPreviewSkin] = useState<Skin | null>(null);
  
  // Skin'i değiştir ve success mesajını göster
  const handleSkinChange = (skinId: string) => {
    // Seçilen skin kilidi açılmış mı kontrol et
    if (unlockedSkins.includes(skinId)) {
      // Eğer zaten seçili ise tekrar seç
      if (selectedSkinId === skinId) {
        setSuccessMessage('Bu karakter zaten kullanılıyor!');
      } else {
        setSelectedSkinId(skinId);
        setSkin(skinId);
        setSuccessMessage('Karakter değiştirildi!');
      }
      
      // 2 saniye sonra mesajı temizle
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    }
  };
  
  // Karakter seçildiğinde önizlemeyi göster
  const handleSkinSelect = (skin: Skin) => {
    // Kilidi açılmış skin'i önizlemede göster
    if (unlockedSkins.includes(skin.id)) {
      // Her zaman seçilen skin'i göster
      setPreviewSkin(skin);
    }
  };
  
  // Özellik etiketleri
  const getSpecialTags = (skin: Skin) => {
    const tags = [];
    
    if (skin.special?.effect === 'glow') {
      tags.push('✨ Parlak Aura');
    }
    
    if (skin.special?.effect === 'sparkle') {
      tags.push('💥 Mistik Güç');
    }
    
    if (skin.id === 'legendary') {
      tags.push('🏆 +100 Başlangıç Puanı');
    }
    
    if (skin.id === 'ninja') {
      tags.push('💨 Yüksek Hız');
    }
    
    if (skin.id === 'robot') {
      tags.push('🤖 Yapay Zeka');
    }
    
    if (skin.id === 'cosmic') {
      tags.push('🌌 Kozmik Güç');
    }
    
    if (skin.id === 'phoenix') {
      tags.push('🔥 Yeniden Doğuş');
    }
    
    return tags;
  };
  
  // Önizleme bölümü - memorized component ve pozisyon sabitlenmiş
  const PreviewSection = useMemo(() => {
    if (!previewSkin) return null;
    
    return (
      <div
        className="preview-section"
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          border: '1px solid #eaeaea',
          opacity: unlockedSkins.includes(previewSkin.id) ? 1 : 0.7,
          height: '200px', // Sabit yükseklik ekle
          position: 'relative', // Pozisyonu sabitle
          marginBottom: '20px', // Alt kısımla mesafe ekle
          transition: 'all 0.3s ease-in-out',
          transform: 'translateZ(0)'
        }}
      >
        {/* Karakter görseli */}
        <div
          style={{
            width: '100px',
            height: '120px',
            backgroundColor: previewSkin.mainColor,
            borderRadius: previewSkin.headShape || '50% 50% 0 0',
            position: 'relative',
            boxShadow: previewSkin.special && previewSkin.special.effect === 'glow' 
              ? `0 0 20px 8px ${previewSkin.special.effectColor}` 
              : '0 5px 15px rgba(0, 0, 0, 0.2)',
            animation: previewSkin.special && previewSkin.special.effect === 'sparkle' 
              ? 'pulse 1.5s infinite' 
              : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Göz */}
          <div
            style={{
              position: 'absolute',
              top: '25px',
              left: '30px',
              width: '35px',
              height: '18px',
              backgroundColor: previewSkin.eyeColor || 'white',
              borderRadius: '50%'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '20px',
                width: '12px',
                height: '12px',
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
              left: '25px',
              width: '15px',
              height: '25px',
              backgroundColor: previewSkin.secondaryColor,
              borderRadius: '0 0 5px 5px'
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '25px',
              width: '15px',
              height: '25px',
              backgroundColor: previewSkin.secondaryColor,
              borderRadius: '0 0 5px 5px'
            }}
          />
        </div>
        
        {/* Karakter bilgileri */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px', color: '#333', fontSize: '22px' }}>
            {previewSkin.name}
          </h3>
          
          <p style={{ margin: '0 0 15px', color: '#666', fontSize: '15px' }}>
            {previewSkin.description}
          </p>
          
          {/* Özellik etiketleri */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {getSpecialTags(previewSkin).map((tag, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: tag.includes('✨') ? '#e3f2fd' : 
                                tag.includes('💥') ? '#fce4ec' :
                                tag.includes('🏆') ? '#fef9e7' :
                                tag.includes('💨') ? '#e8f5e9' :
                                tag.includes('🤖') ? '#e0f2f1' :
                                tag.includes('🌌') ? '#ede7f6' :
                                tag.includes('🔥') ? '#fff3e0' : '#e9f5ff',
                  color: tag.includes('✨') ? '#1976d2' : 
                        tag.includes('💥') ? '#c2185b' :
                        tag.includes('🏆') ? '#f39c12' :
                        tag.includes('💨') ? '#388e3c' :
                        tag.includes('🤖') ? '#00796b' :
                        tag.includes('🌌') ? '#512da8' :
                        tag.includes('🔥') ? '#e65100' : '#0077cc',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: tag.includes('✨') ? '1px solid #bbdefb' : 
                          tag.includes('💥') ? '1px solid #f8bbd0' :
                          tag.includes('🏆') ? '1px solid #fff59d' :
                          tag.includes('💨') ? '1px solid #c8e6c9' :
                          tag.includes('🤖') ? '1px solid #b2dfdb' :
                          tag.includes('🌌') ? '1px solid #d1c4e9' :
                          tag.includes('🔥') ? '1px solid #ffe0b2' : '1px solid #cce5ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  textShadow: '0 1px 1px rgba(0,0,0,0.05)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transform: 'translateZ(0)',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {tag}
              </span>
            ))}
            
            {!unlockedSkins.includes(previewSkin.id) && (
              <span 
                style={{
                  backgroundColor: '#fff2cc',
                  color: '#856404',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '1px solid #ffe8a1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{fontSize: '14px'}}>🔒</span>
                Gerekli Puan: {previewSkin.unlockScore}
              </span>
            )}
          </div>
        </div>
        
        {/* Seçme butonu */}
        {unlockedSkins.includes(previewSkin.id) && (
          <button
            onClick={() => handleSkinChange(previewSkin.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedSkinId === previewSkin.id ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              opacity: selectedSkinId === previewSkin.id ? 0.8 : 1,
              minWidth: '120px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: 'translateZ(0)',
              willChange: 'transform, background-color, box-shadow'
            }}
            onMouseOver={(e) => {
              if (selectedSkinId !== previewSkin.id) {
                e.currentTarget.style.backgroundColor = '#0069d9';
              } else {
                e.currentTarget.style.backgroundColor = '#218838';
              }
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateZ(0) translateY(-2px)';
            }}
            onMouseOut={(e) => {
              if (selectedSkinId !== previewSkin.id) {
                e.currentTarget.style.backgroundColor = '#007bff';
              } else {
                e.currentTarget.style.backgroundColor = '#28a745';
              }
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateZ(0)';
            }}
          >
            {selectedSkinId === previewSkin.id ? 'Aktif Karakter' : 'Bu Karakteri Seç'}
          </button>
        )}
        
        {!unlockedSkins.includes(previewSkin.id) && (
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#f1f1f1',
                borderRadius: '5px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (totalScore / previewSkin.unlockScore) * 100)}%`,
                  height: '100%',
                  backgroundColor: '#3498db',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {Math.floor((totalScore / previewSkin.unlockScore) * 100)}% Tamamlandı
            </span>
          </div>
        )}
      </div>
    );
  }, [previewSkin, selectedSkinId, unlockedSkins, totalScore]);
  
  // Seçili karakter için önizleme göster veya çalışma anında varsayılan önizlemeyi ayarla
  useEffect(() => {
    // Varsayılan olarak seçili skin'i önizlemede göster
    const selectedSkin = SKINS.find(skin => skin.id === selectedSkinId);
    if (selectedSkin) {
      setPreviewSkin(selectedSkin);
    }
  }, []); // Sadece başlangıçta çalışsın
  
  return (
    <div
      className="skin-selector"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
        willChange: 'transform' // Performans iyileştirmesi
      }}
    >
      <div
        className="skin-selector-content"
        style={{
          backgroundColor: '#fff',
          borderRadius: '15px',
          padding: '30px',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#333',
              fontSize: '28px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '50%',
                marginRight: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
              }}
            >
              👤
            </span>
            Kahramanlar Galerisi
          </h2>
          
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(240, 240, 240, 0.95)',
              border: '1px solid #ddd',
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#444',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transform: 'translateZ(0)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#ff3b30';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.border = '1px solid #ff3b30';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(240, 240, 240, 0.95)';
              e.currentTarget.style.color = '#444';
              e.currentTarget.style.border = '1px solid #ddd';
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Başarı mesajı ve toplam puan */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              backgroundColor: '#f5f8ff',
              padding: '12px 20px',
              borderRadius: '10px',
              border: '1px solid #e1e8ff'
            }}
          >
            <span style={{ fontWeight: 'bold', color: '#555' }}>Toplam Puan:</span> 
            <span style={{ color: '#4361ee', fontWeight: 'bold', marginLeft: '5px', fontSize: '18px' }}>
              {totalScore}
            </span>
          </div>
          
          <div
            style={{
              height: '24px',
              transition: 'opacity 0.3s',
              opacity: successMessage ? 1 : 0,
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '16px' }}>✔</span>
            {successMessage}
          </div>
        </div>
        
        {/* Karakter önizleme alanı */}
        {PreviewSection}
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
            willChange: 'transform' // Performans iyileştirmesi
          }}
        >
          {SKINS.map((skin) => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isSelected = selectedSkinId === skin.id;
            
            return (
              <div
                key={skin.id}
                className="skin-card"
                style={{
                  border: `2px solid ${isSelected ? '#28a745' : isUnlocked ? '#ddd' : '#f8d7da'}`,
                  borderRadius: '12px',
                  padding: '20px 15px',
                  textAlign: 'center',
                  opacity: isUnlocked ? 1 : 0.8,
                  cursor: isUnlocked ? 'pointer' : 'default',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  backgroundColor: isSelected ? '#f8fff9' : '#fff',
                  boxShadow: isSelected 
                    ? '0 5px 15px rgba(40, 167, 69, 0.2)' 
                    : '0 3px 10px rgba(0, 0, 0, 0.1)',
                  transform: isSelected ? 'translateY(-5px) translateZ(0)' : 'translateZ(0)',
                  willChange: 'transform, box-shadow'
                }}
                onClick={() => {
                  if (isUnlocked) {
                    // Sadece önizleme için seç
                    handleSkinSelect(skin);
                  }
                }}
              >
                {/* Kilit veya seçili simge */}
                {!isUnlocked && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    🔒
                  </div>
                )}
                
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    ✔
                  </div>
                )}
                
                {/* Karakter Önizleme / Skin Preview */}
                <div
                  style={{
                    width: '60px',
                    height: '70px',
                    backgroundColor: skin.mainColor,
                    borderRadius: skin.headShape || '50% 50% 0 0',
                    margin: '0 auto 15px',
                    position: 'relative',
                    boxShadow: skin.special && skin.special.effect === 'glow' 
                      ? `0 0 15px 5px ${skin.special.effectColor}` 
                      : '0 5px 15px rgba(0, 0, 0, 0.2)',
                    animation: skin.special && skin.special.effect === 'sparkle' 
                      ? 'pulse 1.5s infinite' 
                      : 'none'
                  }}
                >
                  {/* Göz */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '15px',
                      left: '20px',
                      width: '20px',
                      height: '10px',
                      backgroundColor: skin.eyeColor || 'white',
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
                      left: '15px',
                      width: '10px',
                      height: '15px',
                      backgroundColor: skin.secondaryColor,
                      borderRadius: '0 0 5px 5px'
                    }}
                  />
                  
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '15px',
                      width: '10px',
                      height: '15px',
                      backgroundColor: skin.secondaryColor,
                      borderRadius: '0 0 5px 5px'
                    }}
                  />
                </div>
                
                <h4 
                  style={{
                    margin: '0 0 8px',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {skin.name}
                </h4>
                
                {/* Kilidi açık değilse gerekli puanı göster */}
                {!isUnlocked ? (
                  <div
                    style={{
                      fontSize: '14px',
                      marginTop: '10px'
                    }}
                  >
                    <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#dc3545' }}>
                      {skin.unlockScore} Puan Gerekli
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f1f1f1',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, (totalScore / skin.unlockScore) * 100)}%`,
                          height: '100%',
                          backgroundColor: '#3498db',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p
                    style={{
                      margin: '10px 0 0',
                      color: isSelected ? '#28a745' : '#666',
                      fontSize: '14px',
                      fontWeight: isSelected ? 'bold' : 'normal'
                    }}
                  >
                    {isSelected ? 'Aktif Karakter' : 'Kilidi Açık'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Alt kısım düzenlemesi */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 28px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transform: 'translateZ(0)',
              willChange: 'transform, box-shadow'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#5a6268';
              e.currentTarget.style.transform = 'translateY(-2px) translateZ(0)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <span style={{ fontSize: '18px' }}>⬅</span>
            Kahramanlar Galerisinden Çık
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinSelector;