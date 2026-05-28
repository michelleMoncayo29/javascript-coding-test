/**
 * Vet Clinic System
 *
 * Module for managing a veterinary clinic: pets, owners, appointments, and vaccination schedules.
 */

// IMPLEMENTADO: Clase para representar una mascota con sus datos basicos.
class Pet {
  constructor({ name, species, breed, birthDate, ownerId }) {
    this.name = name;
    this.species = species.toLowerCase();
    this.breed = breed;
    this.birthDate = new Date(birthDate);
    this.ownerId = ownerId;
  }

  getAgeInMonths(referenceDate = new Date()) {
    const ref = new Date(referenceDate);
    const months =
      (ref.getFullYear() - this.birthDate.getFullYear()) * 12 +
      (ref.getMonth() - this.birthDate.getMonth());
    return Math.max(months, 0);
  }

  getAgeInYears(referenceDate = new Date()) {
    return parseFloat((this.getAgeInMonths(referenceDate) / 12).toFixed(1));
  }
}

// IMPLEMENTADO: Clase para representar el dueno de una mascota.
class Owner {
  constructor({ id, name, phone, email }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.pets = [];
  }

  addPet(pet) {
    this.pets.push(pet);
  }

  getPetCount() {
    return this.pets.length;
  }
}

// IMPLEMENTADO: Clase para gestionar el historial medico de una mascota usando Map.
// La clave es un string de fecha ISO, el valor es un array de registros para ese dia.
class MedicalRecord {
  constructor(petName) {
    this.petName = petName;
    this._history = new Map();
    this.appliedVaccines = new Set();
  }

  addEntry(date, entry) {
    const key = new Date(date).toISOString().split('T')[0];
    if (!this._history.has(key)) this._history.set(key, []);
    this._history.get(key).push({ ...entry, date: key });
  }

  getEntriesByDate(date) {
    const key = new Date(date).toISOString().split('T')[0];
    return this._history.get(key) ?? [];
  }

  getAllEntries() {
    const entries = [];
    for (const dayEntries of this._history.values()) {
      entries.push(...dayEntries);
    }
    return entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  applyVaccine(vaccineName, date) {
    this.appliedVaccines.add(vaccineName);
    this.addEntry(date, { type: 'vaccine', vaccine: vaccineName });
  }

  hasVaccine(vaccineName) {
    return this.appliedVaccines.has(vaccineName);
  }
}

// IMPLEMENTADO: Detecta si dos citas se solapan en el tiempo.
function hasConflict(appointment1, appointment2) {
  const start1 = new Date(appointment1.startTime);
  const end1 = new Date(appointment1.endTime);
  const start2 = new Date(appointment2.startTime);
  const end2 = new Date(appointment2.endTime);
  return start1 < end2 && start2 < end1;
}

// IMPLEMENTADO: Clase para gestionar las citas de la clinica.
class Appointment {
  constructor({ id, petName, vetName, startTime, endTime, reason }) {
    this.id = id;
    this.petName = petName;
    this.vetName = vetName;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.reason = reason;
  }
}

// IMPLEMENTADO: Retorna las vacunas pendientes para una mascota segun su especie, edad y historial.
// Esquema de vacunacion por especie:
//   Perro: ['distemper', 'parvovirus', 'rabies', 'bordetella']
//   Gato:  ['panleukopenia', 'calicivirus', 'herpesvirus', 'rabies']
//   Conejo: ['myxomatosis', 'hemorrhagicDisease']
// Regla de edad: vacunas core se dan desde los 8 semanas (2 meses).
// Intervalos de refuerzo:
//   rabies: cada 12 meses
//   bordetella: cada 12 meses
//   myxomatosis: cada 6 meses
//   hemorrhagicDisease: cada 12 meses
//   resto: cada 36 meses
// Resultado ordenado: primero las que nunca se han aplicado, luego las proximas por fecha.
function getPendingVaccinations(pet, medicalRecord, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const ageMonths = pet.getAgeInMonths(ref);

  if (ageMonths < 2) return [];

  const schedules = {
    dog: ['distemper', 'parvovirus', 'rabies', 'bordetella'],
    cat: ['panleukopenia', 'calicivirus', 'herpesvirus', 'rabies'],
    rabbit: ['myxomatosis', 'hemorrhagicDisease'],
  };

  const refreshIntervalMonths = {
    rabies: 12,
    bordetella: 12,
    myxomatosis: 6,
    hemorrhagicDisease: 12,
  };

  const vaccines = schedules[pet.species] ?? [];
  const pending = [];

  for (const vaccine of vaccines) {
    if (!medicalRecord.hasVaccine(vaccine)) {
      pending.push({ vaccine, reason: 'never_applied', dueDate: null });
      continue;
    }

    const entries = medicalRecord.getAllEntries().filter(
      e => e.type === 'vaccine' && e.vaccine === vaccine
    );
    if (entries.length === 0) continue;

    const lastEntry = entries[entries.length - 1];
    const lastDate = new Date(lastEntry.date);
    const intervalMonths = refreshIntervalMonths[vaccine] ?? 36;
    const dueDate = new Date(lastDate);
    dueDate.setMonth(dueDate.getMonth() + intervalMonths);

    if (dueDate <= ref) {
      pending.push({ vaccine, reason: 'overdue', dueDate: dueDate.toISOString().split('T')[0] });
    }
  }

  pending.sort((a, b) => {
    if (a.reason === 'never_applied' && b.reason !== 'never_applied') return -1;
    if (a.reason !== 'never_applied' && b.reason === 'never_applied') return 1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return 0;
  });

  return pending;
}

// IMPLEMENTADO: Filtra las citas de un veterinario especifico en un rango de fechas.
function getVetSchedule(appointments, vetName, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return appointments.filter(appt => {
    return appt.vetName === vetName &&
      appt.startTime >= start &&
      appt.startTime <= end;
  }).sort((a, b) => a.startTime - b.startTime);
}

// IMPLEMENTADO: Retorna todas las mascotas que tienen una vacuna especifica pendiente.
function getPetsNeedingVaccine(pets, medicalRecords, vaccineName, referenceDate = new Date()) {
  return pets.filter(pet => {
    const record = medicalRecords.get(pet.name);
    if (!record) return true;
    const pending = getPendingVaccinations(pet, record, referenceDate);
    return pending.some(p => p.vaccine === vaccineName);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Pet,
    Owner,
    MedicalRecord,
    Appointment,
    hasConflict,
    getPendingVaccinations,
    getVetSchedule,
    getPetsNeedingVaccine,
  };
}
