
import React from 'react';
import { Home, ShoppingBag, Gamepad2, Heart, User } from 'lucide-react';
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
    { id: AppSection.SHOP, label: 'Loja', icon: ShoppingBag, color: 'text-purple-400' },
    { id: AppSection.KIDS, label: 'Kids', icon: Gamepad2, color: 'text-pink-400' },
    { id: AppSection.FAMILY_MOMENT, label: 'Família', icon: Heart, color: 'text-orange-400' },
    { id: AppSection.MY_ACCOUNT, label: 'Conta', icon: User, color: 'text-green-400', onClick: onAccountClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 py-3 z-40 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => item.onClick ? item.onClick() : onNavigate(item.id as AppSection)}
          className={`flex flex-col items-center gap-1 transition-all ${currentSection === item.id ? 'scale-110 ' + item.color : 'text-gray-300 hover:text-gray-500'
            }`}
        >
          <item.icon size={20} strokeWidth={currentSection === item.id ? 2.5 : 2} />
          <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
