const router = require('express').Router();
const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')


router.use('/',CustomerRouter)
router.use('/',GroupCustomerRouter)


module.exports = router