/**
 * Stock Portfolio Tracker
 *
 * Modulo para gestionar una cartera de inversiones con transacciones de compra/venta,
 * calculo de costos FIFO, reportes de rendimiento y rebalanceo.
 */

// TODO: Clase para representar un activo financiero.
// Constructor: { ticker, name, sector }
// Debe normalizar ticker a mayusculas.
class Stock {
  constructor({ ticker, name, sector }) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para representar una transaccion de compra o venta.
// Constructor: { ticker, type ('buy'|'sell'), quantity, price, date }
// Debe normalizar ticker a mayusculas y convertir date a Date.
class Transaction {
  constructor({ ticker, type, quantity, price, date }) {
    throw new Error('Not implemented');
  }
}

// TODO: Clase para gestionar la cartera.
// Constructor: id (string)
// Debe inicializar:
//   this.positions: Map<ticker, Transaction[]> para almacenar las transacciones por ticker.
//   this.watchlist: Set<ticker> para los activos monitoreados.
// Metodo addToWatchlist(ticker): agrega ticker al Set (en mayusculas).
// Metodo removeFromWatchlist(ticker): elimina ticker del Set.
class Portfolio {
  constructor(id) {
    throw new Error('Not implemented');
  }

  addToWatchlist(ticker) {
    throw new Error('Not implemented');
  }

  removeFromWatchlist(ticker) {
    throw new Error('Not implemented');
  }
}

// TODO: Agrega una transaccion al portfolio.
// Si es una venta, verificar que getCurrentPosition tenga suficientes acciones; si no, lanzar Error.
// Agregar la transaccion al array del ticker en portfolio.positions.
function addTransaction(portfolio, transaction) {
  throw new Error('Not implemented');
}

// TODO: Retorna la posicion actual de un ticker.
// Recibe: portfolio, ticker (string).
// Recorre las transacciones cronologicamente:
//   buy: suma quantity, acumula costo total.
//   sell: resta quantity y ajusta el costo total en proporcion al precio promedio actual.
// Retorna: { ticker, quantity, averageCost } (averageCost redondeado a 2 decimales).
// Si el ticker no tiene transacciones, retornar { ticker, quantity: 0, averageCost: 0 }.
function getCurrentPosition(portfolio, ticker) {
  throw new Error('Not implemented');
}

// TODO: Calcula la ganancia no realizada de todas las posiciones.
// Para cada ticker con quantity > 0:
//   gain = (currentPrices[ticker] - averageCost) * quantity
//   gainPercent = (gain / (averageCost * quantity)) * 100
// Retorna: { positions: [{ticker, quantity, gain, gainPercent}], total }
// Excluir posiciones con quantity = 0.
function calculateUnrealizedGain(portfolio, currentPrices) {
  throw new Error('Not implemented');
}

// TODO: Calcula la ganancia realizada usando el metodo FIFO (First In, First Out).
// Para cada ticker: ordenar transacciones por fecha ascendente.
//   buy: agregar a una cola FIFO con { quantity, price }.
//   sell: consumir de la cola comenzando por los lotes mas antiguos para calcular el costo base.
//         ganancia = precioVenta * cantidadVendida - costoBase
// Retorna: { details: [{ticker, realized}], total }
// Omitir tickers sin ventas del array details.
function calculateRealizedGain(portfolio) {
  throw new Error('Not implemented');
}

// TODO: Retorna el porcentaje de cada posicion respecto al valor total de la cartera.
// Valor de posicion = quantity * currentPrices[ticker]
// Retorna: [{ ticker, value, percentage }] (percentage redondeado a 2 decimales).
// Excluir posiciones con quantity 0.
function getPortfolioAllocation(portfolio, currentPrices) {
  throw new Error('Not implemented');
}

// TODO: Hace fetch del precio actual de multiples tickers en paralelo (Promise.all).
// URL por ticker: https://api.stocks.mock/price/{ticker}
// Cada respuesta tiene forma: { price: number }
// Si alguna respuesta no es ok, lanza un Error.
// Retorna un objeto: { TICKER: price, ... }
// Recibe fetchFn como segundo parametro (por defecto fetch global).
async function fetchCurrentPrices(tickers, fetchFn = fetch) {
  throw new Error('Not implemented');
}

// TODO: Retorna alertas de precio para los tickers en la watchlist del portfolio.
// Recibe: portfolio, currentPrices { TICKER: price }, thresholds Map<ticker, { low, high }>.
// Para cada ticker en watchlist:
//   Si currentPrices[ticker] <= limits.low: alerta tipo 'below_low'.
//   Si currentPrices[ticker] >= limits.high: alerta tipo 'above_high'.
// Cada alerta: { ticker, type, price, limit }
// No generar alerta para tickers sin threshold o sin precio.
function getPriceAlerts(portfolio, currentPrices, thresholds) {
  throw new Error('Not implemented');
}

// TODO: Genera un reporte de rendimiento de la cartera.
// Recibe: portfolio, currentPrices, stocks (array de Stock para obtener sectores).
// Retorna:
//   best: posicion con mayor gainPercent
//   worst: posicion con menor gainPercent
//   bySector: { [sector]: { gain: number, tickers: string[] } }
//   totalUnrealizedGain: number
// Si no hay posiciones activas, retornar { best: null, worst: null, bySector: {}, totalUnrealizedGain: 0 }.
function generatePerformanceReport(portfolio, currentPrices, stocks) {
  throw new Error('Not implemented');
}

// TODO: Calcula que comprar y que vender para alcanzar los porcentajes objetivo por sector.
// Recibe: portfolio, targetAllocations { sector: percentage },
//         budget (presupuesto adicional disponible), currentPrices, stocks.
// Logica:
//   totalPortfolioValue = valor actual de la cartera + budget.
//   Para cada sector: calcular la diferencia entre el valor objetivo y el actual.
//     Si hay deficit (+): sugerir compras distribuidas entre los tickers del sector.
//     Si hay exceso (-): sugerir ventas (sin vender mas de lo disponible).
//   Usar Math.floor para calcular la cantidad de acciones (enteros).
// Retorna: { buy: [{ticker, quantity, estimatedCost}], sell: [{ticker, quantity, estimatedProceeds}] }
function rebalancePortfolio(portfolio, targetAllocations, budget, currentPrices, stocks) {
  throw new Error('Not implemented');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
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
  };
}
