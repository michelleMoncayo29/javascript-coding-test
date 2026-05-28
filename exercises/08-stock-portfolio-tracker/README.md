# Stock Portfolio Tracker

**Categoria**: Clases, Map, Set, Logic, API Integration, Algoritmos

## Historia de Usuario

Como desarrollador de una plataforma de inversiones, necesito un modulo que gestione una cartera de acciones con compras y ventas, calculo de ganancias no realizadas y realizadas usando el metodo FIFO, distribucion por sector, alertas de precio mediante watchlist, y un algoritmo de rebalanceo que sugiera que comprar y vender para alcanzar los porcentajes objetivo por sector.

## Criterios de Aceptacion

- El sistema debe usar un `Map<ticker, Transaction[]>` para almacenar posiciones y un `Set` para la watchlist.
- `addTransaction` debe validar que no se puede vender mas acciones de las disponibles.
- `getCurrentPosition` debe calcular el precio promedio ponderado de compra correctamente.
- `calculateRealizedGain` debe usar el metodo FIFO: al vender, el costo base corresponde a las compras mas antiguas.
- `getPortfolioAllocation` debe retornar el porcentaje de cada posicion sobre el valor total.
- `fetchCurrentPrices` debe hacer todas las peticiones en paralelo con `Promise.all`.
- Las alertas de precio solo deben generarse para tickers presentes en la watchlist.
- `rebalancePortfolio` debe sugerir compras/ventas en cantidades enteras de acciones.

## Tarea

Implementa las clases y funciones exportadas en `exercise.js`. No modifiques los nombres ni las firmas.

**Comportamiento esperado**:
- Comprar 10 AAPL a $100, luego 10 AAPL a $200 -> `getCurrentPosition` debe retornar `{ quantity: 20, averageCost: 150 }`
- Comprar 10 MSFT a $100, comprar 5 a $300, vender 3 a $200 -> FIFO usa las 3 mas antiguas a $100 -> ganancia `300`
- `calculateRealizedGain` con solo compras debe retornar `total: 0`
- `addTransaction` de venta con mas acciones de las disponibles debe lanzar un `Error`
- `getPriceAlerts` no debe retornar alertas para tickers fuera de la watchlist

## Archivos

- `exercise.js` - Implementa tus soluciones aqui
- `test.js` - Tests para validar tu implementacion (NO editar)
- `solution.js` - Solucion de referencia (revisar SOLO despues de intentarlo)

## Como Verificar tu Solucion

```bash
npm test exercises/08-stock-portfolio-tracker
```

Todos los tests deben pasar (PASS) para considerar el ejercicio completado.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 70-90 minutos
