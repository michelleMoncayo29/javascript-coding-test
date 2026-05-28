/**
 * Stock Portfolio Tracker
 *
 * Module for managing an investment portfolio with buy/sell transactions,
 * FIFO cost basis, performance reporting, and rebalancing.
 */

class Stock {
  constructor({ ticker, name, sector }) {
    this.ticker = ticker.toUpperCase();
    this.name = name;
    this.sector = sector;
  }
}

class Transaction {
  constructor({ ticker, type, quantity, price, date }) {
    this.ticker = ticker.toUpperCase();
    this.type = type; // 'buy' | 'sell'
    this.quantity = quantity;
    this.price = price;
    this.date = new Date(date);
  }
}

// IMPLEMENTADO: Portfolio usa Map<ticker, Transaction[]> para posiciones
// y Set<ticker> para la watchlist.
class Portfolio {
  constructor(id) {
    this.id = id;
    this.positions = new Map(); // ticker -> Transaction[]
    this.watchlist = new Set();
    this.realizedGains = [];
  }

  addToWatchlist(ticker) {
    this.watchlist.add(ticker.toUpperCase());
  }

  removeFromWatchlist(ticker) {
    this.watchlist.delete(ticker.toUpperCase());
  }
}

// IMPLEMENTADO: Agrega una transaccion al portfolio.
// Si es una venta, valida que haya suficientes acciones disponibles.
function addTransaction(portfolio, transaction) {
  const ticker = transaction.ticker;
  if (!portfolio.positions.has(ticker)) portfolio.positions.set(ticker, []);
  const txs = portfolio.positions.get(ticker);

  if (transaction.type === 'sell') {
    const position = getCurrentPosition(portfolio, ticker);
    if (position.quantity < transaction.quantity) {
      throw new Error(`Insufficient shares: have ${position.quantity}, selling ${transaction.quantity}`);
    }
  }

  txs.push(transaction);
}

// IMPLEMENTADO: Retorna la posicion actual: cantidad y precio promedio ponderado de compra.
function getCurrentPosition(portfolio, ticker) {
  const txs = portfolio.positions.get(ticker.toUpperCase()) ?? [];
  let quantity = 0;
  let totalCost = 0;

  for (const tx of txs) {
    if (tx.type === 'buy') {
      totalCost += tx.quantity * tx.price;
      quantity += tx.quantity;
    } else {
      const avgPrice = quantity > 0 ? totalCost / quantity : 0;
      totalCost -= tx.quantity * avgPrice;
      quantity -= tx.quantity;
    }
  }

  return {
    ticker: ticker.toUpperCase(),
    quantity,
    averageCost: quantity > 0 ? parseFloat((totalCost / quantity).toFixed(2)) : 0,
  };
}

// IMPLEMENTADO: Ganancia no realizada = (precioActual - costoPromedio) * cantidad.
function calculateUnrealizedGain(portfolio, currentPrices) {
  const result = [];
  let total = 0;

  for (const [ticker] of portfolio.positions) {
    const pos = getCurrentPosition(portfolio, ticker);
    if (pos.quantity === 0) continue;
    const currentPrice = currentPrices[ticker] ?? 0;
    const gain = (currentPrice - pos.averageCost) * pos.quantity;
    const gainPercent = pos.averageCost > 0
      ? parseFloat(((gain / (pos.averageCost * pos.quantity)) * 100).toFixed(2))
      : 0;
    result.push({ ticker, quantity: pos.quantity, gain: parseFloat(gain.toFixed(2)), gainPercent });
    total += gain;
  }

  return { positions: result, total: parseFloat(total.toFixed(2)) };
}

// IMPLEMENTADO: Ganancia realizada usando metodo FIFO.
// Por cada venta, el costo base corresponde a las compras mas antiguas primero.
function calculateRealizedGain(portfolio) {
  let totalRealized = 0;
  const details = [];

  for (const [ticker, txs] of portfolio.positions) {
    const buyQueue = [];
    let tickerRealized = 0;

    const sorted = [...txs].sort((a, b) => a.date - b.date);

    for (const tx of sorted) {
      if (tx.type === 'buy') {
        buyQueue.push({ quantity: tx.quantity, price: tx.price });
      } else {
        let remaining = tx.quantity;
        let costBasis = 0;
        while (remaining > 0 && buyQueue.length > 0) {
          const oldest = buyQueue[0];
          const used = Math.min(oldest.quantity, remaining);
          costBasis += used * oldest.price;
          oldest.quantity -= used;
          remaining -= used;
          if (oldest.quantity === 0) buyQueue.shift();
        }
        const gain = tx.quantity * tx.price - costBasis;
        tickerRealized += gain;
      }
    }

    if (tickerRealized !== 0) {
      details.push({ ticker, realized: parseFloat(tickerRealized.toFixed(2)) });
      totalRealized += tickerRealized;
    }
  }

  return { details, total: parseFloat(totalRealized.toFixed(2)) };
}

// IMPLEMENTADO: Retorna el porcentaje de cada posicion respecto al valor total de la cartera.
function getPortfolioAllocation(portfolio, currentPrices) {
  let totalValue = 0;
  const values = [];

  for (const [ticker] of portfolio.positions) {
    const pos = getCurrentPosition(portfolio, ticker);
    if (pos.quantity === 0) continue;
    const value = pos.quantity * (currentPrices[ticker] ?? 0);
    values.push({ ticker, value });
    totalValue += value;
  }

  return values.map(({ ticker, value }) => ({
    ticker,
    value: parseFloat(value.toFixed(2)),
    percentage: totalValue > 0 ? parseFloat(((value / totalValue) * 100).toFixed(2)) : 0,
  }));
}

// IMPLEMENTADO: Fetch de precios para multiples tickers en paralelo.
async function fetchCurrentPrices(tickers, fetchFn = fetch) {
  const results = await Promise.all(
    tickers.map(async ticker => {
      const res = await fetchFn(`https://api.stocks.mock/price/${ticker}`);
      if (!res.ok) throw new Error(`HTTP error for ${ticker}: ${res.status}`);
      const data = await res.json();
      return { ticker: ticker.toUpperCase(), price: data.price };
    })
  );
  return results.reduce((acc, { ticker, price }) => {
    acc[ticker] = price;
    return acc;
  }, {});
}

// IMPLEMENTADO: Retorna alertas para posiciones de la watchlist que superaron un umbral de cambio.
// thresholds: Map<ticker, { low: number, high: number }> (precios limites)
function getPriceAlerts(portfolio, currentPrices, thresholds) {
  const alerts = [];
  for (const ticker of portfolio.watchlist) {
    const price = currentPrices[ticker];
    const limits = thresholds.get(ticker);
    if (price === undefined || !limits) continue;
    if (price <= limits.low) alerts.push({ ticker, type: 'below_low', price, limit: limits.low });
    if (price >= limits.high) alerts.push({ ticker, type: 'above_high', price, limit: limits.high });
  }
  return alerts;
}

// IMPLEMENTADO: Genera un reporte de rendimiento: mejor/peor posicion y desglose por sector.
function generatePerformanceReport(portfolio, currentPrices, stocks) {
  const unrealized = calculateUnrealizedGain(portfolio, currentPrices);
  if (unrealized.positions.length === 0) {
    return { best: null, worst: null, bySector: {}, totalUnrealizedGain: 0 };
  }

  const sorted = [...unrealized.positions].sort((a, b) => b.gainPercent - a.gainPercent);
  const bySector = {};

  for (const pos of unrealized.positions) {
    const stock = stocks.find(s => s.ticker === pos.ticker);
    const sector = stock?.sector ?? 'Unknown';
    if (!bySector[sector]) bySector[sector] = { gain: 0, tickers: [] };
    bySector[sector].gain += pos.gain;
    bySector[sector].tickers.push(pos.ticker);
  }

  Object.values(bySector).forEach(s => {
    s.gain = parseFloat(s.gain.toFixed(2));
  });

  return {
    best: sorted[0],
    worst: sorted[sorted.length - 1],
    bySector,
    totalUnrealizedGain: unrealized.total,
  };
}

// IMPLEMENTADO: Calcula que comprar/vender para alcanzar los porcentajes objetivo.
// targetAllocations: { sector: percentage (0-100) }
// Retorna: { buy: [{ticker, quantity, estimatedCost}], sell: [{ticker, quantity, estimatedProceeds}] }
// Logica: primero calcula el valor objetivo por sector, luego distribuye entre los tickers del sector.
function rebalancePortfolio(portfolio, targetAllocations, budget, currentPrices, stocks) {
  const allocation = getPortfolioAllocation(portfolio, currentPrices);
  const totalPortfolioValue = allocation.reduce((s, a) => s + a.value, 0) + budget;

  const sectorCurrentValue = {};
  for (const { ticker, value } of allocation) {
    const stock = stocks.find(s => s.ticker === ticker);
    const sector = stock?.sector ?? 'Unknown';
    sectorCurrentValue[sector] = (sectorCurrentValue[sector] ?? 0) + value;
  }

  const transactions = { buy: [], sell: [] };

  for (const [sector, targetPct] of Object.entries(targetAllocations)) {
    const targetValue = totalPortfolioValue * (targetPct / 100);
    const currentValue = sectorCurrentValue[sector] ?? 0;
    const diff = targetValue - currentValue;

    const sectorTickers = stocks
      .filter(s => s.sector === sector)
      .map(s => s.ticker)
      .filter(t => portfolio.positions.has(t) || diff > 0);

    if (sectorTickers.length === 0) continue;
    const perTicker = diff / sectorTickers.length;

    for (const ticker of sectorTickers) {
      const price = currentPrices[ticker] ?? 0;
      if (price === 0) continue;
      const shares = Math.floor(Math.abs(perTicker) / price);
      if (shares === 0) continue;
      if (perTicker > 0) {
        transactions.buy.push({ ticker, quantity: shares, estimatedCost: parseFloat((shares * price).toFixed(2)) });
      } else {
        const pos = getCurrentPosition(portfolio, ticker);
        const sellShares = Math.min(shares, pos.quantity);
        if (sellShares > 0) {
          transactions.sell.push({ ticker, quantity: sellShares, estimatedProceeds: parseFloat((sellShares * price).toFixed(2)) });
        }
      }
    }
  }

  return transactions;
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
