
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'clothes' | 'toys' | 'subscription';
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  name: string;
  role: 'parent' | 'child' | 'admin';
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
