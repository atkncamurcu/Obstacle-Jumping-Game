/**
 * Zıplama animasyonu oluşturur
 * @param startY Başlangıç Y pozisyonu
 * @param jumpHeight Zıplama yüksekliği
 * @param duration Zıplama süresi (ms)
 * @param onUpdate Her adımda çağrılacak fonksiyon
 * @param onComplete Animasyon tamamlandığında çağrılacak fonksiyon
 */
export const createJumpAnimation = (
  startY: number,
  jumpHeight: number,
  duration: number,
  onUpdate: (y: number) => void,
  onComplete: () => void
) => {
  const startTime = Date.now();
  const jumpUp = true;
  
  // Zıplama animasyonu için kare kare çalışacak fonksiyon
  const animate = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Yarım parabolik hareket (önce yukarı, sonra aşağı)
    // Sin fonksiyonu ile yumuşak bir eğri oluşturulur
    const angle = progress * Math.PI;
    const y = startY + jumpHeight * Math.sin(angle);
    
    // Y pozisyonunu güncelle
    onUpdate(y);
    
    // Animasyon devam ediyor
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Animasyon tamamlandı
      onComplete();
    }
  };
  
  // Animasyonu başlat
  requestAnimationFrame(animate);
};

/**
 * Engellerin hareket animasyonu
 * @param startX Başlangıç X pozisyonu
 * @param speed Hareket hızı (piksel/frame)
 * @param onUpdate Her adımda çağrılacak fonksiyon
 * @param onOffscreen Ekrandan çıktığında çağrılacak fonksiyon
 */
export const createObstacleAnimation = (
  startX: number,
  speed: number,
  onUpdate: (x: number) => void,
  onOffscreen: () => void
) => {
  let x = startX;
  
  const animate = () => {
    x -= speed;
    onUpdate(x);
    
    // Engel ekrandan çıktı mı kontrol et
    if (x < -100) {
      onOffscreen();
      return;
    }
    
    requestAnimationFrame(animate);
  };
  
  requestAnimationFrame(animate);
};

/**
 * Puan artışı animasyonu
 * @param element Animasyon uygulanacak HTML elementi
 * @param startValue Başlangıç değeri
 * @param endValue Bitiş değeri
 * @param duration Animasyon süresi (ms)
 */
export const createScoreAnimation = (
  element: HTMLElement,
  startValue: number,
  endValue: number,
  duration: number
) => {
  const startTime = Date.now();
  
  const animate = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Lineer interpolasyon
    const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
    
    // Değeri güncelle
    element.textContent = currentValue.toString();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};
