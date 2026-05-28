/**
 * Gradebook Manager
 *
 * Modulo para gestionar calificaciones de estudiantes.
 */

// TODO: Calcula el promedio de un array de numeros.
// Si el array esta vacio, retorna 0.
function calculateAverage(scores) {
  throw new Error('Not implemented');
}

// TODO: Retorna la calificacion en letra basada en el promedio:
// >= 90: 'A', >= 80: 'B', >= 70: 'C', >= 60: 'D', < 60: 'F'
function getLetterGrade(average) {
  throw new Error('Not implemented');
}

// TODO: Filtra y retorna un array con los nombres de los estudiantes
// cuyo promedio sea mayor o igual a minScore.
// Cada estudiante es un objeto: { name: string, scores: number[] }
function getPassingStudents(students, minScore) {
  throw new Error('Not implemented');
}

// TODO: Retorna un objeto con estadisticas de la clase:
// { highest: number, lowest: number, classAverage: number }
// highest: promedio mas alto de la clase
// lowest: promedio mas bajo de la clase
// classAverage: promedio de TODOS los scores de TODOS los estudiantes
function getClassStats(students) {
  throw new Error('Not implemented');
}

// TODO: Retorna un objeto con la cantidad de estudiantes por cada letra:
// { A: number, B: number, C: number, D: number, F: number }
// Usa calculateAverage y getLetterGrade para cada estudiante.
function getGradeDistribution(students) {
  throw new Error('Not implemented');
}

// TODO: Calcula el promedio ponderado a partir de un array de categorias.
// Cada categoria: { score: number, weight: number }
// Retorna el promedio ponderado normalizado por la suma de pesos.
// Si el array esta vacio, retorna 0.
function getWeightedScore(categories) {
  throw new Error('Not implemented');
}

// TODO: Retorna los top n estudiantes con mejor promedio.
// El resultado debe ser un array con los objetos completos de estudiantes,
// ordenados de mayor a menor promedio.
// Cada estudiante: { name: string, scores: number[] }
function getTopStudents(students, n) {
  throw new Error('Not implemented');
}

// TODO: Calcula la mediana de un array de numeros.
// Primero ordena el array. Si la longitud es impar, retorna el valor central.
// Si es par, retorna el promedio de los dos valores centrales.
// Si el array esta vacio, retorna 0.
function getMedianScore(scores) {
  throw new Error('Not implemented');
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateAverage,
    getLetterGrade,
    getPassingStudents,
    getClassStats,
    getGradeDistribution,
    getWeightedScore,
    getTopStudents,
    getMedianScore,
  };
}
