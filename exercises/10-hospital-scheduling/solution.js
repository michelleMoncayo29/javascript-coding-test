/**
 * Hospital Scheduling System
 *
 * Module for managing patients, doctors, appointments, insurance coverage,
 * workload analysis, and optimal slot finding.
 */

class Patient {
  constructor({ id, name, dateOfBirth, insurancePlanId }) {
    this.id = id;
    this.name = name;
    this.dateOfBirth = new Date(dateOfBirth);
    this.insurancePlanId = insurancePlanId;
    this.yearToDateClaims = 0;
  }
}

class Doctor {
  constructor({ id, name, speciality, workingHours, maxDailyAppointments }) {
    this.id = id;
    this.name = name;
    this.speciality = speciality;
    this.workingHours = workingHours; // { start: 'HH:MM', end: 'HH:MM' }
    this.maxDailyAppointments = maxDailyAppointments;
  }
}

class MedicalAppointment {
  constructor({ id, patientId, doctorId, date, startTime, durationMin, procedureCode, urgency = 1 }) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.date = date;
    this.startTime = startTime; // 'HH:MM'
    this.durationMin = durationMin;
    this.procedureCode = procedureCode;
    this.urgency = urgency; // 1 (low) to 5 (critical)
    this.status = 'scheduled';
  }

  getEndTime() {
    const [h, m] = this.startTime.split(':').map(Number);
    const totalMin = h * 60 + m + this.durationMin;
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
  }
}

class InsurancePlan {
  constructor({ id, name, annualDeductible, copayRate, coverageByProcedure, annualMaxCoverage }) {
    this.id = id;
    this.name = name;
    this.annualDeductible = annualDeductible;
    this.copayRate = copayRate; // patient pays this % after deductible
    this.coverageByProcedure = coverageByProcedure; // { procedureCode: cost }
    this.annualMaxCoverage = annualMaxCoverage;
  }
}

// IMPLEMENTADO: Genera slots de tiempo disponibles para un doctor en una fecha.
// Un slot es disponible si no se solapa con ninguna cita existente.
function getDoctorAvailableSlots(doctor, date, existingAppointments, slotDurationMin = 30) {
  const [startH, startM] = doctor.workingHours.start.split(':').map(Number);
  const [endH, endM] = doctor.workingHours.end.split(':').map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  const doctorAppts = existingAppointments.filter(
    a => a.doctorId === doctor.id && a.date === date && a.status !== 'cancelled'
  );

  const slots = [];
  for (let t = startTotal; t + slotDurationMin <= endTotal; t += slotDurationMin) {
    const slotStart = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    const slotEnd = t + slotDurationMin;
    const conflict = doctorAppts.some(a => {
      const [ah, am] = a.startTime.split(':').map(Number);
      const aStart = ah * 60 + am;
      const aEnd = aStart + a.durationMin;
      return t < aEnd && slotEnd > aStart;
    });
    if (!conflict) slots.push(slotStart);
  }
  return slots;
}

// IMPLEMENTADO: Agrega una cita validando disponibilidad y limite diario del doctor.
function bookAppointment(patient, doctor, date, startTime, durationMin, procedureCode, allAppointments) {
  const dailyCount = allAppointments.filter(
    a => a.doctorId === doctor.id && a.date === date && a.status !== 'cancelled'
  ).length;

  if (dailyCount >= doctor.maxDailyAppointments) {
    throw new Error(`Doctor ${doctor.name} has reached max daily appointments (${doctor.maxDailyAppointments})`);
  }

  const availableSlots = getDoctorAvailableSlots(doctor, date, allAppointments, durationMin);
  if (!availableSlots.includes(startTime)) {
    throw new Error(`Time slot ${startTime} is not available for Dr. ${doctor.name} on ${date}`);
  }

  const appt = new MedicalAppointment({
    id: `A${Date.now()}`,
    patientId: patient.id,
    doctorId: doctor.id,
    date,
    startTime,
    durationMin,
    procedureCode,
  });

  allAppointments.push(appt);
  return appt;
}

// IMPLEMENTADO: Calcula cuanto cubre el seguro para un procedimiento.
// Logica: si yearToDateClaims < deductible, el paciente paga primero hasta cubrir el deducible.
// Una vez cubierto, el seguro paga (1 - copayRate) del costo restante hasta annualMaxCoverage.
function calculateInsuranceCoverage(procedureCode, insurance, yearToDateClaims) {
  const procedureCost = insurance.coverageByProcedure[procedureCode] ?? 0;
  if (procedureCost === 0) return { procedureCost: 0, insurancePays: 0, patientPays: 0 };

  const remainingDeductible = Math.max(0, insurance.annualDeductible - yearToDateClaims);
  const patientDeductiblePortion = Math.min(procedureCost, remainingDeductible);
  const afterDeductible = procedureCost - patientDeductiblePortion;

  const insuranceCovers = parseFloat((afterDeductible * (1 - insurance.copayRate)).toFixed(2));
  const copayPortion = parseFloat((afterDeductible * insurance.copayRate).toFixed(2));

  const remainingCoverage = Math.max(0, insurance.annualMaxCoverage - yearToDateClaims);
  const actualInsurancePays = Math.min(insuranceCovers, remainingCoverage);
  const patientPays = parseFloat((patientDeductiblePortion + copayPortion + (insuranceCovers - actualInsurancePays)).toFixed(2));

  return {
    procedureCost,
    insurancePays: actualInsurancePays,
    patientPays,
  };
}

// IMPLEMENTADO: Calcula el saldo total pendiente del paciente sumando lo que no cubre el seguro.
function calculatePatientBalance(patientId, procedures, insurance, yearToDateClaims = 0) {
  let balance = 0;
  let runningClaims = yearToDateClaims;
  for (const { procedureCode } of procedures) {
    const coverage = calculateInsuranceCoverage(procedureCode, insurance, runningClaims);
    balance += coverage.patientPays;
    runningClaims += coverage.insurancePays;
  }
  return parseFloat(balance.toFixed(2));
}

// IMPLEMENTADO: Ordena la lista de espera por urgencia descendente y, en caso de empate, por tiempo de espera.
function getWaitlistPriority(waitlist) {
  return [...waitlist].sort((a, b) => {
    if (b.urgency !== a.urgency) return b.urgency - a.urgency;
    return new Date(a.requestedAt) - new Date(b.requestedAt);
  });
}

// IMPLEMENTADO: Verificacion de cobertura de seguro via API mock.
async function verifyInsuranceCoverage(patientId, procedureCode, fetchFn = fetch) {
  const res = await fetchFn(`https://api.hospital.mock/insurance/verify?patientId=${patientId}&procedure=${procedureCode}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

// IMPLEMENTADO: Obtiene el horario de un doctor para una semana via API mock.
async function fetchDoctorSchedule(doctorId, weekStart, fetchFn = fetch) {
  const res = await fetchFn(`https://api.hospital.mock/doctors/${doctorId}/schedule?weekStart=${weekStart}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

// IMPLEMENTADO: Genera un reporte de carga de trabajo por doctor en un periodo.
function generateWorkloadReport(doctors, appointments, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return doctors.map(doctor => {
    const doctorAppts = appointments.filter(a => {
      const d = new Date(a.date);
      return a.doctorId === doctor.id && d >= start && d <= end && a.status !== 'cancelled';
    });

    const dailyCounts = new Map();
    let totalMinutes = 0;
    for (const appt of doctorAppts) {
      dailyCounts.set(appt.date, (dailyCounts.get(appt.date) ?? 0) + 1);
      totalMinutes += appt.durationMin;
    }

    const days = dailyCounts.size;
    const avgPerDay = days > 0 ? parseFloat((doctorAppts.length / days).toFixed(1)) : 0;
    const overloadedDays = [...dailyCounts.values()].filter(c => c > doctor.maxDailyAppointments).length;

    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      totalAppointments: doctorAppts.length,
      totalHours: parseFloat((totalMinutes / 60).toFixed(1)),
      avgAppointmentsPerDay: avgPerDay,
      overloadedDays,
    };
  });
}

// IMPLEMENTADO: Reagenda una cita a un nuevo slot, validando disponibilidad.
function rescheduleAppointment(appointment, newDate, newStartTime, allAppointments) {
  const doctor = { id: appointment.doctorId, workingHours: { start: '08:00', end: '18:00' }, maxDailyAppointments: 999 };
  const others = allAppointments.filter(a => a.id !== appointment.id);
  const conflict = others.some(a => {
    if (a.doctorId !== appointment.doctorId || a.date !== newDate || a.status === 'cancelled') return false;
    const [ah, am] = a.startTime.split(':').map(Number);
    const aStart = ah * 60 + am;
    const aEnd = aStart + a.durationMin;
    const [nh, nm] = newStartTime.split(':').map(Number);
    const nStart = nh * 60 + nm;
    const nEnd = nStart + appointment.durationMin;
    return nStart < aEnd && nEnd > aStart;
  });
  if (conflict) throw new Error(`Slot ${newDate} ${newStartTime} is not available`);
  appointment.date = newDate;
  appointment.startTime = newStartTime;
  return appointment;
}

// IMPLEMENTADO: Encuentra el primer slot disponible entre doctores de una especialidad.
// Itera dias desde startDate, luego por cada doctor de la especialidad.
// Respeta preferencias: timeOfDay ('morning'|'afternoon'|'any'), maxDaysAhead, preferredDoctorId.
function findEarliestSlot(doctors, speciality, slotDuration, preferences, allAppointments, startDate) {
  const { timeOfDay = 'any', maxDaysAhead = 30, preferredDoctorId = null } = preferences;
  const specialists = doctors.filter(d => d.speciality === speciality);
  if (specialists.length === 0) return null;

  const sorted = preferredDoctorId
    ? [specialists.find(d => d.id === preferredDoctorId), ...specialists.filter(d => d.id !== preferredDoctorId)].filter(Boolean)
    : specialists;

  const refDate = new Date(startDate);

  for (let dayOffset = 0; dayOffset < maxDaysAhead; dayOffset++) {
    const d = new Date(refDate);
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toISOString().split('T')[0];

    for (const doctor of sorted) {
      const slots = getDoctorAvailableSlots(doctor, dateStr, allAppointments, slotDuration);
      const filtered = slots.filter(slot => {
        const [h] = slot.split(':').map(Number);
        if (timeOfDay === 'morning') return h < 12;
        if (timeOfDay === 'afternoon') return h >= 12;
        return true;
      });
      if (filtered.length > 0) {
        return { doctorId: doctor.id, date: dateStr, startTime: filtered[0] };
      }
    }
  }

  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
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
  };
}
