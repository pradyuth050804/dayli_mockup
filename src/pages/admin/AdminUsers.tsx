import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Mockup data for users
    setUsers([
      { id: '1', full_name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'user', created_at: new Date().toISOString(), health_plan_generated: true },
      { id: '2', full_name: 'Michael Chen', email: 'mike.chen@example.com', role: 'user', created_at: new Date(Date.now() - 86400000).toISOString(), health_plan_generated: false },
      { id: '3', full_name: 'Admin User', email: 'admin@dayli.com', role: 'admin', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), health_plan_generated: true },
    ]);
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-stone-900">Manage Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red text-sm w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="p-4 font-semibold text-stone-600 text-sm">User</th>
              <th className="p-4 font-semibold text-stone-600 text-sm">Role</th>
              <th className="hidden md:table-cell p-4 font-semibold text-stone-600 text-sm">Joined</th>
              <th className="hidden sm:table-cell p-4 font-semibold text-stone-600 text-sm">Health Plan</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dayli-red-light text-dayli-red-dark flex items-center justify-center font-bold flex-shrink-0">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-stone-900 truncate">{user.full_name || 'Anonymous User'}</div>
                    <div className="text-xs text-stone-500 truncate">{user.email || 'No email'}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="hidden md:table-cell p-4 text-sm text-stone-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="hidden sm:table-cell p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.health_plan_generated ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {user.health_plan_generated ? 'Generated' : 'Pending'}
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
