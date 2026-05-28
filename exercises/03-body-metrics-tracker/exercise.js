/**
 * Body Metrics Tracker
 *
 * Modulo para rastrear medidas corporales con soporte de unidades metrico/imperial.
 */

// TODO: Convierte un peso entre unidades.
// Soporta: 'kg' -> 'lbs', 'lbs' -> 'kg', y misma unidad (retorna el mismo valor).
// Factor de conversion: 1 kg = 2.20462 lbs.
// Retorna el resultado redondeado a 2 decimales.
function convertWeight(value, from, to) {
  throw new Error('Not implemented');
}

// TODO: Convierte una altura entre unidades.
// Soporta: 'cm' -> 'in', 'in' -> 'cm', y misma unidad.
// Factor de conversion: 1 in = 2.54 cm.
// Retorna el resultado redondeado a 2 decimales.
function convertHeight(value, from, to) {
  throw new Error('Not implemented');
}

// TODO: Calcula el Indice de Masa Corporal (IMC / BMI).
// Parametros: weight (numero), height (numero), units ('metric' | 'imperial').
// Formula: peso_kg / (altura_m)^2
// Si units es 'imperial', convierte primero (lbs -> kg, in -> cm).
// Retorna el resultado redondeado a 2 decimales.
function calculateBMI(weight, height, units = 'metric') {
  throw new Error('Not implemented');
}

// TODO: Calcula la Tasa Metabolica Basal (TMB / BMR) usando la formula Mifflin-St Jeor.
// Recibe un objeto user: { weight, height, age, gender ('male'|'female'), units ('metric'|'imperial') }
// Formula hombre: (10 * peso_kg) + (6.25 * altura_cm) - (5 * edad) + 5
// Formula mujer:  (10 * peso_kg) + (6.25 * altura_cm) - (5 * edad) - 161
// Si units es 'imperial', convierte primero.
// Retorna el resultado redondeado a 2 decimales.
function calculateBMR(user) {
  throw new Error('Not implemented');
}

// TODO: Calcula las calorias diarias totales (TDEE) multiplicando el BMR por el factor de actividad.
// Factores: sedentary=1.2, light=1.375, moderate=1.55, active=1.725, veryActive=1.9
// Recibe: user (mismo formato que calculateBMR), activityLevel (string).
// Retorna el resultado redondeado a 2 decimales.
function calculateDailyCalories(user, activityLevel) {
  throw new Error('Not implemented');
}

// TODO: Retorna la categoria de IMC segun la OMS.
// < 18.5: 'Bajo peso' | 18.5-24.9: 'Normal' | 25-29.9: 'Sobrepeso' | >= 30: 'Obesidad'
function getBMICategory(bmi) {
  throw new Error('Not implemented');
}

// TODO: Clase para gestionar el perfil del usuario con preferencia de unidades.
// Constructor: { name, weightKg, heightCm, age, gender, unitPreference ('metric'|'imperial') }
// Los datos se almacenan internamente en metrico (_weightKg, _heightCm).
// Getter weight: retorna el peso en la unidad preferida del usuario.
// Setter weight: recibe el peso en la unidad preferida y lo convierte a kg internamente.
// Getter height: retorna la altura en la unidad preferida.
// Getter weightUnit: retorna 'kg' o 'lbs' segun preferencia.
// Getter heightUnit: retorna 'cm' o 'in' segun preferencia.
// Metodo addMeasurement(measurement): agrega medicion al array this.measurements.
// Metodo getBMI(): calcula y retorna el BMI usando los valores internos en metrico.
class UserProfile {
  constructor({ name, weightKg, heightCm, age, gender, unitPreference = 'metric' }) {
    throw new Error('Not implemented');
  }

  get weight() {
    throw new Error('Not implemented');
  }

  set weight(value) {
    throw new Error('Not implemented');
  }

  get height() {
    throw new Error('Not implemented');
  }

  get weightUnit() {
    throw new Error('Not implemented');
  }

  get heightUnit() {
    throw new Error('Not implemented');
  }

  addMeasurement(measurement) {
    throw new Error('Not implemented');
  }

  getBMI() {
    throw new Error('Not implemented');
  }
}

// TODO: Calcula el porcentaje de cambio de peso entre la primera y la ultima medicion.
// Recibe: measurements (array de objetos { weightKg, date }).
// Retorna: numero con 2 decimales (positivo = ganancia, negativo = perdida).
// Retorna null si hay menos de 2 mediciones.
function trackProgress(measurements) {
  throw new Error('Not implemented');
}

// TODO: Genera un plan de macronutrientes segun el objetivo del usuario.
// Recibe: user (instancia de UserProfile), goal ('lose'|'maintain'|'gain'), activityLevel (string).
// Calorias objetivo:
//   'lose':     calorias de mantenimiento - 500 (minimo 1200)
//   'maintain': calorias de mantenimiento
//   'gain':     calorias de mantenimiento + 300
// Distribucion de macros:
//   protein (g): peso_kg * 2
//   fat (g):     25% de las calorias objetivo / 9 kcal por gramo
//   carbs (g):   (calorias - proteina_kcal - grasa_kcal) / 4 (minimo 0)
// Retorna: { calories, protein, fat, carbs }
function generateMacroPlan(user, goal, activityLevel = 'moderate') {
  throw new Error('Not implemented');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    convertWeight,
    convertHeight,
    calculateBMI,
    calculateBMR,
    calculateDailyCalories,
    getBMICategory,
    UserProfile,
    trackProgress,
    generateMacroPlan,
  };
}
