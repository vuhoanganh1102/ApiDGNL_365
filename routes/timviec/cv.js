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

//xem trước cv
router.get('/previewCV/:_id',formData.parse(),cv.previewCV);

//chi tiết cv 
router.get('/detailCV',formData.parse(),cv.detailCV);

//lưu và tải cv
router.post('/createCV',formData.parse(),cv.createCV);




module.exports = router;