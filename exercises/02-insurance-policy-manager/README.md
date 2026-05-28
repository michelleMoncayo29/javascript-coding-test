# Insurance Policy Manager

**Categoria**: Clases, Herencia, Operadores, Logic

## Historia de Usuario

Como desarrollador en una aseguradora, necesito un modulo que modele diferentes tipos de polizas de seguro (auto, hogar, vida), procese reclamos con reglas de negocio especificas y calcule primas de renovacion considerando fidelidad del cliente, historial de reclamos y descuentos por bundle, para automatizar la gestion de contratos y cotizaciones.

## Criterios de Aceptacion

- El sistema debe modelar una clase base `Policy` con propiedades comunes y metodos de estado.
- Las subclases `AutoPolicy`, `HomePolicy` y `LifePolicy` deben extender `Policy` y calcular su propio factor de riesgo.
- El sistema debe procesar reclamos validando vigencia de la poliza y el deducible.
- El sistema debe calcular la prima de renovacion aplicando descuentos y penalizaciones en cascada.
- La prima de renovacion nunca puede bajar del 60% de la prima base.
- El sistema debe poder agrupar polizas por tipo y detectar las que estan proximas a vencer.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `new AutoPolicy(data).type` debe retornar `'AUTO'`
- `policy.isActive('2025-06-01')` debe retornar `true` si la fecha esta dentro del rango
- `processClaim(policy, { amount: 800, date: '2025-06-01' })` debe retornar `{ approved: true, payout: 600 }` con deducible de 200
- `processClaim(policy, { amount: 100, date: '2025-06-01' })` debe rechazar si el monto no supera el deducible
- `calculateRenewalPremium(policy, history)` debe aplicar descuento de fidelidad, penalizacion por reclamos y descuento bundle en ese orden
- `groupPoliciesByType(policies)` debe retornar `{ AUTO: [...], HOME: [...] }`
- `getExpiringPolicies(policies, 30, date)` debe retornar solo las polizas que vencen en los proximos 30 dias

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/02-insurance-policy-manager
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Intermedio-Avanzado

**Tiempo Estimado**: 40-60 minutos
