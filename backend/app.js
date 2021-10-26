const express = require("express");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http = require("http").Server(app);

const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const Method = require("./serviceClass");
const Router = require("./router");
let method = new Method(knex);
let router = new Router(method);

app.use("/", router.router());

http.listen(8000, () => {
  console.log(`Server running on port: 8000`);
});
