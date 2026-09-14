import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Sparkles, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber: string; // e.g. "03217828917"
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ phoneNumber }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Clean phone number for WhatsApp link (Pakistani code 92)
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const defaultMessage = encodeURIComponent(
    'Assalam-o-Alaikum Abid Garments! I am visiting your website and would like to inquire about fabrics and unstitched suits available at your Okara Venus Chowk branch.'
  );

  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMessage}`;

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-3 max-w-xs bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Abid Garments</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-2.5">
            Need cloth advice, Boski pricing, or custom measurements? We are live on WhatsApp!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Start WhatsApp Chat (03217828917)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <a
        id="whatsapp-direct-link"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Direct WhatsApp Contact Abid Garments"
      >
        {/* Ping animation ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white text-white relative z-10" />

        {/* Online Indicator */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border-2 border-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </span>
      </a>
    </div>
  );
};
