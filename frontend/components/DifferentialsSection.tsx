import React from 'react';
import { Sparkles, Gamepad2, Users as UsersIcon, Moon } from 'lucide-react';
import { AppSection } from '../types';

interface DifferentialsSectionProps {
    onNavigate: (section: AppSection) => void;
    onOpenClube: () => void;
}

export const DifferentialsSection: React.FC<DifferentialsSectionProps> = ({ onNavigate, onOpenClube }) => {
    const differentials = [
        {
            icon: Sparkles,
            t: 'LOJA MÁGICA',
            sub: 'A única loja onde seu filho prova o amor antes de vestir.',
            d: 'Primeiro e-commerce infantil do Brasil com provador virtual. Vista seu filho com magia antes da entrega.',
            color: 'bg-blue-400',
            section: AppSection.SHOP
        },
        {
            icon: Gamepad2,
            t: 'ESPAÇO KIDS',
            sub: 'Diversão que educa. IA que entende a infância.',
            d: 'Jogos criativos, desafios e desenhos com IA — sem tela vazia, sem culpa.',
            color: 'bg-pink-400',
            section: AppSection.KIDS
        },
        {
            icon: UsersIcon,
            t: 'ESPAÇO FAMÍLIA',
            sub: 'Onde vínculos se fortalecem sem esforço.',
            d: 'Atividades e rituais pra criar famílias inabaláveis. A Luna te ajuda a ser presente, mesmo na correria.',
            color: 'bg-orange-400',
            section: AppSection.FAMILY_MOMENT
        },
        {
            icon: Moon,
            t: 'CLUBE DA LUNA',
            sub: 'Não é só uma caixa. É o momento que seu filho vai lembrar pra sempre.',
            d: 'Assinatura mensal com roupas, mimos e conexão. Todo mês, um ritual de afeto em família.',
            color: 'bg-purple-400',
            onClick: onOpenClube
        }
    ];

    return (
        <section className="px-6 lg:px-20 py-24 space-y-16 bg-white">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter italic leading-tight">Nossos Diferenciais</h2>
                <div className="h-1.5 w-24 bg-[#F5D8E8] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {differentials.map((diff, i) => (
                    <div
                        key={i}
                        onClick={() => diff.onClick ? diff.onClick() : (diff.section && onNavigate(diff.section))}
                        className="group cursor-pointer space-y-6"
                    >
                        <div className={`${diff.color} aspect-[4/3] rounded-[48px] shadow-xl flex items-center justify-center text-white transition-all group-hover:scale-[1.02] group-hover:shadow-2xl overflow-hidden relative`}>
                            <diff.icon size={64} className="relative z-10 opacity-90" />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="space-y-3 px-2">
                            <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase tracking-tight italic flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#BBD4E8]"></span>
                                {diff.t}
                            </h3>
                            <p className="text-sm font-black text-[#6B5A53] leading-snug italic">{diff.sub}</p>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed italic">{diff.d}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
