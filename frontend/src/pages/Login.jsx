import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { BrandLogo } from '../components/Navbar';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/medicines');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid clinical credentials. Please verify your email and password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-forest-900/80 rounded-4xl border border-sand-200 dark:border-forest-800 shadow-premium overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-colors">
        {/* Left Editorial Narrative Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-sand-100 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-forest-800">
          <div className="space-y-6 relative z-10">
            <BrandLogo />
            <div className="pt-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-mint-400 bg-forest-800/80 px-2.5 py-1 rounded-md border border-forest-700">
                Secure Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3 leading-tight">
                Precision care at your fingertips.
              </h2>
              <p className="text-xs text-sand-300 mt-2.5 leading-relaxed font-normal">
                Access your verified patient records, active prescription vault, and ongoing medication fulfillment.
              </p>
            </div>
          </div>

          <div className="pt-10 relative z-10 space-y-3 border-t border-forest-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-mint-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TLS 256-Bit Encrypted Healthcare Portal</span>
            </div>
            <p className="text-[11px] text-sand-400">
              Registered with Good Pharmacy Practice (GPP) compliance standards.
            </p>
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-forest-950 dark:text-white tracking-tight">
              Sign In to Patient Portal
            </h1>
            <p className="text-xs text-sand-500 dark:text-sand-400 font-medium">
              Enter your clinical credentials to access your dispensary dashboard.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-800 dark:text-rose-200 leading-relaxed" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Email Address</label>
              <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 transition">
                <Mail className="w-4 h-4 text-sand-400 dark:text-sand-400 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@pharmed.in"
                  className="w-full bg-transparent py-3 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Password</label>
              <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 transition">
                <Lock className="w-4 h-4 text-sand-400 dark:text-sand-400 mr-2 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent py-3 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-sand-400 dark:text-sand-400 hover:text-forest-800 dark:hover:text-sand-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating…' : 'Access Care Portal'}</span>
              <ArrowRight className="w-4 h-4 text-mint-400 dark:text-forest-950" />
            </button>
          </form>

          <p className="text-xs text-center text-sand-500 dark:text-sand-400 font-medium">
            New to PHARMED?{' '}
            <Link to="/register" className="font-extrabold text-forest-900 dark:text-mint-400 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
