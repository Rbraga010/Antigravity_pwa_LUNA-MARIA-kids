import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Instagram, Plus, Edit3 } from 'lucide-react';

interface UGCGalleryProps {
    items: any[];
    isAdmin?: boolean;
    onEdit?: (item: any) => void;
}

export const UGCGallery: React.FC<UGCGalleryProps> = ({ items, isAdmin, onEdit }) => {
    const displayItems = items.length > 0 ? items : [
        { image_url: "https://images.unsplash.com/photo-1544126592-807daa2b565b?w=400", description: "#LunaMariaMoment" },
        { image_url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400", description: "#LunaMariaMoment" },
        { image_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", description: "#LunaMariaMoment" },
        { image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400", description: "#LunaMariaMoment" },
    ];

    return (
        <section className="px-6 lg:px-20 py-24 bg-white overflow-hidden relative">
            {isAdmin && (
                <button
                    onClick={() => onEdit?.({})}
                    className="absolute top-10 right-20 z-10 bg-pink-400 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2"
                >
                    <Plus size={14} /> Adicionar Foto
                </button>
            )}
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl lg:text-5xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter"
                    >
                        A gente ama ver vocês felizes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm lg:text-base font-bold text-gray-400 italic"
                    >
                        Momentos mágicos reais de mamães e papais em todo o Brasil.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayItems.map((item, i) => (
                        <motion.div
                            key={item.id || i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="relative aspect-square rounded-[32px] overflow-hidden group shadow-lg cursor-pointer"
                        >
                            <img src={item.image_url} alt={item.description || `User ${i}`} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className="fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <div className="flex items-center justify-between text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.description || '#LunaMariaMoment'}</span>
                                    <Instagram size={14} />
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Heart size={14} className="fill-white" />
                                {isAdmin && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
                                        className="p-1 bg-pink-400 rounded-full"
                                    >
                                        <Edit3 size={10} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="px-10 py-5 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-[28px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-pink-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto">
                        Ver mais no Instagram <Instagram size={14} />
                    </button>
                </div>
            </div>
        </section>
    );
};
