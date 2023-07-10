var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerNhomTs =  require('../../controllers/qlts/nhomTs');
const functions = require('../../services/functions')

//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerNhomTs.addNhomTaiSan)

//Api hiển thị + dổ danh sách tìm kiếm
router.post('/list',functions.checkToken,formData.parse(),controllerNhomTs.showNhomTs)

//Api hiển thị chi tiết nhóm
router.post('/details',functions.checkToken,formData.parse(),controllerNhomTs.showCTNhomTs)


module.exports = router