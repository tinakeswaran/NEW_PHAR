import React, { useState, useEffect, useRef } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  FileImage,
  ArrowRight,
  Eye
} from 'lucide-react';

export const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const fetchPrescriptions = async () => {
    try {
      const data = await prescriptionService.getUserPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a valid prescription document (JPEG, PNG, or PDF).');
      return;
    }

    setMessage('');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await prescriptionService.upload(formData);
      setMessage('Prescription document successfully deposited into the clinical review vault.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchPrescriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload prescription. Please verify the document format.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (p) => {
    switch (p.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Pharmacist Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold px-3 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Clearance Refused
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-sand-200 dark:bg-forest-800 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-forest-700 text-xs font-bold px-3 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-sand-500 dark:text-sand-400" /> Expired Script
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-ochre-50 dark:bg-ochre-950/40 text-ochre-800 dark:text-ochre-300 border border-ochre-200 dark:border-ochre-800/60 text-xs font-bold px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-ochre-600 dark:text-ochre-400 animate-spin" /> In Pharmacist Queue
          </span>
        );
    }
  };

  return (
    <div className="space-y-10 py-6 sm:py-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="border-b border-sand-200 dark:border-forest-800 pb-5">
        <span className="text-xs font-black uppercase tracking-widest text-forest-700 dark:text-mint-400">
          Clinical Document Vault
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-forest-950 dark:text-white tracking-tight mt-1">
          Prescription Verification Center
        </h1>
        <p className="text-xs sm:text-sm text-sand-500 dark:text-sand-400 font-medium mt-1">
          Deposit doctor scripts for pharmacist clearance, unlock restricted formulations, and track validation records.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5" role="alert">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-2.5" role="alert">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload Box & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form (Left Column) */}
        <div className="lg:col-span-7 bg-white dark:bg-forest-900/60 p-6 sm:p-8 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-elevated space-y-6 transition-colors">
          <h2 className="text-lg font-black text-forest-950 dark:text-white border-b border-sand-100 dark:border-forest-800 pb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-forest-700 dark:text-mint-400" />
            <span>Deposit New Script</span>
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            {/* Drag & Drop Visual Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-sand-300 dark:border-forest-700 hover:border-forest-700/60 dark:hover:border-mint-500/50 bg-sand-50/60 dark:bg-forest-950/60 rounded-3xl p-8 text-center cursor-pointer transition space-y-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-forest-800 text-forest-800 dark:text-mint-300 border border-sand-200 dark:border-forest-700 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <FileImage className="w-7 h-7 text-forest-700 dark:text-mint-400" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-forest-950 dark:text-white">
                  {file ? file.name : 'Click to select or drag and drop prescription file'}
                </p>
                <p className="text-[11px] text-sand-500 dark:text-sand-400 mt-1">
                  Supported formats: High-resolution PNG, JPG, or PDF (Max 10MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="hidden"
              />
            </div>

            {/* Selected File Chip */}
            {file && (
              <div className="p-3 rounded-2xl bg-forest-50/80 dark:bg-forest-950/60 border border-forest-200/80 dark:border-forest-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-forest-700 dark:text-mint-400 flex-shrink-0" />
                  <span className="font-bold text-forest-950 dark:text-white truncate">{file.name}</span>
                  <span className="text-sand-500 dark:text-sand-400 text-[10px]">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="p-1 rounded-full text-sand-400 hover:text-clay-600 dark:hover:text-sand-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-3.5 px-6 rounded-2xl bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 text-sand-50 dark:text-forest-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span>{loading ? 'Submitting to Review Vault…' : 'Deposit for Pharmacist Review'}</span>
              <ArrowRight className="w-4 h-4 text-mint-400 dark:text-forest-950" />
            </button>
          </form>
        </div>

        {/* Guidelines (Right Column) */}
        <div className="lg:col-span-5 bg-sand-100/70 dark:bg-forest-900/40 p-6 sm:p-8 rounded-3xl border border-sand-200 dark:border-forest-800 space-y-4">
          <div className="flex items-center gap-2 text-forest-900 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-black text-sm uppercase tracking-wider">Clinical Criteria</h3>
          </div>
          <p className="text-xs text-sand-600 dark:text-sand-400 leading-relaxed font-medium">
            To ensure swift review and regulatory compliance, your prescription document must clearly show:
          </p>
          <ul className="space-y-2.5 text-xs text-forest-900 dark:text-sand-200 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-800 dark:bg-mint-400 mt-1.5 flex-shrink-0"></span>
              <span>Practitioner full legal name, license number, and clinic stamp.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-800 dark:bg-mint-400 mt-1.5 flex-shrink-0"></span>
              <span>Patient matching name and date of prescription issuance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-800 dark:bg-mint-400 mt-1.5 flex-shrink-0"></span>
              <span>Clear compound names, specified dosage units, and course duration.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Prescription History Records */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-forest-950 dark:text-white">Active Vault Documents</h2>

        {prescriptions.length === 0 ? (
          <div className="bg-white dark:bg-forest-900/60 p-8 rounded-3xl border border-sand-200 dark:border-forest-800 text-center space-y-2">
            <FileText className="w-8 h-8 text-sand-400 dark:text-sand-500 mx-auto" />
            <p className="text-xs font-bold text-sand-500 dark:text-sand-400">No prescriptions deposited in this account yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-forest-900/60 p-5 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-forest-950 dark:text-white">Script #{p.id}</span>
                    <span className="text-[11px] text-sand-400 dark:text-sand-500 font-medium">
                      {(p.uploadedAt || p.createdAt) ? new Date(p.uploadedAt || p.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                  {getStatusBadge(p)}
                </div>

                {p.notes && (
                  <div className="p-3 rounded-2xl bg-sand-50 dark:bg-forest-950/60 border border-sand-200 dark:border-forest-800 text-xs">
                    <span className="font-bold text-forest-900 dark:text-sand-200 block text-[10px] uppercase tracking-wider">
                      Pharmacist Clinical Note:
                    </span>
                    <span className="text-sand-600 dark:text-sand-400 block mt-0.5">{p.notes}</span>
                  </div>
                )}

                {/* Covered Medicines list */}
                {p.medicines && p.medicines.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-sand-400 dark:text-sand-500 block tracking-wider">
                      Cleared Medications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.medicines.map((m) => (
                        <span
                          key={m.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800/60"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
