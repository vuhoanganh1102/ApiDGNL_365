const router = require('express').Router();
// const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')
const CustomerDetailsRoutes = require('./Customer/CustomerDetailsRoutes')


router.use('/crm', CustomerRouter)
router.use('/crm', CustomerDetailsRoutes)
// router.use('/crm',GroupCustomerRouter)


//Tĩnh
const GroupCustomerRoutes = require("./groupCustomer");
const Cus_status = require("./Customer_status");
const Nhap_lieu = require("./Nhap_lieu");
const Cus_Chance = require("./Customer/CustomerChange");
router.use('/crm/CustomerGroup', GroupCustomerRoutes);
router.use("/crm/CustomerStatus", Cus_status);
router.use('/crm/NhapLieu', Nhap_lieu);
router.use('/crm/CustomerChance', Cus_Chance);
module.exports = router;
