import React from 'react';
import {
  Menu,
  Moon,
  Sun,
  Lock,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import { BackgroundVideoSettings } from '../types';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
  onOpenMobileMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  storeName: string;
  phoneNumber: string;
  logoUrl?: string;
  backgroundSettings: BackgroundVideoSettings;
  onOpenIntroVideo: () => void;
  onToggleBackgroundMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenAdmin,
  onOpenMobileMenu,
  onOpenCart,
  cartCount,
  activeCategory,
  onSelectCategory,
  storeName,
  phoneNumber,
  logoUrl,
  backgroundSettings,
  onOpenIntroVideo,
  onToggleBackgroundMode,
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Abid Garments, I would like to inquire about your fabric collections.'
  )}`;

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'boski', label: 'Pure Boski' },
    { id: 'cotton', label: 'Giza Cotton' },
    { id: 'kurta', label: 'Kurta Shalwar' },
    { id: 'waistcoat', label: 'Waistcoats' },
    { id: 'festive', label: 'Wedding Wear' },
  ];

  const isVideoActive = backgroundSettings.mode === 'video' && backgroundSettings.enabled;
  const isTransparent = isVideoActive && backgroundSettings.makeBackgroundInvisible;

  return (
    <header
      id="main-navbar-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isTransparent
          ? 'bg-black/20 backdrop-blur-md border-b border-white/10 text-white'
          : isDarkMode
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100'
          : 'bg-white/90 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900'
      }`}
    >
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-trigger-btn"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a href="#" className="flex flex-col text-left group">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain bg-white/10 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0"
                />
              ) : (
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-display font-black text-lg shadow-md group-hover:scale-105 transition-transform shrink-0">
                  A
                </span>
              )}
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wide group-hover:text-amber-500 transition-colors">
                {storeName}
              </span>
            </div>
            <span className="text-[10px] tracking-widest text-amber-500/90 font-semibold uppercase pl-10 -mt-1">
              Fabric & Garments • Okara
            </span>
          </a>
        </div>

        {/* Desktop Navigation Category Pills */}
        <nav className="hidden lg:flex items-center gap-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md'
                    : isTransparent
                    ? 'text-zinc-200 hover:bg-white/15'
                    : isDarkMode
                    ? 'text-zinc-300 hover:bg-zinc-800'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Dark Mode, Cart Drawer, Admin */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Switch */}
          <button
            id="navbar-theme-toggle-btn"
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              isTransparent
                ? 'hover:bg-white/20 text-zinc-200'
                : isDarkMode
                ? 'hover:bg-zinc-800 text-amber-400'
                : 'hover:bg-zinc-100 text-zinc-700'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* WhatsApp Direct Order Button (Desktop) */}
          <a
            id="navbar-whatsapp-order-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold tracking-wide shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>03217828917</span>
          </a>

          {/* Cart / Inquiry Drawer Trigger */}
          <button
            id="navbar-cart-trigger-btn"
            onClick={onOpenCart}
            className={`relative p-2 rounded-full transition-colors ${
              isTransparent
                ? 'hover:bg-white/20 text-zinc-100'
                : isDarkMode
                ? 'hover:bg-zinc-800 text-zinc-200'
                : 'hover:bg-zinc-100 text-zinc-800'
            }`}
            title="View Order / Inquiry Bag"
            aria-label="View Order Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold text-[11px] flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Panel Button */}
          <button
            id="navbar-admin-panel-btn"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              isTransparent
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : isDarkMode
                ? 'border-zinc-700 bg-zinc-900 hover:border-amber-500/50 text-zinc-300 hover:text-amber-400'
                : 'border-zinc-300 bg-zinc-50 hover:border-amber-500 text-zinc-700 hover:text-amber-600'
            }`}
            title="Open Admin Customization Panel"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
