/**
 * Body Metrics Tracker
 *
 * Module for tracking body measurements with metric/imperial unit support.
 */

// IMPLEMENTADO: Conversion directa con constantes de conversion estandar.
function convertWeight(value, from, to) {
  if (from === to) return parseFloat(value.toFixed(2));
  if (from === 'kg' && to === 'lbs') return parseFloat((value * 2.20462).toFixed(2));
  if (from === 'lbs' && to === 'kg') return parseFloat((value / 2.20462).toFixed(2));
  throw new Error(`Conversion no soportada: ${from} -> ${to}`);
}

// IMPLEMENTADO: Conversion directa altura con constantes estandar.
function convertHeight(value, from, to) {
  if (from === to) return parseFloat(value.toFixed(2));
  if (from === 'cm' && to === 'in') return parseFloat((value / 2.54).toFixed(2));
  if (from === 'in' && to === 'cm') return parseFloat((value * 2.54).toFixed(2));
  throw new Error(`Conversion no soportada: ${from} -> ${to}`);
}

// IMPLEMENTADO: BMI = peso(kg) / altura(m)^2.
// Si las unidades son imperiales, se convierte primero a metrico.
function calculateBMI(weight, height, units = 'metric') {
  let weightKg = weight;
  let heightCm = height;
  if (units === 'imperial') {
    weightKg = convertWeight(weight, 'lbs', 'kg');
    heightCm = convertHeight(height, 'in', 'cm');
  }
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}

// IMPLEMENTADO: Formula de Harris-Benedict revisada (Mifflin-St Jeor).
// Hombre: 10*peso + 6.25*altura - 5*edad + 5
// Mujer:  10*peso + 6.25*altura - 5*edad - 161
// Si las unidades son imperiales, se convierten primero.
function calculateBMR(user) {
  const { weight, height, age, gender, units = 'metric' } = user;
  let weightKg = weight;
  let heightCm = height;
  if (units === 'imperial') {
    weightKg = convertWeight(weight, 'lbs', 'kg');
    heightCm = convertHeight(height, 'in', 'cm');
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return parseFloat(bmr.toFixed(2));
}

// IMPLEMENTADO: TDEE = BMR * factor de actividad.
// Los factores siguen la escala de Harris-Benedict estandar.
function calculateDailyCalories(user, activityLevel) {
  const factors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  const factor = factors[activityLevel] ?? 1.2;
  return parseFloat((calculateBMR(user) * factor).toFixed(2));
}

// IMPLEMENTADO: Calcula el indice de masa corporal y retorna la categoria OMS.
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidad';
}

// IMPLEMENTADO: Clase que mantiene el perfil del usuario con preferencia de unidades.
// Los getters weight/height devuelven los valores en las unidades preferidas del usuario.
// Los valores se almacenan siempre en metrico internamente.
class UserProfile {
  constructor({ name, weightKg, heightCm, age, gender, unitPreference = 'metric' }) {
    this.name = name;
    this._weightKg = weightKg;
    this._heightCm = heightCm;
    this.age = age;
    this.gender = gender;
    this.unitPreference = unitPreference;
    this.measurements = [];
  }

  get weight() {
    if (this.unitPreference === 'imperial') return convertWeight(this._weightKg, 'kg', 'lbs');
    return parseFloat(this._weightKg.toFixed(2));
  }

  set weight(value) {
    this._weightKg = this.unitPreference === 'imperial'
      ? convertWeight(value, 'lbs', 'kg')
      : value;
  }

  get height() {
    if (this.unitPreference === 'imperial') return convertHeight(this._heightCm, 'cm', 'in');
    return parseFloat(this._heightCm.toFixed(2));
  }

  get weightUnit() {
    return this.unitPreference === 'imperial' ? 'lbs' : 'kg';
  }

  get heightUnit() {
    return this.unitPreference === 'imperial' ? 'in' : 'cm';
  }

  addMeasurement(measurement) {
    this.measurements.push({ ...measurement, date: new Date(measurement.date) });
  }

  getBMI() {
    return calculateBMI(this._weightKg, this._heightCm, 'metric');
  }
}

// IMPLEMENTADO: Calcula el % de cambio entre la primera y la ultima medicion del array.
// Retorna null si hay menos de 2 mediciones.
function trackProgress(measurements) {
  if (!measurements || measurements.length < 2) return null;
  const first = measurements[0].weightKg;
  const last = measurements[measurements.length - 1].weightKg;
  const change = ((last - first) / first) * 100;
  return parseFloat(change.toFixed(2));
}

// IMPLEMENTADO: Genera un plan de macronutrientes segun objetivo.
// 'lose': deficit de 500 kcal/dia (minimo 1200 kcal)
// 'maintain': calorias de mantenimiento
// 'gain': superavit de 300 kcal/dia
// Distribucion de macros:
//   proteina: 2g por kg de peso (siempre, independiente del objetivo)
//   grasa: 25% de las calorias objetivo (1g de grasa = 9 kcal)
//   carbohidratos: calorias restantes / 4
// Retorna: { calories, protein, fat, carbs } en gramos (excepto calories en kcal).
function generateMacroPlan(user, goal, activityLevel = 'moderate') {
  const maintenanceCalories = calculateDailyCalories(
    { weight: user._weightKg, height: user._heightCm, age: user.age, gender: user.gender, units: 'metric' },
    activityLevel
  );

  let targetCalories;
  if (goal === 'lose') targetCalories = Math.max(maintenanceCalories - 500, 1200);
  else if (goal === 'gain') targetCalories = maintenanceCalories + 300;
  else targetCalories = maintenanceCalories;

  const protein = parseFloat((user._weightKg * 2).toFixed(1));
  const proteinCalories = protein * 4;
  const fat = parseFloat(((targetCalories * 0.25) / 9).toFixed(1));
  const fatCalories = fat * 9;
  const carbs = parseFloat(((targetCalories - proteinCalories - fatCalories) / 4).toFixed(1));

  return {
    calories: parseFloat(targetCalories.toFixed(0)),
    protein,
    fat,
    carbs: Math.max(carbs, 0),
  };
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
