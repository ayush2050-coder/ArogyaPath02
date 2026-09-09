import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartPulse, 
  Globe, 
  Wifi, 
  WifiOff, 
  Bell, 
  Sparkles, 
  UserCheck, 
  Stethoscope, 
  Users, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X,
  FileText,
  CalendarCheck,
  BarChart3,
  LogIn,
  UserPlus,
  Database
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchPersona, 
    language, 
    setLanguage, 
    activeView, 
    setActiveView, 
    unreadCount, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    isOfflineMode, 
    setIsOfflineMode,
    runDemoScenario,
    reseedDatabase,
    t
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleReseed = async () => {
    setSeeding(true);
    const ok = await reseedDatabase();
    setSeeding(false);
    if (ok) {
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3500);
    }
  };

  const personas: { role: UserRole; label: string; icon: any; name: string }[] = [
    { role: 'patient', label: 'Ramesh (Patient)', icon: Users, name: 'Ramesh Kumar' },
    { role: 'doctor', label: 'Dr. Anita (Doctor)', icon: Stethoscope, name: 'Dr. Anita Sharma' },
    { role: 'health_worker', label: 'Sunita (ASHA)', icon: UserCheck, name: 'Sunita Devi' },
    { role: 'hospital_admin', label: 'Hospital Admin', icon: Building2, name: 'Dr. Vikram' },
    { role: 'admin', label: 'System Admin', icon: ShieldCheck, name: 'Rajesh Verma' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: SIH Hackathon Identity & Status */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-700/80 font-semibold text-[10px] tracking-wide uppercase">
              SIH26047 • IdeaNova
            </span>
            <span className="hidden sm:inline text-emerald-100/90">
              ArogyaPath (आरोग्य पथ) — Rural & Underserved Healthcare Case-Taking Platform
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Offline simulator toggle for hackathon demonstration */}
            <button
              id="header-toggle-offline"
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                isOfflineMode 
                  ? 'bg-amber-500/90 text-slate-950 font-bold animate-pulse' 
                  : 'bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200'
              }`}
              title="Click to toggle offline mode simulation"
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3 h-3 text-slate-950" />
                  <span>Field Offline Mode Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>Connected (Online)</span>
                </>
              )}
            </button>

            {/* Quick SIH Demo Runner */}
            <button
              id="header-run-demo-btn"
              onClick={runDemoScenario}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-semibold text-[11px] hover:bg-amber-300 transition-all shadow-xs"
            >
              <Sparkles className="w-3 h-3 fill-amber-950" />
              <span>SIH Demo Walkthrough</span>
            </button>

            {/* Quick Reseed rich practical data */}
            <button
              id="header-reseed-btn"
              onClick={handleReseed}
              disabled={seeding}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 hover:text-white font-medium text-[11px] transition-all border border-emerald-600/60 disabled:opacity-60"
              title="Reset database to rich practical clinical dummy data"
            >
              <Database className="w-3 h-3 text-emerald-300" />
              <span>{seeding ? 'Seeding...' : seedSuccess ? '✓ Seeded!' : 'Seed Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo"
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">ArogyaPath</span>
                <span className="text-emerald-700 font-hindi font-bold text-sm tracking-normal">आरोग्य पथ</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
                Patient Case Taking & OPD Coordination
              </p>
            </div>
          </div>

          {/* Navigation Links based on active persona */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-landing"
              onClick={() => setActiveView('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'landing' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              id="nav-case-taking"
              onClick={() => setActiveView('case_taking')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'case_taking' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200' 
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.navCaseTaking}</span>
            </button>

            <button
              id="nav-hospitals"
              onClick={() => setActiveView('hospital_discovery')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'hospital_discovery' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHospitals}
            </button>

            {/* Analytics & Stats */}
            <button
              id="nav-analytics"
              onClick={() => setActiveView('analytics_dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'analytics_dashboard' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200' 
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'आँकड़े एवं ग्राफ' : 'Analytics & Stats'}</span>
            </button>

            {/* Role specific shortcuts */}
            {currentUser.role === 'patient' && (
              <button
                id="nav-patient-dash"
                onClick={() => setActiveView('patient_dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  activeView === 'patient_dashboard' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{t.navAppointments}</span>
              </button>
            )}

            {currentUser.role === 'doctor' && (
              <button
                id="nav-doctor-portal"
                onClick={() => setActiveView('doctor_dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'doctor_dashboard' ? 'bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-200' : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/50'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.navDoctorPortal}</span>
              </button>
            )}

            {currentUser.role === 'health_worker' && (
              <button
                id="nav-health-worker"
                onClick={() => setActiveView('health_worker_portal')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'health_worker_portal' ? 'bg-teal-50 text-teal-700 font-semibold ring-1 ring-teal-200' : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.navHealthWorker}</span>
              </button>
            )}

            {currentUser.role === 'hospital_admin' && (
              <button
                id="nav-hospital-portal"
                onClick={() => setActiveView('hospital_portal')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'hospital_portal' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t.navHospitalPortal}</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                id="nav-admin-portal"
                onClick={() => setActiveView('admin_portal')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'admin_portal' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.navAdmin}</span>
              </button>
            )}
          </nav>

          {/* Right Actions: Persona Switcher, Language & Notifications */}
          <div className="flex items-center gap-2">
            {/* Quick Switch Persona Pill Dropdown */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase px-2">Role:</span>
              {personas.map(p => (
                <button
                  key={p.role}
                  id={`persona-btn-${p.role}`}
                  onClick={() => switchPersona(p.role)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    currentUser.role === p.role 
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.label.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Switch language between English and Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-sm text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No notifications yet</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                            n.read ? 'opacity-70 hover:bg-slate-50' : 'bg-emerald-50/50 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900">
                              {language === 'hi' ? n.titleHindi : n.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {language === 'hi' ? n.messageHindi : n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Login / Register Account Button */}
            <button
              id="nav-auth-btn"
              onClick={() => setActiveView(activeView === 'login' || activeView === 'register' ? 'landing' : 'login')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'login' || activeView === 'register'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लॉगिन / नया खाता' : 'Sign In / Register'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-2">
            <div className="flex flex-wrap gap-1 pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 w-full mb-1">Switch Active Persona:</span>
              {personas.map(p => (
                <button
                  key={p.role}
                  onClick={() => {
                    switchPersona(p.role);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    currentUser.role === p.role ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => { setActiveView('landing'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                {t.navHome}
              </button>
              <button
                onClick={() => { setActiveView('case_taking'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50"
              >
                {t.navCaseTaking}
              </button>
              <button
                onClick={() => { setActiveView('hospital_discovery'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                {t.navHospitals}
              </button>
              <button
                onClick={() => { setActiveView('patient_dashboard'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                {t.navAppointments}
              </button>
              <button
                onClick={() => { setActiveView('doctor_dashboard'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm text-blue-700 hover:bg-blue-50"
              >
                {t.navDoctorPortal}
              </button>
              <button
                onClick={() => { setActiveView('health_worker_portal'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm text-teal-700 hover:bg-teal-50"
              >
                {t.navHealthWorker}
              </button>
              <button
                onClick={() => { setActiveView('analytics_dashboard'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                {language === 'hi' ? 'विश्लेषण एवं आँकड़े' : 'Analytics & Stats'}
              </button>
              <button
                onClick={() => { setActiveView('login'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200"
              >
                {language === 'hi' ? 'लॉगिन / नया खाता' : 'Sign In / Register'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Offline Alert Bar if simulated or network lost */}
      {isOfflineMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>{t.offlineNotice}</span>
        </div>
      )}
    </header>
  );
};
