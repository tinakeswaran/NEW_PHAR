import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, HeartPulse, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from './Navbar';

export const Footer = () => {
  return (
    <footer className="bg-sand-100 dark:bg-forest-950 text-forest-900 dark:text-sand-300 border-t border-sand-200 dark:border-forest-900 mt-24 transition-colors">
      {/* Top Value Strip */}
      <div className="border-b border-sand-200 dark:border-forest-900/80 py-10 bg-sand-200/50 dark:bg-forest-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-forest-800 text-forest-900 dark:text-mint-400 border border-sand-300/80 dark:border-forest-700/60 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-forest-800 dark:text-mint-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-forest-950 dark:text-sand-100 tracking-wide">Board-Certified Verification</h4>
              <p className="text-xs text-forest-700 dark:text-sand-400 mt-1 leading-relaxed">
                Every prescription medication is reviewed and cleared by licensed clinical pharmacists before dispensing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-forest-800 text-forest-900 dark:text-mint-400 border border-sand-300/80 dark:border-forest-700/60 shadow-sm">
              <Lock className="w-6 h-6 text-forest-800 dark:text-mint-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-forest-950 dark:text-sand-100 tracking-wide">HIPAA-Compliant Vault</h4>
              <p className="text-xs text-forest-700 dark:text-sand-400 mt-1 leading-relaxed">
                Patient consultation data and digital prescription uploads are encrypted with clinical-grade TLS safeguards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white dark:bg-forest-800 text-forest-900 dark:text-mint-400 border border-sand-300/80 dark:border-forest-700/60 shadow-sm">
              <Award className="w-6 h-6 text-forest-800 dark:text-mint-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-forest-950 dark:text-sand-100 tracking-wide">Authentic Batch Dispensing</h4>
              <p className="text-xs text-forest-700 dark:text-sand-400 mt-1 leading-relaxed">
                Direct source chain custody ensuring genuine formulations, batch tracing, and active potency protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-5">
            <div className="inline-block bg-white dark:bg-forest-900/60 p-2.5 rounded-2xl border border-sand-200 dark:border-forest-800">
              <BrandLogo />
            </div>
            <p className="text-xs text-forest-700 dark:text-sand-400 max-w-sm leading-relaxed">
              VALENCE is a modern clinical apothecary platform dedicated to transparent medication management, verified digital prescription workflows, and direct-to-patient home delivery.
            </p>
            <div className="flex items-center gap-3 text-xs text-forest-600 dark:text-sand-400">
              <span className="flex items-center gap-1.5 font-bold text-forest-900 dark:text-mint-400">
                <HeartPulse className="w-4 h-4 text-emerald-600 dark:text-mint-400" /> Licensed Dispensary Hub
              </span>
              <span>•</span>
              <span>Available Nationwide</span>
            </div>
          </div>

          {/* Clinical Catalog */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-950 dark:text-sand-100 mb-4">Dispensary</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/medicines" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition flex items-center justify-between">
                  <span>All Formulations</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/medicines?categoryId=1" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Daily Wellness
                </Link>
              </li>
              <li>
                <Link to="/medicines?categoryId=2" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Respiratory Care
                </Link>
              </li>
              <li>
                <Link to="/medicines?categoryId=3" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Digestive Health
                </Link>
              </li>
              <li>
                <Link to="/medicines?categoryId=7" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Immunity & Nutrition
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Care */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-950 dark:text-sand-100 mb-4">Patient Care</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/prescriptions" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition flex items-center justify-between">
                  <span>Prescription Vault</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Fulfillment Status
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Patient Records
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-forest-700 dark:text-sand-400 hover:text-forest-950 dark:hover:text-mint-300 transition">
                  Order Basket
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Standards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-950 dark:text-sand-100 mb-4">Operations</h4>
            <ul className="space-y-3 text-xs text-forest-700 dark:text-sand-400">
              <li className="leading-relaxed">
                Central Clinical Fulfillment
                <span className="block text-[11px] text-forest-600 dark:text-sand-500">Facility ID: VAL-DISP-8081</span>
              </li>
              <li className="pt-2">
                <span className="block font-bold text-forest-900 dark:text-sand-200">Patient Helpline</span>
                <span className="text-[11px] text-forest-600 dark:text-sand-400">support@valencehealth.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-12 mt-12 border-t border-sand-200 dark:border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-forest-600 dark:text-sand-500">
          <p>© {new Date().getFullYear()} VALENCE Clinical Health Technologies. Formulations dispensed by registered pharmacy professionals.</p>
          <div className="flex items-center gap-6">
            <span>Prescription Aware</span>
            <span>Batch Tested</span>
            <span>Good Pharmacy Practice (GPP)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
