/**
 * Pruebas para: Gradebook Manager
 *
 * Ejecutar con: npm test exercises/01-gradebook-manager
 */

const {
  calculateAverage,
  getLetterGrade,
  getPassingStudents,
  getClassStats,
  getGradeDistribution,
  getWeightedScore,
  getTopStudents,
  getMedianScore,
} = require('./exercise.js');

describe('Gradebook Manager - calculateAverage', () => {
  test('debe calcular el promedio de [10, 20, 30] correctamente', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20);
  });

  test('debe retornar 0 para un array vacio', () => {
    expect(calculateAverage([])).toBe(0);
  });

  test('debe manejar un array con un solo elemento', () => {
    expect(calculateAverage([100])).toBe(100);
  });

  test('debe manejar numeros decimales', () => {
    expect(calculateAverage([1.5, 2.5, 3.0])).toBeCloseTo(2.33, 2);
  });
});

describe('Gradebook Manager - getLetterGrade', () => {
  test('debe retornar A para promedio 95', () => {
    expect(getLetterGrade(95)).toBe('A');
  });

  test('debe retornar B para promedio 85', () => {
    expect(getLetterGrade(85)).toBe('B');
  });

  test('debe retornar F para promedio 55', () => {
    expect(getLetterGrade(55)).toBe('F');
  });

  test('debe manejar el limite exacto de 60 como D', () => {
    expect(getLetterGrade(60)).toBe('D');
  });

  test('debe manejar el limite exacto de 90 como A', () => {
    expect(getLetterGrade(90)).toBe('A');
  });
});

describe('Gradebook Manager - getPassingStudents', () => {
  const students = [
    { name: 'Ana', scores: [90, 80, 100] },
    { name: 'Luis', scores: [50, 60, 55] },
    { name: 'Sofia', scores: [70, 75, 80] },
  ];

  test('debe retornar nombres de estudiantes con promedio >= 70', () => {
    expect(getPassingStudents(students, 70)).toEqual(['Ana', 'Sofia']);
  });

  test('debe retornar un array vacio si ninguno aprueba', () => {
    expect(getPassingStudents(students, 95)).toEqual([]);
  });

  test('debe incluir a todos si minScore es 0', () => {
    expect(getPassingStudents(students, 0)).toEqual(['Ana', 'Luis', 'Sofia']);
  });
});

describe('Gradebook Manager - getClassStats', () => {
  const students = [
    { name: 'Ana', scores: [90, 90, 90] },
    { name: 'Luis', scores: [60, 60, 60] },
    { name: 'Sofia', scores: [80, 80, 80] },
  ];

  test('debe calcular estadisticas correctamente', () => {
    expect(getClassStats(students)).toEqual({
      highest: 90,
      lowest: 60,
      classAverage: 76.66666666666667,
    });
  });

  test('debe retornar 0s para clase vacia', () => {
    expect(getClassStats([])).toEqual({
      highest: 0,
      lowest: 0,
      classAverage: 0,
    });
  });
});

describe('Gradebook Manager - getGradeDistribution', () => {
  test('debe contar estudiantes por letra correctamente', () => {
    const students = [
      { name: 'Ana', scores: [95, 92, 98] },
      { name: 'Luis', scores: [50, 55, 45] },
      { name: 'Sofia', scores: [82, 85, 88] },
      { name: 'Carlos', scores: [70, 72, 68] },
      { name: 'Elena', scores: [63, 60, 65] },
    ];
    expect(getGradeDistribution(students)).toEqual({
      A: 1, B: 1, C: 1, D: 1, F: 1,
    });
  });

  test('debe retornar todo ceros para array vacio', () => {
    expect(getGradeDistribution([])).toEqual({
      A: 0, B: 0, C: 0, D: 0, F: 0,
    });
  });

  test('debe manejar todos los estudiantes con la misma calificacion', () => {
    const students = [
      { name: 'Ana', scores: [85, 85, 85] },
      { name: 'Luis', scores: [85, 85, 85] },
    ];
    expect(getGradeDistribution(students)).toEqual({
      A: 0, B: 2, C: 0, D: 0, F: 0,
    });
  });
});

describe('Gradebook Manager - getWeightedScore', () => {
  test('debe calcular el promedio ponderado correctamente', () => {
    const categories = [
      { score: 85, weight: 0.5 },
      { score: 90, weight: 0.3 },
      { score: 70, weight: 0.2 },
    ];
    expect(getWeightedScore(categories)).toBeCloseTo(83.5, 2);
  });

  test('debe retornar 0 para array vacio', () => {
    expect(getWeightedScore([])).toBe(0);
  });

  test('debe manejar pesos que no suman exactamente 1', () => {
    const categories = [
      { score: 100, weight: 0.2 },
      { score: 50, weight: 0.2 },
    ];
    expect(getWeightedScore(categories)).toBeCloseTo(75, 2);
  });

  test('debe dar el mismo resultado que average cuando todos los pesos son iguales', () => {
    const categories = [
      { score: 80, weight: 1 },
      { score: 90, weight: 1 },
      { score: 70, weight: 1 },
    ];
    expect(getWeightedScore(categories)).toBeCloseTo(80, 2);
  });
});

describe('Gradebook Manager - getTopStudents', () => {
  const students = [
    { name: 'Ana', scores: [100, 100, 100] },
    { name: 'Luis', scores: [50, 60, 55] },
    { name: 'Sofia', scores: [80, 85, 90] },
    { name: 'Carlos', scores: [70, 75, 80] },
  ];

  test('debe retornar los top 2 estudiantes ordenados por promedio descendente', () => {
    const result = getTopStudents(students, 2);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Ana');
    expect(result[1].name).toBe('Sofia');
  });

  test('debe retornar todos si n supera la cantidad de estudiantes', () => {
    expect(getTopStudents(students, 10)).toHaveLength(4);
  });

  test('debe retornar array vacio si n es 0', () => {
    expect(getTopStudents(students, 0)).toEqual([]);
  });

  test('debe retornar array vacio para lista vacia de estudiantes', () => {
    expect(getTopStudents([], 3)).toEqual([]);
  });
});

describe('Gradebook Manager - getMedianScore', () => {
  test('debe calcular la mediana para array con longitud impar', () => {
    expect(getMedianScore([10, 20, 30, 40, 50])).toBe(30);
  });

  test('debe calcular la mediana para array con longitud par', () => {
    expect(getMedianScore([10, 20, 30, 40])).toBe(25);
  });

  test('debe manejar un array con un solo elemento', () => {
    expect(getMedianScore([100])).toBe(100);
  });

  test('debe retornar 0 para array vacio', () => {
    expect(getMedianScore([])).toBe(0);
  });

  test('debe ordenar el array si no esta ordenado', () => {
    expect(getMedianScore([40, 10, 30, 20])).toBe(25);
  });

  test('debe manejar numeros decimales', () => {
    expect(getMedianScore([1.5, 2.5, 3.5])).toBe(2.5);
  });
});
