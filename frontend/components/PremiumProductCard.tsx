import React from 'react';
import { motion } from 'framer-motion';
import { Star, Camera as CameraIcon, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface PremiumProductCardProps {
    product: Product;
    onTryOn: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    adjustImageForCategory: (url: string, category: string) => string;
}

export const PremiumProductCard: React.FC<PremiumProductCardProps> = ({
    product,
    onTryOn,
    onAddToCart,
    adjustImageForCategory
}) => {
    const DEFAULT_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="bold" fill="#999">Sem imagem</text></svg>')}`;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-[40px] overflow-hidden shadow-lg border border-gray-100 flex flex-col group transition-all duration-500 hover:shadow-2xl"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {product.is_featured && (
                        <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Star size={10} className="fill-white" /> Oferta
                        </div>
                    )}
                    <div className="glass px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider shadow-sm text-[#6B5A53] border border-white/50">
                        ✨ Premium
                    </div>
                </div>

                {/* Botão de Favorito (Estético) */}
                <button className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={16} />
                </button>

                <img
                    src={product.image || DEFAULT_IMAGE}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${adjustImageForCategory(product.image || DEFAULT_IMAGE, product.category)}`}
                />

                {/* Provador IA Button - Sempre Visível no canto */}
                <button
                    onClick={(e) => { e.stopPropagation(); onTryOn(product); }}
                    className="absolute bottom-4 right-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3.5 rounded-[22px] shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 flex items-center gap-2 group/btn"
                >
                    <CameraIcon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-wider hidden group-hover/btn:block">Provar IA</span>
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-1">
                    <h3 className="text-sm lg:text-base font-black text-[#6B5A53] uppercase tracking-tight line-clamp-1 group-hover:text-pink-500 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed italic">
                        {product.description || "Uma peça única feita com amor."}
                    </p>
                </div>

                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-[#6B5A53]">R$ {product.price.toFixed(2)}</p>
                    {product.oldPrice && (
                        <p className="text-xs text-gray-400 line-through font-bold">R$ {product.oldPrice.toFixed(2)}</p>
                    )}
                </div>

                {/* Reviews Simbolizadas */}
                <div className="flex items-center gap-1.5 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="text-[10px] font-black text-[#6B5A53]/60">(4.9)</span>
                    <span className="ml-auto text-[8px] font-black text-green-400 uppercase">Qualidade Gold</span>
                </div>

                <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-4 bg-[#6B5A53] text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-md hover:shadow-xl hover:bg-[#5A4A43] active:scale-95 transition-all flex items-center justify-center gap-3 group/cart"
                >
                    <ShoppingCart size={16} className="group-hover/cart:rotate-[-10deg] transition-transform" />
                    Adicionar à Sacola
                </button>
            </div>
        </motion.div>
    );
};
