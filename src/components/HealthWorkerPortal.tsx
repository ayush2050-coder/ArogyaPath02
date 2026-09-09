import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Plus, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Phone, 
  MapPin, 
  HeartPulse, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const HealthWorkerPortal: React.FC = () => {
  const { 
    currentUser, 
    isOfflineMode, 
    setIsOfflineMode, 
    offlineDrafts, 
    syncOfflineDrafts, 
    setActiveView, 
    setActiveCase, 
    refreshData,
    t,
    language 
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');

  // Register New Villager state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Female');
  const [newPhone, setNewPhone] = useState('');
  const [newVillage, setNewVillage] = useState('Shivpur, Varanasi');

  // Village patient roster
  const [villagePatients, setVillagePatients] = useState([
    {
      id: 'pat_1',
      name: 'Ramesh Kumar (रमेश कुमार)',
      age: 48,
      gender: 'Male',
      phone: '+91 98765 43210',
      uhid: 'ABHA-91-4821-3942-12',
      village: 'Shivpur, Varanasi',
      lastVisit: 'Yesterday'
    },
    {
      id: 'pat_2',
      name: 'Shanti Devi (शांति देवी)',
      age: 62,
      gender: 'Female',
      phone: '+91 98765 11223',
      uhid: 'ABHA-91-3319-8711-45',
      village: 'Shivpur, Varanasi',
      lastVisit: '3 weeks ago'
    },
    {
      id: 'pat_3',
      name: 'Babu Lal (बाबू लाल)',
      age: 35,
      gender: 'Male',
      phone: '+91 98765 99887',
      uhid: 'ABHA-91-7721-0092-88',
      village: 'Shivpur, Varanasi',
      lastVisit: '1 month ago'
    }
  ]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncFeedback('');
    try {
      const count = await syncOfflineDrafts();
      setSyncFeedback(`Successfully synchronized ${count} case draft(s) with Central Health Registry!`);
      setTimeout(() => setSyncFeedback(''), 5000);
    } catch (e) {
      console.error(e);
      setSyncFeedback('Sync failed. Please check network connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPat = {
      id: `pat_${Date.now()}`,
      name: newName,
      age: parseInt(newAge, 10) || 30,
      gender: newGender,
      phone: newPhone || '+91 98765 00000',
      uhid: `ABHA-91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-01`,
      village: newVillage,
      lastVisit: 'Just now'
    };

    setVillagePatients([newPat, ...villagePatients]);
    setShowAddPatientModal(false);
    setNewName('');
    setNewAge('');
    setNewPhone('');

    // Immediately start assisted case taking
    setActiveView('case_taking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              ASHA Community Field Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Village: Shivpur • Block: Harahua • Dist: Varanasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {currentUser.name} (Accredited Social Health Activist)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Assisted clinical intake for rural villagers with genuine offline capability and queued sync.
          </p>
        </div>

        {/* Offline Toggle & Sync Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isOfflineMode 
                ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/20' 
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-4 h-4 text-amber-800" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            <span>{isOfflineMode ? 'Simulated Field Offline' : 'Online'}</span>
          </button>

          <button
            id="sync-drafts-btn"
            onClick={handleSync}
            disabled={isSyncing || offlineDrafts.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync ({offlineDrafts.length} Local Drafts)</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Offline Drafts Alert Section if any */}
      {offlineDrafts.length > 0 && (
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <WifiOff className="w-4 h-4 text-amber-700" />
              <span>Unsynced Field Case Drafts Stored on this Device ({offlineDrafts.length})</span>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">Safe in Local Storage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {offlineDrafts.map((d, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">{d.patientName}</span>
                <p className="text-slate-600 truncate">{d.chiefComplaint}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Saved: {new Date(d.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Village Patients Roster & Field Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Registered Villagers in Assigned Beat */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Assigned Village Household Registry ({villagePatients.length})</span>
            </h3>

            <button
              onClick={() => setShowAddPatientModal(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Villager</span>
            </button>
          </div>

          <div className="space-y-3">
            {villagePatients.map(patient => (
              <div
                key={patient.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{patient.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {patient.age} yrs • {patient.gender} • UHID: <span className="font-mono text-slate-700">{patient.uhid}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{patient.village} • Last interaction: {patient.lastVisit}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveView('case_taking');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Start Assisted Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: ASHA Guidelines & Quick Helpline */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>ASHA Intake Protocol Checklist</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">1.</span>
                <span>Encourage patient to speak in their mother tongue (Bhojpuri / Hindi).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">2.</span>
                <span>Verify existing diabetes, hypertension, or past surgeries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">3.</span>
                <span>Check for emergency warning signs (chest pain, severe breathlessness).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">4.</span>
                <span>If internet is down, draft is stored locally; sync before evening debrief.</span>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Emergency Contacts:</span>
              <p>Ambulance Service: <strong className="text-rose-600">108</strong></p>
              <p>District Hospital Varanasi: <strong className="text-slate-900">0542-2508101</strong></p>
              <p>Harahua CHC Medical Officer: <strong className="text-slate-900">+91 94152 88401</strong></p>
            </div>
          </div>
        </div>

      </div>

      {/* Add New Villager Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Register New Rural Patient</h3>
            
            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name (with Hindi if preferred)</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Geeta Devi (गीता देवी)"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number (or Family Contact)</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 XXXXX"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Village / Mohalla</label>
                <input
                  type="text"
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Save & Start Case Taking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
