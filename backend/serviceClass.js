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
    let parseData = JSON.parse(data);

    console.log(parseData);
    let id = await knex
      .insert({
        tranxType: parseData.tranxType,
        exchange: parseData.exchange,
        exchangeOrderID: parseData.exchangeOrderID,
        asset: parseData.asset,
        expiryDate: parseData.expiryDate,
        orderSide: data.orderSide,
        orderType: parseData.orderType,
        quantity: parseData.quantity,
        price: parseData.price,
        currency: parseData.currency,
        orderStatus: parseData.orderStatus,
        userID: parseData.userID,
      })
      .into("transactions")
      .returning("id");
    return id[0];
  }

  async updateDepositStatus(id) {
    await knex("transactions")
      .update({
        orderStatus: "RECEIVED",
      })
      .where("id", id);
  }

  async updateOrderStatus(DBOrderID, orderID, status) {
    await knex("transactions")
      .update({
        exchangeOrderID: orderID,
        orderStatus: status,
      })
      .where("id", DBOrderID);
  }
}
module.exports = Method;
