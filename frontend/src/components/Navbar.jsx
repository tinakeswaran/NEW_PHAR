import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  ShoppingBag, 
  Heart,
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  FileText, 
  Compass, 
  Sparkles,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

export function BrandLogo({ compact = false, to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-3 group">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-forest-900 dark:bg-emerald-600 text-mint-400 dark:text-forest-950 shadow-md border border-forest-800 dark:border-emerald-500 transition-transform duration-300 group-hover:scale-105">
        <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l8 16 8-16" />
          <circle cx="12" cy="7" r="1.8" fill="#F59E0B" stroke="none" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black tracking-tight text-forest-950 dark:text-sand-100 text-xl leading-none flex items-center gap-1.5">
          PHARMED
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
        </span>
        {!compact && (
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-forest-700 dark:text-emerald-400 mt-0.5">
            Trusted Healthcare
          </span>
        )}
      </div>
    </Link>
  );
}

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);
  const signOut = () => {
    logout();
    close();
    navigate('/login');
  };

  const navLinks = [
    { to: '/medicines', label: 'Dispensary' },
    ...(isAuthenticated && !isAdmin
      ? [
          { to: '/wishlist', label: 'Wishlist' },
          { to: '/prescriptions', label: 'Prescription Vault' },
          { to: '/orders', label: 'Fulfillment & Orders' },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      {/* Top Clinical Strip */}
      <div className="bg-sand-100 dark:bg-forest-950 text-forest-800 dark:text-sand-300 text-[11px] py-1.5 px-4 font-medium border-b border-sand-200 dark:border-forest-900/80 hidden sm:block transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-forest-900 text-mint-300 dark:bg-forest-800 dark:text-mint-400 font-bold text-[9px] tracking-wider uppercase">
              Certified
            </span>
            <span>Temperature-controlled courier dispatch • Pharmacist-verified Indian Formulations</span>
          </div>
          <div className="flex items-center gap-4 text-forest-700 dark:text-sand-300">
            {isAdmin ? (
              <Link to="/admin" className="text-forest-900 dark:text-mint-400 font-bold hover:underline flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Operations Console
              </Link>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Dispensary Online • All India Delivery
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-sand-100/90 dark:bg-forest-900/90 p-1.5 rounded-full border border-sand-200/90 dark:border-forest-800 shadow-inner transition-colors">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950 font-bold shadow-sm'
                  : 'text-forest-800 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-forest-800/70'
              }`}
            >
              Overview
            </Link>
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950 font-bold shadow-sm'
                      : 'text-forest-800 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-forest-800/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.to === '/wishlist' && wishlistCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-forest-700 dark:text-sand-300 hover:text-forest-950 dark:hover:text-sand-100 hover:bg-sand-200/60 dark:hover:bg-forest-800/60 transition duration-200"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Clinical Midnight)'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-forest-700" />}
            </button>

            {/* Quick Search Button */}
            <Link
              to="/medicines"
              className="hidden sm:inline-flex p-2.5 rounded-full text-forest-700 dark:text-sand-300 hover:text-forest-950 dark:hover:text-sand-100 hover:bg-sand-200/60 dark:hover:bg-forest-800/60 transition duration-200"
              title="Search catalog"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Wishlist Link for Mobile/Quick Access */}
            {!isAdmin && (
              <Link
                to={isAuthenticated ? '/wishlist' : '/login'}
                className="hidden sm:inline-flex relative p-2.5 rounded-full text-forest-700 dark:text-sand-300 hover:text-forest-950 dark:hover:text-sand-100 hover:bg-sand-200/60 dark:hover:bg-forest-800/60 transition duration-200"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications */}
            {isAuthenticated && !isAdmin && (
              <Link
                to="/notifications"
                className="hidden sm:inline-flex relative p-2.5 rounded-full text-forest-700 dark:text-sand-300 hover:text-forest-950 dark:hover:text-sand-100 hover:bg-sand-200/60 dark:hover:bg-forest-800/60 transition duration-200"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </Link>
            )}

            {/* Shopping Cart Pill */}
            {!isAdmin && (
              <Link
                to={isAuthenticated ? '/cart' : '/login'}
                className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 transition duration-200 shadow-sm"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-mint-400 dark:text-forest-950 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold tracking-wider">{itemCount}</span>
              </Link>
            )}

            {/* User Profile / Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 border-l border-sand-300/80 dark:border-forest-800">
                <Link
                  to={isAdmin ? '/admin' : '/profile'}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-sand-200/60 dark:hover:bg-forest-800/60 transition duration-200 group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-forest-800 dark:bg-emerald-700 text-mint-300 dark:text-sand-100 flex items-center justify-center font-bold text-xs uppercase shadow-inner border border-forest-700 dark:border-emerald-600">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden xl:inline text-xs font-bold text-forest-900 dark:text-sand-200 group-hover:text-forest-700 dark:group-hover:text-emerald-400">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="hidden sm:inline-flex p-2 rounded-full text-forest-600 dark:text-sand-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition duration-200"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-forest-800 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-mint-500 text-forest-950 hover:bg-mint-400 transition shadow-sm hover:shadow"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl text-forest-800 dark:text-sand-300 hover:bg-sand-200/60 dark:hover:bg-forest-800/60 md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-sand-200/80 dark:border-forest-800 px-6 py-6 animate-slide-down space-y-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={close}
              className={`p-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                location.pathname === '/' ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950' : 'text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800'
              }`}
            >
              <span>Dispensary Overview</span>
              <Compass className="w-4 h-4 opacity-60" />
            </Link>
            <Link
              to="/medicines"
              onClick={close}
              className={`p-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                location.pathname.startsWith('/medicines') ? 'bg-forest-900 text-white dark:bg-emerald-600 dark:text-forest-950' : 'text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800'
              }`}
            >
              <span>Explore Formulations</span>
              <Sparkles className="w-4 h-4 opacity-60" />
            </Link>
            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/wishlist"
                  onClick={close}
                  className="p-3 rounded-xl text-sm font-bold text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>Saved Formulations</span>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                        {wishlistCount}
                      </span>
                    )}
                  </span>
                  <Heart className="w-4 h-4 opacity-60" />
                </Link>
                <Link
                  to="/prescriptions"
                  onClick={close}
                  className="p-3 rounded-xl text-sm font-bold text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800 flex items-center justify-between"
                >
                  <span>Prescription Vault</span>
                  <FileText className="w-4 h-4 opacity-60" />
                </Link>
                <Link
                  to="/orders"
                  onClick={close}
                  className="p-3 rounded-xl text-sm font-bold text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800 flex items-center justify-between"
                >
                  <span>Fulfillment & Orders</span>
                  <ShieldCheck className="w-4 h-4 opacity-60" />
                </Link>
                <Link
                  to="/profile"
                  onClick={close}
                  className="p-3 rounded-xl text-sm font-bold text-forest-800 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-forest-800 flex items-center justify-between"
                >
                  <span>Patient Profile</span>
                  <User className="w-4 h-4 opacity-60" />
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={close}
                className="p-3 rounded-xl text-sm font-bold bg-mint-500/20 text-forest-950 flex items-center justify-between"
              >
                <span>Admin Operations Cockpit</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-sand-200 dark:border-forest-800">
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="w-full py-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={close}
                  className="py-2.5 rounded-xl text-xs font-bold text-center border border-sand-300 dark:border-forest-700 text-forest-900 dark:text-sand-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={close}
                  className="py-2.5 rounded-xl text-xs font-bold text-center bg-forest-900 dark:bg-emerald-600 text-white dark:text-forest-950"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
