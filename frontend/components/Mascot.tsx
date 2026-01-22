
import React from 'react';

interface MascotProps {
  message?: string;
}

const Mascot: React.FC<MascotProps> = () => {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex items-end opacity-60 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div className="w-10 h-10 bg-white/90 rounded-full border border-[#F5D8E8] shadow-sm overflow-hidden flex items-center justify-center transition-transform hover:scale-105 cursor-pointer pointer-events-auto">
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
