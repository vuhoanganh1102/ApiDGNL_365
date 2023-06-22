const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const CustomerDetailsRoutes = require('../../../controllers/crm/Customer/CustomerDetails')
const functions = require("../../../services/functions");

//Api hiển thị chi tiết khách hàng
router.post("/showCT",functions.checkToken,formData.parse(),CustomerDetailsRoutes.findOneCus)

//Api sửa khách hàng
router.post('/editCustomer',functions.checkToken,formData.parse(),CustomerDetailsRoutes.editCustomer);

module.exports = router;