const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

//SPOT account streaming
const { Spot } = require("@binance/connector");
const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const client = new Spot(apiKey, apiSecret);

//OPTION account streaming
const WebSocket = require("ws");

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
    router.post("/buy", this.buy.bind(this));
    return router;
  }

  async connectWallet(req, res) {
    let walletID = req.body.walletID;
    await this.Method.storeWalletID(walletID).catch((e) => {
      console.log("Can't add walletID to DB" + e);
      res.sendStatus(404);
    });
    res.end();
  }

  async getTransactionsRecord(req, res) {
    let walletID = req.body.walletID;

    let RawTransactionsRecord = await this.Method.getTransactionsRecord(
      walletID
    ).catch((e) => {
      console.log("Can't get transaction record from DB" + e);
      res.sendStatus(404);
    });

    let transactionsRecord = [];
    for (let each of RawTransactionsRecord) {
      transactionsRecord.push({
        Date: each.created_at.toLocaleString(),
        "Type of Transaction": each.tranxType,
        Asset: each.asset,
        "Expiry Date": each.expiryDate
          ? new Date(each.expiryDate).toLocaleString()
          : "N/A",
        QTY: each.quantity,
        "Price (USD)": each.price,
        Status: each.orderStatus,
      });
    }

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

    let response = await axios(requestConfig).catch((e) => {
      console.log("Can't get option info from binance " + e);
      res.sendStatus(404);
    });

    //Filter out contracts by underlying asset and "PUT"
    if (response.data.data[0]) {
      let filterQuote = response.data.data.filter((each) => {
        return (
          each.underlying.includes(req.body.underlying) && each.side == "PUT"
        );
      });

      //Sort contracts by closest desired expiry date
      if (filterQuote[0]) {
        let sortDate = filterQuote.sort((a, b) => {
          let diffA = Math.abs(req.body.expiryDate - a.expiryDate);
          let diffB = Math.abs(req.body.expiryDate - b.expiryDate);
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

        let index = await axios(indexRequestConfig).catch((e) => {
          console.log("Can't get index of underlying asset from binance " + e);
          res.sendStatus(404);
        });

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

        let markPrice = await axios(markPriceRequestConfig).catch((e) => {
          console.log("Can't get option price from binance " + e);
          res.sendStatus(404);
        });
        if (markPrice.data.data[0]) {
          if (req.body.quantity > sortStrike[0].maxQty) {
            res.send(
              JSON.stringify({
                "Total Cost":
                  markPrice.data.data[0].markPrice * sortStrike[0].maxQty,
                quantity: sortStrike[0].maxQty,
                "Contract Name": sortStrike[0].symbol,
                "Expiry Date": sortStrike[0].expiryDate,
                price: sortStrike[0].markPrice,
                // minQty: sortStrike[0].minQty,
                // maxQty: sortStrike[0].maxQty,
                "Protected Price": sortStrike[0].strikePrice,
                comment:
                  "Your quantity has been adjusted to the Maximum allowed quantity.",
              })
            );
          } else if (req.body.quantity < sortStrike[0].minQty) {
            res.send(
              JSON.stringify({
                "Total Cost":
                  markPrice.data.data[0].markPrice * sortStrike[0].minQty,
                Quantity: sortStrike[0].minQty,
                "Contract Name": sortStrike[0].symbol,
                "Expiry Date": sortStrike[0].expiryDate,
                price: sortStrike[0].markPrice,
                // minQty: sortStrike[0].minQty,
                // maxQty: sortStrike[0].maxQty,
                "Protected Price": sortStrike[0].strikePrice,
                comment:
                  "Your quantity has been adjusted to the Minimum allowed quantity.",
              })
            );
          } else {
            res.send(
              JSON.stringify({
                "Total Cost":
                  markPrice.data.data[0].markPrice * req.body.quantity,
                Quantity: req.body.quantity,
                "Contract Name": sortStrike[0].symbol,
                "Expiry Date": sortStrike[0].expiryDate,
                price: sortStrike[0].markPrice,
                // minQty: sortStrike[0].minQty,
                // maxQty: sortStrike[0].maxQty,
                "Protected Price": sortStrike[0].strikePrice,
              })
            );
          }
        } else {
          res.send("Result not found");
        }
      } else {
        res.send("Result not found");
      }
    } else {
      res.send("Result not found");
    }
  }

  async buy(req, res) {
    let count = 0;
    //Add temp deposit record for cross checking
    let userID = await this.Method.getUserID(req.body.walletID).catch((e) => {
      console.log("Can't find userID from DB " + e);
      res.sendStatus(404);
    });

    let transaction = JSON.stringify({
      tranxType: "Depoist",
      exchange: "BINANCE",
      exchangeOrderID: null,
      asset: req.body.depositAsset,
      expiryDate: null,
      orderSide: null,
      orderType: null,
      quantity: req.body.depositQuantity,
      price: req.body.depositQuantity,
      currency: "USD",
      orderStatus: "Pending",
      userID: userID,
    });

    let id = await this.Method.addTransactionsRecord(transaction).catch((e) => {
      console.log("Can't add transaction record " + e);
      res.sendStatus(404);
    });

    // Generate account streaming listening key

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

    let listenKey = await axios(requestConfig).catch((e) => {
      console.log("Can't get listenKey from binance spot ac " + e);
      res.sendStatus(404);
    });

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

    setInterval(async function () {
      if (count < 121) {
        count++;
        //Match activities with request deposit amount
        if (accountActivities[0]) {
          for (each of accountActivities) {
            if ((each.d = req.body.depositQuantity)) {
              let transactions = await client
                .depositHistory({
                  coin: req.body.depositAsset,
                  status: 1,
                })
                .catch((e) => {
                  console.log("Can't get deposit history " + e);
                  res.sendStatus(404);
                });

              if (transactions.data[0]) {
                let filterTransaction = transactions.data.filter((x) => {
                  return (x.amount = req.body.depositQuantity);
                });

                if (filterTransaction[0]) {
                  let txID = filterTransaction[0].txId;
                  //Search transaction history of the request walletID
                  let url = await GenerateURL(
                    process.env.URL_BSC,
                    "/api",
                    `module=account&action=txlist&address=${req.body.walletID}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.API_KEY_BSC}`,
                    null
                  );

                  let requestConfig = {
                    method: "post",
                    url: url,
                  };

                  let sendingAddress = await axios(requestConfig).catch((e) => {
                    console.log(
                      "Can't get transaction history from BSC scan " + e
                    );
                    res.sendStatus(404);
                  });

                  //Match deposit transaction by txID
                  let findMatch = sendingAddress.data.result.filter((x) => {
                    return x.hash == txID;
                  });

                  if (findMatch[0]) {
                    await this.Method.updateDepositStatus(id).catch((e) => {
                      console.log("Can't update deposit status from DB " + e);
                      res.sendStatus(404);
                    });

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

                    let response = await axios(requestConfig).catch((e) => {
                      console.log(
                        "Can't move deposit from spot to option " + e
                      );
                      res.sendStatus(404);
                    });
                    if (response.data.msg == "success") {
                      //Buy options
                      let queryString = `symbol=${
                        req.body.symbol
                      }&side=BUY&type=LIMIT&quantity=${
                        req.body.quantity
                      }&price=${
                        req.body.price
                      }&recvWindow=20000&timestamp=${Date.now()}`;

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

                      let response = await axios(requestConfig).catch((e) => {
                        console.log("Fail to buy " + e);
                        res.sendStatus(404);
                      });

                      let transaction = JSON.stringify({
                        tranxType: "Option",
                        exchange: "BINANCE",
                        asset: req.body.symbol,
                        expiryDate: req.body.expiryDate,
                        orderSide: "BUY",
                        orderType: "LIMIT",
                        quantity: req.body.quantity,
                        price: req.body.price,
                        currency: "USD",
                        orderStatus: "Pending",
                        userID: userID,
                      });

                      let DBOrderID = await this.Method.addTransactionsRecord(
                        transaction
                      ).catch((e) => {
                        console.log("Can't add transaction record " + e);
                        res.sendStatus(404);
                      });

                      //Check order status
                      if (response.data) {
                        let orderID = response.data.data.id;

                        await this.Method.updateOrderStatus(
                          DBOrderID,
                          orderID,
                          "Accept"
                        ).catch((e) => {
                          console.log("Can't add transaction record " + e);
                          res.sendStatus(404);
                        });

                        let queryString = `recvWindow=20000&timestamp=${Date.now()}`;

                        let signature = await GenerateSignature(
                          queryString,
                          process.env.TEST_SECRET_KEY
                        );

                        let url = await GenerateURL(
                          process.env.TEST_URL,
                          "/vapi/v1/userDataStream",
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

                        let listenKey = await axios(requestConfig).catch(
                          (e) => {
                            console.log(
                              "Can't fetch listenkey of option ac" + e
                            );
                            res.sendStatus(404);
                          }
                        );

                        const ws = new WebSocket(
                          `wss://testnetws.binanceops.com/ws/${listenKey.data.data.listenKey}`
                        );

                        ws.on("open", () => {
                          ws.send(
                            JSON.stringify({
                              method: "BINARY",
                              params: ["false"],
                              id: 1,
                            })
                          );
                        });

                        ws.on("message", async (data) => {
                          if (data.toString().length > 100) {
                            if (
                              JSON.parse(data.toString()).e ===
                                "ORDER_TRADE_UPDATE" &&
                              JSON.parse(data.toString()).o[0].oid ===
                                orderID &&
                              JSON.parse(data.toString()).o[0].s === 5
                            ) {
                              await this.Method.updateOrderStatus(
                                DBOrderID,
                                orderID,
                                "Filled"
                              ).catch((e) => {
                                console.log(
                                  "Can't add transaction record " + e
                                );
                                res.sendStatus(404);
                              });

                              ws.close();
                              res.end("Purchase is successful");
                            } else if (count > 120) {
                              accountActivities = [];
                              res.end(
                                "Order has been accepted by the exchange, waiting for it to be filled. Please check your transactions pages for updates."
                              );
                            }
                          }
                        });
                      } else if (count > 120) {
                        accountActivities = [];
                        res.end(
                          "We received the deposit, but fail to execute the order with exchange, please try agan."
                        );
                      }
                    } else if (count > 120) {
                      accountActivities = [];
                      res.end(
                        "We received the deposit, but fail to execute the order with exchange, please try agan."
                      );
                    }
                  } else if (count > 60) {
                    accountActivities = [];
                    res.end(
                      "Not able to locate the deposit, please contact us!"
                    );
                  }
                } else if (count > 60) {
                  accountActivities = [];
                  res.end("Not able to locate the deposit, please contact us!");
                }
              } else if (count > 60) {
                accountActivities = [];
                res.end("Not able to locate the deposit, please contact us!");
              }
            } else if (count > 60) {
              accountActivities = [];
              res.end("Not able to locate the deposit, please contact us!");
            }
          }
        } else if (!accountActivities[0] && count > 60) {
          res.end("Not able to locate the deposit, please contact us!");
        }
      } else {
        clearInterval();
      }
    }, 1000);
  }
}
module.exports = Router;
