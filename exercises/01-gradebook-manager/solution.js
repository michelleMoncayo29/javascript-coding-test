/**
 * Gradebook Manager
 *
 * Modulo para gestionar calificaciones de estudiantes.
 */

// IMPLEMENTADO: Manejar array vacio primero para evitar division por cero.
// Usar reduce para sumar los elementos de forma declarativa.
function calculateAverage(scores) {
  if (scores.length === 0) {
    return 0;
  }
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

// IMPLEMENTADO: Usar condicionales encadenados para asignar letras
// siguiendo el rango estandar de calificaciones.
function getLetterGrade(average) {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

// IMPLEMENTADO: Calcular el promedio de cada estudiante con calculateAverage,
// filtrar los que cumplen minScore y extraer solo sus nombres.
function getPassingStudents(students, minScore) {
  return students
    .filter((student) => calculateAverage(student.scores) >= minScore)
    .map((student) => student.name);
}

// IMPLEMENTADO: Calcular todos los promedios individuales primero.
// Luego usar Math.max/Math.min para highest/lowest.
// Para classAverage, aplanar todos los scores en un solo array y calcular su promedio.
function getClassStats(students) {
  if (students.length === 0) {
    return { highest: 0, lowest: 0, classAverage: 0 };
  }

  const averages = students.map((student) => calculateAverage(student.scores));
  const highest = Math.max(...averages);
  const lowest = Math.min(...averages);

  const allScores = students.flatMap((student) => student.scores);
  const classAverage = calculateAverage(allScores);

  return { highest, lowest, classAverage };
}

// IMPLEMENTADO: Inicializar contador para cada letra.
// Recorrer estudiantes, calcular su promedio, obtener su letra e incrementar el contador.
function getGradeDistribution(students) {
  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  students.forEach((student) => {
    const average = calculateAverage(student.scores);
    const grade = getLetterGrade(average);
    distribution[grade]++;
  });

  return distribution;
}

// IMPLEMENTADO: Sumar score * weight para cada categoria.
// Dividir por la suma total de pesos para normalizar.
function getWeightedScore(categories) {
  if (categories.length === 0) {
    return 0;
  }

  const totalWeighted = categories.reduce(
    (acc, cat) => acc + cat.score * cat.weight,
    0
  );
  const totalWeight = categories.reduce(
    (acc, cat) => acc + cat.weight,
    0
  );

  return totalWeighted / totalWeight;
}

// IMPLEMENTADO: Calcular promedio de cada estudiante, ordenar descendente
// y tomar los primeros n elementos.
function getTopStudents(students, n) {
  if (n === 0 || students.length === 0) {
    return [];
  }

  const sorted = [...students].sort((a, b) => {
    return calculateAverage(b.scores) - calculateAverage(a.scores);
  });

  return sorted.slice(0, n);
}

// IMPLEMENTADO: Ordenar el array numericamente.
// Si longitud es impar, tomar el elemento central.
// Si par, promediar los dos elementos centrales.
function getMedianScore(scores) {
  if (scores.length === 0) {
    return 0;
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }

  return (sorted[mid - 1] + sorted[mid]) / 2;
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
