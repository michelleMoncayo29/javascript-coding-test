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

	const averages = [];
    for (const student of students) {
		const average = student.scores;
        averages.push(average);
    }
	console.log("averages", averages);

    const puntosMaximos = [];
    const allScores = [];

    for (let i = 0; i < averages.length; i++) {
        const arrStudentScores = averages[i];
        let sum = 0;
        for (let j = 0; j < arrStudentScores.length; j++) {
            const score = arrStudentScores[j];
            sum += score;
            allScores.push(score); // Correcto: guardas cada nota individual
        }
        const average = sum / arrStudentScores.length;
        puntosMaximos.push(average); // Correcto: guardas el promedio de cada alumno
    }

	console.log("todos los scores", allScores);

    const highest = Math.max(...puntosMaximos);
    const lowest = Math.min(...puntosMaximos);

    let totalSumScores = 0;
    for (let i = 0; i < allScores.length; i++) {
        totalSumScores += allScores[i];
	}
	
    const classAverage = totalSumScores / allScores.length;


    return { 
        highest: highest, 
        lowest: lowest, 
        classAverage: classAverage 
    };
}

// TODO: Retorna un objeto con la cantidad de estudiantes por cada letra:
// { A: number, B: number, C: number, D: number, F: number }
// Usa calculateAverage y getLetterGrade para cada estudiante.
function getGradeDistribution(students) {
  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  
	students.forEach((student) => {
	  const average = calculateAverage(student.scores);
	  const grade = getLetterGrade(average);
	  distribution[grade]++;
	});
  
	return distribution;
}

// TODO: Calcula el promedio ponderado a partir de un array de categorias.
// Cada categoria: { score: number, weight: number }
// Retorna el promedio ponderado normalizado por la suma de pesos.
// Si el array esta vacio, retorna 0.
function getWeightedScore(categories) {
	if(categories.length === 0) {
		return 0;
	}


	// 2. Creamos dos variables "acumuladoras" que empiezan en 0
	let totalWeighted = 0;
	let totalWeight = 0;

	// 3. Recorremos cada categoría una por una con un bucle for
	for (let i = 0; i < categories.length; i++) {
		const cat = categories[i];

		// Multiplicamos la nota por su peso y lo sumamos al total ponderado
		totalWeighted += cat.score * cat.weight;

		// Sumamos el peso al total de pesos
		totalWeight += cat.weight;
	}

	// 4. Hacemos la división final
	return totalWeighted / totalWeight;
}

// TODO: Retorna los top n estudiantes con mejor promedio.
// El resultado debe ser un array con los objetos completos de estudiantes,
// ordenados de mayor a menor promedio.
// Cada estudiante: { name: string, scores: number[] }
function getTopStudents(students, n) {
  if (n === 0 || students.length === 0) {
	  return [];
	}
  
	const sorted = [...students].sort((a, b) => {
	  return calculateAverage(b.scores) - calculateAverage(a.scores);
	});
  
	return sorted.slice(0, n);
}

// TODO: Calcula la mediana de un array de numeros.
// Primero ordena el array. Si la longitud es impar, retorna el valor central.
// Si es par, retorna el promedio de los dos valores centrales.
// Si el array esta vacio, retorna 0.
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
