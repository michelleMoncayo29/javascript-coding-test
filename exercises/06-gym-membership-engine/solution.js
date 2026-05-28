/**
 * Gym Membership Engine
 *
 * Module for managing gym memberships, attendance, billing, and plan recommendations.
 */

// IMPLEMENTADO: Clase base para planes de membresia.
class MembershipPlan {
  constructor({ id, name, monthlyPrice, features = [] }) {
    this.id = id;
    this.name = name;
    this.monthlyPrice = monthlyPrice;
    this.features = features;
  }

  get type() {
    return 'BASIC';
  }

  getAnnualPrice() {
    return parseFloat((this.monthlyPrice * 12).toFixed(2));
  }
}

// IMPLEMENTADO: Plan premium con descuento anual.
class PremiumPlan extends MembershipPlan {
  constructor(data) {
    super(data);
    this.annualDiscount = data.annualDiscount ?? 0.10;
  }

  get type() {
    return 'PREMIUM';
  }

  getAnnualPrice() {
    return parseFloat((this.monthlyPrice * 12 * (1 - this.annualDiscount)).toFixed(2));
  }
}

// IMPLEMENTADO: Plan VIP con descuento anual mayor y acceso ilimitado.
class VIPPlan extends MembershipPlan {
  constructor(data) {
    super(data);
    this.annualDiscount = data.annualDiscount ?? 0.20;
  }

  get type() {
    return 'VIP';
  }

  getAnnualPrice() {
    return parseFloat((this.monthlyPrice * 12 * (1 - this.annualDiscount)).toFixed(2));
  }
}

// IMPLEMENTADO: Clase para gestionar un miembro del gimnasio.
class Member {
  constructor({ id, name, email, planId, startDate, commitmentType = 'monthly' }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.planId = planId;
    this.startDate = new Date(startDate);
    this.commitmentType = commitmentType; // 'monthly' | 'annual'
    this.attendanceLog = new Map(); // fecha YYYY-MM-DD -> array de actividades
    this.frozen = false;
    this.frozenDays = 0;
  }

  logAttendance(date, activity) {
    const key = new Date(date).toISOString().split('T')[0];
    if (!this.attendanceLog.has(key)) this.attendanceLog.set(key, []);
    this.attendanceLog.get(key).push(activity);
  }

  getAttendanceCount(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    for (const [dateKey] of this.attendanceLog) {
      const d = new Date(dateKey);
      if (d >= start && d <= end) count++;
    }
    return count;
  }

  freeze(days) {
    this.frozen = true;
    this.frozenDays += days;
  }

  unfreeze() {
    this.frozen = false;
  }
}

// IMPLEMENTADO: Calcula el importe mensual de un miembro considerando tipo de compromiso y descuentos.
// Descuentos acumulables: anual (-10% base) + corporativo + familiar.
function calculateMonthlyBill(member, plan, discounts = {}) {
  if (member.frozen) return 0;

  let price = plan.monthlyPrice;

  if (member.commitmentType === 'annual') price *= 0.90;
  if (discounts.corporate) price *= (1 - (discounts.corporate ?? 0));
  if (discounts.family) price *= (1 - (discounts.family ?? 0));

  return parseFloat(price.toFixed(2));
}

// IMPLEMENTADO: Retorna estadisticas de asistencia del miembro en un periodo.
function getAttendanceStats(member, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const activityCount = new Map();
  let totalSessions = 0;
  let activeDays = 0;

  for (const [dateKey, activities] of member.attendanceLog) {
    const d = new Date(dateKey);
    if (d >= start && d <= end) {
      activeDays++;
      totalSessions += activities.length;
      for (const activity of activities) {
        activityCount.set(activity, (activityCount.get(activity) ?? 0) + 1);
      }
    }
  }

  const favoriteActivity = activityCount.size > 0
    ? [...activityCount.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : null;

  const periodDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return {
    activeDays,
    totalSessions,
    favoriteActivity,
    attendanceRate: parseFloat(((activeDays / periodDays) * 100).toFixed(1)),
  };
}

// IMPLEMENTADO: Obtiene datos actualizados de un miembro desde una API mock.
async function syncMemberData(memberId, fetchFn = fetch) {
  const response = await fetchFn(`https://api.gym.mock/members/${memberId}`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

// IMPLEMENTADO: Recomienda el mejor plan para un miembro basado en su uso y presupuesto.
// Logica:
//   - Si attendanceRate >= 70% y presupuesto >= VIP mensual -> recomendar VIP
//   - Si attendanceRate >= 40% y presupuesto >= PREMIUM mensual -> recomendar PREMIUM
//   - En otro caso -> recomendar BASIC
//   - Si el miembro tiene compromiso anual, usar precio anual/12 para comparar con presupuesto.
// Tambien considera las actividades favoritas: si hay actividades de grupo, preferir PREMIUM o VIP.
function recommendBestPlan(member, attendanceStats, availablePlans, budget) {
  const sortedPlans = [...availablePlans].sort((a, b) => b.monthlyPrice - a.monthlyPrice);

  const effectivePrice = (plan) => {
    if (member.commitmentType === 'annual') {
      return parseFloat((plan.getAnnualPrice() / 12).toFixed(2));
    }
    return plan.monthlyPrice;
  };

  const hasGroupActivities = attendanceStats.favoriteActivity &&
    ['yoga', 'spinning', 'zumba', 'pilates', 'crossfit'].includes(
      attendanceStats.favoriteActivity.toLowerCase()
    );

  for (const plan of sortedPlans) {
    if (effectivePrice(plan) > budget) continue;

    if (plan.type === 'VIP' && attendanceStats.attendanceRate >= 70) return plan;
    if (plan.type === 'PREMIUM' && attendanceStats.attendanceRate >= 40) return plan;
    if (plan.type === 'PREMIUM' && hasGroupActivities) return plan;
    if (plan.type === 'BASIC') return plan;
  }

  return sortedPlans[sortedPlans.length - 1];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MembershipPlan,
    PremiumPlan,
    VIPPlan,
    Member,
    calculateMonthlyBill,
    getAttendanceStats,
    syncMemberData,
    recommendBestPlan,
  };
}
