var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerLoaiTs =  require('../../controllers/qlts/loaiTaiSan');
const functions = require('../../services/functions')

//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerLoaiTs.addLoaiTaiSan)

//Api hiển thị
router.post('/list',functions.checkToken,formData.parse(),controllerLoaiTs.showLoaiTs)




module.exports = router