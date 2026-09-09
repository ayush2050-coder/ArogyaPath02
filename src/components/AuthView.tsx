import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  HeartPulse, 
  Stethoscope, 
  UserCheck, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  FileText
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register, setActiveView, language } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  
  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register states
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'patient' as UserRole,
    age: '32',
    gender: 'Male',
    bloodGroup: 'B+',
    village: 'Shivpur Rural',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221003',
    allergies: '',
    existingConditions: '',
    currentMedicines: '',
    specialty: 'General Medicine',
    qualification: 'MBBS, MD',
    hospitalName: 'District Hospital Varanasi'
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const isHindi = language === 'hi';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const res = await login(loginIdentifier, selectedRole);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || (isHindi ? 'लॉगिन असफल रहा। कृपया विवरण जांचें।' : 'Login failed. Please check your credentials.'));
    }
  };

  const handleQuickPersonaLogin = async (role: UserRole, identifier: string) => {
    setLoginLoading(true);
    setLoginError('');
    setSelectedRole(role);
    setLoginIdentifier(identifier);
    const res = await login(identifier, role);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || 'Quick login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.phone.trim()) {
      setRegError(isHindi ? 'कृपया नाम और फोन नंबर दर्ज करें।' : 'Please enter your full name and phone number.');
      return;
    }

    setRegLoading(true);
    setRegError('');
    const res = await register({
      ...regData,
      role: selectedRole
    });
    setRegLoading(false);

    if (res.success) {
      setRegSuccess(isHindi ? 'खाता सफलतापूर्वक बनाया गया! आपको डैशबोर्ड पर निर्देशित किया जा रहा है...' : 'Account created successfully! Redirecting to your dashboard...');
    } else {
      setRegError(res.error || (isHindi ? 'पंजीकरण में त्रुटि हुई।' : 'Registration failed. Please try again.'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {isHindi ? 'आयुष्मान भारत डिजिटल मिशन (ABDM) अनुपालित' : 'Ayushman Bharat Digital Mission (ABDM) Ready'}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isHindi ? 'आरोग्य पथ पोर्टल में आपका स्वागत है' : 'Welcome to ArogyaPath Gateway'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {isHindi 
              ? 'मरीजों, डॉक्टरों, आशा कार्यकर्ताओं और अस्पताल प्रशासकों के लिए सुरक्षित, एकीकृत स्वास्थ्य सेवा पहुंच।' 
              : 'Secure, unified digital healthcare access for patients, clinical officers, ASHA frontline workers, and hospital administrators.'}
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          {/* Top Toggle Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => { setMode('login'); setLoginError(''); setRegError(''); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                mode === 'login' 
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {isHindi ? 'लॉगिन करें (Sign In)' : 'Sign In / Log In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setLoginError(''); setRegError(''); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                mode === 'register' 
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {isHindi ? 'नया खाता बनाएं (Create Account)' : 'Create New Account'}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Role Switcher Pill Bar */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {isHindi ? 'अपनी भूमिका चुनें (Select Role)' : 'Select Your Role'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { role: 'patient' as UserRole, labelEn: 'Patient', labelHi: 'मरीज (Patient)', icon: User },
                  { role: 'doctor' as UserRole, labelEn: 'Doctor', labelHi: 'डॉक्टर (Doctor)', icon: Stethoscope },
                  { role: 'health_worker' as UserRole, labelEn: 'ASHA Worker', labelHi: 'आशा कार्यकर्ता', icon: HeartPulse },
                  { role: 'hospital_admin' as UserRole, labelEn: 'Hospital', labelHi: 'अस्पताल', icon: Building2 },
                  { role: 'admin' as UserRole, labelEn: 'District Admin', labelHi: 'प्रशासक', icon: UserCheck }
                ].map(r => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r.role);
                        setRegData(prev => ({ ...prev, role: r.role }));
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span>{isHindi ? r.labelHi : r.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <div>
                {loginError && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {isHindi ? 'ईमेल, फोन नंबर या ABHA नंबर' : 'Phone Number, Email, or ABHA Health ID'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={
                          selectedRole === 'patient' 
                            ? '+91 98765 43210 or ABHA-91-4821...' 
                            : selectedRole === 'doctor' 
                            ? 'anita.sharma@arogyapath.org or +91 94152 11223'
                            : 'Enter phone or email'
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm transition-all"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {isHindi 
                        ? 'त्वरित टेस्ट के लिए नीचे दिए गए डेमो प्रोफाइल पर क्लिक करें।' 
                        : 'Tip: You can also use the one-click demo logins below to inspect each role.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                      {loginLoading ? (
                        <span>{isHindi ? 'सत्यापित हो रहा है...' : 'Authenticating...'}</span>
                      ) : (
                        <>
                          <span>{isHindi ? 'डैशबोर्ड में प्रवेश करें' : 'Sign In to Dashboard'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Instant Fast Demo Logins Section */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {isHindi ? 'त्वरित डेमो परीक्षण लॉगिन (1-क्लिक)' : 'Instant 1-Click Practical Demo Logins'}
                    </h3>
                    <span className="text-xs text-emerald-700 font-medium">Ready-to-use personas</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin('patient', 'ramesh.kumar@arogyapath.org')}
                      className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        RK
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          Ramesh Kumar
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">Patient</span>
                        </div>
                        <p className="text-xs text-slate-500">Diabetic with Fever • Shivpur, Varanasi</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin('doctor', 'anita.sharma@arogyapath.org')}
                      className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        AS
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          Dr. Anita Sharma
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-medium">Doctor</span>
                        </div>
                        <p className="text-xs text-slate-500">MD General Medicine • District Hospital</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin('health_worker', 'sunita.asha@arogyapath.org')}
                      className="text-left p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        SD
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          Sunita Devi
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-medium">ASHA Worker</span>
                        </div>
                        <p className="text-xs text-slate-500">Offline Field Sync & Triage • Shivpur</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaLogin('hospital_admin', 'admin.dhv@arogyapath.org')}
                      className="text-left p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition-all flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        VM
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          Dr. Vikram Malhotra
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-800 font-medium">Hospital Admin</span>
                        </div>
                        <p className="text-xs text-slate-500">Pt. Deen Dayal District Hospital OPD</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <div>
                {regError && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isHindi ? 'पूरा नाम *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={regData.name}
                          onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                          placeholder="e.g. Suresh Chandra"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isHindi ? 'मोबाइल नंबर *' : 'Mobile Number (10-Digit) *'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={regData.phone}
                          onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                          placeholder="+91 98765 00000"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isHindi ? 'ईमेल पता' : 'Email Address (Optional)'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          placeholder="user@example.com"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isHindi ? 'गांव / क्षेत्र / पता' : 'Village / Sector / Address'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={regData.village}
                          onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                          placeholder="e.g. Cholapur Sector 3, Varanasi"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Patient Specific Fields */}
                  {selectedRole === 'patient' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                        <HeartPulse className="w-4 h-4 text-emerald-600" />
                        {isHindi ? 'स्वास्थ्य प्रोफ़ाइल एवं ABHA विवरण' : 'Patient Health Profile & Auto-Generated ABHA'}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">{isHindi ? 'उम्र (वर्ष)' : 'Age (Years)'}</label>
                          <input
                            type="number"
                            value={regData.age}
                            onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">{isHindi ? 'लिंग' : 'Gender'}</label>
                          <select
                            value={regData.gender}
                            onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">{isHindi ? 'रक्त समूह' : 'Blood Group'}</label>
                          <select
                            value={regData.bloodGroup}
                            onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>O+</option>
                            <option>O-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            {isHindi ? 'मौजूदा बीमारियाँ (यदि कोई हो)' : 'Pre-existing Conditions'}
                          </label>
                          <input
                            type="text"
                            value={regData.existingConditions}
                            onChange={(e) => setRegData({ ...regData, existingConditions: e.target.value })}
                            placeholder="e.g. Hypertension, Diabetes, Asthma"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            {isHindi ? 'दवाइयों से एलर्जी' : 'Known Drug Allergies'}
                          </label>
                          <input
                            type="text"
                            value={regData.allergies}
                            onChange={(e) => setRegData({ ...regData, allergies: e.target.value })}
                            placeholder="e.g. Penicillin, Sulfa"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Doctor Specific Fields */}
                  {selectedRole === 'doctor' && (
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wide">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        {isHindi ? 'चिकित्सक विवरण एवं विशेषज्ञता' : 'Clinical Credentials & Specialization'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">{isHindi ? 'विशेषज्ञता' : 'Specialty'}</label>
                          <input
                            type="text"
                            value={regData.specialty}
                            onChange={(e) => setRegData({ ...regData, specialty: e.target.value })}
                            placeholder="e.g. General Medicine, Pediatrics"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-700 mb-1">{isHindi ? 'योग्यता' : 'Qualification'}</label>
                          <input
                            type="text"
                            value={regData.qualification}
                            onChange={(e) => setRegData({ ...regData, qualification: e.target.value })}
                            placeholder="e.g. MBBS, MD, MS"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                      {regLoading ? (
                        <span>{isHindi ? 'खाता बनाया जा रहा है...' : 'Registering Account...'}</span>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>
                            {isHindi ? 'खाता बनाएं एवं डैशबोर्ड खोलें' : 'Create Account & Open Dashboard'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ABDM Security Footer Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-200/80 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Government of India Digital Health Standards</span>
          </div>
          <div>
            ISO 27001 Certified • End-to-End Encrypted Health Records
          </div>
        </div>

      </div>
    </div>
  );
};
