import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { BrandLogo } from '../components/Navbar';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const isNameValid = formData.name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPasswordValid = formData.password.length >= 6;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    try {
      await register(formData);
      alert('Registration successful! Please sign in with your clinical credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information and try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 animate-fade-in bg-sand-50 dark:bg-forest-950">
      <div className="w-full max-w-4xl bg-white dark:bg-forest-900/80 rounded-4xl border border-sand-200 dark:border-forest-800 shadow-premium overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Editorial Narrative Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-sand-100 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-forest-800">
          <div className="space-y-6 relative z-10">
            <BrandLogo />
            <div className="pt-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-mint-400 bg-forest-800/80 px-2.5 py-1 rounded-md border border-forest-700">
                Patient Enrollment
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3 leading-tight">
                Join the precision care collective.
              </h2>
              <p className="text-xs text-sand-300 mt-2.5 leading-relaxed font-normal">
                Create your verified health profile to order authentic formulations, upload doctor scripts, and receive fast home delivery.
              </p>
            </div>
          </div>

          <div className="pt-10 relative z-10 space-y-3 border-t border-forest-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-mint-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Privacy & Clinical Data Protection</span>
            </div>
            <p className="text-[11px] text-sand-400">
              Your details are maintained strictly for medication dispensing and courier transit.
            </p>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white dark:bg-forest-900/40">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-forest-950 dark:text-sand-50 tracking-tight">
              Create Patient Account
            </h1>
            <p className="text-xs text-sand-500 dark:text-sand-400 font-medium">
              Complete your patient profile to establish dispensary access.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-medium text-rose-800 dark:text-rose-300 leading-relaxed" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Full Legal Name</label>
              <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500 transition">
                <User className="w-4 h-4 text-sand-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Eleanor Vance"
                  className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder:text-sand-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Email Address</label>
                <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500 transition">
                  <Mail className="w-4 h-4 text-sand-400 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@email.com"
                    className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder:text-sand-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Phone Number</label>
                <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500 transition">
                  <Phone className="w-4 h-4 text-sand-400 mr-2 flex-shrink-0" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder:text-sand-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Account Password</label>
              <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500 transition">
                <Lock className="w-4 h-4 text-sand-400 mr-2 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder:text-sand-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-sand-400 hover:text-forest-800 dark:hover:text-sand-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Medication Delivery Address</label>
              <div className="flex items-start px-3.5 py-2 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500 transition">
                <MapPin className="w-4 h-4 text-sand-400 mr-2 mt-1 flex-shrink-0" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, apartment/suite, city, zip"
                  className="w-full bg-transparent py-1 text-xs text-forest-950 dark:text-sand-100 placeholder:text-sand-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 mt-2 ${
                isFormValid && !loading
                  ? 'bg-forest-900 hover:bg-forest-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-forest-950 shadow-md hover:shadow-lg active:scale-95 cursor-pointer focus:ring-4 focus:ring-forest-900/20 dark:focus:ring-emerald-500/30'
                  : 'bg-sand-200 dark:bg-forest-800 text-sand-500 dark:text-sand-400 border border-sand-300 dark:border-forest-700 cursor-not-allowed opacity-75'
              }`}
            >
              <span>{loading ? 'Creating Account…' : 'Establish Patient Profile'}</span>
              <ArrowRight className={`w-4 h-4 ${isFormValid && !loading ? 'text-mint-400 dark:text-forest-950' : 'text-sand-400 dark:text-sand-500'}`} />
            </button>

            {!isFormValid && (
              <p className="text-[11px] text-center text-sand-500 dark:text-sand-400 font-medium">
                Legal name, valid email, and minimum 6-character password are required.
              </p>
            )}
          </form>

          <p className="text-xs text-center text-sand-500 dark:text-sand-400 font-medium">
            Already have an active account?{' '}
            <Link to="/login" className="font-extrabold text-forest-900 dark:text-mint-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
