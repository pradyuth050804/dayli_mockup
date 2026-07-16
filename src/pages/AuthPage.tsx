import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Layers, ArrowRight, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let result;
    if (mode === 'signup') {
      result = await signUp(form.email, form.password, form.name);
    } else {
      result = await signIn(form.email, form.password);
    }
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dayli-red to-dayli-red-dark flex items-center justify-center shadow-lg">
                <Sun size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-stone-900 tracking-tight">
                DAYLI<span className="text-[10px] font-bold text-stone-400 tracking-wider ml-0.5">®</span>
              </span>
            </Link>
            <h1 className="text-3xl font-black text-stone-900 mb-2">
              {mode === 'signup' ? 'Start Your Journey' : 'Welcome Back'}
            </h1>
            <p className="text-stone-500">
              {mode === 'signup' ? 'Create your biology profile' : 'Sign in to your account'}
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <div className="flex mb-6 bg-stone-100 rounded-xl p-1">
              {(['signup', 'signin'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === m ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                    }`}
                >
                  {m === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your Name"
                    className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-dayli-red transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-dayli-red transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full px-4 py-3.5 pr-12 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-dayli-red transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-dayli-red-dark hover:bg-dayli-red disabled:bg-stone-300 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          <p className="text-center text-stone-500 text-sm mt-6">
            {mode === 'signup' ? 'Already have an account?' : 'New to DAYLI?'}{' '}
            <button
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-dayli-red-dark hover:text-dayli-red font-medium transition-colors"
            >
              {mode === 'signup' ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
