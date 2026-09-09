import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { CaseTakingAssistant } from './components/CaseTakingAssistant';
import { HospitalDiscovery } from './components/HospitalDiscovery';
import { AppointmentBooking } from './components/AppointmentBooking';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { DoctorDashboard } from './components/DoctorDashboard';
import { HealthWorkerPortal } from './components/HealthWorkerPortal';
import { HospitalPortal } from './components/HospitalPortal';
import { AdminPortal } from './components/AdminPortal';
import { PatientDashboard } from './components/PatientDashboard';
import { DemoScenarioModal } from './components/DemoScenarioModal';
import { AuthView } from './components/AuthView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-200">
      <Header />

      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {(activeView === 'login' || activeView === 'register') && <AuthView />}
        {activeView === 'analytics_dashboard' && <AnalyticsDashboard />}
        {activeView === 'patient_dashboard' && <PatientDashboard />}
        {activeView === 'case_taking' && <CaseTakingAssistant />}
        {activeView === 'hospital_discovery' && <HospitalDiscovery />}
        {activeView === 'appointment_booking' && <AppointmentBooking />}
        {activeView === 'digital_receipt' && <DigitalReceiptModal />}
        {activeView === 'doctor_dashboard' && <DoctorDashboard />}
        {activeView === 'health_worker_portal' && <HealthWorkerPortal />}
        {activeView === 'hospital_portal' && <HospitalPortal />}
        {activeView === 'admin_portal' && <AdminPortal />}
      </main>

      {/* SIH Judge Demo Walkthrough Modal */}
      <DemoScenarioModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
