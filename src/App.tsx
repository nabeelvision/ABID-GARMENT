import React, { useState, useEffect } from 'react';
import {
  Product,
  BackgroundVideoSettings,
  IntroVideoSettings,
  StoreSettings,
  SocialLinks,
  OptimizationSettings,
  CartItem
} from './types';
import {
  initialProducts,
  initialBackgroundVideoSettings,
  initialIntroVideoSettings,
  initialStoreSettings,
  initialSocialLinks,
  initialOptimizationSettings
} from './data/initialData';
import {
  safeLocalLoad,
  safeLocalSave,
  fetchStoreDataFromServer,
  saveStoreDataToServer
} from './services/storePersistence';
import { Navbar } from './components/Navbar';
import { BackgroundVideo } from './components/BackgroundVideo';
import { IntroVideoModal } from './components/IntroVideoModal';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { LocationSocialSection } from './components/LocationSocialSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileDrawer } from './components/MobileDrawer';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Phone,
  MapPin,
  MessageCircle,
  Video,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function App() {
  // 1. Persistent State with Safe LocalStorage (fallback to initialData)
  const [products, setProducts] = useState<Product[]>(() =>
    safeLocalLoad('abid_garments_products', initialProducts)
  );

  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundVideoSettings>(() =>
    safeLocalLoad('abid_garments_bg_video', initialBackgroundVideoSettings)
  );

  const [introSettings, setIntroSettings] = useState<IntroVideoSettings>(() =>
    safeLocalLoad('abid_garments_intro_video', initialIntroVideoSettings)
  );

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() =>
    safeLocalLoad('abid_garments_store_info', initialStoreSettings)
  );

  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() =>
    safeLocalLoad('abid_garments_social_links', initialSocialLinks)
  );

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>(() =>
    safeLocalLoad('abid_garments_opt_settings', initialOptimizationSettings)
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    safeLocalLoad('abid_garments_cart', [])
  );

  // Hydrate from Server File (/data/store-data.json) on Mount
  useEffect(() => {
    fetchStoreDataFromServer().then((serverData) => {
      if (!serverData) return;
      if (serverData.products && Array.isArray(serverData.products) && serverData.products.length > 0) {
        setProducts(serverData.products);
        safeLocalSave('abid_garments_products', serverData.products);
      }
      if (serverData.storeSettings) {
        setStoreSettings((prev) => {
          const merged = { ...prev, ...serverData.storeSettings };
          safeLocalSave('abid_garments_store_info', merged);
          return merged;
        });
      }
      if (serverData.backgroundSettings) {
        setBackgroundSettings((prev) => {
          const merged = { ...prev, ...serverData.backgroundSettings };
          safeLocalSave('abid_garments_bg_video', merged);
          return merged;
        });
      }
      if (serverData.introSettings) {
        setIntroSettings((prev) => {
          const merged = { ...prev, ...serverData.introSettings };
          safeLocalSave('abid_garments_intro_video', merged);
          return merged;
        });
      }
      if (serverData.socialLinks) {
        setSocialLinks((prev) => {
          const merged = { ...prev, ...serverData.socialLinks };
          safeLocalSave('abid_garments_social_links', merged);
          return merged;
        });
      }
      if (serverData.optimizationSettings) {
        setOptimizationSettings((prev) => {
          const merged = { ...prev, ...serverData.optimizationSettings };
          safeLocalSave('abid_garments_opt_settings', merged);
          return merged;
        });
      }
    });
  }, []);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('abid_garments_theme');
    return saved ? saved === 'dark' : true;
  });

  // Intro video modal state (only auto-opens once per session unless triggered manually)
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(() => {
    if (!initialIntroVideoSettings.enabled) return false;
    const hasSeen = sessionStorage.getItem('abid_garments_intro_seen');
    return !hasSeen;
  });

  // UI Modals & Drawers
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Sync to LocalStorage & Server
  useEffect(() => {
    safeLocalSave('abid_garments_products', products);
  }, [products]);

  useEffect(() => {
    safeLocalSave('abid_garments_bg_video', backgroundSettings);
  }, [backgroundSettings]);

  useEffect(() => {
    safeLocalSave('abid_garments_intro_video', introSettings);
  }, [introSettings]);

  useEffect(() => {
    safeLocalSave('abid_garments_store_info', storeSettings);
  }, [storeSettings]);

  useEffect(() => {
    safeLocalSave('abid_garments_social_links', socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    safeLocalSave('abid_garments_opt_settings', optimizationSettings);
  }, [optimizationSettings]);

  useEffect(() => {
    safeLocalSave('abid_garments_cart', cartItems);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('abid_garments_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCloseIntro = () => {
    setIsIntroOpen(false);
    sessionStorage.setItem('abid_garments_intro_seen', 'true');
  };

  const handleManualPlayIntro = () => {
    setIsIntroOpen(true);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
      if (sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const isTransparent =
    backgroundSettings.mode === 'video' &&
    backgroundSettings.enabled &&
    backgroundSettings.makeBackgroundInvisible;

  const handleToggleBackgroundMode = () => {
    setBackgroundSettings((prev) => {
      const isCurrentlyVideo = prev.mode === 'video' && prev.enabled;
      const nextMode = isCurrentlyVideo ? 'default' : 'video';
      return {
        ...prev,
        mode: nextMode,
        enabled: nextMode === 'video',
      };
    });
  };

  return (
    <div
      id="abid-garments-app"
      className={`min-h-screen relative flex flex-col selection:bg-amber-500 selection:text-black font-sans transition-colors duration-500 ${
        isTransparent
          ? 'bg-transparent text-white'
          : isDarkMode
          ? 'bg-zinc-950 text-zinc-100'
          : 'bg-stone-50 text-zinc-900'
      }`}
    >
      {/* 1. Background Video Component with Transparent Canvas mode */}
      <BackgroundVideo
        settings={backgroundSettings}
        onUpdateSettings={(newVals) =>
          setBackgroundSettings((prev) => ({ ...prev, ...newVals }))
        }
        isDarkMode={isDarkMode}
      />

      {/* 2. Intro Video Splash Modal */}
      <IntroVideoModal
        settings={introSettings}
        isOpen={isIntroOpen}
        onClose={handleCloseIntro}
      />

      {/* 3. Responsive Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        storeName={storeSettings.storeName}
        phoneNumber={storeSettings.contactNumber}
        logoUrl={storeSettings.logoUrl}
        backgroundSettings={backgroundSettings}
        onOpenIntroVideo={handleManualPlayIntro}
        onToggleBackgroundMode={handleToggleBackgroundMode}
      />

      {/* Main Page Body */}
      <main className="flex-1 relative z-10">
        {/* 4. Hero Section */}
        <HeroSection
          storeSettings={storeSettings}
          backgroundSettings={backgroundSettings}
          onExploreClick={() => {
            const el = document.getElementById('garments-catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 5. Garment Collections Catalog Section */}
        <section
          id="garments-catalog-section"
          className={`py-12 sm:py-16 transition-colors duration-300 ${
            isTransparent
              ? 'bg-transparent'
              : isDarkMode
              ? 'bg-zinc-950/60'
              : 'bg-stone-100/60'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Cloth Catalog</span>
                </div>
                <h2
                  className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                    isTransparent
                      ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
                      : isDarkMode
                      ? 'text-zinc-100'
                      : 'text-zinc-900'
                  }`}
                >
                  Authentic Fabrics & Designer Garments
                </h2>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="search-garments-input"
                    type="text"
                    placeholder="Search Boski, Cotton, Kurta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-9 pr-4 py-2 rounded-xl text-xs w-full sm:w-64 border backdrop-blur-md outline-none transition-all ${
                      isTransparent
                        ? 'bg-black/40 border-white/20 text-white placeholder:text-zinc-400 focus:border-amber-400'
                        : isDarkMode
                        ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500'
                        : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500 shrink-0 hidden sm:block" />
                  <select
                    id="sort-garments-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-3 py-2 rounded-xl text-xs border backdrop-blur-md outline-none cursor-pointer ${
                      isTransparent
                        ? 'bg-black/50 border-white/20 text-white'
                        : isDarkMode
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                        : 'bg-white border-zinc-300 text-zinc-800'
                    }`}
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {[
                { id: 'all', label: 'All Garments' },
                { id: 'boski', label: 'Pure Boski (8 Paund)' },
                { id: 'cotton', label: 'Egyptian Giza Cotton' },
                { id: 'unstitched', label: 'Wash & Wear' },
                { id: 'kurta', label: 'Stitched Kurta Shalwar' },
                { id: 'waistcoat', label: 'Banori Waistcoats' },
                { id: 'festive', label: 'Wedding Ensembles' },
                { id: 'shawls', label: 'Wool Shawls' },
              ].map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-black shadow-md font-bold'
                        : isTransparent
                        ? 'bg-black/30 border border-white/15 text-zinc-200 hover:bg-white/20'
                        : isDarkMode
                        ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div
                className={`py-16 text-center rounded-3xl border backdrop-blur-md p-8 ${
                  isTransparent
                    ? 'bg-black/40 border-white/20 text-white'
                    : isDarkMode
                    ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300'
                    : 'bg-white border-zinc-200 text-zinc-700'
                }`}
              >
                <p className="text-base font-medium mb-3">
                  No garments match your filter: "{searchQuery}"
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all"
                >
                  Clear Filters & Show All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                    isTransparent={isTransparent}
                    isDarkMode={isDarkMode}
                    phoneNumber={storeSettings.contactNumber}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. Physical Location & Social Media Links Section */}
        <LocationSocialSection
          storeSettings={storeSettings}
          socialLinks={socialLinks}
          isTransparent={isTransparent}
          isDarkMode={isDarkMode}
        />
      </main>

      {/* 7. Comprehensive Store Footer */}
      <Footer
        storeSettings={storeSettings}
        socialLinks={socialLinks}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={setActiveCategory}
        isTransparent={isTransparent}
        isDarkMode={isDarkMode}
      />

      {/* 8. Floating Direct WhatsApp Button */}
      <FloatingWhatsApp phoneNumber={storeSettings.contactNumber} />

      {/* 9. Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isDarkMode={isDarkMode}
        phoneNumber={storeSettings.contactNumber}
      />

      {/* 10. Cart / Order Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        isDarkMode={isDarkMode}
        phoneNumber={storeSettings.contactNumber}
      />

      {/* 11. Mobile Navigation Menu Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        storeSettings={storeSettings}
        backgroundSettings={backgroundSettings}
        onToggleInvisible={() =>
          setBackgroundSettings((prev) => ({
            ...prev,
            makeBackgroundInvisible: !prev.makeBackgroundInvisible,
          }))
        }
        onPlayIntro={handleManualPlayIntro}
        onToggleBackgroundMode={handleToggleBackgroundMode}
      />

      {/* 12. Protected Admin Customization Panel */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={setProducts}
        backgroundSettings={backgroundSettings}
        onSaveBackgroundSettings={setBackgroundSettings}
        introSettings={introSettings}
        onSaveIntroSettings={setIntroSettings}
        storeSettings={storeSettings}
        onSaveStoreSettings={setStoreSettings}
        socialLinks={socialLinks}
        onSaveSocialLinks={setSocialLinks}
        optimizationSettings={optimizationSettings}
        onSaveOptimizationSettings={setOptimizationSettings}
        onTestIntro={() => setIsIntroOpen(true)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
