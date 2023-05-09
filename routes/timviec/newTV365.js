const express = require('express');
const formData = require('express-form-data');

const newTV365=require('../../controllers/timviec/newTV365')
const router = express.Router();
const functions=require('../../services/functions')

// api đăng tin tuyển dụng
router.post('/postNewTv365',functions.checkToken,newTV365.postNewTv365)
//api lấy dữ liệu của thành phố
router.get('/getDataCIty',newTV365.getDataCity)
//api lấy dữ liệu của quận huyện của 1 thành phố
router.post('/getDataDistric',formData.parse(),newTV365.getDataDistrict)
module.exports = router;