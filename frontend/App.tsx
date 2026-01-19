
import React, { useState, useEffect, useRef } from 'react';
import { AppSection, Product, CartItem, UserProfile, Game } from './types';
import { INITIAL_PRODUCTS, COLORING_THEMES, GAMES } from './constants';
import Navigation from './components/Navigation';
import Mascot from './components/Mascot';
import {
  Sparkles, Cloud, Moon, Star, Heart, ChevronRight, Plus, Minus, Trash2,
  ShoppingBag, Palette, Gamepad2, Award, Download, Camera as CameraIcon,
  Users as UsersIcon, ShieldCheck, User, X, Check, AlertCircle, Zap,
  ArrowLeft, RefreshCw, Smartphone, CreditCard, Menu, Eye, Lock,
  Settings2, CheckCircle2, Trophy, HelpCircle, ClipboardList, Truck, Star as StarIcon, ChevronLeft,
  Facebook, Instagram, Twitter, Search, ShoppingCart
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || "dummy-key" });

const LOGO_URL = "https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e918f65acf041fba6c97f.png";

const CLUB_IMAGES = {
  hero: "https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e6294c7f17f241fc1763c.png",
  experience: "https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e629465acf0153e9e692a.png",
  benefits: "https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e629465acf054389e6929.png",
  footer: "https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696e62949b21f0664e3feee8.png"
};

const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>(AppSection.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: 'Família Luna',
    role: 'parent',
    tokens: 10,
    medals: ['Iniciante'],
    drawingsCompleted: 0,
    coupons: []
  });

  // States
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showHomeTryOnInfo, setShowHomeTryOnInfo] = useState(false);
  const [simulationsLeft, setSimulationsLeft] = useState(3);
  const [tryOnStep, setTryOnStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [selectedSize, setSelectedSize] = useState('4');
  const [selectedColor, setSelectedColor] = useState('Azul');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [mascotMsg, setMascotMsg] = useState('Bem-vindo ao mundo da Luna Maria!');

  const generateTryOn = async (base64Image: string, product: Product) => {
    try {
      setLoading(true);
      const prompt = `Edite esta imagem de uma criança substituindo ou sobrepondo as roupas atuais por este produto: ${product.name} no tamanho ${selectedSize} e cor ${selectedColor}. A nova roupa deve ser fiel à cor e estilo de ${product.description}. Mantenha a criança e o fundo idênticos, apenas mude o look. Resultado realista e carinhoso.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
            { text: prompt }
          ]
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = async (img: string) => {
    if (simulationsLeft > 0 && selectedProduct) {
      const result = await generateTryOn(img, selectedProduct);
      if (result) {
        setTryOnResult(result);
        setSimulationsLeft(prev => prev - 1);
        setTryOnStep(6);
      } else {
        setTryOnStep(4);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setTryOnStep(5);
        startSimulation(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setMascotMsg('Adicionado ao carrinho!');
    setTimeout(() => setMascotMsg(''), 2000);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const navigateTo = (newSection: AppSection) => {
    setSection(newSection);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTryOnStep(0);
    setTryOnResult(null);
    setUserImage(null);
    setShowHomeTryOnInfo(false);
  };

  // --- UI COMPONENTS ---

  const TopBar = () => (
    <div className="hidden lg:flex h-8 bg-[#FAF8F5] border-b border-gray-100 px-6 items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest z-[60]">
      <div className="flex gap-4">
        <span>Trocas & Devoluções</span>
        <span className="opacity-30">|</span>
        <span>Parcerias</span>
      </div>
      <div className="flex gap-3">
        <Instagram size={14} className="cursor-pointer hover:text-[#6B5A53]" />
        <Facebook size={14} className="cursor-pointer hover:text-[#6B5A53]" />
        <Zap size={14} className="cursor-pointer hover:text-[#6B5A53]" />
      </div>
    </div>
  );

  const Header = () => (
    <header className="sticky top-0 left-0 right-0 h-20 bg-white border-b border-gray-100 z-[60] px-4 lg:px-8 flex items-center justify-between gap-4 lg:gap-8 shadow-sm lg:shadow-none">
      {/* Mobile Menu Button */}
      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#6B5A53]">
        <Menu size={24} />
      </button>

      {/* Logo */}
      <div className="flex shrink-0">
        <img
          src={LOGO_URL}
          alt="Luna Maria Kids"
          className="h-8 lg:h-10 object-contain cursor-pointer"
          onClick={() => navigateTo(AppSection.HOME)}
        />
      </div>

      {/* Search Bar - Hidden on mobile, shows below header in separate row in mobile (handled in render) */}
      <div className="hidden lg:flex flex-1 max-w-xl relative">
        <input
          type="text"
          placeholder="O que você está procurando hoje?"
          className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 px-6 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-[#BBD4E8] transition-all"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 lg:gap-6">
        <button onClick={() => navigateTo(AppSection.REWARDS)} className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase text-[#6B5A53] tracking-wider hover:opacity-70">
          <User size={18} />
          <span>Minha Conta</span>
        </button>
        <button onClick={() => navigateTo(AppSection.CART)} className="p-2 relative text-[#6B5A53] hover:bg-gray-50 rounded-full">
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="absolute top-1 right-1 bg-pink-400 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );

  const MobileSearch = () => (
    <div className="lg:hidden px-4 py-3 bg-white border-b border-gray-50">
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-full bg-gray-50 border border-gray-100 rounded-full py-2 px-10 text-xs focus:outline-none"
        />
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );

  const CategoryMenu = () => {
    const categories = [
      { id: 'offers', label: 'Ofertas do Dia' },
      { id: 'menina', label: 'Menina' },
      { id: 'menino', label: 'Menino' },
      { id: 'acessorios', label: 'Acessórios' },
      { id: 'complementos', label: 'Complementos' }
    ];

    const scrollTo = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 120; // topbar + header + search
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="bg-white border-b border-gray-100 flex justify-center sticky top-20 lg:top-28 z-[50]">
        <div className="flex gap-4 lg:gap-12 px-6 overflow-x-auto scrollbar-hide py-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              className="shrink-0 text-[10px] lg:text-xs font-black uppercase tracking-widest text-[#6B5A53] hover:text-[#BBD4E8] transition-colors"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const AutoCarousel = () => {
    const banners = [
      { img: '/banner_magic.png', title: 'Mundo Mágico', sub: 'Roupas que encantam.' },
      { img: '/banner_club.png', title: 'Clube Luna', sub: 'Momentos únicos.' },
      { img: '/banner_offers.png', title: 'Lua de Ofertas', sub: 'Descontos especiais.' }
    ];

    return (
      <section className="relative w-full aspect-[21/9] lg:aspect-[3/1] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, SwiperNavigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          className="w-full h-full"
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full group">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Optional overlay text if wanted, but banners usually have it baked in */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const MiniBenefitsGrid = () => (
    <section className="flex flex-wrap items-center justify-center gap-4 lg:gap-12 px-6 py-4 bg-white/50 border-b border-gray-50 overflow-x-auto scrollbar-hide">
      {[
        { icon: Truck, t: 'FRETE GRÁTIS' },
        { icon: CreditCard, t: 'ATÉ 10X' },
        { icon: ShieldCheck, t: 'TROCA FÁCIL' },
        { icon: RefreshCw, t: 'SITE SEGURO' }
      ].map((b, i) => (
        <div key={i} className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 bg-cream rounded-lg text-[#6B5A53]"><b.icon size={14} /></div>
          <span className="text-[9px] font-black text-[#6B5A53] tracking-widest uppercase">{b.t}</span>
          {i < 3 && <div className="hidden lg:block w-1.5 h-1.5 bg-gray-100 rounded-full ml-6"></div>}
        </div>
      ))}
    </section>
  );

  const DifferentialsSection = () => (
    <section className="px-6 lg:px-20 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-2xl lg:text-4xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter italic">Conheça Nossos Diferenciais</h2>
        <div className="h-1 w-20 bg-[#F5D8E8] mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {[
          { label: 'Loja Mágica', color: 'bg-blue-400', icon: Sparkles, section: AppSection.SHOP },
          { label: 'Espaço Kid', color: 'bg-pink-400', icon: Gamepad2, section: AppSection.KIDS },
          { label: 'Espaço Família', color: 'bg-orange-400', icon: UsersIcon, section: AppSection.HOME },
          { label: 'Clube da Luna', color: 'bg-purple-400', icon: Moon, section: AppSection.SUBSCRIPTION }
        ].map((diff, i) => (
          <div
            key={i}
            onClick={() => diff.section && navigateTo(diff.section)}
            className={`${diff.color} p-6 lg:p-10 rounded-[40px] shadow-xl text-white flex flex-col items-center justify-center text-center gap-4 group cursor-pointer active:scale-95 transition-all`}
          >
            <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform"><diff.icon size={32} /></div>
            <span className="font-black text-[11px] lg:text-xs uppercase tracking-widest">{diff.label}</span>
          </div>
        ))}
      </div>
    </section>
  );

  const HomeHero = () => (
    <section className="px-6 lg:px-20 py-12 lg:py-24 bg-cream flex flex-col lg:flex-row gap-12 lg:gap-20 items-center overflow-hidden">
      <div className="flex-1 space-y-8">
        <h1 className="text-3xl lg:text-5xl font-black text-[#6B5A53] font-luna uppercase leading-tight italic tracking-tighter">
          Bem-vindo ao único lugar onde seu filho é o protagonista de um mundo encantado — todo mês.
        </h1>
        <p className="text-base lg:text-xl font-bold text-gray-500 italic max-w-xl leading-relaxed">
          Aqui, cada entrega não traz só produtos. Traz o tipo de lembrança que você vai ver nas fotos do futuro.
        </p>
      </div>

      <div className="w-full lg:max-w-md bg-white p-8 lg:p-10 rounded-[48px] shadow-2xl border border-pink-50 relative">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic text-center">Entre para o Mundo Mágico</h3>
          <div className="space-y-4 text-left">
            <input type="text" placeholder="Seu Nome" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            <input type="email" placeholder="E-mail" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />
            <input type="tel" placeholder="Telefone" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200" />

            <div className="grid grid-cols-2 gap-4">
              <select className="px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none">
                <option>Filhos?</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
              <select className="px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none">
                <option>Papel?</option>
                <option>Mãe</option>
                <option>Pai</option>
                <option>Os dois</option>
              </select>
            </div>

            <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:outline-none">
              <option>Perfil dos Filhos</option>
              <option>Menino</option>
              <option>Menina</option>
              <option>Bebê</option>
              <option>Todos</option>
            </select>

            <button className="w-full py-5 bg-pink-400 text-white rounded-[28px] font-black uppercase text-xs tracking-widest shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all">
              Quero Participar ✨
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const DepartmentCarousel = ({ id, title, products }: { id: string, title: string, products: Product[] }) => (
    <section id={id} className="px-6 lg:px-20 py-12 space-y-8 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-xl lg:text-2xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">{title}</h2>
        <button onClick={() => navigateTo(AppSection.SHOP)} className="text-[10px] font-black uppercase tracking-widest text-[#BBD4E8] hover:text-[#6B5A53] transition-colors">Ver Tudo</button>
      </div>
      <Swiper
        modules={[Autoplay, SwiperNavigation]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4.2 }
        }}
        className="product-carousel !overflow-visible"
      >
        {products.map(p => (
          <SwiperSlide key={p.id}>
            <ProductCard product={p} onTryOn={(selected) => { setSelectedProduct(selected); setTryOnStep(2); if (!isSubscriber) setShowSubscriptionPopup(true); }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );

  const renderHomeTryOnPopup = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[64px] shadow-2xl animate-in zoom-in duration-500 relative scrollbar-hide">
        <button onClick={() => setShowHomeTryOnInfo(false)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 z-10"><X size={20} /></button>

        {/* Visual Header */}
        <div className="relative aspect-video bg-purple-50 flex items-center justify-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-60" alt="Provador IA" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
          <div className="absolute bottom-6 flex flex-col items-center gap-2">
            <div className="p-4 bg-white rounded-[32px] shadow-xl text-purple-400"><CameraIcon size={40} /></div>
            <h2 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">Provador IA Luna Maria</h2>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-black text-[#6B5A53] leading-tight">Vista a infância de magia antes mesmo da entrega.</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
              Você já imaginou ver seu filho experimentando o look do mês antes mesmo dele chegar em casa? Agora você pode.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { t: 'Veja como cada peça fica no corpo em segundos', i: Eye },
              { t: 'Escolha o visual perfeito sem dúvida ou trocas', i: CheckCircle2 },
              { t: 'Transforme a compra em um momento de conexão', i: Heart }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="p-2 bg-purple-50 rounded-xl text-purple-400 shrink-0"><item.i size={18} /></div>
                <p className="text-xs font-bold text-[#6B5A53] leading-snug">{item.t}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50/50 p-6 rounded-[32px] border border-orange-100">
            <p className="text-[10px] font-black text-[#6B5A53] uppercase tracking-widest text-center">💡 Dica Mágica</p>
            <p className="text-xs font-bold text-gray-500 text-center mt-2">Você pode salvar essa imagem como uma lembrança digital da infância — por só R$5.</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-sm font-black text-[#6B5A53] uppercase tracking-tighter">🌙 Por que só assinantes têm acesso?</h4>
              <p className="text-xs font-bold text-gray-400 mt-2 italic leading-relaxed">Porque isso não é uma loja comum. É um clube feito pra pais que querem presença.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                '3 simulações grátis por mês',
                'Peças exclusivas de assinantes',
                'Transforme compra em conexão real'
              ].map((b, i) => (
                <div key={i} className="flex gap-2 items-center bg-gray-50 px-4 py-3 rounded-2xl">
                  <Check size={14} className="text-[#BBD4E8]" />
                  <span className="text-[10px] font-black text-[#6B5A53] uppercase">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <button
              onClick={() => navigateTo(AppSection.SUBSCRIPTION)}
              className="w-full bg-purple-400 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
            >
              ✨ Quero desbloquear o Provador
            </button>
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="flex gap-4">
                <ShieldCheck size={14} className="text-gray-400" />
                <CheckCircle2 size={14} className="text-gray-400" />
                <Lock size={14} className="text-gray-400" />
              </div>
              <p className="text-[8px] font-bold text-gray-400 uppercase text-center">Tecnologia de ponta • Privacidade da Criança • Segurança Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product, onTryOn, ...props }: { product: Product, onTryOn: (p: Product) => void, [key: string]: any }) => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col min-w-[240px] max-w-[240px] group transition-all hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-[#6B5A53] active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} size={10} className="fill-yellow-400 text-yellow-400" />)}
          <span className="text-[9px] text-gray-400 font-bold ml-1">(4.9)</span>
        </div>
        <h3 className="text-xs font-black text-[#6B5A53] uppercase tracking-tighter line-clamp-1">{product.name}</h3>
        <div className="space-y-0.5">
          <p className="text-sm font-black text-[#6B5A53]">R$ {product.price.toFixed(2)}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase italic">Ou 3x de R$ {(product.price / 3).toFixed(2)}</p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => onTryOn(product)}
            className="w-full py-2.5 bg-purple-50 text-purple-400 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-purple-100"
          >
            <CameraIcon size={12} /> Provar agora mesmo
          </button>
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 bg-[#6B5A53] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );

  const ProductCarousel = ({ title, products, onTryOn }: { title: string, products: Product[], onTryOn: (p: Product) => void }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (dir: 'left' | 'right') => {
      if (scrollRef.current) {
        const amt = dir === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-[#6B5A53] uppercase tracking-widest italic">{title}</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-[#6B5A53]"><ChevronLeft size={16} /></button>
            <button onClick={() => scroll('right')} className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-[#6B5A53]"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory"
        >
          {products.map(p => (
            <div key={p.id} className="snap-start">
              <ProductCard product={p} onTryOn={onTryOn} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[80] shadow-2xl transition-transform duration-500 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <img src={LOGO_URL} alt="Logo" className="h-8 object-contain" />
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1">
            {[
              { label: 'Início', icon: Moon, section: AppSection.HOME },
              { label: 'Loja', icon: ShoppingBag, section: AppSection.SHOP },
              { label: 'Clube Luna Maria Kids', icon: Heart, section: AppSection.SUBSCRIPTION },
              { label: 'Meus Pedidos', icon: ClipboardList, section: AppSection.REWARDS },
              { label: 'Minha Conta', icon: User, section: AppSection.REWARDS },
              { label: 'Ajuda / Atendimento', icon: HelpCircle, section: AppSection.HOME },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigateTo(item.section)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${section === item.section ? 'bg-[#BBD4E8]/10 text-[#6B5A53]' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <item.icon size={20} className={section === item.section ? 'text-[#BBD4E8]' : 'text-gray-300'} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Simulação de Assinatura</p>
              <button
                onClick={() => setIsSubscriber(!isSubscriber)}
                className={`w-full p-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors ${isSubscriber ? 'bg-green-100 text-green-600' : 'bg-white border border-gray-200 text-gray-400'}`}
              >
                {isSubscriber ? 'Status: Assinante' : 'Ativar Modo Assinante'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500 pb-32">
      <HomeHero />
      <AutoCarousel />
      <DifferentialsSection />
    </div>
  );

  const renderShop = () => (
    <div className="animate-in slide-in-from-right duration-500 min-h-screen pb-32">
      <CategoryMenu />

      <div className="mt-8">
        <DepartmentCarousel id="offers" title="🌙 Uma Lua de Ofertas" products={INITIAL_PRODUCTS} />
        <DepartmentCarousel id="menina" title="🎀 Moda Menina" products={INITIAL_PRODUCTS} />
        <DepartmentCarousel id="menino" title="🚀 Moda Menino" products={[...INITIAL_PRODUCTS].reverse()} />
        <DepartmentCarousel id="acessorios" title="✨ Acessórios Mágicos" products={INITIAL_PRODUCTS} />
        <DepartmentCarousel id="complementos" title="🎁 Complementos Luna" products={[...INITIAL_PRODUCTS].reverse()} />
      </div>

      <div className="px-6 lg:px-20 py-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-3xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter italic">Nossa Coleção Completa</h2>
          <p className="text-sm font-bold text-gray-400 italic">Explore todo o encanto da Luna Maria Kids.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {INITIAL_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onTryOn={(p) => { setSelectedProduct(p); setTryOnStep(2); if (!isSubscriber) setShowSubscriptionPopup(true); }} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="min-h-screen bg-[#FAF8F5] pb-32 animate-in fade-in duration-500 pt-16">
      {/* Hero Section */}
      <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <img src={CLUB_IMAGES.hero} alt="Pai e filho" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/20 to-transparent"></div>
        <div className="relative z-10 text-center px-8 mt-24 space-y-4">
          <h1 className="text-3xl font-black text-[#6B5A53] font-luna leading-tight uppercase tracking-tighter">🌙 CLUBE LUNA MARIA KIDS</h1>
          <p className="text-sm font-bold text-[#6B5A53] leading-relaxed italic max-w-[300px] mx-auto">
            Não é só uma caixa. É o momento em que seu filho sente que é o centro do universo.
          </p>
        </div>
      </section>

      {/* Intro Copy */}
      <section className="px-10 py-12 text-center space-y-8">
        <div className="space-y-4">
          <p className="text-lg font-black text-[#6B5A53] font-luna">Você lembra do que mais amava quando era criança?</p>
          <p className="text-sm font-bold text-[#6B5A53]/70 leading-relaxed italic">
            Aquela sensação de abrir um presente e achar que o mundo inteiro parou por você?
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-black text-[#6B5A53] leading-snug">
            É isso que você entrega pro seu filho.<br />
            <span className="text-[#BBD4E8] uppercase tracking-tighter">Sem precisar sair de casa. Sem gastar horas em loja. Sem esquecer o que realmente importa.</span>
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="px-6 py-8">
        <div className="bg-white p-8 rounded-[56px] shadow-2xl border border-gray-50 space-y-8">
          <h2 className="text-center text-xl font-black text-[#6B5A53] font-luna flex items-center justify-center gap-2 uppercase tracking-tighter">🎁 COMO FUNCIONA</h2>
          <p className="text-center text-xs font-bold text-gray-400 -mt-4 italic">Todo mês, chega um Kit Mágico com:</p>
          <div className="space-y-4">
            {[
              { t: 'Roupas que seu filho quer vestir até pra dormir', i: CheckCircle2 },
              { t: 'Brindes surpresa que fazem os olhos dele brilharem', i: Sparkles },
              { t: 'Atividades criativas longe da tela', i: Gamepad2 },
              { t: 'Mimos que fazem você se sentir um pai/mãe foda', i: Heart }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-5 rounded-[32px] bg-gray-50 border border-white shadow-sm">
                <div className="p-2 bg-[#BBD4E8] text-white rounded-xl"><Check size={14} /></div>
                <span className="text-xs font-black text-[#6B5A53] leading-tight uppercase tracking-tighter">{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você evita */}
      <section className="px-6 py-12 bg-[#F5D8E8]/10">
        <div className="text-center space-y-8">
          <h2 className="text-xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter">O QUE VOCÊ EVITA AO ASSINAR</h2>
          <div className="space-y-4 text-left max-w-[320px] mx-auto">
            {[
              'A correria de última hora no shopping',
              'A culpa de ter passado mais um mês sem criar momentos especiais',
              'A sensação de que está falhando por não “estar tão presente quanto queria”'
            ].map((text, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-6 h-6 bg-red-100 text-red-400 rounded-full flex items-center justify-center font-black">❌</div>
                <p className="text-xs font-bold text-[#6B5A53]/80 leading-tight">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você entrega */}
      <section className="px-6 py-12">
        <div className="bg-[#6B5A53] p-10 rounded-[56px] shadow-2xl space-y-8 text-center text-white">
          <h2 className="text-xl font-black font-luna uppercase tracking-tighter flex items-center justify-center gap-2">💖 O QUE VOCÊ ENTREGA TODO MÊS PARA SEU FILHA(A)</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/10 rounded-3xl border border-white/20"><p className="text-xs font-black uppercase tracking-widest">UM MOMENTO DE ENCANTO</p></div>
            <div className="p-4 bg-white/10 rounded-3xl border border-white/20"><p className="text-xs font-black uppercase tracking-widest">UMA EXPERIÊNCIA QUE SEU FILHO VAI LEMBRAR</p></div>
            <div className="p-4 bg-white/10 rounded-3xl border border-white/20"><p className="text-xs font-black uppercase tracking-widest">UMA ROTINA DE CONEXÃO FAMILIAR</p></div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="px-6 py-12 space-y-10">
        <h2 className="text-center text-xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter">ESCOLHA O QUE DESEJA PARA SEU FILHO HOJE</h2>
        <div className="space-y-6">
          <div className="bg-white border-2 border-blue-100 p-8 rounded-[48px] shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                <h3 className="font-black text-blue-500 font-luna text-xl uppercase italic">Abraço</h3>
              </div>
              <p className="text-xl font-black text-[#6B5A53]">R$ 69<span className="text-[10px]">/mês</span></p>
            </div>
            <p className="text-xs font-bold text-gray-400 italic">A porta de entrada pro encantamento</p>
            <p className="text-xs font-black text-[#6B5A53] uppercase">1 roupa + 1 mimo + acesso ao App</p>
            <button onClick={() => { setIsSubscriber(true); navigateTo(AppSection.SHOP); }} className="w-full bg-blue-500 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Quero Assinar Agora</button>
          </div>

          <div className="bg-white border-4 border-purple-200 p-8 rounded-[48px] shadow-2xl space-y-6 relative transform scale-[1.05] z-10">
            <div className="absolute top-0 right-10 bg-purple-500 text-white px-4 py-1.5 rounded-b-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">QUERIDINHO</div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
                <h3 className="font-black text-purple-500 font-luna text-xl uppercase italic">Brilho nos Olhos</h3>
              </div>
              <p className="text-2xl font-black text-[#6B5A53]">R$ 119<span className="text-[10px]">/mês</span></p>
            </div>
            <p className="text-xs font-bold text-gray-500 italic">O queridinho das famílias</p>
            <p className="text-xs font-black text-[#6B5A53] uppercase">2 roupas + 2 mimos + kit criativo + acesso total ao app</p>
            <button onClick={() => { setIsSubscriber(true); navigateTo(AppSection.SHOP); }} className="w-full bg-purple-500 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Quero Assinar Agora</button>
          </div>

          <div className="bg-white border-2 border-yellow-200 p-8 rounded-[48px] shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                <h3 className="font-black text-yellow-600 font-luna text-xl uppercase italic">Universo da Criança</h3>
              </div>
              <p className="text-xl font-black text-[#6B5A53]">R$ 189<span className="text-[10px]">/mês</span></p>
            </div>
            <p className="text-xs font-bold text-gray-400 italic">Experiência total</p>
            <p className="text-xs font-black text-[#6B5A53] uppercase leading-relaxed">
              3 roupas premium + kit criativo físico e digital + presente de aniversário + frete grátis + Provador inteligente
            </p>
            <button onClick={() => { setIsSubscriber(true); navigateTo(AppSection.SHOP); }} className="w-full bg-yellow-500 text-white py-5 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Quero Assinar Agora</button>
          </div>
        </div>
      </section>

      {/* Universo da Criança Specifics */}
      <section className="px-6 py-8">
        <div className="bg-white p-10 rounded-[56px] shadow-2xl space-y-8 border-2 border-yellow-100">
          <h2 className="text-center text-sm font-black text-[#6B5A53] font-luna uppercase tracking-tighter">E SÓ NO UNIVERSO DA CRIANÇA VOCÊ GANHA ESSES PRESENTES ESPECIAIS:</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { l: 'Jogos criativos', i: Gamepad2 },
              { l: 'Recompensas reais', i: Trophy },
              { l: 'Colorir com IA', i: Palette },
              { l: 'Controle total dos pais', i: ShieldCheck }
            ].map((b, i) => (
              <div key={i} className="bg-yellow-50 p-5 rounded-3xl flex flex-col items-center gap-3">
                <b.i size={20} className="text-yellow-600" />
                <span className="text-[9px] font-black text-[#6B5A53] uppercase tracking-widest text-center leading-tight">{b.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Hook */}
      <section className="px-10 py-12 text-center space-y-8">
        <div className="space-y-6 italic">
          <p className="text-sm font-black text-[#6B5A53]">Imagine seu filho contando pros amigos:</p>
          <p className="text-base font-black text-[#BBD4E8] uppercase">“Todo mês chega uma caixa mágica na minha casa.”</p>
          <div className="space-y-4 text-gray-400">
            <p className="text-xs font-bold">Agora imagine ele NUNCA dizendo isso.</p>
            <p className="text-xs font-bold">Porque você adiou. Porque achou que era só mais um clube.</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-black text-[#6B5A53]">Você não está comprando roupa.</p>
          <p className="text-sm font-black text-[#6B5A53] uppercase">Está comprando lembranças. Conexão. Presença real.</p>
        </div>
        <button
          onClick={() => navigateTo(AppSection.SHOP)}
          className="w-full bg-[#6B5A53] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          QUERO ASSINAR AGORA
        </button>
      </section>
    </div>
  );

  const renderCart = () => (
    <div className="pt-20 p-6 space-y-6 pb-32 animate-in slide-in-from-right duration-300 min-h-screen">
      <h2 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">Meu Carrinho</h2>
      {cart.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <div className="p-10 bg-white rounded-full w-fit mx-auto shadow-sm border border-gray-50 text-gray-200"><ShoppingBag size={56} /></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sacola vazia no momento</p>
          <button onClick={() => navigateTo(AppSection.SHOP)} className="px-10 py-4 bg-[#BBD4E8] text-white rounded-full font-black text-xs uppercase shadow-lg tracking-widest">Explorar a Loja</button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-[40px] shadow-sm border border-gray-100 flex gap-5 items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-[32px] shadow-sm" />
              <div className="flex-1">
                <h3 className="font-black text-[#6B5A53] text-sm font-luna uppercase italic truncate">{item.name}</h3>
                <p className="text-xs font-black text-[#BBD4E8] mt-1">R$ {item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={20} /></button>
            </div>
          ))}
          <div className="mt-12 bg-[#6B5A53] p-10 rounded-[56px] shadow-2xl space-y-6">
            <div className="flex justify-between items-center text-white">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Total do Pedido</span>
              <span className="text-2xl font-black">R$ {cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-white text-[#6B5A53] py-5 rounded-[32px] font-black text-xs uppercase shadow-xl tracking-widest active:scale-95 transition-all">Finalizar com Segurança</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative font-quicksand bg-[#FAF8F5]">
      <TopBar />
      <Header />
      <MobileSearch />
      <MiniBenefitsGrid />

      <Sidebar />

      <main className="relative z-10 w-full max-w-[1440px] mx-auto min-h-screen">
        {section === AppSection.HOME && renderHome()}
        {section === AppSection.SHOP && renderShop()}
        {section === AppSection.SUBSCRIPTION && renderSubscription()}
        {section === AppSection.CART && renderCart()}

        {(section === AppSection.ADMIN || section === AppSection.KIDS || section === AppSection.FAMILY_MOMENT || section === AppSection.REWARDS) && (
          <div className="p-8 text-center space-y-6 pt-32 min-h-screen flex flex-col items-center">
            <div className="p-10 bg-white rounded-full shadow-sm border border-pink-50 text-[#BBD4E8]"><Sparkles size={56} /></div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-luna text-[#6B5A53] uppercase italic">Pequena pausa mágica...</h2>
              <p className="text-sm text-gray-400 px-10 leading-relaxed font-bold italic">Estamos preparando algo especial nesta sessão.</p>
            </div>
            <button onClick={() => navigateTo(AppSection.HOME)} className="px-10 py-4 bg-[#6B5A53] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Voltar ao Início</button>
          </div>
        )}
      </main>

      {/* Popups and Overlays */}
      {showSubscriptionPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[64px] p-12 shadow-2xl text-center space-y-8 animate-in zoom-in duration-500 relative">
            <button onClick={() => setShowSubscriptionPopup(false)} className="absolute top-8 right-8 p-2 bg-gray-50 rounded-full text-gray-400"><X size={20} /></button>
            <div className="w-20 h-20 bg-purple-50 rounded-[32px] flex items-center justify-center mx-auto border-2 border-white shadow-sm text-purple-400"><Lock size={40} /></div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">Acesso Exclusivo</h3>
              <p className="text-xs font-bold text-[#6B5A53]/60 leading-relaxed italic">Este recurso faz parte do Clube Luna Maria. Assine agora e tenha acesso ilimitado!</p>
            </div>
            <button
              onClick={() => { setShowSubscriptionPopup(false); navigateTo(AppSection.SUBSCRIPTION); }}
              className="w-full bg-purple-400 text-white py-5 rounded-[28px] font-black text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Conhecer o Clube
            </button>
          </div>
        </div>
      )}

      {showHomeTryOnInfo && renderHomeTryOnPopup()}

      {/* Payment Logic (Upsell) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[56px] p-10 shadow-2xl text-center space-y-8">
            {!paymentConfirmed ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">Deseja guardar essa lembrança?</h3>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed italic px-6">O download da imagem em alta resolução custa R$ 5,00.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setPaymentConfirmed(true); }, 1500); }} className="bg-[#6B5A53] text-white py-5 rounded-[28px] font-black text-sm uppercase shadow-xl tracking-widest">{loading ? 'Processando...' : 'Confirmar Pagamento'}</button>
                  <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Voltar</button>
                </div>
              </>
            ) : (
              <div className="space-y-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-400"><Check size={32} /></div>
                <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">Imagem liberada com carinho 💛</h3>
                <button onClick={() => { const link = document.createElement('a'); link.href = tryOnResult || ''; link.download = 'luna-maria-look.png'; link.click(); setShowPaymentModal(false); setPaymentConfirmed(false); }} className="w-full bg-green-400 text-white py-5 rounded-[32px] font-black text-sm uppercase shadow-xl tracking-widest">⬇️ Baixar Agora</button>
              </div>
            )}
          </div>
        </div>
      )}

      <Mascot message={mascotMsg} />
      <Navigation currentSection={section} onNavigate={navigateTo} cartCount={cart.length} />
    </div>
  );
};

export default App;
