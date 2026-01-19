
import { Product, Game } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vestido Estrelinha Azul',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=400',
    category: 'clothes',
    description: 'Um vestido leve e mágico como o céu de verão.'
  },
  {
    id: '2',
    name: 'Conjunto Nuvem Algodão',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=400',
    category: 'clothes',
    description: 'Toque macio para sonhos tranquilos.'
  },
  {
    id: '3',
    name: 'Pelúcia Lua Sorridente',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1559440666-444f378a3c5a?auto=format&fit=crop&q=80&w=400',
    category: 'toys',
    description: 'A melhor amiga para a hora de dormir.'
  },
  {
    id: '4',
    name: 'Caixa Surpresa Luna Maria',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c67ad?auto=format&fit=crop&q=80&w=400',
    category: 'subscription',
    description: 'Assinatura mensal com roupas e brinquedos exclusivos.'
  }
];

export const COLORING_THEMES = [
  "Animais da Floresta", "Fundo do Mar", "Espaço Sideral", "Dinossauros Amigos", 
  "Princesas e Cavaleiros", "Robôs Brincalhões", "Frutas Sorridentes", "Jardim Encantado",
  "Veículos Rápidos", "Doces e Guloseimas"
];

export const GAMES: Game[] = [
  { id: 'g1', title: 'Memória Estelar', icon: '⭐', type: 'memory', difficulty: 'fácil' },
  { id: 'g2', title: 'Quiz das Cores', icon: '🎨', type: 'quiz', difficulty: 'médio' },
  { id: 'g3', title: 'Lógica da Nuvem', icon: '☁️', type: 'logic', difficulty: 'difícil' },
];

export const COLORS = {
  blue: '#BBD4E8',
  pink: '#F5D8E8',
  cream: '#F5F1E8',
  white: '#FAF8F5',
  brown: '#6B5A53'
};
