import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, MessageCircle, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  isDarkMode: boolean;
  phoneNumber: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isDarkMode,
  phoneNumber,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.pricePKR * item.quantity,
    0
  );

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const itemsListString = cartItems
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}\n   - Category: ${item.product.category}\n   - Color: ${
          item.selectedColor || 'Standard'
        }\n   - Qty: ${item.quantity} | Cut: ${item.product.metersOrSize}\n   - Price: Rs. ${(
          item.product.pricePKR * item.quantity
        ).toLocaleString()}`
    )
    .join('\n\n');

  const orderWhatsAppMessage = encodeURIComponent(
    `*NEW ORDER INQUIRY - ABID GARMENTS (OKARA)*\n\nAssalam-o-Alaikum, I would like to place an order for the following items:\n\n${itemsListString}\n\n*Total Estimated Amount: Rs. ${totalAmount.toLocaleString()}*\n\nPlease confirm availability and delivery / store pickup at Venus Chowk Okara.`
  );

  const whatsappCheckoutUrl = `https://wa.me/${waNumber}?text=${orderWhatsAppMessage}`;

  return (
    <div id="cart-inquiry-drawer" className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <div
        className={`relative ml-auto w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto transition-transform ${
          isDarkMode ? 'bg-zinc-950 text-zinc-100 border-l border-zinc-800' : 'bg-white text-zinc-900'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-bold text-lg">Your Order Bag</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold">
                {cartItems.length} items
              </span>
            </div>
            <button
              id="cart-drawer-close-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-display font-semibold text-base mb-1">Your bag is empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
                Explore our unstitched Boski, Egyptian cotton, or designer kurta collections to add items.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 mt-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="pt-4 flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-display font-bold text-sm truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-500 truncate">{item.product.fabricType}</p>
                    {item.selectedColor && (
                      <span className="inline-block text-[10px] text-amber-500 font-semibold mt-0.5">
                        Color: {item.selectedColor}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-display font-bold text-amber-500">
                        Rs. {(item.product.pricePKR * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with WhatsApp Order Button */}
        {cartItems.length > 0 && (
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
                Total Amount:
              </span>
              <span className="text-xl font-display font-extrabold text-amber-500">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            <a
              id="cart-checkout-whatsapp-btn"
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send Complete Order to WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>Branch: Venus Chowk, Okara</span>
              <button
                onClick={onClearCart}
                className="text-red-400 hover:underline hover:text-red-300"
              >
                Clear Bag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
