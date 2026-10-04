import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  HeartPulse,
  Package,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    authService
      .getProfile()
      .then((profile) => {
        if (isMounted && profile) {
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            password: '',
          });
          updateUser(profile);
        }
      })
      .catch(() => {
        if (isMounted && user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            password: '',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      if (updatedUser) {
        updateUser(updatedUser);
      }
      setFormData((prev) => ({ ...prev, password: '' }));
      setMessage('Patient profile details updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 py-6 sm:py-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header Profile Identity Card */}
      <div className="bg-white dark:bg-forest-900/60 rounded-4xl p-6 sm:p-10 border border-sand-200 dark:border-forest-800 shadow-elevated flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors">
        <div className="w-20 h-20 rounded-3xl bg-forest-900 dark:bg-forest-800 text-mint-300 flex items-center justify-center font-black text-2xl uppercase border-2 border-forest-800 dark:border-forest-700 shadow-md">
          {formData.name?.charAt(0) || 'U'}
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-forest-950 dark:text-white">{formData.name || 'Patient User'}</h1>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              {isAdmin ? 'System Administrator' : 'Verified Patient'}
            </span>
          </div>
          <p className="text-xs text-sand-500 dark:text-sand-400 font-medium">{formData.email}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-sand-600 dark:text-sand-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-700 dark:text-mint-400" /> HIPAA Safeguarded
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-forest-700 dark:text-mint-400" /> Active Dispensary Account
            </span>
          </div>
        </div>

        {/* Quick Links */}
        {!isAdmin && (
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <Link
              to="/orders"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-sand-100 dark:bg-forest-800 hover:bg-sand-200 dark:hover:bg-forest-700 text-forest-900 dark:text-sand-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" /> Orders
            </Link>
            <Link
              to="/prescriptions"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-sand-100 dark:bg-forest-800 hover:bg-sand-200 dark:hover:bg-forest-700 text-forest-900 dark:text-sand-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Vault
            </Link>
          </div>
        )}
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2" role="alert">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-forest-900/60 rounded-4xl p-6 sm:p-10 border border-sand-200 dark:border-forest-800 shadow-subtle space-y-6 transition-colors">
        <h2 className="text-lg font-black text-forest-950 dark:text-white border-b border-sand-100 dark:border-forest-800 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-forest-700 dark:text-mint-400" />
          <span>Patient Contact & Destination Records</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Full Legal Name</label>
            <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 transition">
              <User className="w-4 h-4 text-sand-400 mr-2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent py-3 text-xs text-forest-950 dark:text-sand-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Email Address (Registered)</label>
            <div className="flex items-center px-3.5 bg-sand-100/70 dark:bg-forest-950/40 rounded-2xl border border-sand-200 dark:border-forest-800">
              <Mail className="w-4 h-4 text-sand-400 mr-2" />
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full bg-transparent py-3 text-xs text-sand-500 dark:text-sand-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Primary Contact Phone</label>
            <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 transition">
              <Phone className="w-4 h-4 text-sand-400 mr-2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-transparent py-3 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Update Password (Leave blank to keep current)</label>
            <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 transition">
              <Lock className="w-4 h-4 text-sand-400 mr-2" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-transparent py-3 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-forest-900 dark:text-sand-200 block">Default Medication Delivery Address</label>
          <div className="flex items-start p-3 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 transition">
            <MapPin className="w-4 h-4 text-sand-400 mr-2 mt-0.5" />
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Provide complete street address, suite/apt, city, and pincode"
              className="w-full bg-transparent text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-full bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-mint-400 dark:text-forest-950" />
            <span>{loading ? 'Saving Records…' : 'Save Patient Records'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
