import request from "request";
import { cachettl } from "./cachettl.js";
import nodeCache from "node-cache";

export const coinsCache = new nodeCache({
  stdTTL: cacheTtlMillisToSeconds(),
  checkperiod: cacheTtlMillisToSeconds(),
});
export const apiCallURLAllCoinsList = `https://min-api.cryptocompare.com/data/all/coinlist`;
export const externalAPICallLogMessage = `An external API Call was executed`;

/**
 * Get coin names collection from coinsCollection data, according to symbols param.
**/
export function getCoinsCollectionBySymbols(coinsCollection, symbols) {
  let coinsNamesCollection = [];
  let objectKeysArray = Object.keys(coinsCollection);
  objectKeysArray.forEach((objKey) => {
    if (symbols.includes(coinsCollection[objKey].Symbol)) {
      coinsNamesCollection.push(coinsCollection[objKey].CoinName);
    }
  });
  return coinsNamesCollection;
}

/**
 * Get coin names collection from coinsCollection data, according to algorithm param.
**/
export function getCoinsCollectionByAlgorithm(coinsCollection, algorithm) {
  let coinsNamesCollection = [];
  let objectKeysArray = Object.keys(coinsCollection);

  objectKeysArray.forEach((objKey) => {
    if (coinsCollection[objKey].Algorithm == algorithm) {
      coinsNamesCollection.push(coinsCollection[objKey].CoinName);
    }
  });

  return coinsNamesCollection;
}

/**
 * Get coin names collection from coinsCollection data.
**/
export function getCoinsCollectionNames(coinsCollection) {
  let coinsNamesCollection = [];
  let objectKeysArray = Object.keys(coinsCollection);

  objectKeysArray.forEach(function (objKey) {
    coinsNamesCollection.push(coinsCollection[objKey].CoinName);
  });

  return coinsNamesCollection;
}

/**
 * Create coin JSON by symbol param
**/
export function createCoinBySymbol(symbol, coinsCollection, coinUSDPrice) {
  for (var currentCoinKey in coinsCollection) {
    if (symbol == coinsCollection[currentCoinKey].Symbol) {

      return createCoin(
        coinsCollection[currentCoinKey].Id,
        coinsCollection[currentCoinKey].Symbol,
        coinsCollection[currentCoinKey].CoinName,
        coinsCollection[currentCoinKey].Algorithm,
        coinUSDPrice
      );
    }
  }
}

/**
 * Create coin JSON
**/
function createCoin(idInput, symboInput, coinNameInput, algorithmInput, toUSDInput) {
  return {
    id: idInput,
    symbol: symboInput,
    coinName: coinNameInput,
    algorithm: algorithmInput,
    toUSD: toUSDInput,
  };
}

/**
 * Request coins data from external API
**/
export function requestExternalApiCoinsData() {
  return new Promise((resolve, reject) => {
    request.get(apiCallURLAllCoinsList, (error, response, body) => {
      console.log(externalAPICallLogMessage);
      try {
        resolve(JSON.parse(body).Data);
      } catch (error) {
        reject({ message: error.message });
      }
    });
  });
}

/**
 * Request coin price data from external API
**/
export function requestExternalApiCoinsPriceData(symbol) {
  return new Promise((resolve, reject) => {
    let apiCallURLCoinsPrice = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbol}&tsyms=USD`;
    request.get(apiCallURLCoinsPrice, (error, response, body) => {
      console.log(externalAPICallLogMessage);
      try {
        resolve(JSON.parse(body)[symbol]["USD"]);
      } catch (error) {
        reject({ message: "Coin symbol does not exist" });
      }
    });
  });
}

/**
 * Get cacheTTL in seconds
**/
function cacheTtlMillisToSeconds() {
  return cachettl / 1000;
}


/**
 * Store coin in cache memory
**/
export function storeCoinInCache(coin) {
  coinsCache.set(coin.symbol, coin, cacheTtlMillisToSeconds());
}
