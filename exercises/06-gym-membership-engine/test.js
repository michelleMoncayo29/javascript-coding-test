/**
 * Pruebas para: Gym Membership Engine
 *
 * Ejecutar con: npm test exercises/06-gym-membership-engine
 */

const {
  MembershipPlan,
  PremiumPlan,
  VIPPlan,
  Member,
  calculateMonthlyBill,
  getAttendanceStats,
  syncMemberData,
  recommendBestPlan,
} = require('./exercise.js');

describe('Gym Membership Engine - MembershipPlan', () => {
  test('debe crear un plan con las propiedades correctas', () => {
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 29.99, features: ['gym-access'] });
    expect(plan.name).toBe('Basic');
    expect(plan.monthlyPrice).toBe(29.99);
    expect(plan.type).toBe('BASIC');
  });

  test('getAnnualPrice debe retornar monthlyPrice * 12', () => {
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 30 });
    expect(plan.getAnnualPrice()).toBe(360);
  });
});

describe('Gym Membership Engine - PremiumPlan', () => {
  test('type debe ser PREMIUM', () => {
    const plan = new PremiumPlan({ id: 'premium', name: 'Premium', monthlyPrice: 59.99, annualDiscount: 0.10 });
    expect(plan.type).toBe('PREMIUM');
  });

  test('getAnnualPrice debe aplicar el descuento anual', () => {
    const plan = new PremiumPlan({ id: 'premium', name: 'Premium', monthlyPrice: 60, annualDiscount: 0.10 });
    expect(plan.getAnnualPrice()).toBeCloseTo(648, 0);
  });

  test('precio anual de PREMIUM debe ser menor que el de BASIC equivalente', () => {
    const basic = new MembershipPlan({ id: 'b', name: 'B', monthlyPrice: 60 });
    const premium = new PremiumPlan({ id: 'p', name: 'P', monthlyPrice: 60, annualDiscount: 0.10 });
    expect(premium.getAnnualPrice()).toBeLessThan(basic.getAnnualPrice());
  });
});

describe('Gym Membership Engine - VIPPlan', () => {
  test('type debe ser VIP', () => {
    const plan = new VIPPlan({ id: 'vip', name: 'VIP', monthlyPrice: 99.99, annualDiscount: 0.20 });
    expect(plan.type).toBe('VIP');
  });

  test('getAnnualPrice debe aplicar el descuento anual del 20%', () => {
    const plan = new VIPPlan({ id: 'vip', name: 'VIP', monthlyPrice: 100, annualDiscount: 0.20 });
    expect(plan.getAnnualPrice()).toBeCloseTo(960, 0);
  });
});

describe('Gym Membership Engine - Member', () => {
  test('debe crear un miembro con las propiedades correctas', () => {
    const member = new Member({ id: 'm1', name: 'Carlos', email: 'carlos@gym.com', planId: 'basic', startDate: '2024-01-01' });
    expect(member.name).toBe('Carlos');
    expect(member.frozen).toBe(false);
    expect(member.frozenDays).toBe(0);
  });

  test('logAttendance debe registrar sesiones por fecha', () => {
    const member = new Member({ id: 'm1', name: 'Ana', email: 'a@g.com', planId: 'basic', startDate: '2024-01-01' });
    member.logAttendance('2025-01-15', 'yoga');
    member.logAttendance('2025-01-15', 'natacion');
    member.logAttendance('2025-01-16', 'spinning');
    expect(member.attendanceLog.get('2025-01-15')).toHaveLength(2);
  });

  test('getAttendanceCount debe contar dias con asistencia en el rango', () => {
    const member = new Member({ id: 'm1', name: 'Luis', email: 'l@g.com', planId: 'basic', startDate: '2024-01-01' });
    member.logAttendance('2025-01-10', 'gym');
    member.logAttendance('2025-01-15', 'yoga');
    member.logAttendance('2025-02-05', 'gym');
    expect(member.getAttendanceCount('2025-01-01', '2025-01-31')).toBe(2);
  });

  test('freeze debe marcar al miembro como congelado', () => {
    const member = new Member({ id: 'm1', name: 'Test', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    member.freeze(30);
    expect(member.frozen).toBe(true);
    expect(member.frozenDays).toBe(30);
    member.unfreeze();
    expect(member.frozen).toBe(false);
  });

  test('freeze acumulativo debe sumar los dias', () => {
    const member = new Member({ id: 'm1', name: 'Test', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    member.freeze(15);
    member.freeze(10);
    expect(member.frozenDays).toBe(25);
  });
});

describe('Gym Membership Engine - calculateMonthlyBill', () => {
  test('debe retornar el precio del plan para miembro sin descuentos', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01', commitmentType: 'monthly' });
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 30 });
    expect(calculateMonthlyBill(member, plan)).toBe(30);
  });

  test('compromiso anual debe aplicar descuento del 10%', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01', commitmentType: 'annual' });
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 100 });
    expect(calculateMonthlyBill(member, plan)).toBe(90);
  });

  test('descuento corporativo debe reducir el precio', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01', commitmentType: 'monthly' });
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 100 });
    expect(calculateMonthlyBill(member, plan, { corporate: 0.15 })).toBe(85);
  });

  test('miembro congelado debe tener factura de 0', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 100 });
    member.freeze(30);
    expect(calculateMonthlyBill(member, plan)).toBe(0);
  });

  test('descuentos acumulables deben aplicarse en cascada', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01', commitmentType: 'annual' });
    const plan = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 100 });
    // anual: 100 * 0.90 = 90, family: 90 * 0.95 = 85.5
    expect(calculateMonthlyBill(member, plan, { family: 0.05 })).toBeCloseTo(85.5, 1);
  });
});

describe('Gym Membership Engine - getAttendanceStats', () => {
  let member;
  beforeEach(() => {
    member = new Member({ id: 'm1', name: 'Sofia', email: 's@g.com', planId: 'vip', startDate: '2024-01-01' });
    member.logAttendance('2025-01-06', 'yoga');
    member.logAttendance('2025-01-07', 'spinning');
    member.logAttendance('2025-01-08', 'yoga');
    member.logAttendance('2025-01-09', 'yoga');
    member.logAttendance('2025-01-10', 'natacion');
  });

  test('debe contar correctamente los dias activos', () => {
    const stats = getAttendanceStats(member, '2025-01-01', '2025-01-31');
    expect(stats.activeDays).toBe(5);
  });

  test('debe identificar la actividad favorita', () => {
    const stats = getAttendanceStats(member, '2025-01-01', '2025-01-31');
    expect(stats.favoriteActivity).toBe('yoga');
  });

  test('debe calcular la tasa de asistencia correctamente', () => {
    // 5 dias activos de 31 dias = 16.1%
    const stats = getAttendanceStats(member, '2025-01-01', '2025-01-31');
    expect(stats.attendanceRate).toBeCloseTo(16.1, 0);
  });

  test('debe contar el total de sesiones (no solo dias)', () => {
    member.logAttendance('2025-01-06', 'pesas');
    const stats = getAttendanceStats(member, '2025-01-01', '2025-01-31');
    expect(stats.totalSessions).toBe(6);
  });

  test('favoriteActivity debe ser null si no hay sesiones', () => {
    const emptyMember = new Member({ id: 'm2', name: 'Empty', email: 'e@g.com', planId: 'basic', startDate: '2024-01-01' });
    const stats = getAttendanceStats(emptyMember, '2025-01-01', '2025-01-31');
    expect(stats.favoriteActivity).toBeNull();
  });
});

describe('Gym Membership Engine - syncMemberData', () => {
  test('debe retornar datos cuando la respuesta es exitosa', async () => {
    const mockData = { id: 'm1', name: 'Carlos', plan: 'premium' };
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockData });
    const result = await syncMemberData('m1', mockFetch);
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('m1'));
  });

  test('debe lanzar error si la respuesta no es ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(syncMemberData('m99', mockFetch)).rejects.toThrow();
  });
});

describe('Gym Membership Engine - recommendBestPlan', () => {
  let basic, premium, vip;
  beforeEach(() => {
    basic = new MembershipPlan({ id: 'basic', name: 'Basic', monthlyPrice: 30 });
    premium = new PremiumPlan({ id: 'premium', name: 'Premium', monthlyPrice: 60, annualDiscount: 0.10 });
    vip = new VIPPlan({ id: 'vip', name: 'VIP', monthlyPrice: 100, annualDiscount: 0.20 });
  });

  test('debe recomendar VIP para usuario con alta asistencia y presupuesto suficiente', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    const stats = { activeDays: 22, totalSessions: 25, favoriteActivity: 'gym', attendanceRate: 75 };
    const result = recommendBestPlan(member, stats, [basic, premium, vip], 120);
    expect(result.type).toBe('VIP');
  });

  test('debe recomendar PREMIUM para asistencia media con presupuesto suficiente', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    const stats = { activeDays: 12, totalSessions: 14, favoriteActivity: 'yoga', attendanceRate: 50 };
    const result = recommendBestPlan(member, stats, [basic, premium, vip], 70);
    expect(result.type).toBe('PREMIUM');
  });

  test('debe recomendar BASIC si el presupuesto no alcanza para planes superiores', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    const stats = { activeDays: 25, totalSessions: 30, favoriteActivity: 'gym', attendanceRate: 80 };
    const result = recommendBestPlan(member, stats, [basic, premium, vip], 35);
    expect(result.type).toBe('BASIC');
  });

  test('no debe recomendar VIP si asistencia es baja aunque el presupuesto alcance', () => {
    const member = new Member({ id: 'm1', name: 'T', email: 't@g.com', planId: 'basic', startDate: '2024-01-01' });
    const stats = { activeDays: 3, totalSessions: 3, favoriteActivity: 'gym', attendanceRate: 10 };
    const result = recommendBestPlan(member, stats, [basic, premium, vip], 200);
    expect(result.type).not.toBe('VIP');
  });
});
