# Engel Atlama Oyunu

Modern React ve TypeScript kullanılarak geliştirilen 2D platform oyunu. Karakteri yatay düzlemde hareket ettirerek engellerin üzerinden atlayın ve puan toplayın!

## Özellikler

- SPACE tuşu ile zıplama
- Sabit karakterle engelleri aşma
- Engellere çarpmadan ilerleme
- Puan ve yüksek skor sistemi
- Zorluk seviyesi zamanla artar
- Duyarlı tasarım (mobil cihazlar için dokunmatik kontroller)
- Ses efektleri ve müzik

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum Adımları

1. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

3. Tarayıcınızda `http://localhost:5173` adresine gidin

## Kontroller

- `SPACE` veya `↑`: Zıplama
- `P`: Oyunu duraklatma/devam ettirme
- `Y`: Oyunu yeniden başlatma

## Nasıl Oynanır

1. "Oyunu Başlat" butonuna tıklayın veya SPACE tuşuna basın
2. SPACE tuşuyla zıplayın ve engellerin üzerinden geçin
3. Her geçilen engel için 10 puan kazanın
4. Seviye yükseldikçe oyun zorlaşır

## Kullanılan Teknolojiler

- React
- TypeScript
- Zustand (State Yönetimi)
- use-sound (Ses Efektleri)
- CSS Animasyonları
- localStorage (Yüksek Skor Kaydetme)

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
