import React from 'react';
import {
  MessageCircle,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { StoreSettings, BackgroundVideoSettings } from '../types';

interface HeroSectionProps {
  storeSettings: StoreSettings;
  backgroundSettings: BackgroundVideoSettings;
  onExploreClick: () => void;
  onOpenAdmin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  storeSettings,
  backgroundSettings,
  onExploreClick,
  onOpenAdmin,
}) => {
  const cleanNumber = storeSettings.contactNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Abid Garments, I saw your collection online and want to check available fabrics.'
  )}`;

  const isTransparent = backgroundSettings.enabled && backgroundSettings.makeBackgroundInvisible;

  return (
    <section
      id="hero-banner-section"
      className={`relative pt-12 pb-20 md:pt-20 md:pb-28 transition-colors duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-gradient-to-b from-amber-50/50 via-white to-transparent dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>Okara's Premier Cloth Destination</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Venus Chowk</span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight mb-6 transition-all ${
              isTransparent
                ? 'text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]'
                : 'text-zinc-900 dark:text-zinc-50'
            }`}
          >
            {storeSettings.heroHeadline || "Premium Men's Fabrics & Bespoke Garments"}
          </h1>

          {/* Subheadline */}
          <p
            className={`text-base sm:text-xl font-normal leading-relaxed mb-8 max-w-2xl mx-auto ${
              isTransparent
                ? 'text-zinc-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            {storeSettings.heroSubheadline ||
              'Authentic Pure Japanese Silk Boski, Giza Egyptian Cotton, Royal Wash & Wear, and Bespoke Waistcoats tailored for elegance and durability.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            {/* Primary WhatsApp Order CTA */}
            <a
              id="hero-whatsapp-direct-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Order on WhatsApp (03217828917)</span>
            </a>

            {/* Explore Catalog CTA */}
            <button
              id="hero-explore-fabrics-btn"
              onClick={onExploreClick}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-semibold transition-all backdrop-blur-md ${
                isTransparent
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/40 shadow-lg'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white'
              }`}
            >
              <span>Explore Fabrics</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Key Value Propositions */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl backdrop-blur-md border ${
              isTransparent
                ? 'bg-black/30 border-white/15 text-zinc-100 shadow-xl'
                : 'bg-white/60 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold py-1">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>100% Original Guaranteed Boski</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold py-1 border-y sm:border-y-0 sm:border-x border-zinc-200/50 dark:border-zinc-700/50">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Venus Chowk Okara Outlet</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold py-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Fast WhatsApp Ordering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
