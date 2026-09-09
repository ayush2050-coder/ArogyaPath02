import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Stethoscope, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { Appointment } from '../types';

export const AppointmentBooking: React.FC = () => {
  const { 
    currentUser, 
    patientProfile, 
    activeCase, 
    selectedDoctorForBooking, 
    selectedHospitalForBooking, 
    setSelectedAppointment, 
    setActiveView,
    refreshData 
  } = useApp();

  const doctor = selectedDoctorForBooking;
  const hospital = selectedHospitalForBooking;

  // Form states
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(doctor?.timeSlots[0] || '09:15 AM');
  const [notes, setNotes] = useState(activeCase ? `Referred for: ${activeCase.chiefComplaint}` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!doctor || !hospital) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Doctor or Hospital Selected</h2>
        <p className="text-sm text-slate-600">Please choose a hospital and specialist first from the directory.</p>
        <button
          onClick={() => setActiveView('hospital_discovery')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Explore Hospitals & Doctors
        </button>
      </div>
    );
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: activeCase?.id || 'intake_general',
          patientId: patientProfile?.id || 'pat_1',
          patientName: patientProfile?.name || currentUser.name,
          patientPhone: patientProfile?.contact || currentUser.phone,
          patientUhid: patientProfile?.uhid || 'ABHA-91-4821-3942-12',
          patientAge: patientProfile?.age || 48,
          patientGender: patientProfile?.gender || 'Male',
          hospitalId: hospital.id,
          department: doctor.department,
          doctorId: doctor.id,
          date: selectedDate,
          timeSlot: selectedSlot,
          notes
        })
      });

      if (res.ok) {
        const appointment: Appointment = await res.json();
        setSelectedAppointment(appointment);
        refreshData();
        setActiveView('digital_receipt');
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to book slot. Please select a different time slot.');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setErrorMessage('Network error while booking appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => setActiveView('hospital_discovery')}
        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hospitals</span>
      </button>

      {/* Main Booking Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            OPD Slot Allocation
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Confirm OPD Appointment & Generate Token
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Digital OPD Registration avoids counter queues at the hospital. Token slip will be generated instantly.
          </p>
        </div>

        {/* Selected Provider Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <img 
              src={doctor.avatar} 
              alt={doctor.name} 
              className="w-12 h-12 rounded-xl object-cover border border-slate-200" 
            />
            <div>
              <h3 className="font-bold text-sm text-slate-900">{doctor.name}</h3>
              <p className="text-xs text-slate-600">{doctor.qualification} ({doctor.specialty})</p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{hospital.name}</p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-[11px] text-slate-500 block uppercase font-bold">Room Location</span>
            <span className="text-xs font-bold text-slate-900 block">{doctor.opdRoom}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Government OPD (Free)</span>
          </div>
        </div>

        {/* Attached Case Summary if present */}
        {activeCase && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-950 block">
                Pre-attached Case Record #{activeCase.id}:
              </span>
              <p className="text-emerald-900 mt-0.5">
                Chief Complaint: {activeCase.chiefComplaint} (Triage: {activeCase.triageLevel})
              </p>
            </div>
          </div>
        )}

        {/* Patient Identity Check */}
        <div className="p-4 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Patient Information (Verified with ABHA)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Name</span>
              <span className="font-bold text-slate-900">{patientProfile?.name || currentUser.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ABHA UHID</span>
              <span className="font-mono text-slate-900">{patientProfile?.uhid || 'ABHA-91-4821-3942-12'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Age / Gender</span>
              <span className="text-slate-900">{patientProfile?.age || 48} yrs / {patientProfile?.gender || 'Male'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Contact</span>
              <span className="text-slate-900">{patientProfile?.contact || currentUser.phone}</span>
            </div>
          </div>
        </div>

        {/* Date & Slot Booking Form */}
        <form onSubmit={handleConfirmBooking} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Appointment Date
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Available OPD Time Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                {doctor.timeSlots.map((slot, i) => (
                  <option key={i} value={slot}>
                    {slot} (OPD Token Batch)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Additional Notes for the Attending Doctor (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please check recent fever spikes and blood sugar levels"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Registration Fee: <strong className="text-slate-900">₹0 (Fully Subsidized)</strong>
            </div>

            <button
              id="confirm-booking-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Generating OPD Token...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Registration & Get Digital Slip</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
