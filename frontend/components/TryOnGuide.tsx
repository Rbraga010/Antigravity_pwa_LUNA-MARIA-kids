import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera as CameraIcon, Heart, ChevronRight, Eye, ShieldCheck, Star } from 'lucide-react';

interface TryOnGuideProps {
    onStart: () => void;
}

export const TryOnGuide: React.FC<TryOnGuideProps> = ({ onStart }) => {
    return (
        <section className="px-6 lg:px-20 py-24 bg-gradient-to-br from-[#6B5A53] via-[#5A4A43] to-[#4A3A33] text-white relative overflow-hidden rounded-[80px] mx-4 lg:mx-10 my-12">
            {/* Elementos decorativos animados */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-2.5 rounded-full border border-white/20 mb-8"
                >
                    <Sparkles size={18} className="text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tecnologia Exclusiva</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl lg:text-6xl font-black font-luna uppercase italic tracking-tighter leading-tight mb-8"
                >
                    Vista o amor antes de vestir a roupa
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base lg:text-xl font-bold text-white/70 max-w-3xl leading-relaxed mb-16 italic"
                >
                    A única loja infantil do Brasil com Provador Virtual IA. <br className="hidden lg:block" />
                    Veja como cada peça fica no seu filho em segundos, sem sair de casa.
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-16">
                    {[
                        {
                            step: '01',
                            title: 'Envie uma foto',
                            desc: 'Tire uma foto simples do seu pequeno. Nossa IA cuida do resto com carinho.',
                            icon: CameraIcon,
                            color: 'from-blue-400 to-blue-600'
                        },
                        {
                            step: '02',
                            title: 'Magia em segundos',
                            desc: 'Em instantes, nossa IA veste a peça escolhida mantendo o realismo total do look.',
                            icon: Sparkles,
                            color: 'from-purple-400 to-purple-600'
                        },
                        {
                            step: '03',
                            title: 'Segurança & Compra',
                            desc: 'Decida com certeza absoluta, sem trocas e com a alegria de ver seu filho feliz.',
                            icon: Heart,
                            color: 'from-pink-400 to-pink-600'
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white/5 backdrop-blur-md rounded-[48px] p-10 border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-[24px] flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>
                            <div className="space-y-4 text-left">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Passo {item.step}</span>
                                <h3 className="text-xl font-black uppercase italic tracking-tight">{item.title}</h3>
                                <p className="text-sm font-bold text-white/60 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col items-center gap-6"
                >
                    <button
                        onClick={onStart}
                        className="group px-12 py-7 bg-white text-[#6B5A53] rounded-[32px] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
                    >
                        <CameraIcon size={20} className="group-hover:rotate-12 transition-transform" />
                        Experimentar Grátis ✨
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> 100% Privado
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                            <Eye size={14} /> Resultado Realista
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                            <Star size={14} className="fill-white" /> Qualidade IA
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
