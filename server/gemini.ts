import { GoogleGenAI } from '@google/genai';
import { CaseRecord, PatientProfile, RedFlagAlert } from '../src/types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not detected in process.env. Running with intelligent clinical fallback engine.');
    return null;
  }
  try {
    genAIClient = new GoogleGenAI({ apiKey });
    return genAIClient;
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

// Emergency red flag terms for safety detection
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'severe chest', 'stroke', 'paralysis', 
  'unconscious', 'difficulty breathing', 'gasping for air', 'heavy bleeding', 
  'vomiting blood', 'poison', 'snake bite', 'convulsion', 'seizure',
  'छाती में दर्द', 'दौरा', 'बेहोश', 'सांस लेने में बहुत तकलीफ', 'खून की उल्टी', 
  'जहर', 'सांप का काटना', 'अत्यधिक रक्तस्राव'
];

export function detectEmergencyKeywords(text: string): RedFlagAlert {
  const lower = text.toLowerCase();
  for (const kw of EMERGENCY_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) {
      return {
        detected: true,
        severityLevel: 'Emergency',
        reason: `Potential emergency indicator detected: "${kw}". Requires immediate emergency medical triage.`,
        urgentNotice: '⚠️ ALERT: Potentially critical symptoms detected. Please contact Emergency Ambulance (108/102) or proceed to the nearest Emergency/Trauma Centre immediately. ArogyaPath is not an emergency response system.'
      };
    }
  }
  return {
    detected: false,
    severityLevel: 'Low'
  };
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateFollowUpQuestions(
  patientStatement: string,
  history: ConversationTurn[],
  language: 'en' | 'hi' = 'en'
): Promise<string[]> {
  const client = getGenAI();

  if (client) {
    try {
      const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(patientStatement);
      const prompt = `You are the empathetic, polite intake assistant for "ArogyaPath (आरोग्य पथ)", a healthcare case-taking system for Indian rural and underserved clinics.
Your role is NOT to diagnose or prescribe. Your only job is to ask 1 or 2 gentle, clear follow-up questions to understand the patient's symptoms better (such as duration, severity, whether fever has chills, any current medications or existing illnesses).

Language: ${isHindi ? 'Hindi (in natural Devanagari script, polite and rural-friendly)' : 'Simple English'}.

Patient's statement:
"${patientStatement}"

Conversation so far:
${history.map(h => `${h.role}: ${h.content}`).join('\n')}

Generate strictly a JSON array of 1 to 2 short questions to ask the patient next.
Example format:
["क्या आपको बुखार के साथ ठंड भी लग रही है?", "क्या आप इसके लिए पहले से कोई दवा ले रहे हैं?"]
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch (err) {
      console.error('Gemini follow-up generation error, falling back to clinical rule engine:', err);
    }
  }

  // Fallback clinical questions engine
  const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(patientStatement);
  const lower = patientStatement.toLowerCase();

  if (isHindi) {
    if (lower.includes('बुखार') || lower.includes('ताप') || lower.includes('fever')) {
      return [
        'यह बुखार कितने दिनों से आ रहा है और क्या इसके साथ ठंड या कंपकंपी भी लगती है?',
        'क्या आपने बुखार के लिए कोई दवा ली है, और क्या आपको उल्टी या बदन दर्द भी हो रहा है?'
      ];
    }
    if (lower.includes('दर्द') || lower.includes('सिर') || lower.includes('पेट')) {
      return [
        'यह दर्द लगातार रहता है या रुक-रुक कर होता है? 1 से 10 के पैमाने पर दर्द कितना तेज है?',
        'क्या दर्द किसी विशेष काम या खाने-पीने के बाद बढ़ता या घटता है?'
      ];
    }
    if (lower.includes('खांसी') || lower.includes('सांस')) {
      return [
        'खांसी सूखी है या बलगम भी आ रहा है? क्या बलगम में खून दिखाई दिया है?',
        'क्या चलने-फिरने या लेटने पर सांस फूलने की समस्या होती है?'
      ];
    }
    return [
      'यह समस्या आपको कितने दिनों या हफ्तों से परेशान कर रही है?',
      'क्या आपको पहले से शुगर, बीपी या कोई अन्य बीमारी है और क्या आप कोई नियमित दवा लेते हैं?'
    ];
  } else {
    if (lower.includes('fever') || lower.includes('temperature') || lower.includes('shivering')) {
      return [
        'How many days have you had this fever, and does it come with chills or shivering?',
        'Have you taken any medication like paracetamol, and does the fever subside with it?'
      ];
    }
    if (lower.includes('pain') || lower.includes('ache') || lower.includes('stomach') || lower.includes('head')) {
      return [
        'Is the pain continuous or intermittent? On a scale of 1 to 10, how intense is it?',
        'Does anything specific relieve it or make it worse?'
      ];
    }
    if (lower.includes('cough') || lower.includes('breath')) {
      return [
        'Is the cough dry or producing phlegm? Have you noticed any blood or yellow mucus?',
        'Do you feel breathless when walking or lying flat?'
      ];
    }
    return [
      'For how many days have you been experiencing these symptoms?',
      'Do you have any existing medical conditions (like diabetes or hypertension) or current medications?'
    ];
  }
}

export async function structureCaseWithAI(
  originalStatement: string,
  history: ConversationTurn[],
  patientProfile?: Partial<PatientProfile>
): Promise<Omit<CaseRecord, 'id' | 'patientId' | 'patientName' | 'patientAge' | 'patientGender' | 'patientUhid' | 'createdByRole' | 'createdAt' | 'updatedAt'>> {
  const client = getGenAI();
  const emergencyCheck = detectEmergencyKeywords(originalStatement);

  if (client) {
    try {
      const fullContext = `
Patient Info:
- Age: ${patientProfile?.age || 'Unknown'}
- Gender: ${patientProfile?.gender || 'Unknown'}
- Existing Conditions: ${patientProfile?.existingConditions?.join(', ') || 'None recorded'}
- Known Allergies: ${patientProfile?.allergies?.join(', ') || 'None recorded'}
- Current Medicines: ${patientProfile?.currentMedicines?.join(', ') || 'None recorded'}

Patient Original Words:
"${originalStatement}"

Full Case-Taking Conversation:
${history.map(h => `${h.role}: ${h.content}`).join('\n')}
`;

      const prompt = `You are a clinical documentation assistant for ArogyaPath (आरोग्य पथ), supporting doctors in Indian public health centres and district hospitals.
Your task is to organize and structure the patient's unstructured narrative into a professional clinical intake summary.

IMPORTANT BOUNDARIES:
- DO NOT invent medical diagnoses or write definitive medical conclusions.
- The physician will make the diagnosis. Your job is pure clinical documentation and structured triage routing.
- Detect any red flags (e.g. chest pain, breathing difficulty, extreme vitals risk).
- Recommend non-diagnostic hospital department routing (e.g. "General Medicine", "Pulmonology", "Pediatrics", "Gynecology", "Orthopedics", "Cardiology", "Dermatology").

Return strictly valid JSON with this exact schema:
{
  "chiefComplaint": "Concise professional 1-sentence clinical chief complaint in English",
  "symptoms": [
    {
      "name": "Symptom name in English",
      "nameHindi": "लक्षण का नाम हिंदी में",
      "severity": "mild" | "moderate" | "severe",
      "duration": "Duration e.g. 4 days",
      "notes": "Pertinent descriptive notes"
    }
  ],
  "overallDuration": "e.g. 4 days",
  "severityScore": 1 to 10 integer,
  "severityLevel": "Mild" | "Moderate" | "Severe" | "Critical",
  "relevantHistory": "Past relevant medical history extracted or noted",
  "currentMedicines": "Medicines taken currently",
  "knownAllergies": "Allergies noted or 'None documented'",
  "previousConditions": "Existing health conditions",
  "importantMissingInfo": [
    "Vitals not measured (e.g. BP, SpO2, Blood Sugar, Temperature)",
    "Any pending lab work"
  ],
  "redFlags": {
    "detected": boolean,
    "severityLevel": "Low" | "Moderate" | "High" | "Emergency",
    "reason": "Explanation if detected",
    "urgentNotice": "Notice if emergency detected"
  },
  "recommendedDepartment": "General Medicine" | "Pulmonology" | "Cardiology" | "Pediatrics" | "Gynecology" | "Orthopedics" | "Ophthalmology",
  "recommendedSpecialty": "Name of specialty clinic",
  "triageLevel": "Routine" | "Priority" | "Emergency"
}
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt + '\n' + fullContext,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        // Ensure original statement and safety guarantees
        return {
          originalStatement,
          language: /[\u0900-\u097F]/.test(originalStatement) ? 'hi' : 'en',
          chiefComplaint: parsed.chiefComplaint || 'Patient presents with acute symptoms requiring evaluation',
          symptoms: Array.isArray(parsed.symptoms) && parsed.symptoms.length > 0 ? parsed.symptoms : [
            { name: 'Unspecified discomfort', severity: 'moderate', duration: 'Unknown' }
          ],
          overallDuration: parsed.overallDuration || 'Recent onset',
          severityScore: parsed.severityScore || 5,
          severityLevel: parsed.severityLevel || 'Moderate',
          relevantHistory: parsed.relevantHistory || (patientProfile?.existingConditions?.join(', ') || 'No prior hospital records available'),
          currentMedicines: parsed.currentMedicines || (patientProfile?.currentMedicines?.join(', ') || 'None disclosed'),
          knownAllergies: parsed.knownAllergies || (patientProfile?.allergies?.join(', ') || 'None reported'),
          previousConditions: parsed.previousConditions || (patientProfile?.existingConditions?.join(', ') || 'None reported'),
          importantMissingInfo: Array.isArray(parsed.importantMissingInfo) ? parsed.importantMissingInfo : [
            'Vital signs (BP, Pulse, Temperature, SpO2)',
            'Baseline investigation records'
          ],
          redFlags: emergencyCheck.detected ? emergencyCheck : (parsed.redFlags || { detected: false, severityLevel: 'Low' }),
          recommendedDepartment: parsed.recommendedDepartment || 'General Medicine',
          recommendedSpecialty: parsed.recommendedSpecialty || 'General OPD',
          triageLevel: emergencyCheck.detected ? 'Emergency' : (parsed.triageLevel || 'Routine'),
          status: 'draft',
          offlineSyncStatus: 'synced'
        };
      }
    } catch (err) {
      console.error('Gemini structuring error, using intelligent fallback rules:', err);
    }
  }

  // Fallback intelligent clinical rules engine
  const lower = (originalStatement + ' ' + history.map(h => h.content).join(' ')).toLowerCase();
  const isHindi = /[\u0900-\u097F]/.test(originalStatement);

  let chiefComplaint = 'Acute symptomatic complaint under evaluation';
  let recommendedDepartment = 'General Medicine';
  let recommendedSpecialty = 'Internal Medicine & General OPD';
  let triageLevel: 'Routine' | 'Priority' | 'Emergency' = 'Routine';
  let severityScore = 5;
  let severityLevel: 'Mild' | 'Moderate' | 'Severe' | 'Critical' = 'Moderate';
  const symptoms: any[] = [];

  if (emergencyCheck.detected) {
    triageLevel = 'Emergency';
    severityScore = 9;
    severityLevel = 'Critical';
  }

  if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('ताप') || lower.includes('chills') || lower.includes('ठंड')) {
    chiefComplaint = 'Fever with associated constitutional symptoms';
    recommendedDepartment = 'General Medicine';
    recommendedSpecialty = 'Fever Clinic / Infectious Disease OPD';
    triageLevel = triageLevel === 'Emergency' ? 'Emergency' : 'Priority';
    severityScore = Math.max(severityScore, 6);
    symptoms.push({
      name: 'Pyrexia (Fever) with Chills',
      nameHindi: 'ठंड लगकर बुखार',
      severity: 'moderate',
      duration: '3-5 days',
      notes: 'Episodic or high-grade fever reported by patient'
    });
  }

  if (lower.includes('cough') || lower.includes('खांसी') || lower.includes('breath') || lower.includes('सांस')) {
    chiefComplaint = 'Respiratory distress with persistent cough';
    recommendedDepartment = 'Pulmonology';
    recommendedSpecialty = 'Chest & Respiratory Medicine';
    symptoms.push({
      name: 'Cough and respiratory congestion',
      nameHindi: 'खांसी एवं श्वसन संबंधी परेशानी',
      severity: 'moderate',
      duration: 'Several days',
      notes: 'Requires chest auscultation and SpO2 monitoring'
    });
  }

  if (lower.includes('abdomen') || lower.includes('stomach') || lower.includes('पेट') || lower.includes('vomit') || lower.includes('उल्टी')) {
    chiefComplaint = 'Gastrointestinal discomfort with abdominal distress';
    recommendedDepartment = 'General Medicine';
    recommendedSpecialty = 'Gastroenterology / General OPD';
    symptoms.push({
      name: 'Abdominal pain / Gastric symptoms',
      nameHindi: 'पेट दर्द / उदर संबंधी लक्षण',
      severity: 'moderate',
      duration: 'Ongoing',
      notes: 'Assessment of abdominal tenderness needed'
    });
  }

  if (lower.includes('headache') || lower.includes('सिर दर्द') || lower.includes('सिरदर्द') || lower.includes('चक्कर') || lower.includes('dizziness')) {
    symptoms.push({
      name: 'Cephalea (Headache) & Asthenia',
      nameHindi: 'सिरदर्द एवं कमजोरी',
      severity: 'moderate',
      duration: '3-4 days'
    });
  }

  if (symptoms.length === 0) {
    symptoms.push({
      name: 'Primary Symptomatic Presentation',
      nameHindi: 'प्राथमिक लक्षण',
      severity: 'moderate',
      duration: 'Recent onset',
      notes: originalStatement.slice(0, 100)
    });
  }

  return {
    originalStatement,
    language: isHindi ? 'hi' : 'en',
    chiefComplaint,
    symptoms,
    overallDuration: 'Recent (3-5 days)',
    severityScore,
    severityLevel,
    relevantHistory: patientProfile?.existingConditions?.join(', ') || 'No previous chronic history recorded in clinic file',
    currentMedicines: patientProfile?.currentMedicines?.join(', ') || 'None disclosed',
    knownAllergies: patientProfile?.allergies?.join(', ') || 'No drug allergies reported',
    previousConditions: patientProfile?.existingConditions?.join(', ') || 'None known',
    importantMissingInfo: [
      'Vital signs (Blood Pressure, Heart Rate, Body Temperature, SpO2)',
      'Random Blood Sugar (RBS) and Rapid Diagnostic Tests (Malaria/Dengue)',
      'Complete physical examination by attending physician'
    ],
    redFlags: emergencyCheck,
    recommendedDepartment,
    recommendedSpecialty,
    triageLevel,
    status: 'draft',
    offlineSyncStatus: 'synced'
  };
}
