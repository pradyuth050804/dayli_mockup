import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Package, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount'),
    ]).then(([usersData, productsData, ordersData]) => {
      const revenue = ordersData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      setStats({
        users: usersData.count || 0,
        products: productsData.count || 0,
        revenue
      });
    });
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-black text-stone-900 mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-stone-500">Total Users</p>
          <p className="text-3xl font-black text-stone-900">{stats.users}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
            <Package size={24} />
          </div>
          <p className="text-sm font-medium text-stone-500">Total Products</p>
          <p className="text-3xl font-black text-stone-900">{stats.products}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-sm font-medium text-stone-500">Total Revenue</p>
          <p className="text-3xl font-black text-stone-900">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
