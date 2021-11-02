exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments();
    table.string("tranxType"); //transfer, contract, fee
    table.string("exchange");
    table.integer("exchangeOrderID");
    table.string("asset");
    table.datetime("expiryDate");
    table.string("orderSide");
    table.string("orderType");
    table.integer("quantity");
    table.integer("price");
    table.string("currency");
    table.string("orderStatus");
    table.integer("userID").unsigned();
    table.foreign("userID").references("users.id");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
