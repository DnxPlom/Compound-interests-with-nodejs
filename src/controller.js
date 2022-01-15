// const { getOrCreateDb, sqlitedb } = require("./sqlite");
const redisClient = require('../redis-client');
 
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const { json } = require('body-parser');

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
// initiallize sqlite db 
getOrCreateDb();

function calculateInterest(interest_rate, yearly_compound_times) {
    let interest = Math.pow((1 + (interest_rate) / yearly_compound_times), yearly_compound_times) - 1;
    return interest.toFixed(4)
}

const controller = {
    async deposit (req, res) {
        const {
            deposit,
            customer_id,
            interest_rate,
            yearly_compound_times
        } = req.body
    
        if (!deposit || !customer_id || ! interest_rate || !yearly_compound_times) {
            res.send({"message": "Missing input"})
        }
        
        let apy = calculateInterest(interest_rate, yearly_compound_times)
        let gain = Number(deposit) + (Number(deposit) * apy)
        console.log(gain)
        const apyQuery = `
            INSERT INTO
                customers_interest (customer_id, deposit, interest_rate, gain)
            VALUES
                (${customer_id}, '${deposit}', '${interest_rate}','${gain.toFixed(3)}');`;
        
        await sqlitedb.run(apyQuery)

        // remove redis instance 
        redisClient.del(customer_id)

        
        res.send({
            "message": "Saved",
            "apy": apy.toString()
        });
    },

    async history(req, res) {
        const { customer_id } = req.params;

        const redisData = await redisClient.get(customer_id)

        let result;

        if (redisData) {
            console.log(redisData)
            result = JSON.parse(redisData).data

        } else {
            console.log("#####################")
            const getCustomerHistoryQuery = `SELECT * FROM customers_interest WHERE customer_id=${customer_id}`;
            result = await sqlitedb.all(getCustomerHistoryQuery);
            redisClient.SET(customer_id, JSON.stringify({"data": result}));
        }
  
        const responseResult = result ? result : {
            "message": "No records found"
        }
    
        res.send(responseResult)
    },

    async delete(req, res) {
        const { customer_id } = req.params;
        const deleteCustomerHistoryQuery = `DELETE FROM customers_interest WHERE customer_id=${customer_id}`;
    
        await redisClient.flushAll("ASYNC", function (err, reply) {
            console.log("FLUSHED")
        })

        const result = await sqlitedb.all(deleteCustomerHistoryQuery);
        console.log(result)
    
        res.send("OK")
    },

    async all (req, res) {
        const getCustomersHistoryQuery = `SELECT * FROM customers_interest`;
    
        const result = await sqlitedb.all(getCustomersHistoryQuery);
        console.log(result)
    
        res.send(result)
    }
}

module.exports = controller;
