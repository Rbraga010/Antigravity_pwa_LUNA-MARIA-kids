import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera as CameraIcon, ShieldCheck, Heart, Star, ChevronRight } from 'lucide-react';
import RegistrationForm from './RegistrationForm';

interface HeroSectionProps {
    onNavigate: (section: any) => void;
    onRegister: (data: any) => Promise<boolean>;
    loading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onRegister, loading }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FAF8F5]">
            {/* Background decorativo */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-pink-100/30 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 container mx-auto px-6 lg:px-20 py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white"
                    >
                        <Sparkles size={18} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Inovação: Provador Virtual com IA
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-[#6B5A53] font-luna italic"
                    >
                        Vesta seu filho com <br />
                        <span className="animated-gradient-text">magia e certeza</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg lg:text-xl font-bold text-gray-500 max-w-xl leading-relaxed italic"
                    >
                        O único e-commerce infantil do Brasil que permite você ver o caimento perfeito antes mesmo da entrega.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5"
                    >
                        <button
                            onClick={() => onNavigate('SHOP')}
                            className="group px-10 py-6 bg-[#6B5A53] text-white rounded-[28px] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <CameraIcon size={20} className="group-hover:rotate-12 transition-transform" />
                            Testar Provador Grátis
                        </button>
                        <button
                            onClick={() => onNavigate('SHOP')}
                            className="px-10 py-6 bg-white text-[#6B5A53] rounded-[28px] font-black uppercase text-sm tracking-widest shadow-xl hover:bg-gray-50 border border-gray-100 transition-all flex items-center justify-center gap-2 group"
                        >
                            Explorar Coleção
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-wrap gap-8 items-center"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={16} className="text-blue-400" />
                            Segurança Total
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Heart size={16} className="text-pink-400" />
                            Afeto Garantido
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            4.9/5 Avaliação
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-full lg:max-w-md relative"
                >
                    <div className="relative z-10 glass p-1 rounded-[48px] shadow-2xl">
                        <RegistrationForm onSubmit={onRegister} loading={loading} />
                    </div>

                    {/* Decorações flutuantes */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center animate-float animate-magic-float">
                        <Sparkles className="text-yellow-400" size={32} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
