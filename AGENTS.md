# Guia para Agentes de IA

Este documento resume las convenciones criticas para trabajar en el repositorio `javascript-coding-exam`.

## Idioma

- **Documentacion** (README, comentarios de TODO, descripciones de tests, mensajes de commit): **Espanol**
- **Codigo** (nombres de variables, funciones, archivos internos): **Ingles**
- **NO mezclar**.

## Estructura de Carpetas

```
exercises/
  ##-exercise-name/
    README.md
    exercise.js
    solution.js
    test.js
```

- Carpetas: `##-exercise-name/` (dos digitos, minusculas, guiones).
- Archivos internos: siempre `README.md`, `exercise.js`, `solution.js`, `test.js`.

## Workflow TDD para Nuevos Ejercicios

1. **test.js** (RED): Define todos los comportamientos esperados.
2. **solution.js** (GREEN): Implementacion completa que pasa los tests.
3. **exercise.js**: Copia de `solution.js` con cuerpos vacios (`throw new Error('Not implemented')`) y comentarios `// TODO:`.
4. **README.md**: Formato Scrum definido en `EXERCISE_TEMPLATE.md`.
5. Actualizar `README.md` principal con el nuevo ejercicio.

## Reglas de Diseno

- Funciones tematicamente relacionadas (3-8 por ejercicio).
- `exercise.js` NO debe contener spoilers.
- `exercise.js` debe ser sintacticamente valido.
- `solution.js` debe tener comentarios `// IMPLEMENTADO:`.
- Tests en espanol, importan `./exercise.js`.
- README sin pistas ni pseudocodigo.

## QA Checklist

- [ ] Los 4 archivos creados con nombres exactos.
- [ ] Carpeta en `exercises/##-exercise-name/` con formato correcto.
- [ ] `test.js` importa `./exercise.js`.
- [ ] Tests FALLAN contra `exercise.js`.
- [ ] Tests PASAN contra `solution.js`.
- [ ] `exercise.js` es sintacticamente valido.
- [ ] README.md sigue el formato Scrum y no tiene hints.
- [ ] Documentacion en espanol, codigo en ingles.
- [ ] Commit: `feat :sparkles: add [name] exercise (##)`.

## Dependencias

- Unica devDependency: `jest`.
- Sin dependencias de produccion.
