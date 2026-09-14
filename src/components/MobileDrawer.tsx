import React from 'react';
import {
  X,
  ShoppingBag,
  MessageCircle,
  Phone,
  MapPin,
  Lock,
  Moon,
  Sun,
  Video,
  Eye,
  EyeOff,
  Sparkles,
  Layers
} from 'lucide-react';
import { BackgroundVideoSettings, StoreSettings } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
  onOpenCart: () => void;
  cartCount: number;
  storeSettings: StoreSettings;
  backgroundSettings: BackgroundVideoSettings;
  onToggleInvisible: () => void;
  onPlayIntro: () => void;
  onToggleBackgroundMode: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  isDarkMode,
  onToggleDarkMode,
  onOpenAdmin,
  onOpenCart,
  cartCount,
  storeSettings,
  backgroundSettings,
  onToggleInvisible,
  onPlayIntro,
  onToggleBackgroundMode,
}) => {
  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'boski', label: 'Pure Japanese Boski' },
    { id: 'cotton', label: 'Royal Egyptian Cotton' },
    { id: 'kurta', label: 'Stitched Kurta Shalwar' },
    { id: 'waistcoat', label: 'Bespoke Waistcoats' },
    { id: 'festive', label: 'Wedding & Festive Wear' },
    { id: 'shawls', label: 'Heritage Shawls' },
  ];

  const cleanNumber = storeSettings.contactNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Abid Garments, I am inquiring from your mobile website.'
  )}`;

  return (
    <div id="mobile-navigation-drawer" className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Body */}
      <div
        className={`relative ml-auto w-full max-w-xs h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ${
          isDarkMode ? 'bg-zinc-950 text-zinc-100 border-l border-zinc-800' : 'bg-white text-zinc-900'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              {storeSettings.logoUrl ? (
                <img
                  src={storeSettings.logoUrl}
                  alt={storeSettings.storeName}
                  className="w-9 h-9 rounded-lg object-contain bg-white/10 p-0.5 shrink-0"
                />
              ) : (
                <span className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-display font-black text-lg shrink-0">
                  A
                </span>
              )}
              <div>
                <h3 className="font-display font-bold text-base leading-tight">
                  {storeSettings.storeName}
                </h3>
                <p className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
                  Okara, Pakistan
                </p>
              </div>
            </div>
            <button
              id="mobile-drawer-close-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 gap-2 my-4">
            <button
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 text-xs font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Bag ({cartCount})</span>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 text-xs font-semibold"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-zinc-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Categories List */}
          <div className="mt-4">
            <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
              Garment Collections
            </h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-black font-semibold shadow-sm'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span>{cat.label}</span>
                  {activeCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Video & Background Appearance Toggles */}
          <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
              Background Experience
            </h4>

            {/* Dual Option Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-2">
              <button
                onClick={() => {
                  if (backgroundSettings.mode === 'video' && backgroundSettings.enabled) {
                    onToggleBackgroundMode();
                  }
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  backgroundSettings.mode === 'default' || !backgroundSettings.enabled
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Default BG</span>
              </button>

              <button
                onClick={() => {
                  if (backgroundSettings.mode !== 'video' || !backgroundSettings.enabled) {
                    onToggleBackgroundMode();
                  }
                }}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  backgroundSettings.mode === 'video' && backgroundSettings.enabled
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Mode</span>
              </button>
            </div>

            <div className="space-y-2">
              {backgroundSettings.mode === 'video' && backgroundSettings.enabled && (
                <button
                  onClick={onToggleInvisible}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    {backgroundSettings.makeBackgroundInvisible ? (
                      <Eye className="w-4 h-4 text-amber-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-zinc-400" />
                    )}
                    <span>100% Invisible BG</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      backgroundSettings.makeBackgroundInvisible
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {backgroundSettings.makeBackgroundInvisible ? 'ON' : 'OFF'}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onPlayIntro();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold hover:text-amber-500 transition-colors text-left"
              >
                <Video className="w-4 h-4 text-amber-500" />
                <span>Replay Store Video Intro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Contact & Admin */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          {/* Direct WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs tracking-wide shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp: {storeSettings.contactNumber}</span>
          </a>

          {/* Call Store */}
          <a
            href={`tel:${storeSettings.contactNumber}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            <span>Direct Call: {storeSettings.contactNumber}</span>
          </a>

          {/* Location note */}
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5 px-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>{storeSettings.locationAddress}</span>
          </div>

          {/* Admin link */}
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Customization Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
