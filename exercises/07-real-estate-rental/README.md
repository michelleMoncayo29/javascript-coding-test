# Real Estate Rental Platform

**Categoria**: Clases, Map, Operadores, Logic, API Integration

## Historia de Usuario

Como desarrollador de una plataforma inmobiliaria, necesito un modulo que gestione propiedades en alquiler, contratos de arrendamiento y pagos, permitiendo calcular rentas proporcionales para mudanzas a mitad de mes, multas escalonadas por atraso, incrementos de renta con control de CPI, reportes de vacancia y un algoritmo de precio optimo basado en comparables de mercado e historial de ocupacion.

## Criterios de Aceptacion

- El sistema debe calcular la renta proporcional al numero exacto de dias ocupados en el primer mes.
- Las multas por atraso deben ser escalonadas (dias 1-5, 6-15, 16+) con un tope del 15% de la renta mensual.
- El incremento de renta no debe superar el maximo contractual aunque el CPI sea mayor.
- El historial de pagos debe estar agrupado por mes en un `Map` con status `on_time` o `late`.
- El reporte de vacancia debe calcular dias y costo de vacancia por propiedad.
- El filtro de propiedades debe combinar multiples criterios de forma independiente.
- El precio optimo debe estar siempre acotado entre el 80% y el 120% de la mediana del mercado.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `calculateProratedRent(lease, '2024-06-16')` con renta de 1200 y junio (30 dias) debe retornar `600`
- `calculateLateFee(1200, 3, policy)` con rate1=0.03 debe retornar `36`
- `calculateLateFee(1000, 20, policy)` con flatFee=250 no debe superar `150` (15% de 1000)
- `applyRentEscalation(lease, 0.10, 0.03)` con renta de 1000 debe retornar `1030`
- `getTenantPaymentHistory(lease, period)` debe retornar un `Map` con claves `'YYYY-MM'`
- `getVacancyReport` debe retornar `vacant: false` para propiedades con lease activo
- `optimizeListingPrice` con alta ocupacion debe sugerir precio mayor a la mediana de comparables

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/07-real-estate-rental
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 70-90 minutos
