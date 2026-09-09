import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  PatientProfile, 
  Hospital, 
  Doctor, 
  CaseRecord, 
  Appointment, 
  AppNotification, 
  UserRole,
  AppLanguage 
} from '../types';
import { translations } from '../utils/i18n';

export type ActiveView = 
  | 'landing'
  | 'login'
  | 'register'
  | 'analytics_dashboard'
  | 'patient_dashboard'
  | 'case_taking'
  | 'hospital_discovery'
  | 'appointment_booking'
  | 'digital_receipt'
  | 'doctor_dashboard'
  | 'health_worker_portal'
  | 'hospital_portal'
  | 'admin_portal';

interface AppContextType {
  currentUser: User;
  patientProfile: PatientProfile | null;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: typeof translations.en;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  hospitals: Hospital[];
  doctors: Doctor[];
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  switchPersona: (role: UserRole, userId?: string) => Promise<void>;
  login: (identifier: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  reseedDatabase: () => Promise<boolean>;
  activeCase: CaseRecord | null;
  setActiveCase: (c: CaseRecord | null) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (a: Appointment | null) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (d: Doctor | null) => void;
  selectedHospitalForBooking: Hospital | null;
  setSelectedHospitalForBooking: (h: Hospital | null) => void;
  
  // Offline capabilities
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  offlineDrafts: CaseRecord[];
  saveOfflineDraft: (c: CaseRecord) => void;
  syncOfflineDrafts: () => Promise<number>;
  
  refreshData: () => Promise<void>;
  runDemoScenario: () => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
}

const defaultUser: User = {
  id: 'usr_pat_1',
  name: 'Ramesh Kumar',
  email: 'ramesh.kumar@arogyapath.org',
  phone: '+91 98765 43210',
  role: 'patient',
  languagePreference: 'hi',
  assignedVillage: 'Shivpur, Varanasi'
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [language, setLanguage] = useState<AppLanguage>('hi');
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const [activeCase, setActiveCase] = useState<CaseRecord | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [selectedHospitalForBooking, setSelectedHospitalForBooking] = useState<Hospital | null>(null);
  
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [offlineDrafts, setOfflineDrafts] = useState<CaseRecord[]>(() => {
    try {
      const stored = localStorage.getItem('arogya_offline_drafts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const t = translations[language] || translations.en;

  const refreshData = async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.currentUser);
        setPatientProfile(data.userPatientProfile);
        setHospitals(data.hospitals || []);
        setDoctors(data.doctors || []);
        setUnreadCount(data.unreadNotificationsCount || 0);
      }

      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const notifs = await notifRes.json();
        setNotifications(notifs);
      }
    } catch (err) {
      console.warn('Network offline or backend initializing:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const switchPersona = async (role: UserRole, userId?: string) => {
    try {
      const res = await fetch('/api/auth/switch-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, userId })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.currentUser);
        setPatientProfile(data.userPatientProfile);
        
        // Auto-navigate to appropriate persona workspace
        if (role === 'patient') setActiveView('patient_dashboard');
        else if (role === 'doctor') setActiveView('doctor_dashboard');
        else if (role === 'health_worker') setActiveView('health_worker_portal');
        else if (role === 'hospital_admin') setActiveView('hospital_portal');
        else if (role === 'admin') setActiveView('admin_portal');
        
        refreshData();
      }
    } catch (err) {
      console.error('Error switching persona:', err);
    }
  };

  const login = async (identifier: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, role })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setPatientProfile(data.userPatientProfile || null);
        
        // Auto-route to the appropriate dashboard
        const userRole = data.user.role as UserRole;
        if (userRole === 'patient') setActiveView('patient_dashboard');
        else if (userRole === 'doctor') setActiveView('doctor_dashboard');
        else if (userRole === 'health_worker') setActiveView('health_worker_portal');
        else if (userRole === 'hospital_admin') setActiveView('hospital_portal');
        else if (userRole === 'admin') setActiveView('admin_portal');
        
        refreshData();
        return { success: true };
      }
      return { success: false, error: 'Login failed. Please check your credentials.' };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setPatientProfile(data.userPatientProfile || null);
        
        const userRole = data.user.role as UserRole;
        if (userRole === 'patient') setActiveView('patient_dashboard');
        else if (userRole === 'doctor') setActiveView('doctor_dashboard');
        else if (userRole === 'health_worker') setActiveView('health_worker_portal');
        else if (userRole === 'hospital_admin') setActiveView('hospital_portal');
        else if (userRole === 'admin') setActiveView('admin_portal');
        
        refreshData();
        return { success: true };
      }
      return { success: false, error: 'Registration failed. Please check details.' };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const logout = () => {
    // Switch to landing page or prompt login
    setActiveView('landing');
  };

  const reseedDatabase = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/seed-rich-data', { method: 'POST' });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Reseed error:', e);
      return false;
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const saveOfflineDraft = (c: CaseRecord) => {
    const drafts = [c, ...offlineDrafts.filter(d => d.id !== c.id)];
    setOfflineDrafts(drafts);
    try {
      localStorage.setItem('arogya_offline_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error('Could not save draft locally:', e);
    }
  };

  const syncOfflineDrafts = async (): Promise<number> => {
    if (offlineDrafts.length === 0) return 0;
    try {
      const res = await fetch('/api/cases/sync-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: offlineDrafts })
      });
      if (res.ok) {
        const data = await res.json();
        setOfflineDrafts([]);
        localStorage.removeItem('arogya_offline_drafts');
        refreshData();
        return data.syncedCount || 0;
      }
    } catch (err) {
      console.error('Failed to sync drafts:', err);
    }
    return 0;
  };

  const runDemoScenario = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        patientProfile,
        language,
        setLanguage,
        t,
        activeView,
        setActiveView,
        hospitals,
        doctors,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        switchPersona,
        login,
        register,
        logout,
        reseedDatabase,
        activeCase,
        setActiveCase,
        selectedAppointment,
        setSelectedAppointment,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        selectedHospitalForBooking,
        setSelectedHospitalForBooking,
        isOfflineMode,
        setIsOfflineMode,
        offlineDrafts,
        saveOfflineDraft,
        syncOfflineDrafts,
        refreshData,
        runDemoScenario,
        isDemoModalOpen,
        setIsDemoModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
