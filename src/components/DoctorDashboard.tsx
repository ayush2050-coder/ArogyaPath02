import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  Users, 
  Search, 
  Save, 
  Calendar, 
  Sparkles, 
  Building2, 
  UserCheck, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { CaseRecord, Appointment } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { currentUser, t } = useApp();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [associatedCase, setAssociatedCase] = useState<CaseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Doctor Clinical Form
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [prescribedAdvice, setPrescribedAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const fetchDoctorAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data: Appointment[] = await res.json();
        setAppointments(data);
        if (data.length > 0 && !selectedApt) {
          handleSelectAppointment(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleSelectAppointment = async (apt: Appointment) => {
    setSelectedApt(apt);
    setSaveStatus('');
    // Fetch associated case
    if (apt.caseId) {
      try {
        const res = await fetch(`/api/cases/${apt.caseId}`);
        if (res.ok) {
          const caseData: CaseRecord = await res.json();
          setAssociatedCase(caseData);
          setClinicalNotes(caseData.doctorReview?.clinicalNotes || '');
          setProvisionalDiagnosis(caseData.doctorReview?.provisionalDiagnosis || '');
          setPrescribedAdvice(caseData.doctorReview?.prescribedAdvice || '');
          if (caseData.doctorReview?.followUpDate) {
            setFollowUpDate(caseData.doctorReview.followUpDate);
          }
        }
      } catch (e) {
        console.error('Failed to load case details:', e);
      }
    }
  };

  const handleSaveClinicalNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!associatedCase) return;
    setIsSaving(true);
    setSaveStatus('');

    try {
      const res = await fetch(`/api/cases/${associatedCase.id}/doctor-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: currentUser.id,
          doctorName: currentUser.name,
          clinicalNotes,
          provisionalDiagnosis,
          prescribedAdvice,
          followUpDate
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setAssociatedCase(updated);
        setSaveStatus('Clinical notes and diagnosis securely saved to medical record.');
        fetchDoctorAppointments();
        setTimeout(() => setSaveStatus(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Doctor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Clinical Workspace
            </span>
            <span className="text-xs text-slate-500 font-medium">
              OPD Room 104 • District Hospital Varanasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {currentUser.name} (MD, General Medicine)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Doctor-in-the-Loop verification portal: Review AI structured symptom records alongside raw patient statements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
            Today’s Queue: <strong className="text-slate-900">{appointments.length} Patients</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: OPD Queue (Left) & Clinical Case Review + Notes Entry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Today's Patient Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Today's OPD Queue</span>
            </h3>
            <span className="text-xs text-slate-500">Auto-prioritized</span>
          </div>

          <div className="space-y-2.5">
            {appointments.map(apt => (
              <div
                key={apt.id}
                id={`queue-apt-${apt.id}`}
                onClick={() => handleSelectAppointment(apt)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedApt?.id === apt.id 
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500/20' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                        #{apt.digitalReceipt.tokenNumber}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{apt.patientName}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {apt.patientAge}y • {apt.patientGender} • {apt.patientUhid}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      {apt.timeSlot}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-[11px] text-slate-600 mt-2 bg-white/80 p-1.5 rounded border border-slate-200/60 truncate">
                    {apt.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Side-by-side Case Verification & Clinical Notes */}
        <div className="lg:col-span-8 space-y-6">
          {selectedApt && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Active Consultation
                    </span>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      Slip: {selectedApt.opdSlipNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedApt.patientName} (Token #{selectedApt.digitalReceipt.tokenNumber})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ABHA: {selectedApt.patientUhid} • {selectedApt.patientAge} yrs • {selectedApt.patientGender}
                  </p>
                </div>

                {associatedCase?.triageLevel && (
                  <div className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 text-center">
                    Triage: {associatedCase.triageLevel} (Score {associatedCase.severityScore}/10)
                  </div>
                )}
              </div>

              {/* Side-by-Side Comparison: Raw Patient Speech vs AI Structured Summary */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Side-by-Side Clinical Verification (मरीज के मूल शब्द बनाम एआई सारांश)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Box: Patient's Raw Statement */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Patient's Original Verbatim Words (Unmodified)
                    </span>
                    <p className="text-xs text-slate-800 font-hindi italic leading-relaxed">
                      "{associatedCase?.originalStatement || selectedApt.notes || '4 दिन से बहुत तेज बुखार आ रहा है, ठंड लगकर कंपकंपी होती है और सिर दर्द है...'}"
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-200">
                      Language: Hindi / Bhojpuri • Captured by: {associatedCase?.createdByRole === 'health_worker' ? 'ASHA Field Worker' : 'Direct Patient Voice'}
                    </span>
                  </div>

                  {/* Right Box: AI Structured Clinical Summary */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      AI Structured Clinical Summary
                    </span>
                    <div className="text-xs space-y-1 text-slate-800">
                      <div>
                        <strong>Chief Complaint:</strong> {associatedCase?.chiefComplaint || 'Acute febrile illness with chills'}
                      </div>
                      <div>
                        <strong>Duration:</strong> {associatedCase?.duration || '4 days'}
                      </div>
                      <div>
                        <strong>Severity:</strong> {associatedCase?.severityScore}/10 ({associatedCase?.severityLevel})
                      </div>
                      {associatedCase?.symptoms && (
                        <div>
                          <strong>Key Symptoms:</strong> {associatedCase.symptoms.map(s => s.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Information / Vitals to check */}
              {associatedCase?.importantMissingInfo && associatedCase.importantMissingInfo.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-950 block mb-1">
                    OPD Examination Checklist (Vitals & Missing Info):
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-amber-900">
                    {associatedCase.importantMissingInfo.map((info, idx) => (
                      <span key={idx} className="bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                        ✓ {info}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor Clinical Entry Form */}
              <form onSubmit={handleSaveClinicalNotes} className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Physician’s Clinical Assessment & Prescription
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Provisional Diagnosis (By Doctor)
                    </label>
                    <input
                      type="text"
                      required
                      value={provisionalDiagnosis}
                      onChange={(e) => setProvisionalDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Febrile Illness / Malaria / Dengue Serology pending"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Follow-Up Review Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clinical Examination & Observation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="e.g. Temp 101.4 F, pulse 88/min, chest clear bilaterally, no meningeal signs. CBC and MP card test ordered."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prescription & Treatment Advice
                  </label>
                  <textarea
                    rows={2}
                    value={prescribedAdvice}
                    onChange={(e) => setPrescribedAdvice(e.target.value)}
                    placeholder="e.g. Tab Paracetamol 650mg TDS x 3 days, ORS hydration, cold sponging if temp >101. Review with CBC report."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {saveStatus && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveStatus}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    id="save-clinical-notes-btn"
                    type="submit"
                    disabled={isSaving || !provisionalDiagnosis.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Notes...' : 'Save & Complete Consultation'}</span>
                  </button>
                </div>
              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
