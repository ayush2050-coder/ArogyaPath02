import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Printer, 
  Download, 
  Share2, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock, 
  HeartPulse,
  Stethoscope,
  Building2,
  FileCheck
} from 'lucide-react';

export const DigitalReceiptModal: React.FC = () => {
  const { 
    selectedAppointment, 
    currentUser, 
    setActiveView, 
    switchPersona,
    t 
  } = useApp();

  const apt = selectedAppointment;

  if (!apt) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-slate-500">
        No active OPD slip selected.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OPD_Slip_${apt.opdSlipNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner Notice */}
      <div className="no-print p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm">OPD Registration Successful!</h3>
            <p className="text-xs text-emerald-800">Present this digital slip or token number directly at OPD Room.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Slip</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Official OPD Registration Slip (Printable Document) */}
      <div 
        id="opd-digital-slip"
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0"
      >
        {/* Slip Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-widest mb-1">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>ArogyaPath (आरोग्य पथ) • Digital OPD Registration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">
            {apt.hospitalName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Public Health Service • Ayushman Bharat Digital Mission (ABDM) Compatible
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-700 font-mono pt-2 border-t border-dashed border-slate-200">
            <span>Reg No: <strong>{apt.registrationNumber}</strong></span>
            <span>Slip ID: <strong>{apt.opdSlipNumber}</strong></span>
            <span>Date: {apt.date}</span>
          </div>
        </div>

        {/* Highlighted Token & OPD Room Block */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="border-r border-slate-200 pr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              OPD Token Number
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 block my-1">
              #{apt.digitalReceipt.tokenNumber}
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              Confirmed Slot: {apt.timeSlot}
            </span>
          </div>

          <div className="pl-2 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Consultation Location
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 block my-1">
              {apt.opdRoom}
            </span>
            <span className="text-xs text-slate-600">
              Dept: {apt.department}
            </span>
          </div>
        </div>

        {/* Patient & Doctor Two-Column Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          {/* Patient Details */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Patient Details
            </span>
            <div className="font-extrabold text-sm text-slate-900">{apt.patientName}</div>
            <div className="text-slate-600">
              ABHA UHID: <span className="font-mono font-semibold text-slate-900">{apt.patientUhid}</span>
            </div>
            <div className="text-slate-600">
              Age / Gender: <span className="font-medium text-slate-800">{apt.patientAge} yrs / {apt.patientGender}</span>
            </div>
            <div className="text-slate-600">
              Contact: <span className="font-mono text-slate-800">{apt.patientPhone}</span>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Attending Physician
            </span>
            <div className="font-extrabold text-sm text-slate-900">{apt.doctorName}</div>
            <div className="text-slate-600">
              Specialty: <span className="font-medium text-slate-800">{apt.doctorSpecialty}</span>
            </div>
            <div className="text-slate-600">
              Department: <span className="font-medium text-slate-800">{apt.department}</span>
            </div>
            <div className="text-emerald-700 font-semibold">
              Status: Validated for OPD Entry
            </div>
          </div>
        </div>

        {/* Verification QR Code & Barcode Block */}
        <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* SVG Crisp QR Code Representation */}
            <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0 shadow-xs">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white"/>
                <path d="M2 2H8V8H2V2ZM3 3V7H7V3H3Z" fill="#0f172a"/>
                <rect x="4" y="4" width="2" height="2" fill="#0f172a"/>
                <path d="M16 2H22V8H16V2ZM17 3V7H21V3H17Z" fill="#0f172a"/>
                <rect x="18" y="4" width="2" height="2" fill="#0f172a"/>
                <path d="M2 16H8V22H2V16ZM3 17V21H7V17H3Z" fill="#0f172a"/>
                <rect x="4" y="18" width="2" height="2" fill="#0f172a"/>
                <rect x="10" y="2" width="4" height="2" fill="#0f172a"/>
                <rect x="10" y="6" width="2" height="2" fill="#0f172a"/>
                <rect x="14" y="6" width="2" height="4" fill="#0f172a"/>
                <rect x="10" y="10" width="2" height="4" fill="#0f172a"/>
                <rect x="2" y="10" width="4" height="2" fill="#0f172a"/>
                <rect x="6" y="12" width="2" height="2" fill="#0f172a"/>
                <rect x="10" y="16" width="4" height="2" fill="#0f172a"/>
                <rect x="14" y="14" width="2" height="2" fill="#0f172a"/>
                <rect x="16" y="10" width="4" height="2" fill="#0f172a"/>
                <rect x="18" y="12" width="4" height="2" fill="#0f172a"/>
                <rect x="16" y="16" width="2" height="4" fill="#0f172a"/>
                <rect x="20" y="18" width="2" height="4" fill="#0f172a"/>
                <rect x="10" y="20" width="4" height="2" fill="#0f172a"/>
              </svg>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Digital Verification QR
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Scan at hospital entrance or OPD reception kiosk for instant priority verification.
              </p>
              <div className="font-mono text-[9px] text-slate-400 mt-1 break-all">
                Payload: {apt.digitalReceipt.qrCodePayload.slice(0, 48)}...
              </div>
            </div>
          </div>

          {/* Barcode representation */}
          <div className="text-right shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Hospital Barcode
            </span>
            <div className="font-mono tracking-widest text-slate-900 font-extrabold text-sm bg-white px-3 py-1 border border-slate-200 rounded">
              ||| | || |||| | | |||
            </div>
            <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
              {apt.digitalReceipt.barcode}
            </span>
          </div>
        </div>

        {/* Footnote */}
        <div className="border-t border-slate-200 pt-3 text-center text-[10px] text-slate-500 space-y-0.5">
          <p>Please report 10 minutes prior to scheduled slot at {apt.opdRoom}.</p>
          <p>Emergency cases are prioritized as per National Hospital Triage Protocols.</p>
        </div>
      </div>

      {/* Next Step Action: Switch to Doctor for Consultation Demo */}
      <div className="no-print p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-blue-900 block">Next in Hackathon Flow:</span>
          <p className="text-xs text-blue-800">
            Switch to Dr. Anita Sharma’s Clinical Workspace to review this patient’s case and enter clinical notes!
          </p>
        </div>

        <button
          id="proceed-to-doctor-review-btn"
          onClick={() => {
            switchPersona('doctor');
            setActiveView('doctor_dashboard');
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Open Doctor Clinical Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
