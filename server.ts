import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  getDatabase, 
  saveDatabase, 
  addAuditLog,
  resetToRichSeedData 
} from './server/db';
import { 
  generateFollowUpQuestions, 
  structureCaseWithAI 
} from './server/gemini';
import { 
  CaseRecord, 
  Appointment, 
  PatientProfile, 
  MedicalReport 
} from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Session state tracker for active persona (defaults to Patient Ramesh Kumar)
  let activeUserId = 'usr_pat_1';

  // Current user helper
  function getCurrentUser() {
    const db = getDatabase();
    return db.users.find(u => u.id === activeUserId) || db.users[0];
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'ArogyaPath (आरोग्य पथ)' });
  });

  // Bootstrap data for frontend initialization
  app.get('/api/bootstrap', (req, res) => {
    const db = getDatabase();
    const currentUser = getCurrentUser();
    const userPatientProfile = db.patients.find(p => p.userId === currentUser.id || p.contact === currentUser.phone);
    const notifications = db.notifications.filter(n => n.userId === currentUser.id || !n.userId || n.role === currentUser.role);

    res.json({
      currentUser,
      userPatientProfile: userPatientProfile || null,
      hospitals: db.hospitals,
      doctors: db.doctors,
      unreadNotificationsCount: notifications.filter(n => !n.read).length
    });
  });

  // Switch demo persona (Instant 1-Click Persona switch for Hackathon presentation)
  app.post('/api/auth/switch-persona', (req, res) => {
    const { role, userId } = req.body;
    const db = getDatabase();
    let target = null;
    if (userId) {
      target = db.users.find(u => u.id === userId);
    } else if (role) {
      target = db.users.find(u => u.role === role);
    }

    if (!target) {
      return res.status(404).json({ error: 'Persona not found' });
    }

    activeUserId = target.id;
    addAuditLog(target, 'SWITCH_PERSONA', 'User', target.id, `User switched active persona to ${target.name} (${target.role})`);

    const userPatientProfile = db.patients.find(p => p.userId === target.id || p.contact === target.phone);
    res.json({
      success: true,
      currentUser: target,
      userPatientProfile: userPatientProfile || null
    });
  });

  // Authentication Login
  app.post('/api/auth/login', (req, res) => {
    const { identifier, email, phone, role } = req.body;
    const db = getDatabase();
    
    const query = (identifier || email || phone || '').trim().toLowerCase();

    // Find matching user by email, phone, name, or role
    let user = db.users.find(u => 
      (query && (u.email.toLowerCase() === query || u.phone.toLowerCase() === query || u.name.toLowerCase() === query))
    );

    if (!user && role) {
      user = db.users.find(u => u.role === role);
    }

    if (!user && query) {
      // Partial match
      user = db.users.find(u => u.email.toLowerCase().includes(query) || u.phone.includes(query) || u.name.toLowerCase().includes(query));
    }

    if (!user) {
      user = db.users[0]; // fallback to default patient
    }

    activeUserId = user.id;
    addAuditLog(user, 'USER_LOGIN', 'User', user.id, `${user.name} logged in successfully as ${user.role}`);

    const userPatientProfile = db.patients.find(p => p.userId === user.id || p.contact === user.phone);
    res.json({
      success: true,
      user,
      userPatientProfile: userPatientProfile || null
    });
  });

  // Authentication Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, role, languagePreference, village, specialty, qualification } = req.body;
    const db = getDatabase();

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || 'New User',
      email: email || `user_${Date.now()}@arogyapath.org`,
      phone: phone || '+91 99999 00000',
      role: role || 'patient',
      languagePreference: languagePreference || 'hi',
      assignedVillage: village,
      specialty,
      qualification
    };

    db.users.push(newUser);
    activeUserId = newUser.id;

    // If registered as patient, create corresponding patient profile
    let newProfile: PatientProfile | null = null;
    if (newUser.role === 'patient') {
      const randAbha = Math.floor(1000 + Math.random() * 9000);
      newProfile = {
        id: `pat_${Date.now()}`,
        userId: newUser.id,
        uhid: `ABHA-91-${randAbha}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`,
        name: newUser.name,
        age: req.body.age ? Number(req.body.age) : 35,
        gender: req.body.gender || 'Other',
        contact: newUser.phone,
        address: {
          village: village || 'Rural Sector',
          district: req.body.district || 'Varanasi',
          state: req.body.state || 'Uttar Pradesh',
          pincode: req.body.pincode || '221001'
        },
        emergencyContact: {
          name: req.body.emergencyName || 'Family Member',
          relation: req.body.emergencyRelation || 'Kin',
          phone: req.body.emergencyPhone || newUser.phone
        },
        bloodGroup: req.body.bloodGroup || 'B+',
        allergies: req.body.allergies ? String(req.body.allergies).split(',').map((s: string) => s.trim()) : [],
        existingConditions: req.body.existingConditions ? String(req.body.existingConditions).split(',').map((s: string) => s.trim()) : [],
        currentMedicines: req.body.currentMedicines ? String(req.body.currentMedicines).split(',').map((s: string) => s.trim()) : [],
        previousSurgeries: [],
        createdAt: new Date().toISOString()
      };
      db.patients.push(newProfile);
    }

    saveDatabase(db);
    addAuditLog(newUser, 'USER_REGISTRATION', 'User', newUser.id, `New account registered for ${newUser.name} with role ${newUser.role}`);

    res.json({
      success: true,
      user: newUser,
      userPatientProfile: newProfile
    });
  });

  // Current session user
  app.get('/api/auth/me', (req, res) => {
    const db = getDatabase();
    const currentUser = getCurrentUser();
    const userPatientProfile = db.patients.find(p => p.userId === currentUser.id || p.contact === currentUser.phone);
    res.json({ currentUser, userPatientProfile });
  });

  // --- PATIENT MANAGEMENT ---
  app.get('/api/patients', (req, res) => {
    const db = getDatabase();
    const { search } = req.query;
    let list = db.patients;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.uhid.toLowerCase().includes(q) || 
        p.contact.includes(q) ||
        p.address.village.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/patients/:id', (req, res) => {
    const db = getDatabase();
    const patient = db.patients.find(p => p.id === req.params.id || p.uhid === req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }
    const cases = db.cases.filter(c => c.patientId === patient.id || c.patientUhid === patient.uhid);
    const appointments = db.appointments.filter(a => a.patientId === patient.id || a.patientUhid === patient.uhid);
    const reports = db.reports.filter(r => r.patientId === patient.id);

    res.json({
      patient,
      cases,
      appointments,
      reports
    });
  });

  app.post('/api/patients', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const data = req.body;

    const rand1 = Math.floor(1000 + Math.random() * 9000);
    const rand2 = Math.floor(1000 + Math.random() * 9000);
    const rand3 = Math.floor(10 + Math.random() * 90);

    const newPatient: PatientProfile = {
      id: `pat_${Date.now()}`,
      uhid: data.uhid || `ABHA-91-${rand1}-${rand2}-${rand3}`,
      name: data.name,
      age: Number(data.age) || 30,
      gender: data.gender || 'Male',
      contact: data.contact || '+91 98000 00000',
      address: {
        village: data.village || 'Shivpur',
        district: data.district || 'Varanasi',
        state: data.state || 'Uttar Pradesh',
        pincode: data.pincode || '221001'
      },
      emergencyContact: {
        name: data.emergencyName || 'Emergency Contact',
        relation: data.emergencyRelation || 'Family',
        phone: data.emergencyPhone || data.contact || '+91 98000 00000'
      },
      bloodGroup: data.bloodGroup || 'B+',
      allergies: Array.isArray(data.allergies) ? data.allergies : (data.allergies ? [data.allergies] : []),
      existingConditions: Array.isArray(data.existingConditions) ? data.existingConditions : (data.existingConditions ? [data.existingConditions] : []),
      currentMedicines: Array.isArray(data.currentMedicines) ? data.currentMedicines : (data.currentMedicines ? [data.currentMedicines] : []),
      previousSurgeries: Array.isArray(data.previousSurgeries) ? data.previousSurgeries : [],
      familyHistory: data.familyHistory || '',
      createdAt: new Date().toISOString()
    };

    db.patients.unshift(newPatient);
    saveDatabase(db);
    addAuditLog(currentUser, 'REGISTER_PATIENT', 'PatientProfile', newPatient.id, `Patient ${newPatient.name} registered by ${currentUser.name}`);

    res.status(201).json(newPatient);
  });

  // --- AI CASE-TAKING APIS ---
  app.post('/api/ai/followup', async (req, res) => {
    try {
      const { statement, history, language } = req.body;
      if (!statement) {
        return res.status(400).json({ error: 'Patient statement is required' });
      }
      const questions = await generateFollowUpQuestions(statement, history || [], language || 'en');
      res.json({ questions });
    } catch (err: any) {
      console.error('Error in /api/ai/followup:', err);
      res.status(500).json({ error: 'Failed to generate follow-up questions' });
    }
  });

  app.post('/api/ai/structure-case', async (req, res) => {
    try {
      const { statement, history, patientProfile } = req.body;
      if (!statement) {
        return res.status(400).json({ error: 'Patient statement is required' });
      }
      const structured = await structureCaseWithAI(statement, history || [], patientProfile);
      res.json(structured);
    } catch (err: any) {
      console.error('Error in /api/ai/structure-case:', err);
      res.status(500).json({ error: 'Failed to structure clinical case' });
    }
  });

  // --- CASES MANAGEMENT ---
  app.get('/api/cases', (req, res) => {
    const db = getDatabase();
    const currentUser = getCurrentUser();
    const { patientId, doctorId, status, department, triageLevel } = req.query;

    let cases = db.cases;

    // Patient only sees their own cases
    if (currentUser.role === 'patient') {
      const p = db.patients.find(x => x.userId === currentUser.id || x.contact === currentUser.phone);
      if (p) {
        cases = cases.filter(c => c.patientId === p.id || c.patientUhid === p.uhid);
      }
    }

    if (patientId) {
      cases = cases.filter(c => c.patientId === patientId);
    }
    if (doctorId) {
      cases = cases.filter(c => c.reviewedByDoctorId === doctorId);
    }
    if (status) {
      cases = cases.filter(c => c.status === status);
    }
    if (department) {
      cases = cases.filter(c => c.recommendedDepartment.toLowerCase() === String(department).toLowerCase());
    }
    if (triageLevel) {
      cases = cases.filter(c => c.triageLevel.toLowerCase() === String(triageLevel).toLowerCase());
    }

    res.json(cases);
  });

  app.get('/api/cases/:id', (req, res) => {
    const db = getDatabase();
    const item = db.cases.find(c => c.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Case record not found' });
    }
    res.json(item);
  });

  app.post('/api/cases', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const payload = req.body;

    const newCase: CaseRecord = {
      id: `case_${Date.now()}`,
      patientId: payload.patientId || 'pat_1',
      patientName: payload.patientName || 'Patient',
      patientAge: payload.patientAge || 40,
      patientGender: payload.patientGender || 'Male',
      patientUhid: payload.patientUhid || 'ABHA-91-0000-0000-00',
      healthWorkerId: currentUser.role === 'health_worker' ? currentUser.id : payload.healthWorkerId,
      healthWorkerName: currentUser.role === 'health_worker' ? currentUser.name : payload.healthWorkerName,
      createdByRole: currentUser.role === 'health_worker' ? 'health_worker' : 'patient',
      originalStatement: payload.originalStatement || '',
      language: payload.language || 'hi',
      chiefComplaint: payload.chiefComplaint || 'Symptomatic complaint',
      symptoms: payload.symptoms || [],
      overallDuration: payload.overallDuration || '3-4 days',
      severityScore: payload.severityScore || 5,
      severityLevel: payload.severityLevel || 'Moderate',
      relevantHistory: payload.relevantHistory || '',
      currentMedicines: payload.currentMedicines || '',
      knownAllergies: payload.knownAllergies || '',
      previousConditions: payload.previousConditions || '',
      importantMissingInfo: payload.importantMissingInfo || [],
      redFlags: payload.redFlags || { detected: false, severityLevel: 'Low' },
      recommendedDepartment: payload.recommendedDepartment || 'General Medicine',
      recommendedSpecialty: payload.recommendedSpecialty || 'General OPD',
      triageLevel: payload.triageLevel || 'Routine',
      status: 'submitted',
      offlineSyncStatus: 'synced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.cases.unshift(newCase);

    // Create notification for doctors in the department
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'usr_doc_1',
      role: 'doctor',
      title: `New Case: ${newCase.patientName} (${newCase.triageLevel})`,
      titleHindi: `नया केस: ${newCase.patientName} (${newCase.triageLevel})`,
      message: `A new structured case has been submitted for ${newCase.recommendedDepartment}: "${newCase.chiefComplaint.slice(0, 80)}"`,
      messageHindi: `${newCase.recommendedDepartment} के लिए एक नया संरचित केस प्रस्तुत किया गया है: "${newCase.chiefComplaint.slice(0, 80)}"`,
      type: newCase.triageLevel === 'Emergency' ? 'emergency' : 'case_reviewed',
      read: false,
      timestamp: new Date().toISOString(),
      linkAction: `/cases/${newCase.id}`
    });

    saveDatabase(db);
    addAuditLog(currentUser, 'CREATE_CASE', 'CaseRecord', newCase.id, `Created case for patient ${newCase.patientName} (${newCase.chiefComplaint})`);

    res.status(201).json(newCase);
  });

  // Doctor in the loop: Review case and add clinical notes
  app.put('/api/cases/:id/review', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const caseIndex = db.cases.findIndex(c => c.id === req.params.id);
    if (caseIndex === -1) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const { doctorNotes, clinicalObservations, provisionalDiagnosis, prescribedAdvice, followUpDate } = req.body;

    const existing = db.cases[caseIndex];
    existing.doctorNotes = doctorNotes || existing.doctorNotes;
    existing.clinicalObservations = clinicalObservations || existing.clinicalObservations;
    existing.provisionalDiagnosis = provisionalDiagnosis || existing.provisionalDiagnosis;
    existing.prescribedAdvice = prescribedAdvice || existing.prescribedAdvice;
    existing.followUpDate = followUpDate || existing.followUpDate;
    existing.status = 'reviewed';
    existing.reviewedByDoctorId = currentUser.id;
    existing.reviewedByDoctorName = currentUser.name;
    existing.reviewedAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();

    // Notify patient
    const patientUser = db.users.find(u => u.name === existing.patientName);
    if (patientUser) {
      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: patientUser.id,
        role: 'patient',
        title: 'Doctor Reviewed Your Case',
        titleHindi: 'डॉक्टर ने आपके केस की समीक्षा की',
        message: `${currentUser.name} has recorded clinical observations and prescription advice for your visit.`,
        messageHindi: `${currentUser.name} ने आपके केस के लिए चिकित्सकीय निर्देश और परामर्श दर्ज किया है।`,
        type: 'case_reviewed',
        read: false,
        timestamp: new Date().toISOString(),
        linkAction: `/cases/${existing.id}`
      });
    }

    saveDatabase(db);
    addAuditLog(currentUser, 'REVIEW_CASE', 'CaseRecord', existing.id, `Doctor ${currentUser.name} reviewed case #${existing.id} with provisional diagnosis: ${provisionalDiagnosis || 'General OPD assessment'}`);

    res.json(existing);
  });

  // Batch offline synchronization for health workers in rural field areas
  app.post('/api/cases/sync-offline', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const { cases } = req.body;

    if (!Array.isArray(cases)) {
      return res.status(400).json({ error: 'Cases array is required' });
    }

    const syncedCases: CaseRecord[] = [];
    for (const c of cases) {
      const existingIdx = db.cases.findIndex(x => x.id === c.id);
      const record: CaseRecord = {
        ...c,
        id: c.id.startsWith('local_') ? `case_${Date.now()}_${Math.random().toString(36).substring(2, 5)}` : c.id,
        offlineSyncStatus: 'synced',
        updatedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        db.cases[existingIdx] = record;
      } else {
        db.cases.unshift(record);
      }
      syncedCases.push(record);
    }

    saveDatabase(db);
    addAuditLog(currentUser, 'SYNC_OFFLINE_CASES', 'CaseRecord', 'batch', `Health worker ${currentUser.name} synced ${syncedCases.length} offline case drafts.`);

    res.json({
      success: true,
      syncedCount: syncedCases.length,
      syncedCases
    });
  });

  // --- HOSPITALS & DOCTORS ---
  app.get('/api/hospitals', (req, res) => {
    const db = getDatabase();
    const { department, search } = req.query;
    let list = db.hospitals;

    if (department && typeof department === 'string') {
      list = list.filter(h => h.departments.some(d => d.toLowerCase() === department.toLowerCase()));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q) || h.district.toLowerCase().includes(q));
    }

    res.json(list);
  });

  app.get('/api/doctors', (req, res) => {
    const db = getDatabase();
    const { hospitalId, department } = req.query;
    let list = db.doctors;

    if (hospitalId) {
      list = list.filter(d => d.hospitalId === hospitalId);
    }
    if (department) {
      list = list.filter(d => d.department.toLowerCase() === String(department).toLowerCase());
    }

    res.json(list);
  });

  // --- APPOINTMENTS & DIGITAL RECEIPTS ---
  app.get('/api/appointments', (req, res) => {
    const db = getDatabase();
    const currentUser = getCurrentUser();
    const { patientId, doctorId, date, status } = req.query;

    let list = db.appointments;

    if (currentUser.role === 'patient') {
      const p = db.patients.find(x => x.userId === currentUser.id || x.contact === currentUser.phone);
      if (p) {
        list = list.filter(a => a.patientId === p.id || a.patientUhid === p.uhid);
      }
    } else if (currentUser.role === 'doctor') {
      const d = db.doctors.find(x => x.name === currentUser.name);
      if (d) {
        list = list.filter(a => a.doctorId === d.id);
      }
    }

    if (patientId) {
      list = list.filter(a => a.patientId === patientId);
    }
    if (doctorId) {
      list = list.filter(a => a.doctorId === doctorId);
    }
    if (date) {
      list = list.filter(a => a.date === date);
    }
    if (status) {
      list = list.filter(a => a.status === status);
    }

    res.json(list);
  });

  app.post('/api/appointments/book', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const { 
      caseId, 
      patientId, 
      patientName, 
      patientPhone, 
      patientUhid, 
      patientAge, 
      patientGender,
      hospitalId, 
      department, 
      doctorId, 
      date, 
      timeSlot,
      notes 
    } = req.body;

    if (!hospitalId || !doctorId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Hospital, doctor, date, and time slot are required' });
    }

    const hospital = db.hospitals.find(h => h.id === hospitalId);
    const doctor = db.doctors.find(d => d.id === doctorId);

    if (!hospital || !doctor) {
      return res.status(404).json({ error: 'Hospital or doctor not found' });
    }

    // Check double booking for doctor at that time slot & date
    const existingBooking = db.appointments.find(a => 
      a.doctorId === doctorId && 
      a.date === date && 
      a.timeSlot === timeSlot && 
      a.status !== 'Cancelled'
    );

    if (existingBooking) {
      return res.status(409).json({ 
        error: 'This appointment slot is already allocated. Please choose an adjacent time slot.',
        conflictTime: timeSlot 
      });
    }

    // Generate OPD registration numbers
    const regSeq = Math.floor(1000 + Math.random() * 9000);
    const opdSeq = Math.floor(10000 + Math.random() * 90000);
    const tokenNumber = Math.floor(1 + Math.random() * 25);
    const aptId = `apt_${Date.now()}`;

    const newAppointment: Appointment = {
      id: aptId,
      registrationNumber: `AP-REG-${new Date().getFullYear()}-${regSeq}`,
      opdSlipNumber: `OPD-${opdSeq}`,
      caseId: caseId || 'general_intake',
      patientId: patientId || 'pat_1',
      patientName: patientName || currentUser.name,
      patientPhone: patientPhone || currentUser.phone,
      patientUhid: patientUhid || 'ABHA-91-4821-3942-12',
      patientAge: patientAge || 40,
      patientGender: patientGender || 'Male',
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      department: department || doctor.department,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date,
      timeSlot,
      opdRoom: doctor.opdRoom,
      status: 'Confirmed',
      digitalReceipt: {
        qrCodePayload: `AROGYAPATH|${aptId}|${patientUhid || 'ABHA-91'}|${hospital.id}|${doctor.id}|${date}|${timeSlot}|TOKEN-${tokenNumber}`,
        issuedAt: new Date().toISOString(),
        tokenNumber,
        barcode: `AP${regSeq}${Math.floor(1000 + Math.random() * 9000)}`,
        validDate: date
      },
      notes,
      createdAt: new Date().toISOString()
    };

    db.appointments.unshift(newAppointment);

    // Create notifications for patient and doctor
    db.notifications.unshift({
      id: `notif_${Date.now()}_1`,
      userId: currentUser.id,
      role: 'patient',
      title: 'Appointment Confirmed',
      titleHindi: 'अपॉइंटमेंट की पुष्टि हुई',
      message: `Your appointment with ${doctor.name} at ${hospital.name} is confirmed for ${date} at ${timeSlot} (Token #${tokenNumber}, ${doctor.opdRoom}).`,
      messageHindi: `${hospital.name} में ${doctor.name} के साथ आपका अपॉइंटमेंट ${date} को ${timeSlot} बजे (टोकन #${tokenNumber}, ${doctor.opdRoom}) पक्का हो गया है।`,
      type: 'appointment',
      read: false,
      timestamp: new Date().toISOString(),
      linkAction: `/appointments/${newAppointment.id}`
    });

    saveDatabase(db);
    addAuditLog(currentUser, 'BOOK_APPOINTMENT', 'Appointment', newAppointment.id, `Appointment booked with ${doctor.name} at ${hospital.name} on ${date} ${timeSlot}`);

    res.status(201).json(newAppointment);
  });

  app.put('/api/appointments/:id/status', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const aptIndex = db.appointments.findIndex(a => a.id === req.params.id);
    if (aptIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const { status } = req.body;
    db.appointments[aptIndex].status = status;
    saveDatabase(db);

    addAuditLog(currentUser, 'UPDATE_APPOINTMENT_STATUS', 'Appointment', req.params.id, `Status updated to ${status}`);
    res.json(db.appointments[aptIndex]);
  });

  // --- REPORTS & FILES ---
  app.get('/api/reports/:patientId', (req, res) => {
    const db = getDatabase();
    const list = db.reports.filter(r => r.patientId === req.params.patientId);
    res.json(list);
  });

  app.post('/api/reports', (req, res) => {
    const currentUser = getCurrentUser();
    const db = getDatabase();
    const { patientId, title, category, summary, fileType, fileSize } = req.body;

    const newReport: MedicalReport = {
      id: `rep_${Date.now()}`,
      patientId: patientId || 'pat_1',
      title: title || 'Medical Record',
      category: category || 'Lab Report',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString(),
      fileSize: fileSize || '1.5 MB',
      fileUrl: `/reports/demo_${Date.now()}.pdf`,
      fileType: fileType || 'application/pdf',
      summary: summary || 'Patient medical document recorded in ArogyaPath registry.'
    };

    db.reports.unshift(newReport);
    saveDatabase(db);
    addAuditLog(currentUser, 'UPLOAD_REPORT', 'MedicalReport', newReport.id, `Uploaded ${newReport.title} for patient #${newReport.patientId}`);

    res.status(201).json(newReport);
  });

  // --- NOTIFICATIONS ---
  app.get('/api/notifications', (req, res) => {
    const db = getDatabase();
    const currentUser = getCurrentUser();
    const userNotifs = db.notifications.filter(n => n.userId === currentUser.id || !n.userId || n.role === currentUser.role);
    res.json(userNotifs);
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    const db = getDatabase();
    const notif = db.notifications.find(n => n.id === req.params.id);
    if (notif) {
      notif.read = true;
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  app.post('/api/notifications/mark-all-read', (req, res) => {
    const db = getDatabase();
    const currentUser = getCurrentUser();
    db.notifications.forEach(n => {
      if (n.userId === currentUser.id || n.role === currentUser.role) {
        n.read = true;
      }
    });
    saveDatabase(db);
    res.json({ success: true });
  });

  // --- ANALYTICS & AUDIT LOGS ---
  app.get('/api/analytics', (req, res) => {
    const db = getDatabase();
    const totalPatients = db.patients.length;
    const totalCases = db.cases.length;
    const totalAppointments = db.appointments.length;
    const emergencyCases = db.cases.filter(c => c.triageLevel === 'Emergency').length;
    const priorityCases = db.cases.filter(c => c.triageLevel === 'Priority').length;
    const routineCases = db.cases.filter(c => c.triageLevel === 'Routine').length;
    const reviewedCases = db.cases.filter(c => c.status === 'doctor_reviewed' || c.status === 'reviewed' || c.status === 'consulted').length;

    // Breakdown by department
    const departmentDistribution: Record<string, number> = {};
    db.cases.forEach(c => {
      const dept = c.recommendedDepartment || 'General Medicine';
      departmentDistribution[dept] = (departmentDistribution[dept] || 0) + 1;
    });

    // Breakdown by triage
    const triageDistribution = {
      Routine: routineCases,
      Priority: priorityCases,
      Emergency: emergencyCases
    };

    // Weekly OPD Footfall & Token Trend for Recharts
    const weeklyOpdTrend = [
      { day: 'Mon', footfall: 184, digitalTokens: 122, walkIns: 62 },
      { day: 'Tue', footfall: 215, digitalTokens: 148, walkIns: 67 },
      { day: 'Wed', footfall: 198, digitalTokens: 139, walkIns: 59 },
      { day: 'Thu', footfall: 230, digitalTokens: 172, walkIns: 58 },
      { day: 'Fri', footfall: 210, digitalTokens: 156, walkIns: 54 },
      { day: 'Sat', footfall: 265, digitalTokens: 195, walkIns: 70 }
    ];

    // Departmental Capacity vs Current Inflow
    const departmentLoads = [
      { department: 'Gen Medicine', activeCases: 42, maxCapacity: 60, avgWaitMins: 18 },
      { department: 'Pulmonology', activeCases: 28, maxCapacity: 40, avgWaitMins: 22 },
      { department: 'Pediatrics', activeCases: 34, maxCapacity: 45, avgWaitMins: 14 },
      { department: 'Orthopedics', activeCases: 25, maxCapacity: 35, avgWaitMins: 28 },
      { department: 'Gynecology', activeCases: 31, maxCapacity: 40, avgWaitMins: 16 },
      { department: 'Cardiology', activeCases: 19, maxCapacity: 25, avgWaitMins: 12 }
    ];

    // Bed Availability Breakdown (Donut chart)
    const bedStats = [
      { name: 'Occupied General', value: 174, color: '#3b82f6' },
      { name: 'Available General', value: 46, color: '#10b981' },
      { name: 'Occupied ICU', value: 23, color: '#f59e0b' },
      { name: 'Available ICU', value: 7, color: '#059669' }
    ];

    // Disease Syndromic Surveillance (Epidemic early warning)
    const syndromicSurveillance = [
      { week: 'Week 33', acuteFever: 58, respiratoryInfections: 42, diarrhealCases: 31, vectorBorne: 12 },
      { week: 'Week 34', acuteFever: 64, respiratoryInfections: 49, diarrhealCases: 38, vectorBorne: 16 },
      { week: 'Week 35', acuteFever: 72, respiratoryInfections: 53, diarrhealCases: 29, vectorBorne: 24 },
      { week: 'Week 36', acuteFever: 89, respiratoryInfections: 61, diarrhealCases: 35, vectorBorne: 31 }
    ];

    // Language & Intake modalities
    const intakeBreakdown = [
      { modality: 'Hindi Voice (Rural)', count: 52, percentage: 46 },
      { modality: 'Hindi Form/Text', count: 34, percentage: 30 },
      { modality: 'Bhojpuri Voice', count: 18, percentage: 16 },
      { modality: 'English Digital', count: 9, percentage: 8 }
    ];

    // ASHA Health Worker Field Sync activity
    const ashaSyncMetrics = [
      { date: '04 Sep', syncedCases: 24, syncBatches: 6, activeASHAs: 8 },
      { date: '05 Sep', syncedCases: 31, syncBatches: 9, activeASHAs: 11 },
      { date: '06 Sep', syncedCases: 28, syncBatches: 7, activeASHAs: 9 },
      { date: '07 Sep', syncedCases: 42, syncBatches: 12, activeASHAs: 14 },
      { date: '08 Sep', syncedCases: 46, syncBatches: 13, activeASHAs: 15 }
    ];

    res.json({
      totalPatients,
      totalCases,
      totalAppointments,
      emergencyCases,
      priorityCases,
      routineCases,
      reviewedCases,
      departmentDistribution,
      triageDistribution,
      weeklyOpdTrend,
      departmentLoads,
      bedStats,
      syndromicSurveillance,
      intakeBreakdown,
      ashaSyncMetrics,
      hospitalsCount: db.hospitals.length,
      doctorsCount: db.doctors.length
    });
  });

  // Seed / Reset rich dummy data endpoint
  app.post('/api/admin/seed-rich-data', (req, res) => {
    const currentUser = getCurrentUser();
    const fresh = resetToRichSeedData();
    addAuditLog(currentUser, 'SEED_DATABASE', 'System', 'all', 'Seeded rich practical healthcare demo data across patients, doctors, appointments, and vitals.');
    res.json({
      success: true,
      message: 'Comprehensive healthcare dataset seeded successfully',
      stats: {
        patients: fresh.patients.length,
        doctors: fresh.doctors.length,
        hospitals: fresh.hospitals.length,
        cases: fresh.cases.length,
        appointments: fresh.appointments.length,
        reports: fresh.reports.length
      }
    });
  });

  app.get('/api/audit-logs', (req, res) => {
    const db = getDatabase();
    res.json(db.auditLogs.slice(0, 100));
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ArogyaPath backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
