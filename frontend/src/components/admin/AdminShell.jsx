import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  BarChart3, 
  Boxes, 
  ChevronDown, 
  ClipboardList, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Package, 
  Search, 
  Settings2, 
  ShieldCheck, 
  Users, 
  X,
  ExternalLink,
  Store,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../Navbar';

const navGroups = [
  {
    label: 'CLINICAL OPERATIONS',
    items: [
      { to: '/admin', label: 'Operations Hub', icon: LayoutDashboard, end: true },
      { to: '/admin/medicines', label: 'Dispensary Catalog', icon: Boxes },
      { to: '/admin/orders', label: 'Patient Orders', icon: ClipboardList },
      { to: '/admin/prescriptions', label: 'Review Queue', icon: FileText },
    ]
  },
  {
    label: 'PATIENT & CATALOG DIRECTORY',
    items: [
      { to: '/admin/users', label: 'Patient Accounts', icon: Users },
      { to: '/admin/categories', label: 'Therapeutic Categories', icon: Package },
      { to: '/admin/reports', label: 'Clinical Analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'SYSTEM & SETTINGS',
    items: [
      { to: '/profile', label: 'Admin Profile', icon: Settings2 },
    ]
  },
];

function AdminSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('medicines');

  const submit = (event) => {
    event.preventDefault();
    const destinations = {
      medicines: '/admin/medicines',
      orders: '/admin/orders',
      customers: '/admin/users'
    };
    navigate(`${destinations[scope]}?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 bg-sand-100/90 dark:bg-forest-900/60 rounded-2xl px-3 py-1.5 border border-sand-200 dark:border-forest-800 focus-within:border-forest-700 dark:focus-within:border-mint-500/50 w-full max-w-md transition-colors">
      <Search className="w-4 h-4 text-sand-500 dark:text-sand-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${scope}…`}
        className="w-full bg-transparent text-xs text-forest-950 dark:text-sand-100 outline-none placeholder-sand-400 dark:placeholder-forest-500 font-medium"
      />
      <select
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="text-[11px] font-bold text-forest-800 dark:text-sand-300 bg-transparent outline-none cursor-pointer pr-1"
      >
        <option value="medicines" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">Catalog</option>
        <option value="orders" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">Orders</option>
        <option value="customers" className="bg-sand-50 dark:bg-forest-900 text-forest-950 dark:text-sand-100">Patients</option>
      </select>
    </form>
  );
}

export function AdminShell({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-forest-950 flex flex-col md:flex-row text-forest-950 dark:text-sand-100 transition-colors duration-200">
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-72 bg-forest-950 text-sand-300 border-r border-forest-900 p-6 flex-shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          {/* Logo & Operational Label */}
          <div className="space-y-2">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-900 text-mint-400 flex items-center justify-center font-bold border border-forest-800 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight block">VALENCE</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-mint-400 block">
                  Operations Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <span className="text-[10px] font-black tracking-widest text-sand-500 uppercase px-3 block">
                  {group.label}
                </span>
                <div className="space-y-0.5">
                  {group.items.map(({ to, label, icon: Icon, end }) => {
                    const active = end ? location.pathname === to : location.pathname.startsWith(to);
                    return (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                          active
                            ? 'bg-forest-900 text-white shadow-xs'
                            : 'text-sand-400 hover:text-white hover:bg-forest-900/40'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-mint-400' : 'text-sand-400'}`} />
                        <span>{label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile & Storefront Link */}
        <div className="pt-6 border-t border-forest-900 space-y-4">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-sand-400 hover:text-white hover:bg-forest-900/60 transition"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-sand-400" />
              <span>Public Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <div className="p-3 rounded-2xl bg-forest-900/60 border border-forest-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-forest-800 text-mint-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{user?.name || 'Administrator'}</span>
                <span className="text-[10px] text-sand-400 block truncate">Chief Pharmacist</span>
              </div>
            </div>

            <button
              onClick={signOut}
              className="p-1.5 rounded-lg text-sand-400 hover:text-rose-400 hover:bg-forest-800 transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-30 glass-nav px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl text-forest-800 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-900 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <AdminSearch />
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-xl text-forest-800 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-forest-900 transition-colors border border-transparent hover:border-sand-200 dark:hover:border-forest-800"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-forest-700" />
              )}
            </button>

            <Link
              to="/admin/prescriptions"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ochre-50 dark:bg-ochre-950/40 border border-ochre-200 dark:border-ochre-800/60 text-ochre-900 dark:text-ochre-300 text-xs font-bold hover:bg-ochre-100 dark:hover:bg-ochre-900/40 transition shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-ochre-500 animate-pulse"></span>
              <span>Review Queue</span>
            </Link>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white p-2 rounded-xl hover:bg-sand-100 dark:hover:bg-forest-900 transition"
            >
              <Store className="w-4 h-4" />
              <span>Storefront</span>
            </Link>
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-forest-950/60 backdrop-blur-sm">
            <div className="w-72 bg-forest-950 text-sand-300 p-6 flex flex-col justify-between h-full shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-forest-900">
                  <span className="font-black text-white text-base">VALENCE Ops</span>
                  <button onClick={() => setMobileNavOpen(false)} className="p-1 text-sand-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navGroups.map((group) => (
                    <div key={group.label} className="space-y-1">
                      <span className="text-[10px] font-black tracking-widest text-sand-500 uppercase px-2">
                        {group.label}
                      </span>
                      {group.items.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                          key={to}
                          to={to}
                          end={end}
                          onClick={() => setMobileNavOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-sand-300 hover:bg-forest-900"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </nav>
              </div>

              <button
                onClick={signOut}
                className="w-full py-2.5 rounded-xl bg-forest-900 text-sand-100 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
