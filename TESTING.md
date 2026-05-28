# Guia de Testing con Jest

Este documento explica como usar Jest en el proyecto `javascript-coding-exam` y como interpretar los resultados de los tests.

## Instalacion

Jest ya esta configurado como dependencia de desarrollo. Solo ejecuta:

```bash
npm install
```

## Comandos

| Comando                              | Descripcion                                    |
|--------------------------------------|------------------------------------------------|
| `npm test`                           | Ejecuta todos los tests del proyecto           |
| `npm test exercises/##-name`         | Ejecuta tests de un ejercicio especifico       |
| `npm run test:watch`                 | Modo watch: re-ejecuta tests al guardar cambios |

## Workflow de Desarrollo

1. Abre el ejercicio que deseas resolver.
2. Lee `README.md` para entender el problema.
3. Abre `exercise.js` y lee los comentarios `// TODO`.
4. Implementa la primera funcion.
5. Ejecuta los tests para ese ejercicio.
6. Si fallan, lee el mensaje de error, corrige y repite.
7. Cuando todos los tests pasen, el ejercicio esta completo.

## Interpretar Resultados

### PASS

```
PASS  exercises/01-gradebook-manager/test.js
```

Todos los tests pasaron. Tu implementacion es correcta.

### FAIL

```
FAIL  exercises/01-gradebook-manager/test.js

  Gradebook Manager - calculateAverage
    x debe calcular el promedio de [10, 20, 30] correctamente (5 ms)

    Expected: 20
    Received: undefined
```

Uno o mas tests fallaron. El mensaje indica:
- Que funcion fallo.
- Que resultado se esperaba (`Expected`).
- Que resultado recibio (`Received`).

### Errores de sintaxis

Si ves un error de parseo, verifica que `exercise.js` sea JavaScript valido (no haya llaves sin cerrar, comillas desbalanceadas, etc.).

## Matchers Comunes

| Matcher              | Uso                                      |
|----------------------|------------------------------------------|
| `toBe(valor)`        | Para primitivos (numeros, strings, bools) |
| `toEqual(objeto)`    | Para objetos y arrays (comparacion profunda) |
| `toBeCloseTo(n, d)`  | Para decimales (d = decimales de precision) |
| `toThrow()`          | Para verificar que una funcion lanza error |

## Consejos

- Implementa una funcion a la vez.
- Lee el mensaje de error completo antes de cambiar codigo.
- Usa `console.log()` dentro de tus funciones para depurar (aparecera en la salida de Jest).
- Si te atascas, revisa `solution.js` solo despues de intentarlo por tu cuenta.
