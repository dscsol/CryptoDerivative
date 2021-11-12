const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

//SPOT
const { Spot } = require("@binance/connector");
const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const client = new Spot(apiKey, apiSecret);

//OPTION account Auth and URL endpoint
async function GenerateSignature(queryString, apiSecret) {
  return crypto
    .createHmac("sha256", apiSecret)
    .update(queryString)
    .digest("hex");
}

async function GenerateURL(url, endpoint, queryString, signature) {
  if (queryString && signature) {
    return `${url}${endpoint}?${queryString}&signature=${signature}`;
  } else if (!queryString && !signature) {
    return `${url}${endpoint}`;
  } else if (queryString && !signature) {
    return `${url}${endpoint}?${queryString}`;
  } else if (signature && !queryString) {
    return `${url}${endpoint}?signature=${signature}`;
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
    router.get("/account", this.OptionAccountBalance.bind(this));
    router.post("/quote", this.getPrice.bind(this));
    router.get("/buy", this.buy.bind(this));
    router.get("/test", this.test.bind(this));
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

  async OptionAccountBalance(req, res) {
    let queryString = `recvWindow=20000&timestamp=${Date.now()}`;
    let signature = await GenerateSignature(
      queryString,
      process.env.SECRET_KEY
    );
    let url = await GenerateURL(
      process.env.URL_OPTION,
      "/vapi/v1/account",
      queryString,
      signature
    );
    let requestConfig = {
      method: "get",
      url: url,
      headers: {
        "X-MBX-APIKEY": `${process.env.API_KEY}`,
      },
    };
    let response = await axios(requestConfig);
    console.log(response.data);
    res.send(response.data.data);
  }

  async getPrice(req, res) {
    console.log("req.body: ", req.body);
    let asset = req.body.underlying;
    let quantity = req.body.quantity;
    let date = req.body.expiryDate;
    console.log(asset, " ", quantity, " ", date);
    //Get all contract
    let url = await GenerateURL(
      process.env.URL_OPTION,
      "/vapi/v1/optionInfo",
      "",
      ""
    );
    let requestConfig = {
      method: "get",
      url: url,
    };
    let response = await axios(requestConfig);
    //Filter out contracts by underlying asset and "PUT"
    let filterQuote = response.data.data.filter((each) => {
      return each.underlying.includes(asset) && each.side == "PUT";
    });

    //Sort contracts by closest desired expiry date
    let sortDate = filterQuote.sort((a, b) => {
      let diffA = Math.abs(date - a.expiryDate);
      let diffB = Math.abs(date - b.expiryDate);
      return diffA - diffB;
    });

    // Get current underlying asset market price
    let indexQueryString = `underlying=${sortDate[0].underlying}`;
    let indexUrl = await GenerateURL(
      process.env.URL_OPTION,
      "/vapi/v1/index",
      indexQueryString,
      null
    );
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
      process.env.URL_OPTION,
      "/vapi/v1/mark",
      markPriceQueryString,
      null
    );
    let markPriceRequestConfig = {
      method: "get",
      url: markPriceUrl,
    };
    let markPrice = await axios(markPriceRequestConfig);
    let cost = markPrice.data.data[0].markPrice * quantity;
    let expiryDate = sortStrike[0].expiryDate;
    let symbol = sortStrike[0].symbol;
    let price = sortStrike[0].markPrice;
    res.send(
      JSON.stringify({
        cost: cost,
        symbol: symbol,
        expiryDate: expiryDate,
        price: price,
      })
    );
  }

  async buy(req, res) {
    //Add temp deposit record for cross checking
    let userID = await this.Method.getUserID(req.body.walletID);
    let transaction = JSON.stringify({
      tranxType: "deposit",
      exchange: "binance",
      exchangeOrderID: null,
      asset: req.body.depositAsset,
      expiryDate: null,
      orderSide: null,
      orderType: null,
      quantity: req.body.depositQuantity,
      price: req.body.depositQuantity,
      currency: "USD",
      orderStatus: "pending",
      userID: userID,
    });
    let id = await this.Method.addTransactionsRecord(transaction);
    // Generate account streaming listening key
    let time = Date.now();
    let url = await GenerateURL(
      process.env.URL_SPOT,
      "/api/v3/userDataStream",
      null,
      null
    );
    let requestConfig = {
      method: "post",
      url: url,
      headers: {
        "X-MBX-APIKEY": `${process.env.API_KEY}`,
      },
    };
    let listenKey = await axios(requestConfig);
    //Listen to account activitiese
    let accountActivities = [];
    const callbacks = {
      open: () => client.logger.debug("open"),
      close: () => client.logger.debug("closed"),
      message: (data) => {
        client.logger.log(data);
        accountActivities.push(JSON.parse(data));
      },
    };
    const screamAC = client.userData(listenKey.data.listenKey, callbacks);
    setTimeout(() => client.unsubscribe(screamAC), 60000);
    //Match activities with request deposit amount
    if (accountActivities[0]) {
      for (each of accountActivities) {
        if ((each.d = req.body.depositQuantity)) {
          let transactions = await client.depositHistory({
            coin: req.body.depositAsset,
            status: 1,
          });
          let filterTransaction = transactions.data.filter((x) => {
            return (x.amount = req.body.depositQuantity);
          });
          let txID = filterTransaction[0].txId;
          //Search transaction history of the request walletID
          let urlBSC = await GenerateURL(
            process.env.URL_BSC,
            "/api",
            `module=account&action=txlist&address=${req.body.walletID}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.API_KEY_BSC}`,
            null
          );
          let requestConfigBSC = {
            method: "post",
            url: urlBSC,
          };
          let sendingAddress = await axios(requestConfigBSC);
          //Match deposit transaction by txID
          let findMatch = sendingAddress.data.result.filter((x) => {
            return x.hash == txID;
          });
          if (findMatch[0]) {
            await this.Method.updateDepositStatus(id);
            //Move deposit from spot to option account
            let queryString = `currency=${
              req.body.depositAsset
            }&type=IN&amount=${
              req.body.depositQuantity
            }&recvWindow=20000&timestamp=${Date.now()}`;
            let signature = await GenerateSignature(
              queryString,
              process.env.SECRET_KEY
            );
            let url = await GenerateURL(
              process.env.URL_OPTION,
              "/vapi/v1/transfer",
              queryString,
              signature
            );
            let requestConfig = {
              method: "post",
              url: url,
              headers: {
                "X-MBX-APIKEY": `${process.env.API_KEY}`,
              },
            };
            let response = await axios(requestConfig);
            if (response.data.msg == "success") {
              //Buy options
              console.log("buy");
            }
            accountActivities = [];
          } else if (Date.now() > time + 60000) {
            res.send("transaction timeout");
          }
        } else if (Date.now() > time + 60000) {
          accountActivities = [];
          res.send("transaction timeout");
        }
      }
    } else if (!accountActivities[0] && Date.now() > time + 60000) {
      accountActivities = [];
      res.send("transaction timeout");
    }
  }

  async test(req, res) {
    // let queryString = `recvWindow=20000&timestamp=${Date.now()}`;
    // let signature = await GenerateSignature(
    //   queryString,
    //   process.env.TEST_SECRET_KEY
    // );
    // let url = await GenerateURL(
    //   process.env.TEST_URL,
    //   "/vapi/v1/account",
    //   queryString,
    //   signature
    // );
    // let requestConfig = {
    //   method: "get",
    //   url: url,
    //   headers: {
    //     "X-MBX-APIKEY": `${process.env.TEST_API_KEY}`,
    //   },
    // };
    // let response = await axios(requestConfig);
    // console.log(response.data.data);

    let queryString = `symbol=${req.body.symbol}&side=BUY&type=LIMIT&quantity=${
      req.body.symbolQuantity
    }&price=${req.body.symbolPrice}&recvWindow=20000&timestamp=${Date.now()}`;

    let signature = await GenerateSignature(
      queryString,
      process.env.TEST_SECRET_KEY
    );

    let url = await GenerateURL(
      process.env.TEST_URL,
      "/vapi/v1/order",
      queryString,
      signature
    );

    let requestConfig = {
      method: "post",
      url: url,
      headers: {
        "X-MBX-APIKEY": `${process.env.TEST_API_KEY}`,
      },
    };

    console.log(requestConfig);
    // let response = await axios(requestConfig);
    // console.log(response.data.data);
  }
}
module.exports = Router;
