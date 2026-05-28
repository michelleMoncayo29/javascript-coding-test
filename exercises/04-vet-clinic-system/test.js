/**
 * Pruebas para: Vet Clinic System
 *
 * Ejecutar con: npm test exercises/04-vet-clinic-system
 */

const {
  Pet,
  Owner,
  MedicalRecord,
  Appointment,
  hasConflict,
  getPendingVaccinations,
  getVetSchedule,
  getPetsNeedingVaccine,
} = require('./exercise.js');

describe('Vet Clinic System - Pet', () => {
  test('debe crear una mascota con las propiedades correctas', () => {
    const pet = new Pet({ name: 'Firulais', species: 'Dog', breed: 'Labrador', birthDate: '2022-01-15', ownerId: 'owner-1' });
    expect(pet.name).toBe('Firulais');
    expect(pet.species).toBe('dog');
    expect(pet.breed).toBe('Labrador');
  });

  test('getAgeInMonths debe retornar los meses correctos', () => {
    const pet = new Pet({ name: 'Luna', species: 'cat', breed: 'Siames', birthDate: '2023-01-01', ownerId: 'o1' });
    expect(pet.getAgeInMonths('2024-01-01')).toBe(12);
  });

  test('getAgeInYears debe retornar los anios con un decimal', () => {
    const pet = new Pet({ name: 'Rex', species: 'dog', breed: 'Beagle', birthDate: '2022-07-01', ownerId: 'o1' });
    expect(pet.getAgeInYears('2024-01-01')).toBeCloseTo(1.5, 1);
  });

  test('getAgeInMonths no debe retornar valores negativos', () => {
    const pet = new Pet({ name: 'Bebé', species: 'cat', breed: 'Persa', birthDate: '2030-01-01', ownerId: 'o1' });
    expect(pet.getAgeInMonths('2025-01-01')).toBe(0);
  });
});

describe('Vet Clinic System - Owner', () => {
  test('debe crear un dueno y permitir agregar mascotas', () => {
    const owner = new Owner({ id: 'o1', name: 'Juan Perez', phone: '555-0001', email: 'juan@mail.com' });
    const pet = new Pet({ name: 'Toby', species: 'dog', breed: 'Poodle', birthDate: '2020-05-01', ownerId: 'o1' });
    owner.addPet(pet);
    expect(owner.pets).toHaveLength(1);
    expect(owner.getPetCount()).toBe(1);
  });

  test('debe inicializar con array de mascotas vacio', () => {
    const owner = new Owner({ id: 'o2', name: 'Ana', phone: '555-0002', email: 'ana@mail.com' });
    expect(owner.pets).toEqual([]);
    expect(owner.getPetCount()).toBe(0);
  });
});

describe('Vet Clinic System - MedicalRecord', () => {
  test('debe agregar y recuperar entradas por fecha', () => {
    const record = new MedicalRecord('Firulais');
    record.addEntry('2025-03-15', { type: 'checkup', notes: 'Saludable' });
    const entries = record.getEntriesByDate('2025-03-15');
    expect(entries).toHaveLength(1);
    expect(entries[0].type).toBe('checkup');
  });

  test('debe retornar array vacio para fecha sin entradas', () => {
    const record = new MedicalRecord('Luna');
    expect(record.getEntriesByDate('2025-01-01')).toEqual([]);
  });

  test('applyVaccine debe registrar la vacuna en appliedVaccines y en el historial', () => {
    const record = new MedicalRecord('Rex');
    record.applyVaccine('rabies', '2024-06-01');
    expect(record.hasVaccine('rabies')).toBe(true);
    expect(record.hasVaccine('parvovirus')).toBe(false);
  });

  test('getAllEntries debe retornar todas las entradas ordenadas por fecha', () => {
    const record = new MedicalRecord('Max');
    record.addEntry('2025-05-01', { type: 'checkup' });
    record.addEntry('2025-03-01', { type: 'surgery' });
    const all = record.getAllEntries();
    expect(all).toHaveLength(2);
    expect(all[0].date).toBe('2025-03-01');
    expect(all[1].date).toBe('2025-05-01');
  });

  test('appliedVaccines debe ser un Set (sin duplicados)', () => {
    const record = new MedicalRecord('Buddy');
    record.applyVaccine('rabies', '2023-01-01');
    record.applyVaccine('rabies', '2024-01-01');
    expect(record.appliedVaccines.size).toBe(1);
  });
});

describe('Vet Clinic System - hasConflict', () => {
  test('debe detectar solapamiento de citas', () => {
    const a1 = { startTime: '2025-06-01T09:00', endTime: '2025-06-01T09:30' };
    const a2 = { startTime: '2025-06-01T09:15', endTime: '2025-06-01T09:45' };
    expect(hasConflict(a1, a2)).toBe(true);
  });

  test('no debe detectar conflicto entre citas consecutivas', () => {
    const a1 = { startTime: '2025-06-01T09:00', endTime: '2025-06-01T09:30' };
    const a2 = { startTime: '2025-06-01T09:30', endTime: '2025-06-01T10:00' };
    expect(hasConflict(a1, a2)).toBe(false);
  });

  test('no debe detectar conflicto entre citas separadas', () => {
    const a1 = { startTime: '2025-06-01T09:00', endTime: '2025-06-01T09:30' };
    const a2 = { startTime: '2025-06-01T11:00', endTime: '2025-06-01T11:30' };
    expect(hasConflict(a1, a2)).toBe(false);
  });

  test('debe detectar cuando una cita contiene completamente a otra', () => {
    const a1 = { startTime: '2025-06-01T08:00', endTime: '2025-06-01T12:00' };
    const a2 = { startTime: '2025-06-01T09:00', endTime: '2025-06-01T10:00' };
    expect(hasConflict(a1, a2)).toBe(true);
  });
});

describe('Vet Clinic System - getPendingVaccinations', () => {
  test('debe retornar todas las vacunas core para un perro sin historial', () => {
    const pet = new Pet({ name: 'Zeus', species: 'dog', breed: 'Pastor', birthDate: '2023-01-01', ownerId: 'o1' });
    const record = new MedicalRecord('Zeus');
    const pending = getPendingVaccinations(pet, record, '2025-01-01');
    const names = pending.map(p => p.vaccine);
    expect(names).toContain('distemper');
    expect(names).toContain('parvovirus');
    expect(names).toContain('rabies');
    expect(names).toContain('bordetella');
  });

  test('debe retornar array vacio para mascota menor de 2 meses', () => {
    const pet = new Pet({ name: 'Bebe', species: 'dog', breed: 'Chihuahua', birthDate: '2025-06-01', ownerId: 'o1' });
    const record = new MedicalRecord('Bebe');
    expect(getPendingVaccinations(pet, record, '2025-07-01')).toEqual([]);
  });

  test('no debe incluir vacunas aplicadas recientemente (dentro del intervalo)', () => {
    const pet = new Pet({ name: 'Michi', species: 'cat', breed: 'Tabby', birthDate: '2022-01-01', ownerId: 'o1' });
    const record = new MedicalRecord('Michi');
    record.applyVaccine('rabies', '2025-01-01');
    const pending = getPendingVaccinations(pet, record, '2025-06-01');
    const names = pending.map(p => p.vaccine);
    expect(names).not.toContain('rabies');
  });

  test('debe incluir rabies como vencida si pasaron mas de 12 meses desde la ultima aplicacion', () => {
    const pet = new Pet({ name: 'Nala', species: 'dog', breed: 'Golden', birthDate: '2020-01-01', ownerId: 'o1' });
    const record = new MedicalRecord('Nala');
    record.applyVaccine('rabies', '2023-01-01');
    const pending = getPendingVaccinations(pet, record, '2025-03-01');
    const names = pending.map(p => p.vaccine);
    expect(names).toContain('rabies');
  });

  test('las vacunas nunca aplicadas deben aparecer antes que las vencidas', () => {
    const pet = new Pet({ name: 'Thor', species: 'dog', breed: 'Husky', birthDate: '2020-01-01', ownerId: 'o1' });
    const record = new MedicalRecord('Thor');
    record.applyVaccine('rabies', '2023-01-01');
    const pending = getPendingVaccinations(pet, record, '2025-03-01');
    const firstReason = pending[0]?.reason;
    expect(firstReason).toBe('never_applied');
  });

  test('debe retornar las vacunas correctas para gatos', () => {
    const pet = new Pet({ name: 'Whiskers', species: 'cat', breed: 'Maine Coon', birthDate: '2022-01-01', ownerId: 'o1' });
    const record = new MedicalRecord('Whiskers');
    const pending = getPendingVaccinations(pet, record, '2025-01-01');
    const names = pending.map(p => p.vaccine);
    expect(names).toContain('panleukopenia');
    expect(names).toContain('calicivirus');
    expect(names).not.toContain('distemper');
  });
});

describe('Vet Clinic System - getVetSchedule', () => {
  let appointments;
  beforeEach(() => {
    appointments = [
      new Appointment({ id: '1', petName: 'Rex', vetName: 'Dr. Garcia', startTime: '2025-06-01T09:00', endTime: '2025-06-01T09:30', reason: 'Chequeo' }),
      new Appointment({ id: '2', petName: 'Luna', vetName: 'Dr. Garcia', startTime: '2025-06-01T10:00', endTime: '2025-06-01T10:30', reason: 'Vacuna' }),
      new Appointment({ id: '3', petName: 'Toby', vetName: 'Dr. Rios', startTime: '2025-06-01T09:00', endTime: '2025-06-01T09:30', reason: 'Cirugia' }),
      new Appointment({ id: '4', petName: 'Max', vetName: 'Dr. Garcia', startTime: '2025-07-15T09:00', endTime: '2025-07-15T09:30', reason: 'Seguimiento' }),
    ];
  });

  test('debe retornar solo citas del veterinario indicado', () => {
    const schedule = getVetSchedule(appointments, 'Dr. Garcia', '2025-06-01', '2025-06-30');
    expect(schedule.every(a => a.vetName === 'Dr. Garcia')).toBe(true);
  });

  test('debe filtrar por rango de fechas', () => {
    const schedule = getVetSchedule(appointments, 'Dr. Garcia', '2025-06-01', '2025-06-30');
    expect(schedule).toHaveLength(2);
  });

  test('no debe incluir citas fuera del rango', () => {
    const schedule = getVetSchedule(appointments, 'Dr. Garcia', '2025-06-01', '2025-06-30');
    const ids = schedule.map(a => a.id);
    expect(ids).not.toContain('4');
  });

  test('debe ordenar las citas por hora de inicio', () => {
    const schedule = getVetSchedule(appointments, 'Dr. Garcia', '2025-06-01', '2025-06-30');
    expect(schedule[0].id).toBe('1');
    expect(schedule[1].id).toBe('2');
  });
});
