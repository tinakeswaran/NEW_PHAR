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
  ArrowUpRight,
  Search,
  Check,
  Star,
  Users,
  Lock,
  Pill,
  Activity,
  ThumbsUp,
  Building2,
  Stethoscope
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
        setFeaturedMedicines((medicines || []).slice(0, 8));
        setCategories(resultCategories || []);
      })
      .catch((error) => console.error('Unable to load PHARMED home data:', error))
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

  const trustIndicators = [
    'Licensed Pharmacists',
    'Genuine Medicines',
    'Prescription Validation',
    'Secure Payments',
    'Temperature-Controlled Delivery',
    'Pan-India Delivery'
  ];

  const whyChooseItems = [
    {
      icon: ShieldCheck,
      title: 'Verified Medicines',
      desc: '100% authentic, batch-tested pharmaceuticals sourced directly from certified manufacturers.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: 'Rapid express dispatch in temperature-guarded packaging across 19,000+ pincodes in India.'
    },
    {
      icon: Stethoscope,
      title: 'Expert Pharmacists',
      desc: 'Registered RPh professionals reviewing every prescription for dosage & drug interaction safety.'
    },
    {
      icon: Lock,
      title: 'Secure Platform',
      desc: 'Clinical-grade TLS encryption protecting your digital health records and prescription vault.'
    },
    {
      icon: FileText,
      title: 'Easy Prescription Upload',
      desc: 'Seamless 1-click script upload with live pharmacist approval tracking & vault storage.'
    },
    {
      icon: Building2,
      title: 'Trusted Healthcare Network',
      desc: 'India’s premier digital pharmacy serving over 100,000+ satisfied families across 500+ cities.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Senior Cardiologist, New Delhi',
      comment: 'PHARMED has simplified prescription management for my patients. Ordering authentic cardiac medications with verified batch details is seamless and trustworthy.',
      rating: 5
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Verified Patient, Mumbai',
      comment: 'Uploading my prescription took less than a minute! The pharmacist approved it quickly, and my chronic medicines arrived the next morning in perfect condition.',
      rating: 5
    },
    {
      name: 'Vikram Sengupta',
      role: 'Healthcare Consumer, Bengaluru',
      comment: 'Great discounts, realistic prices, and 100% original medicines. PHARMED is now our entire family’s default online healthcare pharmacy.',
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-sand-50 p-6 sm:p-12 lg:p-16 shadow-premium border border-forest-800">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-mint-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-700/80 text-mint-300 text-xs font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>India's Trusted Digital Pharmacy & Healthcare Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Your Trusted <br />
              <span className="editorial-title italic font-normal text-mint-300">
                Digital Pharmacy
              </span>
            </h1>

            <p className="text-sand-300 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
              Order medicines online, upload prescriptions securely, consult licensed pharmacists, and receive healthcare products delivered safely across India.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                to="/medicines"
                className="px-6 py-3.5 rounded-2xl bg-mint-500 hover:bg-mint-400 text-forest-950 font-black text-xs sm:text-sm uppercase tracking-wider transition active:scale-95 shadow-lg flex items-center gap-2"
              >
                <Pill className="w-4 h-4" />
                <span>Shop Medicines</span>
              </Link>
              <Link
                to="/prescriptions"
                className="px-6 py-3.5 rounded-2xl bg-forest-800/90 hover:bg-forest-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider border border-forest-600 transition active:scale-95 flex items-center gap-2 backdrop-blur-md"
              >
                <FileText className="w-4 h-4 text-mint-300" />
                <span>Upload Prescription</span>
              </Link>
            </div>

            {/* Hero Quick Search Input */}
            <form onSubmit={handleHeroSearch} className="max-w-xl flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-lg mt-4">
              <div className="flex-1 flex items-center px-3 gap-2">
                <Search className="w-4 h-4 text-sand-300 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medication, active compound, or ailment (e.g. Paracip, VitaCore, Diabetes)…"
                  className="w-full bg-transparent py-2 text-xs sm:text-sm text-white placeholder-sand-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-extrabold text-xs tracking-wider transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Hero Visual Status Box Right */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-forest-900/90 border border-forest-700/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-forest-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-mint-400 border border-forest-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-sand-100">PHARMED Express Dispatch</h3>
                    <p className="text-[11px] text-sand-400">Licensed Hub: PHARMED-DEL-01</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Active 24/7
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-950/60 border border-forest-800/80 text-xs">
                  <span className="flex items-center gap-2.5 text-sand-200 font-medium">
                    <Thermometer className="w-4 h-4 text-mint-400" />
                    Cold-Chain Storage Guard
                  </span>
                  <span className="font-bold text-mint-300">2°C – 8°C • Monitored</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-950/60 border border-forest-800/80 text-xs">
                  <span className="flex items-center gap-2.5 text-sand-200 font-medium">
                    <Stethoscope className="w-4 h-4 text-amber-400" />
                    RPh Script Clearance
                  </span>
                  <span className="font-bold text-sand-300">Live Pharmacists</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-950/60 border border-forest-800/80 text-xs">
                  <span className="flex items-center gap-2.5 text-sand-200 font-medium">
                    <Truck className="w-4 h-4 text-sand-300" />
                    Courier Coverage
                  </span>
                  <span className="font-bold text-sand-300">Pan-India Express</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/medicines"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sand-100 hover:bg-white text-forest-950 font-black text-xs uppercase tracking-wider transition shadow-sm"
                >
                  <span>Explore Online Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST INDICATORS SECTION */}
      <section className="bg-sand-100 dark:bg-forest-900/40 rounded-3xl border border-sand-200 dark:border-forest-800 p-6 sm:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
          {trustIndicators.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-forest-950/60 border border-sand-200/80 dark:border-forest-800/80 shadow-subtle space-y-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xs font-extrabold text-forest-950 dark:text-sand-100 leading-tight">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
              Browse Healthcare
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
              Featured Categories
            </h2>
          </div>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-emerald-400 hover:text-forest-600 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/medicines?categoryId=${cat.id}`}
              className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-forest-900/40 border border-sand-200/90 dark:border-forest-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between h-44"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-sand-400 dark:text-sand-500 tracking-wider">
                  0{index + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-sand-100 dark:bg-forest-950 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:text-forest-950 text-forest-800 dark:text-emerald-400 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-forest-950 dark:text-sand-100 text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-sand-500 dark:text-sand-400 line-clamp-1 mt-1 font-medium">
                  {cat.description || 'Essential medicines & health supplements'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. MEDICINE SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 dark:border-forest-800 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
              Popular Medicines & Products
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight mt-1">
              Medicine Showcase
            </h2>
          </div>
          <Link
            to="/medicines"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 dark:text-emerald-400 hover:text-forest-600 transition"
          >
            <span>Browse Full Catalog</span>
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

      {/* 5. WHY CHOOSE PHARMED */}
      <section className="rounded-3xl bg-forest-950 text-white p-8 sm:p-12 lg:p-16 border border-forest-800 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Enterprise Pharmacy Standard
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Why Choose PHARMED?
          </h2>
          <p className="text-xs sm:text-sm text-sand-300 font-medium leading-relaxed">
            Combining licensed pharmacist care, verified genuine medicines, and fast doorstep delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2.5xl bg-forest-900/60 border border-forest-800/90 space-y-4 hover:border-emerald-500/50 transition duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-white">{item.title}</h3>
                <p className="text-xs text-sand-300 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PATIENT & DOCTOR TESTIMONIALS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-emerald-400">
            Patient Trust & Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-sand-100 tracking-tight">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white dark:bg-forest-900/40 border border-sand-200 dark:border-forest-800 shadow-subtle flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-300 leading-relaxed italic font-medium">
                  "{t.comment}"
                </p>
              </div>
              <div className="pt-4 border-t border-sand-100 dark:border-forest-800/60">
                <h4 className="font-extrabold text-sm text-forest-950 dark:text-sand-100">{t.name}</h4>
                <p className="text-[11px] text-sand-500 dark:text-sand-400 font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed Strip */}
      <RecentlyViewed />
    </div>
  );
};
