
import React from 'react';

interface MascotProps {
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({ message }) => {
  return (
    <div className="fixed bottom-32 right-4 z-50 flex items-end opacity-80 hover:opacity-100 transition-opacity duration-300">
      {message && (
        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-pink-100/30 mr-2 mb-10 max-w-[150px] relative transition-all duration-500 animate-in fade-in slide-in-from-right-4">
          <p className="text-[10px] font-bold text-[#6B5A53]/60 italic leading-tight">{message}</p>
          <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white/60 border-r border-b border-pink-100/30 rotate-45"></div>
        </div>
      )}
      <div className="w-14 h-14 bg-white/90 rounded-full border-2 border-[#F5D8E8] shadow-sm overflow-hidden flex items-center justify-center transition-transform hover:scale-105 cursor-pointer">
        <img
          src="https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e62949b21f080d83feee7.png"
          alt="Luna Maria Mascot"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Mascot;
