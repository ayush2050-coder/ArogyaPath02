import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Users, 
  WifiOff, 
  QrCode, 
  FileText,
  Play
} from 'lucide-react';

export const DemoScenarioModal: React.FC = () => {
  const { 
    isDemoModalOpen, 
    setIsDemoModalOpen, 
    switchPersona, 
    setActiveView,
    setIsOfflineMode
  } = useApp();

  const [activeStep, setActiveStep] = useState(1);

  if (!isDemoModalOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Rural Patient Intake (रोगी केस-टेकिंग)',
      badge: 'Step 1: Patient Persona',
      desc: 'Ramesh Kumar, a 48-year-old farmer from Shivpur village, has had a high fever for 4 days with severe chills. We capture his symptoms in everyday Hindi via text or voice.',
      actionLabel: 'Launch Step 1: Start Case Taking as Ramesh',
      execute: async () => {
        await switchPersona('patient');
        setActiveView('case_taking');
        setIsDemoModalOpen(false);
      }
    },
    {
      step: 2,
      title: 'AI Follow-Up & Clinical Structuring',
      badge: 'Step 2: AI Assistant',
      desc: 'The AI assistant asks gentle follow-up questions, extracts chief complaints, duration, severity score (7/10), checks diabetic history, and suggests General Medicine OPD without offering illegal autonomous diagnoses.',
      actionLabel: 'View AI Case Taking Assistant',
      execute: async () => {
        await switchPersona('patient');
        setActiveView('case_taking');
        setIsDemoModalOpen(false);
      }
    },
    {
      step: 3,
      title: 'Find Care & Generate OPD Token Slip',
      badge: 'Step 3: Hospital & Token',
      desc: 'Routes Ramesh to District Hospital Varanasi (Pandit Deen Dayal). Books an OPD slot with Dr. Anita Sharma and produces a Digital OPD Registration Slip with Token #14 and QR verification.',
      actionLabel: 'Explore Hospitals & Book Slot',
      execute: async () => {
        await switchPersona('patient');
        setActiveView('hospital_discovery');
        setIsDemoModalOpen(false);
      }
    },
    {
      step: 4,
      title: 'Doctor-in-the-Loop OPD Review',
      badge: 'Step 4: Doctor Workspace',
      desc: 'Dr. Anita Sharma opens her OPD queue. She reviews Ramesh’s AI summary side-by-side with his raw Hindi statement, records provisional diagnosis and prescribed advice.',
      actionLabel: 'Open Dr. Anita Sharma Workspace',
      execute: async () => {
        await switchPersona('doctor');
        setActiveView('doctor_dashboard');
        setIsDemoModalOpen(false);
      }
    },
    {
      step: 5,
      title: 'ASHA Field Worker Offline Capability',
      badge: 'Step 5: Offline Field Sync',
      desc: 'Sunita Devi (ASHA worker) visits remote households without internet. Drafts are safely cached in the browser and synchronized in 1-click once cellular signal is restored.',
      actionLabel: 'Open ASHA Field Worker Portal',
      execute: async () => {
        await switchPersona('health_worker');
        setActiveView('health_worker_portal');
        setIsDemoModalOpen(false);
      }
    }
  ];

  const current = steps.find(s => s.step === activeStep) || steps[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon • SIH26047</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              ArogyaPath (आरोग्य पथ) Judge Walkthrough
            </h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Interactive 5-step guided demonstration from rural patient intake to doctor verification.
            </p>
          </div>

          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-center">
          {steps.map(s => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`py-3 px-1 text-xs font-bold transition-all border-b-2 ${
                activeStep === s.step 
                  ? 'border-emerald-600 text-emerald-800 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="block text-[10px] text-slate-400 uppercase">Step {s.step}</span>
              <span className="truncate block mt-0.5">{s.badge.split(':')[1]}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {current.badge}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {current.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {current.desc}
            </p>
          </div>

          {/* Context Highlights */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
            <span className="font-bold text-slate-900 block">Why this matters to SIH Evaluators:</span>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Solves the rural patient communication barrier using local language processing.</li>
              <li>Saves critical doctor consultation time by pre-structuring clinical history.</li>
              <li>Preserves original patient statement side-by-side to guarantee clinical truthfulness.</li>
              <li>Built-in offline queuing for remote areas without reliable mobile towers.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => prev - 1)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-30"
            >
              Previous
            </button>
            <button
              disabled={activeStep === steps.length}
              onClick={() => setActiveStep(prev => prev + 1)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-30"
            >
              Next Step
            </button>
          </div>

          <button
            onClick={current.execute}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{current.actionLabel}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
