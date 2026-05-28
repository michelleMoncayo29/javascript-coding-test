/**
 * Real Estate Rental Platform
 *
 * Module for managing rental properties, tenants, leases, payments, and pricing.
 */

// Parses a date string as local time to avoid UTC timezone shifting.
function parseDate(d) {
  if (d instanceof Date) return d;
  const [y, m, day] = String(d).split('-').map(Number);
  return new Date(y, m - 1, day);
}

class Property {
  constructor({ id, address, type, bedrooms, monthlyRent, zone }) {
    this.id = id;
    this.address = address;
    this.type = type;
    this.bedrooms = bedrooms;
    this.monthlyRent = monthlyRent;
    this.zone = zone;
  }
}

class Tenant {
  constructor({ id, name, email, creditScore }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.creditScore = creditScore;
  }
}

class Lease {
  constructor({ id, propertyId, tenantId, startDate, endDate, monthlyRent, escalationRate = 0 }) {
    this.id = id;
    this.propertyId = propertyId;
    this.tenantId = tenantId;
    this.startDate = parseDate(startDate);
    this.endDate = parseDate(endDate);
    this.monthlyRent = monthlyRent;
    this.escalationRate = escalationRate;
    this.payments = [];
  }

  isActive(referenceDate = new Date()) {
    const ref = parseDate(referenceDate);
    return ref >= this.startDate && ref <= this.endDate;
  }

  addPayment(payment) {
    this.payments.push({ ...payment, date: parseDate(payment.date) });
  }
}

// IMPLEMENTADO: Renta proporcional = renta mensual / dias totales del mes * dias restantes desde moveInDate.
function calculateProratedRent(lease, moveInDate) {
  const moveIn = parseDate(moveInDate);
  const year = moveIn.getFullYear();
  const month = moveIn.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfMonth = moveIn.getDate();
  const remainingDays = daysInMonth - dayOfMonth + 1;
  return parseFloat(((lease.monthlyRent / daysInMonth) * remainingDays).toFixed(2));
}

// IMPLEMENTADO: Multa escalonada por dias de retraso.
// dias 1-5: rentaMensual * rate1
// dias 6-15: rentaMensual * rate2 (se acumula sobre rate1)
// dias 16+: monto fijo (policy.flatFee)
// Tope maximo: 15% de la renta mensual.
function calculateLateFee(monthlyRent, daysLate, policy) {
  if (daysLate <= 0) return 0;
  const { rate1 = 0.03, rate2 = 0.05, flatFee = null } = policy;
  let fee = 0;
  if (daysLate >= 1) fee += monthlyRent * rate1;
  if (daysLate >= 6) fee += monthlyRent * rate2;
  if (daysLate >= 16 && flatFee !== null) fee = flatFee;
  const maxFee = monthlyRent * 0.15;
  return parseFloat(Math.min(fee, maxFee).toFixed(2));
}

// IMPLEMENTADO: Incrementa la renta del lease aplicando cpiRate pero sin superar maxIncrease.
// Retorna el nuevo valor de renta.
function applyRentEscalation(lease, cpiRate, maxIncrease) {
  const increase = Math.min(cpiRate, maxIncrease);
  const newRent = lease.monthlyRent * (1 + increase);
  lease.monthlyRent = parseFloat(newRent.toFixed(2));
  return lease.monthlyRent;
}

// IMPLEMENTADO: Agrupa los pagos del lease por mes (YYYY-MM) en un Map.
// Cada entrada: { paid: boolean, amount: number, daysLate: number }
function getTenantPaymentHistory(lease, period) {
  const { startDate, endDate } = period;
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const history = new Map();

  for (const payment of lease.payments) {
    const d = new Date(payment.date);
    if (d < start || d > end) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    history.set(key, {
      paid: true,
      amount: payment.amount,
      daysLate: payment.daysLate ?? 0,
      status: (payment.daysLate ?? 0) > 0 ? 'late' : 'on_time',
    });
  }
  return history;
}

// IMPLEMENTADO: Para cada propiedad calcula si esta vacante y cuantos dias lleva sin arrendatario.
// Una propiedad esta vacante si no tiene ningun lease activo en referenceDate.
function getVacancyReport(properties, leases, referenceDate = new Date()) {
  const ref = parseDate(referenceDate);
  return properties.map(property => {
    const activeLeases = leases.filter(
      l => l.propertyId === property.id && l.isActive(ref)
    );
    if (activeLeases.length > 0) {
      return { propertyId: property.id, vacant: false, vacantDays: 0, vacancyCost: 0 };
    }
    const lastLease = leases
      .filter(l => l.propertyId === property.id && l.endDate <= ref)
      .sort((a, b) => b.endDate - a.endDate)[0];
    const vacantSince = lastLease ? lastLease.endDate : property.listedDate ?? ref;
    const vacantDays = Math.max(0, Math.round((ref - new Date(vacantSince)) / (1000 * 60 * 60 * 24)));
    const vacancyCost = parseFloat(((property.monthlyRent / 30) * vacantDays).toFixed(2));
    return { propertyId: property.id, vacant: true, vacantDays, vacancyCost };
  });
}

// IMPLEMENTADO: Fetch de propiedades comparables desde una API mock.
async function fetchMarketComparables(propertyId, fetchFn = fetch) {
  const res = await fetchFn(`https://api.realestate.mock/comparables/${propertyId}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

// IMPLEMENTADO: Filtra propiedades por criterios multiples (todos opcionales).
// criteria: { type, minBedrooms, maxBedrooms, minRent, maxRent, zone }
function filterProperties(properties, criteria = {}) {
  return properties.filter(p => {
    if (criteria.type !== undefined && p.type !== criteria.type) return false;
    if (criteria.minBedrooms !== undefined && p.bedrooms < criteria.minBedrooms) return false;
    if (criteria.maxBedrooms !== undefined && p.bedrooms > criteria.maxBedrooms) return false;
    if (criteria.minRent !== undefined && p.monthlyRent < criteria.minRent) return false;
    if (criteria.maxRent !== undefined && p.monthlyRent > criteria.maxRent) return false;
    if (criteria.zone !== undefined && p.zone !== criteria.zone) return false;
    return true;
  });
}

// IMPLEMENTADO: Sugiere el precio optimo de publicacion.
// Logica:
//   1. Calcular precio mediano de los comparables.
//   2. Si occupancyRate < 50% (muchos meses vacios): bajar 8%.
//   3. Si occupancyRate >= 85%: subir 6%.
//   4. Si vacantDays > 45: bajar 5% adicional.
//   5. Resultado acotado entre -20% y +20% del precio mediano de comparables.
function optimizeListingPrice(property, comparables, occupancyHistory) {
  if (!comparables || comparables.length === 0) return property.monthlyRent;

  const prices = comparables.map(c => c.monthlyRent).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const median = prices.length % 2 !== 0
    ? prices[mid]
    : (prices[mid - 1] + prices[mid]) / 2;

  const { occupiedMonths = 0, totalMonths = 1, vacantDays = 0 } = occupancyHistory;
  const occupancyRate = occupiedMonths / totalMonths;

  let adjustment = 0;
  if (occupancyRate < 0.50) adjustment -= 0.08;
  else if (occupancyRate >= 0.85) adjustment += 0.06;
  if (vacantDays > 45) adjustment -= 0.05;

  const suggested = median * (1 + adjustment);
  const min = median * 0.80;
  const max = median * 1.20;
  return parseFloat(Math.min(Math.max(suggested, min), max).toFixed(2));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
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
  };
}
