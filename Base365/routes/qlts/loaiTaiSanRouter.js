var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerLoaiTs =  require('../../controllers/qlts/loaiTaiSan');
const functions = require('../../services/functions')

//Api thêm mới + tìm kiếm
router.post('/add',functions.checkToken,formData.parse(),controllerLoaiTs.addLoaiTaiSan)

//Api hiển thị
router.post('/list',functions.checkToken,formData.parse(),controllerLoaiTs.showLoaiTs)

//Api sửa loại
router.post('/edit',functions.checkToken,formData.parse(),controllerLoaiTs.editLoaiTs)

//Api xóa loại
router.post('/delete',functions.checkToken,formData.parse(),controllerLoaiTs.deleteLoaiTs)

//Api chi tiết


module.exports = router