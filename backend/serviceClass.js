const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);

class Method {
  constructor(knex) {
    this.knex = knex;
  }

  async storeWalletId(walletId) {
    let exisitingUser = await knex("users").where("wallet_id", walletId);
    if (!exisitingUser[0]) {
      await knex.insert({ wallet_id: walletId }).into("users");
    }
  }

  async getTransactionsRecord(walletId) {
    let id = await knex("users").where("wallet_id", walletId);
    if (id[0]) {
      let data = await knex.select("*").from("transactions").where("id", id[0]);
      return data;
    } else {
      await knex.insert({ wallet_id: walletId }).into("users");
    }
  }

  async purchaseRecord(transaction, walletId) {}
}

module.exports = Method;
