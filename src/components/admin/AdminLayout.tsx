import { Layout, Package, Users, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: Layout },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row pt-16 lg:pt-20 pb-20 lg:pb-0">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-stone-100 flex flex-col flex-shrink-0">
        <div className="hidden lg:block p-6 border-b border-stone-100">
          <Link to="/admin" className="text-xl font-black tracking-tighter text-stone-900 flex items-center gap-2">
            DAYLI <span className="text-dayli-red-dark">ADMIN</span>
          </Link>
        </div>
        <nav className="p-3 lg:p-4 grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-2 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm transition-colors ${
                  isActive 
                    ? 'bg-dayli-red-light text-dayli-red-dark font-semibold' 
                    : 'text-stone-600 hover:bg-stone-50 font-medium'
                }`}
              >
                <link.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
