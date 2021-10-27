const express = require("express");

class Router {
  constructor(Method) {
    this.Method = Method;
  }
  router() {
    const router = express.Router();
    router.post("/connectWallet", this.connectWallet.bind(this));
    router.post("/getTransactions", this.getTransactionsRecord.bind(this));
    router.post("/addTransaction", this.addTransaction.bind(this));
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
}

module.exports = Router;
