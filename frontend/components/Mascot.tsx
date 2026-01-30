
import React from 'react';

interface MascotProps {
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({ message }) => {
  return (
    <div className={`fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-3 transition-all duration-500 animate-in slide-in-from-bottom-5 ${message ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {message && (
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-[24px] rounded-br-none shadow-xl border border-pink-100/50 max-w-[200px] relative">
          <p className="text-[10px] font-black italic text-[#6B5A53] leading-tight-none">{message}</p>
          <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white/90 border-r border-b border-pink-100/50 transform rotate-45 -translate-y-1/2"></div>
        </div>
      )}
      <div className="w-14 h-14 bg-white/90 rounded-full border-2 border-pink-100 shadow-2xl overflow-hidden flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto group">
        <img
          src="https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e62949b21f080d83feee7.png"
          alt="Luna Maria Mascot"
          className="w-full h-full object-cover transition-transform group-hover:rotate-6"
        />
      </div>
    </div>
  );
};

export default Mascot;
