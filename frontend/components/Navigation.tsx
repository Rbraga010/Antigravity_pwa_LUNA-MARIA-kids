
import React from 'react';
import { Home, ShoppingBag, Gamepad2, Heart, User, Moon } from 'lucide-react';
import { AppSection } from '../types';

interface NavigationProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  onClubeClick: () => void;
  onAccountClick: () => void;
  cartCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onNavigate, onClubeClick, onAccountClick, cartCount }) => {
  const navItems = [
    { id: AppSection.HOME, label: 'Início', icon: Home, color: 'text-blue-400' },
    { id: AppSection.SHOP, label: 'Loja Mágica', icon: ShoppingBag, color: 'text-purple-400' },
    { id: 'clube', label: 'Clube', icon: Moon, color: 'text-indigo-400', onClick: onClubeClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 py-4 z-[90] flex justify-between items-center shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-[40px]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => item.onClick ? item.onClick() : onNavigate(item.id as AppSection)}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${currentSection === item.id ? 'scale-110 ' + item.color : 'text-gray-300 hover:text-gray-400'
            }`}
        >
          <item.icon size={22} strokeWidth={currentSection === item.id ? 2.5 : 2} />
          <span className="text-[9px] font-black uppercase tracking-[0.15em]">{item.label}</span>
          {currentSection === item.id && (
            <div className={`absolute -bottom-1 w-1 h-1 rounded-full bg-current`} />
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
