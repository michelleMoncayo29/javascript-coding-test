/**
 * Pruebas para: Stock Portfolio Tracker
 *
 * Ejecutar con: npm test exercises/08-stock-portfolio-tracker
 */

const {
  Stock,
  Transaction,
  Portfolio,
  addTransaction,
  getCurrentPosition,
  calculateUnrealizedGain,
  calculateRealizedGain,
  getPortfolioAllocation,
  fetchCurrentPrices,
  getPriceAlerts,
  generatePerformanceReport,
  rebalancePortfolio,
} = require('./exercise.js');

describe('Stock Portfolio Tracker - Stock', () => {
  test('debe crear un stock con ticker en mayusculas', () => {
    const s = new Stock({ ticker: 'aapl', name: 'Apple', sector: 'Technology' });
    expect(s.ticker).toBe('AAPL');
    expect(s.sector).toBe('Technology');
  });
});

describe('Stock Portfolio Tracker - Transaction', () => {
  test('debe crear una transaccion con ticker en mayusculas', () => {
    const tx = new Transaction({ ticker: 'aapl', type: 'buy', quantity: 10, price: 150, date: '2024-01-15' });
    expect(tx.ticker).toBe('AAPL');
    expect(tx.type).toBe('buy');
    expect(tx.quantity).toBe(10);
  });
});

describe('Stock Portfolio Tracker - Portfolio', () => {
  test('debe inicializar con positions (Map) y watchlist (Set) vacios', () => {
    const p = new Portfolio('p1');
    expect(p.positions instanceof Map).toBe(true);
    expect(p.watchlist instanceof Set).toBe(true);
    expect(p.positions.size).toBe(0);
  });

  test('addToWatchlist y removeFromWatchlist deben gestionar el Set', () => {
    const p = new Portfolio('p1');
    p.addToWatchlist('TSLA');
    p.addToWatchlist('MSFT');
    expect(p.watchlist.has('TSLA')).toBe(true);
    p.removeFromWatchlist('TSLA');
    expect(p.watchlist.has('TSLA')).toBe(false);
    expect(p.watchlist.size).toBe(1);
  });
});

describe('Stock Portfolio Tracker - addTransaction', () => {
  test('debe agregar una compra al portfolio', () => {
    const p = new Portfolio('p1');
    const tx = new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 150, date: '2024-01-01' });
    addTransaction(p, tx);
    expect(p.positions.has('AAPL')).toBe(true);
    expect(p.positions.get('AAPL')).toHaveLength(1);
  });

  test('debe permitir multiples compras del mismo ticker', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 150, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 5, price: 160, date: '2024-02-01' }));
    expect(p.positions.get('AAPL')).toHaveLength(2);
  });

  test('debe lanzar error al vender mas acciones de las disponibles', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 5, price: 150, date: '2024-01-01' }));
    expect(() => {
      addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'sell', quantity: 10, price: 160, date: '2024-02-01' }));
    }).toThrow();
  });
});

describe('Stock Portfolio Tracker - getCurrentPosition', () => {
  test('debe calcular la cantidad y precio promedio ponderado correctamente', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 200, date: '2024-02-01' }));
    const pos = getCurrentPosition(p, 'AAPL');
    expect(pos.quantity).toBe(20);
    expect(pos.averageCost).toBe(150);
  });

  test('debe retornar cantidad 0 despues de vender todo', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'buy', quantity: 10, price: 200, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'sell', quantity: 10, price: 250, date: '2024-06-01' }));
    const pos = getCurrentPosition(p, 'MSFT');
    expect(pos.quantity).toBe(0);
  });

  test('debe retornar cantidad 0 para ticker sin transacciones', () => {
    const p = new Portfolio('p1');
    const pos = getCurrentPosition(p, 'NOPE');
    expect(pos.quantity).toBe(0);
  });
});

describe('Stock Portfolio Tracker - calculateUnrealizedGain', () => {
  test('debe calcular ganancia positiva cuando precio actual es mayor al costo', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    const result = calculateUnrealizedGain(p, { AAPL: 150 });
    expect(result.total).toBe(500);
    expect(result.positions[0].gain).toBe(500);
  });

  test('debe calcular perdida negativa cuando precio actual es menor al costo', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'TSLA', type: 'buy', quantity: 10, price: 200, date: '2024-01-01' }));
    const result = calculateUnrealizedGain(p, { TSLA: 150 });
    expect(result.total).toBe(-500);
  });

  test('debe excluir posiciones con cantidad 0', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'buy', quantity: 5, price: 100, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'sell', quantity: 5, price: 120, date: '2024-06-01' }));
    const result = calculateUnrealizedGain(p, { MSFT: 130 });
    expect(result.positions).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

describe('Stock Portfolio Tracker - calculateRealizedGain (FIFO)', () => {
  test('debe calcular ganancia realizada correctamente con metodo FIFO', () => {
    const p = new Portfolio('p1');
    // Compra 10 a $100 -> costo base $1000
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    // Compra 10 a $200 -> costo base $2000
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 200, date: '2024-02-01' }));
    // Vende 10 a $150 -> FIFO usa las primeras 10 a $100 -> ganancia = 10*(150-100) = 500
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'sell', quantity: 10, price: 150, date: '2024-06-01' }));
    const result = calculateRealizedGain(p);
    expect(result.total).toBe(500);
  });

  test('debe retornar total 0 si no hay ventas', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'GOOGL', type: 'buy', quantity: 5, price: 100, date: '2024-01-01' }));
    expect(calculateRealizedGain(p).total).toBe(0);
  });

  test('FIFO: venta parcial debe usar las compras mas antiguas primero', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'buy', quantity: 5, price: 100, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'buy', quantity: 5, price: 300, date: '2024-03-01' }));
    // Vende 3 acciones: FIFO usa las 3 mas antiguas a $100 -> ganancia = 3*(200-100) = 300
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'sell', quantity: 3, price: 200, date: '2024-06-01' }));
    const result = calculateRealizedGain(p);
    expect(result.total).toBe(300);
  });
});

describe('Stock Portfolio Tracker - getPortfolioAllocation', () => {
  test('debe calcular el porcentaje de cada posicion', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    const allocation = getPortfolioAllocation(p, { AAPL: 200, MSFT: 200 });
    const aapl = allocation.find(a => a.ticker === 'AAPL');
    expect(aapl.percentage).toBe(50);
  });

  test('debe retornar array vacio para portfolio sin posiciones activas', () => {
    const p = new Portfolio('p1');
    expect(getPortfolioAllocation(p, {})).toHaveLength(0);
  });
});

describe('Stock Portfolio Tracker - fetchCurrentPrices', () => {
  test('debe retornar un objeto con precios por ticker', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ price: 150 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ price: 300 }) });
    const prices = await fetchCurrentPrices(['AAPL', 'MSFT'], mockFetch);
    expect(prices.AAPL).toBe(150);
    expect(prices.MSFT).toBe(300);
  });

  test('debe lanzar error si algun fetch falla', async () => {
    const mockFetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ price: 150 }) })
      .mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchCurrentPrices(['AAPL', 'FAKE'], mockFetch)).rejects.toThrow();
  });
});

describe('Stock Portfolio Tracker - getPriceAlerts', () => {
  test('debe generar alerta above_high cuando precio supera el limite alto', () => {
    const p = new Portfolio('p1');
    p.addToWatchlist('AAPL');
    const thresholds = new Map([['AAPL', { low: 100, high: 200 }]]);
    const alerts = getPriceAlerts(p, { AAPL: 210 }, thresholds);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe('above_high');
  });

  test('debe generar alerta below_low cuando precio baja del limite bajo', () => {
    const p = new Portfolio('p1');
    p.addToWatchlist('TSLA');
    const thresholds = new Map([['TSLA', { low: 150, high: 300 }]]);
    const alerts = getPriceAlerts(p, { TSLA: 140 }, thresholds);
    expect(alerts[0].type).toBe('below_low');
  });

  test('no debe generar alertas si el precio esta dentro del rango', () => {
    const p = new Portfolio('p1');
    p.addToWatchlist('GOOGL');
    const thresholds = new Map([['GOOGL', { low: 100, high: 200 }]]);
    expect(getPriceAlerts(p, { GOOGL: 150 }, thresholds)).toHaveLength(0);
  });

  test('no debe generar alertas para tickers que no estan en la watchlist', () => {
    const p = new Portfolio('p1');
    const thresholds = new Map([['AMZN', { low: 100, high: 200 }]]);
    expect(getPriceAlerts(p, { AMZN: 50 }, thresholds)).toHaveLength(0);
  });
});

describe('Stock Portfolio Tracker - generatePerformanceReport', () => {
  test('debe identificar la mejor y peor posicion', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'TSLA', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    const stocks = [
      new Stock({ ticker: 'AAPL', name: 'Apple', sector: 'Technology' }),
      new Stock({ ticker: 'TSLA', name: 'Tesla', sector: 'Automotive' }),
    ];
    const report = generatePerformanceReport(p, { AAPL: 150, TSLA: 80 }, stocks);
    expect(report.best.ticker).toBe('AAPL');
    expect(report.worst.ticker).toBe('TSLA');
  });

  test('debe agrupar ganancias por sector', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    addTransaction(p, new Transaction({ ticker: 'MSFT', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    const stocks = [
      new Stock({ ticker: 'AAPL', name: 'Apple', sector: 'Technology' }),
      new Stock({ ticker: 'MSFT', name: 'Microsoft', sector: 'Technology' }),
    ];
    const report = generatePerformanceReport(p, { AAPL: 150, MSFT: 130 }, stocks);
    expect(report.bySector).toHaveProperty('Technology');
    expect(report.bySector.Technology.gain).toBeGreaterThan(0);
  });
});

describe('Stock Portfolio Tracker - rebalancePortfolio', () => {
  test('debe sugerir compras para sectores infraponderados', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 10, price: 100, date: '2024-01-01' }));
    const stocks = [
      new Stock({ ticker: 'AAPL', name: 'Apple', sector: 'Technology' }),
      new Stock({ ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' }),
    ];
    // 100% en tech, queremos 50% tech, 50% health -> debe sugerir comprar JNJ
    const result = rebalancePortfolio(p, { Technology: 50, Healthcare: 50 }, 1000, { AAPL: 100, JNJ: 50 }, stocks);
    expect(result.buy.some(b => b.ticker === 'JNJ')).toBe(true);
  });

  test('debe retornar un objeto con propiedades buy y sell', () => {
    const p = new Portfolio('p1');
    addTransaction(p, new Transaction({ ticker: 'AAPL', type: 'buy', quantity: 5, price: 100, date: '2024-01-01' }));
    const stocks = [new Stock({ ticker: 'AAPL', name: 'Apple', sector: 'Technology' })];
    const result = rebalancePortfolio(p, { Technology: 100 }, 0, { AAPL: 100 }, stocks);
    expect(result).toHaveProperty('buy');
    expect(result).toHaveProperty('sell');
  });
});
