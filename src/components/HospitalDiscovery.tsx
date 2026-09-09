import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Stethoscope, 
  ShieldCheck, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Hospital, Doctor } from '../types';

export const HospitalDiscovery: React.FC = () => {
  const { 
    hospitals, 
    doctors, 
    activeCase, 
    setActiveView, 
    setSelectedDoctorForBooking, 
    setSelectedHospitalForBooking,
    t,
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(activeCase?.recommendedDepartment || 'All');
  const [onlyAyushman, setOnlyAyushman] = useState(false);
  const [activeHospitalId, setActiveHospitalId] = useState<string>(hospitals[0]?.id || 'hosp_1');

  // Filter hospitals
  const filteredHospitals = hospitals.filter(h => {
    if (onlyAyushman && !h.ayushmanEmpaneled) return false;
    if (selectedDeptFilter !== 'All' && !h.departments.includes(selectedDeptFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q) || h.nameHindi.includes(q);
      const matchDist = h.district.toLowerCase().includes(q);
      const matchDept = h.departments.some(d => d.toLowerCase().includes(q));
      if (!matchName && !matchDist && !matchDept) return false;
    }
    return true;
  });

  const currentHospital = hospitals.find(h => h.id === activeHospitalId) || hospitals[0];
  const hospitalDoctors = doctors.filter(d => {
    if (d.hospitalId !== activeHospitalId) return false;
    if (selectedDeptFilter !== 'All' && d.department !== selectedDeptFilter) return false;
    return true;
  });

  const handleSelectDoctor = (doctor: Doctor, hospital: Hospital) => {
    setSelectedDoctorForBooking(doctor);
    setSelectedHospitalForBooking(hospital);
    setActiveView('appointment_booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Title & Routing Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Care Routing
            </span>
            {activeCase && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Routed from Case #{activeCase.id}: {activeCase.recommendedDepartment}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Find Public Health Centers & Specialists
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore verified government hospitals, Community Health Centres (CHCs), and Primary Health Centres (PHCs) with live OPD schedules.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospital name, district, or facility..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Department:</span>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="All">All Departments</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Pulmonology">Pulmonology (Chest)</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Gynecology">Gynecology & MCH</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>

        {/* Ayushman Bharat Toggle */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyAyushman}
            onChange={(e) => setOnlyAyushman(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ayushman Bharat (PM-JAY) Empaneled</span>
        </label>
      </div>

      {/* Main Layout: Hospital List (Left) + Selected Hospital Doctors & Slots (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Hospital Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Available Centers ({filteredHospitals.length})
            </h3>
            <span className="text-xs text-slate-500">Sorted by distance</span>
          </div>

          <div className="space-y-3">
            {filteredHospitals.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No hospitals matched your filter criteria. Try resetting the department filter.
              </div>
            ) : (
              filteredHospitals.map(h => (
                <div
                  key={h.id}
                  id={`hospital-card-${h.id}`}
                  onClick={() => setActiveHospitalId(h.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeHospitalId === h.id 
                      ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                        {h.type}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {language === 'hi' ? h.nameHindi : h.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{h.address} ({h.distanceKm} km away)</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold justify-end">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{h.rating}</span>
                      </div>
                      {h.ayushmanEmpaneled && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          PM-JAY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bed stats & Facilities */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">
                        OPD Beds: <strong className="text-slate-900">{h.bedAvailability.available}</strong>/{h.bedAvailability.total}
                      </span>
                      {h.bedAvailability.icuAvailable > 0 && (
                        <span className="text-emerald-700 font-semibold">
                          ICU: {h.bedAvailability.icuAvailable} Free
                        </span>
                      )}
                    </div>
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <span>View Doctors</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Hospital Details & Doctors */}
        <div className="lg:col-span-7 space-y-6">
          {currentHospital && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {language === 'hi' ? currentHospital.nameHindi : currentHospital.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {currentHospital.timings}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Emergency: {currentHospital.emergencyPhone}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  Government Health Facility (Free Generic Medicines)
                </div>
              </div>

              {/* Facilities tags */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Hospital Facilities & Diagnostic Services:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentHospital.facilities.map((fac, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Doctors Roster */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    <span>Specialist Physicians On Duty ({hospitalDoctors.length})</span>
                  </h4>
                  <span className="text-xs text-slate-500">Book slot to generate digital token</span>
                </div>

                <div className="space-y-3">
                  {hospitalDoctors.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No doctors currently on duty for {selectedDeptFilter} at this center.
                    </p>
                  ) : (
                    hospitalDoctors.map(doctor => (
                      <div 
                        key={doctor.id}
                        id={`doctor-item-${doctor.id}`}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-slate-900">{doctor.name}</h5>
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                {doctor.department}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 font-medium">{doctor.qualification}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {doctor.opdRoom} • {doctor.experienceYears} yrs experience • Languages: {doctor.languages.join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-700">
                            {doctor.consultationFee === 0 ? 'Free OPD (Govt)' : `₹${doctor.consultationFee}`}
                          </span>
                          <button
                            id={`book-doctor-btn-${doctor.id}`}
                            onClick={() => handleSelectDoctor(doctor, currentHospital)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Select Slot & Book</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
