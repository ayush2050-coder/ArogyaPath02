import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Activity,
  Users,
  Building2,
  Calendar,
  Clock,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  HeartPulse,
  Radio,
  Download,
  Filter
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { reseedDatabase, refreshData, language, setActiveView } = useApp();
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState('all');

  const isHindi = language === 'hi';

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStatsData(data);
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleReseed = async () => {
    setSeeding(true);
    setSeedSuccessMsg(null);
    const success = await reseedDatabase();
    if (success) {
      await fetchStats();
      setSeedSuccessMsg(isHindi ? 'सभी व्यावहारिक स्वास्थ्य रिकॉर्ड्स और सिंड्रोमिक डेटा सफलतापूर्वक री-सीड हो गए!' : 'Comprehensive clinical & telemetry dataset successfully seeded!');
      setTimeout(() => setSeedSuccessMsg(null), 5000);
    }
    setSeeding(false);
  };

  // Fallback charts data if loading or initial
  const weeklyOpdTrend = statsData?.weeklyOpdTrend || [
    { day: 'Mon', footfall: 184, digitalTokens: 122, walkIns: 62 },
    { day: 'Tue', footfall: 215, digitalTokens: 148, walkIns: 67 },
    { day: 'Wed', footfall: 198, digitalTokens: 139, walkIns: 59 },
    { day: 'Thu', footfall: 230, digitalTokens: 172, walkIns: 58 },
    { day: 'Fri', footfall: 210, digitalTokens: 156, walkIns: 54 },
    { day: 'Sat', footfall: 265, digitalTokens: 195, walkIns: 70 }
  ];

  const departmentLoads = statsData?.departmentLoads || [
    { department: 'Gen Medicine', activeCases: 42, maxCapacity: 60, avgWaitMins: 18 },
    { department: 'Pulmonology', activeCases: 28, maxCapacity: 40, avgWaitMins: 22 },
    { department: 'Pediatrics', activeCases: 34, maxCapacity: 45, avgWaitMins: 14 },
    { department: 'Orthopedics', activeCases: 25, maxCapacity: 35, avgWaitMins: 28 },
    { department: 'Gynecology', activeCases: 31, maxCapacity: 40, avgWaitMins: 16 },
    { department: 'Cardiology', activeCases: 19, maxCapacity: 25, avgWaitMins: 12 }
  ];

  const bedStats = statsData?.bedStats || [
    { name: 'Occupied General', value: 174, color: '#3b82f6' },
    { name: 'Available General', value: 46, color: '#10b981' },
    { name: 'Occupied ICU', value: 23, color: '#f59e0b' },
    { name: 'Available ICU', value: 7, color: '#059669' }
  ];

  const syndromicSurveillance = statsData?.syndromicSurveillance || [
    { week: 'Week 33', acuteFever: 58, respiratoryInfections: 42, diarrhealCases: 31, vectorBorne: 12 },
    { week: 'Week 34', acuteFever: 64, respiratoryInfections: 49, diarrhealCases: 38, vectorBorne: 16 },
    { week: 'Week 35', acuteFever: 72, respiratoryInfections: 53, diarrhealCases: 29, vectorBorne: 24 },
    { week: 'Week 36', acuteFever: 89, respiratoryInfections: 61, diarrhealCases: 35, vectorBorne: 31 }
  ];

  const intakeBreakdown = statsData?.intakeBreakdown || [
    { modality: 'Hindi Voice (Rural)', count: 52, percentage: 46 },
    { modality: 'Hindi Form/Text', count: 34, percentage: 30 },
    { modality: 'Bhojpuri Voice', count: 18, percentage: 16 },
    { modality: 'English Digital', count: 9, percentage: 8 }
  ];

  const ashaSyncMetrics = statsData?.ashaSyncMetrics || [
    { date: '04 Sep', syncedCases: 24, syncBatches: 6, activeASHAs: 8 },
    { date: '05 Sep', syncedCases: 31, syncBatches: 9, activeASHAs: 11 },
    { date: '06 Sep', syncedCases: 28, syncBatches: 7, activeASHAs: 9 },
    { date: '07 Sep', syncedCases: 42, syncBatches: 12, activeASHAs: 14 },
    { date: '08 Sep', syncedCases: 46, syncBatches: 13, activeASHAs: 15 }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Title & Operational Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                {isHindi ? 'लाइव स्वास्थ्य टेलीमेट्री' : 'Live Health System Telemetry'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">District Health Registry, Varanasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'जिला स्वास्थ्य विश्लेषण एवं निगरानी डैशबोर्ड' : 'District Health Analytics & Surveillance Dashboard'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHindi 
                ? 'ओपीडी प्रवाह, ट्रायज स्तर, सिंड्रोमिक प्रकोप निगरानी, बेड उपलब्धता एवं आशा फील्ड डेटा का वास्तविक विश्लेषण।'
                : 'Real-time telemetry across OPD footfall, AI triage distribution, syndromic disease alerts, bed occupancy, and ASHA rural sync.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isHindi ? 'रिफ्रेश' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={handleReseed}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? (isHindi ? 'डेटा री-सीड हो रहा है...' : 'Seeding Dataset...') : (isHindi ? 'व्यावहारिक डेमो डेटा री-सीड करें' : 'Reset / Seed Rich Practical Data')}</span>
            </button>
          </div>
        </div>

        {/* Success toast if seeded */}
        {seedSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{seedSuccessMsg}</span>
            </div>
            <button 
              onClick={() => setSeedSuccessMsg(null)}
              className="text-xs text-emerald-700 hover:underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* KPI STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{isHindi ? 'कुल मरीज' : 'Total Patients'}</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{statsData?.totalPatients || 8}</div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+18% {isHindi ? 'इस माह' : 'vs last month'}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{isHindi ? 'सक्रिय केस' : 'Active Cases'}</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{statsData?.totalCases || 6}</div>
            <div className="mt-1 text-xs text-slate-500">
              {statsData?.reviewedCases || 2} {isHindi ? 'समीक्षित' : 'Reviewed by Doctor'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{isHindi ? 'इमरजेंसी / प्राथमिकता' : 'Emergency & Priority'}</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-rose-600">
              {(statsData?.emergencyCases || 1) + (statsData?.priorityCases || 3)}
            </div>
            <div className="mt-1 text-xs text-rose-700 font-medium">
              {statsData?.emergencyCases || 1} {isHindi ? 'रेड फ्लैग एम्बुलेंस' : 'Emergency Red Flags'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{isHindi ? 'औसत प्रतीक्षा समय' : 'Avg OPD Wait Time'}</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">18 <span className="text-sm font-normal text-slate-500">min</span></div>
            <div className="mt-1 text-xs text-emerald-600 font-medium">
              <span>{isHindi ? '↓ 68 मिनट बचत' : '↓ 67m saved vs walk-in'}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{isHindi ? 'बेड ऑक्यूपेंसी' : 'Bed Occupancy'}</span>
              <Building2 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">79.2%</div>
            <div className="mt-1 text-xs text-slate-500">
              {statsData?.hospitalsCount || 5} {isHindi ? 'संबद्ध अस्पताल' : 'Empaneled Hospitals'}
            </div>
          </div>
        </div>

        {/* SECTION 1: OPD Footfall Trend & Syndromic Surveillance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* OPD Footfall & Digital Shift */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'दैनिक ओपीडी फुटफॉल एवं डिजिटल टोकन प्रवाह' : 'Daily OPD Footfall & Digital Token Transition'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'डिजिटल प्री-बुक्ड टोकन बनाम सामान्य वॉक-इन मरीज' : 'Comparing digital pre-triage tokens vs traditional walk-ins'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                Weekly OPD Trend
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyOpdTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFootfall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="footfall" name="Total Footfall" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFootfall)" strokeWidth={2} />
                  <Area type="monotone" dataKey="digitalTokens" name="Digital Tokens" stroke="#10b981" fillOpacity={1} fill="url(#colorTokens)" strokeWidth={2} />
                  <Area type="monotone" dataKey="walkIns" name="Walk-Ins" stroke="#f59e0b" fillOpacity={0} strokeWidth={1.5} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disease Syndromic Surveillance (Epidemic Early Warning) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {isHindi ? 'सिंड्रोमिक रोग निगरानी (महामारी पूर्व चेतावनी)' : 'Syndromic Disease Surveillance (Epidemic Early Warning)'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'बुखार, सांस संक्रमण, दस्त व वेक्टर जनित बीमारियों की साप्ताहिक दर' : 'Tracking acute febrile, respiratory, diarrheal, & vector-borne cluster spikes'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                ICMR / IDSP
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={syndromicSurveillance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="acuteFever" name="Acute Fever (Dengue/Malaria)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="respiratoryInfections" name="Respiratory (ARI/Flu)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="diarrhealCases" name="Diarrheal Diseases" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="vectorBorne" name="Vector-Borne" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* SECTION 2: Departmental Load vs Capacity & Bed Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Department Capacity vs Active Cases (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'विभागवार क्षमता बनाम वर्तमान ओपीडी केस लोड' : 'Departmental Capacity vs Active OPD Case Inflow'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'विभिन्न विभागों में डॉक्टर भार और औसत प्रतीक्षा समय' : 'Real-time patient distribution vs department peak operational capacity'}
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium">Pt. Deen Dayal DH</span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentLoads} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="activeCases" name="Current Active Patients" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxCapacity" name="Peak Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bed Availability Breakdown (1 Col) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'बेड उपलब्धता की स्थिति' : 'Hospital Bed Availability Breakdown'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? 'सामान्य वार्ड एवं आईसीयू वेंटिलेटर उपलब्धता' : 'General Ward & Critical ICU Bed Capacity'}
              </p>

              <div className="h-52 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bedStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {bedStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-600">General Occupied: 174</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-semibold text-emerald-700">General Free: 46</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">ICU Occupied: 23</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                <span className="text-slate-600 font-semibold text-emerald-800">ICU Free: 7</span>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 3: Linguistic Intake Reach & ASHA Field Sync Throughput */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Intake Modalities & Vernacular Access */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'केस अंतर्ग्रहण माध्यम एवं भाषाई पहुंच' : 'Intake Modalities & Vernacular Reach'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              {isHindi ? 'ग्रामीण वॉइस, भोजपुरी एवं हिंदी में AI केस संरचना अनुपात' : 'Multilingual voice vs digital structured case submission metrics'}
            </p>

            <div className="space-y-3.5">
              {intakeBreakdown.map((item: any) => (
                <div key={item.modality} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{item.modality}</span>
                    <span className="text-slate-500">{item.count} cases ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Rural Inclusivity Impact: </span>
              Voice-based intake in local dialects (Hindi & Bhojpuri) represents 62% of primary consultations, enabling illiterate and semi-literate villagers to access specialist triage without intermediaries.
            </div>
          </div>

          {/* ASHA Field Worker Sync Activity */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'आशा कार्यकर्ता फील्ड डेटा सिंक गतिविधि' : 'ASHA Field Worker Rural Sync Throughput'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'ऑफलाइन कलेक्ट किए गए केसों का सेंट्रल सर्वर सिंक' : 'Batched offline case intake uploaded when network is re-established'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                15 Active ASHAs
              </span>
            </div>

            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ashaSyncMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="syncedCases" name="Synced Cases" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="syncBatches" name="Sync Batches" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
