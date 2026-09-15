import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Video,
  Film,
  ShoppingBag,
  MapPin,
  Share2,
  Sliders,
  Upload,
  Check,
  Trash2,
  Edit2,
  Plus,
  Play,
  Eye,
  EyeOff,
  Zap,
  RefreshCw,
  LogOut,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Save,
  Download
} from 'lucide-react';
import {
  Product,
  BackgroundVideoSettings,
  IntroVideoSettings,
  StoreSettings,
  SocialLinks,
  OptimizationSettings
} from '../types';
import { VIDEO_PRESETS, INTRO_VIDEO_PRESETS } from '../data/initialData';
import { optimizeImageFile, OptimizedImageResult } from '../utils/imageOptimizer';
import { saveStoreDataToServer, exportStoreDataJson } from '../services/storePersistence';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  backgroundSettings: BackgroundVideoSettings;
  onSaveBackgroundSettings: (settings: BackgroundVideoSettings) => void;
  introSettings: IntroVideoSettings;
  onSaveIntroSettings: (settings: IntroVideoSettings) => void;
  storeSettings: StoreSettings;
  onSaveStoreSettings: (settings: StoreSettings) => void;
  socialLinks: SocialLinks;
  onSaveSocialLinks: (links: SocialLinks) => void;
  optimizationSettings: OptimizationSettings;
  onSaveOptimizationSettings: (settings: OptimizationSettings) => void;
  onTestIntro: () => void;
  isDarkMode: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  backgroundSettings,
  onSaveBackgroundSettings,
  introSettings,
  onSaveIntroSettings,
  storeSettings,
  onSaveStoreSettings,
  socialLinks,
  onSaveSocialLinks,
  optimizationSettings,
  onSaveOptimizationSettings,
  onTestIntro,
  isDarkMode,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab: 'video' | 'intro' | 'products' | 'store' | 'social' | 'optimization'
  const [activeTab, setActiveTab] = useState<
    'video' | 'intro' | 'products' | 'store' | 'social' | 'optimization'
  >('video');

  // Form states
  const [bgForm, setBgForm] = useState<BackgroundVideoSettings>(backgroundSettings);
  const [introForm, setIntroForm] = useState<IntroVideoSettings>(introSettings);
  const [storeForm, setStoreForm] = useState<StoreSettings>(storeSettings);
  const [socialForm, setSocialForm] = useState<SocialLinks>(socialLinks);
  const [optForm, setOptForm] = useState<OptimizationSettings>(optimizationSettings);

  // Product edit/add states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'unstitched',
    pricePKR: 4500,
    originalPricePKR: 5500,
    description: '',
    fabricType: '',
    metersOrSize: '4.5 Meters Full Suit',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    badge: 'New Arrival',
    inStock: true,
    colors: ['White', 'Navy', 'Fawn'],
    rating: 5.0,
  });

  // Optimizer test state
  const [testImageResult, setTestImageResult] = useState<OptimizedImageResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync forms when props change (MUST BE BEFORE any conditional return)
  useEffect(() => {
    setStoreForm(storeSettings);
  }, [storeSettings]);

  useEffect(() => {
    setBgForm(backgroundSettings);
  }, [backgroundSettings]);

  useEffect(() => {
    setIntroForm(introSettings);
  }, [introSettings]);

  useEffect(() => {
    setSocialForm(socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    setOptForm(optimizationSettings);
  }, [optimizationSettings]);

  if (!isOpen) return null;

  // Password verification: BsAi0035% (no hint allowed)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'BsAi0035%') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Video Upload Handlers
  const handleBgVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgForm({
        ...bgForm,
        videoUrl: url,
        isUploaded: true,
        videoTitle: file.name,
        enabled: true,
        makeBackgroundInvisible: true, // User requirement: make homepage background completely invisible when video uploaded
      });
      showNotification('Background animation video uploaded successfully! 100% Invisible background enabled.');
    }
  };

  const handleIntroVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIntroForm({
        ...introForm,
        videoUrl: url,
        isUploaded: true,
        videoTitle: file.name,
        enabled: true,
      });
      showNotification('Intro animation video uploaded successfully!');
    }
  };

  // Image Upload with Auto-Optimization for Product
  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizing(true);
      let finalDataUrl = '';

      if (optForm.enableImageOptimization) {
        const optimized = await optimizeImageFile(
          file,
          optForm.maxImageDimension,
          optForm.maxImageDimension,
          optForm.compressionQuality,
          optForm.convertToWebP
        );
        finalDataUrl = optimized.dataUrl;
        showNotification(
          `Image optimized: ${optimized.originalSizeKB}KB → ${optimized.optimizedSizeKB}KB (${optimized.reductionPercentage}% saved)`
        );
      } else {
        finalDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, image: finalDataUrl });
      } else {
        setNewProductForm({ ...newProductForm, image: finalDataUrl });
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to process image');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Logo Upload & Optimization Handler
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Logo file size must be less than 5MB');
      return;
    }

    try {
      setIsOptimizing(true);
      let finalDataUrl = '';

      if (optForm.enableImageOptimization && file.type !== 'image/svg+xml') {
        const optimized = await optimizeImageFile(
          file,
          512,
          512,
          optForm.compressionQuality,
          optForm.convertToWebP
        );
        finalDataUrl = optimized.dataUrl;
        showNotification(
          `Logo optimized & uploaded: ${optimized.originalSizeKB}KB → ${optimized.optimizedSizeKB}KB`
        );
      } else {
        finalDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        showNotification('Brand logo uploaded successfully!');
      }

      setStoreForm((prev) => ({ ...prev, logoUrl: finalDataUrl }));
    } catch (err) {
      console.error(err);
      showNotification('Failed to upload logo image');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRemoveLogo = () => {
    setStoreForm((prev) => ({ ...prev, logoUrl: '' }));
    showNotification('Logo removed. Default royal monogram restored.');
  };

  const [isSavingAll, setIsSavingAll] = useState(false);

  // Master Save All Function - Saves all settings to disk file and parent state
  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      onSaveStoreSettings(storeForm);
      onSaveBackgroundSettings(bgForm);
      onSaveIntroSettings(introForm);
      onSaveSocialLinks(socialForm);
      onSaveOptimizationSettings(optForm);
      onSaveProducts(products);

      const res = await saveStoreDataToServer({
        storeSettings: storeForm,
        backgroundSettings: bgForm,
        introSettings: introForm,
        socialLinks: socialForm,
        optimizationSettings: optForm,
        products,
      });

      if (res.success) {
        showNotification('تمام تبدیلیاں فائلز اور سرور میں محفوظ کر دی گئیں! (Changes saved to server files!)');
      } else {
        showNotification('Saved locally in browser!');
      }
    } catch {
      showNotification('Settings updated in browser!');
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleExportData = () => {
    exportStoreDataJson({
      products,
      backgroundSettings: bgForm,
      introSettings: introForm,
      storeSettings: storeForm,
      socialLinks: socialForm,
      optimizationSettings: optForm,
    });
    showNotification('Store data file (JSON) downloaded!');
  };

  // Save Handlers with automatic server file persistence
  const saveBackgroundSettings = async () => {
    onSaveBackgroundSettings(bgForm);
    await saveStoreDataToServer({ backgroundSettings: bgForm });
    showNotification('Background settings updated & saved to file!');
  };

  const saveIntroSettings = async () => {
    onSaveIntroSettings(introForm);
    await saveStoreDataToServer({ introSettings: introForm });
    showNotification('Intro video settings updated & saved to file!');
  };

  const saveStoreSettings = async () => {
    onSaveStoreSettings(storeForm);
    await saveStoreDataToServer({ storeSettings: storeForm });
    showNotification('Store & logo settings updated & saved to file!');
  };

  const saveSocialLinks = async () => {
    onSaveSocialLinks(socialForm);
    await saveStoreDataToServer({ socialLinks: socialForm });
    showNotification('Social media links updated & saved to file!');
  };

  const saveOptimizationSettings = async () => {
    onSaveOptimizationSettings(optForm);
    await saveStoreDataToServer({ optimizationSettings: optForm });
    showNotification('Image optimization settings updated & saved to file!');
  };

  // Product CRUD with automatic server file persistence
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.pricePKR) {
      showNotification('Please fill in garment name and price');
      return;
    }

    const newProd: Product = {
      id: `ag-prod-${Date.now()}`,
      name: newProductForm.name || 'New Garment',
      category: (newProductForm.category as any) || 'unstitched',
      pricePKR: Number(newProductForm.pricePKR) || 4500,
      originalPricePKR: newProductForm.originalPricePKR ? Number(newProductForm.originalPricePKR) : undefined,
      description: newProductForm.description || '',
      fabricType: newProductForm.fabricType || 'Premium Fabric',
      metersOrSize: newProductForm.metersOrSize || '4.5 Meters',
      image: newProductForm.image || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
      badge: newProductForm.badge,
      inStock: newProductForm.inStock ?? true,
      colors: newProductForm.colors || ['Default'],
      rating: 5.0,
      featured: true,
    };

    const updatedList = [newProd, ...products];
    onSaveProducts(updatedList);
    await saveStoreDataToServer({ products: updatedList });
    setIsAddingProduct(false);
    showNotification(`Added "${newProd.name}" & saved to file!`);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    onSaveProducts(updated);
    await saveStoreDataToServer({ products: updated });
    setEditingProduct(null);
    showNotification(`Updated "${editingProduct.name}" & saved to file!`);
  };

  const handleDeleteProduct = async (id: string) => {
    const filtered = products.filter((p) => p.id !== id);
    onSaveProducts(filtered);
    await saveStoreDataToServer({ products: filtered });
    showNotification('Product removed & saved to file');
  };

  // Test Image Optimization Helper
  const handleTestImageCompression = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    try {
      const res = await optimizeImageFile(
        file,
        optForm.maxImageDimension,
        optForm.maxImageDimension,
        optForm.compressionQuality,
        optForm.convertToWebP
      );
      setTestImageResult(res);
    } catch (err) {
      console.error(err);
      showNotification('Optimization test failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div id="admin-management-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" />

      {/* Main Container */}
      <div
        className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-10 my-auto border flex flex-col max-h-[90vh] ${
          isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">
                Abid Garments • Admin Management
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Customization & Control Center (Venus Chowk, Okara)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  id="admin-master-save-all-btn"
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  title="Save All Changes Permanently to Site Files"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingAll ? 'Saving...' : 'Save All (فائلز اپڈیٹ کریں)'}</span>
                </button>

                <button
                  id="admin-export-data-btn"
                  onClick={handleExportData}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Download full store backup JSON file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  title="Lock Admin Panel"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* If not authenticated: Password Gate (Strictly NO Hint) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-display font-bold mb-2">Restricted Access</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Please enter the administrator password to manage background animations, video intro, garments catalog, contact info, and image optimization settings.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  id="admin-password-input"
                  type="password"
                  placeholder="Enter Password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-center tracking-widest transition-all outline-none ${
                    authError
                      ? 'border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500'
                      : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:border-amber-500'
                  }`}
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect password. Access denied.</span>
                  </p>
                )}
              </div>

              <button
                id="admin-submit-login-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm tracking-wide shadow-md transition-all"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Tabs & Content */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 p-3 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 bg-zinc-50/50 dark:bg-zinc-900/30">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'video'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Background Options</span>
              </button>

              <button
                onClick={() => setActiveTab('intro')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'intro'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Intro Animation</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Garments Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab('store')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'store'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Logo & Store Details</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'social'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Social Media Links</span>
              </button>

              <button
                onClick={() => setActiveTab('optimization')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'optimization'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Image Optimization</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[75vh]">
              {/* TAB 1: BACKGROUND OPTIONS (DEFAULT THEME & ANIMATED VIDEO UPLOAD) */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base mb-1">
                      Background Appearance & Animation Settings
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Choose between the authentic Default Luxury Cloth Boutique background or an Animated Video background (with custom video upload & 100% invisible mode).
                    </p>
                  </div>

                  {/* DUAL OPTION SELECTOR CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* OPTION 1: DEFAULT BACKGROUND */}
                    <div
                      onClick={() => setBgForm({ ...bgForm, mode: 'default', enabled: false })}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        bgForm.mode === 'default' || !bgForm.enabled
                          ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <h5 className="font-display font-bold text-sm">
                              Option 1: Default Background
                            </h5>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              bgForm.mode === 'default' || !bgForm.enabled
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-zinc-400'
                            }`}
                          >
                            {(bgForm.mode === 'default' || !bgForm.enabled) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          Classic Abid Garments boutique atmosphere with subtle luxury textile weave pattern, rich contrast, and optimal readability with zero video lag.
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-amber-500 flex items-center gap-1">
                        <span>Status:</span>
                        <span className="uppercase">
                          {bgForm.mode === 'default' || !bgForm.enabled ? '● Active Default' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* OPTION 2: ANIMATED VIDEO UPLOAD */}
                    <div
                      onClick={() => setBgForm({ ...bgForm, mode: 'video', enabled: true })}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        bgForm.mode === 'video' && bgForm.enabled
                          ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                              <Film className="w-4 h-4" />
                            </span>
                            <h5 className="font-display font-bold text-sm">
                              Option 2: Animated Video Upload
                            </h5>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              bgForm.mode === 'video' && bgForm.enabled
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-zinc-400'
                            }`}
                          >
                            {bgForm.mode === 'video' && bgForm.enabled && (
                              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          Dynamic animated video background with custom video file upload (MP4/WebM), curated fabric presets, and 100% invisible transparent canvas mode.
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-amber-500 flex items-center gap-1">
                        <span>Status:</span>
                        <span className="uppercase">
                          {bgForm.mode === 'video' && bgForm.enabled ? '● Active Video' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SETTINGS FOR OPTION 1: DEFAULT BACKGROUND */}
                  {(bgForm.mode === 'default' || !bgForm.enabled) && (
                    <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h5 className="font-display font-bold text-sm">
                          Default Luxury Background Styling
                        </h5>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        The Default Background displays an authentic woven textile geometry grid with gentle ambient lighting that dynamically adapts to both Dark Mode and Light Mode.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                        {[
                          { id: 'luxury-mesh', label: 'Luxury Loom Mesh' },
                          { id: 'geometric-weave', label: 'Cotton Twill Weave' },
                          { id: 'minimal-damask', label: 'Boski Silk Motif' },
                          { id: 'silk-sheen', label: 'Minimal Studio' },
                        ].map((pat) => (
                          <button
                            key={pat.id}
                            type="button"
                            onClick={() =>
                              setBgForm({
                                ...bgForm,
                                defaultPattern: pat.id as any,
                                mode: 'default',
                                enabled: false,
                              })
                            }
                            className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                              (bgForm.defaultPattern || 'luxury-mesh') === pat.id
                                ? 'border-amber-500 bg-amber-500/20 text-amber-400 font-bold'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                            }`}
                          >
                            <span>{pat.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                        <span>Selected default pattern: <strong>{bgForm.defaultPattern || 'luxury-mesh'}</strong></span>
                        <span className="text-emerald-500 font-bold">Fast & Responsive</span>
                      </div>
                    </div>
                  )}

                  {/* SETTINGS FOR OPTION 2: ANIMATED VIDEO UPLOAD */}
                  {bgForm.mode === 'video' && bgForm.enabled && (
                    <div className="space-y-5 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-amber-500" />
                        <h5 className="font-display font-bold text-sm">
                          Animated Video Configuration
                        </h5>
                      </div>

                      {/* 100% Invisible Background Mode Switch (Key User Requirement) */}
                      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-amber-500" />
                            <span className="font-display font-bold text-sm">
                              100% Invisible Background Mode
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                            When enabled, the homepage background becomes completely invisible/transparent so the animation video is 100% clearly visible as requested.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={bgForm.makeBackgroundInvisible}
                            onChange={(e) =>
                              setBgForm({ ...bgForm, makeBackgroundInvisible: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      {/* Video Upload or URL */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Upload Custom Animated Background Video
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-sm">
                            <Upload className="w-4 h-4" />
                            <span>Select Video File (MP4, WebM)</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm"
                              onChange={handleBgVideoUpload}
                              className="hidden"
                            />
                          </label>
                          {bgForm.isUploaded && (
                            <span className="text-xs text-emerald-500 font-semibold truncate">
                              Uploaded: {bgForm.videoTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                          Or Direct Video URL
                        </label>
                        <input
                          type="text"
                          value={bgForm.videoUrl}
                          onChange={(e) =>
                            setBgForm({
                              ...bgForm,
                              videoUrl: e.target.value,
                              isUploaded: false,
                              mode: 'video',
                              enabled: true,
                            })
                          }
                          placeholder="https://.../video.mp4"
                          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                        />
                      </div>

                      {/* Presets */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Or Select Luxury Fabric Motion Preset:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {VIDEO_PRESETS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() =>
                                setBgForm({
                                  ...bgForm,
                                  mode: 'video',
                                  videoUrl: p.url,
                                  videoTitle: p.name,
                                  isUploaded: false,
                                  enabled: true,
                                  makeBackgroundInvisible: true,
                                })
                              }
                              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                                bgForm.videoUrl === p.url && bgForm.mode === 'video'
                                  ? 'border-amber-500 bg-amber-500/10 font-bold'
                                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                              }`}
                            >
                              <p className="truncate font-semibold">{p.name}</p>
                              <span className="text-[10px] text-zinc-400">Click to apply</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video Opacity Slider */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Video Opacity:</span>
                          <span>{Math.round(bgForm.opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="1"
                          step="0.05"
                          value={bgForm.opacity}
                          onChange={(e) =>
                            setBgForm({ ...bgForm, opacity: parseFloat(e.target.value) })
                          }
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Save Settings CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={saveBackgroundSettings}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all"
                    >
                      Save Background Options
                    </button>
                    <span className="text-xs text-zinc-500">
                      Currently using: <strong>{bgForm.mode === 'video' && bgForm.enabled ? 'Animated Video' : 'Default Background'}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: INTRO ANIMATION VIDEO */}
              {activeTab === 'intro' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base mb-1">
                      Opening Intro Animation Video
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Controls the intro video that plays when visitors first open Abid Garments.
                    </p>
                  </div>

                  {/* Enable Intro Switch */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-semibold block">Enable Intro Video on Launch</span>
                      <span className="text-[11px] text-zinc-400">
                        Plays video animation upon opening website, then transitions into the store.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={introForm.enabled}
                      onChange={(e) => setIntroForm({ ...introForm, enabled: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>

                  {/* Intro Upload or URL */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Upload Custom Intro Video
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Select Intro Video File</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleIntroVideoUpload}
                          className="hidden"
                        />
                      </label>
                      {introForm.isUploaded && (
                        <span className="text-xs text-emerald-500 font-semibold truncate">
                          Uploaded: {introForm.videoTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      Or Intro Video URL
                    </label>
                    <input
                      type="text"
                      value={introForm.videoUrl}
                      onChange={(e) =>
                        setIntroForm({ ...introForm, videoUrl: e.target.value, isUploaded: false })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                    />
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Auto-close Duration:</span>
                      <span>{introForm.autoCloseSeconds} seconds</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      value={introForm.autoCloseSeconds}
                      onChange={(e) =>
                        setIntroForm({ ...introForm, autoCloseSeconds: parseInt(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Allow Skip Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-semibold">Allow Visitors to Skip Intro</span>
                    <input
                      type="checkbox"
                      checked={introForm.allowSkip}
                      onChange={(e) => setIntroForm({ ...introForm, allowSkip: e.target.checked })}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={saveIntroSettings}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md"
                    >
                      Save Intro Settings
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onTestIntro();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-500/50 hover:bg-amber-500/20 text-amber-500 text-xs font-bold transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Test Play Intro Now</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: GARMENTS & PRODUCTS CATALOG */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base">Garments Catalog Management</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Add, modify or remove cloth products from Abid Garments store.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingProduct(!isAddingProduct);
                        setEditingProduct(null);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingProduct ? 'Cancel Add' : 'Add New Garment'}</span>
                    </button>
                  </div>

                  {/* Add Product Form */}
                  {isAddingProduct && (
                    <form
                      onSubmit={handleCreateProduct}
                      className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 space-y-3"
                    >
                      <h5 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                        Add New Fabric / Garment Suit
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Product Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pure Japanese Silk Boski"
                            value={newProductForm.name}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Category</label>
                          <select
                            value={newProductForm.category}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, category: e.target.value as any })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent dark:bg-zinc-900"
                          >
                            <option value="boski">Pure Boski</option>
                            <option value="cotton">Giza Cotton</option>
                            <option value="unstitched">Unstitched Wash & Wear</option>
                            <option value="kurta">Kurta Shalwar</option>
                            <option value="waistcoat">Waistcoats</option>
                            <option value="festive">Wedding & Festive</option>
                            <option value="shawls">Shawls</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Price in PKR</label>
                          <input
                            type="number"
                            required
                            placeholder="4500"
                            value={newProductForm.pricePKR}
                            onChange={(e) =>
                              setNewProductForm({
                                ...newProductForm,
                                pricePKR: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Original Price PKR</label>
                          <input
                            type="number"
                            placeholder="5500"
                            value={newProductForm.originalPricePKR || ''}
                            onChange={(e) =>
                              setNewProductForm({
                                ...newProductForm,
                                originalPricePKR: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Fabric Composition</label>
                          <input
                            type="text"
                            placeholder="e.g. 100% Super Giza Cotton"
                            value={newProductForm.fabricType}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, fabricType: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Cutting / Size</label>
                          <input
                            type="text"
                            placeholder="e.g. 4.5 Meters Suit Length"
                            value={newProductForm.metersOrSize}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, metersOrSize: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Product Image Upload with optimization */}
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">
                          Product Image (Auto-Optimized with fast compression)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold flex items-center gap-2 hover:bg-amber-500 hover:text-black">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProductImageUpload(e, false)}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or image URL"
                            value={newProductForm.image}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, image: e.target.value })
                            }
                            className="flex-1 px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isOptimizing}
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                      >
                        {isOptimizing ? 'Compressing Image...' : 'Save & Publish Garment'}
                      </button>
                    </form>
                  )}

                  {/* Editing Existing Product Form */}
                  {editingProduct && (
                    <form
                      onSubmit={handleUpdateProduct}
                      className="p-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                          Edit: {editingProduct.name}
                        </h5>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="text-xs text-zinc-400 hover:text-zinc-600"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Title</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Price (PKR)</label>
                          <input
                            type="number"
                            value={editingProduct.pricePKR}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                pricePKR: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Image</label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold flex items-center gap-2">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Replace Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProductImageUpload(e, true)}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            value={editingProduct.image}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, image: e.target.value })
                            }
                            className="flex-1 px-3 py-1.5 rounded-lg border text-xs bg-transparent"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                      >
                        Update Garment
                      </button>
                    </form>
                  )}

                  {/* List of Products */}
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 space-y-2">
                    {products.map((p) => (
                      <div key={p.id} className="pt-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h6 className="font-semibold text-xs truncate">{p.name}</h6>
                            <p className="text-[10px] text-zinc-400">
                              Rs. {p.pricePKR.toLocaleString()} • {p.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsAddingProduct(false);
                            }}
                            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-amber-500"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: STORE LOCATION & CONTACT SETTINGS */}
              {activeTab === 'store' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base mb-1">
                      Brand Identity, Logo & Store Details
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Upload your official boutique logo and configure store contact information.
                    </p>
                  </div>

                  {/* BRAND LOGO MANAGEMENT CARD */}
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span>Official Brand Logo (برانڈ لوگو اپلوڈ)</span>
                            {storeForm.logoUrl ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                Custom Logo Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-400 text-[10px] font-bold">
                                Default Monogram "A"
                              </span>
                            )}
                          </h5>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Shows automatically across Header Navbar, Mobile Drawer, and Footer.
                          </p>
                        </div>
                      </div>

                      {storeForm.logoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-500 text-xs font-semibold self-start sm:self-auto transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Logo</span>
                        </button>
                      )}
                    </div>

                    {/* Logo Live Preview & Display Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Dark Mode Preview */}
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-inner">
                            {storeForm.logoUrl ? (
                              <img
                                src={storeForm.logoUrl}
                                alt="Logo Dark Preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-display font-black text-lg shadow-md">
                                A
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-white block truncate">
                              {storeForm.storeName || 'Abid Garments'}
                            </span>
                            <span className="text-[10px] text-amber-500 font-semibold block">
                              Dark Header Preview
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
                          Dark
                        </span>
                      </div>

                      {/* Light Mode Preview */}
                      <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-sm">
                            {storeForm.logoUrl ? (
                              <img
                                src={storeForm.logoUrl}
                                alt="Logo Light Preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-display font-black text-lg shadow-md">
                                A
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-zinc-900 block truncate">
                              {storeForm.storeName || 'Abid Garments'}
                            </span>
                            <span className="text-[10px] text-amber-700 font-semibold block">
                              Light Header Preview
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-zinc-600 font-medium">
                          Light
                        </span>
                      </div>
                    </div>

                    {/* File Upload Dropzone */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                        Upload Logo File from Device
                      </label>
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-amber-500/40 hover:border-amber-500 rounded-xl cursor-pointer bg-white/40 dark:bg-zinc-900/40 hover:bg-amber-500/5 transition-all group">
                        <Upload className="w-6 h-6 text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {isOptimizing ? 'Compressing & Uploading Logo...' : 'Click to Select or Drag & Drop Logo File'}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Supports PNG with transparency, SVG, JPG, WebP (Auto-optimized)
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                          onChange={handleLogoFileUpload}
                          disabled={isOptimizing}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Or URL Input */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        Or Paste Logo Web Link / URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/abid-garments-logo.png"
                        value={storeForm.logoUrl || ''}
                        onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeForm.storeName}
                        onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Physical Location / Address
                      </label>
                      <input
                        type="text"
                        value={storeForm.locationAddress}
                        onChange={(e) =>
                          setStoreForm({ ...storeForm, locationAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent font-medium"
                      />
                      <span className="text-[10px] text-amber-500 font-semibold mt-1 block">
                        Target address: RC4V+HV2, Block-B Block B Venus Chowk, Okara, Pakistan
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Official Contact / WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={storeForm.contactNumber}
                        onChange={(e) =>
                          setStoreForm({ ...storeForm, contactNumber: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent font-medium"
                      />
                      <span className="text-[10px] text-amber-500 font-semibold mt-1 block">
                        Target contact: 03217828917
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Hero Headline
                      </label>
                      <input
                        type="text"
                        value={storeForm.heroHeadline}
                        onChange={(e) =>
                          setStoreForm({ ...storeForm, heroHeadline: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Announcement Bar Notice
                      </label>
                      <input
                        type="text"
                        value={storeForm.announcementBarText}
                        onChange={(e) =>
                          setStoreForm({ ...storeForm, announcementBarText: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                      />
                    </div>

                    <button
                      onClick={saveStoreSettings}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md"
                    >
                      Save Store & Logo Information
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: SOCIAL MEDIA LINKS */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-base mb-1">Social Media Links</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Manage all external social channels displayed in the website footer.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      WhatsApp Number / Channel
                    </label>
                    <input
                      type="text"
                      value={socialForm.whatsapp}
                      onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                      placeholder="03217828917"
                      className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Facebook Page URL
                    </label>
                    <input
                      type="text"
                      value={socialForm.facebook}
                      onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/AbidGarmentsOkara"
                      className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={socialForm.instagram}
                      onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/abidgarments_okara"
                      className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      TikTok Handle URL
                    </label>
                    <input
                      type="text"
                      value={socialForm.tiktok}
                      onChange={(e) => setSocialForm({ ...socialForm, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@abidgarmentsokara"
                      className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      YouTube Channel URL
                    </label>
                    <input
                      type="text"
                      value={socialForm.youtube}
                      onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                      placeholder="https://youtube.com/@abidgarments"
                      className="w-full px-3.5 py-2 rounded-xl border text-xs bg-transparent"
                    />
                  </div>

                  <button
                    onClick={saveSocialLinks}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md"
                  >
                    Save Social Links
                  </button>
                </div>
              )}

              {/* TAB 6: IMAGE OPTIMIZATION & PERFORMANCE */}
              {activeTab === 'optimization' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base mb-1">
                      Image Optimization & Performance Controls
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Ensure lightning-fast loading speeds by automatically compressing uploaded photos and serving next-gen WebP formats.
                    </p>
                  </div>

                  {/* Toggle Optimization */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-semibold block">Enable Automatic Image Compression</span>
                      <span className="text-[11px] text-zinc-400">
                        Shrinks uploaded images in browser before saving to maximize website speed.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={optForm.enableImageOptimization}
                      onChange={(e) =>
                        setOptForm({ ...optForm, enableImageOptimization: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>

                  {/* Quality slider */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Compression Quality:</span>
                      <span>{Math.round(optForm.compressionQuality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.95"
                      step="0.05"
                      value={optForm.compressionQuality}
                      onChange={(e) =>
                        setOptForm({ ...optForm, compressionQuality: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                      <span>Maximum Speed (Smallest File)</span>
                      <span>High Fidelity (Larger File)</span>
                    </div>
                  </div>

                  {/* Max Dimension */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Max Image Dimension: {optForm.maxImageDimension}px
                    </label>
                    <input
                      type="range"
                      min="600"
                      max="2000"
                      step="100"
                      value={optForm.maxImageDimension}
                      onChange={(e) =>
                        setOptForm({ ...optForm, maxImageDimension: parseInt(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Convert to WebP */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-semibold">Convert to Next-Gen WebP Format</span>
                    <input
                      type="checkbox"
                      checked={optForm.convertToWebP}
                      onChange={(e) =>
                        setOptForm({ ...optForm, convertToWebP: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>

                  <button
                    onClick={saveOptimizationSettings}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md"
                  >
                    Save Optimization Settings
                  </button>

                  {/* Live Compression Test Tool */}
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-amber-500">
                      Interactive Live Image Compression Tester
                    </h5>
                    <p className="text-xs text-zinc-400">
                      Upload any image to test client-side compression and verify file size savings in real-time.
                    </p>

                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-xs font-bold hover:bg-amber-500 hover:text-black transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Choose Sample Image to Compress</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTestImageCompression}
                        className="hidden"
                      />
                    </label>

                    {testImageResult && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                        <p className="font-bold text-emerald-500">
                          Compression Successful! Saved {testImageResult.reductionPercentage}%
                        </p>
                        <p className="text-zinc-300">
                          Original Size: <strong>{testImageResult.originalSizeKB} KB</strong> →
                          Optimized Size: <strong>{testImageResult.optimizedSizeKB} KB</strong>
                        </p>
                        <p className="text-zinc-400 text-[11px]">
                          Format: {testImageResult.mimeType} • Dimensions: {testImageResult.width}x{testImageResult.height}px
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
