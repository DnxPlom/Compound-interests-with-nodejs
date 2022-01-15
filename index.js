const express = require("express");
const router = require("./src/router");
 const redisClient = require('./redis-client');


HOST = "0.0.0.0"
PORT = 8080

const app = express();

app.use(express.json());

app.use(router);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}/`);
});
