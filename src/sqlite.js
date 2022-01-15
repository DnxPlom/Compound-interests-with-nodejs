const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

// get or create sqlite db 
let sqlitedb;
let dbfile = path.join(__dirname, "customers.db")
let initialQuery = `CREATE TABLE IF NOT EXISTS customers_interest (
                        transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        customer_id INT,
                        deposit INT,
                        interest_rate INT,
                        gain INT
                    )`;

const getOrCreateDb = async () => {
  try {
    sqlitedb = await open({
      filename: dbfile,
      driver: sqlite3.Database,
    });
    await sqlitedb.run(initialQuery);
    
    console.log("Sqlite Database Connected: ", dbfile)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
// initialize db function

module.exports = getOrCreateDb