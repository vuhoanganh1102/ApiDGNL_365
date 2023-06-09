var express = require('express');
var router = express.Router();
var admin = require('../../controllers/raonhanh365/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const serviceRN = require('../../services/rao nhanh/raoNhanh');


//api quan ly tai khoan
router.post('/account/createAcc', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.loginAdminUser);


//api quan ly danh muc
router.post('/category/getListCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListCategory);

module.exports = router;