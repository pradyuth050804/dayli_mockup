import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Mockup data for orders
    setOrders([
      { id: 'ord-12345', created_at: new Date().toISOString(), shipping_name: 'Sarah Johnson', guest_email: 'sarah.j@example.com', total_amount: 149.00, status: 'completed' },
      { id: 'ord-67890', created_at: new Date(Date.now() - 3600000).toISOString(), shipping_name: 'Michael Chen', guest_email: 'mike.chen@example.com', total_amount: 85.00, status: 'pending' },
      { id: 'ord-11223', created_at: new Date(Date.now() - 86400000).toISOString(), shipping_name: 'Emma Watson', guest_email: 'emma.w@example.com', total_amount: 215.50, status: 'completed' },
    ]);
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-stone-900">Manage Orders</h2>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="p-4 font-semibold text-stone-600 text-sm">Order ID</th>
              <th className="hidden sm:table-cell p-4 font-semibold text-stone-600 text-sm">Date</th>
              <th className="p-4 font-semibold text-stone-600 text-sm">Customer</th>
              <th className="p-4 font-semibold text-stone-600 text-sm">Total</th>
              <th className="hidden md:table-cell p-4 font-semibold text-stone-600 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-mono text-sm text-stone-900">{order.id.split('-')[0].toUpperCase()}</td>
                <td className="hidden sm:table-cell p-4 text-sm text-stone-600">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="font-semibold text-stone-900 truncate max-w-[120px] md:max-w-none">{order.shipping_name || 'Guest'}</div>
                  <div className="text-xs text-stone-500 truncate max-w-[120px] md:max-w-none">{order.guest_email || 'Registered User'}</div>
                </td>
                <td className="p-4 font-bold text-stone-900">${order.total_amount}</td>
                <td className="hidden md:table-cell p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
