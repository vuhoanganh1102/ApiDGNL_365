const router = require('express').Router();
// const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')
const CustomerDetailsRoutes = require('./Customer/CustomerDetailsRoutes')



router.use('/crm',CustomerRouter)
router.use('/crm',CustomerDetailsRoutes)
// router.use('/crm',GroupCustomerRouter)

const GroupCustomerRoutes = require("./Customer/groupCustomer");

router.use('/', GroupCustomerRoutes);




// Trung 
//hợp đồng 
const formContract = require("./Contract/formContract");
//hợp đồng bán
const Contract = require("./Contract/ContractForCus");
//cài đặt hợp đồng 
const settingContract = require("./Setting/AccountAPI");




//hợp đồng 
router.use('/contract', formContract);
//hợp đồng bán
router.use('/contractforcus', Contract);
//cài đặt hợp đồng 
router.use('/settingContract', settingContract);


module.exports = router