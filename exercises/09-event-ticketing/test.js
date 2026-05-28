/**
 * Pruebas para: Event Ticketing Platform
 *
 * Ejecutar con: npm test exercises/09-event-ticketing
 */

const {
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
} = require('./exercise.js');

function makeEvent() {
  const venue = new Venue({ id: 'v1', name: 'Teatro Principal', totalSeats: 30 });
  const tier = new TicketTier({ name: 'General', basePrice: 50, capacity: 30 });
  return new Event({ id: 'e1', name: 'Concierto Rock', venue, date: '2025-12-01', tiers: [tier] });
}

describe('Event Ticketing - Venue', () => {
  test('debe inicializar allSeats como Set con IDs S1..SN', () => {
    const v = new Venue({ id: 'v1', name: 'Sala', totalSeats: 5 });
    expect(v.allSeats instanceof Set).toBe(true);
    expect(v.allSeats.size).toBe(5);
    expect(v.allSeats.has('S1')).toBe(true);
    expect(v.allSeats.has('S5')).toBe(true);
  });
});

describe('Event Ticketing - TicketTier', () => {
  test('getSoldPercentage debe retornar 0 al inicio', () => {
    const tier = new TicketTier({ name: 'VIP', basePrice: 100, capacity: 50 });
    expect(tier.getSoldPercentage()).toBe(0);
  });

  test('getSoldPercentage debe calcular el porcentaje correctamente', () => {
    const tier = new TicketTier({ name: 'VIP', basePrice: 100, capacity: 10 });
    tier.sold = 8;
    expect(tier.getSoldPercentage()).toBeCloseTo(0.8, 2);
  });
});

describe('Event Ticketing - Event', () => {
  test('debe inicializar soldSeats y reservations vacios', () => {
    const event = makeEvent();
    expect(event.soldSeats instanceof Set).toBe(true);
    expect(event.reservations instanceof Map).toBe(true);
    expect(event.soldSeats.size).toBe(0);
  });

  test('getAvailableSeats debe retornar todos los asientos al inicio', () => {
    const event = makeEvent();
    expect(event.getAvailableSeats()).toHaveLength(30);
  });

  test('getAvailableSeats debe excluir asientos vendidos y reservados', () => {
    const event = makeEvent();
    event.soldSeats.add('S1');
    event.reservations.set('S2', { buyerId: 'b1', expiresAt: new Date(Date.now() + 9999999) });
    expect(event.getAvailableSeats()).toHaveLength(28);
    expect(event.getAvailableSeats()).not.toContain('S1');
    expect(event.getAvailableSeats()).not.toContain('S2');
  });
});

describe('Event Ticketing - checkSeatAvailability', () => {
  test('debe retornar true para asientos disponibles', () => {
    const event = makeEvent();
    expect(checkSeatAvailability(event, ['S1', 'S2', 'S3'])).toBe(true);
  });

  test('debe retornar false si algun asiento esta vendido', () => {
    const event = makeEvent();
    event.soldSeats.add('S2');
    expect(checkSeatAvailability(event, ['S1', 'S2'])).toBe(false);
  });

  test('debe retornar false si algun asiento esta reservado', () => {
    const event = makeEvent();
    event.reservations.set('S3', { buyerId: 'b1', expiresAt: new Date(Date.now() + 99999) });
    expect(checkSeatAvailability(event, ['S3'])).toBe(false);
  });

  test('debe retornar false para asientos que no existen en el venue', () => {
    const event = makeEvent();
    expect(checkSeatAvailability(event, ['S999'])).toBe(false);
  });
});

describe('Event Ticketing - calculateDynamicPrice', () => {
  test('debe retornar precio base cuando la ocupacion es baja (<70%)', () => {
    const tier = new TicketTier({ name: 'General', basePrice: 100, capacity: 100 });
    expect(calculateDynamicPrice(tier, 0.5)).toBe(100);
  });

  test('debe aplicar +15% entre 70% y 84%', () => {
    const tier = new TicketTier({ name: 'General', basePrice: 100, capacity: 100 });
    expect(calculateDynamicPrice(tier, 0.75)).toBeCloseTo(115, 1);
  });

  test('debe aplicar +30% entre 85% y 94%', () => {
    const tier = new TicketTier({ name: 'General', basePrice: 100, capacity: 100 });
    expect(calculateDynamicPrice(tier, 0.90)).toBeCloseTo(130, 1);
  });

  test('debe aplicar +50% al 95% o mas', () => {
    const tier = new TicketTier({ name: 'General', basePrice: 100, capacity: 100 });
    expect(calculateDynamicPrice(tier, 0.97)).toBeCloseTo(150, 1);
  });
});

describe('Event Ticketing - reserveSeats', () => {
  test('debe registrar la reserva en event.reservations', () => {
    const event = makeEvent();
    reserveSeats(event, ['S1', 'S2'], 'buyer1', 15);
    expect(event.reservations.has('S1')).toBe(true);
    expect(event.reservations.has('S2')).toBe(true);
  });

  test('debe lanzar error si el asiento ya esta vendido o reservado', () => {
    const event = makeEvent();
    event.soldSeats.add('S1');
    expect(() => reserveSeats(event, ['S1'], 'buyer1', 15)).toThrow();
  });

  test('debe retornar objeto con reserved y expiresAt', () => {
    const event = makeEvent();
    const result = reserveSeats(event, ['S5'], 'buyer1', 10);
    expect(result.reserved).toContain('S5');
    expect(result.expiresAt).toBeInstanceOf(Date);
  });
});

describe('Event Ticketing - releaseExpiredReservations', () => {
  test('debe liberar reservas vencidas y retornar los IDs', () => {
    const event = makeEvent();
    const pastTime = new Date(Date.now() - 1000);
    event.reservations.set('S1', { buyerId: 'b1', expiresAt: pastTime });
    event.reservations.set('S2', { buyerId: 'b2', expiresAt: new Date(Date.now() + 99999) });
    const released = releaseExpiredReservations(event);
    expect(released).toContain('S1');
    expect(released).not.toContain('S2');
    expect(event.reservations.has('S1')).toBe(false);
    expect(event.reservations.has('S2')).toBe(true);
  });

  test('debe retornar array vacio si no hay reservas vencidas', () => {
    const event = makeEvent();
    event.reservations.set('S1', { buyerId: 'b1', expiresAt: new Date(Date.now() + 99999) });
    expect(releaseExpiredReservations(event)).toHaveLength(0);
  });
});

describe('Event Ticketing - completeOrder', () => {
  test('debe mover asientos de reservados a vendidos', () => {
    const event = makeEvent();
    reserveSeats(event, ['S1', 'S2'], 'b1', 15);
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S1', 'S2'] });
    completeOrder(order, event);
    expect(event.soldSeats.has('S1')).toBe(true);
    expect(event.reservations.has('S1')).toBe(false);
    expect(order.status).toBe('confirmed');
  });

  test('debe calcular totalPrice basado en el precio dinamico del tier', () => {
    const event = makeEvent();
    reserveSeats(event, ['S1'], 'b1', 15);
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S1'] });
    completeOrder(order, event);
    expect(order.totalPrice).toBeGreaterThan(0);
  });

  test('debe incrementar el contador sold del tier', () => {
    const event = makeEvent();
    reserveSeats(event, ['S1', 'S2', 'S3'], 'b1', 15);
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S1', 'S2', 'S3'] });
    completeOrder(order, event);
    expect(event.tiers[0].sold).toBe(3);
  });
});

describe('Event Ticketing - cancelOrder', () => {
  test('debe devolver asientos al pool disponible', () => {
    const event = makeEvent();
    reserveSeats(event, ['S5'], 'b1', 15);
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S5'] });
    completeOrder(order, event);
    cancelOrder(order, event, '2030-12-31');
    expect(event.soldSeats.has('S5')).toBe(false);
    expect(order.status).toBe('cancelled');
  });

  test('reembolso total cuando faltan mas de 7 dias para el evento', () => {
    const event = makeEvent();
    reserveSeats(event, ['S6'], 'b1', 15);
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S6'] });
    completeOrder(order, event);
    order.totalPrice = 100;
    const result = cancelOrder(order, event, '2035-01-01');
    expect(result.refundAmount).toBe(100);
  });

  test('sin reembolso cuando el evento es en menos de 3 dias', () => {
    const event = makeEvent();
    reserveSeats(event, ['S7'], 'b1', 15);
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S7'] });
    completeOrder(order, event);
    order.totalPrice = 100;
    const tomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    const result = cancelOrder(order, event, tomorrow);
    expect(result.refundAmount).toBe(0);
  });

  test('debe lanzar error al cancelar una orden no confirmada', () => {
    const event = makeEvent();
    const order = new PurchaseOrder({ id: 'o1', buyerId: 'b1', eventId: 'e1', tierName: 'General', seatIds: ['S1'] });
    expect(() => cancelOrder(order, event, '2030-01-01')).toThrow();
  });
});

describe('Event Ticketing - fetchEventsByCategory', () => {
  test('debe construir la URL con los parametros correctos', async () => {
    const mockData = [{ id: 'e1', name: 'Rock Fest' }];
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockData });
    const result = await fetchEventsByCategory('music', { from: '2025-01-01', to: '2025-12-31' }, mockFetch);
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('category=music'));
  });

  test('debe lanzar error si la respuesta no es ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchEventsByCategory('sports', { from: '2025-01-01', to: '2025-12-31' }, mockFetch)).rejects.toThrow();
  });
});

describe('Event Ticketing - getOccupancyReport', () => {
  test('debe generar el reporte correcto por evento y tier', () => {
    const event = makeEvent();
    event.tiers[0].sold = 15;
    const report = getOccupancyReport([event]);
    expect(report).toHaveLength(1);
    expect(report[0].totalSold).toBe(15);
    expect(report[0].overallOccupancy).toBeCloseTo(50, 0);
    expect(report[0].tiers).toHaveLength(1);
  });

  test('debe retornar ocupacion 0 para evento sin ventas', () => {
    const event = makeEvent();
    const report = getOccupancyReport([event]);
    expect(report[0].overallOccupancy).toBe(0);
  });
});

describe('Event Ticketing - allocateGroupSeats', () => {
  test('debe encontrar un bloque contiguo del tamaño exacto', () => {
    const event = makeEvent();
    const result = allocateGroupSeats(event, 4, 'front');
    expect(result.seats).toHaveLength(4);
    expect(result.complete).toBe(true);
  });

  test('los asientos del bloque deben ser numericamente consecutivos', () => {
    const event = makeEvent();
    const result = allocateGroupSeats(event, 3, 'front');
    const nums = result.seats.map(s => parseInt(s.slice(1))).sort((a, b) => a - b);
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBe(nums[i - 1] + 1);
    }
  });

  test('si no hay bloque del tamaño exacto debe retornar el mejor bloque disponible con complete=false', () => {
    const venue = new Venue({ id: 'v1', name: 'Sala', totalSeats: 10 });
    const tier = new TicketTier({ name: 'General', basePrice: 50, capacity: 10 });
    const event = new Event({ id: 'e1', name: 'Show', venue, date: '2025-12-01', tiers: [tier] });
    // Vender S3 para romper la fila en bloques [S1,S2] y [S4..S10]
    event.soldSeats.add('S3');
    const result = allocateGroupSeats(event, 10);
    expect(result.complete).toBe(false);
    expect(result.seats.length).toBeGreaterThan(0);
  });

  test('debe retornar asientos de la fila del frente con preference front', () => {
    const event = makeEvent();
    const result = allocateGroupSeats(event, 2, 'front');
    const nums = result.seats.map(s => parseInt(s.slice(1)));
    expect(Math.min(...nums)).toBeLessThanOrEqual(10);
  });
});
