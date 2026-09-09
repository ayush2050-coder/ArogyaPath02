export type UserRole = 'patient' | 'doctor' | 'health_worker' | 'hospital_admin' | 'admin';

export type AppLanguage = 'en' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  languagePreference: AppLanguage;
  hospitalId?: string;
  hospitalName?: string;
  specialty?: string;
  qualification?: string;
  assignedVillage?: string;
}

export interface PatientProfile {
  id: string;
  userId?: string;
  uhid: string; // ABHA / Unique Health ID e.g. ABHA-91-4821-3942-12
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  bloodGroup: string;
  allergies: string[];
  existingConditions: string[];
  currentMedicines: string[];
  previousSurgeries: string[];
  familyHistory?: string;
  createdAt: string;
}

export interface SymptomItem {
  name: string;
  nameHindi?: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  notes?: string;
}

export interface RedFlagAlert {
  detected: boolean;
  severityLevel: 'Low' | 'Moderate' | 'High' | 'Emergency';
  reason?: string;
  urgentNotice?: string;
}

export interface CaseRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientUhid: string;
  healthWorkerId?: string;
  healthWorkerName?: string;
  createdByRole: 'patient' | 'health_worker';
  originalStatement: string; // Verbatim patient input
  language: 'en' | 'hi' | 'hinglish';
  
  // Structured clinical output
  chiefComplaint: string;
  symptoms: SymptomItem[];
  overallDuration: string;
  duration?: string;
  severityScore: number; // 1 to 10
  severityLevel: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  relevantHistory: string;
  currentMedicines: string;
  knownAllergies: string;
  previousConditions: string;
  importantMissingInfo: string[];
  
  // Triage & Routing
  redFlags: RedFlagAlert;
  recommendedDepartment: string;
  recommendedSpecialty: string;
  triageLevel: 'Routine' | 'Priority' | 'Emergency';
  
  // Workflow Status
  status: 'draft' | 'submitted' | 'reviewed' | 'consulted' | 'doctor_reviewed';
  
  // Doctor Review Section (Doctor in the loop)
  doctorNotes?: string;
  clinicalObservations?: string;
  provisionalDiagnosis?: string;
  prescribedAdvice?: string;
  followUpDate?: string;
  reviewedByDoctorId?: string;
  reviewedByDoctorName?: string;
  reviewedAt?: string;
  doctorReview?: {
    clinicalNotes?: string;
    provisionalDiagnosis?: string;
    prescribedAdvice?: string;
    followUpDate?: string;
    reviewedByDoctorId?: string;
    reviewedByDoctorName?: string;
    reviewedAt?: string;
  };
  
  // Offline sync metadata
  offlineSyncStatus?: 'synced' | 'local_draft' | 'syncing';
  
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  nameHindi: string;
  type: 'District Hospital' | 'AIIMS / Apex' | 'Community Health Centre (CHC)' | 'Primary Health Centre (PHC)' | 'Sub-Centre / Health Wellness Centre';
  district: string;
  state: string;
  address: string;
  contactPhone: string;
  emergencyPhone: string;
  distanceKm: number;
  ayushmanEmpaneled: boolean;
  facilities: string[];
  departments: string[];
  bedAvailability: {
    total: number;
    available: number;
    icuAvailable: number;
  };
  rating: number;
  timings: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  department: string;
  hospitalId: string;
  hospitalName: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  consultationFee: number;
  availableDays: string[];
  timeSlots: string[];
  opdRoom: string;
  avatar?: string;
}

export interface DigitalReceipt {
  qrCodePayload: string;
  issuedAt: string;
  tokenNumber: number;
  barcode: string;
  validDate: string;
}

export interface Appointment {
  id: string;
  registrationNumber: string; // e.g. AP-REG-2026-8834
  opdSlipNumber: string; // e.g. OPD-77291
  caseId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientUhid: string;
  patientAge: number;
  patientGender: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  timeSlot: string;
  opdRoom: string;
  status: 'Requested' | 'Confirmed' | 'Checked-in' | 'In Consultation' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No-show';
  digitalReceipt: DigitalReceipt;
  notes?: string;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Scan/X-Ray' | 'Discharge Summary' | 'Other';
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  fileUrl: string;
  fileType: string;
  summary?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  role?: UserRole;
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  type: 'appointment' | 'case_reviewed' | 'emergency' | 'sync' | 'reminder';
  read: boolean;
  timestamp: string;
  linkAction?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}
