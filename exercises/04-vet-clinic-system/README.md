# Vet Clinic System

**Categoria**: Clases, Map, Set, Logic, Algoritmos

## Historia de Usuario

Como desarrollador de software para una clinica veterinaria, necesito un modulo que gestione mascotas, duenos, historiales medicos y citas, con la capacidad de calcular automaticamente las vacunas pendientes para cada mascota segun su especie, edad e historial de vacunacion, y de organizar la agenda de los veterinarios evitando conflictos de horario.

## Criterios de Aceptacion

- El sistema debe modelar mascotas con calculo de edad en meses y anios.
- El sistema debe modelar duenos con registro de multiples mascotas.
- El historial medico debe usar `Map` para almacenar entradas por fecha y `Set` para las vacunas aplicadas.
- El sistema debe detectar solapamiento de citas correctamente.
- El sistema debe calcular vacunas pendientes considerando especie, edad minima (2 meses), y fecha de ultima aplicacion segun intervalos de refuerzo.
- Las vacunas nunca aplicadas deben aparecer primero en el resultado.
- El sistema debe filtrar y ordenar la agenda de un veterinario por rango de fechas.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `pet.getAgeInMonths('2024-01-01')` siendo birthDate `'2023-01-01'` debe retornar `12`
- `record.hasVaccine('rabies')` debe retornar `true` despues de llamar `applyVaccine('rabies', date)`
- `record.appliedVaccines` debe ser un `Set` sin duplicados aunque se aplique la misma vacuna dos veces
- `hasConflict(a1, a2)` con citas consecutivas debe retornar `false`
- `getPendingVaccinations(dogUnder2Months, record)` debe retornar `[]`
- `getPendingVaccinations(dog, emptyRecord)` debe listar todas las vacunas caninas con `reason: 'never_applied'`
- `getVetSchedule(appointments, 'Dr. Garcia', start, end)` debe retornar solo sus citas en ese rango, ordenadas

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/04-vet-clinic-system
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 50-70 minutos
