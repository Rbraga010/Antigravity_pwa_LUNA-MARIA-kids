
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
export const SAMPLE_KIDS_MATERIALS: any[] = [
  { id: 'k1', title: 'Aventura na Floresta', type: 'VIDEO', section: 'KIDS', thumbnail_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', url: '#' },
  { id: 'k2', title: 'Pinte a Luna Maria', type: 'IMAGE', section: 'KIDS', thumbnail_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', url: '#' },
  { id: 'k3', title: 'Desafio Cósmico', type: 'VIDEO', section: 'KIDS', thumbnail_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400', url: '#' }
];

export const SAMPLE_FAMILY_MATERIALS: any[] = [
  { id: 'f1', title: 'Guia do Ritual do Sono', type: 'PDF', section: 'FAMILY', thumbnail_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400', url: '#' },
  { id: 'f2', title: 'Piquenique na Sala', type: 'VIDEO', section: 'FAMILY', thumbnail_url: 'https://images.unsplash.com/photo-1526723466833-2bf9eeb079f0?w=400', url: '#' },
  { id: 'f3', title: 'Conexão em 5 Minutos', type: 'VIDEO', section: 'FAMILY', thumbnail_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', url: '#' }
];
