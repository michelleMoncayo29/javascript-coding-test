/**
 * Event Ticketing Platform
 *
 * Modulo para gestionar eventos, reservas de asientos, precios dinamicos y ordenes de compra.
 */

// TODO: Clase que representa un venue (recinto).
// Constructor: { id, name, totalSeats }
// Debe inicializar this.allSeats como un Set con IDs 'S1', 'S2', ..., 'S{totalSeats}'.
class Venue {
  constructor({ id, name, totalSeats }) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase que representa un tier de precio (ej: General, VIP).
// Constructor: { name, basePrice, capacity }
// Debe inicializar this.sold = 0.
// Metodo getSoldPercentage(): retorna sold / capacity (0 si capacity es 0).
class TicketTier {
  constructor({ name, basePrice, capacity }) {
    throw new Error('Not implemented');
  }

  getSoldPercentage() {
    throw new Error('Not implemented');
  }
}

// TODO: Clase que representa un evento.
// Constructor: { id, name, venue, date, tiers (array de TicketTier, default []) }
// Debe inicializar:
//   this.soldSeats: Set<seatId> de asientos vendidos.
//   this.reservations: Map<seatId, { buyerId, expiresAt }> de reservas temporales.
// Metodo getAvailableSeats(): retorna un array de IDs de asientos que NO estan en soldSeats ni en reservations.
class Event {
  constructor({ id, name, venue, date, tiers = [] }) {
    throw new Error('Not implemented');
  }

  getAvailableSeats() {
    throw new Error('Not implemented');
  }
}

// TODO: Clase que representa una orden de compra.
// Constructor: { id, buyerId, eventId, tierName, seatIds }
// Debe inicializar: this.status = 'pending', this.totalPrice = 0.
class PurchaseOrder {
  constructor({ id, buyerId, eventId, tierName, seatIds }) {
    throw new Error('Not implemented');
  }
}

// TODO: Verifica si todos los seatIds estan disponibles.
// Un asiento NO esta disponible si: esta en event.soldSeats, en event.reservations, o no existe en venue.allSeats.
// Retorna true si TODOS estan disponibles, false si alguno no lo esta.
function checkSeatAvailability(event, seatIds) {
  throw new Error('Not implemented');
}

// TODO: Calcula el precio dinamico de un tier segun el porcentaje vendido.
// Surge pricing escalonado:
//   soldPercentage >= 0.95: precio base * 1.50
//   soldPercentage >= 0.85: precio base * 1.30
//   soldPercentage >= 0.70: precio base * 1.15
//   menos del 70%: precio base
// Retorna el precio redondeado a 2 decimales.
function calculateDynamicPrice(tier, soldPercentage) {
  throw new Error('Not implemented');
}

// TODO: Reserva asientos temporalmente para un comprador.
// Recibe: event, seatIds (array), buyerId (string), holdMinutes (default 15).
// Si algun asiento no esta disponible (checkSeatAvailability), lanzar Error.
// Agregar cada seatId a event.reservations con { buyerId, expiresAt: ahora + holdMinutes * 60000 }.
// Retornar: { reserved: seatIds, expiresAt: Date }
function reserveSeats(event, seatIds, buyerId, holdMinutes = 15) {
  throw new Error('Not implemented');
}

// TODO: Libera las reservas cuyo expiresAt <= referenceTime.
// Elimina las entradas de event.reservations que hayan vencido.
// Retorna un array con los seatIds liberados.
function releaseExpiredReservations(event, referenceTime = new Date()) {
  throw new Error('Not implemented');
}

// TODO: Completa una orden de compra.
// Recibe: order (PurchaseOrder), event (Event).
// Logica:
//   1. Buscar el tier en event.tiers por order.tierName. Si no existe, lanzar Error.
//   2. Para cada seatId en order.seatIds: eliminar de event.reservations y agregar a event.soldSeats.
//   3. Calcular el precio con calculateDynamicPrice usando el % vendido ANTES de esta venta.
//   4. order.totalPrice = precio * cantidad de asientos (redondeado a 2 decimales).
//   5. order.status = 'confirmed'.
//   6. Incrementar tier.sold en la cantidad de asientos vendidos.
// Retornar la order actualizada.
function completeOrder(order, event) {
  throw new Error('Not implemented');
}

// TODO: Cancela una orden confirmada y procesa el reembolso.
// Recibe: order, event, eventDate (string o Date), cancellationPolicy { fullRefundDays, partialRefundDays, partialRefundRate }.
// Si order.status !== 'confirmed': lanzar Error.
// Politica de reembolso (defaults: fullRefundDays=7, partialRefundDays=3, partialRefundRate=0.5):
//   daysUntilEvent > fullRefundDays: reembolso 100%
//   daysUntilEvent >= partialRefundDays: reembolso parcial (totalPrice * partialRefundRate)
//   daysUntilEvent < partialRefundDays: sin reembolso
// Devolver los seatIds al pool (eliminar de event.soldSeats) y decrementar tier.sold.
// order.status = 'cancelled'.
// Retornar: { orderId, refundAmount }
function cancelOrder(order, event, eventDate, cancellationPolicy = {}) {
  throw new Error('Not implemented');
}

// TODO: Hace fetch de eventos filtrados por categoria y rango de fechas.
// URL: https://api.ticketing.mock/events?category={cat}&from={from}&to={to}
// Usa URLSearchParams para construir los parametros.
// Si la respuesta no es ok, lanzar Error.
// Retorna el JSON.
// Recibe fetchFn como tercer parametro (por defecto fetch global).
async function fetchEventsByCategory(category, dateRange, fetchFn = fetch) {
  throw new Error('Not implemented');
}

// TODO: Genera un reporte de ocupacion para un array de eventos.
// Para cada evento retorna:
//   { eventId, eventName, totalSold, totalCapacity, overallOccupancy (%), tiers: [{name, sold, capacity, occupancyRate}] }
// overallOccupancy y occupancyRate son porcentajes con 1 decimal (ej: 75.0).
function getOccupancyReport(events) {
  throw new Error('Not implemented');
}

// TODO: Encuentra el mejor bloque contiguo de asientos para un grupo.
// Recibe: event, groupSize (numero de asientos), preference ('front'|'back'|'center'), seatsPerRow (default 10).
// Logica:
//   1. Obtener asientos disponibles y organizarlos por fila (S1-S10 = fila 1, S11-S20 = fila 2, etc.).
//   2. Ordenar filas segun preferencia: 'front'= filas bajas primero, 'back'= filas altas primero,
//      'center'= filas mas cercanas al centro primero.
//   3. Para cada fila, buscar bloques de asientos numericamente consecutivos.
//   4. Si un bloque tiene >= groupSize asientos: retornar { seats: primeros groupSize, row, complete: true }.
//   5. Si ningun bloque tiene el tamaño exacto: retornar el bloque mas grande encontrado con complete: false.
// Retornar: { seats: string[], row: number|null, complete: boolean }
function allocateGroupSeats(event, groupSize, preference = 'front', seatsPerRow = 10) {
  throw new Error('Not implemented');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Venue,
    TicketTier,
    Event,
    PurchaseOrder,
    checkSeatAvailability,
    calculateDynamicPrice,
    reserveSeats,
    releaseExpiredReservations,
    completeOrder,
    cancelOrder,
    fetchEventsByCategory,
    getOccupancyReport,
    allocateGroupSeats,
  };
}
