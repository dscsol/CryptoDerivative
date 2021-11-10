const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);

class Method {
  constructor(knex) {
    this.knex = knex;
  }

  async storeWalletID(walletID) {
    let exisitingUser = await knex("users").where("walletID", walletID);
    if (!exisitingUser[0]) {
      await knex.insert({ walletID: walletID }).into("users");
    }
  }

  async getUserID(walletID) {
    let exisitingUser = await knex("users").where("walletID", walletID);
    return exisitingUser[0].id;
  }

  async getTransactionsRecord(walletID) {
    let id = await knex("users").where("walletID", walletID);
    if (id[0]) {
      let data = await knex.select("*").from("transactions").where("id", id[0]);
      return data;
    } else {
      await knex.insert({ walletID: walletID }).into("users");
    }
  }

  async addTransactionsRecord(data) {
    await knex
      .insert({
        tranxType: data.tranxType,
        exchange: data.exchange,
        exchangeOrderID: data.exchangeOrderID,
        asset: data.asset,
        expiryDate: data.expiryDate,
        orderSide: data.orderSide,
        orderType: data.orderType,
        quantity: data.quantity,
        price: data.price,
        currency: data.currency,
        orderStatus: data.orderStatus,
        userID: data.userID,
      })
      .into("transactions");
  }

  async updateDepositStatus(walletID) {
    let id = await knex("users").where("walletID", walletID);
    await knex("transactions")
      .update({
        orderStatus: "success",
      })
      .where(userID, id[0]);
  }
}
module.exports = Method;
