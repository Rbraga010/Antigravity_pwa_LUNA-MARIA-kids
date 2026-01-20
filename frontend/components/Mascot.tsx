
import React from 'react';

interface MascotProps {
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({ message }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end">
      {message && (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-md border border-pink-100 mr-2 mb-10 max-w-[180px] relative">
          <p className="text-[11px] font-bold text-[#6B5A53]/80 italic leading-tight">{message}</p>
          <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-pink-100 rotate-45"></div>
        </div>
      )}
      <div className="w-20 h-20 bg-white rounded-full border-4 border-[#F5D8E8] shadow-lg overflow-hidden flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
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
