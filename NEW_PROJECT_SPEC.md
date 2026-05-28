# Especificación del Proyecto: javascript-coding-exam

Este documento contiene todo lo necesario para que una IA genere y mantenga un proyecto de ejercicios de programación JavaScript desde cero. El estudiante recibe funciones vacías que debe implementar para pasar los tests.

---

## 1. Visión del Proyecto

**Nombre**: `javascript-coding-exam`
**Propósito**: Colección de ejercicios prácticos de programación nivel básico/intermedio diseñados para desarrollar algoritmos más complejos. Cada ejercicio es un pequeño "examen" donde el estudiante recibe un módulo con funciones vacías (solo firmas y comentarios `// TODO`) y debe implementar la lógica para satisfacer los tests automatizados.
**Filosofía**: TDD invertido. Los tests ya están escritos; el estudiante escribe el código.

---

## 2. Reglas de Idioma (Críticas)

- **Documentación** (README, comentarios, descripciones de tests, mensajes de commit): **Español**
- **Código** (nombres de variables, nombres de funciones, lógica, nombres de archivos internos): **Inglés**
- **NO mezclar**: La documentación orientada al estudiante es 100% español. El código fuente es 100% inglés.

---

## 3. Arquitectura y Estructura de Carpetas

```
javascript-coding-exam/
│
├── exercises/                          # Todos los ejercicios
│   │
│   ├── 01-gradebook-manager/           # Ejercicio individual
│   │   ├── README.md                   # Descripción del ejercicio
│   │   ├── exercise.js                 # Funciones vacías / TODO (el estudiante edita ESTE archivo)
│   │   ├── solution.js                 # Implementación de referencia completa
│   │   └── test.js                     # Tests Jest (importan exercise.js por defecto)
│   │
│   ├── 02-inventory-processor/         # Siguiente ejercicio
│   │   ├── README.md
│   │   ├── exercise.js
│   │   ├── solution.js
│   │   └── test.js
│   │
│   └── ...
│
├── AGENTS.md                           # Guía para agentes IA (este documento será la base)
├── README.md                           # Documentación principal del proyecto
├── STRUCTURE.md                        # Convenciones de estructura y nomenclatura
├── EXERCISE_TEMPLATE.md                # Plantilla detallada para crear nuevos ejercicios
├── TESTING.md                          # Guía de testing con Jest adaptada a este flujo
├── package.json                        # Configuración de Node.js y Jest
└── .gitignore                          # Reglas de Git
```

### Convenciones de Nombres

**Carpetas de ejercicios**:
- Formato: `##-exercise-name/`
- Dos dígitos secuenciales: `01-`, `02-`, ...
- Minúsculas, palabras separadas por guiones
- Nombres descriptivos y memorables (2-4 palabras)
- Ejemplo: `01-gradebook-manager/`, `02-string-manipulator/`, `03-api-fetcher/`

**Archivos dentro de cada ejercicio**:
- `exercise.js` — Siempre el mismo nombre. Es el archivo del estudiante.
- `solution.js` — Siempre el mismo nombre. Referencia para el educador.
- `test.js` — Siempre el mismo nombre. Tests Jest.
- `README.md` — Siempre el mismo nombre. Documentación del ejercicio.

---

## 4. Especificación de Archivos por Ejercicio

Cada ejercicio contiene exactamente **4 archivos**.

---

### 4.1. `exercise.js` — Archivo del Estudiante

**Propósito**: Contener las firmas de las funciones que el estudiante debe implementar. Es el ÚNICO archivo que el estudiante debe modificar.

**Características**:
- Exporta un objeto con todas las funciones requeridas.
- Cada función tiene su firma completa (parámetros definidos) pero el cuerpo está vacío o lanza un error.
- Incluye comentarios `// TODO: [instrucción clara en español]` explicando qué debe hacer la función.
- Debe ser sintácticamente válido para que Jest pueda importarlo sin errores de parseo.
- **NO contiene spoilers**: no debe haber código parcial que revele la solución.
- Es self-contained (no requiere archivos externos salvo APIs permitidas en ejercicios avanzados).

**Formato**:
```javascript
/**
 * Gradebook Manager
 *
 * Módulo para gestionar calificaciones de estudiantes.
 */

// TODO: Calcula el promedio de un array de números.
// Si el array está vacío, retorna 0.
function calculateAverage(scores) {
  throw new Error('Not implemented');
}

// TODO: Retorna la calificación en letra basada en el promedio:
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

// TODO: Retorna un objeto con estadísticas de la clase:
// { highest: number, lowest: number, classAverage: number }
function getClassStats(students) {
  throw new Error('Not implemented');
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateAverage,
    getLetterGrade,
    getPassingStudents,
    getClassStats,
  };
}
```

**Reglas de diseño**:
- Las funciones deben estar relacionadas temáticamente (forman un módulo coherente).
- Un ejercicio típico tiene entre **3 y 8 funciones** a implementar.
- El nivel de dificultad se controla mediante la complejidad algorítmica y la cantidad de funciones.

---

### 4.2. `solution.js` — Solución de Referencia

**Propósito**: Implementación correcta y completa que hace pasar todos los tests.

**Características**:
- Misma estructura y firmas que `exercise.js`.
- Incluye comentarios inline `// IMPLEMENTADO: [explicación del razonamiento]` en español.
- Demuestra mejores prácticas de código.
- No debe usar librerías externas no disponibles en el entorno base.

**Formato de comentarios**:
```javascript
function calculateAverage(scores) {
  // IMPLEMENTADO: Manejar array vacío primero para evitar división por cero
  if (scores.length === 0) {
    return 0;
  }

  // IMPLEMENTADO: Usar reduce para sumar todos los elementos de forma declarativa
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}
```

---

### 4.3. `test.js` — Tests Jest

**Propósito**: Validar automáticamente que las funciones en `exercise.js` están correctamente implementadas.

**Características**:
- Usa Jest (`describe`, `test`, `expect`).
- Importa `./exercise.js` por defecto. **El estudiante NO debe modificar este archivo.**
- Las descripciones de tests (`test('debe ...')`) están en español.
- Cubre casos normales, casos límite (edge cases) y manejo de errores.
- Tests independientes entre sí.

**Estructura**:
```javascript
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
} = require('./exercise.js');

describe('Gradebook Manager - calculateAverage', () => {
  test('debe calcular el promedio de [10, 20, 30] correctamente', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20);
  });

  test('debe retornar 0 para un array vacío', () => {
    expect(calculateAverage([])).toBe(0);
  });

  test('debe manejar números decimales', () => {
    expect(calculateAverage([1.5, 2.5, 3.0])).toBeCloseTo(2.33, 2);
  });
});

describe('Gradebook Manager - getLetterGrade', () => {
  test('debe retornar A para promedio 95', () => {
    expect(getLetterGrade(95)).toBe('A');
  });

  test('debe retornar F para promedio 55', () => {
    expect(getLetterGrade(55)).toBe('F');
  });

  test('debe manejar el límite exacto de 90 como A', () => {
    expect(getLetterGrade(90)).toBe('A');
  });
});
```

**Matchers recomendados**:
- `toBe()` para primitivos
- `toEqual()` para objetos y arrays
- `toBeCloseTo()` para decimales
- `toThrow()` para errores

---

### 4.4. `README.md` — Documentación del Ejercicio

**Propósito**: Describir el contexto, la tarea y los criterios de aceptación del ejercicio.

**Formato obligatorio**:
```markdown
# [Nombre del Ejercicio]

**Categoría**: [Strings / Arrays / Numbers / Objects / Recursion / Sorting-Searching / Logic / API Integration]

## 📋 Historia de Usuario

Como [rol], necesito [funcionalidad] para [beneficio].

## 🎯 Criterios de Aceptación

- [Criterio 1: qué debe hacer la funcionalidad]
- [Criterio 2: qué debe hacer la funcionalidad]
- [Criterio 3: manejo de casos límite]

## 📝 Tarea

Debes implementar las funciones exportadas en `exercise.js`. No modifiques los nombres de las funciones ni sus parámetros.

**Comportamiento esperado**:
- `functionName(arg1)` debe retornar `expectedResult1`
- `functionName(arg2)` debe retornar `expectedResult2`
- Maneja correctamente el caso: [descripción de edge case]

## 📂 Archivos

- `exercise.js` - Implementa tus soluciones aquí
- `test.js` - Tests para validar tu implementación (NO editar)
- `solution.js` - Solución de referencia (revisar SOLO después de intentarlo)

## ✅ Cómo Verificar tu Solución

```bash
npm test exercises/##-exercise-name
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## ⚙️ Nivel de Dificultad

**Nivel**: [Principiante / Intermedio / Avanzado]

**Tiempo Estimado**: [15-25 minutos / 25-40 minutos / 40-60 minutos]
```

**Reglas**:
- **NO incluir sección de pistas (hints)**. La resolución es 100% trabajo del estudiante.
- **NO incluir pseudocódigo o explicaciones de cómo implementar** en el README.
- La sección `Tarea` describe el QUÉ, no el CÓMO.

---

## 5. Workflow TDD para Crear Nuevos Ejercicios

Crear un ejercicio siguiendo estrictamente este orden:

### Paso 1: `test.js` (RED)
- Define todos los comportamientos esperados.
- Los tests fallarán inicialmente porque `exercise.js` aún no existe o está vacío.

### Paso 2: `solution.js` (GREEN)
- Escribe la implementación correcta que hace pasar TODOS los tests.
- Añade comentarios `// IMPLEMENTADO:`.

### Paso 3: `exercise.js` (Vacía la implementación)
- Copia `solution.js`.
- Reemplaza el cuerpo de cada función con `throw new Error('Not implemented');` o deja solo el `return` necesario mínimo.
- Añade comentarios `// TODO:` descriptivos.
- Verifica que los tests fallen al ejecutarse contra `exercise.js`.

### Paso 4: `README.md`
- Sigue el formato Scrum definido arriba.
- Asegúrate de que NO tenga pistas.

### Paso 5: Actualizar README principal
- Añade el ejercicio a la lista de `## 📋 Ejercicios Disponibles` en el `README.md` raíz.

### Paso 6: Commit
```bash
git add .
git commit -m "feat :sparkles: add [exercise-name] exercise (##)"
```

---

## 6. Reglas de Diseño de Ejercicios

### Naturaleza de los ejercicios
- **Realistas**: simulan problemas que un desarrollador junior enfrentaría (procesar datos de una lista, validar entradas, transformar estructuras).
- **No triviales**: no deben ser de una sola línea o extremadamente obvios.
- **No obscuros**: deben enseñar una habilidad aplicable en el día a día.
- **Coherentes**: las funciones dentro de un mismo `exercise.js` deben estar relacionadas temáticamente.

### Categorías permitidas
Etiqueta cada ejercicio con UNA categoría principal:

| Categoría | Descripción |
|-----------|-------------|
| `Strings` | Manipulación, parsing, validación, transformación de texto |
| `Arrays` | Filtrado, mapeo, reducción, búsqueda, ordenamiento |
| `Numbers` | Matemáticas, secuencias, conversiones, redondeos |
| `Objects` | Manipulación de estructuras, agrupación, claves/valores |
| `Recursion` | Algoritmos recursivos (factorial, fibonacci, árboles) |
| `Sorting-Searching` | Algoritmos clásicos de ordenamiento y búsqueda |
| `Logic` | Condicionales complejas, máquinas de estado, reglas de negocio |
| `API Integration` | Consumo de APIs externas con `fetch` (ejercicios avanzados) |

### Uso de APIs externas
- **Por defecto**: ejercicios de algoritmos puros (sin dependencias externas).
- **Permitido en avanzados**: ejercicios que consuman APIs públicas (JSONPlaceholder, Open-Meteo, etc.) para practicar `fetch`, `async/await` y manejo de JSON.
- Si un ejercicio usa API, el README debe especificar que requiere conexión a internet.
- Las funciones con fetch deben ser testeables (se recomienda mock de fetch en tests, o usar APIs estables).

### Cantidad de funciones
- **Principiante**: 2-4 funciones
- **Intermedio**: 4-6 funciones
- **Avanzado**: 6-8 funciones (puede incluir funciones asíncronas)

### Niveles de dificultad sugeridos por número
- `01-09`: Principiante
- `10-19`: Intermedio
- `20-29`: Avanzado
- `30+`: Expertos / Integración de APIs

---

## 7. Setup Técnico

### `package.json`

```json
{
  "name": "javascript-coding-exam",
  "version": "1.0.0",
  "description": "A collection of coding exercises from scratch for learning JavaScript algorithms and problem-solving",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:exercise": "jest exercises/01-gradebook-manager"
  },
  "jest": {
    "testEnvironment": "node",
    "verbose": true,
    "collectCoverage": false
  },
  "keywords": [
    "javascript",
    "coding",
    "exercises",
    "education",
    "algorithms",
    "learning"
  ],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  },
  "devDependencies": {
    "jest": "^30.2.0"
  }
}
```

### Dependencias
- **Jest**: única dependencia de desarrollo obligatoria.
- **Sin dependencias de producción**: los ejercicios deben resolverse con JavaScript puro (ES6+).

### Scripts
- `npm test` — ejecuta todos los tests.
- `npm test exercises/##-name` — ejecuta tests de un ejercicio específico.
- `npm run test:watch` — modo watch para desarrollo.

---

## 8. QA Checklist Antes de Commit

Verifica ESTRICTAMENTE cada punto:

- [ ] Los 4 archivos creados con nombres exactos (`README.md`, `exercise.js`, `solution.js`, `test.js`).
- [ ] Carpeta ubicada en `exercises/##-exercise-name/` con formato correcto.
- [ ] `test.js` importa `./exercise.js` por defecto.
- [ ] Los tests **FALLAN** al ejecutarse contra `exercise.js` (vacío/TODO).
- [ ] Los tests **PASAN** al ejecutarse contra `solution.js`.
- [ ] `exercise.js` NO contiene código que dé pistas de la solución.
- [ ] `exercise.js` es sintácticamente válido (Jest puede cargarlo sin errores de parseo).
- [ ] `solution.js` contiene comentarios `// IMPLEMENTADO:`.
- [ ] README.md sigue el formato Scrum definido.
- [ ] README.md NO tiene sección de hints ni pistas.
- [ ] README.md incluye tag de categoría.
- [ ] Toda documentación en español, todo código en inglés.
- [ ] `README.md` principal actualizado con el nuevo ejercicio.
- [ ] Commit con mensaje: `feat :sparkles: add [name] exercise (##)`.

---

## 9. Ejemplo Completo de Ejercicio

A continuación se presenta un ejemplo real y funcional de un ejercicio completo. Este ejemplo puede usarse como referencia exacta.

### Carpeta: `exercises/01-gradebook-manager/`

---

#### `exercises/01-gradebook-manager/README.md`

```markdown
# Gradebook Manager

**Categoría**: Arrays

## 📋 Historia de Usuario

Como profesor de una escuela, necesito un módulo para gestionar las calificaciones de mis estudiantes, calcular promedios, determinar calificaciones en letra y obtener estadísticas de la clase, para poder evaluar el rendimiento académico de forma automatizada.

## 🎯 Criterios de Aceptación

- El sistema debe calcular correctamente el promedio de un array de calificaciones.
- El sistema debe asignar una calificación en letra (A, B, C, D, F) basada en el promedio.
- El sistema debe filtrar los estudiantes que aprueban según una calificación mínima.
- El sistema debe generar estadísticas generales de la clase (promedio más alto, más bajo y promedio general).
- Si un array de calificaciones está vacío, el promedio debe ser 0.

## 📝 Tarea

Implementa las funciones exportadas en `exercise.js`. No modifiques los nombres de las funciones ni sus parámetros.

**Comportamiento esperado**:
- `calculateAverage([10, 20, 30])` debe retornar `20`
- `calculateAverage([])` debe retornar `0`
- `getLetterGrade(95)` debe retornar `'A'`
- `getLetterGrade(55)` debe retornar `'F'`
- `getPassingStudents(students, 70)` debe retornar un array con los nombres de estudiantes cuyo promedio sea >= 70
- `getClassStats(students)` debe retornar `{ highest: number, lowest: number, classAverage: number }`

## 📂 Archivos

- `exercise.js` - Implementa tus soluciones aquí
- `test.js` - Tests para validar tu implementación (NO editar)
- `solution.js` - Solución de referencia (revisar SOLO después de intentarlo)

## ✅ Cómo Verificar tu Solución

```bash
npm test exercises/01-gradebook-manager
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## ⚙️ Nivel de Dificultad

**Nivel**: Principiante

**Tiempo Estimado**: 15-25 minutos
```

---

#### `exercises/01-gradebook-manager/exercise.js`

```javascript
/**
 * Gradebook Manager
 *
 * Módulo para gestionar calificaciones de estudiantes.
 */

// TODO: Calcula el promedio de un array de números.
// Si el array está vacío, retorna 0.
function calculateAverage(scores) {
  throw new Error('Not implemented');
}

// TODO: Retorna la calificación en letra basada en el promedio:
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

// TODO: Retorna un objeto con estadísticas de la clase:
// { highest: number, lowest: number, classAverage: number }
// highest: promedio más alto de la clase
// lowest: promedio más bajo de la clase
// classAverage: promedio de TODOS los scores de TODOS los estudiantes
function getClassStats(students) {
  throw new Error('Not implemented');
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateAverage,
    getLetterGrade,
    getPassingStudents,
    getClassStats,
  };
}
```

---

#### `exercises/01-gradebook-manager/solution.js`

```javascript
/**
 * Gradebook Manager
 *
 * Módulo para gestionar calificaciones de estudiantes.
 */

// IMPLEMENTADO: Manejar array vacío primero para evitar división por cero.
// Usar reduce para sumar los elementos de forma declarativa.
function calculateAverage(scores) {
  if (scores.length === 0) {
    return 0;
  }
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

// IMPLEMENTADO: Usar condicionales encadenados para asignar letras
// siguiendo el rango estándar de calificaciones.
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

// IMPLEMENTADO: Calcular todos los promedies individuales primero.
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

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateAverage,
    getLetterGrade,
    getPassingStudents,
    getClassStats,
  };
}
```

---

#### `exercises/01-gradebook-manager/test.js`

```javascript
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
} = require('./exercise.js');

describe('Gradebook Manager - calculateAverage', () => {
  test('debe calcular el promedio de [10, 20, 30] correctamente', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20);
  });

  test('debe retornar 0 para un array vacío', () => {
    expect(calculateAverage([])).toBe(0);
  });

  test('debe manejar un array con un solo elemento', () => {
    expect(calculateAverage([100])).toBe(100);
  });

  test('debe manejar números decimales', () => {
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

  test('debe manejar el límite exacto de 60 como D', () => {
    expect(getLetterGrade(60)).toBe('D');
  });

  test('debe manejar el límite exacto de 90 como A', () => {
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

  test('debe retornar un array vacío si ninguno aprueba', () => {
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

  test('debe calcular estadísticas correctamente', () => {
    expect(getClassStats(students)).toEqual({
      highest: 90,
      lowest: 60,
      classAverage: 76.66666666666667,
    });
  });

  test('debe retornar 0s para clase vacía', () => {
    expect(getClassStats([])).toEqual({
      highest: 0,
      lowest: 0,
      classAverage: 0,
    });
  });
});
```

---

## 10. Documentación Adicional Recomendada

El proyecto debe incluir estos archivos adicionales en la raíz:

### `STRUCTURE.md`
Explica la estructura de carpetas, convenciones de nombres y propósito de cada archivo. Similar a este documento pero enfocado en la navegación para humanos.

### `TESTING.md`
Guía para estudiantes sobre cómo usar Jest, interpretar resultados de tests, y workflow de desarrollo. Adaptado al flujo de "implementar hasta que pasen los tests".

### `EXERCISE_TEMPLATE.md`
Plantilla rápida con los 4 archivos en formato copy-paste para agilizar la creación de ejercicios.

### `AGENTS.md`
Guía resumida para agentes de IA que trabajen en el repositorio (similar a `CLAUDE.md` en el proyecto original).

---

**Fin de la especificación.**
