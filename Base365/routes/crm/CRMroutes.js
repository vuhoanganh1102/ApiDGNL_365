const router = require('express').Router();
// const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')
const CustomerDetailsRoutes = require('./Customer/CustomerDetailsRoutes')


router.use('/crm', CustomerRouter)
router.use('/crm', CustomerDetailsRoutes)
    // router.use('/crm',GroupCustomerRouter)

const GroupCustomerRoutes = require("./groupCustomer");
router.use('/', GroupCustomerRoutes);

// Trung - Contract
const formContract = require("./Contract/formContract");

router.use('/contract', formContract);


module.exports = router