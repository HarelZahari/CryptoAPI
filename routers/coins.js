import express from "express";
import request from "request";
import {
  requestExternalApiCoinsData, requestExternalApiCoinsPriceData, storeCoinInCache, getCoinsCollectionNames,
  getCoinsCollectionByAlgorithm, getCoinsCollectionBySymbols, createCoinBySymbol, coinsCache, apiCallURLAllCoinsList, externalAPICallLogMessage
} from "./coinsUtils.js"
import { isClientMiddleware } from "../middlewares/validators.js"

const router = express.Router();


/**
 * Get coinName List include query by symbol or algorithm.
 * (requires at least client privilege - Autohrization: x-admin-key or x-client-key)
**/
router.get("/", isClientMiddleware ,async (req, res) => {
  try {
    let symbols = req.query.symbol;
    let algorithm = req.query.algorithm;

    request.get(apiCallURLAllCoinsList, (error, response, body) => {
      try {
        console.log(externalAPICallLogMessage);
        if (error) {
          //Server Error
          res.status(500).json({ message: error.message });
        }

        let coinsCollection = JSON.parse(body).Data;

        if (!symbols && !algorithm) {
          res.status(200).json(getCoinsCollectionNames(coinsCollection));
        }
        if (algorithm) {
          res
            .status(200)
            .json(getCoinsCollectionByAlgorithm(coinsCollection, algorithm));
        }
        if (symbols) {
          symbols = symbols.split(",");
          res
            .status(200)
            .json(getCoinsCollectionBySymbols(coinsCollection, symbols));
        }
      } catch (error) {
        //Server Error
        res.status(500).json({ message: error.message });
      }
    });
  } catch (error) {
    //Server Error
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get full description of coin by symbol param.
 * (requires at least client privilege - Autohrization: x-admin-key or x-client-key)  
**/
router.get("/:symbol", isClientMiddleware ,async (req, res) => {
  try {
    let symbol = req.params.symbol;

    let cacheHitValue = coinsCache.get(symbol);
    if (cacheHitValue != undefined) {
      res.status(200).json(cacheHitValue);
      storeCoinInCache(cacheHitValue)
    } else {
      Promise.all([
        requestExternalApiCoinsData(),
        requestExternalApiCoinsPriceData(symbol),
      ]).then((messages) => {
        let coinObject = createCoinBySymbol(symbol, messages[0], messages[1]);
        storeCoinInCache(coinObject)
        res.status(200).json(coinObject);
      }).catch((error) => {
        res.status(500).json({ message: error.message });
      });
    }
  } catch (error) {
    //Server Error
    res.status(500).json({ message: error.message });
  }
});

export default router;
