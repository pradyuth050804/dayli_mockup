import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-xl border-b border-stone-100 ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* DAYLI Logo */}
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="font-black text-2xl tracking-tight text-dayli-red">
                DAYLI
              </span>
              <span className="text-dayli-red opacity-70 group-hover:opacity-100 transition-opacity">
                <Sun size={14} strokeWidth={2.5} />
              </span>
              <span className="text-[10px] font-bold text-stone-400 tracking-wider ml-0.5">™</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: 'Shop', to: '/products' },
                { label: 'Our Story', to: '/science' },
                { label: 'Deep Tech', to: '/#about' },
                { label: 'AI Companion', to: '/companion-ai', badge: true },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative text-sm font-medium transition-colors hover:text-dayli-red text-stone-600"
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-2.5 -right-7 px-1.5 py-0.5 bg-dayli-red text-white text-[9px] font-bold rounded-full leading-none">
                      NEW
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* User Icon */}
              <Link
                to={user ? '/account' : '/auth'}
                className="hidden lg:flex p-2 rounded-full transition-all hover:bg-stone-100 text-stone-600 hover:text-dayli-red"
                aria-label={user ? 'My Account' : 'Sign In'}
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-full transition-all hover:bg-stone-100 text-stone-600 hover:text-dayli-red"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-dayli-red text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Desktop CTA */}
              <Link
                to={user ? '/account' : '/products'}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-dayli-red hover:bg-dayli-red-dark text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
              >
                {user ? 'My Dashboard' : 'Start My DAYLI'}
              </Link>

              {/* Mobile CTA & Menu Toggle */}
              <Link
                to={user ? '/account' : '/products'}
                className="lg:hidden px-3 py-1.5 bg-dayli-red text-white text-xs font-semibold rounded-full shadow-sm"
              >
                {user ? 'My Dashboard' : 'Start DAYLI'}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation Bar (Tabs) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-stone-100 z-[9999] pb-safe">
        <div className="flex items-center justify-around p-2">
          {[
            { label: 'Home', icon: Sun, to: '/' },
            { label: 'Shop', icon: ShoppingCart, to: '/products' },
            { label: 'AI', icon: User, to: '/companion-ai' }, // Could use Bot but we don't have it imported, let's just use a simple icon
            { label: 'Account', icon: User, to: '/account' },
          ].map(tab => {
            const isActive = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center justify-center w-full py-1 ${
                  isActive ? 'text-dayli-red-dark' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <tab.icon size={20} className="mb-1" />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
