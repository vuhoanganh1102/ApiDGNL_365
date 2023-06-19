const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const CustomerDetailsRoutes = require('../../../controllers/crm/Customer/CustomerDetails')

//Api hiển thị chi tiết khách hàng
router.post("/showCT",formData.parse(),CustomerDetailsRoutes.findOneCus)

module.exports = router;