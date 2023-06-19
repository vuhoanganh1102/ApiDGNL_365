const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const CustomerRoutes = require('../../../controllers/crm/Customer/Customer');

//Api hiển thị và tìm kiếm
router.post('/showAll',formData.parse(),)

//Api thêm mới khách hàng
router.post('/addCustomer', formData.parse(),CustomerRoutes.addCustomerKH);
module.exports = router;