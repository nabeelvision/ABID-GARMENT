import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Scissors,
  CreditCard,
  Phone,
  MessageCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { StoreSettings } from '../types';

export type PolicyTab =
  | 'privacy'
  | 'terms'
  | 'shipping'
  | 'refund'
  | 'care'
  | 'tailoring'
  | 'payment';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
  storeSettings: StoreSettings;
  isDarkMode: boolean;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
  storeSettings,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const cleanNumber = storeSettings.contactNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0')
    ? '92' + cleanNumber.substring(1)
    : cleanNumber.startsWith('92')
    ? cleanNumber
    : '92' + cleanNumber;

  const whatsappInquiryUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Abid Garments, I have a query regarding your ${
      activeTab === 'privacy'
        ? 'Privacy Policy'
        : activeTab === 'terms'
        ? 'Terms of Service'
        : activeTab === 'shipping'
        ? 'Shipping & Delivery'
        : activeTab === 'refund'
        ? '7-Day Return & Exchange Policy'
        : activeTab === 'care'
        ? 'Fabric Care & Washing Instructions'
        : activeTab === 'tailoring'
        ? 'Custom Tailoring & Stitching Consultation'
        : 'Payment & COD Policy'
    }.`
  )}`;

  const tabs: { id: PolicyTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'refund', label: '7-Day Exchange & Refund', icon: RotateCcw },
    { id: 'care', label: 'Fabric Care Guide', icon: Sparkles },
    { id: 'payment', label: 'Payment & COD', icon: CreditCard },
    { id: 'tailoring', label: 'Tailoring Consult', icon: Scissors },
  ];

  return (
    <div
      id="store-policy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="store-policy-modal-container"
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden transition-all my-6 ${
          isDarkMode
            ? 'bg-zinc-900 border-zinc-700/80 text-zinc-100'
            : 'bg-white border-amber-200 text-zinc-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`px-5 sm:px-7 py-4 border-b flex items-center justify-between gap-3 ${
            isDarkMode
              ? 'bg-zinc-950/80 border-zinc-800'
              : 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-200/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-display font-black text-lg shadow-sm shrink-0">
              A
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg tracking-tight">
                {storeSettings.storeName} Customer Care & Policies
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Venus Chowk, Okara • Official Customer Assistance</span>
              </p>
            </div>
          </div>

          <button
            id="close-policy-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div
          className={`flex items-center gap-1.5 px-4 sm:px-6 py-2.5 overflow-x-auto border-b text-xs scrollbar-none ${
            isDarkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-stone-50 border-zinc-200'
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`policy-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-sm'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-amber-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 max-h-[60vh] overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4" id="policy-content-privacy">
              <div className="flex items-center gap-2 text-amber-500">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  Privacy Policy (پرائیویسی پالیسی)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                At <strong>{storeSettings.storeName}</strong>, your privacy and trust are of supreme importance. We are committed to safeguarding all personal information provided when you browse our boutique catalog, place Cash on Delivery (COD) orders, or message us on WhatsApp.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <h5 className="font-bold text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Information We Collect
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Customer full name, delivery shipping address (anywhere in Pakistan), and mobile number solely for order confirmation and courier dispatch.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <h5 className="font-bold text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    100% Confidential & Secure
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We never sell, rent, or trade your personal information. Data is exclusively used by our Okara store staff and authorized logistics partners (TCS / Leopard).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong>No Online Payment Data Retention:</strong> Because we process payments via verified Cash on Delivery (COD) or direct WhatsApp banking (JazzCash / Easypaisa), we never ask for or store sensitive debit/credit card CVV credentials on our servers.
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4" id="policy-content-terms">
              <div className="flex items-center gap-2 text-amber-500">
                <FileText className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  Terms of Service (شرائط و ضوابط)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                By purchasing fabrics or ordering garments from <strong>Abid Garments</strong>, you agree to the following terms designed to ensure a smooth, authentic eastern wear shopping experience:
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Authenticity Guarantee:</strong> All fabrics, including Japanese Boski (6 Lb / 8 Lb) and Egyptian Giza Cottons, are guaranteed 100% original as described.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Standard Fabric Cuts:</strong> Standard unstitched men's suits are supplied in 4.0 or 4.5 meters (as indicated per fabric width) to ensure ample cloth for custom tailoring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Order Verification:</strong> To prevent fraudulent bookings, orders placed online may receive an automated confirmation WhatsApp or brief phone call from our Okara representative prior to parcel dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Color Variation:</strong> While we capture high-definition photographs, minor color tone variations (3-5%) may occur depending on your device's screen brightness and color profile.</span>
                </li>
              </ul>
            </div>
          )}

          {/* TAB 3: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4" id="policy-content-shipping">
              <div className="flex items-center gap-2 text-amber-500">
                <Truck className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  Nationwide Shipping & TCS Dispatch (شپنگ پالیسی)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                We safely deliver premium men's fabrics across every district, city, and town in Pakistan via verified courier services.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
                    Major Cities
                  </span>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mt-1">
                    2 to 3 Business Days
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
                    Other Regions
                  </span>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mt-1">
                    3 to 5 Business Days
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    KPK, Balochistan, Interior Sindh, South Punjab & remote areas.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
                    Okara Local
                  </span>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mt-1">
                    Same Day Pickup / Rider
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Visit Venus Chowk branch or request city bike delivery.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                <p>
                  • <strong>Shipping Fee:</strong> Standard flat rate of <strong>Rs. 250</strong> on orders nationwide.
                </p>
                <p>
                  • <strong>FREE SHIPPING:</strong> On all orders above <strong>Rs. 4,999</strong>!
                </p>
                <p>
                  • <strong>Tracking Code:</strong> As soon as your parcel is handed over to TCS or Leopard, your tracking number is sent directly to your phone via SMS/WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: 7-DAY RETURN & EXCHANGE */}
          {activeTab === 'refund' && (
            <div className="space-y-4" id="policy-content-refund">
              <div className="flex items-center gap-2 text-amber-500">
                <RotateCcw className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  7-Day Return & Exchange Policy (ریفنڈ و ایکسچینج)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Customer satisfaction is our priority. If you are not completely satisfied with your fabric or ordered suit, you can exchange it within <strong>7 days</strong> of delivery.
              </p>

              <div className="space-y-2.5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs sm:text-sm">
                <h5 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Exchange Conditions:
                </h5>
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300 pl-1">
                  <li>• The fabric must remain <strong>uncut, unstitched, and unwashed</strong>.</li>
                  <li>• Must be in original condition with brand seals, labels, and packaging intact.</li>
                  <li>• Defected or wrongly delivered items will be exchanged with zero additional courier fee.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5">
                <h5 className="font-bold text-zinc-900 dark:text-white">
                  How to Initiate an Exchange?
                </h5>
                <p>
                  1. Message our WhatsApp helpline at <strong>{storeSettings.contactNumber}</strong> with your Order Number and parcel photo.
                </p>
                <p>
                  2. Our customer support team will guide you on sending the parcel back or scheduling a replacement swap.
                </p>
                <p>
                  3. In case the requested replacement article is out of stock, a 100% full refund will be disbursed to your JazzCash, Easypaisa, or Bank Account.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: FABRIC CARE GUIDE */}
          {activeTab === 'care' && (
            <div className="space-y-4" id="policy-content-care">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  Silk & Cotton Fabric Care Guide (کپڑوں کی دیکھ بھال)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                Keep your fine Japanese Boski and luxury cotton fabrics lustrous, soft, and long-lasting by following our master care tips:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                  <h5 className="font-bold text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Pure Japanese Boski (بوسکی)
                  </h5>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                    <li>• Dry cleaning is strongly recommended for premium 6 Lb & 8 Lb Boski.</li>
                    <li>• If hand washing: Use lukewarm water and very mild baby shampoo/silk detergent.</li>
                    <li>• Never squeeze or wring harshly. Dry flat in gentle shade (away from direct sun).</li>
                    <li>• Iron at moderate silk temperature with a cotton cloth on top.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-1.5">
                  <h5 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Egyptian & Swiss Cotton (کاٹن و لٹھا)
                  </h5>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                    <li>• Soak unstitched cotton in clean cold water for 2-3 hours before tailoring (Shrink allowance).</li>
                    <li>• Wash whites and dark colored fabrics separately.</li>
                    <li>• For crisp eastern fall, iron while the fabric is slightly damp or use light starch (Kalaf).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT & COD */}
          {activeTab === 'payment' && (
            <div className="space-y-4" id="policy-content-payment">
              <div className="flex items-center gap-2 text-amber-500">
                <CreditCard className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  Payment Methods & COD (پیمنٹ کا طریقہ کار)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                We provide the most convenient, reliable, and secure payment methods across Pakistan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <span className="font-bold text-zinc-900 dark:text-white block mb-1">
                    1. Cash on Delivery (COD)
                  </span>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pay safely in cash directly to the TCS / Leopard courier delivery agent when the fabric parcel reaches your door.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40">
                  <span className="font-bold text-zinc-900 dark:text-white block mb-1">
                    2. JazzCash & Easypaisa
                  </span>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Instant wallet transfer to our official shop account with receipt shared on WhatsApp for immediate priority dispatch.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-800/40 sm:col-span-2">
                  <span className="font-bold text-zinc-900 dark:text-white block mb-1">
                    3. Direct Online Bank Transfer
                  </span>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Transfer via Meezan Bank, Bank Alfalah, or HBL. Account title: <strong>Abid Garments</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TAILORING & CONSULTATION */}
          {activeTab === 'tailoring' && (
            <div className="space-y-4" id="policy-content-tailoring">
              <div className="flex items-center gap-2 text-amber-500">
                <Scissors className="w-5 h-5" />
                <h4 className="font-display font-bold text-base text-zinc-900 dark:text-white">
                  Custom Size & Tailoring Consultation (درزی کی رہنمائی)
                </h4>
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                Need guidance on fabric yardage for tall heights, bespoke ban collar vs shirt collar, or custom buttons and stitching?
              </p>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <p>
                  • <strong>Standard Height (5'4" to 5'11"):</strong> 4.0 meters of standard 54-56" double-arz fabric is ideal for full Kurta and Shalwar.
                </p>
                <p>
                  • <strong>Tall Height or Extra Ghera (6'0"+):</strong> We recommend 4.5 meters to ensure comfortable length and generous flair.
                </p>
                <p>
                  • <strong>Waistcoat Matching:</strong> Message us on WhatsApp to get color-matched suiting fabric recommendations for your kurta.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div
          className={`px-5 sm:px-7 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-stone-50 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>Store Help: {storeSettings.contactNumber}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Ask on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
