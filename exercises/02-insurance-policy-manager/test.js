/**
 * Pruebas para: Insurance Policy Manager
 *
 * Ejecutar con: npm test exercises/02-insurance-policy-manager
 */

const {
  Policy,
  AutoPolicy,
  HomePolicy,
  LifePolicy,
  processClaim,
  calculateRenewalPremium,
  groupPoliciesByType,
  getExpiringPolicies,
  getMonthlyPremium,
} = require('./exercise.js');

// --- Datos de prueba reutilizables ---
const baseData = {
  policyNumber: 'POL-001',
  holderName: 'Maria Lopez',
  startDate: '2024-01-01',
  endDate: '2025-12-31',
  basePremium: 1200,
  deductible: 200,
};

describe('Insurance Policy Manager - Policy (clase base)', () => {
  test('debe crear una poliza con las propiedades correctas', () => {
    const p = new Policy(baseData);
    expect(p.policyNumber).toBe('POL-001');
    expect(p.holderName).toBe('Maria Lopez');
    expect(p.basePremium).toBe(1200);
    expect(p.deductible).toBe(200);
    expect(p.claims).toEqual([]);
  });

  test('isActive debe retornar true para una fecha dentro del rango', () => {
    const p = new Policy(baseData);
    expect(p.isActive('2025-06-15')).toBe(true);
  });

  test('isActive debe retornar false para una fecha fuera del rango', () => {
    const p = new Policy(baseData);
    expect(p.isActive('2026-01-01')).toBe(false);
  });

  test('addClaim y getClaimsTotal deben registrar y sumar reclamos', () => {
    const p = new Policy(baseData);
    p.addClaim({ amount: 500, date: '2025-03-01', description: 'Dano' });
    p.addClaim({ amount: 300, date: '2025-04-01', description: 'Robo parcial' });
    expect(p.getClaimsTotal()).toBe(800);
  });
});

describe('Insurance Policy Manager - AutoPolicy', () => {
  test('type debe ser AUTO', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2020, driverAge: 30, hasAccidentHistory: false });
    expect(p.type).toBe('AUTO');
  });

  test('getRiskFactor debe retornar 1 para conductor de bajo riesgo con auto reciente', () => {
    const p = new AutoPolicy({
      ...baseData,
      vehicleYear: new Date().getFullYear() - 2,
      driverAge: 35,
      hasAccidentHistory: false,
    });
    expect(p.getRiskFactor()).toBe(1.0);
  });

  test('getRiskFactor debe incrementar por conductor joven', () => {
    const p = new AutoPolicy({
      ...baseData,
      vehicleYear: new Date().getFullYear() - 2,
      driverAge: 22,
      hasAccidentHistory: false,
    });
    expect(p.getRiskFactor()).toBeGreaterThan(1.0);
  });

  test('getRiskFactor debe incrementar por historial de accidentes', () => {
    const sin = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: false });
    const con = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: true });
    expect(con.getRiskFactor()).toBeGreaterThan(sin.getRiskFactor());
  });
});

describe('Insurance Policy Manager - HomePolicy', () => {
  test('type debe ser HOME', () => {
    const p = new HomePolicy({ ...baseData, propertyValue: 200000, propertyAgeYears: 10, zone: 'low' });
    expect(p.type).toBe('HOME');
  });

  test('getRiskFactor en zona high debe ser mayor que en zona low', () => {
    const low = new HomePolicy({ ...baseData, propertyValue: 200000, propertyAgeYears: 5, zone: 'low' });
    const high = new HomePolicy({ ...baseData, propertyValue: 200000, propertyAgeYears: 5, zone: 'high' });
    expect(high.getRiskFactor()).toBeGreaterThan(low.getRiskFactor());
  });

  test('getRiskFactor debe ser mayor para propiedad antigua', () => {
    const nueva = new HomePolicy({ ...baseData, propertyValue: 200000, propertyAgeYears: 5, zone: 'low' });
    const antigua = new HomePolicy({ ...baseData, propertyValue: 200000, propertyAgeYears: 35, zone: 'low' });
    expect(antigua.getRiskFactor()).toBeGreaterThan(nueva.getRiskFactor());
  });
});

describe('Insurance Policy Manager - LifePolicy', () => {
  test('type debe ser LIFE', () => {
    const p = new LifePolicy({ ...baseData, insuredAge: 30, smoker: false, preExistingConditions: false, coverageAmount: 100000 });
    expect(p.type).toBe('LIFE');
  });

  test('getRiskFactor debe aumentar para asegurado fumador', () => {
    const noSmoker = new LifePolicy({ ...baseData, insuredAge: 35, smoker: false, preExistingConditions: false, coverageAmount: 50000 });
    const smoker = new LifePolicy({ ...baseData, insuredAge: 35, smoker: true, preExistingConditions: false, coverageAmount: 50000 });
    expect(smoker.getRiskFactor()).toBeGreaterThan(noSmoker.getRiskFactor());
  });

  test('getRiskFactor debe ser mayor para mayor de 60', () => {
    const joven = new LifePolicy({ ...baseData, insuredAge: 30, smoker: false, preExistingConditions: false, coverageAmount: 50000 });
    const mayor = new LifePolicy({ ...baseData, insuredAge: 65, smoker: false, preExistingConditions: false, coverageAmount: 50000 });
    expect(mayor.getRiskFactor()).toBeGreaterThan(joven.getRiskFactor());
  });
});

describe('Insurance Policy Manager - processClaim', () => {
  test('debe aprobar un reclamo valido y registrarlo', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2020, driverAge: 35, hasAccidentHistory: false });
    const result = processClaim(p, { amount: 800, date: '2025-06-01', description: 'Colision' });
    expect(result.approved).toBe(true);
    expect(result.payout).toBe(600);
    expect(p.claims).toHaveLength(1);
  });

  test('debe rechazar un reclamo con monto menor o igual al deducible', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2020, driverAge: 35, hasAccidentHistory: false });
    const result = processClaim(p, { amount: 150, date: '2025-06-01', description: 'Rayado' });
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
  });

  test('debe rechazar un reclamo si la poliza no esta activa', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2020, driverAge: 35, hasAccidentHistory: false });
    const result = processClaim(p, { amount: 1000, date: '2026-06-01', description: 'Robo' });
    expect(result.approved).toBe(false);
    expect(result.payout).toBe(0);
  });
});

describe('Insurance Policy Manager - calculateRenewalPremium', () => {
  test('cliente nuevo sin reclamos debe pagar prima base * riesgo', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: false, basePremium: 1000 });
    const result = calculateRenewalPremium(p, { yearsAsClient: 0, previousClaims: 0, bundledPoliciesCount: 0 });
    expect(result).toBe(1000);
  });

  test('cliente con 5 anios debe tener descuento por fidelidad', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: false, basePremium: 1000 });
    const sin = calculateRenewalPremium(p, { yearsAsClient: 0, previousClaims: 0, bundledPoliciesCount: 0 });
    const con = calculateRenewalPremium(p, { yearsAsClient: 5, previousClaims: 0, bundledPoliciesCount: 0 });
    expect(con).toBeLessThan(sin);
  });

  test('cliente con 2 reclamos previos debe pagar penalizacion', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: false, basePremium: 1000 });
    const sin = calculateRenewalPremium(p, { yearsAsClient: 0, previousClaims: 0, bundledPoliciesCount: 0 });
    const con = calculateRenewalPremium(p, { yearsAsClient: 0, previousClaims: 2, bundledPoliciesCount: 0 });
    expect(con).toBeGreaterThan(sin);
  });

  test('bundle de 3+ polizas debe aplicar descuento adicional', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: false, basePremium: 1000 });
    const sin = calculateRenewalPremium(p, { yearsAsClient: 0, previousClaims: 0, bundledPoliciesCount: 0 });
    const con = calculateRenewalPremium(p, { yearsAsClient: 0, previousClaims: 0, bundledPoliciesCount: 3 });
    expect(con).toBeLessThan(sin);
  });

  test('la prima no puede bajar del 60% de la prima base', () => {
    const p = new AutoPolicy({ ...baseData, vehicleYear: 2022, driverAge: 35, hasAccidentHistory: false, basePremium: 1000 });
    const result = calculateRenewalPremium(p, { yearsAsClient: 10, previousClaims: 0, bundledPoliciesCount: 3 });
    expect(result).toBeGreaterThanOrEqual(600);
  });
});

describe('Insurance Policy Manager - groupPoliciesByType', () => {
  test('debe agrupar polizas por tipo correctamente', () => {
    const auto = new AutoPolicy({ ...baseData, vehicleYear: 2020, driverAge: 30, hasAccidentHistory: false });
    const home = new HomePolicy({ ...baseData, propertyValue: 200000, propertyAgeYears: 10, zone: 'low' });
    const life = new LifePolicy({ ...baseData, insuredAge: 40, smoker: false, preExistingConditions: false, coverageAmount: 100000 });
    const result = groupPoliciesByType([auto, home, life]);
    expect(result).toHaveProperty('AUTO');
    expect(result).toHaveProperty('HOME');
    expect(result).toHaveProperty('LIFE');
    expect(result.AUTO).toHaveLength(1);
  });

  test('debe retornar objeto vacio para array vacio', () => {
    expect(groupPoliciesByType([])).toEqual({});
  });
});

describe('Insurance Policy Manager - getExpiringPolicies', () => {
  test('debe retornar polizas que vencen en los proximos 30 dias', () => {
    const ref = '2025-11-01';
    const pronto = new Policy({ ...baseData, policyNumber: 'P1', endDate: '2025-11-20' });
    const lejos = new Policy({ ...baseData, policyNumber: 'P2', endDate: '2026-06-01' });
    const result = getExpiringPolicies([pronto, lejos], 30, ref);
    expect(result).toHaveLength(1);
    expect(result[0].policyNumber).toBe('P1');
  });

  test('debe retornar array vacio si ninguna poliza vence pronto', () => {
    const ref = '2025-01-01';
    const lejos = new Policy({ ...baseData, endDate: '2026-06-01' });
    expect(getExpiringPolicies([lejos], 30, ref)).toEqual([]);
  });
});

describe('Insurance Policy Manager - getMonthlyPremium', () => {
  test('debe dividir la prima anual entre 12', () => {
    const p = new Policy({ ...baseData, basePremium: 1200 });
    expect(getMonthlyPremium(p)).toBe(100);
  });

  test('debe redondear a 2 decimales', () => {
    const p = new Policy({ ...baseData, basePremium: 1000 });
    expect(getMonthlyPremium(p)).toBeCloseTo(83.33, 2);
  });
});
