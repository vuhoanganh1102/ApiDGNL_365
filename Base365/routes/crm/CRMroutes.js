const router = require('express').Router();
const GroupCustomerRoutes = require("./groupCustomer");

router.use('/', GroupCustomerRoutes);

module.exports = router