import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  MessageCircle,
  Lock,
  Facebook,
  Instagram,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { StoreSettings, SocialLinks } from '../types';
import { PolicyModal, PolicyTab } from './PolicyModal';

interface FooterProps {
  storeSettings: StoreSettings;
  socialLinks: SocialLinks;
  onOpenAdmin: () => void;
  onSelectCategory?: (category: string) => void;
  isTransparent: boolean;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  storeSettings,
  socialLinks,
  onOpenAdmin,
  onSelectCategory,
  isTransparent,
  isDarkMode,
}) => {
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyTab>('privacy');

  const openPolicy = (tab: PolicyTab) => {
    setActivePolicyTab(tab);
    setPolicyModalOpen(true);
  };
  const cleanNumber = storeSettings.contactNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Abid Garments! I am visiting your website and have an inquiry about your fabrics & collections.'
  )}`;

  const scrollToCatalog = (catId: string) => {
    if (onSelectCategory) onSelectCategory(catId);
    const catalog = document.getElementById('garments-catalog-section');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-site-footer"
      className={`relative border-t transition-colors duration-500 z-10 ${
        isTransparent
          ? 'bg-black/85 backdrop-blur-xl border-white/10 text-zinc-300'
          : isDarkMode
          ? 'bg-zinc-950 border-zinc-800/80 text-zinc-300'
          : 'bg-stone-900 border-stone-800 text-stone-300'
      }`}
    >
      {/* Top Value Proposition Bar - Hallmark of Authentic Clothing Websites */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            {/* Value 1 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-white">
                  100% Pure Fabric
                </h5>
                <p className="text-[11px] text-zinc-400">Guaranteed genuine Boski & Cotton</p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-white">
                  Nationwide Delivery
                </h5>
                <p className="text-[11px] text-zinc-400">Cash on Delivery across Pakistan</p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-white">
                  Easy 7-Day Exchange
                </h5>
                <p className="text-[11px] text-zinc-400">Hassle-free customer guarantee</p>
              </div>
            </div>

            {/* Value 4 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-white">
                  Custom Tailoring
                </h5>
                <p className="text-[11px] text-zinc-400">Bespoke fitting & unstitched cuts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & About (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              {storeSettings.logoUrl ? (
                <img
                  src={storeSettings.logoUrl}
                  alt={storeSettings.storeName}
                  className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-white/10 shadow-md p-1 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-display font-black text-lg shadow-md shrink-0">
                  A
                </div>
              )}
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white block">
                  {storeSettings.storeName}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-amber-400 font-semibold block">
                  Venus Chowk, Okara
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
              Welcome to <strong>Abid Garments</strong> — Okara's premier hub for authentic men's fabrics, pure Japanese Boski, Egyptian Giza cotton, designer Kurta Shalwar, waistcoats, and wedding collections. We bring time-honored eastern craftsmanship to your doorstep.
            </p>

            {/* WhatsApp Direct Order Badge */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order Directly on WhatsApp: {storeSettings.contactNumber}</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Follow Our Collections
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 flex items-center justify-center text-zinc-300 transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 flex items-center justify-center text-zinc-300 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 flex items-center justify-center text-zinc-300 transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Fabric & Clothing Collections */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Collections</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => scrollToCatalog('boski')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 group"
                >
                  <span>Pure Japanese Boski (6 & 8 Lb)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('cotton')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 group"
                >
                  <span>Egyptian Giza & Swiss Cotton</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('kurta')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 group"
                >
                  <span>Designer Kurta Shalwar</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('waistcoat')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 group"
                >
                  <span>Embroidered Waistcoats</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('festive')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 group"
                >
                  <span>Wedding & Festive Wear</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('all')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 group"
                >
                  <span>View All Fabric Catalogs</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Shopping Policies */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  id="footer-service-quality-btn"
                  onClick={() => openPolicy('care')}
                  className="w-full text-left flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <span>Fabric Quality Assurance</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-service-shipping-btn"
                  onClick={() => openPolicy('shipping')}
                  className="w-full text-left flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <span>Nationwide Shipping & TCS Dispatch</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-service-exchange-btn"
                  onClick={() => openPolicy('refund')}
                  className="w-full text-left flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <span>7-Day Return & Exchange Policy</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-service-care-btn"
                  onClick={() => openPolicy('care')}
                  className="w-full text-left flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <span>Silk & Cotton Fabric Care Guide</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-service-tailoring-btn"
                  onClick={() => openPolicy('tailoring')}
                  className="w-full text-left flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <span>Custom Size & Stitching Consult</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-service-payment-btn"
                  onClick={() => openPolicy('payment')}
                  className="w-full text-left flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <span>Payment: Cash on Delivery (COD)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Location & Timings */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Visit Outlet
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {storeSettings.locationAddress || 'RC4V+HV2, Block-B Block B Venus Chowk, Okara, Pakistan'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href={`tel:${storeSettings.contactNumber}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {storeSettings.contactNumber}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p>Mon – Sat: 10:00 AM – 10:00 PM</p>
                  <p className="text-[11px] text-zinc-400">Sunday: 2:00 PM – 10:00 PM</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 text-xs transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Control Panel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted Payment Badges & Delivery Partners */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              Payment & Courier Partners:
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-medium text-[11px]">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-medium text-[11px]">
              JazzCash
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-medium text-[11px]">
              Easypaisa
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-medium text-[11px]">
              Bank Transfer
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-medium text-[11px]">
              TCS / Leopard Courier
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="text-xs text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>
      </div>

      {/* Bottom Copyright & Legal Disclaimer Bar */}
      <div className="border-t border-white/10 bg-black/40 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-zinc-400 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <strong>{storeSettings.storeName}</strong>. All Rights Reserved. Block-B Venus Chowk, Okara, Pakistan.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              id="footer-privacy-policy-btn"
              onClick={() => openPolicy('privacy')}
              className="hover:text-amber-400 text-zinc-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              id="footer-terms-of-service-btn"
              onClick={() => openPolicy('terms')}
              className="hover:text-amber-400 text-zinc-400 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              id="footer-shipping-policy-btn"
              onClick={() => openPolicy('shipping')}
              className="hover:text-amber-400 text-zinc-400 transition-colors cursor-pointer"
            >
              Shipping Policy
            </button>
            <span>•</span>
            <button
              id="footer-refund-policy-btn"
              onClick={() => openPolicy('refund')}
              className="hover:text-amber-400 text-zinc-400 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Policy Modal */}
      <PolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={activePolicyTab}
        storeSettings={storeSettings}
        isDarkMode={isDarkMode}
      />
    </footer>
  );
};
