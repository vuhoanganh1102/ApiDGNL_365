const express = require('express');
const formData = require('express-form-data');
const router = express.Router();

const cv = require('../../controllers/timviec/cv');


// CV & hồ sơ
router.post('/insertDataCV',formData.parse(),cv.insertDataCV);
// tìm tất cả
router.get('/getListCV',formData.parse(),cv.getListCV);
//tìm theo điều kiện
router.get('/getListCVByCondition',formData.parse(),cv.getListCVByCondition);

module.exports = router;