export const translations = {
  en: {
    appName: 'ArogyaPath',
    appNameHindi: 'आरोग्य पथ',
    tagline: 'Patient Case Taking & Healthcare Coordination Platform',
    subtagline: 'Bridging patients, ASHA health workers, and doctors through AI-structured clinical intake.',
    sihTag: 'Smart India Hackathon 2026 | Team IdeaNova | SIH26047',
    
    // Navigation & Views
    navHome: 'Home',
    navCaseTaking: 'AI Case Taking',
    navHospitals: 'Find Care',
    navAppointments: 'My OPD Slips',
    navDoctorPortal: 'Doctor Workspace',
    navHealthWorker: 'ASHA Field Worker',
    navHospitalPortal: 'Hospital Admin',
    navAdmin: 'System Admin',
    navDemoScenario: 'Run SIH Demo Flow',
    
    // Roles
    rolePatient: 'Patient',
    roleDoctor: 'Doctor',
    roleHealthWorker: 'Health Worker (ASHA)',
    roleHospitalAdmin: 'Hospital Admin',
    roleAdmin: 'Platform Admin',
    switchRole: 'Switch Demo Persona',
    
    // Case Taking
    caseTakingTitle: 'AI-Assisted Patient Case-Taking',
    caseTakingSubtitle: 'Speak or type your symptoms naturally. Our assistant asks gentle follow-up questions to prepare a structured report for your doctor.',
    voiceInput: 'Voice Input (Speech-to-Text)',
    startSpeaking: 'Tap Mic to Speak in Hindi / English',
    listening: 'Listening... Speak your symptoms',
    typePlaceholder: 'Describe your symptoms in your own words (e.g. "4 din se tez bukhar hai, thand lag rahi hai aur sar dard hai")...',
    submitSymptom: 'Process Case with AI',
    askFollowUpBtn: 'Ask AI Follow-ups',
    safetyDisclaimer: 'AI Boundary Notice: ArogyaPath is not a doctor. It does not provide medical diagnoses or prescribe medications. All structured summaries require physician verification.',
    emergencyWarning: 'EMERGENCY TRIAGE WARNING: Urgent symptoms detected. Please call 108 ambulance or visit the nearest emergency room immediately.',
    
    // Structured Case
    chiefComplaint: 'Chief Complaint',
    symptomsIdentified: 'Documented Symptoms',
    duration: 'Duration',
    severity: 'Severity Level',
    patientOriginalWords: "Patient's Original Verbatim Statement (Preserved for Doctor)",
    missingClinicalInfo: 'Important Information to Check in OPD',
    recommendedDept: 'Recommended OPD Department',
    triageLevel: 'Triage Priority',
    confirmAndBook: 'Confirm Case & Find Doctor',
    saveOfflineDraft: 'Save as Offline Field Draft',
    
    // Appointment & Receipts
    opdSlip: 'Digital OPD Registration Slip',
    tokenNumber: 'Token Number',
    opdRoom: 'OPD Room',
    patientUhid: 'ABHA / Health ID',
    hospitalName: 'Hospital',
    consultantDoctor: 'Consulting Physician',
    dateAndTime: 'Date & Time Slot',
    printReceipt: 'Print OPD Slip',
    downloadSlip: 'Download Slip',
    shareSlip: 'Share Slip',
    
    // Doctor Workspace
    doctorTitle: 'Clinical Review & OPD Queue',
    todaysPatients: "Today's Patient Queue",
    clinicalNotes: 'Doctor Clinical Assessment',
    provisionalDiagnosis: 'Provisional Diagnosis (By Physician)',
    prescribedAdvice: 'Prescription & Advice',
    followUpDate: 'Follow-Up Date',
    saveClinicalNotes: 'Save Clinical Record & Complete Visit',
    originalVersusAI: 'Side-by-Side Verification (Original Statement vs AI Structured Case)',
    
    // Offline Banner
    offlineNotice: 'You are currently offline. Field intake records will be saved locally and synced automatically when network restores.',
    syncedSuccess: 'All offline records synced with Central Registry.'
  },
  
  hi: {
    appName: 'आरोग्य पथ',
    appNameHindi: 'ArogyaPath',
    tagline: 'रोगी केस-टेकिंग एवं स्वास्थ्य समन्वय मंच',
    subtagline: 'एआई-संरचित चिकित्सकीय केस-टेकिंग के माध्यम से ग्रामीण मरीजों, आशा कार्यकर्ताओं और डॉक्टरों को जोड़ना।',
    sihTag: 'स्मार्ट इंडिया हैकथॉन 2026 | टीम आइडियानोवा | SIH26047',
    
    // Navigation & Views
    navHome: 'मुख्य पृष्ठ',
    navCaseTaking: 'एआई केस टेकिंग',
    navHospitals: 'अस्पताल व डॉक्टर',
    navAppointments: 'मेरी ओपीडी पर्ची',
    navDoctorPortal: 'डॉक्टर कक्ष',
    navHealthWorker: 'आशा कार्यकर्ता पोर्टल',
    navHospitalPortal: 'अस्पताल व्यवस्थापक',
    navAdmin: 'सिस्टम एडमिन',
    navDemoScenario: 'हैकथॉन डेमो चलाएं',
    
    // Roles
    rolePatient: 'मरीज (Patient)',
    roleDoctor: 'डॉक्टर (Doctor)',
    roleHealthWorker: 'आशा / स्वास्थ्य कार्यकर्ता',
    roleHospitalAdmin: 'अस्पताल एडमिन',
    roleAdmin: 'प्लेटफॉर्म एडमिन',
    switchRole: 'डेमो रोल बदलें',
    
    // Case Taking
    caseTakingTitle: 'एआई-सहायक मरीज केस-टेकिंग',
    caseTakingSubtitle: 'अपनी भाषा में अपनी परेशानी बताएं या बोलें। एआई सहायक डॉक्टर के लिए एक व्यवस्थित केस रिपोर्ट तैयार करेगा।',
    voiceInput: 'बोलकर बताएं (Voice Input)',
    startSpeaking: 'माइक दबाकर हिंदी या स्थानीय भाषा में बोलें',
    listening: 'सुन रहे हैं... कृपया अपने लक्षण बताएं',
    typePlaceholder: 'अपनी समस्या अपने शब्दों में लिखें (जैसे: "चार दिन से बहुत तेज बुखार है, ठंड लगकर कंपकंपी होती है और सिर दर्द है")...',
    submitSymptom: 'एआई द्वारा केस तैयार करें',
    askFollowUpBtn: 'एआई से अतिरिक्त प्रश्न पूछें',
    safetyDisclaimer: 'सुरक्षा सूचना: आरोग्य पथ कोई डॉक्टर नहीं है। यह दवा या रोग निर्णय नहीं देता। डॉक्टर द्वारा परीक्षण अनिवार्य है।',
    emergencyWarning: 'आपातकालीन चेतावनी: गंभीर लक्षण पाए गए हैं। तुरंत 108 एम्बुलेंस पर कॉल करें या नजदीकी आपातकालीन केंद्र जाएं।',
    
    // Structured Case
    chiefComplaint: 'मुख्य परेशानी (Chief Complaint)',
    symptomsIdentified: 'पाए गए लक्षण',
    duration: 'अवधि (कितने दिनों से)',
    severity: 'तीव्रता का स्तर',
    patientOriginalWords: 'मरीज के मूल शब्द (डॉक्टर के सत्यापन हेतु सुरक्षित)',
    missingClinicalInfo: 'ओपीडी में जांचने योग्य महत्वपूर्ण जानकारी',
    recommendedDept: 'सुझाया गया ओपीडी विभाग',
    triageLevel: 'प्राथमिकता स्तर',
    confirmAndBook: 'केस सुरक्षित कर डॉक्टर चुनें',
    saveOfflineDraft: 'ऑफ़लाइन ड्राफ्ट सहेजें',
    
    // Appointment & Receipts
    opdSlip: 'डिजिटल ओपीडी पंजीकरण रसीद',
    tokenNumber: 'टोकन नंबर',
    opdRoom: 'ओपीडी कक्ष संख्या',
    patientUhid: 'आभा / हेल्थ आईडी',
    hospitalName: 'अस्पताल का नाम',
    consultantDoctor: 'परामर्शदाता चिकित्सक',
    dateAndTime: 'तारीख एवं समय',
    printReceipt: 'ओपीडी पर्ची प्रिंट करें',
    downloadSlip: 'पर्ची डाउनलोड करें',
    shareSlip: 'साझा करें',
    
    // Doctor Workspace
    doctorTitle: 'चिकित्सकीय समीक्षा एवं ओपीडी कतार',
    todaysPatients: 'आज के मरीज',
    clinicalNotes: 'डॉक्टर द्वारा नैदानिक टिप्पणियां',
    provisionalDiagnosis: 'संभावित निदान (डॉक्टर द्वारा)',
    prescribedAdvice: 'दवा व चिकित्सीय सलाह',
    followUpDate: 'अगली जांच की तारीख',
    saveClinicalNotes: 'परामर्श सुरक्षित करें',
    originalVersusAI: 'सत्यापन: मरीज के मूल शब्द बनाम एआई संरचित सारांश',
    
    // Offline Banner
    offlineNotice: 'आप ऑफ़लाइन हैं। केस ड्राफ्ट आपके फोन/सिस्टम में सुरक्षित है और इंटरनेट आने पर स्वतः सिंक हो जाएगा।',
    syncedSuccess: 'सभी ऑफ़लाइन रिकॉर्ड केंद्रीय स्वास्थ्य रजिस्ट्री में सिंक हो गए हैं।'
  }
};
