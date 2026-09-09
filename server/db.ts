import fs from 'fs';
import path from 'path';
import { 
  User, 
  PatientProfile, 
  CaseRecord, 
  Hospital, 
  Doctor, 
  Appointment, 
  AppNotification, 
  AuditLog,
  MedicalReport
} from '../src/types';

interface DatabaseSchema {
  users: User[];
  patients: PatientProfile[];
  cases: CaseRecord[];
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: Appointment[];
  reports: MedicalReport[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

// Generate comprehensive rich seed data
export function generateRichSeedData(): DatabaseSchema {
  return {
    users: [
      {
        id: 'usr_pat_1',
        name: 'Ramesh Kumar',
        email: 'ramesh.kumar@arogyapath.org',
        phone: '+91 98765 43210',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Shivpur, Varanasi'
      },
      {
        id: 'usr_pat_2',
        name: 'Geeta Devi',
        email: 'geeta.devi@arogyapath.org',
        phone: '+91 97654 32109',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Cholapur, Varanasi'
      },
      {
        id: 'usr_pat_3',
        name: 'Anil Yadav',
        email: 'anil.yadav@arogyapath.org',
        phone: '+91 96543 21098',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Kashi Vidyapeeth, Varanasi'
      },
      {
        id: 'usr_pat_4',
        name: 'Meena Kumari',
        email: 'meena.kumari@arogyapath.org',
        phone: '+91 95432 10987',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Ramnagar, Varanasi'
      },
      {
        id: 'usr_pat_5',
        name: 'Mohd. Tariq',
        email: 'tariq.ansari@arogyapath.org',
        phone: '+91 94321 09876',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'en',
        assignedVillage: 'Madanpura, Varanasi'
      },
      {
        id: 'usr_pat_6',
        name: 'Kamla Devi',
        email: 'kamla.devi@arogyapath.org',
        phone: '+91 93210 98765',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Pindra, Varanasi'
      },
      {
        id: 'usr_doc_1',
        name: 'Dr. Anita Sharma',
        email: 'anita.sharma@arogyapath.org',
        phone: '+91 94152 11223',
        role: 'doctor',
        specialty: 'General Medicine & Infectious Diseases',
        qualification: 'MBBS, MD (General Medicine) - IMS BHU',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'en'
      },
      {
        id: 'usr_doc_2',
        name: 'Dr. Manoj Tripathi',
        email: 'manoj.tripathi@arogyapath.org',
        phone: '+91 94153 22334',
        role: 'doctor',
        specialty: 'Interventional Cardiology',
        qualification: 'MBBS, MD, DM (Cardiology)',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'en'
      },
      {
        id: 'usr_doc_3',
        name: 'Dr. S. K. Pathak',
        email: 'sk.pathak@arogyapath.org',
        phone: '+91 94154 33445',
        role: 'doctor',
        specialty: 'Pulmonology & Respiratory Medicine',
        qualification: 'MBBS, DTCD, MD (Chest Diseases)',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi'
      },
      {
        id: 'usr_doc_4',
        name: 'Dr. Priya Nambiar',
        email: 'priya.nambiar@arogyapath.org',
        phone: '+91 94155 44556',
        role: 'doctor',
        specialty: 'Maternal Health & High-Risk Pregnancy',
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        hospitalId: 'hosp_3',
        hospitalName: 'CHC Cholapur',
        avatar: 'https://images.unsplash.com/photo-1594824813628-98e6c466e300?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'en'
      },
      {
        id: 'usr_doc_5',
        name: 'Dr. Alok Srivastava',
        email: 'alok.srivastava@arogyapath.org',
        phone: '+91 94156 55667',
        role: 'doctor',
        specialty: 'Primary Care & Family Medicine',
        qualification: 'MBBS (General Practitioner)',
        hospitalId: 'hosp_4',
        hospitalName: 'PHC Shivpur',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi'
      },
      {
        id: 'usr_doc_6',
        name: 'Dr. Renu Gupta',
        email: 'renu.gupta@arogyapath.org',
        phone: '+91 94157 66778',
        role: 'doctor',
        specialty: 'Pediatrics & Neonatology',
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi'
      },
      {
        id: 'usr_hw_1',
        name: 'Sunita Devi',
        email: 'sunita.asha@arogyapath.org',
        phone: '+91 91234 56789',
        role: 'health_worker',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Shivpur Sub-Centre, Varanasi'
      },
      {
        id: 'usr_hw_2',
        name: 'Kiran Maurya',
        email: 'kiran.asha@arogyapath.org',
        phone: '+91 91234 56790',
        role: 'health_worker',
        avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
        languagePreference: 'hi',
        assignedVillage: 'Cholapur Sector 2, Varanasi'
      },
      {
        id: 'usr_hosp_1',
        name: 'Dr. Vikram Malhotra',
        email: 'admin.dhv@arogyapath.org',
        phone: '+91 98390 99887',
        role: 'hospital_admin',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        languagePreference: 'en'
      },
      {
        id: 'usr_admin_1',
        name: 'Rajesh Verma',
        email: 'system.admin@arogyapath.org',
        phone: '+91 99887 66554',
        role: 'admin',
        languagePreference: 'en'
      }
    ],

    patients: [
      {
        id: 'pat_1',
        userId: 'usr_pat_1',
        uhid: 'ABHA-91-4821-3942-12',
        name: 'Ramesh Kumar',
        age: 48,
        gender: 'Male',
        contact: '+91 98765 43210',
        address: {
          village: 'Shivpur Rural',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221003'
        },
        emergencyContact: {
          name: 'Suman Devi',
          relation: 'Wife',
          phone: '+91 98765 43211'
        },
        bloodGroup: 'B+',
        allergies: ['Penicillin'],
        existingConditions: ['Type 2 Diabetes (5 yrs)', 'Mild Hypertension'],
        currentMedicines: ['Metformin 500mg (twice daily)', 'Amlodipine 5mg (morning)'],
        previousSurgeries: ['Appendectomy (2014)'],
        familyHistory: 'Father had hypertension and stroke',
        createdAt: '2026-08-15T09:30:00Z'
      },
      {
        id: 'pat_2',
        userId: 'usr_pat_2',
        uhid: 'ABHA-91-2294-8172-55',
        name: 'Geeta Devi',
        age: 34,
        gender: 'Female',
        contact: '+91 97654 32109',
        address: {
          village: 'Cholapur',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221101'
        },
        emergencyContact: {
          name: 'Ram Prasad',
          relation: 'Husband',
          phone: '+91 97654 32108'
        },
        bloodGroup: 'O+',
        allergies: ['Sulfa drugs'],
        existingConditions: ['Iron Deficiency Anemia (Hb 8.2 g/dL)'],
        currentMedicines: ['Ferrous Ascorbate + Folic Acid tablets'],
        previousSurgeries: [],
        createdAt: '2026-08-20T11:00:00Z'
      },
      {
        id: 'pat_3',
        userId: 'usr_pat_3',
        uhid: 'ABHA-91-7731-9024-88',
        name: 'Anil Yadav',
        age: 26,
        gender: 'Male',
        contact: '+91 96543 21098',
        address: {
          village: 'Kashi Vidyapeeth',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221002'
        },
        emergencyContact: {
          name: 'Dinesh Yadav',
          relation: 'Brother',
          phone: '+91 96543 21099'
        },
        bloodGroup: 'A+',
        allergies: [],
        existingConditions: [],
        currentMedicines: [],
        previousSurgeries: [],
        createdAt: '2026-09-01T08:15:00Z'
      },
      {
        id: 'pat_4',
        userId: 'usr_pat_4',
        uhid: 'ABHA-91-6152-4419-73',
        name: 'Meena Kumari',
        age: 52,
        gender: 'Female',
        contact: '+91 95432 10987',
        address: {
          village: 'Ramnagar Rural',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221008'
        },
        emergencyContact: {
          name: 'Suresh Maurya',
          relation: 'Son',
          phone: '+91 95432 10988'
        },
        bloodGroup: 'AB+',
        allergies: ['Dust & Smoke hyper-reactivity'],
        existingConditions: ['Chronic Bronchial Asthma (12 yrs)', 'Mild Osteoporosis'],
        currentMedicines: ['Budesonide + Formoterol Inhaler 200/6mcg', 'Calcium + Vitamin D3'],
        previousSurgeries: ['Cholecystectomy (2021)'],
        createdAt: '2026-08-10T10:00:00Z'
      },
      {
        id: 'pat_5',
        userId: 'usr_pat_5',
        uhid: 'ABHA-91-8823-1194-66',
        name: 'Mohd. Tariq',
        age: 41,
        gender: 'Male',
        contact: '+91 94321 09876',
        address: {
          village: 'Madanpura Ward 4',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221001'
        },
        emergencyContact: {
          name: 'Fatima Begum',
          relation: 'Wife',
          phone: '+91 94321 09877'
        },
        bloodGroup: 'O-',
        allergies: ['Aspirin (gastric bleeding history)'],
        existingConditions: ['Essential Hypertension (8 yrs)', 'Dyslipidemia'],
        currentMedicines: ['Telmisartan 40mg', 'Atorvastatin 10mg'],
        previousSurgeries: [],
        createdAt: '2026-08-05T14:30:00Z'
      },
      {
        id: 'pat_6',
        userId: 'usr_pat_6',
        uhid: 'ABHA-91-3341-7890-21',
        name: 'Kamla Devi',
        age: 68,
        gender: 'Female',
        contact: '+91 93210 98765',
        address: {
          village: 'Pindra Village',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221206'
        },
        emergencyContact: {
          name: 'Mahesh Pandey',
          relation: 'Son',
          phone: '+91 93210 98766'
        },
        bloodGroup: 'B+',
        allergies: [],
        existingConditions: ['Bilateral Knee Osteoarthritis Grade III', 'Hypertension'],
        currentMedicines: ['Amlodipine 5mg', 'Paracetamol SOS', 'Glucosamine'],
        previousSurgeries: ['Cataract surgery right eye (2023)'],
        createdAt: '2026-07-28T09:00:00Z'
      },
      {
        id: 'pat_7',
        uhid: 'ABHA-91-9982-4512-34',
        name: 'Master Aarav Patel',
        age: 6,
        gender: 'Male',
        contact: '+91 92109 87654',
        address: {
          village: 'Shivpur Sector 1',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221003'
        },
        emergencyContact: {
          name: 'Neelam Patel',
          relation: 'Mother',
          phone: '+91 92109 87654'
        },
        bloodGroup: 'A+',
        allergies: [],
        existingConditions: [],
        currentMedicines: ['Zinc oral drops', 'ORS electrolytes'],
        previousSurgeries: [],
        createdAt: '2026-09-05T11:00:00Z'
      },
      {
        id: 'pat_8',
        uhid: 'ABHA-91-1123-6789-90',
        name: 'Pooja Verma',
        age: 23,
        gender: 'Female',
        contact: '+91 91098 76543',
        address: {
          village: 'Cholapur Main',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221101'
        },
        emergencyContact: {
          name: 'Amit Verma',
          relation: 'Husband',
          phone: '+91 91098 76542'
        },
        bloodGroup: 'O+',
        allergies: [],
        existingConditions: ['Primigravida (28 Weeks Gestation)'],
        currentMedicines: ['Iron Folic Acid OD', 'Calcium + Vit D3 OD'],
        previousSurgeries: [],
        createdAt: '2026-09-02T16:00:00Z'
      }
    ],

    hospitals: [
      {
        id: 'hosp_1',
        name: 'District Hospital Varanasi (Pt. Deen Dayal Upadhyaya)',
        nameHindi: 'जिला चिकित्सालय वाराणसी (पं. दीनदयाल उपाध्याय)',
        type: 'District Hospital',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Pandeypur, Varanasi, UP 221002',
        contactPhone: '+91 542 2508101',
        emergencyPhone: '108 / +91 542 2508100',
        distanceKm: 4.8,
        ayushmanEmpaneled: true,
        facilities: ['24x7 Emergency', 'ICU & Ventilators', 'Pathology Lab', 'Digital X-Ray & CT', 'Dialysis Unit', 'Free Generic Pharmacy (Jan Aushadhi)'],
        departments: ['General Medicine', 'Pulmonology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'Cardiology', 'Ophthalmology', 'Dermatology'],
        bedAvailability: {
          total: 250,
          available: 46,
          icuAvailable: 7
        },
        rating: 4.7,
        timings: 'OPD: 8:00 AM - 2:00 PM (Mon-Sat)'
      },
      {
        id: 'hosp_2',
        name: 'AIIMS - Apex Regional Medical Centre',
        nameHindi: 'एम्स (अखिल भारतीय आयुर्विज्ञान संस्थान) रीजनल सेंटर',
        type: 'AIIMS / Apex',
        district: 'Varanasi/Regional',
        state: 'Uttar Pradesh',
        address: 'Medical Enclave, Apex Hub, UP',
        contactPhone: '+91 11 26588500',
        emergencyPhone: '102 / 108',
        distanceKm: 14.2,
        ayushmanEmpaneled: true,
        facilities: ['Super Specialty OPD', 'Trauma Centre Level 1', 'Advanced 3T MRI/CT', 'Cath Lab', 'Blood Component Centre', 'National Tele-Consultation'],
        departments: ['General Medicine', 'Cardiology', 'Neurology', 'Pulmonology', 'Nephrology', 'General Surgery', 'Endocrinology', 'Pediatrics'],
        bedAvailability: {
          total: 600,
          available: 84,
          icuAvailable: 16
        },
        rating: 4.9,
        timings: 'OPD: 8:30 AM - 3:30 PM (Mon-Fri)'
      },
      {
        id: 'hosp_3',
        name: 'Community Health Centre (CHC) Cholapur',
        nameHindi: 'सामुदायिक स्वास्थ्य केंद्र (सीएचसी) चोलापुर',
        type: 'Community Health Centre (CHC)',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Cholapur Main Road, Varanasi Rural, UP 221101',
        contactPhone: '+91 542 2614220',
        emergencyPhone: '108',
        distanceKm: 8.5,
        ayushmanEmpaneled: true,
        facilities: ['Basic Emergency', 'OPD Clinic', '24x7 Delivery Room', 'Primary Lab Testing', 'Immunization Hub', 'Free Pharmacy'],
        departments: ['General Medicine', 'Pediatrics', 'Gynecology & Obstetrics', 'Dental'],
        bedAvailability: {
          total: 30,
          available: 12,
          icuAvailable: 1
        },
        rating: 4.3,
        timings: 'OPD: 8:00 AM - 2:00 PM'
      },
      {
        id: 'hosp_4',
        name: 'Primary Health Centre (PHC) Shivpur',
        nameHindi: 'प्राथमिक स्वास्थ्य केंद्र (पीएचसी) शिवपुर',
        type: 'Primary Health Centre (PHC)',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Near Old Police Outpost, Shivpur, Varanasi 221003',
        contactPhone: '+91 542 2280199',
        emergencyPhone: '108',
        distanceKm: 1.8,
        ayushmanEmpaneled: true,
        facilities: ['Primary OPD', 'Fever & Cold Clinic', 'Maternal Health', 'DOTS TB Center', 'Essential Medicines Counter'],
        departments: ['General Medicine', 'Family Welfare'],
        bedAvailability: {
          total: 12,
          available: 6,
          icuAvailable: 0
        },
        rating: 4.2,
        timings: 'OPD: 9:00 AM - 2:00 PM'
      },
      {
        id: 'hosp_5',
        name: 'Sub-District Hospital (SDH) Ramnagar',
        nameHindi: 'उप जिला चिकित्सालय रामनगर',
        type: 'District Hospital',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        address: 'Fort Road, Ramnagar, Varanasi 221008',
        contactPhone: '+91 542 2670112',
        emergencyPhone: '108',
        distanceKm: 11.0,
        ayushmanEmpaneled: true,
        facilities: ['Emergency Ward', 'General Surgery', 'Obstetric OT', 'Ultrasonography', 'X-Ray', 'Blood Storage'],
        departments: ['General Medicine', 'General Surgery', 'Gynecology', 'Pediatrics', 'Orthopedics'],
        bedAvailability: {
          total: 100,
          available: 22,
          icuAvailable: 3
        },
        rating: 4.4,
        timings: 'OPD: 8:00 AM - 2:00 PM'
      }
    ],

    doctors: [
      {
        id: 'doc_1',
        name: 'Dr. Anita Sharma',
        qualification: 'MBBS, MD (General Medicine)',
        specialty: 'General Medicine & Infectious Diseases',
        department: 'General Medicine',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        experienceYears: 14,
        languages: ['Hindi', 'Bhojpuri', 'English'],
        rating: 4.8,
        consultationFee: 0,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        timeSlots: ['08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM', '01:00 PM'],
        opdRoom: 'OPD Room 104 (Ground Floor)',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_2',
        name: 'Dr. Manoj Tripathi',
        qualification: 'MBBS, MD, DM (Cardiology)',
        specialty: 'Interventional Cardiology & Preventive Heart Care',
        department: 'Cardiology',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        experienceYears: 18,
        languages: ['Hindi', 'English'],
        rating: 4.9,
        consultationFee: 0,
        availableDays: ['Mon', 'Wed', 'Fri'],
        timeSlots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM'],
        opdRoom: 'OPD Room 208 (Cardiology Wing)',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_3',
        name: 'Dr. S. K. Pathak',
        qualification: 'MBBS, DTCD, MD (Chest & Respiratory Diseases)',
        specialty: 'Pulmonology, Asthma & COPD',
        department: 'Pulmonology',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        experienceYears: 12,
        languages: ['Hindi', 'Bhojpuri', 'English'],
        rating: 4.7,
        consultationFee: 0,
        availableDays: ['Tue', 'Thu', 'Sat'],
        timeSlots: ['08:45 AM', '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '12:30 PM'],
        opdRoom: 'OPD Room 112 (Chest Clinic)',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_4',
        name: 'Dr. Priya Nambiar',
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        specialty: 'Maternal Health & High-Risk Pregnancy',
        department: 'Gynecology',
        hospitalId: 'hosp_3',
        hospitalName: 'CHC Cholapur',
        experienceYears: 10,
        languages: ['Hindi', 'English', 'Malayalam'],
        rating: 4.7,
        consultationFee: 0,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'],
        opdRoom: 'MCH Wing Room 3',
        avatar: 'https://images.unsplash.com/photo-1594824813628-98e6c466e300?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_5',
        name: 'Dr. Alok Srivastava',
        qualification: 'MBBS (General Practitioner)',
        specialty: 'Primary Care & Family Medicine',
        department: 'General Medicine',
        hospitalId: 'hosp_4',
        hospitalName: 'PHC Shivpur',
        experienceYears: 8,
        languages: ['Hindi', 'Bhojpuri'],
        rating: 4.5,
        consultationFee: 0,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        timeSlots: ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '12:30 PM', '01:15 PM'],
        opdRoom: 'Doctor Cabin 1',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_6',
        name: 'Dr. Renu Gupta',
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        specialty: 'Pediatrics, Child Nutrition & Neonatal Care',
        department: 'Pediatrics',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        experienceYears: 11,
        languages: ['Hindi', 'English'],
        rating: 4.8,
        consultationFee: 0,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        timeSlots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM', '12:45 PM'],
        opdRoom: 'Pediatric Clinic Room 102',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'doc_7',
        name: 'Dr. Harsh Vardhan Singh',
        qualification: 'MBBS, MS (Orthopedics)',
        specialty: 'Trauma, Joint Replacement & Spine Care',
        department: 'Orthopedics',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        experienceYears: 16,
        languages: ['Hindi', 'English'],
        rating: 4.9,
        consultationFee: 0,
        availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
        timeSlots: ['08:30 AM', '09:15 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        opdRoom: 'Orthopedic OPD Room 204',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
      }
    ],

    cases: [
      {
        id: 'case_101',
        patientId: 'pat_1',
        patientName: 'Ramesh Kumar',
        patientAge: 48,
        patientGender: 'Male',
        patientUhid: 'ABHA-91-4821-3942-12',
        healthWorkerId: 'usr_hw_1',
        healthWorkerName: 'Sunita Devi (ASHA)',
        createdByRole: 'health_worker',
        originalStatement: 'चार दिन से बहुत तेज बुखार आ रहा है, ठंड लगकर कंपकंपी होती है। शाम को बुखार 102 डिग्री तक पहुंच जाता है। सिर में तेज दर्द है और बदन टूट रहा है। भूख बिल्कुल नहीं लग रही है और कमजोरी से चक्कर आ रहा है। पेरासिटामोल लेने पर थोड़ा आराम मिलता है पर 4-5 घंटे बाद फिर चढ़ जाता है।',
        language: 'hi',
        chiefComplaint: 'High-grade fever with chills and rigor, severe myalgia, and profound weakness for 4 days.',
        symptoms: [
          { name: 'Fever with chills & rigor', nameHindi: 'ठंड लगकर तेज बुखार', severity: 'severe', duration: '4 days', notes: 'Peaks in evenings up to 102°F, temporarily relieved with paracetamol' },
          { name: 'Severe headache & body ache', nameHindi: 'सिरदर्द एवं बदन दर्द', severity: 'moderate', duration: '4 days', notes: 'Generalized throbbing pain' },
          { name: 'Loss of appetite (Anorexia)', nameHindi: 'भूख न लगना', severity: 'moderate', duration: '3 days' },
          { name: 'Dizziness & generalized asthenia', nameHindi: 'चक्कर आना एवं भारी कमजोरी', severity: 'moderate', duration: '2 days' }
        ],
        overallDuration: '4 days',
        duration: '4 days',
        severityScore: 7,
        severityLevel: 'Moderate',
        relevantHistory: 'Known Type 2 Diabetes for 5 years on oral hypoglycemics. Last HbA1c 7.8% (3 months ago).',
        currentMedicines: 'Metformin 500mg BD, Amlodipine 5mg OD, Paracetamol 650mg SOS',
        knownAllergies: 'Penicillin (developed skin rashes in 2018)',
        previousConditions: 'Type 2 Diabetes Mellitus, Mild Systemic Hypertension',
        importantMissingInfo: [
          'Recent random blood glucose (RBS) level',
          'Platelet count & Dengue NS1/Malaria MP slide report',
          'Blood pressure reading today'
        ],
        redFlags: {
          detected: false,
          severityLevel: 'Moderate',
          reason: 'Diabetic patient with high persistent fever needs early clinical evaluation to prevent diabetic ketoacidosis or secondary sepsis.'
        },
        recommendedDepartment: 'General Medicine',
        recommendedSpecialty: 'Internal Medicine / Infectious Disease Clinic',
        triageLevel: 'Priority',
        status: 'submitted',
        offlineSyncStatus: 'synced',
        createdAt: '2026-09-07T14:20:00Z',
        updatedAt: '2026-09-07T14:25:00Z'
      },
      {
        id: 'case_102',
        patientId: 'pat_2',
        patientName: 'Geeta Devi',
        patientAge: 34,
        patientGender: 'Female',
        patientUhid: 'ABHA-91-2294-8172-55',
        createdByRole: 'patient',
        originalStatement: 'I have had continuous dull lower abdominal pain for the last 10 days along with unusual fatigue and breathlessness while walking uphill in the village.',
        language: 'en',
        chiefComplaint: 'Lower abdominal dull aching pain for 10 days with exertional dyspnea and chronic pallor.',
        symptoms: [
          { name: 'Lower abdominal pain', severity: 'moderate', duration: '10 days', notes: 'Constant dull ache, non-radiating' },
          { name: 'Fatigue and pallor', severity: 'moderate', duration: '3 weeks', notes: 'Worsening lethargy' },
          { name: 'Shortness of breath on exertion', severity: 'mild', duration: '1 week', notes: 'Upon climbing stairs or carrying water' }
        ],
        overallDuration: '10 days',
        duration: '10 days',
        severityScore: 5,
        severityLevel: 'Moderate',
        relevantHistory: 'Known chronic iron deficiency anemia. G2P2.',
        currentMedicines: 'Iron and folic acid tablets',
        knownAllergies: 'Sulfa antibiotics',
        previousConditions: 'Anemia',
        importantMissingInfo: ['Complete Blood Count (CBC) with Serum Ferritin', 'Pelvic Ultrasound (USG)'],
        redFlags: {
          detected: false,
          severityLevel: 'Low'
        },
        recommendedDepartment: 'Gynecology',
        recommendedSpecialty: 'Obstetrics & Gynecology / Primary Care',
        triageLevel: 'Routine',
        status: 'doctor_reviewed',
        doctorNotes: 'Patient examined in OPD. Marked conjunctival pallor noted. Abdomen soft, tenderness localized to hypogastrium. Advised urgent CBC, USG Abdomen/Pelvis and stool for occult blood.',
        clinicalObservations: 'Pallor +++, BP 110/70 mmHg, Pulse 88/min, Afebrile, SpO2 98%',
        provisionalDiagnosis: 'Severe Microcytic Hypochromic Anemia with suspected pelvic inflammatory condition',
        prescribedAdvice: '1. Tab Doxycycline 100mg BD x 14 days\n2. Tab Metronidazole 400mg TDS x 10 days\n3. Inj Iron Sucrose IV infusion planned after CBC report\n4. Review in OPD with USG and CBC on Friday',
        followUpDate: '2026-09-12',
        reviewedByDoctorId: 'doc_4',
        reviewedByDoctorName: 'Dr. Priya Nambiar',
        reviewedAt: '2026-09-08T10:15:00Z',
        doctorReview: {
          clinicalNotes: 'Pallor +++, BP 110/70 mmHg, Abdomen soft, hypogastric tenderness.',
          provisionalDiagnosis: 'Severe Anemia (Microcytic) with Pelvic Inflammatory Disease',
          prescribedAdvice: 'Tab Doxycycline 100mg BD, Tab Metronidazole 400mg TDS, Iron Sucrose infusion.',
          followUpDate: '2026-09-12',
          reviewedByDoctorId: 'doc_4',
          reviewedByDoctorName: 'Dr. Priya Nambiar',
          reviewedAt: '2026-09-08T10:15:00Z'
        },
        offlineSyncStatus: 'synced',
        createdAt: '2026-09-06T11:00:00Z',
        updatedAt: '2026-09-08T10:15:00Z'
      },
      {
        id: 'case_103',
        patientId: 'pat_4',
        patientName: 'Meena Kumari',
        patientAge: 52,
        patientGender: 'Female',
        patientUhid: 'ABHA-91-6152-4419-73',
        createdByRole: 'patient',
        originalStatement: 'पिछले 3 दिनों से खांसी बहुत बढ़ गई है और सांस लेने में सीटी जैसी आवाज (wheezing) आ रही है। रात को उठकर बैठना पड़ता है। इनहेलर लेने से भी पूरी राहत नहीं मिल रही है।',
        language: 'hi',
        chiefComplaint: 'Acute exacerbation of bronchial asthma with nocturnal dyspnea and audible wheezing for 3 days.',
        symptoms: [
          { name: 'Shortness of breath (Dyspnea)', nameHindi: 'सांस फूलना', severity: 'severe', duration: '3 days', notes: 'Severe at night, orthopneic posturing' },
          { name: 'Wheezing sound', nameHindi: 'सांस में सीटी जैसी आवाज', severity: 'severe', duration: '3 days' },
          { name: 'Productive cough with whitish phlegm', nameHindi: 'सफेद बलगम वाली खांसी', severity: 'moderate', duration: '5 days' }
        ],
        overallDuration: '3 days',
        duration: '3 days',
        severityScore: 8,
        severityLevel: 'Severe',
        relevantHistory: 'Known bronchial asthma for 12 years. Non-smoker, wood-stove cooking exposure.',
        currentMedicines: 'Budesonide + Formoterol inhaler',
        knownAllergies: 'Smoke, Dust',
        previousConditions: 'Bronchial Asthma',
        importantMissingInfo: ['SpO2 reading', 'Peak Expiratory Flow Rate (PEFR)', 'Chest X-Ray'],
        redFlags: {
          detected: true,
          severityLevel: 'High',
          reason: 'Severe nocturnal breathlessness with poor inhaler response indicates acute bronchospasm needing immediate nebulization.'
        },
        recommendedDepartment: 'Pulmonology',
        recommendedSpecialty: 'Chest & Respiratory Medicine',
        triageLevel: 'Emergency',
        status: 'submitted',
        offlineSyncStatus: 'synced',
        createdAt: '2026-09-08T07:30:00Z',
        updatedAt: '2026-09-08T07:35:00Z'
      },
      {
        id: 'case_104',
        patientId: 'pat_5',
        patientName: 'Mohd. Tariq',
        patientAge: 41,
        patientGender: 'Male',
        patientUhid: 'ABHA-91-8823-1194-66',
        createdByRole: 'patient',
        originalStatement: 'सीने में भारीपन और बेचैनी महसूस हो रही है जो बाएं कंधे की तरफ खिंचती है। पसीना बहुत आ रहा है। यह 2 घंटे पहले तेज चलने के बाद शुरू हुआ।',
        language: 'hi',
        chiefComplaint: 'Retrosternal chest heaviness radiating to left shoulder with diaphoresis of 2 hours duration.',
        symptoms: [
          { name: 'Chest heaviness & squeezing', nameHindi: 'सीने में भारीपन व जकड़न', severity: 'severe', duration: '2 hours', notes: 'Substernal, radiates to left arm' },
          { name: 'Cold sweats (Diaphoresis)', nameHindi: 'ठंडा पसीना आना', severity: 'severe', duration: '2 hours' },
          { name: 'Mild breathlessness', nameHindi: 'हल्की सांस फूलना', severity: 'moderate', duration: '2 hours' }
        ],
        overallDuration: '2 hours',
        duration: '2 hours',
        severityScore: 9,
        severityLevel: 'Critical',
        relevantHistory: 'Hypertensive for 8 years, Smoker (10 pack-years), high cholesterol.',
        currentMedicines: 'Telmisartan 40mg',
        knownAllergies: 'Aspirin allergy',
        previousConditions: 'Hypertension, Dyslipidemia',
        importantMissingInfo: ['Immediate 12-Lead ECG', 'Serum Troponin-I / Trop-T', 'Emergency BP'],
        redFlags: {
          detected: true,
          severityLevel: 'Emergency',
          reason: 'RED FLAG: Acute coronary syndrome / myocardial infarction presentation. Immediate 108 Emergency Ambulance indicated.'
        },
        recommendedDepartment: 'Cardiology',
        recommendedSpecialty: 'Interventional Cardiology / Emergency Ward',
        triageLevel: 'Emergency',
        status: 'submitted',
        offlineSyncStatus: 'synced',
        createdAt: '2026-09-08T08:15:00Z',
        updatedAt: '2026-09-08T08:20:00Z'
      },
      {
        id: 'case_105',
        patientId: 'pat_6',
        patientName: 'Kamla Devi',
        patientAge: 68,
        patientGender: 'Female',
        patientUhid: 'ABHA-91-3341-7890-21',
        healthWorkerId: 'usr_hw_1',
        healthWorkerName: 'Sunita Devi (ASHA)',
        createdByRole: 'health_worker',
        originalStatement: 'दोनों घुटनों में पिछले 6 महीने से बहुत ज्यादा दर्द रहता है। जमीन पर बैठ नहीं पातीं और उठने पर कट-कट की आवाज आती है। सुबह उठने पर अकड़न रहती है।',
        language: 'hi',
        chiefComplaint: 'Bilateral knee pain and crepitus with morning stiffness and restricted mobility for 6 months.',
        symptoms: [
          { name: 'Bilateral knee joint pain', nameHindi: 'दोनों घुटनों में दर्द', severity: 'moderate', duration: '6 months', notes: 'Aggravated by standing and walking' },
          { name: 'Joint crepitus & swelling', nameHindi: 'घुटनों में सूजन व आवाज', severity: 'moderate', duration: '4 months' },
          { name: 'Morning stiffness (15 mins)', nameHindi: 'सुबह जोड़ों में अकड़न', severity: 'mild', duration: '6 months' }
        ],
        overallDuration: '6 months',
        duration: '6 months',
        severityScore: 5,
        severityLevel: 'Moderate',
        relevantHistory: 'Known severe osteoarthritis, post-menopausal, BMI 29.',
        currentMedicines: 'Amlodipine 5mg, Paracetamol SOS',
        knownAllergies: 'None reported',
        previousConditions: 'Osteoarthritis, Hypertension',
        importantMissingInfo: ['Weight-bearing AP/Lateral Knee X-Rays', 'Serum Uric Acid'],
        redFlags: {
          detected: false,
          severityLevel: 'Low'
        },
        recommendedDepartment: 'Orthopedics',
        recommendedSpecialty: 'Joint & Knee Specialist',
        triageLevel: 'Routine',
        status: 'submitted',
        offlineSyncStatus: 'synced',
        createdAt: '2026-09-06T15:00:00Z',
        updatedAt: '2026-09-06T15:10:00Z'
      },
      {
        id: 'case_106',
        patientId: 'pat_7',
        patientName: 'Master Aarav Patel',
        patientAge: 6,
        patientGender: 'Male',
        patientUhid: 'ABHA-91-9982-4512-34',
        healthWorkerId: 'usr_hw_2',
        healthWorkerName: 'Kiran Maurya (ASHA)',
        createdByRole: 'health_worker',
        originalStatement: 'बच्चे को कल रात से 6-7 बार पानी जैसे पतले दस्त हुए हैं और दो बार उल्टी हुई है। आंखें अंदर धंसी लग रही हैं और पेशाब कम आ रहा है। चिड़चिड़ा हो रहा है।',
        language: 'hi',
        chiefComplaint: 'Acute watery diarrhea (6-7 episodes) and vomiting with signs of moderate dehydration in 6-year-old child.',
        symptoms: [
          { name: 'Watery diarrhea', nameHindi: 'पानी जैसे पतले दस्त', severity: 'severe', duration: '24 hours', notes: '6-7 loose watery stools' },
          { name: 'Vomiting', nameHindi: 'उल्टी', severity: 'moderate', duration: '12 hours', notes: '2 episodes' },
          { name: 'Decreased urine output & sunken eyes', nameHindi: 'पेशाब कम होना व आंखें धंसना', severity: 'moderate', duration: '12 hours' }
        ],
        overallDuration: '1 day',
        duration: '1 day',
        severityScore: 7,
        severityLevel: 'Severe',
        relevantHistory: 'Fully immunized as per National Immunization Schedule (UIP). No prior chronic illness.',
        currentMedicines: 'Zinc syrup, ORS solution initiated at home',
        knownAllergies: 'None reported',
        previousConditions: 'None reported',
        importantMissingInfo: ['Accurate weight & hydration assessment', 'Stool routine/microscopy'],
        redFlags: {
          detected: true,
          severityLevel: 'High',
          reason: 'Pediatric dehydration risk. Requires urgent clinical hydration assessment and supervised oral rehydration therapy / IV fluids.'
        },
        recommendedDepartment: 'Pediatrics',
        recommendedSpecialty: 'Pediatric Care / ORS Corner',
        triageLevel: 'Priority',
        status: 'submitted',
        offlineSyncStatus: 'synced',
        createdAt: '2026-09-08T09:00:00Z',
        updatedAt: '2026-09-08T09:10:00Z'
      }
    ],

    appointments: [
      {
        id: 'apt_101',
        registrationNumber: 'AP-REG-2026-8834',
        opdSlipNumber: 'OPD-77291',
        caseId: 'case_101',
        patientId: 'pat_1',
        patientName: 'Ramesh Kumar',
        patientPhone: '+91 98765 43210',
        patientUhid: 'ABHA-91-4821-3942-12',
        patientAge: 48,
        patientGender: 'Male',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        department: 'General Medicine',
        doctorId: 'doc_1',
        doctorName: 'Dr. Anita Sharma',
        doctorSpecialty: 'General Medicine & Infectious Diseases',
        date: '2026-09-09',
        timeSlot: '09:15 AM',
        opdRoom: 'OPD Room 104 (Ground Floor)',
        status: 'Confirmed',
        digitalReceipt: {
          qrCodePayload: 'AROGYAPATH|APT-101|ABHA-91-4821-3942-12|HOSP-1|DOC-1|2026-09-09|09:15|TOKEN-14',
          issuedAt: '2026-09-07T14:30:00Z',
          tokenNumber: 14,
          barcode: 'AP8834914821',
          validDate: '2026-09-09'
        },
        notes: 'Priority consultation for fever with chills in diabetic patient.',
        createdAt: '2026-09-07T14:30:00Z'
      },
      {
        id: 'apt_102',
        registrationNumber: 'AP-REG-2026-5512',
        opdSlipNumber: 'OPD-61042',
        caseId: 'case_102',
        patientId: 'pat_2',
        patientName: 'Geeta Devi',
        patientPhone: '+91 97654 32109',
        patientUhid: 'ABHA-91-2294-8172-55',
        patientAge: 34,
        patientGender: 'Female',
        hospitalId: 'hosp_3',
        hospitalName: 'CHC Cholapur',
        department: 'Gynecology',
        doctorId: 'doc_4',
        doctorName: 'Dr. Priya Nambiar',
        doctorSpecialty: 'Maternal Health & High-Risk Pregnancy',
        date: '2026-09-08',
        timeSlot: '10:00 AM',
        opdRoom: 'MCH Wing Room 3',
        status: 'Completed',
        digitalReceipt: {
          qrCodePayload: 'AROGYAPATH|APT-102|ABHA-91-2294-8172-55|HOSP-3|DOC-4|2026-09-08|10:00|TOKEN-07',
          issuedAt: '2026-09-06T11:15:00Z',
          tokenNumber: 7,
          barcode: 'AP5512912294',
          validDate: '2026-09-08'
        },
        notes: 'Initial consultation completed. Tests ordered.',
        createdAt: '2026-09-06T11:15:00Z'
      },
      {
        id: 'apt_103',
        registrationNumber: 'AP-REG-2026-3391',
        opdSlipNumber: 'OPD-88204',
        caseId: 'case_103',
        patientId: 'pat_4',
        patientName: 'Meena Kumari',
        patientPhone: '+91 95432 10987',
        patientUhid: 'ABHA-91-6152-4419-73',
        patientAge: 52,
        patientGender: 'Female',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        department: 'Pulmonology',
        doctorId: 'doc_3',
        doctorName: 'Dr. S. K. Pathak',
        doctorSpecialty: 'Pulmonology, Asthma & COPD',
        date: '2026-09-09',
        timeSlot: '09:30 AM',
        opdRoom: 'OPD Room 112 (Chest Clinic)',
        status: 'Confirmed',
        digitalReceipt: {
          qrCodePayload: 'AROGYAPATH|APT-103|ABHA-91-6152-4419-73|HOSP-1|DOC-3|2026-09-09|09:30|TOKEN-03',
          issuedAt: '2026-09-08T07:40:00Z',
          tokenNumber: 3,
          barcode: 'AP3391916152',
          validDate: '2026-09-09'
        },
        notes: 'Emergency bronchospasm evaluation. Fast-track token.',
        createdAt: '2026-09-08T07:40:00Z'
      },
      {
        id: 'apt_104',
        registrationNumber: 'AP-REG-2026-7721',
        opdSlipNumber: 'OPD-91823',
        caseId: 'case_104',
        patientId: 'pat_5',
        patientName: 'Mohd. Tariq',
        patientPhone: '+91 94321 09876',
        patientUhid: 'ABHA-91-8823-1194-66',
        patientAge: 41,
        patientGender: 'Male',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        department: 'Cardiology',
        doctorId: 'doc_2',
        doctorName: 'Dr. Manoj Tripathi',
        doctorSpecialty: 'Interventional Cardiology & Preventive Heart Care',
        date: '2026-09-09',
        timeSlot: '09:00 AM',
        opdRoom: 'OPD Room 208 (Cardiology Wing)',
        status: 'Confirmed',
        digitalReceipt: {
          qrCodePayload: 'AROGYAPATH|APT-104|ABHA-91-8823-1194-66|HOSP-1|DOC-2|2026-09-09|09:00|TOKEN-01',
          issuedAt: '2026-09-08T08:25:00Z',
          tokenNumber: 1,
          barcode: 'AP7721918823',
          validDate: '2026-09-09'
        },
        notes: 'URGENT PRIORITY 1: Cardiac triage - Chest heaviness & sweating.',
        createdAt: '2026-09-08T08:25:00Z'
      },
      {
        id: 'apt_105',
        registrationNumber: 'AP-REG-2026-1182',
        opdSlipNumber: 'OPD-44192',
        caseId: 'case_105',
        patientId: 'pat_6',
        patientName: 'Kamla Devi',
        patientPhone: '+91 93210 98765',
        patientUhid: 'ABHA-91-3341-7890-21',
        patientAge: 68,
        patientGender: 'Female',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        department: 'Orthopedics',
        doctorId: 'doc_7',
        doctorName: 'Dr. Harsh Vardhan Singh',
        doctorSpecialty: 'Trauma, Joint Replacement & Spine Care',
        date: '2026-09-10',
        timeSlot: '10:00 AM',
        opdRoom: 'Orthopedic OPD Room 204',
        status: 'Confirmed',
        digitalReceipt: {
          qrCodePayload: 'AROGYAPATH|APT-105|ABHA-91-3341-7890-21|HOSP-1|DOC-7|2026-09-10|10:00|TOKEN-18',
          issuedAt: '2026-09-06T15:20:00Z',
          tokenNumber: 18,
          barcode: 'AP1182913341',
          validDate: '2026-09-10'
        },
        notes: 'Bilateral knee osteoarthritis examination and X-ray review.',
        createdAt: '2026-09-06T15:20:00Z'
      },
      {
        id: 'apt_106',
        registrationNumber: 'AP-REG-2026-4402',
        opdSlipNumber: 'OPD-33918',
        caseId: 'case_106',
        patientId: 'pat_7',
        patientName: 'Master Aarav Patel',
        patientPhone: '+91 92109 87654',
        patientUhid: 'ABHA-91-9982-4512-34',
        patientAge: 6,
        patientGender: 'Male',
        hospitalId: 'hosp_1',
        hospitalName: 'District Hospital Varanasi (Pt. Deen Dayal)',
        department: 'Pediatrics',
        doctorId: 'doc_6',
        doctorName: 'Dr. Renu Gupta',
        doctorSpecialty: 'Pediatrics, Child Nutrition & Neonatal Care',
        date: '2026-09-09',
        timeSlot: '09:45 AM',
        opdRoom: 'Pediatric Clinic Room 102',
        status: 'Confirmed',
        digitalReceipt: {
          qrCodePayload: 'AROGYAPATH|APT-106|ABHA-91-9982-4512-34|HOSP-1|DOC-6|2026-09-09|09:45|TOKEN-05',
          issuedAt: '2026-09-08T09:15:00Z',
          tokenNumber: 5,
          barcode: 'AP4402919982',
          validDate: '2026-09-09'
        },
        notes: 'Pediatric dehydration & diarrhea clinic priority token.',
        createdAt: '2026-09-08T09:15:00Z'
      }
    ],

    reports: [
      {
        id: 'rep_1',
        patientId: 'pat_1',
        title: 'HbA1c & Fasting Glucose Profile',
        category: 'Lab Report',
        uploadedBy: 'Dr. Anita Sharma',
        uploadedAt: '2026-06-14T10:00:00Z',
        fileSize: '1.2 MB',
        fileUrl: '/reports/hba1c_ramesh.pdf',
        fileType: 'application/pdf',
        summary: 'HbA1c: 7.8% (Fair Glycemic Control), Fasting Blood Glucose: 142 mg/dL, Post-Prandial: 198 mg/dL.'
      },
      {
        id: 'rep_2',
        patientId: 'pat_1',
        title: 'Discharge Summary - Appendectomy (2014)',
        category: 'Discharge Summary',
        uploadedBy: 'Patient Upload',
        uploadedAt: '2026-08-15T09:45:00Z',
        fileSize: '2.4 MB',
        fileUrl: '/reports/surgery_summary_2014.pdf',
        fileType: 'application/pdf',
        summary: 'Laparoscopic appendectomy performed without intraoperative complications. Complete recovery.'
      },
      {
        id: 'rep_3',
        patientId: 'pat_1',
        title: 'Complete Blood Count (CBC) & Dengue NS1',
        category: 'Lab Report',
        uploadedBy: 'District Hospital Pathology',
        uploadedAt: '2026-09-07T16:00:00Z',
        fileSize: '850 KB',
        fileUrl: '/reports/cbc_ramesh_sep2026.pdf',
        fileType: 'application/pdf',
        summary: 'Hemoglobin: 13.6 g/dL, Total Leukocyte Count (TLC): 9,800/cu.mm, Platelets: 1,65,000/cu.mm, Dengue NS1: Negative.'
      },
      {
        id: 'rep_4',
        patientId: 'pat_2',
        title: 'Hemoglobin & Iron Studies Report',
        category: 'Lab Report',
        uploadedBy: 'CHC Cholapur Lab',
        uploadedAt: '2026-09-06T12:30:00Z',
        fileSize: '920 KB',
        fileUrl: '/reports/iron_geeta.pdf',
        fileType: 'application/pdf',
        summary: 'Hemoglobin: 8.2 g/dL (Microcytic Hypochromic Anemia), Serum Ferritin: 9 ng/mL (Severely reduced).'
      },
      {
        id: 'rep_5',
        patientId: 'pat_4',
        title: 'Chest X-Ray (PA View)',
        category: 'Scan/X-Ray',
        uploadedBy: 'District Hospital Radiology',
        uploadedAt: '2026-09-07T11:00:00Z',
        fileSize: '3.1 MB',
        fileUrl: '/reports/chest_xray_meena.pdf',
        fileType: 'application/pdf',
        summary: 'Bilateral lung hyperinflation noted consistent with chronic asthma/COPD. No active consolidation or pleural effusion.'
      },
      {
        id: 'rep_6',
        patientId: 'pat_5',
        title: '12-Lead Electrocardiogram (ECG)',
        category: 'Scan/X-Ray',
        uploadedBy: 'Emergency Medicine Dept',
        uploadedAt: '2026-09-08T08:35:00Z',
        fileSize: '1.4 MB',
        fileUrl: '/reports/ecg_tariq.pdf',
        fileType: 'application/pdf',
        summary: 'Sinus rhythm, HR 88 bpm. ST segment depression 1.5mm in V4-V6, T wave inversion. High index of suspicion for Non-ST Elevation MI.'
      }
    ],

    notifications: [
      {
        id: 'notif_1',
        userId: 'usr_pat_1',
        role: 'patient',
        title: 'OPD Appointment Confirmed',
        titleHindi: 'ओपीडी अपॉइंटमेंट की पुष्टि',
        message: 'Your appointment with Dr. Anita Sharma at District Hospital Varanasi is scheduled for 09 Sep 2026 at 09:15 AM (Token #14).',
        messageHindi: 'जिला चिकित्सालय वाराणसी में डॉ. अनीता शर्मा के साथ आपका अपॉइंटमेंट 09 सितंबर 2026, सुबह 09:15 बजे (टोकन #14) निर्धारित है।',
        type: 'appointment',
        read: false,
        timestamp: '2026-09-07T14:30:00Z',
        linkAction: '/appointments'
      },
      {
        id: 'notif_2',
        userId: 'usr_doc_1',
        role: 'doctor',
        title: 'New AI-Structured Case Received',
        titleHindi: 'नया एआई-संरचित केस प्राप्त हुआ',
        message: 'ASHA worker Sunita Devi has referred patient Ramesh Kumar (Fever with chills, Diabetic). Priority triage assigned.',
        messageHindi: 'आशा कार्यकर्ता सुनीता देवी ने मरीज रमेश कुमार (बुखार, मधुमेह) को रेफर किया है। प्राथमिकता ट्रायज दिया गया है।',
        type: 'case_reviewed',
        read: false,
        timestamp: '2026-09-07T14:25:00Z',
        linkAction: '/doctor'
      },
      {
        id: 'notif_3',
        userId: 'usr_hw_1',
        role: 'health_worker',
        title: 'Case Synced with District Hospital',
        titleHindi: 'केस जिला अस्पताल के साथ सिंक हुआ',
        message: 'Case #case_101 for Ramesh Kumar successfully synced with Central Health Registry and appointment allocated.',
        messageHindi: 'रमेश कुमार का केस #case_101 केंद्रीय स्वास्थ्य रजिस्ट्री के साथ सफलतापूर्वक सिंक हो गया और टोकन आवंटित हुआ।',
        type: 'sync',
        read: true,
        timestamp: '2026-09-07T14:26:00Z'
      }
    ],

    auditLogs: [
      {
        id: 'audit_1',
        timestamp: '2026-09-07T14:20:00Z',
        actorId: 'usr_hw_1',
        actorName: 'Sunita Devi',
        actorRole: 'health_worker',
        action: 'CASE_CREATION',
        entityType: 'CaseRecord',
        entityId: 'case_101',
        details: 'Created and structured case for patient Ramesh Kumar (ABHA-91-4821-3942-12) via AI case-taking intake.'
      },
      {
        id: 'audit_2',
        timestamp: '2026-09-07T14:30:00Z',
        actorId: 'usr_hw_1',
        actorName: 'Sunita Devi',
        actorRole: 'health_worker',
        action: 'APPOINTMENT_BOOKED',
        entityType: 'Appointment',
        entityId: 'apt_101',
        details: 'Booked OPD slot with Dr. Anita Sharma at District Hospital Varanasi. Token #14 generated.'
      },
      {
        id: 'audit_3',
        timestamp: '2026-09-08T10:15:00Z',
        actorId: 'usr_doc_4',
        actorName: 'Dr. Priya Nambiar',
        actorRole: 'doctor',
        action: 'CLINICAL_NOTE_ADDED',
        entityType: 'CaseRecord',
        entityId: 'case_102',
        details: 'Recorded clinical observations, provisional diagnosis, and follow-up plan for Geeta Devi.'
      }
    ]
  };
}

const initialData: DatabaseSchema = generateRichSeedData();

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Memory cache
let dbCache: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;

  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      return dbCache!;
    }
  } catch (err) {
    console.error('Error reading database file, using fallback seed data:', err);
  }

  // Initialize with seed
  dbCache = JSON.parse(JSON.stringify(initialData));
  saveDatabase(dbCache!);
  return dbCache!;
}

export function resetToRichSeedData(): DatabaseSchema {
  const fresh = generateRichSeedData();
  saveDatabase(fresh);
  return fresh;
}

export function saveDatabase(data: DatabaseSchema): void {
  ensureDataDir();
  dbCache = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

export function addAuditLog(actor: { id: string; name: string; role: any }, action: string, entityType: string, entityId: string, details: string) {
  const db = getDatabase();
  const log: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType,
    entityId,
    details
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs.pop();
  }
  saveDatabase(db);
}
