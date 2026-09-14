export interface Product {
  id: string;
  name: string;
  category: 'unstitched' | 'kurta' | 'boski' | 'cotton' | 'waistcoat' | 'festive' | 'shawls';
  pricePKR: number;
  originalPricePKR?: number;
  description: string;
  fabricType: string;
  metersOrSize: string;
  image: string;
  badge?: string;
  inStock: boolean;
  colors?: string[];
  rating?: number;
  featured?: boolean;
}

export interface BackgroundVideoSettings {
  mode: 'default' | 'video'; // 'default' = Classic boutique cloth pattern / solid luxury theme, 'video' = Animated video upload/preset
  enabled: boolean;
  defaultPattern: 'luxury-mesh' | 'geometric-weave' | 'minimal-damask' | 'silk-sheen';
  videoUrl: string;
  isUploaded: boolean;
  videoTitle: string;
  makeBackgroundInvisible: boolean; // When true (in video mode), homepage background is 100% transparent so video is crystal clear
  opacity: number; // 0.1 to 1.0
  playbackSpeed: number;
  muted: boolean;
  loop: boolean;
  glassmorphismCardStyle: boolean; // sleek frosted/transparent cards
}

export interface IntroVideoSettings {
  enabled: boolean;
  videoUrl: string;
  isUploaded: boolean;
  videoTitle: string;
  autoCloseSeconds: number;
  allowSkip: boolean;
  title: string;
  subtitle: string;
  hasShownInSession?: boolean;
}

export interface SocialLinks {
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  locationAddress: string;
  contactNumber: string;
  email: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  announcementBarText: string;
  heroHeadline: string;
  heroSubheadline: string;
  logoUrl?: string;
}

export interface OptimizationSettings {
  enableImageOptimization: boolean;
  maxImageDimension: number;
  compressionQuality: number; // 0.5 to 0.95
  convertToWebP: boolean;
  lazyLoadImages: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  customNote?: string;
}
