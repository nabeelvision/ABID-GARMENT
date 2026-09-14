import React, { useState } from 'react';
import { Product } from '../types';
import { X, MessageCircle, ShoppingBag, Check, ShieldCheck, MapPin, Star, Share2 } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  isDarkMode: boolean;
  phoneNumber: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isDarkMode,
  phoneNumber,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [copiedNotification, setCopiedNotification] = useState(false);

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const orderText = encodeURIComponent(
    `Assalam-o-Alaikum Abid Garments!\nI would like to order the following garment from your Okara store:\n- Product: ${product.name}\n- Category: ${product.category}\n- Fabric: ${product.fabricType}\n- Cut / Length: ${product.metersOrSize}\n- Selected Color: ${selectedColor || 'Standard'}\n- Quantity: ${quantity}\n- Unit Price: Rs. ${product.pricePKR.toLocaleString()}\n- Total Amount: Rs. ${(product.pricePKR * quantity).toLocaleString()}\n\nPlease verify availability at Venus Chowk, Okara.`
  );

  const directWhatsAppUrl = `https://wa.me/${waNumber}?text=${orderText}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 my-auto border transition-all ${
          isDarkMode
            ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Media Column */}
          <div className="relative aspect-square md:aspect-auto h-72 md:h-full bg-zinc-950">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500 text-black shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-500">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating} / 5.0</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-display font-bold leading-tight mb-2">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4">
                <div className="flex items-baseline">
                  <span className="text-sm font-bold text-amber-500 mr-1">PKR</span>
                  <span className="text-3xl font-display font-extrabold">
                    {product.pricePKR.toLocaleString()}
                  </span>
                </div>
                {product.originalPricePKR && (
                  <span className="text-sm text-zinc-400 line-through">
                    PKR {product.originalPricePKR.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Fabric Specs */}
              <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 mb-5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Fabric Composition:</span>
                  <span className="font-semibold text-right">{product.fabricType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Suit Cutting / Dimensions:</span>
                  <span className="font-semibold text-right">{product.metersOrSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Store Availability:</span>
                  <span className="font-semibold text-emerald-500">In Stock (Venus Chowk, Okara)</span>
                </div>
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Available Shades ({product.colors.length}):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedColor === color
                            ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                            : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-400 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Quantity:
                </span>
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-500 ml-auto">
                  Total: <strong className="text-zinc-900 dark:text-zinc-100 font-display font-bold">Rs. {(product.pricePKR * quantity).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <a
                id="modal-direct-whatsapp-btn"
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Instant WhatsApp Order ({phoneNumber})</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 hover:border-amber-500 text-xs font-bold transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedNotification ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
