# Plantilla para Crear Nuevos Ejercicios

Usa esta plantilla como base para crear ejercicios siguiendo el flujo TDD.

---

## Paso 1: Crear carpeta

```bash
mkdir exercises/##-exercise-name
```

Formato: dos digitos secuenciales, minusculas, palabras separadas por guiones.

---

## Paso 2: test.js

```javascript
/**
 * Pruebas para: Exercise Name
 *
 * Ejecutar con: npm test exercises/##-exercise-name
 */

const { functionOne, functionTwo } = require('./exercise.js');

describe('Exercise Name - functionOne', () => {
  test('debe ...', () => {
    expect(functionOne(...)).toBe(...);
  });
});

describe('Exercise Name - functionTwo', () => {
  test('debe ...', () => {
    expect(functionTwo(...)).toEqual(...);
  });
});
```

---

## Paso 3: solution.js

```javascript
/**
 * Exercise Name
 *
 * Breve descripcion del modulo.
 */

// IMPLEMENTADO: Explicacion del razonamiento.
function functionOne(param) {
  // Implementacion completa
}

// IMPLEMENTADO: Explicacion del razonamiento.
function functionTwo(param) {
  // Implementacion completa
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    functionOne,
    functionTwo,
  };
}
```

---

## Paso 4: exercise.js

```javascript
/**
 * Exercise Name
 *
 * Breve descripcion del modulo.
 */

// TODO: Descripcion clara de lo que debe hacer la funcion.
function functionOne(param) {
  throw new Error('Not implemented');
}

// TODO: Descripcion clara de lo que debe hacer la funcion.
function functionTwo(param) {
  throw new Error('Not implemented');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    functionOne,
    functionTwo,
  };
}
```

---

## Paso 5: README.md

```markdown
# Exercise Name

**Categoria**: [Strings / Arrays / Numbers / Objects / Recursion / Sorting-Searching / Logic / API Integration]

## Historia de Usuario

Como [rol], necesito [funcionalidad] para [beneficio].

## Criterios de Aceptacion

- [Criterio 1]
- [Criterio 2]
- [Criterio 3: manejo de casos limite]

## Tarea

Implementa las funciones exportadas en `exercise.js`. No modifiques los nombres de las funciones ni sus parametros.

**Comportamiento esperado**:
- `functionName(arg1)` debe retornar `expectedResult1`
- `functionName(arg2)` debe retornar `expectedResult2`
- Maneja correctamente el caso: [descripcion de edge case]

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/##-exercise-name
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: [Principiante / Intermedio / Avanzado]

**Tiempo Estimado**: [15-25 minutos / 25-40 minutos / 40-60 minutos]
```

---

## Paso 6: Actualizar README principal

Agrega el ejercicio a la lista en `README.md` raiz.

## Paso 7: Commit

```bash
git add .
git commit -m "feat :sparkles: add [exercise-name] exercise (##)"
```

---

## Checklist Final

- [ ] Los 4 archivos creados con nombres exactos.
- [ ] Carpeta ubicada en `exercises/##-exercise-name/` con formato correcto.
- [ ] `test.js` importa `./exercise.js`.
- [ ] Tests FALLAN contra `exercise.js`.
- [ ] Tests PASAN contra `solution.js`.
- [ ] `exercise.js` NO contiene spoilers.
- [ ] `exercise.js` es sintacticamente valido.
- [ ] `solution.js` contiene comentarios `// IMPLEMENTADO:`.
- [ ] README.md sigue el formato Scrum.
- [ ] README.md NO tiene seccion de hints.
- [ ] README.md incluye tag de categoria.
- [ ] Toda documentacion en espanol, todo codigo en ingles.
- [ ] README.md principal actualizado.
