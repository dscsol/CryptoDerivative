const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

class Router {
  constructor(Method) {
    this.Method = Method;
  }
  router() {
    const router = express.Router();
    router.post("/connectWallet", this.connectWallet.bind(this));
    router.post("/getTransactions", this.getTransactionsRecord.bind(this));
    router.post("/addTransaction", this.addTransaction.bind(this));
    router.get("/test", this.test.bind(this));
    return router;
  }

  async connectWallet(req, res) {
    let walletId = req.body.walletId;
    await this.Method.storeWalletId(walletId);
    res.end();
  }

  async getTransactionsRecord(req, res) {
    let walletId = req.body.wallet_id;
    let transactionsRecord = await this.Method.getTransactionsRecord(walletId);
    res.send(transactionsRecord);
    res.end();
  }

  async addTransaction(req, res) {
    let walletId = req.body.walletId;
    let transaction = JSON.stringify(req.body.transaction);
    await this.Method.purchaseRecord(transaction, walletId);
    res.end();
  }

  async test(req, res) {
    let timestamp = Date.now().toString();
    let query_string = `timestamp=${timestamp}`;
    let apiSecret = `${process.env.SECRET_KEY}`;

    async function GenerateSignature(query_string) {
      return crypto
        .createHmac("sha256", apiSecret)
        .update(query_string)
        .digest("hex");
    }
    let signature = await GenerateSignature(query_string);

    console.log(signature);

    let requestConfig = {
      method: "get",
      url: `https://testnet.binanceops.com/vapi/v1/account?recvWindow=20000&timestamp=${timestamp}&signature=${signature}`,
      headers: {
        "X-MBX-APIKEY": `${process.env.API_KEY}`,
      },
    };

    let response = await axios(requestConfig);
    console.log(response.data);
  }
}
module.exports = Router;
