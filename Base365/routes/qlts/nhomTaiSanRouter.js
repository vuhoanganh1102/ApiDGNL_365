var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerNhomTs =  require('../../controllers/qlts/nhomTs');
const functions = require('../../services/functions')

//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerNhomTs.addNhomTaiSan)

//Api hiển thị + dổ danh sách tìm kiếm
router.post('/list',functions.checkToken,formData.parse(),controllerNhomTs.showNhomTs)

//Api đổ data để sửa nhóm
router.post('/Nhomdata',functions.checkToken,formData.parse(),controllerNhomTs.showdataCT)

//Api hiển thị chi tiết nhóm
router.post('/details',functions.checkToken,formData.parse(),controllerNhomTs.showCTNhomTs)

//Api sửa 
router.post('/edit',functions.checkToken,formData.parse(),controllerNhomTs.editNhom)

//Api xóa
router.post('/delete',functions.checkToken,formData.parse(),controllerNhomTs.xoaNhom)

//Api hiển thị thông tin tùy chỉnh phần nhóm
router.post('/listTttc',functions.checkToken,formData.parse(),controllerNhomTs.listTTPBnhom)

//Api thêm mới thông tin tùy chỉnh nhóm
router.post('/addTTTC',functions.checkToken,formData.parse(),controllerNhomTs.addTTPB)

//Api chi tiết thông tin tùy chỉnh
router.post('/detailsTTTC',functions.checkToken,formData.parse(),controllerNhomTs.detailsTTTC)

//Api thông tin tùy chỉnh
router.post('/editTTTC',functions.checkToken,formData.parse(),controllerNhomTs.editTTTC);

//Api xóa thông tin tùy chỉnh
router.post('/deleteTTTC',functions.checkToken,formData.parse(),controllerNhomTs.deleteTTTC);
module.exports = router