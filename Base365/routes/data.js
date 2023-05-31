const express = require('express');
const formData = require('express-form-data');

const data = require('../controllers/data')
const router = express.Router();
const functions = require('../services/functions');

//api lấy dữ liệu của thành phố
router.get('/city', data.getDataCity);
router.post('/district', formData.parse(), data.getDataDistrict);
router.post('/timviec/category', formData.parse(), data.getDataCategoryTv365);
router.post('/timviec/tag', formData.parse(), data.getDataTagTv365);

module.exports = router;