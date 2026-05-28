/**
 * Pet Breed API Explorer
 *
 * Modulo para consumir y cachear datos de razas de mascotas desde una API externa.
 * API utilizada: Dog CEO API (https://dog.ceo/api)
 */

// TODO: Hace fetch al endpoint https://dog.ceo/api/breeds/list/all
// Si la respuesta no es ok (response.ok === false), lanza un Error con el status HTTP.
// Retorna un array con los nombres de las razas (las claves del objeto data.message).
async function fetchBreedList() {
  throw new Error('Not implemented');
}

// TODO: Hace fetch a la imagen aleatoria de una raza: https://dog.ceo/api/breed/{breed}/images/random
// Si la respuesta no es ok, lanza un Error.
// Retorna la URL de la imagen (data.message).
async function fetchRandomBreedImage(breed) {
  throw new Error('Not implemented');
}

// TODO: Hace fetch de imagenes para multiples razas en paralelo usando Promise.allSettled.
// Recibe: breeds (array de strings).
// Para cada raza llama a fetchRandomBreedImage.
// Retorna un array de objetos: { breed: string, imageUrl: string|null, error: string|null }
//   - Si el fetch fue exitoso: imageUrl = URL, error = null.
//   - Si fallo: imageUrl = null, error = mensaje del error.
// La promesa principal NUNCA debe rechazarse aunque fallen peticiones individuales.
async function fetchMultipleBreedImages(breeds) {
  throw new Error('Not implemented');
}

// TODO: Ejecuta fetchFn() y reintenta hasta maxRetries veces si lanza error.
// Recibe: fetchFn (funcion que retorna una promesa), maxRetries (numero, por defecto 3).
// Entre cada reintento espera: 100ms * 2^intentoActual (backoff exponencial).
// Si todos los intentos fallan, lanza el ultimo error recibido.
async function fetchWithRetry(fetchFn, maxRetries = 3) {
  throw new Error('Not implemented');
}

// TODO: Crea y retorna un objeto con un fetcher que tiene cache TTL y deduplicacion.
// Recibe: ttlMs (milisegundos de vida del cache, por defecto 60000).
// Debe retornar un objeto con los metodos:
//
//   fetchCached(url): hace fetch a la URL con cache.
//     - Si la URL esta en cache y no expiró: retorna el dato cacheado directamente.
//     - Si hay un request en vuelo al mismo URL: retorna esa misma promesa (sin nuevo fetch).
//     - Si no hay cache ni request en vuelo: hace fetch, cachea el resultado, limpia inFlight.
//
//   invalidate(url): elimina la entrada del cache e inFlight para esa URL.
//
//   getCacheSize(): retorna la cantidad de entradas en cache.
//
//   getInFlightCount(): retorna la cantidad de requests actualmente en vuelo.
//
// Usa un Map para el cache (clave: url, valor: { data, expiresAt })
// y otro Map para los requests en vuelo (clave: url, valor: Promise).
function createBreedCache(ttlMs = 60000) {
  throw new Error('Not implemented');
}

// TODO: Obtiene la lista completa de razas y retorna las N con mayor numero de sub-razas.
// Hace fetch a https://dog.ceo/api/breeds/list/all
// El objeto data.message tiene forma: { raza: ['sub1', 'sub2', ...] }
// Ordena de mayor a menor por numero de sub-razas y retorna los primeros n elementos.
// Cada elemento del resultado: { breed: string, subBreedCount: number }
async function getTopBreedsBySubBreeds(n) {
  throw new Error('Not implemented');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchBreedList,
    fetchRandomBreedImage,
    fetchMultipleBreedImages,
    fetchWithRetry,
    createBreedCache,
    getTopBreedsBySubBreeds,
  };
}
