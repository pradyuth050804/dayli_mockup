import { Link } from 'react-router-dom';
import { Sun, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-50 text-stone-500 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl text-dayli-red tracking-tight">DAYLI</span>
              <Sun size={12} className="text-dayli-red opacity-70" />
              <span className="text-[9px] font-bold text-stone-400 tracking-wider">®</span>
            </div>
            <p className="text-xs font-semibold text-stone-600 italic">I Own My Bio!</p>
            <p className="text-sm leading-relaxed">
              Precision nutrition superblends built for your biology. Vegan. Vegetarian. Powered by DE3PBIO (USA).
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-stone-100 hover:bg-red-50 flex items-center justify-center transition-colors group border border-stone-200" aria-label={`Social link ${i + 1}`}>
                  <Icon size={16} className="text-stone-400 group-hover:text-dayli-red transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-stone-900 font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              {['DAYLI Kids', 'DAYLI Women', 'DAYLI Gym Freaks', 'DAYLI Seniors', 'DAYLI Men', 'DAYLI Girls'].map(p => (
                <li key={p}>
                  <Link to="/products" className="hover:text-dayli-red transition-colors">{p}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-stone-900 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'AI Companion', to: '/companion-ai' },
                { label: 'Our Science', to: '/science' },
                { label: 'Deep Tech', to: '/science' },
                { label: 'Sign Up', to: '/auth' },
                { label: 'Account', to: '/account' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-dayli-red transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-stone-900 font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm mb-4">Get precision nutrition insights delivered to you.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-white text-stone-800 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-dayli-red transition-colors placeholder:text-stone-400"
              />
              <button className="px-4 py-2.5 bg-dayli-red hover:bg-dayli-red-dark text-white rounded-xl transition-colors" aria-label="Subscribe">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400">© 2025 DAYLI®. All rights reserved. hellodayli.com</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-dayli-red transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-dayli-red transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-dayli-red transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
