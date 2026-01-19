
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
  Settings2, CheckCircle2, Trophy, HelpCircle, ClipboardList, Truck, Star as StarIcon, ChevronLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

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

  const Header = () => (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 z-[60] flex items-center justify-between shadow-sm">
      {/* ⬅️ LADO ESQUERDO: Menu Sanduíche */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
        aria-label="Abrir menu"
      >
        <Menu size={24} className="text-[#6B5A53]" />
      </button>

      {/* 🔝 CENTRO: Logotipo Centralizado */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center w-32">
        <img
          src={LOGO_URL}
          alt="Luna Maria Kids Logo"
          className="h-9 object-contain cursor-pointer"
          onClick={() => navigateTo(AppSection.HOME)}
        />
      </div>

      {/* ➡️ LADO DIREITO: Carrinho e Conta */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigateTo(AppSection.CART)}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
          aria-label="Meu carrinho"
        >
          <ShoppingBag size={22} className="text-[#6B5A53]" />
          {cart.length > 0 && (
            <span className="absolute top-1 right-1 bg-pink-400 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
              {cart.length}
            </span>
          )}
        </button>
        <button
          onClick={() => navigateTo(AppSection.REWARDS)}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Minha conta"
        >
          <User size={22} className="text-[#6B5A53]" />
        </button>
      </div>
    </header>
  );

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

  const ProductCard = ({ product, onTryOn }: { product: Product, onTryOn: (p: Product) => void }) => (
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

  const renderHome = () => (
    <div className="pt-20 space-y-12 animate-in fade-in duration-500 pb-32 overflow-x-hidden">
      {/* Hero Banner */}
      <section className="px-6">
        <div className="relative h-[400px] rounded-[48px] overflow-hidden group cursor-pointer" onClick={() => navigateTo(AppSection.SUBSCRIPTION)}>
          <img src={CLUB_IMAGES.hero} alt="Mundo Luna Maria" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white space-y-4">
            <h1 className="text-3xl font-black font-luna uppercase italic tracking-tighter leading-none shadow-sm">Vista a Magia de Ser Criança</h1>
            <p className="text-sm font-bold italic opacity-90 max-w-[280px]">Assine e transforme cada mês em uma lembrança inesquecível.</p>
            <button className="bg-white text-[#6B5A53] px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Desbloqueie a Magia</button>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6">
        {[
          { color: 'bg-blue-50', icon: Truck, t: 'FRETE GRÁTIS', d: 'Em todo o clube' },
          { color: 'bg-pink-50', icon: CreditCard, t: 'ATÉ 10X', d: 'Sem juros no cartão' },
          { color: 'bg-cream', icon: ShieldCheck, t: 'TROCA FÁCIL', d: '30 dias garantidos' },
          { color: 'bg-orange-50', icon: Award, t: 'SELO LUNA', d: 'Qualidade premium' }
        ].map((b, i) => (
          <div key={i} className={`${b.color} p-5 rounded-3xl border border-white flex flex-col items-center text-center gap-2 shadow-sm`}>
            <b.icon size={20} className="text-[#6B5A53]/40" />
            <h3 className="text-[10px] font-black text-[#6B5A53] tracking-tighter">{b.t}</h3>
            <p className="text-[8px] font-bold text-gray-400 uppercase italic">{b.d}</p>
          </div>
        ))}
      </section>

      {/* Categorias Circulares */}
      <section className="space-y-6">
        <h2 className="text-center text-sm font-black text-[#6B5A53] uppercase tracking-widest">Navegar por categoria</h2>
        <div className="flex justify-between px-6 gap-2 overflow-x-auto scrollbar-hide">
          {[
            { label: 'Menina', img: '/girl.png' },
            { label: 'Menino', img: '/boy.png' },
            { label: 'Bebê', img: '/baby.png' },
            { label: 'Mimos', img: '/toys.png' }
          ].map((cat, i) => (
            <button key={i} onClick={() => navigateTo(AppSection.SHOP)} className="flex flex-col items-center gap-3 shrink-0 group">
              <div className="w-[85px] h-[85px] rounded-full overflow-hidden border-4 border-white shadow-md transition-transform group-hover:scale-105">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-black text-[#6B5A53] uppercase tracking-tighter">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Vitrine 1: Mais Amados */}
      <section className="px-6">
        <ProductCarousel
          title="✨ Mais Amados da Luna"
          products={INITIAL_PRODUCTS}
          onTryOn={(p) => { setSelectedProduct(p); setTryOnStep(2); if (!isSubscriber) setShowSubscriptionPopup(true); }}
        />
      </section>

      {/* Banner de Assinatura Meio de Página */}
      <section className="px-6">
        <div className="bg-[#6B5A53] p-8 rounded-[48px] text-white space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Moon size={120} /></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl font-black font-luna uppercase italic tracking-tighter leading-tight">Clube Luna Maria: Mais que Moda, Conexão Real.</h2>
            <p className="text-xs font-bold leading-relaxed italic pr-12">Receba mensalmente o kit que faz os olhos do seu filho brilharem de alegria.</p>
            <button onClick={() => navigateTo(AppSection.SUBSCRIPTION)} className="bg-white text-[#6B5A53] px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Assinar Agora</button>
          </div>
        </div>
      </section>

      {/* Vitrine 2: Novidades */}
      <section className="px-6">
        <ProductCarousel
          title="🌙 Novidades Encantadas"
          products={[...INITIAL_PRODUCTS].reverse()}
          onTryOn={(p) => { setSelectedProduct(p); setTryOnStep(2); if (!isSubscriber) setShowSubscriptionPopup(true); }}
        />
      </section>

      {showHomeTryOnInfo && renderHomeTryOnPopup()}
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
            <button onClick={() => { setIsSubscriber(true); navigateTo(AppSection.SHOP); }} className="w-full bg-yellow-500 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Quero Assinar Agora</button>
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

  const renderShop = () => {
    const handleTryClick = (product: Product) => {
      if (isSubscriber) {
        setSelectedProduct(product);
        setTryOnStep(2);
      } else {
        setShowSubscriptionPopup(true);
      }
    };

    return (
      <div className="pt-24 space-y-12 pb-32 animate-in slide-in-from-right duration-500 min-h-screen overflow-x-hidden">
        {tryOnStep === 0 ? (
          <>
            <header className="px-6 space-y-2">
              <h2 className="text-2xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter italic">Nossa Coleção</h2>
              <p className="text-xs font-bold text-gray-400 italic">Curadoria exclusiva para momentos de felicidade.</p>
            </header>

            {/* Categorias Filtro Horizontal */}
            <div className="flex gap-3 px-6 overflow-x-auto scrollbar-hide">
              {['Todos', 'Vestidos', 'Conjuntos', 'Brinquedos', 'Acessórios'].map((cat, i) => (
                <button key={i} className={`shrink-0 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${i === 0 ? 'bg-[#6B5A53] text-white border-[#6B5A53]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="px-6">
              <ProductCarousel
                title="Sugestões para Você"
                products={INITIAL_PRODUCTS}
                onTryOn={handleTryClick}
              />
            </div>

            <div className="px-6 space-y-6">
              <h2 className="text-sm font-black text-[#6B5A53] uppercase tracking-widest italic ml-2">Explorar Tudo</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {INITIAL_PRODUCTS.map(product => (
                  <div key={product.id} className="flex flex-col gap-2">
                    <ProductCard product={product} onTryOn={handleTryClick} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <header className="flex items-center gap-4">
              <button onClick={() => setTryOnStep(0)} className="p-3 bg-white rounded-2xl shadow-sm"><ArrowLeft size={20} /></button>
              <div>
                <h2 className="text-lg font-black text-[#6B5A53] font-luna uppercase">Provador Inteligente</h2>
                <p className="text-[10px] font-bold text-gray-400">{selectedProduct?.name}</p>
              </div>
            </header>
            {tryOnStep === 2 && (
              <div className="bg-white p-10 rounded-[56px] shadow-2xl border-2 border-purple-50 space-y-8 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-300"><ShieldCheck size={32} /></div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">Uso Consciente</h3>
                  <p className="text-sm font-bold text-[#6B5A53]/60 leading-relaxed italic px-4">
                    “Você pode fazer até <span className="text-purple-400">3 simulações gratuitas</span>. Para baixar a imagem final, o valor é R$ 5,00.”
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setTryOnStep(3)} className="bg-purple-400 text-white py-5 rounded-[32px] font-black text-sm uppercase shadow-lg shadow-purple-100 active:scale-95 transition-all">Continuar</button>
                  <button onClick={() => setTryOnStep(0)} className="text-gray-400 py-2 font-bold text-xs uppercase tracking-widest">Cancelar</button>
                </div>
              </div>
            )}
            {tryOnStep === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Smartphone, t: 'Criança em pé', d: 'Mantenha o corpo ereto' },
                    { icon: Cloud, t: 'Corpo inteiro', d: 'Enquadre de corpo inteiro' },
                    { icon: Zap, t: 'Fundo claro', d: 'Evite fundos poluídos' },
                    { icon: Heart, t: 'Muita Luz', d: 'Melhora a simulação IA' }
                  ].map((o, i) => (
                    <div key={i} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex flex-col items-center text-center gap-3">
                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-300"><o.icon size={24} /></div>
                      <p className="text-[10px] font-black text-[#6B5A53] uppercase leading-tight">{o.t}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setTryOnStep(4)} className="w-full bg-[#6B5A53] text-white py-5 rounded-[32px] font-black text-sm uppercase shadow-xl active:scale-95 transition-all tracking-widest">Estou Pronto(a)</button>
              </div>
            )}
            {tryOnStep === 4 && (
              <div className="space-y-8 animate-in slide-in-from-bottom duration-300">
                <div className="space-y-4">
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white p-8 rounded-[48px] shadow-sm border-2 border-dashed border-purple-100 flex items-center justify-center gap-4 active:scale-95 transition-all">
                    <CameraIcon className="text-purple-400" size={32} />
                    <div className="text-left">
                      <p className="font-black text-[#6B5A53] uppercase text-xs italic tracking-tighter">📷 Tirar foto agora</p>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="user" onChange={handleFileUpload} />
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white p-8 rounded-[48px] shadow-sm border-2 border-dashed border-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all">
                    <Eye className="text-blue-400" size={32} />
                    <div className="text-left">
                      <p className="font-black text-[#6B5A53] uppercase text-xs italic tracking-tighter">🖼️ Escolher da galeria</p>
                    </div>
                  </button>
                </div>
                <p className="text-[10px] font-black text-gray-400 text-center uppercase italic">“A imagem não é armazenada e serve apenas para simulação.”</p>
              </div>
            )}
            {tryOnStep === 5 && (
              <div className="flex flex-col items-center justify-center py-24 space-y-8">
                <div className="w-32 h-32 border-8 border-purple-50 border-t-purple-400 rounded-full animate-spin"></div>
                <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">Ajustando o Look...</h3>
              </div>
            )}
            {tryOnStep === 6 && tryOnResult && (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="bg-white p-5 rounded-[64px] shadow-2xl border-4 border-white overflow-hidden relative">
                  <img src={tryOnResult} className="w-full rounded-[48px]" alt="Resultado" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border border-white/50 text-[10px] font-black text-[#6B5A53] uppercase tracking-widest italic">Simulado com Carinho 💛</div>
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic">{selectedProduct?.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tamanho {selectedSize} • {selectedColor}</p>
                    </div>
                    <p className="text-2xl font-black text-purple-400">R$ {selectedProduct?.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { if (selectedProduct) addToCart(selectedProduct); navigateTo(AppSection.CART); }} className="w-full bg-[#6B5A53] text-white py-6 rounded-[32px] font-black text-sm uppercase shadow-xl active:scale-95 transition-all tracking-widest">🛒 Comprar agora</button>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setTryOnStep(0)} className="p-4 bg-gray-50 text-gray-400 rounded-[24px] font-black text-[10px] uppercase border border-gray-100 tracking-widest">🔄 Trocar Look</button>
                      <button onClick={() => setShowPaymentModal(true)} className="p-4 bg-purple-50 text-purple-400 rounded-[24px] font-black text-[10px] uppercase border border-purple-100 tracking-widest shadow-sm">⬇️ Baixar (R$5)</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exclusive Membership Popup */}
        {showSubscriptionPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[64px] p-12 shadow-2xl text-center space-y-8 animate-in zoom-in duration-500 relative">
              <button onClick={() => setShowSubscriptionPopup(false)} className="absolute top-8 right-8 p-2 bg-gray-50 rounded-full text-gray-400"><X size={20} /></button>
              <div className="w-20 h-20 bg-purple-50 rounded-[32px] flex items-center justify-center mx-auto border-2 border-white shadow-sm text-purple-400"><Lock size={40} /></div>
              <div className="space-y-4">
                <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase leading-tight italic px-4 tracking-tighter">O Provador é um carinho do nosso Clube</h3>
                <p className="text-xs font-bold text-gray-400 leading-relaxed italic px-4">
                  “Assine agora e experimente os looks no seu pequeno(a) antes de comprar.”
                </p>
              </div>
              <div className="space-y-3 text-left bg-purple-50/30 p-6 rounded-[32px] border border-purple-100">
                {[
                  'Segurança total na escolha',
                  'Menos trocas e tempo livre',
                  'Momentos mágicos com IA',
                  'Benefícios reais em cada caixa'
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <CheckCircle2 size={16} className="text-purple-400" />
                    <p className="text-[10px] font-black text-[#6B5A53] uppercase tracking-tighter">{t}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigateTo(AppSection.SUBSCRIPTION)}
                className="w-full bg-purple-400 text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                ✨ Fazer parte do Clube Agora
              </button>
            </div>
          </div>
        )}

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
      </div>
    );
  };

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
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden font-quicksand bg-[#FAF8F5]">
      <Header />
      <Sidebar />

      <main className="relative z-10 min-h-screen">
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

      <Mascot message={mascotMsg} />
      <Navigation currentSection={section} onNavigate={navigateTo} cartCount={cart.length} />
    </div>
  );
};

export default App;
