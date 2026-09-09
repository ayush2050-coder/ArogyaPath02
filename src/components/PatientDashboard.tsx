import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  QrCode, 
  Building2, 
  Stethoscope, 
  HeartPulse, 
  AlertCircle 
} from 'lucide-react';
import { Appointment, CaseRecord } from '../types';

export const PatientDashboard: React.FC = () => {
  const { 
    currentUser, 
    patientProfile, 
    setActiveView, 
    setSelectedAppointment, 
    setActiveCase,
    t,
    language 
  } = useApp();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error(err));

    fetch('/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error(err));
  }, []);

  const handleOpenSlip = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setActiveView('digital_receipt');
  };

  const handleViewCase = (c: CaseRecord) => {
    setActiveCase(c);
    setActiveView('case_taking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Header Profile */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-600/20 shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                {patientProfile?.uhid || 'ABHA-91-4821-3942-12'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Age: {patientProfile?.age || 48} yrs • Gender: {patientProfile?.gender || 'Male'} • Village: Shivpur, Varanasi
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Allergies: Penicillin
              </span>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                History: Type 2 Diabetes
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveView('case_taking')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Case-Taking (नया केस)</span>
          </button>
          <button
            onClick={() => setActiveView('hospital_discovery')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Find Hospitals & Doctors
          </button>
        </div>
      </div>

      {/* Main Grid: Active OPD Slips & Medical Case History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active OPD Appointments & Slips */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Active OPD Slips & Tokens ({appointments.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No active appointments booked yet.
              </div>
            ) : (
              appointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Token #{apt.digitalReceipt.tokenNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{apt.opdRoom}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{apt.hospitalName}</h4>
                      <p className="text-xs text-slate-600">
                        {apt.doctorName} • <span className="font-medium text-emerald-800">{apt.department}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">{apt.date}</span>
                      <span className="text-[11px] text-slate-500 block">{apt.timeSlot}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Slip: {apt.opdSlipNumber}
                    </span>
                    <button
                      onClick={() => handleOpenSlip(apt)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>View & Print Official Slip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Case-Taking History */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Documented Medical Cases ({cases.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {cases.map(c => (
              <div
                key={c.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {c.recommendedDepartment}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{c.chiefComplaint}</h4>
                    <p className="text-xs text-slate-500">
                      Duration: {c.duration} • Severity Score: {c.severityScore}/10
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    c.status === 'doctor_reviewed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Doctor's verified notes if completed */}
                {c.doctorReview && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950">
                    <span className="font-bold block">Doctor's Diagnosis: {c.doctorReview.provisionalDiagnosis}</span>
                    <p className="text-[11px] text-emerald-900 mt-0.5">
                      Advice: {c.doctorReview.prescribedAdvice}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleViewCase(c)}
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Review Case Structure →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
