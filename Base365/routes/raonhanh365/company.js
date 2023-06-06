const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions');
const com = require('../../controllers/raonhanh365/company');

router.post('/comInfo', functions.checkToken, com.comInfo);

//api tao tao khoan doanh nghiep
router.post('/createCom', formData.parse(), [functions.checkToken, functions.isAdminRN365], com.createCompany);

//api cap nhat thong tin doanh nghiep
router.post('/updateCom', formData.parse(), [functions.checkToken], com.updateCompany);

module.exports = router;