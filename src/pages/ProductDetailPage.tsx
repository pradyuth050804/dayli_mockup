import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, Layers, Award, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';

import { DAYLI_PRODUCTS } from '../lib/hardcodedProducts';

type PriceType = 'subscription' | 'one_time';

const categoryGradients: Record<string, string> = {
  'Core Nutrition': 'from-dayli-red to-dayli-red',
  'Metabolic': 'from-dayli-red to-blue-500',
  'Functional': 'from-sky-400 to-blue-600',
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [priceType, setPriceType] = useState<PriceType>('one_time');
  const [subscriptionMonths, setSubscriptionMonths] = useState(3);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;

    const found = DAYLI_PRODUCTS.find(p => p.slug === slug);
    if (found) {
      setProduct(found);
    }
    setLoading(false);
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, priceType, priceType === 'subscription' ? subscriptionMonths : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getPrice = () => {
    if (!product) return 0;
    if (priceType === 'subscription') return product.price_subscription * subscriptionMonths;
    return product.price_one_time;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dayli-red-light border-t-dayli-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-4">Product not found.</p>
          <Link to="/products" className="text-dayli-red-dark font-semibold">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const gradient = categoryGradients[product.category] || 'from-dayli-red to-dayli-red';
  const images = product.images && product.images.length > 0 ? product.images : null;
  const totalSlides = images ? images.length + 1 : 0; // +1 for cost table

  const nextImage = () => {
    if (totalSlides > 0) setActiveImage((prev) => (prev + 1) % totalSlides);
  };
  const prevImage = () => {
    if (totalSlides > 0) setActiveImage((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Image & Content Carousel */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100">
              {(() => {
                const isTableSlide = images && activeImage === images.length;

                if (images && totalSlides > 0) {
                  return (
                    <>
                      <AnimatePresence mode="wait">
                        {isTableSlide ? (
                          <motion.div
                            key="cost-table"
                            className="w-full h-full bg-white p-6 sm:p-8 flex flex-col justify-center overflow-y-auto"
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-xl font-black text-stone-900 mb-1">Individual Cost Breakdown</h3>
                            <p className="text-xs text-stone-400 mb-4">What you'd pay buying each category separately</p>
                            <div className="space-y-0">
                              {[
                                { category: 'Protein', cost: '$38' },
                                { category: 'Fiber', cost: '$12' },
                                { category: 'Collagen Blocks', cost: '$30' },
                                { category: 'Electrolytes', cost: '$30' },
                                { category: 'EAAs', cost: '$40' },
                                { category: 'BCAAs', cost: '$30' },
                                { category: 'Nano Vitamins/Minerals', cost: '$35' },
                                { category: 'Postbiotics', cost: '$45' },
                                { category: 'Energy Stack', cost: '$50' },
                                { category: 'Immunity Stack', cost: '$25' },
                                { category: 'Cognitive Stack', cost: '$35' },
                              ].map((item) => (
                                <div key={item.category} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
                                  <span className="text-sm text-stone-700">{item.category}</span>
                                  <span className="text-sm font-semibold text-stone-900">{item.cost}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-dayli-red-light flex items-center justify-between">
                              <span className="text-base font-black text-stone-900">Total</span>
                              <span className="text-lg font-black text-dayli-red-dark">~$370/month</span>
                            </div>
                            <div className="mt-3 px-4 py-2.5 bg-dayli-red-light rounded-xl text-center">
                              <span className="text-sm font-semibold text-dayli-red-dark">
                                DAYLI™ replaces all of this for just <span className="text-dayli-red-dark">${product.price_subscription}/mo</span>
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.img
                            key={activeImage}
                            src={images[activeImage]}
                            alt={`${product.name} - Image ${activeImage + 1}`}
                            className="w-full h-full object-contain p-8 mix-blend-multiply"
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                      >
                        <ChevronLeft size={20} className="text-stone-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                      >
                        <ChevronRight size={20} className="text-stone-700" />
                      </button>

                      {/* Dot Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeImage
                              ? 'bg-dayli-red w-6'
                              : 'bg-white/70 hover:bg-white'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  );
                }

                return (
                  /* Fallback gradient if no images */
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white font-black text-6xl leading-none">D1</div>
                          <div className="text-white/70 text-sm mt-2">DAYLI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Badge overlay - hidden on table slide */}
              {product.badge && !(images && activeImage === images.length) && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-4 py-2 bg-dayli-red-dark/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full shadow-lg">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images && (
              <div className="flex gap-3 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === activeImage
                      ? 'border-dayli-red shadow-lg shadow-dayli-red/20'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                  </button>
                ))}
                {/* Cost table thumbnail */}
                <button
                  onClick={() => setActiveImage(images.length)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-dayli-red-light ${activeImage === images.length
                    ? 'border-dayli-red shadow-lg shadow-dayli-red/20'
                    : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                >
                  <div className="text-center">
                    <div className="text-dayli-red-dark text-xs font-bold">$$$</div>
                    <div className="text-[9px] text-dayli-red mt-0.5">Breakdown</div>
                  </div>
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: Layers, label: `${product.layers?.length || 0} Layers` },
                { icon: Shield, label: 'Allergen Free' },
                { icon: Award, label: 'Science-Backed' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="p-4 bg-stone-50 rounded-2xl text-center">
                  <Icon size={20} className="text-dayli-red-dark mx-auto mb-2" />
                  <span className="text-xs font-medium text-stone-600">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="text-sm text-stone-400 font-medium mb-2">{product.target_group}</div>
              <h1 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-xl text-stone-500">{product.tagline}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Key Benefits</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.benefits?.map(b => (
                  <div key={b} className="flex items-center gap-2 text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-dayli-red-light flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-dayli-red-dark" />
                    </div>
                    <span className="text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Biological Layers</h3>
              <div className="flex flex-wrap gap-2">
                {product.layers?.map(layer => (
                  <span key={layer} className="px-3 py-1.5 bg-dayli-red-light text-dayli-red-dark text-sm font-medium rounded-full border border-dayli-red-light">
                    {layer}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-stone-900">Choose Your Plan</h3>
              <div className="space-y-3">
                {[
                  { type: 'one_time' as PriceType, label: 'One-Time Purchase', price: product.price_one_time, badge: null },
                  { type: 'subscription' as PriceType, label: 'Monthly Subscription', price: product.price_subscription, badge: 'Save 35%' },
                ].map(option => (
                  <button
                    key={option.type}
                    onClick={() => setPriceType(option.type)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${priceType === option.type
                      ? 'border-dayli-red bg-dayli-red-light'
                      : 'border-stone-200 bg-white hover:border-dayli-red-light'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${priceType === option.type ? 'border-dayli-red bg-dayli-red' : 'border-stone-300'
                        }`}>
                        {priceType === option.type && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium text-stone-900">{option.label}</span>
                      {option.badge && (
                        <span className="px-2 py-0.5 bg-dayli-red-light text-dayli-red-dark text-xs font-semibold rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-stone-900">
                      ${option.price?.toFixed(2)}
                      {option.type === 'subscription' && <span className="text-stone-400 text-sm font-normal">/mo</span>}
                    </span>
                  </button>
                ))}
              </div>

              {priceType === 'subscription' && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-dayli-red-light">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Subscription Duration</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[3, 4, 5, 6, 12].map(m => (
                      <button
                        key={m}
                        onClick={() => setSubscriptionMonths(m)}
                        className={`py-2 rounded-xl text-sm font-semibold transition-all ${subscriptionMonths === m
                            ? 'bg-dayli-red-dark text-white shadow-lg shadow-dayli-red-dark/20'
                            : 'bg-stone-100 text-stone-600 hover:bg-dayli-red-light hover:text-dayli-red-dark'
                          }`}
                      >
                        {m} mo
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-400 mt-3 text-center">
                    Total: <span className="font-semibold text-stone-700">${(product.price_subscription * subscriptionMonths).toFixed(2)}</span> for {subscriptionMonths} months
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-3 py-4 font-semibold text-lg rounded-2xl transition-all ${added
                  ? 'bg-dayli-red-light text-dayli-red-dark scale-95'
                  : 'bg-dayli-red-dark hover:bg-dayli-red-dark text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-dayli-red-dark/20'
                  }`}
              >
                <ShoppingCart size={20} />
                {added ? 'Added to Cart!' : `Add to Cart — $${getPrice()?.toFixed(2)}`}
              </button>
            </div>

            <p className="text-sm text-stone-400 text-center">
              Free shipping on orders over $75 · 30-day satisfaction guarantee
            </p>

            {product.long_description && (
              <div className="pt-6 border-t border-stone-100">
                <h3 className="font-bold text-stone-900 mb-3">About This Blend</h3>
                <p className="text-stone-500 leading-relaxed">{product.long_description}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
