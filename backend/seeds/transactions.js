exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("transactions")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("transactions").insert([
        {
          tranxType: "Deposit",
          exchange: "binance",
          exchangeOrderID: "95554985",
          asset: "USCT",
          expiryDate: null,
          orderSide: null,
          orderType: null,
          quantity: 1000,
          price: 1000,
          currency: "USD",
          orderStatus: "Success",
          userID: 1,
        },
        {
          tranxType: "Option",
          exchange: "binance",
          exchangeOrderID: "123123554985",
          asset: "BTC-211231-56000-P",
          expiryDate: new Date(31 / 12 / 2021),
          orderSide: "BUY",
          orderType: "LIMIT",
          quantity: 1,
          price: 5614.83,
          currency: "USD",
          orderStatus: "Filled",
          userID: 1,
        },
      ]);
    });
};
