# Estructura y Convenciones

Este documento describe la organizacion del proyecto y las convenciones de nomenclatura para humanos y agentes de IA.

## Estructura de Carpetas

```
javascript-coding-exam/
|
├── exercises/                          # Todos los ejercicios
│   │
│   ├── 01-gradebook-manager/           # Ejercicio individual
│   │   ├── README.md                   # Descripcion del ejercicio
│   │   ├── exercise.js                 # Funciones vacias / TODO (el estudiante edita ESTE archivo)
│   │   ├── solution.js                 # Implementacion de referencia completa
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
├── AGENTS.md                           # Guia para agentes IA
├── README.md                           # Documentacion principal del proyecto
├── STRUCTURE.md                        # Este archivo
├── EXERCISE_TEMPLATE.md                # Plantilla detallada para crear nuevos ejercicios
├── TESTING.md                          # Guia de testing con Jest
├── package.json                        # Configuracion de Node.js y Jest
└── .gitignore                          # Reglas de Git
```

## Convenciones de Nombres

### Carpetas de ejercicios

- Formato: `##-exercise-name/`
- Dos digitos secuenciales: `01-`, `02-`, ...
- Minusculas, palabras separadas por guiones
- Nombres descriptivos y memorables (2-4 palabras)
- Ejemplo: `01-gradebook-manager/`, `02-string-manipulator/`, `03-api-fetcher/`

### Archivos dentro de cada ejercicio

- `exercise.js` — Siempre el mismo nombre. Es el archivo del estudiante.
- `solution.js` — Siempre el mismo nombre. Referencia para el educador.
- `test.js` — Siempre el mismo nombre. Tests Jest.
- `README.md` — Siempre el mismo nombre. Documentacion del ejercicio.

## Idioma

- **Documentacion** (README, comentarios, descripciones de tests, mensajes de commit): **Espanol**
- **Codigo** (nombres de variables, nombres de funciones, logica, nombres de archivos internos): **Ingles**
- **NO mezclar**: La documentacion orientada al estudiante es 100% espanol. El codigo fuente es 100% ingles.
