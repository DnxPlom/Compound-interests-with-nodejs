
const redis = require('redis');
const { promisifyAll } = require('bluebird');
const { promisify } = require('util');

const getOrCreateDb = require("./sqlite");

promisifyAll(redis);
const client = redis.createClient();

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
 
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
        
        res.send({
            "message": "Saved",
            "apy": apy.toString()
        });
    },

    async history(req, res) {
        const { customer_id } = req.params;
        const getCustomerHistoryQuery = `SELECT * FROM customers_interest WHERE customer_id=${customer_id}`;
    
        const result = await sqlitedb.all(getCustomerHistoryQuery);
    
        const responseResult = result ? result : {
            "message": "No records found"
        }
    
        res.send(responseResult)
    },

    async delete(req, res) {
        const { customer_id } = req.params;
        const deleteCustomerHistoryQuery = `DELETE FROM customers_interest WHERE customer_id=${customer_id}`;
    
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