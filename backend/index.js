require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./knexfile").development;
const knex = require("knex")(database);
