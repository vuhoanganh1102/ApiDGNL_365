var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerViTriTs =  require('../../controllers/qlts/viTriTaiSan');
const functions = require('../../services/functions')


//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerViTriTs.addViTriTaiSan)

//Api hiển thị
router.post('/list',functions.checkToken,formData.parse(),controllerViTriTs.show)

//Api đổ dữ liệu thêm mới
router.post('/showadd',functions.checkToken,formData.parse(),controllerViTriTs.showaddViTri)

//Api xóa
router.post("/delete",functions.checkToken,formData.parse(),controllerViTriTs.deleteVT)

module.exports = router