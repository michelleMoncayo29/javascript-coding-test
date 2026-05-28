/**
 * Insurance Policy Manager
 *
 * Module for managing insurance policies, premium calculation, and claim processing.
 */

// IMPLEMENTADO: Clase base con propiedades comunes a todas las polizas.
// Utiliza un getter para exponer el tipo de poliza definido en cada subclase.
class Policy {
  constructor({ policyNumber, holderName, startDate, endDate, basePremium, deductible }) {
    this.policyNumber = policyNumber;
    this.holderName = holderName;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.basePremium = basePremium;
    this.deductible = deductible;
    this.claims = [];
  }

  get type() {
    return 'GENERIC';
  }

  isActive(referenceDate = new Date()) {
    const ref = new Date(referenceDate);
    return ref >= this.startDate && ref <= this.endDate;
  }

  addClaim(claim) {
    this.claims.push({ ...claim, date: new Date(claim.date) });
  }

  getClaimsTotal() {
    return this.claims.reduce((sum, c) => sum + c.amount, 0);
  }
}

// IMPLEMENTADO: AutoPolicy hereda de Policy y agrega factores propios del seguro de auto.
// El riesgo se calcula multiplicando factores independientes entre si.
class AutoPolicy extends Policy {
  constructor(data) {
    super(data);
    this.vehicleYear = data.vehicleYear;
    this.driverAge = data.driverAge;
    this.hasAccidentHistory = data.hasAccidentHistory ?? false;
  }

  get type() {
    return 'AUTO';
  }

  getRiskFactor() {
    let factor = 1.0;
    const vehicleAge = new Date().getFullYear() - this.vehicleYear;
    if (vehicleAge > 10) factor *= 1.3;
    else if (vehicleAge > 5) factor *= 1.15;
    if (this.driverAge < 25 || this.driverAge > 75) factor *= 1.25;
    if (this.hasAccidentHistory) factor *= 1.5;
    return parseFloat(factor.toFixed(4));
  }
}

// IMPLEMENTADO: HomePolicy agrega factores de riesgo relacionados con el inmueble.
class HomePolicy extends Policy {
  constructor(data) {
    super(data);
    this.propertyValue = data.propertyValue;
    this.propertyAgeYears = data.propertyAgeYears;
    this.zone = data.zone; // 'low' | 'medium' | 'high'
  }

  get type() {
    return 'HOME';
  }

  getRiskFactor() {
    let factor = 1.0;
    if (this.propertyAgeYears > 30) factor *= 1.4;
    else if (this.propertyAgeYears > 15) factor *= 1.2;
    const zoneFactors = { low: 1.0, medium: 1.2, high: 1.6 };
    factor *= zoneFactors[this.zone] ?? 1.0;
    return parseFloat(factor.toFixed(4));
  }
}

// IMPLEMENTADO: LifePolicy maneja factores de riesgo basados en edad y condiciones de salud.
class LifePolicy extends Policy {
  constructor(data) {
    super(data);
    this.insuredAge = data.insuredAge;
    this.smoker = data.smoker ?? false;
    this.preExistingConditions = data.preExistingConditions ?? false;
    this.coverageAmount = data.coverageAmount;
  }

  get type() {
    return 'LIFE';
  }

  getRiskFactor() {
    let factor = 1.0;
    if (this.insuredAge >= 60) factor *= 2.0;
    else if (this.insuredAge >= 45) factor *= 1.5;
    else if (this.insuredAge >= 35) factor *= 1.2;
    if (this.smoker) factor *= 1.6;
    if (this.preExistingConditions) factor *= 1.8;
    return parseFloat(factor.toFixed(4));
  }
}

// IMPLEMENTADO: Procesa un reclamo contra una poliza.
// Verifica que la poliza este activa, que el monto supere el deducible y lo registra.
function processClaim(policy, claim) {
  if (!policy.isActive(claim.date)) {
    return { approved: false, reason: 'Poliza inactiva en la fecha del reclamo', payout: 0 };
  }
  if (claim.amount <= policy.deductible) {
    return { approved: false, reason: 'Monto inferior al deducible', payout: 0 };
  }
  const payout = claim.amount - policy.deductible;
  policy.addClaim({ ...claim, payout });
  return { approved: true, payout };
}

// IMPLEMENTADO: Calcula la prima de renovacion aplicando reglas en cascada.
// Orden: prima base * factor de riesgo -> descuento por fidelidad -> penalizacion por reclamos -> descuento bundle.
// La prima nunca puede ser menor al 60% de la prima base.
function calculateRenewalPremium(policy, history) {
  const { yearsAsClient = 0, previousClaims = 0, bundledPoliciesCount = 0 } = history;

  let premium = policy.basePremium * policy.getRiskFactor();

  // Descuento por fidelidad escalonado
  if (yearsAsClient >= 10) premium *= 0.80;
  else if (yearsAsClient >= 5) premium *= 0.88;
  else if (yearsAsClient >= 3) premium *= 0.93;
  else if (yearsAsClient >= 1) premium *= 0.97;

  // Penalizacion por reclamos previos (acumulativa por reclamo)
  if (previousClaims === 1) premium *= 1.10;
  else if (previousClaims === 2) premium *= 1.22;
  else if (previousClaims >= 3) premium *= 1.40;

  // Descuento bundle por tener multiples polizas con la misma aseguradora
  if (bundledPoliciesCount >= 3) premium *= 0.85;
  else if (bundledPoliciesCount === 2) premium *= 0.92;

  // Piso: la prima no puede ser menor al 60% de la prima base
  const floor = policy.basePremium * 0.60;
  premium = Math.max(premium, floor);

  return parseFloat(premium.toFixed(2));
}

// IMPLEMENTADO: Agrupa un array de polizas por tipo.
function groupPoliciesByType(policies) {
  return policies.reduce((groups, policy) => {
    const key = policy.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(policy);
    return groups;
  }, {});
}

// IMPLEMENTADO: Retorna las polizas que vencen dentro de los proximos 'days' dias.
function getExpiringPolicies(policies, days, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const limit = new Date(ref);
  limit.setDate(limit.getDate() + days);
  return policies.filter(p => p.endDate >= ref && p.endDate <= limit);
}

// IMPLEMENTADO: Calcula la prima mensual efectiva (prima anual / 12).
function getMonthlyPremium(policy) {
  return parseFloat((policy.basePremium / 12).toFixed(2));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Policy,
    AutoPolicy,
    HomePolicy,
    LifePolicy,
    processClaim,
    calculateRenewalPremium,
    groupPoliciesByType,
    getExpiringPolicies,
    getMonthlyPremium,
  };
}
