import React from 'react';
import { Info } from 'lucide-react';

interface FormatTipsProps {
  type: 'product' | 'banner' | 'video' | 'pdf' | 'image';
}

export const FormatTips: React.FC<FormatTipsProps> = ({ type }) => {
  const tips = {
    product: {
      title: 'Especificações de Produto',
      items: [
        { label: 'Formato', value: 'PNG (fundo transparente)' },
        { label: 'Dimensões', value: '800x1000px (4:5)' },
        { label: 'Tamanho máx', value: '300KB' },
        { label: 'Dica', value: 'Foto com boa iluminação, produto centralizado' }
      ]
    },
    banner: {
      title: 'Especificações de Banner',
      items: [
        { label: 'Formato', value: 'JPG, PNG, WebP' },
        { label: 'Dimensões', value: '1920x640px (3:1)' },
        { label: 'Tamanho máx', value: '500KB' },
        { label: 'Dica', value: 'Texto legível em mobile, cores vibrantes' }
      ]
    },
    video: {
      title: 'Especificações de Vídeo',
      items: [
        { label: 'Plataforma', value: 'YouTube ou Vimeo' },
        { label: 'Duração', value: '3-15 minutos' },
        { label: 'Qualidade', value: 'Mínimo 720p (HD)' },
        { label: 'Dica', value: 'Vídeo público, áudio claro, legendas' }
      ]
    },
    pdf: {
      title: 'Especificações de PDF',
      items: [
        { label: 'Formato', value: 'PDF' },
        { label: 'Tamanho máx', value: '10MB' },
        { label: 'Páginas', value: 'Até 20 páginas' },
        { label: 'Dica', value: 'Layout limpo, fonte legível (min 12pt)' }
      ]
    },
    image: {
      title: 'Especificações de Imagem',
      items: [
        { label: 'Formato', value: 'JPG, PNG' },
        { label: 'Dimensões', value: '1200x800px (3:2)' },
        { label: 'Tamanho máx', value: '500KB' },
        { label: 'Dica', value: 'Alta qualidade, cores vibrantes' }
      ]
    }
  };

  const currentTips = tips[type];

  return (
    <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-blue-500">
        <Info size={16} />
        <h4 className="text-xs font-black uppercase tracking-wider">{currentTips.title}</h4>
      </div>
      <div className="space-y-1.5">
        {currentTips.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px]">
            <span className="font-black text-blue-400 min-w-[80px]">{item.label}:</span>
            <span className="font-bold text-blue-600">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
