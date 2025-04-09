import { useState, useEffect, useCallback } from 'react';

/**
 * Ses dosyalarını yönetmek için özel hook
 * @param soundUrl Ses dosyasının URL'i
 * @param options Ses ayarları
 */
export const useGameSound = (
  soundUrl: string,
  options: {
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
  } = {}
) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Ses nesnesini oluştur
  useEffect(() => {
    const audioElement = new Audio(soundUrl);
    
    // Ses ayarlarını uygula
    audioElement.volume = options.volume ?? 0.5;
    audioElement.loop = options.loop ?? false;
    
    // Olayları dinle
    const handleEnded = () => setIsPlaying(false);
    audioElement.addEventListener('ended', handleEnded);
    
    // Otomatik oynatma varsa başlat
    if (options.autoplay) {
      audioElement.play().catch(() => {
        // Tarayıcılar genellikle kullanıcı etkileşimi olmadan
        // ses oynatmayı engeller, bu nedenle hata yakalanır
        console.log('Otomatik oynatma engellendi. Kullanıcı etkileşimi gerekiyor.');
      });
      setIsPlaying(true);
    }
    
    setAudio(audioElement);
    
    // Temizlik fonksiyonu
    return () => {
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, [soundUrl, options.volume, options.loop, options.autoplay]);
  
  // Sesi oynat
  const play = useCallback(() => {
    if (audio) {
      // Sesi baştan başlat
      audio.currentTime = 0;
      
      // Oynat
      audio.play().catch(() => {
        console.log('Ses oynatma engellendi. Kullanıcı etkileşimi gerekiyor.');
      });
      
      setIsPlaying(true);
    }
  }, [audio]);
  
  // Sesi duraklat
  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);
  
  // Sesi durdur (sıfırla)
  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [audio]);
  
  // Ses seviyesini ayarla
  const setVolume = useCallback((volume: number) => {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, [audio]);
  
  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying
  };
};

/**
 * Birden fazla ses dosyasını yönetmek için özel hook
 */
export const useSoundEffects = () => {
  // Sesleri oluşturun (gerçek import edilmiş sesler daha sonra eklenecek)
  const jumpSound = useGameSound('', { volume: 0.4 });
  const collisionSound = useGameSound('', { volume: 0.5 });
  const pointSound = useGameSound('', { volume: 0.3 });
  const backgroundMusic = useGameSound('', { volume: 0.2, loop: true });
  
  // Tüm sesleri yönetmek için bir arayüz döndürün
  return {
    jump: jumpSound.play,
    collision: collisionSound.play,
    point: pointSound.play,
    startMusic: backgroundMusic.play,
    stopMusic: backgroundMusic.stop,
    pauseMusic: backgroundMusic.pause,
    setMusicVolume: backgroundMusic.setVolume
  };
};
