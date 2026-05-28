/**
 * Pruebas para: Pet Breed API Explorer
 *
 * Ejecutar con: npm test exercises/05-pet-breed-api
 *
 * Nota: Todos los tests usan mocks de fetch. No se realizan llamadas reales a la API.
 */

const {
  fetchBreedList,
  fetchRandomBreedImage,
  fetchMultipleBreedImages,
  fetchWithRetry,
  createBreedCache,
  getTopBreedsBySubBreeds,
} = require('./exercise.js');

// Helper para crear un mock de Response exitoso
function mockResponse(data, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  };
}

describe('Pet Breed API - fetchBreedList', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('debe retornar un array con los nombres de las razas', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      message: { labrador: [], poodle: ['miniature', 'toy'], beagle: [] },
      status: 'success',
    }));
    const breeds = await fetchBreedList();
    expect(Array.isArray(breeds)).toBe(true);
    expect(breeds).toContain('labrador');
    expect(breeds).toContain('poodle');
  });

  test('debe lanzar error si la respuesta HTTP no es ok', async () => {
    global.fetch.mockResolvedValue(mockResponse({}, false, 500));
    await expect(fetchBreedList()).rejects.toThrow();
  });
});

describe('Pet Breed API - fetchRandomBreedImage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('debe retornar la URL de imagen de una raza', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      message: 'https://dog.ceo/api/img/labrador/n02099712_123.jpg',
      status: 'success',
    }));
    const url = await fetchRandomBreedImage('labrador');
    expect(typeof url).toBe('string');
    expect(url).toContain('labrador');
  });

  test('debe llamar al endpoint correcto con el nombre de la raza', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: 'https://img.jpg', status: 'success' }));
    await fetchRandomBreedImage('beagle');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('beagle'));
  });

  test('debe lanzar error si la respuesta no es ok', async () => {
    global.fetch.mockResolvedValue(mockResponse({}, false, 404));
    await expect(fetchRandomBreedImage('razafalsa')).rejects.toThrow();
  });
});

describe('Pet Breed API - fetchMultipleBreedImages', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('debe retornar un resultado por cada raza solicitada', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: 'https://img.jpg', status: 'success' }));
    const results = await fetchMultipleBreedImages(['labrador', 'poodle', 'beagle']);
    expect(results).toHaveLength(3);
  });

  test('debe incluir la propiedad breed en cada resultado', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: 'https://img.jpg', status: 'success' }));
    const results = await fetchMultipleBreedImages(['labrador']);
    expect(results[0].breed).toBe('labrador');
    expect(results[0]).toHaveProperty('imageUrl');
    expect(results[0]).toHaveProperty('error');
  });

  test('debe manejar fallos parciales: exitosos con imageUrl, fallidos con error', async () => {
    global.fetch
      .mockResolvedValueOnce(mockResponse({ message: 'https://ok.jpg', status: 'success' }))
      .mockResolvedValueOnce(mockResponse({}, false, 404))
      .mockResolvedValueOnce(mockResponse({ message: 'https://ok2.jpg', status: 'success' }));
    const results = await fetchMultipleBreedImages(['labrador', 'razafake', 'poodle']);
    expect(results[0].imageUrl).toBe('https://ok.jpg');
    expect(results[0].error).toBeNull();
    expect(results[1].imageUrl).toBeNull();
    expect(results[1].error).not.toBeNull();
    expect(results[2].imageUrl).toBe('https://ok2.jpg');
  });

  test('no debe rechazar la promesa principal aunque fallen peticiones individuales', async () => {
    global.fetch.mockResolvedValue(mockResponse({}, false, 500));
    await expect(fetchMultipleBreedImages(['a', 'b', 'c'])).resolves.toHaveLength(3);
  });
});

describe('Pet Breed API - fetchWithRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('debe retornar el resultado si el primer intento es exitoso', async () => {
    const mockFn = jest.fn().mockResolvedValue('resultado');
    const promise = fetchWithRetry(mockFn, 3);
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBe('resultado');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('debe reintentar hasta maxRetries veces si falla', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('fallo 1'))
      .mockRejectedValueOnce(new Error('fallo 2'))
      .mockResolvedValue('exito');
    const promise = fetchWithRetry(mockFn, 3);
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBe('exito');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('debe lanzar el ultimo error si todos los intentos fallan', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('siempre falla'));
    const promise = fetchWithRetry(mockFn, 2);
    jest.runAllTimers();
    await expect(promise).rejects.toThrow('siempre falla');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});

describe('Pet Breed API - createBreedCache', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('debe retornar datos del cache en la segunda llamada al mismo URL', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: { labrador: [] } }));
    const { fetchCached } = createBreedCache(60000);
    const url = 'https://dog.ceo/api/breeds/list/all';
    await fetchCached(url);
    await fetchCached(url);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('getCacheSize debe reflejar las entradas cacheadas', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: {} }));
    const { fetchCached, getCacheSize } = createBreedCache(60000);
    await fetchCached('https://url1.com');
    await fetchCached('https://url2.com');
    expect(getCacheSize()).toBe(2);
  });

  test('invalidate debe eliminar la entrada del cache', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: {} }));
    const { fetchCached, invalidate, getCacheSize } = createBreedCache(60000);
    const url = 'https://url1.com';
    await fetchCached(url);
    invalidate(url);
    expect(getCacheSize()).toBe(0);
  });

  test('debe hacer nuevo fetch si el TTL expiro', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: {} }));
    const { fetchCached } = createBreedCache(100);
    const url = 'https://url1.com';
    await fetchCached(url);
    jest.advanceTimersByTime(200);
    await fetchCached(url);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('dos llamadas concurrentes al mismo URL solo deben hacer un fetch', async () => {
    let resolveFetch;
    const fetchPromise = new Promise(resolve => { resolveFetch = resolve; });
    global.fetch.mockReturnValue(fetchPromise.then(() => mockResponse({ message: {} })));
    const { fetchCached } = createBreedCache(60000);
    const url = 'https://url1.com';
    const p1 = fetchCached(url);
    const p2 = fetchCached(url);
    resolveFetch();
    await Promise.all([p1, p2]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('Pet Breed API - getTopBreedsBySubBreeds', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('debe retornar las N razas con mas sub-razas, ordenadas descendente', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      message: {
        poodle: ['miniature', 'toy', 'standard'],
        bulldog: ['english', 'french'],
        labrador: [],
        spaniel: ['cocker', 'springer'],
      },
      status: 'success',
    }));
    const top = await getTopBreedsBySubBreeds(2);
    expect(top).toHaveLength(2);
    expect(top[0].breed).toBe('poodle');
    expect(top[0].subBreedCount).toBe(3);
    expect(top[1].subBreedCount).toBeLessThanOrEqual(top[0].subBreedCount);
  });

  test('cada elemento debe tener breed y subBreedCount', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      message: { labrador: [], poodle: ['toy'] },
      status: 'success',
    }));
    const top = await getTopBreedsBySubBreeds(2);
    expect(top[0]).toHaveProperty('breed');
    expect(top[0]).toHaveProperty('subBreedCount');
  });
});
