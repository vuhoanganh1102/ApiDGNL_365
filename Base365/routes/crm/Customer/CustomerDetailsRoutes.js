const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const CustomerDetailsRoutes = require('../../../controllers/crm/Customer/CustomerDetails')
const functions = require("../../../services/functions");

//Api hiển thị chi tiết khách hàng
router.post("/showCT",functions.checkToken,formData.parse(),CustomerDetailsRoutes.findOneCus)

//Api sửa khách hàng + thêm lịch sử trợ lý khách hàng
router.post('/editCustomer',functions.checkToken,formData.parse(),CustomerDetailsRoutes.editCustomer);


//Api hiển thị lịch sử cuộc chăm sóc khách hàng
router.post('/showHisCus',functions.checkToken,formData.parse(),CustomerDetailsRoutes.showHisCus)

//Api bafn giao khach hangf
router.post('/bangiao',functions.checkToken,formData.parse(),CustomerDetailsRoutes.banGiao)

//Api chia sẻ khách hàng 
router.post('/shareCustomer',functions.checkToken,formData.parse(),CustomerDetailsRoutes.ShareCustomer)
module.exports = router;