var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerTs =  require('../../controllers/qlts/taiSan');
const functions = require('../../services/functions')

//Api danh sach
router.post('/list',functions.checkToken,formData.parse(),controllerTs.showAll)

//Api show dữ liệu tìm kiếm danh sách
router.post('/datasearch',functions.checkToken,formData.parse(),controllerTs.showDataSearch)

//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerTs.addTaiSan)

//Api hiển thị dữ liệu thêm mới
router.post('/showadd',functions.checkToken,formData.parse(),controllerTs.showadd)

//Api hiển thị chi tiết tài sản
router.post('/details',functions.checkToken,formData.parse(),controllerTs.showCTts)


//Api xóa tài sản
router.post('/delete',functions.checkToken,formData.parse(),controllerTs.deleteTs)

module.exports = router