import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import { Edit3, Plus } from 'lucide-react';
import { CarouselItem } from '../types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface AutoCarouselProps {
    banners: CarouselItem[];
    isAdminEditing: boolean;
    onEdit: (banner: CarouselItem) => void;
    onAdd: () => void;
    defaultImage: string;
}

export const AutoCarousel: React.FC<AutoCarouselProps> = ({
    banners,
    isAdminEditing,
    onEdit,
    onAdd,
    defaultImage
}) => {
    const bannersToDisplay = banners.length > 0 ? banners : [
        { id: '1', image_url: '/banner_magic.png', title: 'Mundo Mágico', subtitle: 'Roupas que encantam.', type: 'TOP' as const, order: 0 },
        { id: '2', image_url: '/banner_club.png', title: 'Clube Luna', subtitle: 'Momentos únicos.', type: 'TOP' as const, order: 1 },
        { id: '3', image_url: '/banner_offers.png', title: 'Lua de Ofertas', subtitle: 'Descontos especiais.', type: 'TOP' as const, order: 2 }
    ];

    return (
        <section className="relative w-full aspect-[21/9] lg:aspect-[3/1] overflow-hidden">
            {isAdminEditing && (
                <button
                    onClick={onAdd}
                    className="absolute top-4 right-4 z-50 bg-pink-400 text-white p-4 rounded-full shadow-xl hover:scale-110 active:scale-90 transition-all"
                >
                    <Plus size={20} />
                </button>
            )}
            <Swiper
                modules={[Autoplay, Pagination, SwiperNavigation]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                loop={bannersToDisplay.length > 1}
                className="w-full h-full"
            >
                {bannersToDisplay.map((b) => (
                    <SwiperSlide key={b.id}>
                        <div className="relative w-full h-full group">
                            <img src={b.image_url || defaultImage} alt={b.title || 'Banner'} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10"></div>
                            {isAdminEditing && (
                                <button
                                    onClick={() => onEdit(b)}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-pink-400 p-6 rounded-full shadow-2xl transition-opacity"
                                >
                                    <Edit3 size={24} />
                                </button>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
