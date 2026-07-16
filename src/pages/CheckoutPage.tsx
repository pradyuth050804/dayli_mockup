import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Lock, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  const shipping = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const orderData = {
        user_id: user?.id || null,
        guest_email: user ? null : form.email,
        status: 'confirmed',
        total_amount: total,
        subtotal: subtotal,
        shipping_amount: shipping,
        payment_status: 'paid',
        shipping_name: form.name,
        shipping_address: { address: form.address, city: form.city, state: form.state, zip: form.zip, country: form.country },
        order_type: items.some(i => i.type === 'subscription') ? 'subscription' : 'one_time',
      };

      const { data: order } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (order) {
        await supabase.from('order_items').insert(
          items.map(item => ({
            order_id: order.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: item.type === 'subscription' ? item.product.price_subscription * (item.subscription_months || 3) : item.product.price_one_time,
            total_price: (item.type === 'subscription' ? item.product.price_subscription * (item.subscription_months || 3) : item.product.price_one_time) * item.quantity,
          }))
        );
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-4">Your cart is empty.</p>
          <Link to="/products" className="px-6 py-3 bg-dayli-red-dark text-white rounded-full font-semibold">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">

        <h1 className="text-4xl font-black text-stone-900 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <h2 className="font-bold text-stone-900 text-xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <Truck size={20} className="text-dayli-red-dark" />
                <h2 className="font-bold text-stone-900 text-xl">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Street Address</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red transition-colors"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">City</label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red transition-colors"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">State</label>
                    <input
                      required
                      type="text"
                      value={form.state}
                      onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red transition-colors"
                      placeholder="MH"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">PIN Code</label>
                    <input
                      required
                      type="text"
                      value={form.zip}
                      onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red transition-colors"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-6">
                <Lock size={20} className="text-dayli-red-dark" />
                <h2 className="font-bold text-stone-900 text-xl">Payment</h2>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl text-center text-stone-400 text-sm border border-dashed border-stone-200">
                Payment gateway integration ready (Stripe / Razorpay)
              </div>
            </div>

            {!user && (
              <div className="bg-dayli-red-light border border-dayli-red-light rounded-2xl p-5 flex items-start gap-3">
                <Check size={18} className="text-dayli-red-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-dayli-red-dark">Create an account (optional)</p>
                  <p className="text-xs text-dayli-red-dark mt-1">
                    <Link to="/auth" className="underline">Sign up</Link> to track your order, manage subscriptions, and access Companion AI.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-dayli-red-dark hover:bg-dayli-red-dark disabled:bg-stone-300 text-white font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-dayli-red-dark/20"
            >
              {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 sticky top-28">
              <h2 className="font-bold text-stone-900 text-lg mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => {
                  const price = item.type === 'subscription'
                    ? item.product.price_subscription * (item.subscription_months || 3)
                    : item.product.price_one_time;
                  return (
                    <div key={`${item.product.id}-${item.type}`} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dayli-red-light to-dayli-red-light flex items-center justify-center flex-shrink-0 text-xs font-black text-dayli-red-dark">
                        D1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-stone-900">{item.product.name}</p>
                        <p className="text-xs text-stone-400 capitalize">{item.type} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">${(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-dayli-red-dark">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-lg pt-3 border-t border-stone-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
