import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpButtonProps {
  section: 'products' | 'banners' | 'materials' | 'users';
}

export const HelpButton: React.FC<HelpButtonProps> = ({ section }) => {
  const [showHelp, setShowHelp] = useState(false);

  const helpContent = {
    products: {
      title: 'Ajuda: Produtos',
      tips: [
        'Use fotos com fundo branco ou transparente',
        'Nome deve ser atraente e descritivo',
        'Preço antigo cria senso de urgência',
        'Ordem 0 = aparece primeiro na vitrine',
        'Categorize corretamente para facilitar busca'
      ]
    },
    banners: {
      title: 'Ajuda: Banners',
      tips: [
        'Banner TOPO: aparece no carrossel principal',
        'Banner DESTAQUE: aparece no meio da página',
        'Use cores vibrantes e alegres',
        'Texto deve ser legível em mobile',
        'Call-to-action claro aumenta conversão'
      ]
    },
    materials: {
      title: 'Ajuda: Materiais Educacionais',
      tips: [
        'VÍDEO: use link do YouTube ou Vimeo',
        'PDF: ideal para atividades e guias',
        'IMAGEM: para ilustrações e infográficos',
        'Espaço KIDS: conteúdo para crianças',
        'Espaço FAMÍLIA: conteúdo para pais'
      ]
    },
    users: {
      title: 'Ajuda: Gestão de Usuários',
      tips: [
        'Lead Cadastrado: apenas se registrou',
        'Lead Cliente: já fez uma compra',
        'Lead Assinante: membro do Clube',
        'Botão "Tornar Assinante" ativa benefícios',
        'Acompanhe conversão no painel de métricas'
      ]
    }
  };

  const content = helpContent[section];

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-40 right-6 z-[90] p-4 bg-yellow-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all"
        title="Ajuda"
      >
        <HelpCircle size={24} />
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[400] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 space-y-6 animate-in zoom-in duration-500 relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-400 transition-all"
            >
              <X size={20} />
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">
                {content.title}
              </h3>
            </div>

            <div className="space-y-3">
              {content.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-2xl">
                  <span className="text-yellow-500 font-black text-sm">💡</span>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full bg-yellow-400 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
