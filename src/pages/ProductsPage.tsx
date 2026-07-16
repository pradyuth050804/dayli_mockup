import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, Check, Star } from 'lucide-react';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';
import { DAYLI_PRODUCTS, DAYLI_PRODUCT_COLORS } from '../lib/hardcodedProducts';
import { supabase } from '../lib/supabase';

const categories = ['All', 'Core Nutrition', 'Performance'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase Error:", error);
          setErrorMsg(error.message);
        }
        if (data) setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => {
    const matchCategory = filter === 'All' || p.category === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-block px-4 py-2 bg-dayli-red-light border border-red-200 text-dayli-red text-sm font-medium rounded-full mb-6">
            Precision Blends
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-stone-900 tracking-tight mb-4">
            All Products
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl">
            Science-formulated supplements engineered across 5 biological layers for your unique needs.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-full focus:outline-none focus:border-dayli-red transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={18} className="text-stone-400" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                  ? 'bg-dayli-red text-white shadow-lg shadow-red-500/20'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-dayli-red'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filtered.map((product, index) => {
              const colors = DAYLI_PRODUCT_COLORS[product.id] || { bg: 'bg-stone-50', text: 'text-stone-700', accent: 'bg-stone-500', border: 'border-stone-200' };
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group h-full"
                >
                  <div className={`bg-white rounded-3xl overflow-hidden border ${colors.border} hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full`}>
                    <div className={`h-52 relative overflow-hidden ${colors.bg} border-b ${colors.border} group-hover:bg-white transition-colors`}>
                      {product.image_url || (product.images && product.images.length > 0) ? (
                        <img
                          src={product.image_url || (product.images && product.images[0]) || ''}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
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

                      <div className="flex items-center justify-between mt-auto">
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
        )}

        {errorMsg && !loading && (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-2xl mb-8">
            <p className="font-bold">Error loading products:</p>
            <p>{errorMsg}</p>
          </div>
        )}

        {filtered.length === 0 && !loading && !errorMsg && (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
