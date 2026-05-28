# Event Ticketing Platform

**Categoria**: Clases, Set, Map, Logic, API Integration, Algoritmos

## Historia de Usuario

Como desarrollador de una plataforma de venta de entradas, necesito un modulo que gestione eventos con capacidad por tiers, reservas temporales de asientos con expiracion automatica, precios dinamicos con surge pricing segun el nivel de ocupacion, procesamiento de ordenes de compra, politicas de cancelacion con reembolso escalonado, y un algoritmo para asignar el mejor bloque contiguo de asientos a grupos de compradores.

## Criterios de Aceptacion

- El venue debe usar un `Set` para representar todos los asientos disponibles.
- El evento debe usar un `Set` para asientos vendidos y un `Map` para reservas con timestamp de expiracion.
- El precio dinamico debe aumentar escalonadamente al 70%, 85% y 95% de ocupacion del tier.
- Las reservas expiradas deben poder liberarse en batch retornando los IDs afectados.
- `completeOrder` debe calcular el precio con el % de ocupacion previo a la venta actual.
- El reembolso al cancelar debe depender de los dias restantes hasta el evento.
- `allocateGroupSeats` debe encontrar bloques contiguos de asientos, respetando la preferencia de posicion.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `new Venue({ totalSeats: 5 }).allSeats` debe ser un Set con `{ 'S1', 'S2', 'S3', 'S4', 'S5' }`
- `checkSeatAvailability(event, ['S1'])` debe retornar `false` si S1 esta vendido o reservado
- `calculateDynamicPrice(tier, 0.90)` con basePrice=100 debe retornar `130`
- `reserveSeats` debe lanzar Error si el asiento ya esta ocupado
- `releaseExpiredReservations` solo debe liberar las reservas vencidas
- `cancelOrder` debe lanzar Error si la orden no esta confirmada
- `allocateGroupSeats(event, 4, 'front')` debe retornar 4 asientos consecutivos de la fila delantera

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/09-event-ticketing
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 75-90 minutos
