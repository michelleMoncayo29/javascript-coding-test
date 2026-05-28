/**
 * Event Ticketing Platform
 *
 * Module for managing events, seat reservations, dynamic pricing, and order processing.
 */

// IMPLEMENTADO: El venue almacena el mapa de asientos como un Set de IDs.
class Venue {
  constructor({ id, name, totalSeats }) {
    this.id = id;
    this.name = name;
    this.totalSeats = totalSeats;
    this.allSeats = new Set(Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`));
  }
}

// IMPLEMENTADO: Tier de precio con seguimiento de ventas.
class TicketTier {
  constructor({ name, basePrice, capacity }) {
    this.name = name;
    this.basePrice = basePrice;
    this.capacity = capacity;
    this.sold = 0;
  }

  getSoldPercentage() {
    return this.capacity > 0 ? this.sold / this.capacity : 0;
  }
}

// IMPLEMENTADO: Evento con sets de asientos vendidos y reservados.
class Event {
  constructor({ id, name, venue, date, tiers = [] }) {
    this.id = id;
    this.name = name;
    this.venue = venue;
    this.date = new Date(date);
    this.tiers = tiers;
    this.soldSeats = new Set();
    this.reservations = new Map(); // seatId -> { buyerId, expiresAt }
  }

  getAvailableSeats() {
    const unavailable = new Set([...this.soldSeats, ...this.reservations.keys()]);
    return [...this.venue.allSeats].filter(s => !unavailable.has(s));
  }
}

// IMPLEMENTADO: Clase de orden de compra.
class PurchaseOrder {
  constructor({ id, buyerId, eventId, tierName, seatIds }) {
    this.id = id;
    this.buyerId = buyerId;
    this.eventId = eventId;
    this.tierName = tierName;
    this.seatIds = seatIds;
    this.status = 'pending'; // 'pending' | 'confirmed' | 'cancelled'
    this.createdAt = new Date();
    this.totalPrice = 0;
  }
}

// IMPLEMENTADO: Verifica si todos los seatIds estan disponibles (no vendidos ni reservados).
function checkSeatAvailability(event, seatIds) {
  for (const seatId of seatIds) {
    if (event.soldSeats.has(seatId)) return false;
    if (event.reservations.has(seatId)) return false;
    if (!event.venue.allSeats.has(seatId)) return false;
  }
  return true;
}

// IMPLEMENTADO: Precio dinamico con surge pricing escalonado segun % vendido del tier.
function calculateDynamicPrice(tier, soldPercentage) {
  let multiplier = 1.0;
  if (soldPercentage >= 0.95) multiplier = 1.50;
  else if (soldPercentage >= 0.85) multiplier = 1.30;
  else if (soldPercentage >= 0.70) multiplier = 1.15;
  return parseFloat((tier.basePrice * multiplier).toFixed(2));
}

// IMPLEMENTADO: Reserva asientos temporalmente para un comprador.
// Lanza error si alguno de los asientos no esta disponible.
function reserveSeats(event, seatIds, buyerId, holdMinutes = 15) {
  if (!checkSeatAvailability(event, seatIds)) {
    throw new Error('One or more seats are not available');
  }
  const expiresAt = new Date(Date.now() + holdMinutes * 60 * 1000);
  for (const seatId of seatIds) {
    event.reservations.set(seatId, { buyerId, expiresAt });
  }
  return { reserved: seatIds, expiresAt };
}

// IMPLEMENTADO: Libera las reservas que han expirado.
function releaseExpiredReservations(event, referenceTime = new Date()) {
  const ref = new Date(referenceTime);
  const released = [];
  for (const [seatId, reservation] of event.reservations) {
    if (reservation.expiresAt <= ref) {
      event.reservations.delete(seatId);
      released.push(seatId);
    }
  }
  return released;
}

// IMPLEMENTADO: Completa la orden: mueve los asientos de reservados a vendidos y actualiza el tier.
function completeOrder(order, event) {
  const tier = event.tiers.find(t => t.name === order.tierName);
  if (!tier) throw new Error(`Tier '${order.tierName}' not found`);

  for (const seatId of order.seatIds) {
    event.reservations.delete(seatId);
    event.soldSeats.add(seatId);
  }

  const soldPct = tier.getSoldPercentage();
  const price = calculateDynamicPrice(tier, soldPct);
  order.totalPrice = parseFloat((price * order.seatIds.length).toFixed(2));
  order.status = 'confirmed';
  tier.sold += order.seatIds.length;

  return order;
}

// IMPLEMENTADO: Cancela una orden y devuelve los asientos vendidos al pool disponible.
// Reembolso segun politica: >7 dias: 100%, 3-7 dias: 50%, <3 dias: 0%.
function cancelOrder(order, event, eventDate, cancellationPolicy = {}) {
  if (order.status !== 'confirmed') throw new Error('Only confirmed orders can be cancelled');

  const { fullRefundDays = 7, partialRefundDays = 3, partialRefundRate = 0.5 } = cancellationPolicy;
  const now = new Date();
  const daysUntilEvent = (new Date(eventDate) - now) / (1000 * 60 * 60 * 24);

  let refundAmount = 0;
  if (daysUntilEvent > fullRefundDays) refundAmount = order.totalPrice;
  else if (daysUntilEvent >= partialRefundDays) refundAmount = parseFloat((order.totalPrice * partialRefundRate).toFixed(2));

  for (const seatId of order.seatIds) {
    event.soldSeats.delete(seatId);
  }

  const tier = event.tiers.find(t => t.name === order.tierName);
  if (tier) tier.sold = Math.max(0, tier.sold - order.seatIds.length);

  order.status = 'cancelled';
  return { orderId: order.id, refundAmount };
}

// IMPLEMENTADO: Fetch de eventos filtrados por categoria y rango de fechas.
async function fetchEventsByCategory(category, dateRange, fetchFn = fetch) {
  const params = new URLSearchParams({
    category,
    from: dateRange.from,
    to: dateRange.to,
  });
  const res = await fetchFn(`https://api.ticketing.mock/events?${params}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

// IMPLEMENTADO: Genera reporte de ocupacion por tier y por evento.
function getOccupancyReport(events) {
  return events.map(event => {
    const tierStats = event.tiers.map(tier => ({
      name: tier.name,
      sold: tier.sold,
      capacity: tier.capacity,
      occupancyRate: tier.capacity > 0
        ? parseFloat(((tier.sold / tier.capacity) * 100).toFixed(1))
        : 0,
    }));
    const totalSold = event.tiers.reduce((s, t) => s + t.sold, 0);
    const totalCapacity = event.tiers.reduce((s, t) => s + t.capacity, 0);
    return {
      eventId: event.id,
      eventName: event.name,
      totalSold,
      totalCapacity,
      overallOccupancy: totalCapacity > 0
        ? parseFloat(((totalSold / totalCapacity) * 100).toFixed(1))
        : 0,
      tiers: tierStats,
    };
  });
}

// IMPLEMENTADO: Encuentra el mejor bloque contiguo de asientos para un grupo.
// Busca bloques del tamaño exacto. Si no existe, retorna el bloque disponible mas grande.
// Los asientos se organizan por fila (S1-S10 = fila1, S11-S20 = fila2, etc.)
// preference: 'front' (filas bajas), 'back' (filas altas), 'center' (filas medias)
function allocateGroupSeats(event, groupSize, preference = 'front', seatsPerRow = 10) {
  const available = new Set(event.getAvailableSeats());
  const rows = new Map();

  for (const seat of available) {
    const num = parseInt(seat.slice(1));
    const row = Math.ceil(num / seatsPerRow);
    if (!rows.has(row)) rows.set(row, []);
    rows.get(row).push({ seat, num });
  }

  const sortedRows = [...rows.entries()].sort(([a], [b]) => {
    const totalRows = Math.ceil(event.venue.totalSeats / seatsPerRow);
    if (preference === 'back') return b - a;
    if (preference === 'center') {
      const mid = Math.ceil(totalRows / 2);
      return Math.abs(a - mid) - Math.abs(b - mid);
    }
    return a - b;
  });

  let bestBlock = null;

  for (const [row, seats] of sortedRows) {
    const sorted = seats.sort((a, b) => a.num - b.num);
    let blockStart = 0;
    while (blockStart < sorted.length) {
      let blockEnd = blockStart;
      while (blockEnd + 1 < sorted.length &&
             sorted[blockEnd + 1].num === sorted[blockEnd].num + 1) {
        blockEnd++;
      }
      const block = sorted.slice(blockStart, blockEnd + 1).map(s => s.seat);
      if (block.length >= groupSize) {
        return {
          seats: block.slice(0, groupSize),
          row,
          complete: true,
        };
      }
      if (!bestBlock || block.length > bestBlock.seats.length) {
        bestBlock = { seats: block, row, complete: false };
      }
      blockStart = blockEnd + 1;
    }
  }

  return bestBlock ?? { seats: [], row: null, complete: false };
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
