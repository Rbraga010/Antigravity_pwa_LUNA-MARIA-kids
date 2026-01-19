
import React from 'react';

interface MascotProps {
  message?: string;
}

const Mascot: React.FC<MascotProps> = ({ message }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end">
      {message && (
        <div className="bg-white p-3 rounded-2xl shadow-lg border-2 border-[#F5D8E8] mr-2 mb-8 max-w-[200px] relative animate-bounce">
          <p className="text-sm font-semibold text-[#6B5A53]">{message}</p>
          <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r-2 border-b-2 border-[#F5D8E8] rotate-45"></div>
        </div>
      )}
      <div className="w-24 h-24 bg-[#F5D8E8] rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
         {/* Representação da mascote: Menina com laço */}
         <div className="relative w-full h-full flex flex-col items-center justify-center pt-2">
            <div className="w-14 h-14 bg-[#FFD1DC] rounded-full relative">
               <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-6 bg-[#F5D8E8] rounded-full border-2 border-white"></div> {/* Laço rosa */}
               <div className="flex gap-2 justify-center mt-5">
                 <div className="w-1.5 h-1.5 bg-[#6B5A53] rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-[#6B5A53] rounded-full"></div>
               </div>
               <div className="w-6 h-3 border-b-2 border-[#6B5A53] rounded-full mx-auto mt-1"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Mascot;
