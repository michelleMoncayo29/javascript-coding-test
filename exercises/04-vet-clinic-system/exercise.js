/**
 * Vet Clinic System
 *
 * Modulo para gestionar una clinica veterinaria: mascotas, duenos, citas y vacunas.
 */

// TODO: Clase para representar una mascota.
// Constructor: { name, species, breed, birthDate, ownerId }
// Debe normalizar species a minusculas.
// Metodo getAgeInMonths(referenceDate): retorna la edad en meses (minimo 0).
// Metodo getAgeInYears(referenceDate): retorna la edad en anios con 1 decimal.
class Pet {
  constructor({ name, species, breed, birthDate, ownerId }) {
    throw new Error('Not implemented');
  }

  getAgeInMonths(referenceDate = new Date()) {
    throw new Error('Not implemented');
  }

  getAgeInYears(referenceDate = new Date()) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para representar al dueno de una o varias mascotas.
// Constructor: { id, name, phone, email }
// Debe inicializar this.pets como array vacio.
// Metodo addPet(pet): agrega una mascota al array.
// Metodo getPetCount(): retorna la cantidad de mascotas registradas.
class Owner {
  constructor({ id, name, phone, email }) {
    throw new Error('Not implemented');
  }

  addPet(pet) {
    throw new Error('Not implemented');
  }

  getPetCount() {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para gestionar el historial medico de una mascota.
// Constructor: petName (string).
// Debe usar un Map interno (_history) con clave fecha ISO (YYYY-MM-DD) y valor array de entradas.
// Debe usar un Set (appliedVaccines) para registrar las vacunas aplicadas.
// Metodo addEntry(date, entry): agrega una entrada al historial en la fecha indicada.
// Metodo getEntriesByDate(date): retorna las entradas de una fecha especifica ([] si no hay).
// Metodo getAllEntries(): retorna todas las entradas ordenadas por fecha ascendente.
// Metodo applyVaccine(vaccineName, date): registra la vacuna en el Set y en el historial.
// Metodo hasVaccine(vaccineName): retorna true si la vacuna fue aplicada alguna vez.
class MedicalRecord {
  constructor(petName) {
    throw new Error('Not implemented');
  }

  addEntry(date, entry) {
    throw new Error('Not implemented');
  }

  getEntriesByDate(date) {
    throw new Error('Not implemented');
  }

  getAllEntries() {
    throw new Error('Not implemented');
  }

  applyVaccine(vaccineName, date) {
    throw new Error('Not implemented');
  }

  hasVaccine(vaccineName) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para representar una cita veterinaria.
// Constructor: { id, petName, vetName, startTime, endTime, reason }
// Debe convertir startTime y endTime a objetos Date.
class Appointment {
  constructor({ id, petName, vetName, startTime, endTime, reason }) {
    throw new Error('Not implemented');
  }
}

// TODO: Detecta si dos citas se solapan en el tiempo.
// Dos citas se solapan si: start1 < end2 AND start2 < end1.
// Citas consecutivas (end1 === start2) NO se consideran solapadas.
// Retorna boolean.
function hasConflict(appointment1, appointment2) {
  throw new Error('Not implemented');
}

// TODO: Retorna la lista de vacunas pendientes para una mascota.
// Recibe: pet (instancia Pet), medicalRecord (instancia MedicalRecord), referenceDate.
// Reglas:
//   - Si la mascota tiene menos de 2 meses: retornar [].
//   - Esquema por especie: dog: [distemper, parvovirus, rabies, bordetella],
//     cat: [panleukopenia, calicivirus, herpesvirus, rabies], rabbit: [myxomatosis, hemorrhagicDisease].
//   - Una vacuna es pendiente si: nunca fue aplicada, O fue aplicada pero supero su intervalo de refuerzo.
//   - Intervalos en meses: rabies=12, bordetella=12, myxomatosis=6, hemorrhagicDisease=12, resto=36.
// Cada item del resultado: { vaccine: string, reason: 'never_applied'|'overdue', dueDate: string|null }
// Orden: primero 'never_applied', luego 'overdue' ordenadas por dueDate ascendente.
function getPendingVaccinations(pet, medicalRecord, referenceDate = new Date()) {
  throw new Error('Not implemented');
}

// TODO: Retorna las citas de un veterinario especifico dentro de un rango de fechas.
// Filtra por vetName, por startTime >= startDate y startTime <= endDate.
// Retorna las citas ordenadas por startTime ascendente.
function getVetSchedule(appointments, vetName, startDate, endDate) {
  throw new Error('Not implemented');
}

// TODO: Retorna las mascotas que necesitan una vacuna especifica.
// Recibe: pets (array de Pet), medicalRecords (Map<petName, MedicalRecord>), vaccineName, referenceDate.
// Si una mascota no tiene registro medico, se asume que necesita todas las vacunas.
// Usa getPendingVaccinations para determinar si cada mascota necesita la vacuna.
function getPetsNeedingVaccine(pets, medicalRecords, vaccineName, referenceDate = new Date()) {
  throw new Error('Not implemented');
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
