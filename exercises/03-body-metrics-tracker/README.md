# Body Metrics Tracker

**Categoria**: Clases, Operadores, Metodos, Numbers

## Historia de Usuario

Como desarrollador de una aplicacion de fitness, necesito un modulo que permita registrar y calcular metricas corporales (peso, altura, IMC, TMB, calorias), con soporte para mostrar los valores en el sistema metrico o imperial segun la preferencia del usuario, y generar planes de macronutrientes personalizados segun el objetivo (perder, mantener o ganar peso).

## Criterios de Aceptacion

- El sistema debe convertir pesos entre kg y lbs, y alturas entre cm y pulgadas.
- El sistema debe calcular el IMC correctamente en ambos sistemas de unidades.
- El sistema debe calcular la TMB (Tasa Metabolica Basal) usando la formula Mifflin-St Jeor diferenciada por genero.
- El sistema debe calcular las calorias diarias totales segun nivel de actividad.
- La clase `UserProfile` debe almacenar los datos en metrico internamente y exponerlos en la unidad preferida del usuario mediante getters/setters.
- El sistema debe registrar mediciones y calcular el porcentaje de cambio de peso.
- El plan de macros debe respetar un minimo de 1200 kcal/dia y calcular protein/fat/carbs segun reglas especificas.

## Tarea

Implementa las funciones y la clase exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `convertWeight(70, 'kg', 'lbs')` debe retornar aproximadamente `154.32`
- `calculateBMI(70, 175, 'metric')` debe retornar aproximadamente `22.86`
- `calculateBMR({ weight: 70, height: 175, age: 30, gender: 'male', units: 'metric' })` debe retornar aproximadamente `1648.75`
- `new UserProfile({ weightKg: 70, unitPreference: 'imperial', ... }).weight` debe retornar el peso en lbs
- `trackProgress([{ weightKg: 80 }, { weightKg: 76 }])` debe retornar `-5`
- `generateMacroPlan(user, 'lose')` no debe retornar menos de 1200 calorias
- `generateMacroPlan(user, 'maintain').protein` debe ser igual a `peso_kg * 2`

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/03-body-metrics-tracker
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Intermedio

**Tiempo Estimado**: 35-50 minutos
