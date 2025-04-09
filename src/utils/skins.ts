export interface Skin {
  id: string;
  name: string;
  mainColor: string;
  secondaryColor: string;
  unlockScore: number;
  description: string;
  headShape?: string; // borderRadius değeri
  eyeColor?: string;
  special?: {
    effect?: string; // 'glow', 'sparkle', etc.
    effectColor?: string;
  };
}

// Oyunda kullanılacak skin koleksiyonu
export const SKINS: Skin[] = [
  {
    id: 'default',
    name: 'Ateş Ruhlu Kahraman',
    mainColor: '#FF5722',
    secondaryColor: '#D84315',
    unlockScore: 0,
    description: 'Destansı maceraya başladığın ilk kahramanın. Ateş renginin arkasında gizli büyük potansiyeli ve cesareti temsil eder. Engelleri aşma yeteneğiyle doğan bir lider.',
    headShape: '50% 50% 0 0',
  },
  {
    id: 'blue',
    name: 'Okyanus Koruyucusu',
    mainColor: '#2196F3',
    secondaryColor: '#1565C0',
    unlockScore: 200,
    description: 'Derin denizlerden gelen bu gizemli savaşçı, enginlerin bilgeliğini ve soğukkkanlılığını temsil eder. Hareketleri su gibi akıcı, stratejileri derin.',
    headShape: '50% 50% 0 0',
    eyeColor: '#E1F5FE'
  },
  {
    id: 'ninja',
    name: 'Gölgelerin Ninjası',
    mainColor: '#212121',
    secondaryColor: '#000000',
    unlockScore: 500,
    description: 'Antik bir ninja klanının son varisi. Karanlık ve gizemli yapısıyla düşmanlarını şaşırtır, gölgelerde yaşar ve hızla hareket eder. Gözlerindeki kızıl ateş, intikam yeminini hatırlatır.',
    headShape: '20% 20% 0 0',
    eyeColor: '#F44336'
  },
  {
    id: 'robot',
    name: 'Kron-X 5000',
    mainColor: '#607D8B',
    secondaryColor: '#455A64',
    unlockScore: 1000,
    description: 'Gelecekten gelen ileri teknoloji ürünü bir robot. Titanyum gövdesi ve kuantum işlemcisiyle hiçbir engel tanımaz. Yapay zekası sayesinde her zorluktan ders çıkarır ve kendini sürekli geliştirir.',
    headShape: '0% 0% 0 0',
    eyeColor: '#4CAF50',
    special: {
      effect: 'glow',
      effectColor: 'rgba(76, 175, 80, 0.6)',
    }
  },
  {
    id: 'golden',
    name: 'Altın Efsane',
    mainColor: '#FFC107',
    secondaryColor: '#FFA000',
    unlockScore: 2000,
    description: 'Antik tanrıların kutsadığı altın savaşçı... Güneşin parıltısını üzerinde taşır. Dokunan her engeli altına çevirme yeteneği, onu sadece bir efsane değil, yaşayan bir mitoloji haline getirmiştir.',
    headShape: '50% 50% 0 0',
    eyeColor: '#FFECB3',
    special: {
      effect: 'sparkle',
      effectColor: 'rgba(255, 215, 0, 0.7)',
    }
  },
  {
    id: 'cosmic',
    name: 'Yıldızların Efendisi',
    mainColor: '#673AB7',
    secondaryColor: '#4527A0',
    unlockScore: 3000,
    description: 'Galaksiler arası bir gezgin, evrenin sırlarına hükmeder. Kozmik enerjilerle bezenmiş vücudu, uzay-zamanın ötesinden geldiğini gösterir. Yıldızların tozunu içinde taşır, galaksilerin bilgeliğiyle dolu.',
    headShape: '40% 40% 10% 10%',
    eyeColor: '#CE93D8',
    special: {
      effect: 'glow',
      effectColor: 'rgba(156, 39, 176, 0.8)',
    }
  },
  {
    id: 'phoenix',
    name: 'Alev Kanat Phoenix',
    mainColor: '#FF7043',
    secondaryColor: '#BF360C',
    unlockScore: 5000,
    description: 'Her yenilgiden sonra küllerinden yeniden doğan efsanevi phoenix... Ateş ruhlu bu varlık, sonsuz döngülerin ve yeniden doğuşun sembolüdür. Alev kanatları ve tutkulu ruhuyla tüm engelleri küle çevirir.',
    headShape: '65% 65% 0 0',
    eyeColor: '#FFCCBC',
    special: {
      effect: 'sparkle',
      effectColor: 'rgba(244, 67, 54, 0.7)',
    }
  },
  {
    id: 'legendary',
    name: 'Kadim Hakem Chronos',
    mainColor: '#9C27B0',
    secondaryColor: '#6A1B9A',
    unlockScore: 10000,
    description: 'Zamanın ve kaderin efendisi, var oluşun kalbi... Kadim tanrılar arasında eşsiz bir gücü olan Chronos, zamanla bütünleşmiş ve oyun zamanlarını kontrol eden kutsal bir varlığa dönüşmüştür. Başlangıçta 100 puanla doğar, kadim bilgeliği sayesinde.',
    headShape: '30% 30% 10% 10%',
    eyeColor: '#F3E5F5',
    special: {
      effect: 'glow',
      effectColor: 'rgba(171, 71, 188, 0.9)',
    }
  },
];

// Varsayılan skin ID'si
export const DEFAULT_SKIN_ID = 'default';

// Skin içinden ID ile arama yapma yardımcı fonksiyonu
export const getSkinById = (id: string): Skin => {
  const skin = SKINS.find(skin => skin.id === id);
  if (!skin) {
    return SKINS[0]; // Eğer bulunamazsa varsayılan skin'i döndür
  }
  return skin;
};

// Puana göre açılmış skin'leri bulma fonksiyonu
export const getUnlockedSkins = (score: number): Skin[] => {
  return SKINS.filter(skin => score >= skin.unlockScore);
};
