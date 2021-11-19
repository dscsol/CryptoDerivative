exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { walletID: "0x3dbe7351fe42f56d8d1f37515943574d413dc920" },
      ]);
    });
};
