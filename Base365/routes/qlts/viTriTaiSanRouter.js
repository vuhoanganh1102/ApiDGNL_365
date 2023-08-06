var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerViTriTs =  require('../../controllers/qlts/viTriTaiSan');
const functions = require('../../services/functions')
const QLTS = require('../../services/QLTS/qltsService');

//Api thêm mới
router.post('/add',functions.checkToken,QLTS.checkRole("TS",1),formData.parse(),controllerViTriTs.addViTriTaiSan)

//Api hiển thị
router.post('/list',functions.checkToken,QLTS.checkRole("TS",1),formData.parse(),controllerViTriTs.show)

//Api đổ dữ liệu thêm mới
router.post('/showadd',functions.checkToken,QLTS.checkRole("TS",1),formData.parse(),controllerViTriTs.showaddViTri)

//Api xóa
router.post("/delete",functions.checkToken,QLTS.checkRole("TS",1),formData.parse(),controllerViTriTs.deleteVT)

//Api chi tiết 
router.post("/details",functions.checkToken,QLTS.checkRole("TS",1),formData.parse(),controllerViTriTs.detailsVT)

module.exports = router