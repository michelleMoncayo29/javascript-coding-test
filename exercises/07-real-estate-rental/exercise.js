/**
 * Real Estate Rental Platform
 *
 * Modulo para gestionar propiedades en alquiler, contratos, pagos y precios de mercado.
 */

// TODO: Clase para representar una propiedad en alquiler.
// Constructor: { id, address, type, bedrooms, monthlyRent, zone }
class Property {
  constructor({ id, address, type, bedrooms, monthlyRent, zone }) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para representar un inquilino.
// Constructor: { id, name, email, creditScore }
class Tenant {
  constructor({ id, name, email, creditScore }) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para representar un contrato de arrendamiento.
// Constructor: { id, propertyId, tenantId, startDate, endDate, monthlyRent, escalationRate (default 0) }
// Debe convertir startDate y endDate a Date.
// Debe inicializar this.payments como array vacio.
// Metodo isActive(referenceDate): retorna true si referenceDate esta entre startDate y endDate.
// Metodo addPayment(payment): agrega un pago al array this.payments.
class Lease {
  constructor({ id, propertyId, tenantId, startDate, endDate, monthlyRent, escalationRate = 0 }) {
    throw new Error('Not implemented');
  }

  isActive(referenceDate = new Date()) {
    throw new Error('Not implemented');
  }

  addPayment(payment) {
    throw new Error('Not implemented');
  }
}

// TODO: Calcula la renta proporcional para el primer mes si el inquilino se muda a mitad de mes.
// Recibe: lease (Lease), moveInDate (string o Date).
// Formula: (lease.monthlyRent / diasTotalesDelMes) * diasRestantesEnElMes
// Donde diasRestantes = diasTotalesDelMes - diaDelMes + 1 (incluye el dia de mudanza).
// Retorna el resultado redondeado a 2 decimales.
function calculateProratedRent(lease, moveInDate) {
  throw new Error('Not implemented');
}

// TODO: Calcula la multa por pago tardio segun una politica escalonada.
// Recibe: monthlyRent (number), daysLate (number), policy { rate1, rate2, flatFee }.
// Reglas (acumulativas):
//   daysLate >= 1: sumar monthlyRent * rate1
//   daysLate >= 6: sumar monthlyRent * rate2
//   daysLate >= 16: usar flatFee como valor total (reemplaza la suma anterior)
// Tope maximo: la multa nunca puede superar el 15% de monthlyRent.
// Retornar 0 si daysLate <= 0.
function calculateLateFee(monthlyRent, daysLate, policy) {
  throw new Error('Not implemented');
}

// TODO: Aplica un incremento de renta al lease limitado por un maximo contractual.
// Recibe: lease (Lease), cpiRate (porcentaje como decimal, ej: 0.05), maxIncrease (decimal).
// Aplica el menor de cpiRate y maxIncrease.
// Actualiza lease.monthlyRent y retorna el nuevo valor redondeado a 2 decimales.
function applyRentEscalation(lease, cpiRate, maxIncrease) {
  throw new Error('Not implemented');
}

// TODO: Retorna un Map con el historial de pagos del lease agrupados por mes.
// Recibe: lease (Lease), period { startDate, endDate }.
// Clave del Map: 'YYYY-MM' (ej: '2024-03').
// Valor: { paid: boolean, amount: number, daysLate: number, status: 'on_time'|'late' }
// Solo incluir pagos cuya fecha este dentro del periodo.
// status es 'late' si daysLate > 0, 'on_time' en caso contrario.
function getTenantPaymentHistory(lease, period) {
  throw new Error('Not implemented');
}

// TODO: Genera un reporte de vacancia para un array de propiedades.
// Recibe: properties (array de Property), leases (array de Lease), referenceDate.
// Para cada propiedad retorna: { propertyId, vacant: boolean, vacantDays: number, vacancyCost: number }
// Logica:
//   - Si existe un lease activo en referenceDate: vacant=false, vacantDays=0, vacancyCost=0.
//   - Si no hay lease activo: buscar el lease mas reciente vencido para calcular desde cuando esta vacante.
//     vacantDays = dias transcurridos desde que termino el ultimo lease (o desde referenceDate si nunca hubo).
//     vacancyCost = (property.monthlyRent / 30) * vacantDays, redondeado a 2 decimales.
function getVacancyReport(properties, leases, referenceDate = new Date()) {
  throw new Error('Not implemented');
}

// TODO: Hace fetch de propiedades comparables desde una API mock.
// URL: https://api.realestate.mock/comparables/{propertyId}
// Si la respuesta no es ok, lanza un Error.
// Retorna el JSON de la respuesta.
// Recibe fetchFn como segundo parametro (por defecto fetch global) para facilitar el testing.
async function fetchMarketComparables(propertyId, fetchFn = fetch) {
  throw new Error('Not implemented');
}

// TODO: Filtra un array de propiedades por multiples criterios opcionales.
// criteria puede contener: type, minBedrooms, maxBedrooms, minRent, maxRent, zone.
// Retorna solo las propiedades que cumplen TODOS los criterios presentes.
// Si criteria esta vacio o no se pasa, retorna todas las propiedades.
function filterProperties(properties, criteria = {}) {
  throw new Error('Not implemented');
}

// TODO: Sugiere el precio optimo de publicacion para una propiedad.
// Recibe: property (Property), comparables (array de { monthlyRent }),
//         occupancyHistory { occupiedMonths, totalMonths, vacantDays }.
// Logica:
//   1. Calcular la mediana de precios de los comparables.
//   2. Calcular occupancyRate = occupiedMonths / totalMonths.
//   3. Si occupancyRate < 0.50: ajuste de -8%.
//   4. Si occupancyRate >= 0.85: ajuste de +6%.
//   5. Si vacantDays > 45: ajuste adicional de -5%.
//   6. El precio final no puede ser menor al 80% ni mayor al 120% de la mediana.
// Retornar el precio redondeado a 2 decimales.
// Si comparables esta vacio, retornar property.monthlyRent sin cambios.
function optimizeListingPrice(property, comparables, occupancyHistory) {
  throw new Error('Not implemented');
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
