/**
 * Gym Membership Engine
 *
 * Modulo integrador para gestionar membresias de gimnasio, asistencia, facturacion y recomendaciones.
 */

// TODO: Clase base para planes de membresia.
// Constructor: { id, name, monthlyPrice, features (array, default []) }
// Getter 'type': retorna 'BASIC'.
// Metodo getAnnualPrice(): retorna monthlyPrice * 12, redondeado a 2 decimales.
class MembershipPlan {
  constructor({ id, name, monthlyPrice, features = [] }) {
    throw new Error('Not implemented');
  }

  get type() {
    throw new Error('Not implemented');
  }

  getAnnualPrice() {
    throw new Error('Not implemented');
  }
}

// TODO: Plan premium. Extiende MembershipPlan.
// Constructor adicional: annualDiscount (default 0.10).
// Getter 'type': retorna 'PREMIUM'.
// getAnnualPrice(): aplica el descuento anual -> monthlyPrice * 12 * (1 - annualDiscount).
class PremiumPlan extends MembershipPlan {
  constructor(data) {
    throw new Error('Not implemented');
  }

  get type() {
    throw new Error('Not implemented');
  }

  getAnnualPrice() {
    throw new Error('Not implemented');
  }
}

// TODO: Plan VIP. Extiende MembershipPlan.
// Constructor adicional: annualDiscount (default 0.20).
// Getter 'type': retorna 'VIP'.
// getAnnualPrice(): aplica el descuento anual -> monthlyPrice * 12 * (1 - annualDiscount).
class VIPPlan extends MembershipPlan {
  constructor(data) {
    throw new Error('Not implemented');
  }

  get type() {
    throw new Error('Not implemented');
  }

  getAnnualPrice() {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para gestionar un miembro del gimnasio.
// Constructor: { id, name, email, planId, startDate, commitmentType ('monthly'|'annual', default 'monthly') }
// Propiedades: frozen (boolean, default false), frozenDays (number, default 0).
// attendanceLog: Map<fechaISO, Array<actividad>> para registrar asistencia.
//
// Metodo logAttendance(date, activity): agrega la actividad al array del dia indicado.
// Metodo getAttendanceCount(startDate, endDate): retorna el numero de DIAS con asistencia en el rango.
// Metodo freeze(days): marca frozen=true y acumula en frozenDays.
// Metodo unfreeze(): marca frozen=false.
class Member {
  constructor({ id, name, email, planId, startDate, commitmentType = 'monthly' }) {
    throw new Error('Not implemented');
  }

  logAttendance(date, activity) {
    throw new Error('Not implemented');
  }

  getAttendanceCount(startDate, endDate) {
    throw new Error('Not implemented');
  }

  freeze(days) {
    throw new Error('Not implemented');
  }

  unfreeze() {
    throw new Error('Not implemented');
  }
}

// TODO: Calcula el importe mensual de un miembro.
// Recibe: member (instancia Member), plan (instancia MembershipPlan o subclase), discounts (objeto opcional).
// Reglas (aplicar en este orden):
//   1. Si member.frozen === true: retornar 0.
//   2. Si member.commitmentType === 'annual': aplicar -10% sobre el precio del plan.
//   3. Si discounts.corporate tiene un valor: restar ese porcentaje del precio actual.
//   4. Si discounts.family tiene un valor: restar ese porcentaje del precio actual.
// Retornar el resultado redondeado a 2 decimales.
function calculateMonthlyBill(member, plan, discounts = {}) {
  throw new Error('Not implemented');
}

// TODO: Calcula estadisticas de asistencia de un miembro en un rango de fechas.
// Recibe: member (Member), startDate, endDate (string o Date).
// Retorna:
//   activeDays: numero de dias distintos con asistencia en el rango.
//   totalSessions: numero total de actividades (suma de todas las actividades en todos los dias del rango).
//   favoriteActivity: la actividad mas repetida (null si no hay sesiones).
//   attendanceRate: (activeDays / totalDiasEnPeriodo) * 100, redondeado a 1 decimal.
//     El total de dias del periodo incluye startDate y endDate.
function getAttendanceStats(member, startDate, endDate) {
  throw new Error('Not implemented');
}

// TODO: Obtiene datos actualizados del miembro desde una API.
// Recibe: memberId (string), fetchFn (funcion de fetch, por defecto la global).
// Llama a: https://api.gym.mock/members/{memberId}
// Si la respuesta no es ok, lanza un Error con el status HTTP.
// Retorna el JSON de la respuesta.
async function syncMemberData(memberId, fetchFn = fetch) {
  throw new Error('Not implemented');
}

// TODO: Recomienda el mejor plan para un miembro segun su uso y presupuesto.
// Recibe: member (Member), attendanceStats (objeto con attendanceRate y favoriteActivity),
//         availablePlans (array de planes), budget (precio mensual maximo).
// Logica (evaluar planes de mayor a menor precio):
//   - Saltar planes cuyo precio efectivo supere el presupuesto.
//   - Precio efectivo: si commitmentType === 'annual' usar getAnnualPrice()/12, sino monthlyPrice.
//   - Recomendar VIP si attendanceRate >= 70.
//   - Recomendar PREMIUM si attendanceRate >= 40 O si la actividad favorita es de grupo
//     (yoga, spinning, zumba, pilates, crossfit).
//   - Recomendar BASIC en cualquier otro caso que entre en presupuesto.
// Si ningun plan cabe en el presupuesto, retornar el mas barato disponible.
function recommendBestPlan(member, attendanceStats, availablePlans, budget) {
  throw new Error('Not implemented');
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
