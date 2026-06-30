/**
 * Insurance Policy Manager
 *
 * Modulo para gestionar polizas de seguros, calculo de primas y procesamiento de reclamos.
 */

// TODO: Clase base para todas las polizas.
// Debe aceptar un objeto con: policyNumber, holderName, startDate, endDate, basePremium, deductible.
// Debe tener: getter 'type' que retorna 'GENERIC', array de claims vacio,
// metodo isActive(referenceDate) que retorna true si la fecha esta dentro del rango de vigencia,
// metodo addClaim(claim) que agrega un reclamo al array,
// metodo getClaimsTotal() que suma todos los montos de los reclamos.
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
    const date = new Date(referenceDate);
    return date >= this.startDate && date <= this.endDate;
  }

  addClaim(claim) {
    this.claims.push({ ...claim, date: new Date(claim.date) });
  }

  getClaimsTotal() {
    return this.claims.reduce((total, claim) => total + claim.amount, 0);
  }
}

// TODO: Subclase para polizas de automovil.
// Propiedades adicionales: vehicleYear, driverAge, hasAccidentHistory.
// Getter 'type' debe retornar 'AUTO'.
// Metodo getRiskFactor(): retorna un numero >= 1.0 que representa el riesgo del asegurado.
// Factores a considerar: antiguedad del vehiculo, edad del conductor, historial de accidentes.
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
        // El riesgo se calcula multiplicando factores independientes entre si.
        let factor = 1.0;
        // antiguedad del carro: si es mayor a 10 años, factor 1.3; si es mayor a 5 años, factor 1.15; sino 1.0
        const vehicleAge = new Date().getFullYear() - this.vehicleYear;
        if (vehicleAge > 10) factor *= 1.3;
        else if (vehicleAge > 5) factor *= 1.15;
        // edad del conductor: si es menor a 25 o mayor a 75, factor 1.25; sino 1.0
        if (this.driverAge < 25 || this.driverAge > 75) factor *= 1.25;
        if (this.hasAccidentHistory) factor *= 1.5;

        return parseFloat(factor.toFixed(4));
    }
}

// TODO: Subclase para polizas de hogar.
// Propiedades adicionales: propertyValue, propertyAgeYears, zone ('low' | 'medium' | 'high').
// Getter 'type' debe retornar 'HOME'.
// Metodo getRiskFactor(): considera antiguedad del inmueble y zona de riesgo.
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

// TODO: Subclase para polizas de vida.
// Propiedades adicionales: insuredAge, smoker (boolean), preExistingConditions (boolean), coverageAmount.
// Getter 'type' debe retornar 'LIFE'.
// Metodo getRiskFactor(): considera edad del asegurado, si es fumador y condiciones preexistentes.
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
        if (this.insuredAge < 30) factor *= 1.1;
        else if (this.insuredAge > 65) factor *= 1.4;
        if (this.smoker) factor *= 1.3;
        if (this.preExistingConditions) factor *= 1.6;
        return parseFloat(factor.toFixed(4));
    }
}

// TODO: Procesa un reclamo contra una poliza.
// Recibe: policy (instancia de Policy o subclase), claim { amount, date, description }.
// Retorna: { approved: boolean, payout: number, reason?: string }
// Reglas:
//   - Si la poliza no esta activa en la fecha del reclamo: rechazar.
//   - Si el monto es menor o igual al deducible: rechazar.
//   - Si se aprueba: payout = amount - deductible, registrar el reclamo en la poliza.
function processClaim(policy, claim) {
  throw new Error('Not implemented');
}

// TODO: Calcula la prima de renovacion de una poliza aplicando reglas en cascada.
// Recibe: policy (debe tener getRiskFactor()), history { yearsAsClient, previousClaims, bundledPoliciesCount }.
// Orden de aplicacion:
//   1. prima base * getRiskFactor()
//   2. Descuento por fidelidad segun anios como cliente
//   3. Penalizacion segun numero de reclamos previos
//   4. Descuento adicional si tiene 2+ polizas en bundle
//   5. La prima final nunca puede ser menor al 60% de la prima base
// Retorna el valor redondeado a 2 decimales.
function calculateRenewalPremium(policy, history) {
  throw new Error('Not implemented');
}

// TODO: Agrupa un array de polizas en un objeto por su propiedad 'type'.
// Retorna: { AUTO: [...], HOME: [...], LIFE: [...] } (solo incluye tipos presentes).
function groupPoliciesByType(policies) {
  throw new Error('Not implemented');
}

// TODO: Retorna las polizas del array que vencen dentro de los proximos 'days' dias
// a partir de 'referenceDate' (Date o string, por defecto new Date()).
// Solo incluye polizas cuyo endDate este entre referenceDate y referenceDate + days.
function getExpiringPolicies(policies, days, referenceDate = new Date()) {
  throw new Error('Not implemented');
}

// TODO: Retorna la prima mensual de una poliza (prima anual / 12), redondeada a 2 decimales.
function getMonthlyPremium(policy) {
  throw new Error('Not implemented');
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
