# Gym Membership Engine

**Categoria**: Clases, Herencia, Map, Async/Await, Logic

## Historia de Usuario

Como desarrollador de una plataforma de gestion para gimnasios, necesito un modulo integrador que modele planes de membresia con herencia y descuentos, gestione socios con registro de asistencia usando estructuras de datos eficientes, calcule facturas mensuales aplicando multiples tipos de descuento en cascada, sincronice datos desde una API externa, y recomiende el plan optimo para cada socio basandose en su historial de uso y presupuesto.

## Criterios de Aceptacion

- El sistema debe modelar planes Basic, Premium y VIP con herencia y calculo de precio anual con descuento.
- La clase `Member` debe registrar asistencia con `Map` y exponer estadisticas de uso.
- El congelamiento de membresia debe acumularse y devolver factura cero mientras esta activo.
- `calculateMonthlyBill` debe aplicar descuentos de compromiso anual, corporativo y familiar en cascada.
- `getAttendanceStats` debe identificar la actividad favorita y calcular la tasa de asistencia del periodo.
- `syncMemberData` debe hacer fetch a la API y lanzar error si la respuesta no es exitosa.
- `recommendBestPlan` debe aplicar la logica de umbral de asistencia, actividades de grupo y presupuesto en el orden correcto.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `new VIPPlan({ monthlyPrice: 100, annualDiscount: 0.20 }).getAnnualPrice()` debe retornar `960`
- `member.freeze(15); member.freeze(10);` -> `member.frozenDays` debe ser `25`
- `calculateMonthlyBill(frozenMember, plan)` debe retornar `0`
- `calculateMonthlyBill(annualMember, plan)` con `monthlyPrice: 100` debe retornar `90`
- `getAttendanceStats(member, start, end).favoriteActivity` debe ser la actividad mas repetida
- `recommendBestPlan(member, stats, plans, budget)` con `attendanceRate: 75` y presupuesto suficiente debe retornar el plan VIP
- `recommendBestPlan(member, stats, plans, budget)` con `budget: 35` y plan Basic en 30 debe retornar el plan BASIC

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/06-gym-membership-engine
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 60-90 minutos
