import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  BookmarkCheck, 
  HelpCircle, 
  RefreshCw, 
  User, 
  HeartPulse, 
  ShieldCheck, 
  WifiOff, 
  Info,
  Stethoscope
} from 'lucide-react';
import { CaseRecord, SymptomItem, RedFlagAlert } from '../types';

export const CaseTakingAssistant: React.FC = () => {
  const { 
    currentUser, 
    patientProfile, 
    language, 
    setActiveView, 
    setActiveCase, 
    isOfflineMode, 
    saveOfflineDraft,
    t 
  } = useApp();

  // Input states
  const [statement, setStatement] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState(false);
  const [isProcessingStructure, setIsProcessingStructure] = useState(false);
  const [structuredCase, setStructuredCase] = useState<CaseRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Speech Recognition setup (Web Speech API)
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setStatement(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please type your statement or use Google Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Speech start error:', err);
      }
    }
  };

  // Quick preset chips for rapid testing / rural common presentations
  const quickPresets = [
    {
      titleHi: 'तेज बुखार और कंपकंपी',
      titleEn: 'High Fever & Chills',
      text: 'चार दिन से बहुत तेज बुखार आ रहा है, ठंड लगकर कंपकंपी होती है। शाम को बुखार 102 तक पहुंच जाता है, सिर और बदन में तेज दर्द है और बहुत कमजोरी लग रही है।'
    },
    {
      titleHi: 'पेट दर्द एवं उल्टी',
      titleEn: 'Abdominal Pain & Vomiting',
      text: 'पिछले दो दिनों से पेट के ऊपरी हिस्से में ऐंठन और मरोड़ के साथ तेज दर्द हो रहा है, कुछ भी खाने पर उल्टी जैसा लगता है और चक्कर आ रहे हैं।'
    },
    {
      titleHi: 'खांसी और सांस फूलना',
      titleEn: 'Cough & Breathlessness',
      text: 'एक हफ्ते से लगातार सूखी खांसी आ रही है और सीने में भारीपन है। थोड़ा सा भी चलने पर सांस फूलने लगती है और रात में बेचैनी होती है।'
    },
    {
      titleHi: 'आपातकालीन लक्षण (रेड फ्लैग)',
      titleEn: 'Emergency Check (Red Flag)',
      text: 'Severe crushing chest pain radiating to left arm with excessive cold sweating and difficulty breathing for the last 30 minutes.'
    }
  ];

  // Request AI Follow-up Questions
  const handleRequestFollowUp = async () => {
    if (!statement.trim()) return;
    setIsLoadingFollowUp(true);

    try {
      const res = await fetch('/api/ai/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statement,
          history: conversationHistory,
          language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuggestedQuestions(data.questions || []);
      }
    } catch (err) {
      console.error('Follow-up generation error:', err);
    } finally {
      setIsLoadingFollowUp(false);
    }
  };

  // Answer a follow-up question
  const handleSelectQuestion = (q: string) => {
    setConversationHistory(prev => [
      ...prev,
      { role: 'assistant', content: q }
    ]);
    setSuggestedQuestions(prev => prev.filter(item => item !== q));
  };

  // Process & Structure Case
  const handleGenerateStructuredCase = async () => {
    if (!statement.trim()) return;
    setIsProcessingStructure(true);

    try {
      const res = await fetch('/api/ai/structure-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statement,
          history: conversationHistory,
          patientProfile: patientProfile || {
            age: 48,
            gender: 'Male',
            existingConditions: ['Type 2 Diabetes (5 yrs)'],
            allergies: ['Penicillin']
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const fullCase: CaseRecord = {
          id: `case_${Date.now()}`,
          patientId: patientProfile?.id || 'pat_1',
          patientName: patientProfile?.name || currentUser.name,
          patientAge: patientProfile?.age || 48,
          patientGender: patientProfile?.gender || 'Male',
          patientUhid: patientProfile?.uhid || 'ABHA-91-4821-3942-12',
          healthWorkerId: currentUser.role === 'health_worker' ? currentUser.id : undefined,
          healthWorkerName: currentUser.role === 'health_worker' ? currentUser.name : undefined,
          createdByRole: currentUser.role === 'health_worker' ? 'health_worker' : 'patient',
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setStructuredCase(fullCase);
        setActiveCase(fullCase);
      }
    } catch (err) {
      console.error('Case structuring error:', err);
    } finally {
      setIsProcessingStructure(false);
    }
  };

  // Save Case Draft Offline
  const handleSaveOffline = () => {
    if (!structuredCase) return;
    saveOfflineDraft({
      ...structuredCase,
      offlineSyncStatus: 'local_draft'
    });
    setSaveSuccessMsg('Case saved as offline draft on this device. It will automatically sync when network is restored.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Submit and route to doctor / hospital booking
  const handleProceedToBooking = async () => {
    if (!structuredCase) return;

    // If online, submit to database
    if (!isOfflineMode) {
      try {
        const res = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(structuredCase)
        });
        if (res.ok) {
          const saved = await res.json();
          setActiveCase(saved);
        }
      } catch (err) {
        console.warn('Could not post to online server, keeping local:', err);
        saveOfflineDraft(structuredCase);
      }
    } else {
      saveOfflineDraft(structuredCase);
    }

    // Move to Hospital Discovery view
    setActiveView('hospital_discovery');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Core Module
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Patient: {patientProfile?.name || currentUser.name} ({patientProfile?.uhid || 'ABHA-91-4821-3942-12'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t.caseTakingTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t.caseTakingSubtitle}
          </p>
        </div>

        {currentUser.role === 'health_worker' && (
          <div className="px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <div className="font-bold">ASHA Field Worker Intake Mode</div>
              <div className="text-[11px] text-teal-700">Assisting rural villager in Shivpur</div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory AI Safety & Boundaries Warning Banner */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-blue-950 mb-0.5">Clinical Boundary Notice (डॉक्टर-इन-द-लूप सिद्धांत):</div>
          <p className="leading-relaxed">
            {t.safetyDisclaimer}
          </p>
        </div>
      </div>

      {/* Main Grid: Input Stage (Left) & Live Structured Clinical Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Natural / Voice Input & Follow-ups */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>1. Explain Symptoms in Patient’s Language</span>
              </label>

              {/* Voice toggle button */}
              <button
                id="mic-voice-toggle-btn"
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isRecording 
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title="Click to speak using Web Speech API"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{t.listening}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>{t.voiceInput}</span>
                  </>
                )}
              </button>
            </div>

            {/* Natural Textarea */}
            <div className="relative">
              <textarea
                id="patient-symptom-input"
                rows={5}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder={t.typePlaceholder}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed font-sans placeholder:text-slate-400"
              />
            </div>

            {/* Quick Presets for Demo / Easy Input */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Rural Case Templates (नमूना लक्षण):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    id={`quick-preset-${idx}`}
                    type="button"
                    onClick={() => setStatement(preset.text)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200/80 transition-colors font-medium text-left"
                  >
                    {language === 'hi' ? preset.titleHi : preset.titleEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar: Request Follow-ups or Structure */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                id="ask-followups-btn"
                type="button"
                onClick={handleRequestFollowUp}
                disabled={!statement.trim() || isLoadingFollowUp}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isLoadingFollowUp ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{t.askFollowUpBtn}</span>
              </button>

              <button
                id="structure-case-btn"
                type="button"
                onClick={handleGenerateStructuredCase}
                disabled={!statement.trim() || isProcessingStructure}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isProcessingStructure ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Structuring Clinical Summary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.submitSymptom}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Follow-up Questions Section */}
          {suggestedQuestions.length > 0 && (
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Suggested Follow-Up Questions for the Patient:</span>
              </div>
              <p className="text-xs text-amber-800">
                Tap a question to ask it to the patient and append their answer:
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((q, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectQuestion(q)}
                    className="p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 cursor-pointer text-xs text-slate-800 transition-all hover:shadow-xs flex items-center justify-between gap-2"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="bg-slate-100 p-4 rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider">
                Intake Notes & Answers:
              </span>
              {conversationHistory.map((item, i) => (
                <div key={i} className="p-2 rounded bg-white border border-slate-200 text-slate-800">
                  <span className="font-bold text-slate-500 uppercase text-[10px] mr-2">Q:</span>
                  {item.content}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Structured Clinical Intake Preview (Doctor Ready) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Structured Clinical Intake Case
                </h3>
              </div>

              {structuredCase && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
                >
                  {isEditing ? 'Done Editing' : 'Edit Fields'}
                </button>
              )}
            </div>

            {!structuredCase ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <HeartPulse className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm">
                  Describe symptoms and click <strong>"Process Case with AI"</strong> to generate the doctor-ready structured case.
                </p>
                <div className="max-w-xs mx-auto text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  AI extracts: Chief complaint, symptoms, timeline, severity score, allergy checks, and routing department.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Emergency Red Flag Notice if detected */}
                {structuredCase.redFlags?.detected && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start gap-2.5 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-rose-700">
                        {t.emergencyWarning}
                      </span>
                      <p className="mt-0.5 text-rose-900 leading-normal font-medium">
                        {structuredCase.redFlags.reason || 'Urgent symptomatic severity detected. Please arrange immediate emergency transfer.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Chief Complaint */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {t.chiefComplaint}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={structuredCase.chiefComplaint}
                      onChange={(e) => setStructuredCase({ ...structuredCase, chiefComplaint: e.target.value })}
                      className="w-full text-xs p-1.5 border rounded bg-white"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {structuredCase.chiefComplaint}
                    </p>
                  )}
                </div>

                {/* Symptoms Table */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    {t.symptomsIdentified}
                  </span>
                  <div className="space-y-1.5">
                    {structuredCase.symptoms.map((sym, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{sym.name}</span>
                          {sym.nameHindi && <span className="text-slate-500 font-hindi ml-1.5">({sym.nameHindi})</span>}
                          {sym.notes && <p className="text-[11px] text-slate-500 mt-0.5">{sym.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-right">
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {sym.duration}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            sym.severity === 'severe' ? 'bg-rose-100 text-rose-700' :
                            sym.severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {sym.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vital Metadata Grid: Severity, Department, Triage */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Severity</span>
                    <span className="font-extrabold text-base text-slate-900">
                      {structuredCase.severityScore}
                      <span className="text-xs font-normal text-slate-500">/10</span>
                    </span>
                    <span className="block text-[10px] text-slate-500">{structuredCase.severityLevel}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Routing Dept</span>
                    <span className="font-bold text-xs text-emerald-800 block mt-1">
                      {structuredCase.recommendedDepartment}
                    </span>
                    <span className="text-[10px] text-slate-500">Suggested OPD</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Triage</span>
                    <span className={`font-bold text-xs px-2 py-0.5 rounded inline-block mt-1 uppercase ${
                      structuredCase.triageLevel === 'Emergency' ? 'bg-rose-100 text-rose-700' :
                      structuredCase.triageLevel === 'Priority' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {structuredCase.triageLevel}
                    </span>
                  </div>
                </div>

                {/* Missing Clinical Info Checklist */}
                {structuredCase.importantMissingInfo?.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-950 block mb-1">
                      {t.missingClinicalInfo}:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-900 text-[11px]">
                      {structuredCase.importantMissingInfo.map((info, i) => (
                        <li key={i}>{info}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Patient Original Words (Preserved side-by-side for Doctor) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {t.patientOriginalWords}
                  </span>
                  <p className="text-xs text-slate-700 italic font-hindi leading-relaxed">
                    "{structuredCase.originalStatement}"
                  </p>
                </div>

                {/* Feedback message */}
                {saveSuccessMsg && (
                  <div className="p-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg text-center border border-emerald-200">
                    {saveSuccessMsg}
                  </div>
                )}

                {/* Bottom Decision Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    id="save-offline-draft-btn"
                    type="button"
                    onClick={handleSaveOffline}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{t.saveOfflineDraft}</span>
                  </button>

                  <button
                    id="confirm-find-doctor-btn"
                    type="button"
                    onClick={handleProceedToBooking}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <span>{t.confirmAndBook}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
