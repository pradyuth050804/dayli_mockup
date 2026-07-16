import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, RefreshCw, ClipboardList, LogOut, ChevronRight, Sparkles, BarChart3, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_type: string;
}

interface Subscription {
  id: string;
  status: string;
  frequency: string;
  price: number;
  next_billing_date: string;
  products?: { name: string };
}

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'subscriptions' | 'checkins' | 'addresses'>('overview');
  const [profile, setProfile] = useState<{ full_name: string; health_plan_generated: boolean; shipping_address?: string; billing_address?: string; role?: string } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }

    // FOR MOCKUP: Hardcode profile and bypass Supabase fetching errors
    setProfile({ full_name: 'Client Admin', role: 'admin' });

    // Mock orders and subscriptions to avoid errors
    setOrders([]);
    setSubscriptions([]);

  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  const tabs = [
    { id: 'overview', icon: User, label: 'Overview' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'subscriptions', icon: RefreshCw, label: 'Subscriptions' },
    { id: 'checkins', icon: ClipboardList, label: 'Check-ins' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dayli-red to-dayli-red flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-black text-2xl">
                  {(profile?.full_name || user.email)?.[0]?.toUpperCase()}
                </span>
              </div>
              <p className="text-center font-bold text-stone-900 mb-0.5">{profile?.full_name || 'My Account'}</p>
              <p className="text-center text-stone-400 text-xs truncate">{user.email}</p>
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-xs text-center font-medium">
                  Error: {errorMsg}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-3 shadow-sm border border-stone-100">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-dayli-red-light text-dayli-red-dark'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
              {profile?.role === 'admin' && (
                <div className="pt-2 mt-2 border-t border-stone-100">
                  <Link
                    to="/admin"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 transition-colors"
                  >
                    <ClipboardList size={18} />
                    Admin Dashboard
                  </Link>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-stone-100">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Package, value: orders.length, label: 'Total Orders', color: 'text-dayli-red-dark bg-dayli-red-light' },
                    { icon: RefreshCw, value: subscriptions.length, label: 'Active Subscriptions', color: 'text-dayli-red-dark bg-dayli-red-light' },
                    { icon: BarChart3, value: profile?.health_plan_generated ? '1' : '0', label: 'Health Plans', color: 'text-dayli-red-dark bg-dayli-red-light' },
                  ].map(({ icon: Icon, value, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-3xl font-black text-stone-900">{value}</div>
                      <div className="text-sm text-stone-400 mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {!profile?.health_plan_generated && (
                  <div className="bg-gradient-to-r from-dayli-red-dark to-dayli-red-dark rounded-3xl p-8 text-white">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Get Your Precision Health Plan</h3>
                        <p className="text-white/80 text-sm mb-4">Complete your biology profile and upload biomarkers to receive AI-powered personalized supplement recommendations.</p>
                        <Link to="/companion-ai" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-dayli-red-dark font-semibold rounded-full text-sm hover:bg-dayli-red-light transition-colors">
                          Start Now <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-stone-900 text-lg">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-dayli-red-dark font-medium">View all</button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package size={32} className="text-stone-200 mx-auto mb-3" />
                      <p className="text-stone-400 text-sm">No orders yet</p>
                      <Link to="/products" className="mt-3 inline-block text-dayli-red-dark text-sm font-medium">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                          <div>
                            <div className="text-sm font-semibold text-stone-900">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                            <div className="text-xs text-stone-400">{new Date(order.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-stone-900">${order.total_amount.toFixed(2)}</div>
                            <div className="text-xs px-2 py-0.5 bg-dayli-red-light text-dayli-red-dark rounded-full capitalize">{order.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-black text-stone-900 mb-6">Order History</h2>
                <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <Package size={48} className="text-stone-200 mx-auto mb-4" />
                      <p className="text-stone-500 mb-4">No orders yet</p>
                      <Link to="/products" className="px-6 py-3 bg-dayli-red-dark text-white rounded-full font-semibold text-sm">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="p-6 border border-stone-100 rounded-2xl hover:border-dayli-red-light transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-stone-900">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                              <div className="text-sm text-stone-400 mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                              <div className="text-xs text-stone-400 mt-1 capitalize">{order.order_type?.replace('_', ' ')} order</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-black text-stone-900">${order.total_amount.toFixed(2)}</div>
                              <span className="text-xs px-3 py-1 bg-dayli-red-light text-dayli-red-dark rounded-full font-medium capitalize">{order.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'subscriptions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-black text-stone-900 mb-6">Active Subscriptions</h2>
                <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-16">
                      <RefreshCw size={48} className="text-stone-200 mx-auto mb-4" />
                      <p className="text-stone-500 mb-4">No active subscriptions</p>
                      <Link to="/products" className="px-6 py-3 bg-dayli-red-dark text-white rounded-full font-semibold text-sm">Start Subscription</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map(sub => (
                        <div key={sub.id} className="p-6 border border-stone-100 rounded-2xl">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-stone-900">{sub.products?.name || 'Product'}</div>
                              <div className="text-sm text-stone-400 capitalize">{sub.frequency} · ${sub.price}/month</div>
                              {sub.next_billing_date && (
                                <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                                  <Calendar size={12} />
                                  Next billing: {new Date(sub.next_billing_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <span className="text-xs px-3 py-1.5 bg-dayli-red-light text-dayli-red-dark rounded-full font-semibold capitalize">{sub.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'checkins' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CheckinsTab userId={user.id} />
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AddressesTab userId={user.id} initialProfile={profile} />
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

interface WeeklyCheckin {
  id: string;
  user_id: string;
  week_number: number;
  energy_level: number;
  sleep_quality: number;
  mood_score: number;
  digestion_score: number;
  overall_score: number;
  notes?: string;
  created_at: string;
}

function CheckinsTab({ userId }: { userId: string }) {
  const [checkins, setCheckins] = useState<WeeklyCheckin[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ energy_level: 7, sleep_quality: 7, mood_score: 7, digestion_score: 7, overall_score: 7, notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('weekly_checkins').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data }) => data && setCheckins(data));
  }, [userId]);

  const submit = async () => {
    setLoading(true);
    const { data } = await supabase.from('weekly_checkins').insert({
      user_id: userId,
      week_number: checkins.length + 1,
      ...form,
    }).select().single();
    if (data) setCheckins(prev => [data, ...prev]);
    setShowForm(false);
    setLoading(false);
  };

  const ScoreSlider = ({ label, key: k }: { label: string; key: keyof typeof form }) => (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-stone-700 font-medium">{label}</span>
        <span className="text-dayli-red-dark font-bold">{form[k as keyof typeof form]}/10</span>
      </div>
      <input
        type="range" min="1" max="10"
        value={form[k as keyof typeof form] as number}
        onChange={e => setForm(f => ({ ...f, [k]: parseInt(e.target.value) }))}
        className="w-full accent-dayli-red-dark"
      />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-stone-900">Weekly Check-ins</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-dayli-red-dark text-white rounded-full text-sm font-semibold hover:bg-dayli-red-dark transition-colors"
        >
          + New Check-in
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm mb-6">
          <h3 className="font-bold text-stone-900 mb-6">How are you feeling this week?</h3>
          <div className="space-y-5">
            <ScoreSlider label="Energy Level" key="energy_level" />
            <ScoreSlider label="Sleep Quality" key="sleep_quality" />
            <ScoreSlider label="Mood" key="mood_score" />
            <ScoreSlider label="Digestion" key="digestion_score" />
            <ScoreSlider label="Overall Wellbeing" key="overall_score" />
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red resize-none text-sm"
                placeholder="Any observations this week..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition-colors">Cancel</button>
            <button onClick={submit} disabled={loading} className="flex-1 py-3 bg-dayli-red-dark text-white rounded-xl font-semibold hover:bg-dayli-red-dark disabled:bg-stone-300 transition-colors">
              {loading ? 'Saving...' : 'Save Check-in'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
        {checkins.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList size={48} className="text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 mb-2">No check-ins yet</p>
            <p className="text-xs text-stone-400">Track your weekly progress to see improvements over time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checkins.map((c) => (
              <div key={c.id} className="p-5 border border-stone-100 rounded-2xl hover:border-dayli-red-light transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-stone-900">Week {c.week_number}</div>
                    <div className="text-xs text-stone-400">{new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-dayli-red-dark">{c.overall_score}/10</div>
                    <div className="text-xs text-stone-400">Overall</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Energy', value: c.energy_level },
                    { label: 'Sleep', value: c.sleep_quality },
                    { label: 'Mood', value: c.mood_score },
                    { label: 'Digestion', value: c.digestion_score },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-2 bg-stone-50 rounded-xl">
                      <div className="text-lg font-black text-stone-900">{value}</div>
                      <div className="text-xs text-stone-400">{label}</div>
                    </div>
                  ))}
                </div>
                {c.notes && <p className="text-sm text-stone-500 mt-3 italic">"{c.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddressesTab({ userId, initialProfile }: { userId: string, initialProfile: any }) {
  const [shipping, setShipping] = useState(initialProfile?.shipping_address || '');
  const [billing, setBilling] = useState(initialProfile?.billing_address || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('user_profiles').update({
      shipping_address: shipping,
      billing_address: billing
    }).eq('id', userId);
    setSaving(false);
    if (!error) setMessage('Addresses saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-stone-900 mb-6">Manage Addresses</h2>
      <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-2">Shipping Address</label>
          <textarea 
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="w-full border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-dayli-red text-sm"
            rows={3}
            placeholder="123 Wellness Ave, Suite 400..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-900 mb-2">Billing Address</label>
          <textarea 
            value={billing}
            onChange={(e) => setBilling(e.target.value)}
            className="w-full border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-dayli-red text-sm"
            rows={3}
            placeholder="Same as shipping..."
          />
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-6 py-2 bg-dayli-red-dark text-white rounded-xl font-semibold hover:bg-dayli-red transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span className="text-sm font-medium text-green-600">{message}</span>}
        </div>
      </div>
    </div>
  );
}
