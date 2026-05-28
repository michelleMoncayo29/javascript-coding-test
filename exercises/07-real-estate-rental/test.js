/**
 * Pruebas para: Real Estate Rental Platform
 *
 * Ejecutar con: npm test exercises/07-real-estate-rental
 */

const {
  Property,
  Tenant,
  Lease,
  calculateProratedRent,
  calculateLateFee,
  applyRentEscalation,
  getTenantPaymentHistory,
  getVacancyReport,
  fetchMarketComparables,
  filterProperties,
  optimizeListingPrice,
} = require('./exercise.js');

// --- Datos reutilizables ---
const propData = { id: 'p1', address: 'Calle 1', type: 'apartment', bedrooms: 2, monthlyRent: 1200, zone: 'centro' };
const leaseData = { id: 'l1', propertyId: 'p1', tenantId: 't1', startDate: '2024-01-01', endDate: '2025-12-31', monthlyRent: 1200 };

describe('Real Estate Rental - Property', () => {
  test('debe crear una propiedad con las propiedades correctas', () => {
    const p = new Property(propData);
    expect(p.id).toBe('p1');
    expect(p.type).toBe('apartment');
    expect(p.monthlyRent).toBe(1200);
  });
});

describe('Real Estate Rental - Tenant', () => {
  test('debe crear un inquilino con creditScore', () => {
    const t = new Tenant({ id: 't1', name: 'Ana Garcia', email: 'ana@mail.com', creditScore: 720 });
    expect(t.name).toBe('Ana Garcia');
    expect(t.creditScore).toBe(720);
  });
});

describe('Real Estate Rental - Lease', () => {
  test('debe crear un contrato y addPayment debe registrar pagos', () => {
    const l = new Lease(leaseData);
    l.addPayment({ amount: 1200, date: '2024-02-01', daysLate: 0 });
    expect(l.payments).toHaveLength(1);
    expect(l.payments[0].amount).toBe(1200);
  });

  test('isActive debe retornar true para fecha dentro del rango', () => {
    const l = new Lease(leaseData);
    expect(l.isActive('2025-06-15')).toBe(true);
  });

  test('isActive debe retornar false para fecha fuera del rango', () => {
    const l = new Lease(leaseData);
    expect(l.isActive('2026-01-01')).toBe(false);
  });
});

describe('Real Estate Rental - calculateProratedRent', () => {
  test('mudanza el dia 1 debe dar renta completa', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 1200 });
    expect(calculateProratedRent(l, '2024-03-01')).toBe(1200);
  });

  test('mudanza a mitad de mes de 30 dias debe dar aprox la mitad', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 1200 });
    // Junio: 30 dias, dia 16 -> 15 dias restantes -> 1200/30*15 = 600
    expect(calculateProratedRent(l, '2024-06-16')).toBeCloseTo(600, 1);
  });

  test('mudanza el ultimo dia del mes debe dar 1 dia de renta', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 3100 });
    // Enero: 31 dias, dia 31 -> 1 dia -> 3100/31 = 100
    expect(calculateProratedRent(l, '2024-01-31')).toBeCloseTo(100, 0);
  });

  test('debe manejar correctamente meses de 28 dias (febrero no bisiesto)', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 1400 });
    // Feb 2025: 28 dias, dia 15 -> 14 dias -> 1400/28*14 = 700
    expect(calculateProratedRent(l, '2025-02-15')).toBeCloseTo(700, 1);
  });
});

describe('Real Estate Rental - calculateLateFee', () => {
  const policy = { rate1: 0.03, rate2: 0.05, flatFee: 200 };

  test('sin retraso debe retornar 0', () => {
    expect(calculateLateFee(1200, 0, policy)).toBe(0);
  });

  test('3 dias de retraso aplica solo rate1', () => {
    // 1200 * 0.03 = 36
    expect(calculateLateFee(1200, 3, policy)).toBeCloseTo(36, 1);
  });

  test('10 dias de retraso aplica rate1 + rate2', () => {
    // 1200 * 0.03 + 1200 * 0.05 = 36 + 60 = 96
    expect(calculateLateFee(1200, 10, policy)).toBeCloseTo(96, 1);
  });

  test('mas de 15 dias aplica el flatFee', () => {
    expect(calculateLateFee(1200, 20, policy)).toBe(200);
  });

  test('la multa nunca debe superar el 15% de la renta mensual', () => {
    // Con renta de 1000 y flatFee=200, tope es 150
    expect(calculateLateFee(1000, 20, { ...policy, flatFee: 250 })).toBeCloseTo(150, 1);
  });
});

describe('Real Estate Rental - applyRentEscalation', () => {
  test('debe incrementar la renta con el CPI si es menor al maximo', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 1000 });
    const newRent = applyRentEscalation(l, 0.04, 0.05);
    expect(newRent).toBeCloseTo(1040, 1);
    expect(l.monthlyRent).toBeCloseTo(1040, 1);
  });

  test('no debe superar el maximo de incremento aunque el CPI sea mayor', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 1000 });
    const newRent = applyRentEscalation(l, 0.10, 0.03);
    expect(newRent).toBeCloseTo(1030, 1);
  });

  test('debe actualizar la propiedad monthlyRent del lease', () => {
    const l = new Lease({ ...leaseData, monthlyRent: 2000 });
    applyRentEscalation(l, 0.05, 0.08);
    expect(l.monthlyRent).toBeCloseTo(2100, 0);
  });
});

describe('Real Estate Rental - getTenantPaymentHistory', () => {
  test('debe agrupar pagos por mes en un Map', () => {
    const l = new Lease(leaseData);
    l.addPayment({ amount: 1200, date: '2024-03-05', daysLate: 4 });
    l.addPayment({ amount: 1200, date: '2024-04-01', daysLate: 0 });
    const history = getTenantPaymentHistory(l, { startDate: '2024-01-01', endDate: '2024-12-31' });
    expect(history instanceof Map).toBe(true);
    expect(history.has('2024-03')).toBe(true);
    expect(history.has('2024-04')).toBe(true);
  });

  test('pagos con daysLate > 0 deben tener status late', () => {
    const l = new Lease(leaseData);
    l.addPayment({ amount: 1200, date: '2024-03-08', daysLate: 7 });
    const history = getTenantPaymentHistory(l, { startDate: '2024-01-01', endDate: '2024-12-31' });
    expect(history.get('2024-03').status).toBe('late');
  });

  test('pagos a tiempo deben tener status on_time', () => {
    const l = new Lease(leaseData);
    l.addPayment({ amount: 1200, date: '2024-05-01', daysLate: 0 });
    const history = getTenantPaymentHistory(l, { startDate: '2024-01-01', endDate: '2024-12-31' });
    expect(history.get('2024-05').status).toBe('on_time');
  });

  test('no debe incluir pagos fuera del periodo', () => {
    const l = new Lease(leaseData);
    l.addPayment({ amount: 1200, date: '2023-12-01', daysLate: 0 });
    const history = getTenantPaymentHistory(l, { startDate: '2024-01-01', endDate: '2024-12-31' });
    expect(history.has('2023-12')).toBe(false);
  });
});

describe('Real Estate Rental - getVacancyReport', () => {
  test('propiedad con lease activo debe aparecer como no vacante', () => {
    const props = [new Property(propData)];
    const leases = [new Lease({ ...leaseData, startDate: '2024-01-01', endDate: '2025-12-31' })];
    const report = getVacancyReport(props, leases, '2025-06-01');
    expect(report[0].vacant).toBe(false);
    expect(report[0].vacantDays).toBe(0);
  });

  test('propiedad sin lease activo debe aparecer como vacante', () => {
    const props = [new Property(propData)];
    const leases = [new Lease({ ...leaseData, startDate: '2024-01-01', endDate: '2024-06-30' })];
    const report = getVacancyReport(props, leases, '2024-08-30');
    expect(report[0].vacant).toBe(true);
    expect(report[0].vacantDays).toBeGreaterThan(0);
  });

  test('el costo de vacancia debe ser positivo para propiedad vacante', () => {
    const props = [new Property(propData)];
    const leases = [new Lease({ ...leaseData, startDate: '2024-01-01', endDate: '2024-06-30' })];
    const report = getVacancyReport(props, leases, '2024-08-30');
    expect(report[0].vacancyCost).toBeGreaterThan(0);
  });
});

describe('Real Estate Rental - fetchMarketComparables', () => {
  test('debe retornar los datos de la API correctamente', async () => {
    const mockData = [{ id: 'p2', monthlyRent: 1100 }, { id: 'p3', monthlyRent: 1300 }];
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockData });
    const result = await fetchMarketComparables('p1', mockFetch);
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('p1'));
  });

  test('debe lanzar error si la respuesta no es ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchMarketComparables('p99', mockFetch)).rejects.toThrow();
  });
});

describe('Real Estate Rental - filterProperties', () => {
  let properties;
  beforeEach(() => {
    properties = [
      new Property({ id: 'p1', address: 'A', type: 'apartment', bedrooms: 2, monthlyRent: 1200, zone: 'centro' }),
      new Property({ id: 'p2', address: 'B', type: 'house', bedrooms: 4, monthlyRent: 2500, zone: 'norte' }),
      new Property({ id: 'p3', address: 'C', type: 'apartment', bedrooms: 1, monthlyRent: 800, zone: 'centro' }),
      new Property({ id: 'p4', address: 'D', type: 'house', bedrooms: 3, monthlyRent: 1800, zone: 'sur' }),
    ];
  });

  test('debe filtrar por tipo', () => {
    expect(filterProperties(properties, { type: 'apartment' })).toHaveLength(2);
  });

  test('debe filtrar por rango de precio', () => {
    const result = filterProperties(properties, { minRent: 1000, maxRent: 2000 });
    expect(result.every(p => p.monthlyRent >= 1000 && p.monthlyRent <= 2000)).toBe(true);
  });

  test('debe filtrar por zona', () => {
    expect(filterProperties(properties, { zone: 'centro' })).toHaveLength(2);
  });

  test('debe combinar multiples criterios correctamente', () => {
    const result = filterProperties(properties, { type: 'apartment', minBedrooms: 2, zone: 'centro' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  test('debe retornar todas las propiedades si no hay criterios', () => {
    expect(filterProperties(properties, {})).toHaveLength(4);
  });
});

describe('Real Estate Rental - optimizeListingPrice', () => {
  let property;
  const comparables = [
    { monthlyRent: 1100 },
    { monthlyRent: 1200 },
    { monthlyRent: 1300 },
    { monthlyRent: 1400 },
    { monthlyRent: 1100 },
  ];
  beforeEach(() => {
    property = new Property({ ...propData, monthlyRent: 1200 });
  });

  test('con alta ocupacion (>=85%) debe sugerir precio por encima de la mediana', () => {
    const history = { occupiedMonths: 11, totalMonths: 12, vacantDays: 5 };
    const price = optimizeListingPrice(property, comparables, history);
    expect(price).toBeGreaterThan(1200);
  });

  test('con baja ocupacion debe sugerir precio por debajo de la mediana', () => {
    const history = { occupiedMonths: 3, totalMonths: 12, vacantDays: 10 };
    const price = optimizeListingPrice(property, comparables, history);
    expect(price).toBeLessThan(1200);
  });

  test('con muchos dias vacante debe bajar mas el precio', () => {
    const historyPocosVacios = { occupiedMonths: 5, totalMonths: 12, vacantDays: 10 };
    const historyMuchosVacios = { occupiedMonths: 5, totalMonths: 12, vacantDays: 60 };
    const price1 = optimizeListingPrice(property, comparables, historyPocosVacios);
    const price2 = optimizeListingPrice(property, comparables, historyMuchosVacios);
    expect(price2).toBeLessThan(price1);
  });

  test('el precio nunca debe exceder el 120% de la mediana', () => {
    const history = { occupiedMonths: 12, totalMonths: 12, vacantDays: 0 };
    const price = optimizeListingPrice(property, comparables, history);
    // Mediana de [1100,1100,1200,1300,1400] = 1200
    expect(price).toBeLessThanOrEqual(1200 * 1.20);
  });

  test('el precio nunca debe bajar del 80% de la mediana', () => {
    const history = { occupiedMonths: 0, totalMonths: 12, vacantDays: 120 };
    const price = optimizeListingPrice(property, comparables, history);
    expect(price).toBeGreaterThanOrEqual(1200 * 0.80);
  });
});
