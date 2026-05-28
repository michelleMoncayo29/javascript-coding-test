# Hospital Scheduling System

**Categoria**: Clases, Algoritmos, API Integration, Logica, Fechas

## Historia de Usuario

Como desarrollador de un sistema hospitalario, necesito un modulo que gestione pacientes, doctores y citas medicas con validacion de disponibilidad por horario y limite diario, calculo de cobertura de seguros con deducibles anuales y topes de cobertura, ordenamiento de listas de espera por urgencia clinica, reportes de carga laboral por doctor, y un algoritmo que encuentre el primer slot disponible segun especialidad y preferencias del paciente.

## Criterios de Aceptacion

- `Patient` debe inicializar `yearToDateClaims` en `0`.
- `MedicalAppointment` debe inicializar `status = 'scheduled'` y calcular la hora de fin con `getEndTime()`.
- `getDoctorAvailableSlots` debe excluir slots solapados con citas activas e ignorar las canceladas.
- `bookAppointment` debe validar el limite diario del doctor y la disponibilidad del slot.
- `calculateInsuranceCoverage` debe aplicar correctamente deducible, copago y tope anual.
- `calculatePatientBalance` debe acumular las reclamaciones entre procedimientos.
- `getWaitlistPriority` debe ordenar por urgencia desc y tiempo de espera asc sin mutar el original.
- `generateWorkloadReport` debe calcular totalAppointments, totalHours, avgAppointmentsPerDay y overloadedDays por doctor.
- `findEarliestSlot` debe respetar especialidad, preferencia de turno y doctor preferido.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `new Patient({...}).yearToDateClaims` debe ser `0`
- `new MedicalAppointment({ startTime: '09:30', durationMin: 45, ... }).getEndTime()` debe retornar `'10:15'`
- `calculateInsuranceCoverage('ECG', plan, 500)` con `copayRate=0.20` debe retornar `{ insurancePays: 160, patientPays: 40 }`
- `getWaitlistPriority(lista)` debe retornar primero al paciente con mayor urgencia
- `findEarliestSlot(doctors, 'cardiology', 30, {}, [], '2025-06-10')` debe retornar `{ date: '2025-06-10', startTime: '09:00', ... }`

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/10-hospital-scheduling
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 90-120 minutos
