const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();
const apiSecret = process.env.SECRET_KEY;
const timestamp = Date.now().toString();

async function GenerateSignature(queryString) {
  return crypto
    .createHmac("sha256", apiSecret)
    .update(queryString)
    .digest("hex");
}

async function GenerateURL(endpoint, queryString, signature) {
  if (queryString && signature) {
    return `${process.env.URL}${endpoint}?${queryString}&signature=${signature}`;
  } else if (!queryString && !signature) {
    return `${process.env.URL}${endpoint}`;
  } else if (queryString && !signature) {
    return `${process.env.URL}${endpoint}?${queryString}`;
  } else if (signature && !queryString) {
    return `${process.env.URL}${endpoint}?signature=${signature}`;
  }
}

class Router {
  constructor(Method) {
    this.Method = Method;
  }
  router() {
    const router = express.Router();
    router.post("/connectWallet", this.connectWallet.bind(this));
    router.post("/getTransactions", this.getTransactionsRecord.bind(this));
    router.post("/addTransaction", this.addTransaction.bind(this));
    router.get("/account", this.accountBalance.bind(this));
    router.post("/quote", this.getPrice.bind(this));
    return router;
  }

  async connectWallet(req, res) {
    let walletID = req.body.walletID;
    await this.Method.storeWalletID(walletID);
    res.end();
  }

  async getTransactionsRecord(req, res) {
    let walletID = req.body.walletID;
    let transactionsRecord = await this.Method.getTransactionsRecord(walletID);
    res.send(transactionsRecord);
    res.end();
  }

  async addTransaction(req, res) {
    let walletID = req.body.walletID;
    let transaction = JSON.stringify(req.body.transaction);
    await this.Method.purchaseRecord(transaction, walletID);
    res.end();
  }

  async accountBalance(req, res) {
    let queryString = `recvWindow=60000&timestamp=${timestamp}`;
    let signature = await GenerateSignature(queryString);
    let url = await GenerateURL("/vapi/v1/account", queryString, signature);
    let requestConfig = {
      method: "get",
      url: url,
      headers: {
        "X-MBX-APIKEY": `${process.env.API_KEY}`,
      },
    };
    let response = await axios(requestConfig);
    res.send(response.data.data[0]);
  }

  async getPrice(req, res) {
    console.log("req.body: ", req.body);
    let asset = req.body.underlying;
    let quantity = req.body.quantity;
    let date = req.body.expiryDate;

    //Get all contract
    let url = await GenerateURL("/vapi/v1/optionInfo", "", "");
    console.log(url);

    let requestConfig = {
      method: "get",
      url: url,
    };
    let response = await axios(requestConfig);
    //Filter out contracts by underlying asset and "CALL"
    let filterQuote = response.data.data.filter((each) => {
      return each.underlying.includes(asset) && each.side == "CALL";
    });

    //Sort contracts by closest desired expiry date
    let sortDate = filterQuote.sort((a, b) => {
      let diffA = Math.abs(date - a.expiryDate);
      let diffB = Math.abs(date - b.expiryDate);
      return diffA - diffB;
    });

    // Get current underlying asset market price
    let indexQueryString = `underlying=${sortDate[0].underlying}`;
    let indexUrl = await GenerateURL("/vapi/v1/index", indexQueryString, "");
    let indexRequestConfig = {
      method: "get",
      url: indexUrl,
    };
    let index = await axios(indexRequestConfig);

    //Sort contracts by closest strikeprice to market price
    let sortStrike = sortDate.sort((a, b) => {
      let diffA = Math.abs(index.data.data.indexPrice - a.strikePrice);
      let diffB = Math.abs(index.data.data.indexPrice - b.strikePrice);
      return diffA - diffB;
    });
    //Get protection cost
    let markPriceQueryString = `symbol=${sortStrike[0].symbol}`;
    let markPriceUrl = await GenerateURL(
      "/vapi/v1/mark",
      markPriceQueryString,
      ""
    );
    let markPriceRequestConfig = {
      method: "get",
      url: markPriceUrl,
    };
    let markPrice = await axios(markPriceRequestConfig);
    let cost = markPrice.data.data[0].markPrice * quantity;
    let expiryDate = sortStrike[0].expiryDate;
    res.send(JSON.stringify({ cost: cost, expiryDate: expiryDate }));
    // res.end();
  }

  async transferToOption(req, res) {
    let asset = req.body.asset;
    let quantity = req.body.quantity;
    let walletID = req.body.walletID;
    let userID = await this.Method.getUserID(walletID);
    let queryString = `currency=USDT&type=IN&amount=${quantity}&recvWindow=20000&timestamp=${timestamp}`;
    let signature = await GenerateSignature(queryString);
    let url = await GenerateURL("/vapi/v1/transfer", queryString, signature);
    let requestConfig = {
      method: "post",
      url: url,
      headers: {
        "X-MBX-APIKEY": `${process.env.API_KEY}`,
      },
    };
    let response = await axios(requestConfig);

    let data = {
      tranxType: "TRANSFER",
      exchange: "BINANCE",
      exchangeOrderID: response.data.data,
      asset: asset,
      expiryDate: "n/a",
      orderSide: "n/a",
      orderType: "n/a",
      quantity: quantity,
      price: "n/a",
      currency: "n/a",
      orderStatus: response.data.msg,
      userID: userID,
    };

    await this.Method.getUserID(data);
    res.end();
  }
}
module.exports = Router;
