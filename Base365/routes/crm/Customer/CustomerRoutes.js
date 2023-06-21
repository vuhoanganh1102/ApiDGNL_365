const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const CustomerRoutes = require('../../../controllers/crm/Customer/Customer');
const functions = require("../../../services/functions");
//Api hiển thị và tìm kiếm
router.post('/showAll',functions.checkToken,formData.parse(),CustomerRoutes.showKH)

//Api thêm mới khách hàng
router.post('/addCustomer',functions.checkToken,formData.parse(),CustomerRoutes.addCustomer);


module.exports = router;