/**
 * Pet Breed API Explorer
 *
 * Module for fetching and caching pet breed data from external APIs.
 * Uses Dog CEO API (https://dog.ceo/api) as the data source.
 */

// IMPLEMENTADO: Fetch simple con manejo de error HTTP.
async function fetchBreedList() {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return Object.keys(data.message);
}

// IMPLEMENTADO: Fetch de imagen aleatoria para una raza.
// Retorna la URL de la imagen.
async function fetchRandomBreedImage(breed) {
  const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return data.message;
}

// IMPLEMENTADO: Fetch de varias razas en paralelo con Promise.allSettled.
// Retorna un array de { breed, imageUrl, error } donde error puede ser null.
async function fetchMultipleBreedImages(breeds) {
  const results = await Promise.allSettled(
    breeds.map(breed => fetchRandomBreedImage(breed))
  );
  return results.map((result, index) => ({
    breed: breeds[index],
    imageUrl: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null,
  }));
}

// IMPLEMENTADO: Fetch con reintentos. Espera backoff exponencial entre intentos.
// maxRetries = numero de reintentos (no incluyendo el primer intento).
// Delay entre reintentos: 100ms * 2^intentoActual (pero en tests usamos mock de fetch, no hay delay real).
async function fetchWithRetry(fetchFn, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

// IMPLEMENTADO: Factory que crea un fetcher con cache TTL y deduplicacion de requests.
// - cache: Map<url, { data, expiresAt }>
// - inFlight: Map<url, Promise> para deduplicar requests concurrentes al mismo URL.
// - Si el recurso esta en cache y no ha expirado: retorna el dato cacheado.
// - Si hay un request en vuelo al mismo URL: retorna esa promesa (no hace nuevo fetch).
// - Si no: hace el fetch, guarda en cache, y limpia inFlight al resolver.
function createBreedCache(ttlMs = 60000) {
  const cache = new Map();
  const inFlight = new Map();

  async function fetchCached(url) {
    const now = Date.now();

    if (cache.has(url)) {
      const entry = cache.get(url);
      if (now < entry.expiresAt) return entry.data;
      cache.delete(url);
    }

    if (inFlight.has(url)) return inFlight.get(url);

    const promise = fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        cache.set(url, { data, expiresAt: Date.now() + ttlMs });
        inFlight.delete(url);
        return data;
      })
      .catch(err => {
        inFlight.delete(url);
        throw err;
      });

    inFlight.set(url, promise);
    return promise;
  }

  function invalidate(url) {
    cache.delete(url);
    inFlight.delete(url);
  }

  function getCacheSize() {
    return cache.size;
  }

  function getInFlightCount() {
    return inFlight.size;
  }

  return { fetchCached, invalidate, getCacheSize, getInFlightCount };
}

// IMPLEMENTADO: Combina datos de multiples razas y retorna las N razas con
// la mayor cantidad de sub-razas disponibles en la API.
// El objeto de la API tiene forma: { labrador: [], poodle: ['miniature','toy'], ... }
async function getTopBreedsBySubBreeds(n) {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return Object.entries(data.message)
    .map(([breed, subBreeds]) => ({ breed, subBreedCount: subBreeds.length }))
    .sort((a, b) => b.subBreedCount - a.subBreedCount)
    .slice(0, n);
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
