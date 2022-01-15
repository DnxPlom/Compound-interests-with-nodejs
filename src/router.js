const express =  require('express');
const controller = require('./controller');
const router = express.Router();

router.post("/api/deposit", controller.deposit );

router.get("/api/customers/:customer_id/history/", controller.history);

router.delete("/api/customers/:customer_id/", controller.delete)

router.get("/api/customers/", controller.all)

module.exports = router;