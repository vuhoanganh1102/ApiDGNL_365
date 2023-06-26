const router = require('express').Router();
// const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')
const CustomerDetailsRoutes = require('./Customer/CustomerDetailsRoutes')
const GroupCustomerRoutes = require("./Customer/groupCustomer");

// Lâm - Customer
router.use('/',CustomerRouter)
router.use('/',CustomerDetailsRoutes)
// router.use('/crm',GroupCustomerRouter)
router.use('/', GroupCustomerRoutes);




// Trung - Contract
//hợp đồng 
const formContract = require("./Contract/formContract");
//hợp đồng bán
const Contract = require("./Contract/ContractForCus");
//cài đặt hợp đồng 
const settingContract = require("./Setting/AccountAPI");
//lien he KH
const CustomerContact = require("./Customer/CustomerContact");




//hợp đồng 
router.use('/contract', formContract);
//hợp đồng bán
router.use('/contractforcus', Contract);
//cài đặt tong dai
router.use('/settingContract', settingContract);
//lien he KH
router.use('/CustomerContact', CustomerContact);


module.exports = router