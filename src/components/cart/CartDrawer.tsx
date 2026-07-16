import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  const getPrice = (item: typeof items[0]) => {
    if (item.type === 'subscription') return item.product.price_subscription * (item.subscription_months || 3);
    return item.product.price_one_time;
  };

  const getLabel = (item: typeof items[0]) => {
    if (item.type === 'subscription') return `Subscription · ${item.subscription_months || 3} months × $${item.product.price_subscription}/mo`;
    return 'One-time purchase';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-stone-700" />
                <span className="font-semibold text-stone-900">Your Cart</span>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 bg-dayli-red-light text-dayli-red-dark text-xs font-bold rounded-full">
                    {totalItems} items
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} className="text-stone-500" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                <div className="w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center">
                  <ShoppingCart size={40} className="text-stone-300" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-stone-700 mb-2">Your cart is empty</p>
                  <p className="text-sm text-stone-400">Add precision nutrition products to get started</p>
                </div>
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-dayli-red-dark text-white rounded-full font-medium hover:bg-dayli-red-dark transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.type}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-4 bg-stone-50 rounded-2xl"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-dayli-red-light to-dayli-red-light flex items-center justify-center flex-shrink-0">
                        <div className="text-2xl font-black text-dayli-red-dark text-xs">D1</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {getLabel(item)}
                        </p>
                        <p className="text-xs font-semibold text-dayli-red-dark mt-1">
                          ${getPrice(item).toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-dayli-red transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-dayli-red transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <Trash2 size={14} className="text-stone-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-stone-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Total</span>
                    <span className="font-bold text-stone-900 text-lg">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-stone-400 text-center">Free shipping on all orders over $75</p>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-dayli-red-dark hover:bg-dayli-red-dark text-white font-semibold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-dayli-red-dark/20"
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/products"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-sm text-stone-500 hover:text-dayli-red-dark transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
