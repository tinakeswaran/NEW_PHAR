import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Award, 
  HeartPulse, 
  Thermometer, 
  Layers, 
  Compass, 
  ArrowUpRight,
  Search,
  Check
} from 'lucide-react';
import { medicineService } from '../services/medicineService';
import { MedicineCard } from '../components/MedicineCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([medicineService.getAllMedicines(), medicineService.getCategories()])
      .then(([medicines, resultCategories]) => {
        if (!active) return;
        setFeaturedMedicines((medicines || []).slice(0, 4));
        setCategories(resultCategories || []);
      })
      .catch((error) => console.error('Unable to load VALENCE home data:', error))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/medicines');
    }
  };

  return (
    <div className="space-y-24 py-6 sm:py-10 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-sand-50 p-8 sm:p-14 lg:p-20 shadow-premium border border-forest-800">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-ochre-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-800/80 border border-forest-700/60 text-mint-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>VALENCE Precision Indian Clinical Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Precision Care, <br />
              <span className="editorial-title italic font-normal text-mint-300">
                Thoughtfully Dispensed.
              </span>
            </h1>

            <p className="text-sand-300 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
              Experience modern Indian apothecary healthcare. Access authentic formulations, verify digital prescriptions with registered pharmacists, enjoy transparent ₹ pricing, and receive climate-guarded home delivery across India.
            </p>

            {/* Quick Hero Search Input */}
            <form onSubmit={handleHeroSearch} className="max-w-xl flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-lg">
              <div className="flex-1 flex items-center px-3 gap-2">
                <Search className="w-4 h-4 text-sand-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medication, active compound, or ailment (e.g. Paracip, Diabetes, Allergy)…"
                  className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-white placeholder-sand-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-mint-500 hover:bg-mint-400 text-forest-950 font-extrabold text-xs tracking-wider transition active:scale-95 shadow-md"
              >
                Search
              </button>
            </form>

            {/* Micro Assurances */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-sand-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-mint-400" />
                <span>Doctor Prescription Validation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-mint-400" />
                <span>Registered Pharmacists (RPh)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-mint-400" />
                <span>Cold-Chain Custody & ₹ Pricing</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Panel */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-forest-900/90 border border-forest-700/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-forest-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-mint-400 border border-forest-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-sand-100">Dispensary Status</h3>
                    <p className="text-[11px] text-sand-400">Hub: VAL-CENTRAL-BLR</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Status checklist items */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-950/60 border border-forest-800/80 text-xs">
                  <span className="flex items-center gap-2.5 text-sand-200">
                    <Thermometer className="w-4 h-4 text-mint-400" />
                    Storage Climate Guard
                  </span>
                  <span className="font-bold text-mint-300">4.2°C • Optimal</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-950/60 border border-forest-800/80 text-xs">
                  <span className="flex items-center gap-2.5 text-sand-200">
                    <Award className="w-4 h-4 text-ochre-400" />
                    Pharmacist Verification
                  </span>
                  <span className="font-bold text-sand-300">Online & Reviewing</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-950/60 border border-forest-800/80 text-xs">
                  <span className="flex items-center gap-2.5 text-sand-200">
                    <Truck className="w-4 h-4 text-sand-300" />
                    Pan-India Courier Network
                  </span>
                  <span className="font-bold text-sand-300">Fast-Track Active</span>
                </div>
              </div>

              {/* Action Link inside card */}
              <div className="pt-2">
                <Link
                  to={isAdmin ? '/admin' : '/medicines'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sand-100 hover:bg-white text-forest-950 font-black text-xs uppercase tracking-wider transition shadow-sm"
                >
                  <span>{isAdmin ? 'Open Admin Console' : 'Explore Clinical Dispensary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clinical Pillars / Category Navigator */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
              Formulation Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
              Curated Therapeutic Spectrum
            </h2>
          </div>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-emerald-400 hover:text-forest-600 transition"
          >
            <span>View Full Pharmacopeia</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/medicines?categoryId=${cat.id}`}
              className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-forest-900/40 border border-sand-200/90 dark:border-forest-800 hover:border-forest-300 dark:hover:border-emerald-500 shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between h-44"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-sand-400 dark:text-sand-500 tracking-wider">
                  0{index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-sand-100 dark:bg-forest-950 group-hover:bg-forest-900 dark:group-hover:bg-emerald-600 group-hover:text-sand-50 dark:group-hover:text-forest-950 text-forest-800 dark:text-emerald-400 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-base group-hover:text-forest-700 dark:group-hover:text-emerald-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-sand-500 dark:text-sand-400 line-clamp-1 mt-1 font-medium">
                  {cat.description || 'Clinical medications & supplements'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
              Essential Dispensary
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
              Featured Formulations
            </h2>
          </div>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-emerald-400 hover:text-forest-600 transition"
          >
            <span>Browse All ({featuredMedicines.length > 0 ? '21+ Formulations' : 'Catalog'})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-sand-200/50 dark:bg-forest-900/50 shimmer"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMedicines.map((med) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Three-Step Prescription Protocol */}
      <section className="rounded-3xl bg-sand-100/70 dark:bg-forest-900/30 border border-sand-200 dark:border-forest-800 p-8 sm:p-12 lg:p-16">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
            Fulfillment Integrity
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight">
            How The VALENCE Protocol Works
          </h2>
          <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-400 font-medium">
            Seamless integration between clinical validation, verified ₹ pricing, and reliable pan-India courier delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white dark:bg-forest-900/60 p-7 rounded-2.5xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-emerald-600 text-mint-400 dark:text-forest-950 flex items-center justify-center font-black text-base">
              01
            </div>
            <h3 className="font-extrabold text-base text-forest-950 dark:text-sand-100">Select Your Medication</h3>
            <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed font-medium">
              Browse our verified dispensary catalog. For medications requiring authorization, the system immediately tags and protects your dosage.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-forest-900/60 p-7 rounded-2.5xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-emerald-600 text-mint-400 dark:text-forest-950 flex items-center justify-center font-black text-base">
              02
            </div>
            <h3 className="font-extrabold text-base text-forest-950 dark:text-sand-100">Pharmacist Rx Clearance</h3>
            <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed font-medium">
              Upload doctor scripts directly to our encrypted vault. Licensed clinical pharmacists review, authenticate, and clear the order safely.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-forest-900/60 p-7 rounded-2.5xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-emerald-600 text-mint-400 dark:text-forest-950 flex items-center justify-center font-black text-base">
              03
            </div>
            <h3 className="font-extrabold text-base text-forest-950 dark:text-sand-100">Climate-Guarded Delivery</h3>
            <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed font-medium">
              Formulations are packed in tamper-evident, temperature-guarded courier packages and tracked in real-time right to your doorstep.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/prescriptions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs tracking-wider transition shadow-sm hover:shadow"
          >
            <FileText className="w-4 h-4" />
            <span>Open Prescription Vault</span>
          </Link>
        </div>
      </section>

      {/* Recently Viewed Strip */}
      <RecentlyViewed />
    </div>
  );
};
