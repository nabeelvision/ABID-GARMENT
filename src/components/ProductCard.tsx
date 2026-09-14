import React from 'react';
import { Product } from '../types';
import { MessageCircle, ShoppingBag, Eye, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isTransparent: boolean;
  isDarkMode: boolean;
  phoneNumber: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  onAddToCart,
  isTransparent,
  isDarkMode,
  phoneNumber,
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const productWhatsAppText = encodeURIComponent(
    `Assalam-o-Alaikum Abid Garments, I would like to order/inquire about:\n- Product: ${product.name}\n- Category: ${product.category}\n- Price: Rs. ${product.pricePKR.toLocaleString()}\n- Fabric: ${product.fabricType}\nPlease confirm stock availability at Venus Chowk Okara.`
  );

  const directWhatsAppUrl = `https://wa.me/${waNumber}?text=${productWhatsAppText}`;

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
        isTransparent
          ? 'bg-black/35 backdrop-blur-md border-white/20 text-white shadow-2xl hover:border-amber-400/60 hover:bg-black/45'
          : isDarkMode
          ? 'bg-zinc-900/85 backdrop-blur-sm border-zinc-800 text-zinc-100 shadow-md hover:border-zinc-700 hover:shadow-xl'
          : 'bg-white/90 backdrop-blur-sm border-zinc-200/90 text-zinc-900 shadow-md hover:border-amber-300 hover:shadow-xl'
      }`}
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500 text-black shadow-lg">
            {product.badge}
          </span>
        )}

        {/* Quick View Button overlay */}
        <button
          onClick={() => onOpenModal(product)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md transition-colors"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Fabric Type Pill at bottom of image */}
        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-medium truncate flex items-center justify-between">
          <span className="truncate">{product.fabricType}</span>
          <span className="text-amber-400 text-[10px] font-bold shrink-0 ml-1">
            {product.metersOrSize}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-500">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <h3
            onClick={() => onOpenModal(product)}
            className="font-display font-bold text-base sm:text-lg cursor-pointer hover:text-amber-500 transition-colors line-clamp-1 mb-1.5"
          >
            {product.name}
          </h3>

          <p
            className={`text-xs line-clamp-2 mb-3 leading-relaxed ${
              isTransparent
                ? 'text-zinc-200'
                : isDarkMode
                ? 'text-zinc-400'
                : 'text-zinc-600'
            }`}
          >
            {product.description}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-zinc-500/20 dark:border-zinc-800">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              <span className="text-xs text-amber-500 font-bold mr-1">Rs.</span>
              <span className="font-display font-extrabold text-lg sm:text-xl">
                {product.pricePKR.toLocaleString()}
              </span>
            </div>
            {product.originalPricePKR && (
              <span className="text-xs text-zinc-400 line-through">
                Rs. {product.originalPricePKR.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons: WhatsApp Direct Order & Bag */}
          <div className="grid grid-cols-5 gap-2">
            <a
              id={`whatsapp-order-btn-${product.id}`}
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-4 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs tracking-wide shadow-md transition-transform hover:scale-[1.02] active:scale-95"
              title="Direct Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span className="truncate">WhatsApp Order</span>
            </a>

            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className={`col-span-1 flex items-center justify-center rounded-xl border transition-colors ${
                isTransparent
                  ? 'border-white/30 hover:bg-white/20 text-white'
                  : isDarkMode
                  ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                  : 'border-zinc-300 hover:bg-zinc-100 text-zinc-800'
              }`}
              title="Add to Inquiry Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
