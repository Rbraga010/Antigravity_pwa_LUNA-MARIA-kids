import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Camera, Sparkles, ChevronRight, Upload,
    ShieldCheck, Eye, Check, Download, ShoppingBag,
    AlertCircle, Loader2
} from 'lucide-react';
import { Product } from '../types';

interface TryOnModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: Product) => void;
    onDownload: (imageUrl: string) => void;
}

type Step = 'INSTRUCTIONS' | 'UPLOAD' | 'PROCESSING' | 'RESULT';

export const TryOnModal: React.FC<TryOnModalProps> = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
    onDownload
}) => {
    const [step, setStep] = useState<Step>('INSTRUCTIONS');
    const [userImage, setUserImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('INSTRUCTIONS');
            setUserImage(null);
            setResultImage(null);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Imagem muito grande. Máximo 10MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result as string);
                setStep('PROCESSING');
                simulateProcess();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateProcess = async () => {
        setLoading(true);
        try {
            // Chamada real para o backend no futuro
            // const response = await fetch('/api/tryon/generate', { ... });

            // Simulação de delay para efeito "Uau"
            await new Promise(resolve => setTimeout(resolve, 3500));

            // Mock de resultado realista
            setResultImage(product.image); // Por enquanto usamos a própria imagem do produto como resultado
            setStep('RESULT');
        } catch (err) {
            setError('Ops! A magia falhou. Tente novamente.');
            setStep('UPLOAD');
        } finally {
            setLoading(false);
        }
    };

    const steps = {
        INSTRUCTIONS: (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Guia do Provador Mágico ✨</h3>
                    <p className="text-sm font-bold text-gray-400 italic">Siga os passos para ver a mágica acontecer</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { icon: Camera, title: 'Foto de Rosto e Peito', desc: 'Uma foto clara, de frente, com boa iluminação.' },
                        { icon: ShieldCheck, title: 'Privacidade Total', desc: 'Sua foto é processada com segurança e nunca compartilhada.' },
                        { icon: Sparkles, title: 'IA de Alta Precisão', desc: 'Nossa inteligência entende as proporções do seu pequeno.' }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-[32px] border border-white shadow-sm">
                            <div className="p-3 bg-white rounded-2xl text-purple-400 shadow-sm"><item.icon size={24} /></div>
                            <div>
                                <h4 className="text-sm font-black text-[#6B5A53] uppercase">{item.title}</h4>
                                <p className="text-[11px] font-bold text-gray-400 italic leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setStep('UPLOAD')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    Entendido, Vamos lá!
                    <ChevronRight size={18} />
                </button>
            </motion.div>
        ),

        UPLOAD: (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
            >
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Envie a Foto 📸</h3>
                    <p className="text-sm font-bold text-gray-400 italic">Tire uma foto agora ou escolha da galeria</p>
                </div>

                <div className="relative group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="aspect-[4/5] bg-gray-50 rounded-[48px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 transition-all group-hover:bg-white group-hover:border-purple-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-400 shadow-lg mb-2">
                            <Upload size={32} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Clique ou arraste aqui</p>
                        <p className="text-[10px] font-bold text-gray-300 italic">PNG, JPG ou JPEG (Máx 10MB)</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                        <AlertCircle size={20} />
                        <span className="text-xs font-bold">{error}</span>
                    </div>
                )}
            </motion.div>
        ),

        PROCESSING: (
            <div className="space-y-12 py-10 flex flex-col items-center text-center">
                <div className="relative">
                    <div className="w-32 h-32 bg-purple-50 rounded-full animate-ping absolute inset-0 opacity-20" />
                    <div className="w-32 h-32 bg-pink-50 rounded-full animate-ping delay-700 absolute inset-0 opacity-20" />
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-purple-400 shadow-2xl relative z-10">
                        <Loader2 size={48} className="animate-spin" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Criando Magia... ✨</h3>
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 italic animate-pulse">Analisando proporções...</p>
                        <p className="text-xs font-bold text-gray-400 italic animate-pulse delay-500">Ajustando o look perfeito...</p>
                        <p className="text-xs font-bold text-gray-400 italic animate-pulse delay-1000">Finalizando detalhes premium...</p>
                    </div>
                </div>

                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.5 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                    />
                </div>
            </div>
        ),

        RESULT: (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
            >
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-500 px-4 py-1.5 rounded-full mb-2">
                        <Check size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Look Gerado com Sucesso</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Ficou Incrível! 😍</h3>
                </div>

                <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
                    <img
                        src={resultImage || ''}
                        alt="Resultado do Provador"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-[#6B5A53] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <ShoppingBag size={20} />
                        Adicionar Look à Sacola
                    </button>

                    <button
                        onClick={() => resultImage && onDownload(resultImage)}
                        className="w-full bg-white text-purple-400 border-2 border-purple-100 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={16} />
                        Baixar Foto de Recordação ✨
                    </button>
                </div>

                <p className="text-[10px] text-gray-400 text-center font-bold italic">
                    Lembre-se: por ser uma IA, pequenas variações podem ocorrer.
                    Mas o amor em cada peça é 100% real.
                </p>
            </motion.div>
        )
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]"
            >
                <div className="p-8 lg:p-12 overflow-y-auto scrollbar-hide">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-400 transition-all z-30"
                    >
                        <X size={20} />
                    </button>

                    <AnimatePresence mode="wait">
                        {steps[step]}
                    </AnimatePresence>
                </div>

                {/* Progress Bar for Step Indicator */}
                <div className="h-2 bg-gray-50 flex">
                    {['INSTRUCTIONS', 'UPLOAD', 'PROCESSING', 'RESULT'].map((s, i) => (
                        <div
                            key={s}
                            className={`flex-1 transition-all duration-500 ${['INSTRUCTIONS', 'UPLOAD', 'PROCESSING', 'RESULT'].indexOf(step) >= i
                                    ? (step === 'RESULT' ? 'bg-green-400' : 'bg-purple-400')
                                    : 'bg-transparent'
                                }`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
