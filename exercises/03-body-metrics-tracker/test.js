/**
 * Pruebas para: Body Metrics Tracker
 *
 * Ejecutar con: npm test exercises/03-body-metrics-tracker
 */

const {
  convertWeight,
  convertHeight,
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  getBMICategory,
  UserProfile,
  trackProgress,
  generateMacroPlan,
} = require('./exercise.js');

describe('Body Metrics Tracker - convertWeight', () => {
  test('debe convertir kg a lbs correctamente', () => {
    expect(convertWeight(70, 'kg', 'lbs')).toBeCloseTo(154.32, 1);
  });

  test('debe convertir lbs a kg correctamente', () => {
    expect(convertWeight(154.32, 'lbs', 'kg')).toBeCloseTo(70, 1);
  });

  test('debe retornar el mismo valor si las unidades son iguales', () => {
    expect(convertWeight(70, 'kg', 'kg')).toBe(70);
  });

  test('debe redondear a 2 decimales', () => {
    const result = convertWeight(68, 'kg', 'lbs');
    expect(result.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });
});

describe('Body Metrics Tracker - convertHeight', () => {
  test('debe convertir cm a pulgadas correctamente', () => {
    expect(convertHeight(170, 'cm', 'in')).toBeCloseTo(66.93, 1);
  });

  test('debe convertir pulgadas a cm correctamente', () => {
    expect(convertHeight(66.93, 'in', 'cm')).toBeCloseTo(170, 0);
  });

  test('debe retornar el mismo valor si las unidades son iguales', () => {
    expect(convertHeight(170, 'cm', 'cm')).toBe(170);
  });
});

describe('Body Metrics Tracker - calculateBMI', () => {
  test('debe calcular BMI en sistema metrico correctamente', () => {
    // 70kg / (1.75m)^2 = 22.86
    expect(calculateBMI(70, 175, 'metric')).toBeCloseTo(22.86, 1);
  });

  test('debe calcular BMI en sistema imperial correctamente', () => {
    // 154.32 lbs / (68.9 in)^2 = igual que metrico
    const metricBMI = calculateBMI(70, 175, 'metric');
    const imperialBMI = calculateBMI(convertWeight(70, 'kg', 'lbs'), convertHeight(175, 'cm', 'in'), 'imperial');
    expect(imperialBMI).toBeCloseTo(metricBMI, 0);
  });

  test('debe retornar BMI mayor a 30 para una persona con obesidad', () => {
    expect(calculateBMI(100, 170, 'metric')).toBeGreaterThan(30);
  });
});

describe('Body Metrics Tracker - calculateBMR', () => {
  test('debe calcular BMR para hombre correctamente (Mifflin-St Jeor)', () => {
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
    const user = { weight: 70, height: 175, age: 30, gender: 'male', units: 'metric' };
    expect(calculateBMR(user)).toBeCloseTo(1648.75, 1);
  });

  test('debe calcular BMR para mujer correctamente', () => {
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    const user = { weight: 60, height: 165, age: 25, gender: 'female', units: 'metric' };
    expect(calculateBMR(user)).toBeCloseTo(1345.25, 1);
  });

  test('BMR en imperial debe dar resultado cercano al metrico equivalente', () => {
    const metricUser = { weight: 70, height: 175, age: 30, gender: 'male', units: 'metric' };
    const imperialUser = {
      weight: convertWeight(70, 'kg', 'lbs'),
      height: convertHeight(175, 'cm', 'in'),
      age: 30,
      gender: 'male',
      units: 'imperial',
    };
    expect(calculateBMR(imperialUser)).toBeCloseTo(calculateBMR(metricUser), 0);
  });
});

describe('Body Metrics Tracker - calculateDailyCalories', () => {
  test('actividad sedentaria debe retornar BMR * 1.2', () => {
    const user = { weight: 70, height: 175, age: 30, gender: 'male', units: 'metric' };
    const bmr = calculateBMR(user);
    expect(calculateDailyCalories(user, 'sedentary')).toBeCloseTo(bmr * 1.2, 0);
  });

  test('actividad activa debe dar mas calorias que sedentario', () => {
    const user = { weight: 70, height: 175, age: 30, gender: 'male', units: 'metric' };
    const sedentary = calculateDailyCalories(user, 'sedentary');
    const active = calculateDailyCalories(user, 'active');
    expect(active).toBeGreaterThan(sedentary);
  });
});

describe('Body Metrics Tracker - getBMICategory', () => {
  test('BMI < 18.5 es Bajo peso', () => {
    expect(getBMICategory(17)).toBe('Bajo peso');
  });

  test('BMI entre 18.5 y 24.9 es Normal', () => {
    expect(getBMICategory(22)).toBe('Normal');
  });

  test('BMI entre 25 y 29.9 es Sobrepeso', () => {
    expect(getBMICategory(27)).toBe('Sobrepeso');
  });

  test('BMI >= 30 es Obesidad', () => {
    expect(getBMICategory(32)).toBe('Obesidad');
  });
});

describe('Body Metrics Tracker - UserProfile', () => {
  test('debe retornar peso en kg para preferencia metrica', () => {
    const user = new UserProfile({ name: 'Carlos', weightKg: 70, heightCm: 175, age: 30, gender: 'male', unitPreference: 'metric' });
    expect(user.weight).toBe(70);
    expect(user.weightUnit).toBe('kg');
  });

  test('debe retornar peso en lbs para preferencia imperial', () => {
    const user = new UserProfile({ name: 'Carlos', weightKg: 70, heightCm: 175, age: 30, gender: 'male', unitPreference: 'imperial' });
    expect(user.weight).toBeCloseTo(154.32, 1);
    expect(user.weightUnit).toBe('lbs');
  });

  test('debe retornar altura en pulgadas para preferencia imperial', () => {
    const user = new UserProfile({ name: 'Ana', weightKg: 60, heightCm: 165, age: 25, gender: 'female', unitPreference: 'imperial' });
    expect(user.height).toBeCloseTo(64.96, 1);
    expect(user.heightUnit).toBe('in');
  });

  test('setter de peso debe convertir correctamente desde imperial', () => {
    const user = new UserProfile({ name: 'Luis', weightKg: 70, heightCm: 175, age: 30, gender: 'male', unitPreference: 'imperial' });
    user.weight = 176.37; // ~80kg
    expect(user._weightKg).toBeCloseTo(80, 0);
  });

  test('getBMI debe calcular el BMI usando los valores internos en metrico', () => {
    const user = new UserProfile({ name: 'Test', weightKg: 70, heightCm: 175, age: 30, gender: 'male' });
    expect(user.getBMI()).toBeCloseTo(22.86, 1);
  });

  test('addMeasurement debe registrar mediciones', () => {
    const user = new UserProfile({ name: 'Test', weightKg: 70, heightCm: 175, age: 30, gender: 'male' });
    user.addMeasurement({ weightKg: 70, date: '2025-01-01' });
    user.addMeasurement({ weightKg: 68, date: '2025-02-01' });
    expect(user.measurements).toHaveLength(2);
  });
});

describe('Body Metrics Tracker - trackProgress', () => {
  test('debe calcular porcentaje de cambio correctamente (perdida)', () => {
    const measurements = [
      { weightKg: 80, date: '2025-01-01' },
      { weightKg: 76, date: '2025-02-01' },
    ];
    expect(trackProgress(measurements)).toBeCloseTo(-5, 1);
  });

  test('debe calcular porcentaje de cambio correctamente (ganancia)', () => {
    const measurements = [
      { weightKg: 70, date: '2025-01-01' },
      { weightKg: 73.5, date: '2025-03-01' },
    ];
    expect(trackProgress(measurements)).toBeCloseTo(5, 1);
  });

  test('debe retornar null con menos de 2 mediciones', () => {
    expect(trackProgress([{ weightKg: 70, date: '2025-01-01' }])).toBeNull();
    expect(trackProgress([])).toBeNull();
  });

  test('debe considerar solo la primera y la ultima medicion', () => {
    const measurements = [
      { weightKg: 80, date: '2025-01-01' },
      { weightKg: 90, date: '2025-02-01' },
      { weightKg: 72, date: '2025-03-01' },
    ];
    expect(trackProgress(measurements)).toBeCloseTo(-10, 1);
  });
});

describe('Body Metrics Tracker - generateMacroPlan', () => {
  let user;
  beforeEach(() => {
    user = new UserProfile({ name: 'Test', weightKg: 75, heightCm: 175, age: 28, gender: 'male' });
  });

  test('objetivo perder debe tener deficit de 500 kcal respecto a mantenimiento', () => {
    const maintain = generateMacroPlan(user, 'maintain', 'moderate');
    const lose = generateMacroPlan(user, 'lose', 'moderate');
    expect(maintain.calories - lose.calories).toBe(500);
  });

  test('objetivo ganar debe tener superavit de 300 kcal', () => {
    const maintain = generateMacroPlan(user, 'maintain', 'moderate');
    const gain = generateMacroPlan(user, 'gain', 'moderate');
    expect(gain.calories - maintain.calories).toBe(300);
  });

  test('proteina debe ser 2g por kg de peso corporal', () => {
    const plan = generateMacroPlan(user, 'maintain', 'moderate');
    expect(plan.protein).toBeCloseTo(user._weightKg * 2, 0);
  });

  test('calorias para perder no deben bajar de 1200', () => {
    const lightUser = new UserProfile({ name: 'Mini', weightKg: 45, heightCm: 155, age: 20, gender: 'female' });
    const plan = generateMacroPlan(lightUser, 'lose', 'sedentary');
    expect(plan.calories).toBeGreaterThanOrEqual(1200);
  });

  test('el plan debe tener las propiedades calories, protein, fat, carbs', () => {
    const plan = generateMacroPlan(user, 'maintain', 'moderate');
    expect(plan).toHaveProperty('calories');
    expect(plan).toHaveProperty('protein');
    expect(plan).toHaveProperty('fat');
    expect(plan).toHaveProperty('carbs');
  });
});
