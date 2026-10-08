import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  FileCheck2, 
  FileImage, 
  FileText, 
  Search, 
  ShieldCheck, 
  XCircle,
  Clock,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { medicineService } from '../../services/medicineService';
import API from '../../services/api';
import { 
  EmptyState, 
  ErrorState, 
  LoadingState, 
  PageHeader, 
  StatusBadge, 
  formatDate 
} from '../../components/admin/AdminUI';

const queueTabs = [
  { key: 'PENDING', label: 'Awaiting Clearance' },
  { key: 'APPROVED', label: 'Approved Vault' },
  { key: 'REJECTED', label: 'Refused Scripts' },
  { key: 'EXPIRED', label: 'Expired' }
];

function useSecureDocument(fileUrl) {
  const [documentUrl, setDocumentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!fileUrl) return undefined;
    let active = true; 
    let objectUrl = '';
    setLoading(true); 
    setError(''); 
    setDocumentUrl('');

    const base = API.defaults.baseURL || '/api';
    const origin = base.startsWith('http') ? new URL(base).origin : window.location.origin;

    API.get(`${origin}${fileUrl}`, { responseType: 'blob' })
      .then((response) => {
        objectUrl = URL.createObjectURL(response.data);
        if (active) setDocumentUrl(objectUrl);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Secure preview unavailable.');
      })
      .finally(() => active && setLoading(false));

    return () => { 
      active = false; 
      if (objectUrl) URL.revokeObjectURL(objectUrl); 
    };
  }, [fileUrl]);

  return { documentUrl, loading, error };
}

function DocumentPanel({ prescription }) {
  const { documentUrl, loading, error } = useSecureDocument(prescription?.fileUrl);
  const filename = prescription?.fileUrl?.split('/').pop() || 'Prescription document';
  const isImage = /\.(jpe?g|png|gif|webp)$/i.test(filename);

  return (
    <div className="bg-sand-100/60 dark:bg-forest-950/60 rounded-3xl border border-sand-200 dark:border-forest-800 p-4 space-y-3 transition-colors">
      <div className="flex items-center justify-between text-xs text-sand-500 dark:text-sand-400 pb-2 border-b border-sand-200 dark:border-forest-800">
        <span className="font-bold flex items-center gap-1.5 text-forest-900 dark:text-sand-100">
          <FileImage className="w-4 h-4 text-forest-700 dark:text-mint-400" />
          <span>Document Vault Preview</span>
        </span>
        {documentUrl && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-forest-700 dark:text-mint-400 hover:text-forest-950 dark:hover:text-mint-300 font-bold transition"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="min-h-[280px] max-h-[380px] bg-sand-100/50 dark:bg-forest-950/80 rounded-2xl border border-sand-200 dark:border-forest-800 overflow-hidden flex items-center justify-center p-3">
        {loading ? (
          <div className="text-center space-y-2">
            <div className="w-8 h-8 rounded-full border-3 border-sand-300 dark:border-forest-700 border-t-forest-900 dark:border-t-mint-400 animate-spin mx-auto"></div>
            <p className="text-xs text-sand-500 dark:text-sand-400 font-bold">Decrypting file…</p>
          </div>
        ) : error ? (
          <div className="text-center p-6 space-y-2">
            <FileText className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto" />
            <p className="text-xs font-bold text-forest-950 dark:text-white">Preview Unavailable</p>
            <p className="text-[11px] text-sand-400 dark:text-sand-400">{error}</p>
          </div>
        ) : documentUrl ? (
          isImage ? (
            <img
              src={documentUrl}
              alt="Prescription document"
              className="max-h-80 max-w-full object-contain rounded-xl"
            />
          ) : (
            <iframe
              src={documentUrl}
              title="Prescription preview"
              className="w-full h-80 rounded-xl border-0"
            />
          )
        ) : (
          <p className="text-xs text-sand-400 dark:text-sand-500 italic">Select a prescription record from the left list.</p>
        )}
      </div>
    </div>
  );
}

export const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [medicineIds, setMedicineIds] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [rxRows, medicineRows] = await Promise.all([
        adminService.getPrescriptions(), 
        medicineService.getAllMedicines()
      ]);
      setPrescriptions(rxRows); 
      setMedicines(medicineRows);
      setSelectedId((prev) => {
        if (prev && rxRows.some((p) => p.id === prev)) return prev;
        return rxRows.find((p) => p.status === 'PENDING')?.id ?? rxRows[0]?.id ?? null;
      });
    } catch (requestError) { 
      setError(requestError.response?.data?.message || 'Prescription records could not be loaded.'); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selectedPrescription = prescriptions.find((p) => p.id === selectedId) || null;

  useEffect(() => {
    if (selectedPrescription) {
      setMedicineIds(selectedPrescription.medicines?.map((m) => m.id) || []);
      setNotes(selectedPrescription.notes || '');
      setActionError('');
    }
  }, [selectedPrescription]);

  const handleApprove = async () => {
    if (!selectedId) return;
    setSaving(true);
    setActionError('');
    try {
      await adminService.approvePrescription(selectedId, { notes, medicineIds });
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to approve prescription.');
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedId) return;
    if (!notes.trim()) {
      setActionError('Please specify pharmacist rejection notes for patient clarification.');
      return;
    }
    setSaving(true);
    setActionError('');
    try {
      await adminService.rejectPrescription(selectedId, { notes });
      await load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reject prescription.');
    } finally {
      setSaving(false);
    }
  };

  const filteredList = prescriptions.filter((p) => {
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || 
      String(p.id).includes(q) || 
      (p.user?.name || '').toLowerCase().includes(q) || 
      (p.user?.email || '').toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="PHARMACIST DESK"
        title="Prescription Review Workbench"
        subtitle="Authenticate clinical doctor scripts, verify restricted formulation eligibility, and log clearance notes."
        actions={
          <span className="text-xs font-bold text-sand-500 dark:text-sand-400">
            {prescriptions.filter((p) => p.status === 'PENDING').length} Awaiting Verification
          </span>
        }
      />

      {/* Queue Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-sand-100 dark:bg-forest-900/60 rounded-2xl border border-sand-200 dark:border-forest-800 transition-colors">
        {queueTabs.map((tab) => {
          const count = prescriptions.filter((p) => p.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-forest-900 dark:bg-forest-800 text-white shadow-xs'
                  : 'text-forest-800 dark:text-sand-300 hover:text-forest-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-forest-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 px-1.5 py-0.2 rounded-md bg-white/20">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingState label="Indexing prescription review queue…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Submissions Queue List */}
          <div className="lg:col-span-5 bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle p-5 space-y-4">
            <div className="flex items-center px-3.5 bg-sand-50/70 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800">
              <Search className="w-4 h-4 text-sand-400 dark:text-sand-400 mr-2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patient, ID, or email…"
                className="w-full bg-transparent py-2.5 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredList.length === 0 ? (
                <p className="text-xs text-sand-500 dark:text-sand-400 py-8 text-center italic">No records in this queue.</p>
              ) : (
                filteredList.map((p) => {
                  const isSelected = p.id === selectedId;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-left space-y-2 ${
                        isSelected
                          ? 'bg-forest-900 dark:bg-forest-800 text-sand-50 border-forest-800 dark:border-mint-500/50 shadow-sm'
                          : 'bg-sand-50/60 dark:bg-forest-950/60 hover:bg-sand-100/60 dark:hover:bg-forest-800/40 border-sand-200 dark:border-forest-800 text-forest-950 dark:text-sand-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">Script #{p.id}</span>
                        <StatusBadge status={p.status} />
                      </div>

                      <div className="text-xs font-medium">
                        <span className={`font-bold block ${isSelected ? 'text-white' : 'text-forest-950 dark:text-white'}`}>
                          {p.user?.name || 'Customer'}
                        </span>
                        <span className={`text-[11px] block truncate ${isSelected ? 'text-sand-300' : 'text-sand-500 dark:text-sand-400'}`}>
                          {p.user?.email}
                        </span>
                      </div>

                      <div className={`text-[10px] pt-1 border-t flex justify-between ${
                        isSelected ? 'border-forest-800 text-sand-400' : 'border-sand-200 dark:border-forest-800 text-sand-400 dark:text-sand-500'
                      }`}>
                        <span>Deposited {new Date(p.createdAt).toLocaleDateString()}</span>
                        {p.verifiedBy && <span>Verified: {p.verifiedBy}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Inspection Workbench */}
          <div className="lg:col-span-7 bg-white dark:bg-forest-900/60 rounded-3xl border border-sand-200 dark:border-forest-800 shadow-subtle p-6 sm:p-8 space-y-6">
            {selectedPrescription ? (
              <>
                <div className="flex items-center justify-between border-b border-sand-100 dark:border-forest-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-forest-700 dark:text-mint-400 bg-sand-100 dark:bg-forest-950 px-2 py-0.5 rounded-md border border-sand-200 dark:border-forest-800">
                      Reviewing Case
                    </span>
                    <h3 className="text-lg font-black text-forest-950 dark:text-white mt-1">
                      Script #{selectedPrescription.id} • {selectedPrescription.user?.name || 'Patient'}
                    </h3>
                  </div>
                  <StatusBadge status={selectedPrescription.status} />
                </div>

                {/* Document Viewer Frame */}
                <DocumentPanel prescription={selectedPrescription} />

                {actionError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-800 dark:text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Covered Formulations Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-forest-900 dark:text-sand-200 block">
                    Assign Cleared Formulations
                  </label>
                  <p className="text-[11px] text-sand-500 dark:text-sand-400">
                    Select every medication authorized by this script to permit patient purchase (Rx or quantities &gt; 100):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 bg-sand-50 dark:bg-forest-950/60 rounded-2xl border border-sand-200 dark:border-forest-800">
                    {medicines.map((med) => {
                      const isChecked = medicineIds.includes(med.id);

                      return (
                        <label
                          key={med.id}
                          className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
                            isChecked
                              ? 'bg-white dark:bg-forest-900 border-forest-600 dark:border-mint-500/60 font-bold text-forest-950 dark:text-white'
                              : 'bg-transparent border-transparent text-sand-600 dark:text-sand-400 hover:text-forest-950 dark:hover:text-sand-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) setMedicineIds([...medicineIds, med.id]);
                                else setMedicineIds(medicineIds.filter((id) => id !== med.id));
                              }}
                              className="w-4 h-4 accent-forest-900 rounded text-forest-900 flex-shrink-0"
                            />
                            <span className="truncate">{med.name}</span>
                          </div>
                          {med.requiresPrescription ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 flex-shrink-0">Rx</span>
                          ) : (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sand-200 text-sand-700 dark:bg-forest-800 dark:text-sand-300 flex-shrink-0">OTC</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Reviewer Clinical Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-forest-900 dark:text-sand-200 block">
                    Pharmacist Clinical Note / Rejection Reason
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter clearance certification remarks or specify issues preventing authorization…"
                    className="w-full bg-sand-50 dark:bg-forest-950/60 p-3 rounded-2xl border border-sand-200 dark:border-forest-800 text-xs text-forest-950 dark:text-sand-100 placeholder-sand-400 dark:placeholder-forest-500 outline-none focus:border-forest-700 dark:focus:border-mint-500/50"
                  />
                </div>

                {/* Decision Action Buttons */}
                <div className="pt-4 border-t border-sand-100 dark:border-forest-800 flex items-center justify-end gap-3">
                  <button
                    onClick={handleReject}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-full border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition disabled:opacity-50"
                  >
                    {saving ? 'Processing…' : 'Refuse Script'}
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-full bg-forest-900 dark:bg-forest-800 hover:bg-forest-800 dark:hover:bg-forest-700 text-sand-50 text-xs font-bold transition shadow-sm hover:shadow active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-mint-400" />
                    <span>{saving ? 'Authorizing…' : 'Authorize & Clear Script'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-20 text-center space-y-2">
                <FileText className="w-10 h-10 text-sand-400 dark:text-sand-500 mx-auto" />
                <p className="text-xs font-bold text-sand-500 dark:text-sand-400">Select a prescription from the queue to inspect.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
