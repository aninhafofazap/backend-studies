const sqlite = require("sqlite3");
const db = new sqlite.Database("./products.db");

module.exports = db;
