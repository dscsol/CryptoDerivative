exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments();
    table.string("tranx_type"); //transfer, contract, fee
    table.string("exchange");
    table.integer("exchange_order_id");
    table.string("asset");
    table.datetime("expiryDate");
    table.string("order_side");
    table.string("order_type");
    table.string("time_in_force");
    table.integer("quantity");
    table.integer("price");
    table.string("currency");
    table.string("order_status");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
