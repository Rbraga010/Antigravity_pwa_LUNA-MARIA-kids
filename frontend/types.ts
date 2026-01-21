export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  description: string;
  displayOrder?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CarouselItem {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  type: 'TOP' | 'FEATURED';
  order: number;
}

export interface ContentMaterial {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'PDF' | 'IMAGE';
  url: string;
  thumbnail_url?: string;
  section: 'KIDS' | 'FAMILY';
  order: number;
}

export interface UserProfile {
  name: string;
  email?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  tokens: number;
  medals: string[];
  drawingsCompleted: number;
  coupons: string[];
}

export interface Game {
  id: string;
  title: string;
  icon: string;
  type: 'memory' | 'quiz' | 'logic';
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export enum AppSection {
  HOME = 'HOME',
  SHOP = 'SHOP',
  KIDS = 'KIDS',
  ADMIN = 'ADMIN',
  CART = 'CART',
  COLORING = 'COLORING',
  GAMES = 'GAMES',
  CHALLENGES = 'CHALLENGES',
  SUBSCRIPTION = 'SUBSCRIPTION',
  REWARDS = 'REWARDS',
  CHECKOUT = 'CHECKOUT',
  FAMILY_MOMENT = 'FAMILY_MOMENT',
  SMART_TRYON = 'SMART_TRYON'
}
