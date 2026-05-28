# Pet Breed API Explorer

**Categoria**: API Integration, Async/Await, Closures

## Historia de Usuario

Como desarrollador de la aplicacion veterinaria, necesito un modulo que consuma la API publica de Dog CEO para obtener listas de razas e imagenes, con soporte de reintentos automaticos, manejo de errores parciales en peticiones en paralelo, y un sistema de cache con TTL para evitar hacer llamadas redundantes a la API y deduplicar requests concurrentes al mismo recurso.

## Criterios de Aceptacion

- El sistema debe hacer fetch a la API de Dog CEO para obtener razas e imagenes.
- El sistema debe lanzar un error descriptivo si la respuesta HTTP no es exitosa.
- El sistema debe poder hacer fetch de multiples razas en paralelo, tolerando fallos parciales.
- El sistema debe poder reintentar una peticion fallida con backoff exponencial.
- El sistema de cache debe evitar llamadas repetidas dentro del TTL.
- El sistema de cache debe deduplicar requests concurrentes al mismo URL.
- El sistema debe poder listar las razas con mas sub-razas disponibles.

## Tarea

Implementa las funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- `fetchBreedList()` debe retornar un array de strings con nombres de razas
- `fetchMultipleBreedImages(['labrador', 'razafake'])` debe resolver (no rechazar) y retornar error en el item fallido
- `fetchWithRetry(fn, 2)` donde `fn` falla 2 veces y luego tiene exito, debe retornar el resultado exitoso llamando `fn` 3 veces
- `createBreedCache(ttl).fetchCached(url)` llamado dos veces al mismo URL solo debe hacer un fetch real
- Dos llamadas concurrentes a `fetchCached(url)` solo deben generar un fetch real (deduplicacion)

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Nota

Los tests usan `jest.fn()` para simular fetch. No se hacen llamadas reales a internet durante los tests.
Para probar manualmente con la API real puedes crear un archivo temporal y llamar a las funciones directamente con `node`.

## Como Verificar tu Solucion

```bash
npm test exercises/05-pet-breed-api
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 50-70 minutos
