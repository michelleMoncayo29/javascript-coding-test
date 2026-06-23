/**
 * Gradebook Manager
 *
 * Modulo para gestionar calificaciones de estudiantes.
 */

// TODO: Calcula el promedio de un array de numeros.
// Si el array esta vacio, retorna 0.
function calculateAverage(scores) {
  if (scores.length === 0) {
    return 0;
  }
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

// TODO: Retorna la calificacion en letra basada en el promedio:
// >= 90: 'A', >= 80: 'B', >= 70: 'C', >= 60: 'D', < 60: 'F'
function getLetterGrade(average) {
  if (average >= 90) {
    return "A";
  }
  if (average >= 80) {
    return "B";
  }
  if (average >= 70) {
    return "C";
  }
  if (average >= 60) {
    return "D";
  }
  return "F";
}

// TODO: Filtra y retorna un array con los nombres de los estudiantes
// cuyo promedio sea mayor o igual a minScore.
// Cada estudiante es un objeto: { name: string, scores: number[] }
function getPassingStudents(students, minScore) {
  return students
    .filter((student) => calculateAverage(student.scores) >= minScore)
    .map((student) => student.name);
}

// TODO: Retorna un objeto con estadisticas de la clase:
// { highest: number, lowest: number, classAverage: number }
// highest: promedio mas alto de la clase
// lowest: promedio mas bajo de la clase
// classAverage: promedio de TODOS los scores de TODOS los estudiantes
function getClassStats(students) {
    if (students.length === 0) {
        return { highest: 0, lowest: 0, classAverage: 0 };
    }
    
    // console.log(students);
    const averages = [];
    for (const student of students) {
        const average = student.scores;
        averages.push(average);
    }

    const puntosMaximos = []
    // let totalScores = 0;
    for (let i = 0; i < averages.length; i++) {
        const arrStudentScores = averages[i];
        let suma = 0;
        for (let j = 0; j < arrStudentScores.length; j++) {
            const score = arrStudentScores[j];
            suma += score;
        }
        const average = suma / arrStudentScores.length;
        puntosMaximos.push(average);
    }


    const highest = Math.max(...puntosMaximos);
    const lowest = Math.min(...puntosMaximos);
    console.log(highest, lowest);

    // // console.log(averages);
    // // console.log(highest);
    // // console.log(lowest);
    // const classAverage = calculateAverage(students.flatMap(student => student.scores));

    // return { highest, lowest, classAverage };
}

getClassStats([
  { name: 'Ana', scores: [90, 90, 90] },
  { name: 'Luis', scores: [60, 60, 60] },
  { name: 'Sofia', scores: [80, 80, 80] },
]);

// TODO: Retorna un objeto con la cantidad de estudiantes por cada letra:
// { A: number, B: number, C: number, D: number, F: number }
// Usa calculateAverage y getLetterGrade para cada estudiante.
function getGradeDistribution(students) {
  throw new Error("Not implemented");
}

// TODO: Calcula el promedio ponderado a partir de un array de categorias.
// Cada categoria: { score: number, weight: number }
// Retorna el promedio ponderado normalizado por la suma de pesos.
// Si el array esta vacio, retorna 0.
function getWeightedScore(categories) {
  throw new Error("Not implemented");
}

// TODO: Retorna los top n estudiantes con mejor promedio.
// El resultado debe ser un array con los objetos completos de estudiantes,
// ordenados de mayor a menor promedio.
// Cada estudiante: { name: string, scores: number[] }
function getTopStudents(students, n) {
  throw new Error("Not implemented");
}

// TODO: Calcula la mediana de un array de numeros.
// Primero ordena el array. Si la longitud es impar, retorna el valor central.
// Si es par, retorna el promedio de los dos valores centrales.
// Si el array esta vacio, retorna 0.
function getMedianScore(scores) {
  throw new Error("Not implemented");
}

// Exportar para testing
if (typeof module !== "undefined" && module.exports) {
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
