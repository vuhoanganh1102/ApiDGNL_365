var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerLoaiTs =  require('../../controllers/qlts/loaiTaiSan');


//Api thêm mới
router.post('/add',formData.parse(),controllerLoaiTs.addLoaiTaiSan)

//Api hiển thị
router.post('/list',formData.parse(),controllerLoaiTs.showLoaiTs)


module.exports = router