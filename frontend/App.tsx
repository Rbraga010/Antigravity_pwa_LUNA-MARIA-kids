
// Restore: Recuperação da interface e conteúdos originais
import React, { useState, useEffect, useRef } from 'react';
import { AppSection, Product, CartItem, UserProfile, Game, CarouselItem, ContentMaterial } from './types';
import { INITIAL_PRODUCTS, COLORING_THEMES, GAMES, SAMPLE_KIDS_MATERIALS, SAMPLE_FAMILY_MATERIALS } from './constants';
import Navigation from './components/Navigation';
import Mascot from './components/Mascot';
import {
  Sparkles, Cloud, Moon, Star, Heart, ChevronRight, Plus, Minus, Trash2,
  ShoppingBag, Palette, Gamepad2, Award, Download, Camera as CameraIcon,
  Users as UsersIcon, ShieldCheck, User, X, Check, AlertCircle, Zap,
  ArrowLeft, RefreshCw, Smartphone, CreditCard, Menu, Eye, Lock,
  Settings2, CheckCircle2, Trophy, HelpCircle, ClipboardList, Truck, Star as StarIcon, ChevronLeft,
  Facebook, Instagram, Twitter, Search, ShoppingCart, Home, MessageCircle, Edit3
} from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import { AdminStatsComponent } from './AdminStats';
import { FormatTips } from './components/FormatTips';
import { HelpButton } from './components/HelpButton';
import { GoogleGenAI } from "@google/genai";

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Premium Modular Components
import { HeroSection } from './components/HeroSection';
import { PremiumProductCard } from './components/PremiumProductCard';
import { TryOnGuide } from './components/TryOnGuide';
import { UGCGallery } from './components/UGCGallery';
import { AutoCarousel } from './components/AutoCarousel';
import { DifferentialsSection } from './components/DifferentialsSection';
import { AdminModalsComponent } from './components/AdminModalsComponent';
import { TryOnModal } from './components/TryOnModal';
import { motion, AnimatePresence } from 'framer-motion';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || "dummy-key" });


const LOGO_URL = "https://storage.googleapis.com/msgsndr/mUZEjZcfs8vJQPN3EnCF/media/696ed4b28ec5c998d1d2d5e6.png";
const CLUB_URL = "https://publicado-p-gina-clubeda-luna.vercel.app/";
const DEFAULT_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="bold" fill="#999">Sem imagem</text></svg>')}`;

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
    name: 'Visitante',
    email: '',
    role: 'USER', // Iniciamos como usuário comum - login via modal
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
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [selectedSize, setSelectedSize] = useState('4');
  const [selectedColor, setSelectedColor] = useState('Azul');
  const [childrenProfiles, setChildrenProfiles] = useState<string[]>([]);
  const [numChildren, setNumChildren] = useState(0);
  const [childrenDetails, setChildrenDetails] = useState<{ name: string, birthDate: string }[]>([]);
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [showConstructionPopup, setShowConstructionPopup] = useState(false);

  // Admin and Dynamic Content States
  const [topCarousel, setTopCarousel] = useState<CarouselItem[]>([]);
  const [featuredCarousel, setFeaturedCarousel] = useState<CarouselItem[]>([]);
  const [kidsMaterials, setKidsMaterials] = useState<ContentMaterial[]>([]);
  const [familyMaterials, setFamilyMaterials] = useState<ContentMaterial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCarouselItem, setEditingCarouselItem] = useState<CarouselItem | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<ContentMaterial | null>(null);
  const [sortOption, setSortOption] = useState<'default' | 'price_asc' | 'price_desc' | 'newest'>('default');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [mascotMsg, setMascotMsg] = useState('Bem vinda ao mundo da Luna');

  // API Helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const mapBackendProductToFrontend = (p: any): Product => ({
    id: p.id,
    name: p.name,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    oldPrice: p.old_price ? (typeof p.old_price === 'string' ? parseFloat(p.old_price) : p.old_price) : undefined,
    image: p.image_url,
    category: p.category,
    description: p.description,
    displayOrder: p.display_order,
    sizes: p.sizes || [],
    is_featured: p.is_featured || false,
    stock: p.stock
  });

  // Load initial data and check authentication
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem('authToken');
        if (token) {
          const userRes = await fetch('/api/auth/me', {
            headers: getAuthHeaders()
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(prev => ({ ...prev, ...userData }));
            setIsSubscriber(!!userData.is_subscriber);
          } else {
            localStorage.removeItem('authToken');
          }
        }

        // Load products (public)
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.map(mapBackendProductToFrontend));
        } else {
          setProducts([]);
        }

        // Load carousels and content (try to load, fallback to empty if not available)
        try {
          const carouselsRes = await fetch('/api/admin/carousels', {
            headers: getAuthHeaders()
          });
          if (carouselsRes.ok) {
            const carouselsData = await carouselsRes.json();
            setTopCarousel(carouselsData.filter((c: CarouselItem) => c.type === 'TOP'));
            setFeaturedCarousel(carouselsData.filter((c: CarouselItem) => c.type === 'FEATURED'));
          }
        } catch (e) {
          // Not critical, carousels will be empty
        }

        try {
          const materialsRes = await fetch('/api/admin/content', {
            headers: getAuthHeaders()
          });
          if (materialsRes.ok) {
            const materialsData = await materialsRes.json();
            setKidsMaterials(materialsData.filter((m: ContentMaterial) => m.section === 'KIDS'));
            setFamilyMaterials(materialsData.filter((m: ContentMaterial) => m.section === 'FAMILY'));
          } else {
            setKidsMaterials(SAMPLE_KIDS_MATERIALS);
            setFamilyMaterials(SAMPLE_FAMILY_MATERIALS);
          }
        } catch (e) {
          setKidsMaterials(SAMPLE_KIDS_MATERIALS);
          setFamilyMaterials(SAMPLE_FAMILY_MATERIALS);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setProducts([]);
      }
    };

    loadData();
  }, []);

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

  const getSortedProducts = (products: Product[]) => {
    const sorted = [...products];
    switch (sortOption) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        // No campo 'createdAt' real, aqui simulamos com reverse ou ID
        return sorted.reverse();
      default:
        return sorted.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
  };

  const adjustImageForCategory = (imageUrl: string, category: string) => {
    // Lógica para ajuste automático baseada na categoria
    // Por exemplo, acessórios precisam de mais zoom, roupas de bebê de centralização
    const adjustments: Record<string, string> = {
      'acessorios': 'scale-110 object-center',
      'menina-bebe': 'object-top',
      'menino-bebe': 'object-top',
      'menina-kids': 'object-center',
      'menino-kids': 'object-center'
    };
    return adjustments[category] || 'object-center';
  };

  // API Handlers for Admin Operations
  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const toggleUserSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_subscriber: !currentStatus })
      });
      if (res.ok) {
        fetchAllUsers();
        setMascotMsg('Status do usuário atualizado! ✨');
      }
    } catch (error) {
      setMascotMsg('Erro ao atualizar usuário.');
    }
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      setLoading(true);
      const method = productData.id ? 'PATCH' : 'POST';
      const url = '/api/admin/products';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        const mappedProduct = mapBackendProductToFrontend(savedProduct);
        setProducts(prev => {
          const index = prev.findIndex(p => p.id === mappedProduct.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = mappedProduct;
            return updated;
          }
          return [...prev, mappedProduct];
        });
        setEditingProduct(null);
        setMascotMsg('Produto salvo com sucesso! ✨');
      } else {
        setMascotMsg('Erro ao salvar produto. Tente novamente.');
      }
    } catch (error) {
      setMascotMsg('Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: productId })
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        setEditingProduct(null);
        setMascotMsg('Produto excluído com sucesso!');
      } else {
        setMascotMsg('Erro ao excluir produto.');
      }
    } catch (error) {
      setMascotMsg('Erro ao excluir produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCarousel = async (carouselData: CarouselItem) => {
    try {
      setLoading(true);
      const method = carouselData.id ? 'PATCH' : 'POST';
      const url = '/api/admin/carousels';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(carouselData)
      });

      if (response.ok) {
        const savedCarousel = await response.json();
        if (savedCarousel.type === 'TOP') {
          setTopCarousel(prev => {
            const index = prev.findIndex(c => c.id === savedCarousel.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = savedCarousel;
              return updated;
            }
            return [...prev, savedCarousel];
          });
        } else {
          setFeaturedCarousel(prev => {
            const index = prev.findIndex(c => c.id === savedCarousel.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = savedCarousel;
              return updated;
            }
            return [...prev, savedCarousel];
          });
        }
        setEditingCarouselItem(null);
        setMascotMsg('Banner salvo com sucesso! ✨');
      } else {
        setMascotMsg('Erro ao salvar banner.');
      }
    } catch (error) {
      setMascotMsg('Erro ao salvar banner.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarousel = async (carouselId: string, type: 'TOP' | 'FEATURED') => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;

    try {
      setLoading(true);
      const response = await fetch('/api/carousels', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: carouselId })
      });

      if (response.ok) {
        if (type === 'TOP') {
          setTopCarousel(prev => prev.filter(c => c.id !== carouselId));
        } else {
          setFeaturedCarousel(prev => prev.filter(c => c.id !== carouselId));
        }
        setEditingCarouselItem(null);
        setMascotMsg('Banner excluído com sucesso!');
      } else {
        setMascotMsg('Erro ao excluir banner.');
      }
    } catch (error) {
      setMascotMsg('Erro ao excluir banner.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMaterial = async (materialData: ContentMaterial) => {
    try {
      setLoading(true);
      const method = materialData.id ? 'PATCH' : 'POST';
      const url = '/api/admin/content';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(materialData)
      });

      if (response.ok) {
        const savedMaterial = await response.json();
        if (savedMaterial.section === 'KIDS') {
          setKidsMaterials(prev => {
            const index = prev.findIndex(m => m.id === savedMaterial.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = savedMaterial;
              return updated;
            }
            return [...prev, savedMaterial];
          });
        } else {
          setFamilyMaterials(prev => {
            const index = prev.findIndex(m => m.id === savedMaterial.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = savedMaterial;
              return updated;
            }
            return [...prev, savedMaterial];
          });
        }
        setEditingMaterial(null);
        setMascotMsg('Material salvo com sucesso! ✨');
      } else {
        setMascotMsg('Erro ao salvar material.');
      }
    } catch (error) {
      setMascotMsg('Erro ao salvar material.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string, section: 'KIDS' | 'FAMILY') => {
    if (!confirm('Tem certeza que deseja excluir este material?')) return;

    try {
      setLoading(true);
      const response = await fetch('/api/materials', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: materialId })
      });

      if (response.ok) {
        if (section === 'KIDS') {
          setKidsMaterials(prev => prev.filter(m => m.id !== materialId));
        } else {
          setFamilyMaterials(prev => prev.filter(m => m.id !== materialId));
        }
        setEditingMaterial(null);
        setMascotMsg('Material excluído com sucesso!');
      } else {
        setMascotMsg('Erro ao excluir material.');
      }
    } catch (error) {
      setMascotMsg('Erro ao excluir material.');
    } finally {
      setLoading(false);
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

  // Auto-fetch users when Admin Dashboard is active
  useEffect(() => {
    if (section === AppSection.ADMIN_DASHBOARD) {
      fetchAllUsers();
    }
  }, [section]);

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
      <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#6B5A53]">
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
        <button
          onClick={() => setShowLoginModal(true)}
          className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase text-[#6B5A53] tracking-wider hover:opacity-70"
        >
          <User size={18} />
          <span>{user.email ? 'Minha Conta' : 'Entrar'}</span>
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
      { id: 'menina-bebe', label: 'Menina Bebê (0-2 anos)' },
      { id: 'menina-kids', label: 'Menina Kids (3-8 anos)' },
      { id: 'menina-teen', label: 'Menina Teen (9-14 anos)' },
      { id: 'menino-bebe', label: 'Menino Bebê (0-2 anos)' },
      { id: 'menino-kids', label: 'Menino Kids (3-8 anos)' },
      { id: 'menino-teen', label: 'Menino Teen (9-14 anos)' },
      { id: 'unissex', label: 'Unissex' },
      { id: 'acessorios', label: 'Acessórios' },
      { id: 'calcados', label: 'Calçados' },
      { id: 'conjuntos', label: 'Conjuntos' }
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


  const TickerBar = () => {
    const items = [
      { icon: Sparkles, t: 'LOJA MÁGICA' },
      { icon: Moon, t: 'CLUBE DA LUNA' },
      { icon: UsersIcon, t: 'ESPAÇO FAMILIA' },
      { icon: Truck, t: 'FRETE GRÁTIS*' },
      { icon: CreditCard, t: 'ATÉ 10X*' },
      { icon: ShieldCheck, t: 'TROCA FÁCIL' },
      { icon: RefreshCw, t: 'SITE SEGURO' },
      { icon: Heart, t: 'OS KIDS AMAM' }
    ];

    // Duplicate items to ensure infinite scroll
    const tickerItems = [...items, ...items, ...items];

    return (
      <section className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 lg:gap-24">
          {tickerItems.map((b, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <div className="p-1.5 bg-cream rounded-lg text-[#6B5A53]"><b.icon size={16} /></div>
              <span className="text-[10px] lg:text-xs font-black text-[#6B5A53] tracking-widest uppercase">{b.t}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };


  const handleRegister = async (registrationData: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(prev => ({ ...prev, ...userData }));
        setIsSubscriber(!!userData.is_subscriber);
        setShowLoginModal(false);
        setMascotMsg(`Bem-vinda à família Luna Maria, ${userData.name}! ✨`);
        alert(`✅ Cadastro realizado com sucesso! Bem-vinda, ${userData.name}!`);
        return true;
      } else {
        const errorData = await response.json();
        setMascotMsg(errorData.error || 'Erro ao criar conta.');
        alert('Erro ao cadastrar: ' + (errorData.error || 'Tente novamente'));
        return false;
      }
    } catch (error) {
      const msg = 'Erro ao criar conta. Tente novamente.';
      setMascotMsg(msg);
      alert(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const HomeHero = () => (
    <HeroSection
      onNavigate={navigateTo}
      onRegister={handleRegister}
      loading={loading}
    />
  );


  const TryOnShowcase = () => (
    <section className="px-6 lg:px-20 py-6 bg-gradient-to-br from-pink-50/30 to-blue-50/30">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 flex items-center gap-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white shrink-0"><Sparkles size={16} /></div>
            <h3 className="text-lg font-black text-[#6B5A53] font-luna uppercase italic">Provador Inteligente</h3>
          </div>
          <p className="text-xs font-bold text-gray-500 italic">Veja como fica antes de comprar. Exclusivo Luna Maria.</p>
        </div>
        <button
          onClick={() => { setIframeUrl(CLUB_URL); setShowIframeModal(true); }}
          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          Testar Agora ✨
        </button>
      </div>
    </section>
  );

  const ExternalIframeModal = () => (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center transition-all duration-500 ${showIframeModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white w-full h-[95vh] rounded-t-[48px] overflow-hidden relative transition-transform duration-500 transform ${showIframeModal ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="absolute top-6 right-6 z-[210] flex gap-3">
          <button
            onClick={() => setShowIframeModal(false)}
            className="p-4 bg-white shadow-lg rounded-full text-[#6B5A53] hover:scale-105 active:scale-95 transition-all"
          >
            <X size={28} />
          </button>
        </div>

        <div className="h-full w-full pt-16">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-none"
            title="External Landing Page"
          />
        </div>
      </div>
    </div>
  );

  const DepartmentCarousel = ({ id, title, products, isAdmin, onEdit }: { id: string, title: string, products: Product[], isAdmin?: boolean, onEdit?: (p: Product) => void }) => (
    <section id={id} className={`px-6 lg:px-20 py-12 space-y-8 overflow-hidden transition-all ${isAdmin ? 'bg-pink-50/20' : ''}`}>
      <div className="space-y-4 border-b border-gray-100 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl lg:text-3xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">{title}</h2>
          {isAdmin && (
            <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-1">
              <Edit3 size={10} /> Editar Vitrine: {title}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigateTo(AppSection.SHOP)} className="text-[10px] font-black uppercase tracking-widest text-[#BBD4E8] hover:text-[#6B5A53] transition-colors">Ver Tudo</button>
        </div>
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
        {products.length === 0 ? (
          <div className="py-12 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 mx-auto w-full max-w-lg">
            <ShoppingBag size={32} className="mx-auto text-gray-200 mb-4" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Nenhum produto disponível nesta categoria</p>
          </div>
        ) : products.map(p => (
          <SwiperSlide key={p.id}>
            <div className="relative group p-2">
              <PremiumProductCard
                product={p}
                onTryOn={(selected) => {
                  setSelectedProduct(selected);
                  if (!isSubscriber) {
                    setShowSubscriptionPopup(true);
                  } else {
                    setShowTryOnModal(true);
                  }
                }}
                onAddToCart={addToCart}
                adjustImageForCategory={adjustImageForCategory}
              />
              {isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit?.(p); }}
                  className="absolute top-6 right-6 z-40 p-3 bg-pink-400 text-white rounded-full shadow-xl hover:scale-110 active:scale-90 transition-all border-4 border-white"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );

  const ContentRow = ({ title, items, isAdmin, onEdit }: { title: string, items: ContentMaterial[], isAdmin?: boolean, onEdit?: (m: ContentMaterial) => void }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-6 lg:px-20">
        <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">{title}</h3>
        {isAdmin && (
          <button
            onClick={() => onEdit?.({} as ContentMaterial)}
            className="text-[9px] font-black uppercase tracking-widest bg-pink-400 text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg"
          >
            <Plus size={10} /> Novo Conteúdo
          </button>
        )}
      </div>
      <Swiper
        modules={[SwiperNavigation]}
        spaceBetween={15}
        slidesPerView={1.2}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4.5 }
        }}
        className="content-row !px-6 lg:!px-20 !overflow-visible"
      >
        {items.length === 0 ? (
          <div className="px-6 lg:px-20">
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[32px] p-12 text-center">
              <Sparkles className="mx-auto text-gray-200 mb-4" size={32} />
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest italic">A magia está sendo preparada...</p>
            </div>
          </div>
        ) : items.map(item => (
          <SwiperSlide key={item.id}>
            <div className="relative group aspect-video rounded-3xl overflow-hidden shadow-xl bg-gray-100">
              <img src={item.thumbnail_url || DEFAULT_IMAGE} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-1">{item.type}</p>
                <h4 className="text-xs font-black text-white uppercase italic leading-tight">{item.title}</h4>
              </div>
              <button className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                  <Eye size={20} />
                </div>
              </button>
              {isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
                  className="absolute top-4 right-4 z-40 p-2 bg-pink-400 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                >
                  <Edit3 size={14} />
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  const renderKidsContent = () => (
    <div className="min-h-screen pb-32 space-y-12 pt-12 animate-in fade-in duration-500">
      <header className="px-6 lg:px-20 space-y-2">
        <h2 className="text-3xl lg:text-5xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">Espaço Kids</h2>
        <p className="text-sm font-bold text-gray-400 italic">Um mundo de diversão e aprendizado para os pequenos.</p>
      </header>

      <ContentRow title="📺 Vídeos Animados" items={kidsMaterials.filter(m => m.type === 'VIDEO')} isAdmin={isAdminEditing} onEdit={setEditingMaterial} />
      <ContentRow title="🎨 Atividades & Pinturas" items={kidsMaterials.filter(m => m.type === 'IMAGE' || m.type === 'PDF')} isAdmin={isAdminEditing} onEdit={setEditingMaterial} />
      <ContentRow title="🧠 Desafios da Luna" items={kidsMaterials.filter(m => m.section === 'KIDS')} isAdmin={isAdminEditing} onEdit={setEditingMaterial} />
    </div>
  );

  const renderFamilyContent = () => (
    <div className="min-h-screen pb-32 space-y-12 pt-12 animate-in fade-in duration-500">
      <header className="px-6 lg:px-20 space-y-2">
        <h2 className="text-3xl lg:text-5xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">Espaço Família</h2>
        <p className="text-sm font-bold text-gray-400 italic">Conexão, rituais e mimos para fortalecer os laços.</p>
      </header>

      <ContentRow title="📖 Guias & Rituais (PDF)" items={familyMaterials.filter(m => m.type === 'PDF')} isAdmin={isAdminEditing} onEdit={setEditingMaterial} />
      <ContentRow title="🎥 Momentos em Família" items={familyMaterials.filter(m => m.type === 'VIDEO')} isAdmin={isAdminEditing} onEdit={setEditingMaterial} />
      <ContentRow title="✨ Dicas de Ouro" items={familyMaterials.filter(m => m.section === 'FAMILY')} isAdmin={isAdminEditing} onEdit={setEditingMaterial} />
    </div>
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

  const LoginModal = () => (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4 transition-all ${showLoginModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-500 relative scrollbar-hide">
        <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-400 transition-all"><X size={24} /></button>

        {user.email ? (
          // User is logged in - show profile
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">{user.name}</h3>
              <p className="text-xs font-bold text-gray-400">{user.email}</p>
              {user.role === 'SUPER_ADMIN' && (
                <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
                  <ShieldCheck size={16} className="text-pink-400" />
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Super Admin</span>
                </div>
              )}
              {isSubscriber && (
                <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <StarIcon size={16} className="text-purple-400" />
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Assinante Clube</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button onClick={() => { setShowLoginModal(false); navigateTo(AppSection.MY_ACCOUNT); }} className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <User size={20} className="text-[#BBD4E8]" />
                <span className="text-sm font-black text-[#6B5A53]">Ver Perfil Completo</span>
              </button>

              <button onClick={() => { setShowLoginModal(false); navigateTo(AppSection.CART); }} className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <ShoppingCart size={20} className="text-[#6B5A53]" />
                <span className="text-sm font-black text-[#6B5A53]">Meu Carrinho</span>
              </button>

              {user.role === 'SUPER_ADMIN' && (
                <button onClick={() => { setShowLoginModal(false); navigateTo(AppSection.ADMIN_DASHBOARD); }} className="w-full flex items-center gap-3 p-4 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-colors">
                  <Settings2 size={20} className="text-pink-400" />
                  <span className="text-sm font-black text-pink-400">Painel Administrativo</span>
                </button>
              )}

              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  setUser({ name: 'Visitante', role: 'USER', tokens: 0, medals: [], drawingsCompleted: 0, coupons: [] });
                  setShowLoginModal(false);
                  setMascotMsg('Até logo! Volte sempre! 👋');
                }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors text-red-400"
              >
                <span className="text-sm font-black">Sair</span>
              </button>
            </div>
          </div>
        ) : (
          // User not logged in - show tabs
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-gray-50 p-1 rounded-3xl">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-white text-[#6B5A53] shadow-sm' : 'text-gray-400'}`}
              >
                Entrar
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'register' ? 'bg-white text-[#6B5A53] shadow-sm' : 'text-gray-400'}`}
              >
                Cadastrar
              </button>
            </div>

            {activeTab === 'login' ? (
              // Login Form
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-[#6B5A53] font-luna uppercase italic">Entrar na Conta ✨</h3>
                  <p className="text-xs font-bold text-gray-400 italic">Acesse sua conta Luna Maria Kids</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B5A53] uppercase tracking-widest pl-1">Email</label>
                    <input id="login-email" type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" placeholder="seu@email.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#6B5A53] uppercase tracking-widest pl-1">Senha</label>
                    <input id="login-password" type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-200" placeholder="••••••••" />
                  </div>

                  <button
                    onClick={async () => {
                      const email = (document.querySelector('#login-email') as HTMLInputElement)?.value.trim();
                      const password = (document.querySelector('#login-password') as HTMLInputElement)?.value.trim();

                      if (!email || !password) {
                        setMascotMsg('Preencha email e senha!');
                        return;
                      }

                      try {
                        setLoading(true);
                        const response = await fetch('/api/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, password })
                        });


                        if (response.ok) {
                          const { token, user: userData } = await response.json();
                          localStorage.setItem('authToken', token);
                          setUser(prev => ({ ...prev, ...userData }));
                          setIsSubscriber(!!userData.is_subscriber);
                          setShowLoginModal(false);
                          setMascotMsg(`Bem-vinda de volta, ${userData.name}! ✨`);
                        } else {
                          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
                          console.error('Login error:', errorData);
                          setMascotMsg(errorData.message || `Erro ${response.status}: Não foi possível fazer login.`);
                        }
                      } catch (error) {
                        console.error('Login exception:', error);
                        setMascotMsg(`Erro de conexão: ${error instanceof Error ? error.message : 'Tente novamente.'}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="w-full bg-pink-400 text-white py-5 rounded-[28px] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Entrando...' : 'Entrar ✨'}
                  </button>
                </div>
              </div>
            ) : (
              <RegistrationForm onSubmit={handleRegister} loading={loading} isModal={true} />

            )}
          </div>
        )}
      </div>
    </div>
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
              { label: 'Início', icon: Home, section: AppSection.HOME },
              { label: 'Loja Mágica', icon: ShoppingBag, section: AppSection.SHOP },
              { label: 'Espaço Kids', icon: Gamepad2, section: AppSection.KIDS },
              { label: 'Espaço Família', icon: UsersIcon, section: AppSection.FAMILY_MOMENT },
              { label: 'Clube da Luna', icon: Heart, onClick: () => { setIframeUrl(CLUB_URL); setShowIframeModal(true); } },
              { label: user.email ? 'Minha Conta' : 'Entrar / Cadastrar', icon: User, onClick: () => setShowLoginModal(true) },
              ...(user.email && user.role === 'SUPER_ADMIN' ? [{ label: 'Painel Admin', icon: Settings2, section: AppSection.ADMIN_DASHBOARD }] : []),
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => item.onClick ? item.onClick() : navigateTo(item.section as AppSection)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${(item.section && section === item.section) ? 'bg-[#BBD4E8]/10 text-[#6B5A53]' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <item.icon size={20} className={(item.section && section === item.section) ? 'text-[#BBD4E8]' : 'text-gray-300'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500 pb-32">
      <HomeHero />
      <AutoCarousel
        banners={topCarousel}
        isAdminEditing={isAdminEditing}
        onEdit={setEditingCarouselItem}
        onAdd={() => setEditingCarouselItem({ id: '', image_url: '', type: 'TOP', order: topCarousel.length } as CarouselItem)}
        defaultImage={DEFAULT_IMAGE}
      />
      <TryOnGuide onStart={() => navigateTo(AppSection.SHOP)} />
      <DifferentialsSection onNavigate={navigateTo} onOpenClube={() => { setIframeUrl(CLUB_URL); setShowIframeModal(true); }} />
      <UGCGallery />
    </div>
  );

  const renderShop = () => (
    <div className="animate-in slide-in-from-right duration-500 min-h-screen pb-32">
      <CategoryMenu />
      <TryOnShowcase />

      <div className="mt-8 relative">
        {isAdminEditing && (
          <div className="mx-6 mb-8 bg-pink-50 p-8 rounded-[40px] border-2 border-dashed border-pink-200 animate-in fade-in zoom-in duration-500 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-pink-600 font-luna uppercase italic">Gestão da Vitrine ✨</h3>
                <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest">Adicione novos tesouros ou organize a ordem mágica.</p>
              </div>
              <button
                onClick={() => setEditingProduct({} as Product)}
                className="bg-pink-400 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pink-100"
              >
                <Plus size={18} />
                Novo Produto
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end mb-6 px-6">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-gray-100">
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest pl-2">Ordenar por:</p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent text-[10px] font-black uppercase text-[#6B5A53] focus:outline-none pr-4 cursor-pointer"
            >
              <option value="default">Mágico</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="newest">Novidades</option>
            </select>
          </div>
        </div>

        <DepartmentCarousel
          id="offers"
          title="⭐ Ofertas do Dia"
          products={getSortedProducts(products.filter(p => p.is_featured))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />

        <DepartmentCarousel
          id="menina-bebe"
          title="🎀 Menina Bebê"
          products={getSortedProducts(products.filter(p => p.category === 'menina-bebe'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="menina-kids"
          title="🎀 Menina Kids (3-8 anos)"
          products={getSortedProducts(products.filter(p => p.category === 'menina-kids'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="menina-teen"
          title="🎀 Menina Teen (9-14 anos)"
          products={getSortedProducts(products.filter(p => p.category === 'menina-teen'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="menino-bebe"
          title="🚀 Menino Bebê (0-2 anos)"
          products={getSortedProducts(products.filter(p => p.category === 'menino-bebe'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="menino-kids"
          title="🚀 Menino Kids (3-8 anos)"
          products={getSortedProducts(products.filter(p => p.category === 'menino-kids'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="menino-teen"
          title="🚀 Menino Teen (9-14 anos)"
          products={getSortedProducts(products.filter(p => p.category === 'menino-teen'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="unissex"
          title="🌈 Unissex"
          products={getSortedProducts(products.filter(p => p.category === 'unissex'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="acessorios"
          title="✨ Acessórios"
          products={getSortedProducts(products.filter(p => p.category === 'acessorios'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="calcados"
          title="👟 Calçados"
          products={getSortedProducts(products.filter(p => p.category === 'calcados'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />
        <DepartmentCarousel
          id="conjuntos"
          title="🎁 Conjuntos"
          products={getSortedProducts(products.filter(p => p.category === 'conjuntos'))}
          isAdmin={isAdminEditing}
          onEdit={(p) => setEditingProduct(p)}
        />

        <div className="px-6 lg:px-20 py-12 space-y-12">
          <header className="space-y-4">
            <h2 className="text-3xl font-black text-[#6B5A53] font-luna uppercase tracking-tighter italic">Nossa Coleção Completa</h2>
            <p className="text-sm font-bold text-gray-400 italic">Explore todo o encanto da Luna Maria Kids.</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map(product => (
              <PremiumProductCard
                key={product.id}
                product={product}
                onTryOn={(p) => { setSelectedProduct(p); setTryOnStep(2); if (!isSubscriber) setShowSubscriptionPopup(true); }}
                onAddToCart={addToCart}
                adjustImageForCategory={adjustImageForCategory}
              />
            ))}
          </div>
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

  const renderMyAccount = () => (
    <div className="pt-24 p-6 lg:p-12 space-y-12 animate-in fade-in duration-500 min-h-screen max-w-[800px] mx-auto">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-black shadow-xl">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-[#6B5A53] font-luna uppercase italic">{user.name}</h2>
          <p className="text-gray-400 font-bold">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[40px] bg-white shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-purple-400">
            <Heart size={24} />
            <h3 className="font-black uppercase text-sm tracking-widest">Status do Clube</h3>
          </div>
          <p className="text-xs text-gray-400 italic">Você é um {isSubscriber ? 'Assinante Estrela' : 'Membro Explorador'} da Luna Maria.</p>
          <button onClick={() => navigateTo(AppSection.SUBSCRIPTION)} className="w-full py-4 bg-purple-50 text-purple-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-100 transition-all">Ver Assinatura</button>
        </div>

        <div className="p-8 rounded-[40px] bg-white shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-[#BBD4E8]">
            <ShoppingBag size={24} />
            <h3 className="font-black uppercase text-sm tracking-widest">Meus Pedidos</h3>
          </div>
          <p className="text-xs text-gray-400 italic">Acompanhe seus tesouros a caminho de casa.</p>
          <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">Nenhum pedido ainda</button>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('authToken');
          setUser({ name: 'Visitante', role: 'USER', tokens: 0, medals: [], drawingsCompleted: 0, coupons: [] });
          navigateTo(AppSection.HOME);
          setMascotMsg('Até logo! Volte sempre! 👋');
        }}
        className="w-full py-6 bg-red-50 text-red-400 rounded-[32px] font-black uppercase text-xs tracking-widest hover:bg-red-100 transition-all"
      >
        Sair da Conta
      </button>
    </div>
  );

  const renderAdminDashboard = () => (
    <>
      <HelpButton section="users" />
      <div className="pt-24 p-6 lg:p-12 space-y-12 animate-in fade-in duration-500 min-h-screen max-w-[1200px] mx-auto outline-none">
        <div className="flex justify-between items-end border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#6B5A53] font-luna uppercase italic tracking-tighter">Painel da Luna ✨</h2>
            <p className="text-gray-400 font-bold italic">Gestão da Loja e Conteúdos</p>
          </div>
          <button onClick={() => setIsAdminEditing(!isAdminEditing)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isAdminEditing ? 'bg-pink-400 text-white' : 'bg-white text-pink-400 border border-pink-100'}`}>
            {isAdminEditing ? 'Sair do Modo Edição' : 'Entrar no Modo Edição'}
          </button>
        </div>

        {/* Métricas reais via API */}
        <AdminStatsComponent token={localStorage.getItem('authToken') || ''} />
        <div className="bg-pink-50/50 p-10 rounded-[56px] border-2 border-dashed border-pink-100 text-center mb-12">
          <Settings2 size={48} className="mx-auto text-pink-200 mb-4" />
          <h3 className="text-lg font-black text-pink-400 font-luna uppercase italic">Controle de Catálogo Ativado</h3>
          <p className="text-xs font-bold text-pink-300 mt-2 italic">Navegue pelas seções e use os ícones de edição para alterar conteúdos.</p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#6B5A53]">
              <UsersIcon size={24} />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Visão Geral de Clientes ✨</h3>
            </div>
            <button onClick={fetchAllUsers} className="p-3 bg-white shadow-sm rounded-full text-[#BBD4E8] hover:text-pink-400 transition-all">
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="bg-white rounded-[48px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Esteira</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <p className="text-xs font-bold text-gray-400 italic">Clique em atualizar para carregar a lista de clientes.</p>
                      </td>
                    </tr>
                  ) : (
                    allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-400 text-sm font-black uppercase">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-[#6B5A53]">{u.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <p className="text-xs font-bold text-gray-500">{u.phone || 'N/A'}</p>
                          <p className="text-[10px] text-gray-300 font-bold">{u._count?.children || 0} filhos cadastrados</p>
                        </td>
                        <td className="p-8">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${u.leadType === 'Lead Assinante' ? 'bg-purple-50 text-purple-400' :
                            u.leadType === 'Lead Cliente' ? 'bg-green-50 text-green-400' :
                              'bg-blue-50 text-blue-400'
                            }`}>
                            <span className="text-[9px] font-black uppercase tracking-widest">{u.leadType || 'Lead Cadastrado'}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <button
                            onClick={() => toggleUserSubscription(u.id, u.is_subscriber)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${u.is_subscriber ? 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400' : 'bg-purple-400 text-white shadow-lg hover:scale-105'}`}
                          >
                            {u.is_subscriber ? 'Remover Clube' : 'Tornar Assinante'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
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
              <img src={item.image || DEFAULT_IMAGE} alt={item.name} className="w-24 h-24 object-cover rounded-[32px] shadow-sm" />
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
    <div className="min-h-screen relative font-quicksand bg-[#FAF8F5]" >
      <TopBar />
      <Header />
      <MobileSearch />
      <TickerBar />

      <ExternalIframeModal />
      <AdminModalsComponent
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        handleSaveProduct={handleSaveProduct}
        handleDeleteProduct={handleDeleteProduct}
        editingCarouselItem={editingCarouselItem}
        setEditingCarouselItem={setEditingCarouselItem}
        handleSaveCarousel={handleSaveCarousel}
        handleDeleteCarousel={handleDeleteCarousel}
        editingMaterial={editingMaterial}
        setEditingMaterial={setEditingMaterial}
        handleSaveMaterial={handleSaveMaterial}
        handleDeleteMaterial={handleDeleteMaterial}
        loading={loading}
        defaultImage={DEFAULT_IMAGE}
      />

      <TryOnModal
        isOpen={showTryOnModal}
        onClose={() => setShowTryOnModal(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
        onDownload={(url) => { setTryOnResult(url); setShowPaymentModal(true); }}
      />

      <Sidebar />

      <main className="relative z-10 w-full max-w-[1440px] mx-auto min-h-screen">
        {section === AppSection.HOME && renderHome()}
        {section === AppSection.SHOP && renderShop()}
        {section === AppSection.KIDS && renderKidsContent()}
        {section === AppSection.FAMILY_MOMENT && renderFamilyContent()}
        {section === AppSection.SUBSCRIPTION && renderSubscription()}
        {section === AppSection.CART && renderCart()}
        {section === AppSection.MY_ACCOUNT && renderMyAccount()}
        {section === AppSection.ADMIN_DASHBOARD && renderAdminDashboard()}

        {(section === AppSection.ADMIN || section === AppSection.REWARDS) && (
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
      )
      }

      {showHomeTryOnInfo && renderHomeTryOnPopup()}
      <LoginModal />

      {/* Construction Popup */}
      {showConstructionPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[64px] p-12 shadow-2xl text-center space-y-8 animate-in zoom-in duration-500 relative">
            <button onClick={() => setShowConstructionPopup(false)} className="absolute top-8 right-8 p-2 bg-gray-50 rounded-full text-gray-400"><X size={20} /></button>
            <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto border-2 border-white shadow-sm text-orange-400"><Sparkles size={40} /></div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-[#6B5A53] font-luna uppercase italic leading-tight">Espaço em Construção Mágica</h3>
              <p className="text-xs font-bold text-[#6B5A53]/60 leading-relaxed italic">Estamos preparando algo incrível para fortalecer os laços da sua família. Volte em breve!</p>
            </div>
            <button
              onClick={() => setShowConstructionPopup(false)}
              className="w-full bg-[#6B5A53] text-white py-5 rounded-[28px] font-black text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Entendido ✨
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

      <Mascot message={mascotMsg} />

      {user.role === 'SUPER_ADMIN' && (
        <button
          onClick={() => setIsAdminEditing(!isAdminEditing)}
          className={`fixed bottom-24 right-6 z-[100] p-4 rounded-full shadow-2xl transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest ${isAdminEditing ? 'bg-pink-400 text-white' : 'bg-white text-[#6B5A53] hover:scale-105'}`}
        >
          <Settings2 size={20} className={isAdminEditing ? 'animate-spin-slow' : ''} />
          {isAdminEditing ? 'Sair da Edição' : 'Edição Mágica'}
        </button>
      )}

      <Navigation
        currentSection={section}
        onNavigate={navigateTo}
        onClubeClick={() => { setIframeUrl(CLUB_URL); setShowIframeModal(true); }}
        onAccountClick={() => setShowLoginModal(true)}
        cartCount={cart.length}
      />
    </div>
  );
};

export default App;
