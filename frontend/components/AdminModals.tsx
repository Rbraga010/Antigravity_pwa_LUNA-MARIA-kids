import React, { useState, useEffect } from 'react';
import { X, Download, Plus, Edit3, Trash2, Sparkles, ShieldCheck } from 'lucide-react';
import { Product, CarouselItem, ContentMaterial } from '../types';

interface AdminModalsProps {
    editingProduct: Product | null;
    setEditingProduct: (p: Product | null) => void;
    handleSaveProduct: (p: Product) => void;
    handleDeleteProduct: (id: string) => void;

    editingCarouselItem: CarouselItem | null;
    setEditingCarouselItem: (c: CarouselItem | null) => void;
    handleSaveCarousel: (c: CarouselItem) => void;
    handleDeleteCarousel: (id: string, type: 'TOP' | 'FEATURED') => void;

    editingMaterial: ContentMaterial | null;
    setEditingMaterial: (m: ContentMaterial | null) => void;
    handleSaveMaterial: (m: ContentMaterial) => void;
    handleDeleteMaterial: (id: string, section: 'KIDS' | 'FAMILY') => void;

    loading: boolean;
    defaultImage: string;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
    editingProduct, setEditingProduct, handleSaveProduct, handleDeleteProduct,
    editingCarouselItem, setEditingCarouselItem, handleSaveCarousel, handleDeleteCarousel,
    editingMaterial, setEditingMaterial, handleSaveMaterial, handleDeleteMaterial,
    loading, defaultImage
    loading, defaultImage
}) => {
    // Local states for real-time preview
    const [productPreview, setProductPreview] = useState<string>('');
    const [carouselPreview, setCarouselPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlCallback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUrlCallback(data.url);
            } else {
                alert('Erro ao fazer upload da imagem');
            }
        } catch (error) {
            alert('Erro ao fazer upload da imagem');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (editingProduct) setProductPreview(editingProduct.image || '');
        else setProductPreview('');
    }, [editingProduct]);

    useEffect(() => {
        if (editingCarouselItem) setCarouselPreview(editingCarouselItem.image_url || '');
        else setCarouselPreview('');
    }, [editingCarouselItem]);

    return (
        <>
            {/* Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl p-8 lg:p-12 animate-in zoom-in duration-500 relative scrollbar-hide">
                        <button onClick={() => setEditingProduct(null)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-400 transition-all z-10"><X size={24} /></button>

                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="flex-1 space-y-6">
                                <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Tesouro da Loja ✨</h3>

                                <div className="aspect-[3/4] bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden group">
                                    {productPreview ? (
                                        <img src={productPreview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
                                    ) : (
                                        <div className="text-center p-6 text-gray-300">
                                            <Download size={48} className="mx-auto mb-4 opacity-50" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Insira uma URL ou suba um arquivo</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Preview em Tempo Real</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">URL da Imagem Mágica (ou Upload)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="product-image-url"
                                            value={productPreview}
                                            onChange={(e) => setProductPreview(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                                            placeholder="https://exemplo.com/imagem.png"
                                        />
                                        <label className={`bg-pink-50 text-pink-400 px-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-pink-100 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, (url) => setProductPreview(url))}
                                            />
                                            {uploading ? <span className="animate-spin text-xs">⏳</span> : <Plus size={20} />}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-[1.5] space-y-6 pt-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Nome do Produto</label>
                                        <input type="text" id="product-name" defaultValue={editingProduct.name || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="Ex: Vestido Nuvem de Algodão" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Categoria</label>
                                        <select id="product-category" defaultValue={editingProduct.category || 'menina-bebe'} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none">
                                            <option value="menina-bebe">Menina Bebê</option>
                                            <option value="menina-kids">Menina Kids</option>
                                            <option value="menina-teen">Menina Teen</option>
                                            <option value="menino-bebe">Menino Bebê</option>
                                            <option value="menino-kids">Menino Kids</option>
                                            <option value="menino-teen">Menino Teen</option>
                                            <option value="unissex">Unissex</option>
                                            <option value="acessorios">Acessórios</option>
                                            <option value="calcados">Calçados</option>
                                            <option value="conjuntos">Conjuntos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Preço (R$)</label>
                                        <input type="number" id="product-price" defaultValue={editingProduct.price || 0} step="0.01" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Preço Antigo (Opcional)</label>
                                        <input type="number" id="product-old-price" defaultValue={editingProduct.oldPrice || 0} step="0.01" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Ordem de Exibição</label>
                                        <input type="number" id="product-order" defaultValue={editingProduct.displayOrder || 0} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Estoque</label>
                                        <input type="number" id="product-stock" defaultValue={editingProduct.stock || 0} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Tamanhos (separados por vírgula)</label>
                                    <input type="text" id="product-sizes" defaultValue={editingProduct.sizes?.join(', ') || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="PP, P, M, G, 1, 2, 4" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Descrição Mágica</label>
                                    <textarea id="product-description" defaultValue={editingProduct.description || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none min-h-[120px]" placeholder="Conte a história deste produto..." />
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-pink-50/50 rounded-2xl">
                                    <input type="checkbox" id="product-featured" defaultChecked={editingProduct.is_featured} className="w-5 h-5 accent-pink-400" />
                                    <label htmlFor="product-featured" className="text-xs font-black uppercase tracking-widest text-pink-600">Destacar na Vitrine Principal (Ofertas)</label>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        onClick={() => {
                                            const formData: Product = {
                                                id: editingProduct.id || '',
                                                name: (document.querySelector('#product-name') as HTMLInputElement)?.value || editingProduct.name || 'Novo Produto',
                                                description: (document.querySelector('#product-description') as HTMLTextAreaElement)?.value || editingProduct.description || '',
                                                price: parseFloat((document.querySelector('#product-price') as HTMLInputElement)?.value || '0'),
                                                oldPrice: parseFloat((document.querySelector('#product-old-price') as HTMLInputElement)?.value || '0') || undefined,
                                                category: (document.querySelector('#product-category') as HTMLSelectElement)?.value || editingProduct.category || 'menina-bebe',
                                                displayOrder: parseInt((document.querySelector('#product-order') as HTMLInputElement)?.value || '0'),
                                                stock: parseInt((document.querySelector('#product-stock') as HTMLInputElement)?.value || '10'),
                                                image: productPreview || defaultImage,
                                                sizes: (document.querySelector('#product-sizes') as HTMLInputElement)?.value.split(',').map(s => s.trim()).filter(s => s) || [],
                                                is_featured: (document.querySelector('#product-featured') as HTMLInputElement)?.checked || false
                                            };
                                            handleSaveProduct(formData);
                                        }}
                                        disabled={loading}
                                        className="flex-1 bg-pink-400 text-white py-5 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Salvando...' : 'Salvar Alterações ✨'}
                                    </button>
                                    {editingProduct.id && (
                                        <button
                                            onClick={() => handleDeleteProduct(editingProduct.id!)}
                                            disabled={loading}
                                            className="px-8 bg-red-50 text-red-400 rounded-[28px] font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-colors disabled:opacity-50"
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Carousel Modal */}
            {editingCarouselItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500 relative">
                        <button onClick={() => setEditingCarouselItem(null)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-400 transition-all"><X size={24} /></button>

                        <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Banner do Carrossel ✨</h3>

                        <div className="space-y-6">
                            <div className="aspect-video bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden group">
                                {carouselPreview ? (
                                    <img src={carouselPreview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                                ) : (
                                    <div className="text-center p-6 text-gray-300">
                                        <Download size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Insira uma URL para o Banner</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Preview Live</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">URL do Banner</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="carousel-image-url"
                                            value={carouselPreview}
                                            onChange={(e) => setCarouselPreview(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none"
                                            placeholder="https://..."
                                        />
                                        <label className={`bg-gray-100 text-gray-400 px-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, (url) => setCarouselPreview(url))}
                                            />
                                            {uploading ? <span className="animate-spin text-xs">⏳</span> : <Plus size={20} />}
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Título do Banner</label>
                                    <input type="text" id="carousel-title" defaultValue={editingCarouselItem.title || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="Ex: Mundo Mágico" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Subtítulo</label>
                                    <input type="text" id="carousel-subtitle" defaultValue={editingCarouselItem.subtitle || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="Ex: Roupas que encantam." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Posição</label>
                                    <select id="carousel-type" defaultValue={editingCarouselItem.type} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none">
                                        <option value="TOP">Topo (Cabeçalho)</option>
                                        <option value="FEATURED">Destaque (Meio da Página)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        const formData: CarouselItem = {
                                            id: editingCarouselItem.id || '',
                                            image_url: carouselPreview || defaultImage,
                                            title: (document.querySelector('#carousel-title') as HTMLInputElement)?.value || '',
                                            subtitle: (document.querySelector('#carousel-subtitle') as HTMLInputElement)?.value || '',
                                            type: (document.querySelector('#carousel-type') as HTMLSelectElement)?.value as 'TOP' | 'FEATURED',
                                            order: editingCarouselItem.order || 0
                                        };
                                        handleSaveCarousel(formData);
                                    }}
                                    disabled={loading}
                                    className="flex-1 bg-pink-400 text-white py-5 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Publicar Banner ✨'}
                                </button>
                                {editingCarouselItem.id && (
                                    <button
                                        onClick={() => handleDeleteCarousel(editingCarouselItem.id!, editingCarouselItem.type)}
                                        className="p-5 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Material Modal */}
            {editingMaterial && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500 relative">
                        <button onClick={() => setEditingMaterial(null)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-400 transition-all"><X size={24} /></button>

                        <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Conteúdo Educativo ✨</h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                {['VIDEO', 'PDF', 'IMAGE'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setEditingMaterial({ ...editingMaterial, type: type as any })}
                                        className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${editingMaterial.type === type ? 'bg-pink-50 border-pink-400 text-pink-400' : 'bg-gray-50 border-transparent text-gray-400'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <input type="text" id="material-title" defaultValue={editingMaterial.title || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="Título do Material" />
                                <textarea id="material-description" defaultValue={editingMaterial.description || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none min-h-[100px]" placeholder="Breve descrição mágica..." />
                                <input type="text" id="material-url" defaultValue={editingMaterial.url || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="URL do Conteúdo" />
                                <input type="text" id="material-thumb" defaultValue={editingMaterial.thumbnail_url || ''} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="URL da Thumbnail" />

                                <div className="flex items-center gap-4">
                                    <select id="material-section" defaultValue={editingMaterial.section || 'KIDS'} className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold">
                                        <option value="KIDS">Espaço Kids</option>
                                        <option value="FAMILY">Espaço Família</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        const formData: ContentMaterial = {
                                            id: editingMaterial.id || '',
                                            title: (document.querySelector('#material-title') as HTMLInputElement)?.value || '',
                                            description: (document.querySelector('#material-description') as HTMLTextAreaElement)?.value || '',
                                            type: editingMaterial.type,
                                            url: (document.querySelector('#material-url') as HTMLInputElement)?.value || '',
                                            thumbnail_url: (document.querySelector('#material-thumb') as HTMLInputElement)?.value || undefined,
                                            section: (document.querySelector('#material-section') as HTMLSelectElement)?.value as 'KIDS' | 'FAMILY',
                                            order: editingMaterial.order || 0
                                        };
                                        handleSaveMaterial(formData);
                                    }}
                                    disabled={loading}
                                    className="flex-1 bg-pink-400 text-white py-5 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Salvar Material ✨'}
                                </button>
                                {editingMaterial.id && (
                                    <button
                                        onClick={() => handleDeleteMaterial(editingMaterial.id!, editingMaterial.section)}
                                        className="p-5 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
