# Gradebook Manager

**Categoria**: Arrays, Objects, Numbers

## Historia de Usuario

Como profesor de una escuela, necesito un modulo integral para gestionar las calificaciones de mis estudiantes, calcular promedios, determinar calificaciones en letra, obtener estadisticas de la clase, analizar distribuciones, calcular promedios ponderados, identificar a los mejores estudiantes y hallar la mediana de calificaciones, para poder evaluar el rendimiento academico de forma automatizada y detallada.

## Criterios de Aceptacion

- El sistema debe calcular correctamente el promedio de un array de calificaciones.
- El sistema debe asignar una calificacion en letra (A, B, C, D, F) basada en el promedio.
- El sistema debe filtrar los estudiantes que aprueban segun una calificacion minima.
- El sistema debe generar estadisticas generales de la clase (promedio mas alto, mas bajo y promedio general).
- El sistema debe contar cuantos estudiantes obtuvieron cada calificacion en letra.
- El sistema debe calcular el promedio ponderado a partir de categorias con pesos.
- El sistema debe retornar los mejores N estudiantes ordenados por promedio.
- El sistema debe calcular la mediana de un conjunto de calificaciones.

## Tarea

Implementa las funciones exportadas en `exercise.js`. No modifiques los nombres de las funciones ni sus parametros.

**Comportamiento esperado**:
- `calculateAverage([10, 20, 30])` debe retornar `20`
- `calculateAverage([])` debe retornar `0`
- `getLetterGrade(95)` debe retornar `'A'`
- `getLetterGrade(55)` debe retornar `'F'`
- `getPassingStudents(students, 70)` debe retornar un array con los nombres de estudiantes cuyo promedio sea >= 70
- `getClassStats(students)` debe retornar `{ highest: number, lowest: number, classAverage: number }`
- `getGradeDistribution(students)` debe retornar `{ A: n, B: n, C: n, D: n, F: n }` con la cantidad de estudiantes por letra
- `getWeightedScore([{ score: 85, weight: 0.5 }, { score: 90, weight: 0.3 }])` debe retornar el promedio ponderado
- `getTopStudents(students, 2)` debe retornar los 2 estudiantes con mejor promedio
- `getMedianScore([10, 20, 30, 40])` debe retornar `25`
- `getMedianScore([])` debe retornar `0`

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/01-gradebook-manager
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Intermedio

**Tiempo Estimado**: 25-40 minutos
