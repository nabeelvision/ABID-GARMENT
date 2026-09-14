import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  MessageCircle,
  ExternalLink,
  Share2
} from 'lucide-react';
import { StoreSettings, SocialLinks } from '../types';

interface LocationSocialSectionProps {
  storeSettings: StoreSettings;
  socialLinks: SocialLinks;
  isTransparent: boolean;
  isDarkMode: boolean;
}

export const LocationSocialSection: React.FC<LocationSocialSectionProps> = ({
  storeSettings,
  socialLinks,
  isTransparent,
  isDarkMode,
}) => {
  const cleanNumber = storeSettings.contactNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Abid Garments, I would like to visit your shop at Venus Chowk, Okara.'
  )}`;

  return (
    <section
      id="location-and-contact-section"
      className={`py-16 md:py-24 transition-colors duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : isDarkMode
          ? 'bg-zinc-950/80 border-t border-zinc-800/80'
          : 'bg-zinc-50 border-t border-zinc-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Store Location & Directions</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight mb-4 ${
              isTransparent
                ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                : isDarkMode
                ? 'text-zinc-100'
                : 'text-zinc-900'
            }`}
          >
            Visit Abid Garments in Okara
          </h2>
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isTransparent
                ? 'text-zinc-200 drop-shadow'
                : isDarkMode
                ? 'text-zinc-400'
                : 'text-zinc-600'
            }`}
          >
            Touch and feel our unstitched Boski, Egyptian Giza Cotton, and festive sherwani fabrics directly at our physical store at Venus Chowk, Okara.
          </p>
        </div>

        {/* 2-Column Grid: Left Card Details & Right Map Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details Column */}
          <div
            className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border backdrop-blur-md ${
              isTransparent
                ? 'bg-black/40 border-white/20 text-white shadow-2xl'
                : isDarkMode
                ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-xl'
                : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
            }`}
          >
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base mb-1">Official Address</h4>
                  <p className="text-sm text-zinc-400 dark:text-zinc-400 leading-relaxed">
                    {storeSettings.locationAddress}
                  </p>
                  <p className="text-xs text-amber-500 font-semibold mt-1">
                    Plus Code: RC4V+HV2 • Block-B
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base mb-1">Phone & WhatsApp</h4>
                  <p className="text-sm font-semibold tracking-wide">{storeSettings.contactNumber}</p>
                  <p className="text-xs text-zinc-400">Direct Customer Inquiries & Orders</p>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base mb-1">Store Hours</h4>
                  <p className="text-sm text-zinc-400">Monday – Sunday: 10:00 AM – 10:30 PM</p>
                  <p className="text-xs text-amber-500 font-medium mt-0.5">
                    Friday: 03:00 PM – 11:00 PM (After Jummah)
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs and Social Media */}
            <div className="pt-8 border-t border-zinc-500/20 dark:border-zinc-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  id="directions-google-maps-btn"
                  href={storeSettings.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wide shadow-md transition-all hover:scale-[1.02]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Map Directions</span>
                </a>

                <a
                  id="location-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs tracking-wide shadow-md transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Social Media Links Section */}
              <div className="pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 text-center sm:text-left">
                  Follow Abid Garments on Social Media
                </h5>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-500 text-xs font-medium transition-all"
                    >
                      Facebook
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-pink-500 hover:text-pink-500 text-xs font-medium transition-all"
                    >
                      Instagram
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-cyan-400 hover:text-cyan-400 text-xs font-medium transition-all"
                    >
                      TikTok
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-red-500 hover:text-red-500 text-xs font-medium transition-all"
                    >
                      YouTube
                    </a>
                  )}
                  {socialLinks.whatsapp && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 text-xs font-medium transition-all"
                    >
                      WhatsApp Channel
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div
            className={`lg:col-span-7 rounded-3xl overflow-hidden border backdrop-blur-md relative min-h-[380px] shadow-2xl flex flex-col ${
              isTransparent
                ? 'bg-black/30 border-white/20'
                : isDarkMode
                ? 'bg-zinc-900 border-zinc-800'
                : 'bg-white border-zinc-200'
            }`}
          >
            {/* Interactive Map view header */}
            <div className="p-3.5 px-6 bg-zinc-900/90 text-white flex items-center justify-between text-xs border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold">Venus Chowk, Block-B, Okara, Punjab</span>
              </div>
              <a
                href={storeSettings.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Google Maps iFrame */}
            <div className="relative flex-1 w-full h-full min-h-[340px]">
              <iframe
                title="Abid Garments Location Map Venus Chowk Okara"
                src="https://maps.google.com/maps?q=RC4V%2BHV2%2C%20Block-B%20Block%20B%20Venus%20Chowk%2C%20Okara%2C%20Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
