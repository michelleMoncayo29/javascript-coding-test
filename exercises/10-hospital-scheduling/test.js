/**
 * Pruebas para: Hospital Scheduling System
 *
 * Ejecutar con: npm test exercises/10-hospital-scheduling
 */

const {
  Patient,
  Doctor,
  MedicalAppointment,
  InsurancePlan,
  getDoctorAvailableSlots,
  bookAppointment,
  calculateInsuranceCoverage,
  calculatePatientBalance,
  getWaitlistPriority,
  verifyInsuranceCoverage,
  fetchDoctorSchedule,
  generateWorkloadReport,
  rescheduleAppointment,
  findEarliestSlot,
} = require('./exercise.js');

function makeDoctor(overrides = {}) {
  return new Doctor({
    id: 'd1',
    name: 'Dr. Smith',
    speciality: 'cardiology',
    workingHours: { start: '09:00', end: '17:00' },
    maxDailyAppointments: 8,
    ...overrides,
  });
}

function makeAppointment(overrides = {}) {
  return new MedicalAppointment({
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2025-06-10',
    startTime: '10:00',
    durationMin: 30,
    procedureCode: 'CONSULT',
    ...overrides,
  });
}

function makeInsurance(overrides = {}) {
  return new InsurancePlan({
    id: 'ins1',
    name: 'Basic Plan',
    annualDeductible: 500,
    copayRate: 0.20,
    coverageByProcedure: { ECG: 200, CONSULT: 100, SURGERY: 5000 },
    annualMaxCoverage: 10000,
    ...overrides,
  });
}

// ─── Patient ────────────────────────────────────────────────────────────────

describe('Hospital Scheduling - Patient', () => {
  test('debe inicializar propiedades y yearToDateClaims en 0', () => {
    const p = new Patient({ id: 'p1', name: 'Ana Garcia', dateOfBirth: '1990-05-15', insurancePlanId: 'ins1' });
    expect(p.id).toBe('p1');
    expect(p.name).toBe('Ana Garcia');
    expect(p.insurancePlanId).toBe('ins1');
    expect(p.yearToDateClaims).toBe(0);
  });
});

// ─── MedicalAppointment ──────────────────────────────────────────────────────

describe('Hospital Scheduling - MedicalAppointment', () => {
  test('debe inicializar con status scheduled', () => {
    const a = makeAppointment();
    expect(a.status).toBe('scheduled');
  });

  test('getEndTime debe calcular la hora de fin correctamente', () => {
    const a = makeAppointment({ startTime: '09:30', durationMin: 45 });
    expect(a.getEndTime()).toBe('10:15');
  });

  test('getEndTime debe manejar cruce de hora al sumar minutos', () => {
    const a = makeAppointment({ startTime: '11:45', durationMin: 30 });
    expect(a.getEndTime()).toBe('12:15');
  });
});

// ─── getDoctorAvailableSlots ──────────────────────────────────────────────────

describe('Hospital Scheduling - getDoctorAvailableSlots', () => {
  let doctor;
  beforeEach(() => {
    doctor = makeDoctor();
  });

  test('debe retornar slots desde la hora de inicio del doctor', () => {
    const slots = getDoctorAvailableSlots(doctor, '2025-06-10', []);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toBe('09:00');
  });

  test('debe excluir slots solapados con una cita activa', () => {
    const appt = makeAppointment({ startTime: '10:00', durationMin: 60 });
    const slots = getDoctorAvailableSlots(doctor, '2025-06-10', [appt]);
    expect(slots).not.toContain('10:00');
    expect(slots).not.toContain('10:30');
    expect(slots).toContain('09:00');
    expect(slots).toContain('11:00');
  });

  test('debe ignorar citas canceladas al calcular disponibilidad', () => {
    const appt = makeAppointment({ startTime: '10:00', durationMin: 60 });
    appt.status = 'cancelled';
    const slots = getDoctorAvailableSlots(doctor, '2025-06-10', [appt]);
    expect(slots).toContain('10:00');
  });

  test('debe ignorar citas de otros doctores', () => {
    const appt = makeAppointment({ doctorId: 'd99', startTime: '10:00', durationMin: 60 });
    const slots = getDoctorAvailableSlots(doctor, '2025-06-10', [appt]);
    expect(slots).toContain('10:00');
  });
});

// ─── bookAppointment ─────────────────────────────────────────────────────────

describe('Hospital Scheduling - bookAppointment', () => {
  let doctor, patient, appointments;
  beforeEach(() => {
    doctor = makeDoctor({ maxDailyAppointments: 2 });
    patient = new Patient({ id: 'p1', name: 'Test', dateOfBirth: '1990-01-01', insurancePlanId: 'ins1' });
    appointments = [];
  });

  test('debe agregar la cita al arreglo y retornarla', () => {
    const appt = bookAppointment(patient, doctor, '2025-06-10', '09:00', 30, 'CONSULT', appointments);
    expect(appt).toBeDefined();
    expect(appointments).toHaveLength(1);
  });

  test('debe lanzar error al superar el limite diario del doctor', () => {
    bookAppointment(patient, doctor, '2025-06-10', '09:00', 30, 'CONSULT', appointments);
    bookAppointment(patient, doctor, '2025-06-10', '09:30', 30, 'CONSULT', appointments);
    expect(() => bookAppointment(patient, doctor, '2025-06-10', '10:00', 30, 'CONSULT', appointments)).toThrow();
  });

  test('debe lanzar error si el slot no esta disponible', () => {
    bookAppointment(patient, doctor, '2025-06-10', '09:00', 30, 'CONSULT', appointments);
    expect(() => bookAppointment(patient, doctor, '2025-06-10', '09:00', 30, 'CONSULT', appointments)).toThrow();
  });
});

// ─── calculateInsuranceCoverage ───────────────────────────────────────────────

describe('Hospital Scheduling - calculateInsuranceCoverage', () => {
  let insurance;
  beforeEach(() => {
    insurance = makeInsurance();
  });

  test('debe retornar ceros para procedimiento no cubierto', () => {
    const result = calculateInsuranceCoverage('UNKNOWN', insurance, 0);
    expect(result.procedureCost).toBe(0);
    expect(result.insurancePays).toBe(0);
    expect(result.patientPays).toBe(0);
  });

  test('paciente paga todo mientras no ha cubierto el deducible', () => {
    const result = calculateInsuranceCoverage('ECG', insurance, 0);
    expect(result.procedureCost).toBe(200);
    expect(result.patientPays).toBe(200);
    expect(result.insurancePays).toBe(0);
  });

  test('el seguro cubre despues de cumplir el deducible', () => {
    const result = calculateInsuranceCoverage('ECG', insurance, 500);
    expect(result.insurancePays).toBeCloseTo(160, 2);
    expect(result.patientPays).toBeCloseTo(40, 2);
  });

  test('el seguro no supera el tope anual de cobertura', () => {
    const result = calculateInsuranceCoverage('SURGERY', insurance, 9000);
    expect(result.insurancePays).toBe(1000);
    expect(result.patientPays).toBe(4000);
  });
});

// ─── calculatePatientBalance ──────────────────────────────────────────────────

describe('Hospital Scheduling - calculatePatientBalance', () => {
  let insurance;
  beforeEach(() => {
    insurance = makeInsurance();
  });

  test('debe sumar el costo del paciente de multiples procedimientos', () => {
    const procedures = [{ procedureCode: 'CONSULT' }, { procedureCode: 'ECG' }];
    const balance = calculatePatientBalance('p1', procedures, insurance, 0);
    expect(balance).toBe(300);
  });

  test('debe retornar 0 para lista de procedimientos vacia', () => {
    expect(calculatePatientBalance('p1', [], insurance, 0)).toBe(0);
  });
});

// ─── getWaitlistPriority ──────────────────────────────────────────────────────

describe('Hospital Scheduling - getWaitlistPriority', () => {
  test('debe ordenar por urgencia descendente', () => {
    const waitlist = [
      { patientId: 'p1', urgency: 2, requestedAt: '2025-06-10T10:00:00Z' },
      { patientId: 'p2', urgency: 5, requestedAt: '2025-06-10T11:00:00Z' },
      { patientId: 'p3', urgency: 1, requestedAt: '2025-06-10T09:00:00Z' },
    ];
    const result = getWaitlistPriority(waitlist);
    expect(result[0].urgency).toBe(5);
    expect(result[2].urgency).toBe(1);
  });

  test('debe desempatar por requestedAt ascendente (mas antiguo primero)', () => {
    const waitlist = [
      { patientId: 'p1', urgency: 3, requestedAt: '2025-06-10T12:00:00Z' },
      { patientId: 'p2', urgency: 3, requestedAt: '2025-06-10T09:00:00Z' },
    ];
    const result = getWaitlistPriority(waitlist);
    expect(result[0].patientId).toBe('p2');
  });

  test('no debe mutar el arreglo original', () => {
    const waitlist = [
      { patientId: 'p1', urgency: 1, requestedAt: '2025-06-10T10:00:00Z' },
      { patientId: 'p2', urgency: 5, requestedAt: '2025-06-10T09:00:00Z' },
    ];
    getWaitlistPriority(waitlist);
    expect(waitlist[0].patientId).toBe('p1');
  });
});

// ─── verifyInsuranceCoverage ──────────────────────────────────────────────────

describe('Hospital Scheduling - verifyInsuranceCoverage', () => {
  test('debe llamar a la URL correcta y retornar el JSON', async () => {
    const mockData = { covered: true, amount: 200 };
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockData });
    const result = await verifyInsuranceCoverage('p1', 'ECG', mockFetch);
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('patientId=p1'));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('procedure=ECG'));
  });

  test('debe lanzar error si la respuesta no es ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(verifyInsuranceCoverage('p1', 'ECG', mockFetch)).rejects.toThrow();
  });
});

// ─── fetchDoctorSchedule ──────────────────────────────────────────────────────

describe('Hospital Scheduling - fetchDoctorSchedule', () => {
  test('debe llamar a la URL correcta y retornar el JSON', async () => {
    const mockData = { appointments: [] };
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockData });
    const result = await fetchDoctorSchedule('d1', '2025-06-09', mockFetch);
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/doctors/d1/schedule'));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('weekStart=2025-06-09'));
  });

  test('debe lanzar error si la respuesta no es ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchDoctorSchedule('d1', '2025-06-09', mockFetch)).rejects.toThrow();
  });
});

// ─── generateWorkloadReport ───────────────────────────────────────────────────

describe('Hospital Scheduling - generateWorkloadReport', () => {
  let doctor, appointments;
  beforeEach(() => {
    doctor = makeDoctor({ maxDailyAppointments: 4 });
    appointments = [
      makeAppointment({ id: 'a1', date: '2025-06-10', startTime: '09:00', durationMin: 30 }),
      makeAppointment({ id: 'a2', date: '2025-06-10', startTime: '09:30', durationMin: 60 }),
      makeAppointment({ id: 'a3', date: '2025-06-11', startTime: '09:00', durationMin: 45 }),
      makeAppointment({ id: 'a4', date: '2025-06-12', startTime: '09:00', durationMin: 30 }),
      makeAppointment({ id: 'a5', date: '2025-06-12', startTime: '09:30', durationMin: 30 }),
      makeAppointment({ id: 'a6', date: '2025-06-12', startTime: '10:00', durationMin: 30 }),
      makeAppointment({ id: 'a7', date: '2025-06-12', startTime: '10:30', durationMin: 30 }),
      makeAppointment({ id: 'a8', date: '2025-06-12', startTime: '11:00', durationMin: 30 }),
    ];
  });

  test('debe calcular totalAppointments y totalHours en el rango', () => {
    const report = generateWorkloadReport([doctor], appointments, '2025-06-10', '2025-06-12');
    expect(report[0].totalAppointments).toBe(8);
    expect(report[0].totalHours).toBeCloseTo(4.8, 1);
  });

  test('debe detectar dias sobrecargados (mas citas que maxDailyAppointments)', () => {
    const report = generateWorkloadReport([doctor], appointments, '2025-06-10', '2025-06-12');
    expect(report[0].overloadedDays).toBe(1);
  });

  test('debe excluir citas canceladas del reporte', () => {
    const cancelled = makeAppointment({ id: 'a9', date: '2025-06-10', startTime: '11:00', durationMin: 30 });
    cancelled.status = 'cancelled';
    const report = generateWorkloadReport([doctor], [...appointments, cancelled], '2025-06-10', '2025-06-12');
    expect(report[0].totalAppointments).toBe(8);
  });

  test('debe retornar totalAppointments 0 para doctor sin citas en el rango', () => {
    const otherDoctor = makeDoctor({ id: 'd99' });
    const report = generateWorkloadReport([otherDoctor], appointments, '2025-06-10', '2025-06-12');
    expect(report[0].totalAppointments).toBe(0);
    expect(report[0].avgAppointmentsPerDay).toBe(0);
  });
});

// ─── rescheduleAppointment ────────────────────────────────────────────────────

describe('Hospital Scheduling - rescheduleAppointment', () => {
  test('debe actualizar fecha y hora de la cita', () => {
    const appt = makeAppointment({ id: 'a1', startTime: '10:00', durationMin: 30 });
    const result = rescheduleAppointment(appt, '2025-06-15', '11:00', [appt]);
    expect(result.date).toBe('2025-06-15');
    expect(result.startTime).toBe('11:00');
  });

  test('debe lanzar error si el nuevo slot tiene conflicto con otra cita', () => {
    const appt1 = makeAppointment({ id: 'a1', startTime: '10:00', durationMin: 30 });
    const appt2 = makeAppointment({ id: 'a2', startTime: '11:00', durationMin: 30 });
    expect(() => rescheduleAppointment(appt1, '2025-06-10', '11:00', [appt1, appt2])).toThrow();
  });
});

// ─── findEarliestSlot ─────────────────────────────────────────────────────────

describe('Hospital Scheduling - findEarliestSlot', () => {
  let doctors;
  beforeEach(() => {
    doctors = [makeDoctor({ speciality: 'cardiology' })];
  });

  test('debe encontrar el primer slot disponible en el dia de inicio', () => {
    const result = findEarliestSlot(doctors, 'cardiology', 30, {}, [], '2025-06-10');
    expect(result).not.toBeNull();
    expect(result.date).toBe('2025-06-10');
    expect(result.startTime).toBe('09:00');
  });

  test('debe respetar la preferencia de turno morning (antes de las 12)', () => {
    const result = findEarliestSlot(doctors, 'cardiology', 30, { timeOfDay: 'morning' }, [], '2025-06-10');
    const [h] = result.startTime.split(':').map(Number);
    expect(h).toBeLessThan(12);
  });

  test('debe respetar la preferencia de turno afternoon (12 en adelante)', () => {
    const result = findEarliestSlot(doctors, 'cardiology', 30, { timeOfDay: 'afternoon' }, [], '2025-06-10');
    const [h] = result.startTime.split(':').map(Number);
    expect(h).toBeGreaterThanOrEqual(12);
  });

  test('debe retornar null si no hay disponibilidad dentro de maxDaysAhead', () => {
    const fullDay = [];
    for (let t = 9 * 60; t + 30 <= 17 * 60; t += 30) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      fullDay.push(makeAppointment({
        id: `a-${t}`,
        startTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        durationMin: 30,
        date: '2025-06-10',
      }));
    }
    const result = findEarliestSlot(doctors, 'cardiology', 30, { maxDaysAhead: 1 }, fullDay, '2025-06-10');
    expect(result).toBeNull();
  });

  test('debe retornar null si no hay doctores de la especialidad', () => {
    const result = findEarliestSlot(doctors, 'oncology', 30, {}, [], '2025-06-10');
    expect(result).toBeNull();
  });

  test('debe priorizar el doctor preferido', () => {
    const doctor2 = makeDoctor({ id: 'd2', speciality: 'cardiology' });
    const result = findEarliestSlot([doctors[0], doctor2], 'cardiology', 30, { preferredDoctorId: 'd2' }, [], '2025-06-10');
    expect(result.doctorId).toBe('d2');
  });
});
