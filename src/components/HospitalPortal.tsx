import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Users, 
  Bed, 
  Clock, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Stethoscope, 
  Calendar 
} from 'lucide-react';
import { Hospital, Doctor } from '../types';

export const HospitalPortal: React.FC = () => {
  const { hospitals, doctors } = useApp();
  const hospital = hospitals[0]; // District Hospital Varanasi

  const [stats, setStats] = useState({
    totalOpdToday: 148,
    criticalTriage: 7,
    availableBeds: hospital?.bedAvailability.available || 58,
    totalBeds: hospital?.bedAvailability.total || 250,
    icuFree: hospital?.bedAvailability.icuAvailable || 4
  });

  const departmentLoad = [
    { name: 'General Medicine', active: 52, max: 60, waitMinutes: 14 },
    { name: 'Pulmonology', active: 28, max: 40, waitMinutes: 22 },
    { name: 'Cardiology', active: 31, max: 35, waitMinutes: 30 },
    { name: 'Pediatrics', active: 24, max: 40, waitMinutes: 10 },
    { name: 'Gynecology & Obstetrics', active: 19, max: 30, waitMinutes: 15 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
              Hospital Operations Administration
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Facility Code: HOSP-UP-VAR-001
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {hospital?.name || 'District Hospital Varanasi (Pandit Deen Dayal)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time OPD queue allocation, bed management, and specialist roster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">Central Health Server Connected</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Today's OPD Footfall</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">{stats.totalOpdToday}</div>
          <span className="text-[11px] text-emerald-700 font-medium">+14% via ArogyaPath digital tokens</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Available Inpatient Beds</span>
            <Bed className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">
            {stats.availableBeds} <span className="text-sm font-medium text-slate-400">/{stats.totalBeds}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">General Ward: 23% vacancy</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>ICU Critical Care Vacancy</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">{stats.icuFree}</div>
          <span className="text-[11px] text-rose-700 font-medium">Ventilators operational</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Emergency Triage Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{stats.criticalTriage}</div>
          <span className="text-[11px] text-amber-800 font-medium">Fast-track red flag cases</span>
        </div>
      </div>

      {/* Department Load & Doctor Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Department Loads */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Real-time OPD Department Loads
          </h3>

          <div className="space-y-3.5">
            {departmentLoad.map((dept, idx) => {
              const pct = Math.round((dept.active / dept.max) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{dept.name}</span>
                    <span className="text-slate-500">
                      <strong>{dept.active}</strong>/{dept.max} tokens ({dept.waitMinutes}m avg wait)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        pct > 80 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialists On Duty */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Specialists on Duty Today ({doctors.length})
          </h3>

          <div className="space-y-3">
            {doctors.map(d => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={d.avatar} alt={d.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 block">{d.name}</span>
                    <span className="text-slate-500">{d.department} • {d.opdRoom}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Active on Duty
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
