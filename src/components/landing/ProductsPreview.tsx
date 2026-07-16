import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, Check } from 'lucide-react';
import { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { DAYLI_PRODUCTS, DAYLI_PRODUCT_COLORS } from '../../lib/hardcodedProducts';
import { supabase } from '../../lib/supabase';

export default function ProductsPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { addItem } = useCart();

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  return (
    <section id="products-preview" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16"
        >
          <div>
            <span className="inline-block px-4 py-2 bg-dayli-red-light border border-red-200 text-dayli-red text-sm font-medium rounded-full mb-6">
              All-In-One Superblends
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-stone-900 tracking-tight">
              Good Days<br />
              <span className="text-dayli-red">
                Start With DAYLI
              </span>
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-6 lg:mt-0 flex items-center gap-2 text-dayli-red font-semibold hover:gap-3 transition-all"
          >
            View All Products <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product, index) => {
            const colors = DAYLI_PRODUCT_COLORS[product.id] || { bg: 'bg-stone-50', text: 'text-stone-700', accent: 'bg-stone-500', border: 'border-stone-200' };
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group h-full"
              >
                <div className={`bg-white rounded-3xl overflow-hidden border ${colors.border} hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full`}>
                  <div className={`h-64 w-full relative overflow-hidden ${colors.bg} group-hover:bg-white transition-colors duration-500`}>
                    {product.image_url || (product.images && product.images.length > 0) ? (
                      <img
                        src={product.image_url || (product.images && product.images[0]) || ''}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-stone-300 font-bold">Image soon</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 left-4 z-10">
                      {product.badge && (
                        <span className={`px-3 py-1 ${colors.accent} text-white text-xs font-semibold rounded-full shadow-sm`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-1 z-10 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={10} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs text-stone-400 font-medium mb-1">{product.target_group}</div>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className={`font-bold text-stone-900 text-lg mb-2 group-hover:${colors.text} transition-colors`}>
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-stone-500 mb-4 leading-relaxed line-clamp-2">{product.tagline}</p>

                    <div className="space-y-1 mb-5">
                      {product.benefits?.slice(0, 3).map(b => (
                        <div key={b} className="flex items-center gap-2 text-xs text-stone-600">
                          <Check size={12} className="text-dayli-red flex-shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                      <div>
                        <span className="text-2xl font-black text-stone-900">${product.price_one_time}</span>
                        <span className="text-xs text-stone-400 ml-1">or ${product.price_monthly || product.price_subscription}/mo</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/products/${product.slug}`}
                          className="px-3 py-2 border border-stone-200 text-stone-600 text-sm font-medium rounded-full hover:border-dayli-red hover:text-dayli-red transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); addItem(product, 'one_time'); }}
                          className="px-4 py-2 bg-dayli-red hover:bg-dayli-red-dark text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
