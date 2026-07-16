import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditForm({
      name: '', slug: '', tagline: '', description: '', long_description: '',
      category: 'Core Nutrition', target_group: '', price_monthly: 0,
      image_url: '', is_active: true, layers: [], benefits: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setModalMode('edit');
    setEditForm({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = { ...editForm };
    
    // Ensure arrays are proper
    if (typeof payload.layers === 'string') {
      payload.layers = payload.layers.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof payload.benefits === 'string') {
      payload.benefits = payload.benefits.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    if (modalMode === 'add') {
      await supabase.from('products').insert([payload]);
    } else {
      await supabase.from('products').update(payload).eq('id', payload.id);
    }

    setSaving(false);
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-stone-900">Manage Products</h2>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-dayli-red-dark text-white rounded-xl font-semibold hover:bg-dayli-red transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="p-4 font-semibold text-stone-600 text-xs md:text-sm">Image</th>
              <th className="p-4 font-semibold text-stone-600 text-xs md:text-sm">Product Info</th>
              <th className="hidden md:table-cell p-4 font-semibold text-stone-600 text-sm">Category</th>
              <th className="hidden md:table-cell p-4 font-semibold text-stone-600 text-sm">Price/Mo</th>
              <th className="hidden sm:table-cell p-4 font-semibold text-stone-600 text-sm">Status</th>
              <th className="p-4 font-semibold text-stone-600 text-xs md:text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                <td className="p-3 md:p-4">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover bg-stone-100" />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] md:text-xs text-stone-400 text-center leading-tight">No Img</div>
                  )}
                </td>
                <td className="p-3 md:p-4">
                  <span className="font-bold text-stone-900 block text-sm md:text-base">{product.name}</span>
                  <span className="block text-xs text-stone-500 mt-0.5 line-clamp-1">{product.tagline}</span>
                </td>
                <td className="hidden md:table-cell p-4 text-sm font-medium text-stone-700">
                  {product.category}
                </td>
                <td className="hidden md:table-cell p-4 font-bold text-dayli-red-dark">
                  ${product.price_monthly}
                </td>
                <td className="hidden sm:table-cell p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 md:p-4 text-right">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <button onClick={() => openEditModal(product)} className="p-1.5 md:p-2 text-stone-500 hover:text-dayli-red hover:bg-dayli-red-light rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 md:p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-black text-stone-900">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="productForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
                  <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all font-medium" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Slug (URL friendly)</label>
                  <input required type="text" value={editForm.slug} onChange={e => setEditForm({...editForm, slug: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Monthly Price ($)</label>
                  <input required type="number" step="0.01" value={editForm.price_monthly} onChange={e => setEditForm({...editForm, price_monthly: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm font-bold" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Tagline (Short Summary)</label>
                  <input required type="text" value={editForm.tagline} onChange={e => setEditForm({...editForm, tagline: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                  <input required type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Image URL</label>
                  <input type="text" value={editForm.image_url} onChange={e => setEditForm({...editForm, image_url: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Short Description</label>
                  <textarea rows={2} value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Long Description</label>
                  <textarea rows={4} value={editForm.long_description || ''} onChange={e => setEditForm({...editForm, long_description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Benefits (comma separated)</label>
                  <input type="text" value={Array.isArray(editForm.benefits) ? editForm.benefits.join(', ') : editForm.benefits || ''} onChange={e => setEditForm({...editForm, benefits: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dayli-red focus:bg-white transition-all text-sm" />
                </div>

                <div className="flex items-center gap-3 col-span-1 md:col-span-2 mt-2 bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <input 
                    type="checkbox" 
                    id="isActiveCheck"
                    checked={editForm.is_active} 
                    onChange={e => setEditForm({...editForm, is_active: e.target.checked})}
                    className="w-5 h-5 text-dayli-red rounded border-stone-300 focus:ring-dayli-red"
                  />
                  <label htmlFor="isActiveCheck" className="font-bold text-stone-700 cursor-pointer">Product is Active (Visible on store)</label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-stone-100 shrink-0 flex justify-end gap-3 bg-stone-50 rounded-b-3xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button type="submit" form="productForm" disabled={saving} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-2">
                {saving ? 'Saving...' : <><Save size={18} /> Save Product</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
