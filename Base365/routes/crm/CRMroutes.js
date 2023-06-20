const router = require('express').Router();
// const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')
const CustomerDetailsRoutes = require('./Customer/CustomerDetailsRoutes')



router.use('/crm',CustomerRouter)
router.use('/crm',CustomerDetailsRoutes)
// router.use('/crm',GroupCustomerRouter)


module.exports = router