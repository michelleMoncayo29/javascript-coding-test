# javascript-coding-exam

Coleccion de ejercicios practicos de programacion nivel basico/intermedio disenados para desarrollar algoritmos mas complejos. Cada ejercicio es un pequeno "examen" donde el estudiante recibe un modulo con funciones vacias (solo firmas y comentarios `// TODO`) y debe implementar la logica para satisfacer los tests automatizados.

**Filosofia**: TDD invertido. Los tests ya estan escritos; el estudiante escribe el codigo.

---

## Requisitos

- [Node.js](https://nodejs.org/) >= 14.0.0
- npm (viene con Node.js)

## Instalacion

```bash
npm install
```

## Uso

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests de un ejercicio especifico

```bash
npm test exercises/01-gradebook-manager
```

### Modo watch (para desarrollo)

```bash
npm run test:watch
```

---

## Estructura del Proyecto

```
javascript-coding-exam/
|
├── exercises/              # Todos los ejercicios
│   ├── 01-gradebook-manager/
│   │   ├── README.md       # Descripcion del ejercicio
│   │   ├── exercise.js     # Funciones vacias / TODO (el estudiante edita ESTE archivo)
│   │   ├── solution.js     # Implementacion de referencia completa
│   │   └── test.js         # Tests Jest
│   └── ...
|
├── AGENTS.md               # Guia para agentes IA
├── README.md               # Este archivo
├── STRUCTURE.md            # Convenciones de estructura y nomenclatura
├── EXERCISE_TEMPLATE.md    # Plantilla para crear nuevos ejercicios
├── TESTING.md              # Guia de testing con Jest
├── package.json            # Configuracion de Node.js y Jest
└── .gitignore              # Reglas de Git
```

---

## Categorias de Ejercicios

| Categoria         | Descripcion                                              |
|-------------------|----------------------------------------------------------|
| Strings           | Manipulacion, parsing, validacion, transformacion de texto |
| Arrays            | Filtrado, mapeo, reduccion, busqueda, ordenamiento       |
| Numbers           | Matematicas, secuencias, conversiones, redondeos         |
| Objects           | Manipulacion de estructuras, agrupacion, claves/valores  |
| Recursion         | Algoritmos recursivos (factorial, fibonacci, arboles)    |
| Sorting-Searching | Algoritmos clasicos de ordenamiento y busqueda           |
| Logic             | Condicionales complejas, maquinas de estado, reglas de negocio |
| API Integration   | Consumo de APIs externas con fetch (ejercicios avanzados) |

---

## Niveles de Dificultad

| Rango   | Nivel       |
|---------|-------------|
| 01-09   | Principiante |
| 10-19   | Intermedio   |
| 20-29   | Avanzado     |
| 30+     | Expertos     |

---

## Ejercicios Disponibles

| #  | Nombre                   | Categoria                          | Nivel              | Tiempo Est.   |
|----|--------------------------|------------------------------------|--------------------|---------------|
| 01 | Gradebook Manager        | Arrays, Objects, Numbers           | Intermedio         | 25-40 min     |
| 02 | Insurance Policy Manager | Clases, Herencia, Operadores, Logic| Intermedio-Avanzado| 40-60 min     |
| 03 | Body Metrics Tracker     | Clases, Operadores, Metodos, Numbers| Intermedio        | 35-50 min     |
| 04 | Vet Clinic System        | Clases, Map, Set, Logic, Algoritmos| Avanzado           | 50-70 min     |
| 05 | Pet Breed API            | API Integration, Async, Closures   | Avanzado           | 50-70 min     |
| 06 | Gym Membership Engine    | Clases, Herencia, Map, Async, Logic| Avanzado           | 60-90 min     |
| 07 | Real Estate Rental       | Clases, Algoritmos, Fechas, Logic  | Avanzado           | 75-90 min     |
| 08 | Stock Portfolio Tracker  | Clases, Map, Set, FIFO, Algoritmos | Avanzado           | 75-90 min     |
| 09 | Event Ticketing Platform | Clases, Set, Map, Logic, Algoritmos| Avanzado           | 75-90 min     |
| 10 | Hospital Scheduling      | Clases, Algoritmos, API, Fechas    | Avanzado           | 90-120 min    |

---

## Flujo de Trabajo para el Estudiante

1. Lee el `README.md` del ejercicio.
2. Abre `exercise.js` y lee los comentarios `// TODO`.
3. Implementa cada funcion.
4. Ejecuta `npm test exercises/##-exercise-name` para verificar.
5. Repite hasta que todos los tests pasen.
6. (Opcional) Compara tu solucion con `solution.js`.

---

## Contribuir

Para agregar nuevos ejercicios, consulta `EXERCISE_TEMPLATE.md` y `STRUCTURE.md`.

---

## Licencia

MIT
