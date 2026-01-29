import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Instagram } from 'lucide-react';

export const UGCGallery: React.FC = () => {
    const images = [
        "https://images.unsplash.com/photo-1544126592-807daa2b565b?w=400",
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
        "https://images.unsplash.com/photo-1526723466833-2bf9eeb079f0?w=400",
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
        "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400"
    ];

    return (
        <section className="px-6 lg:px-20 py-24 bg-white overflow-hidden">
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
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="relative aspect-square rounded-[32px] overflow-hidden group shadow-lg cursor-pointer"
                        >
                            <img src={img} alt={`User ${i}`} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className="fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <div className="flex items-center justify-between text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest">#LunaMariaMoment</span>
                                    <Instagram size={14} />
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Heart size={14} className="fill-white" />
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
