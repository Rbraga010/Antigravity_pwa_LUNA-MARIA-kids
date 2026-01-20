
import React from 'react';
import { Home, ShoppingBag, Gamepad2, Heart, ShoppingCart } from 'lucide-react';
import { AppSection } from '../types';

interface NavigationProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  onClubeClick: () => void;
  cartCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onNavigate, onClubeClick, cartCount }) => {
  const navItems = [
    { id: AppSection.HOME, label: 'Início', icon: Home, color: 'text-blue-400' },
    { id: AppSection.SHOP, label: 'Loja Mágica', icon: ShoppingBag, color: 'text-purple-400' },
    { id: 'CLUBE', label: 'Clube', icon: Heart, color: 'text-pink-400', onClick: onClubeClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-4 z-40 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => item.onClick ? item.onClick() : onNavigate(item.id as AppSection)}
          className={`flex flex-col items-center gap-1 transition-all ${currentSection === item.id ? 'scale-110 ' + item.color : 'text-gray-300 hover:text-gray-500'
            }`}
        >
          <item.icon size={22} strokeWidth={currentSection === item.id ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
      <button
        onClick={() => onNavigate(AppSection.CART)}
        className={`relative p-2.5 rounded-full transition-all ${currentSection === AppSection.CART ? 'bg-[#BBD4E8] text-white scale-110' : 'bg-gray-50 text-[#6B5A53] hover:bg-gray-100'
          }`}
      >
        <ShoppingCart size={22} strokeWidth={2.5} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
};

export default Navigation;
