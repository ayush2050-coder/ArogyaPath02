import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Stethoscope, 
  Users, 
  WifiOff, 
  FileText, 
  Building2, 
  Clock, 
  Languages, 
  QrCode, 
  Activity,
  HeartHandshake
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, runDemoScenario, switchPersona, t, language } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Smart India Hackathon • Team IdeaNova • Problem ID: SIH26047</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
              ArogyaPath <span className="text-emerald-600 font-hindi font-bold">आरोग्य पथ</span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl text-emerald-800 font-medium font-hindi">
              मरीज के शब्दों से लेकर डॉक्टर के परामर्श तक — एक सुरक्षित, संरचित स्वास्थ्य मार्ग।
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A conversational, offline-first clinical case-taking platform tailored for India’s rural and underserved communities. Turning unstructured patient speech into structured clinical records for physicians.
            </p>

            {/* Core Philosophy Pill */}
            <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium inline-block max-w-2xl">
              <span className="font-bold">Doctor-in-the-Loop Principle:</span> ArogyaPath does not replace doctors. It structures patient information so doctors can diagnose with speed, accuracy, and confidence.
            </div>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                id="hero-start-case-btn"
                onClick={() => setActiveView('case_taking')}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Start Case-Taking (केस शुरू करें)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-demo-walkthrough-btn"
                onClick={runDemoScenario}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center gap-2"
              >
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Run SIH Judge Demo Scenario</span>
              </button>
            </div>

            {/* Quick Demo Personas Bar */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quick Test Personas:</span>
              <button 
                onClick={() => switchPersona('patient')} 
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 font-medium transition-colors"
              >
                Ramesh (Rural Patient)
              </button>
              <button 
                onClick={() => switchPersona('health_worker')} 
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 font-medium transition-colors"
              >
                Sunita Devi (ASHA Field Worker)
              </button>
              <button 
                onClick={() => switchPersona('doctor')} 
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 font-medium transition-colors"
              >
                Dr. Anita Sharma (OPD Doctor)
              </button>
              <button 
                onClick={() => switchPersona('hospital_admin')} 
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 font-medium transition-colors"
              >
                Hospital Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Six Pillars of Healthcare Information */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              The ArogyaPath Information Architecture
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Making Healthcare Data Work for Everyone
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Complete', desc: 'Captures duration, chills, past diabetes/BP, allergies', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
              { title: 'Structured', desc: 'Chief complaints, timeline, severity score (1-10)', color: 'bg-teal-50 border-teal-200 text-teal-900' },
              { title: 'Accessible', desc: 'Voice input in Hindi/Bhojpuri, large touch buttons', color: 'bg-cyan-50 border-cyan-200 text-cyan-900' },
              { title: 'Understandable', desc: 'Clear terms for patient, clinical clarity for MD', color: 'bg-blue-50 border-blue-200 text-blue-900' },
              { title: 'Shareable', desc: 'Verifiable ABHA token, digital OPD slip & QR code', color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
              { title: 'Actionable', desc: 'Department routing, OPD queueing, clinical notes', color: 'bg-violet-50 border-violet-200 text-violet-900' },
            ].map((pillar, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${pillar.color} transition-all hover:scale-102`}>
                <div className="font-extrabold text-base mb-1">{pillar.title}</div>
                <p className="text-xs text-slate-600 leading-snug">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* End-to-End User Journey Walkthrough */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              End-to-End Workflow (Problem Statement SIH26047)
            </h2>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              From Rural Intake to Doctor Clinical Record
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              How ArogyaPath removes hours of repeated manual case-taking and queues patients seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Natural Case-Taking</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Patient or ASHA worker speaks in natural Hindi or English. Speech-to-text captures the raw unfiltered problem.
              </p>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 italic">
                "4 din se tez bukhar hai, thand lag rahi hai aur chakkar aa raha hai..."
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">AI Follow-Up & Structuring</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                AI asks 1-2 polite follow-ups, checks for diabetic history & red flags, and structures symptoms with severity.
              </p>
              <div className="p-2 rounded-lg bg-teal-50 border border-teal-100 text-[11px] text-teal-800 font-medium">
                Chief Complaint: High-grade fever with chills, body ache (Score 7/10).
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">OPD Routing & Receipt</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Non-diagnostic routing to General Medicine. Patient books slot at District Hospital and gets Digital OPD Slip with QR code.
              </p>
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-blue-800 font-mono">
                Token #14 • OPD Room 104 • AP-REG-2026-8834
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Doctor Verification & Notes</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Doctor reviews AI summary side-by-side with raw Hindi statement. Adds clinical diagnosis, advice, and next review date.
              </p>
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 font-medium">
                Dx: Acute Febrile Illness under investigation. Tests ordered.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strict AI Safety & Boundaries Callout */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-950">
                  Strict AI Safety & Clinical Governance Boundaries
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                  In compliance with Indian healthcare ethics and Smart India Hackathon guidelines, ArogyaPath operates under strict clinical boundaries:
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-950 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI does NOT issue autonomous medical diagnoses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI does NOT independently prescribe medicines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Original verbatim patient statements are 100% preserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emergency symptoms trigger 108 ambulance warning banner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grids: Field Workers, Patients, Doctors, Hospitals */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for Every Stakeholder in the Healthcare Chain
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Patients */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Patients & Families</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Explain in everyday Hindi or English without medical jargon.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Voice input with real-time speech recognition on mobile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Digital OPD slips with token numbers to eliminate long waiting queues.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>ABHA UHID integrated health history at your fingertips.</span>
                </li>
              </ul>
            </div>

            {/* For ASHA Health Workers */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">ASHA & ANM Field Workers</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>100% genuine offline case taking in remote villages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Queued drafts automatically sync when connectivity returns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Assisted registration for illiterate or elderly villagers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Forward structured cases directly to PHC/District Hospital.</span>
                </li>
              </ul>
            </div>

            {/* For Doctors */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">OPD Doctors & Specialists</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Side-by-side view: AI structured summary + raw patient statement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Cuts initial intake consultation time from 15 mins to 4 mins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Instant visibility of existing conditions, diabetes, allergies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Record clinical notes, prescriptions, and review dates seamlessly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">ArogyaPath (आरोग्य पथ)</span>
            <span>• Smart India Hackathon 2026 Project (Team IdeaNova)</span>
          </div>
          <p>
            Designed for Ayushman Bharat Digital Mission (ABDM) integration & Public Health Centers across India.
          </p>
        </div>
      </footer>
    </div>
  );
};
