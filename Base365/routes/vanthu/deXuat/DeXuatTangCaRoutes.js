const router = require('express').Router();
const deXuatTangCaRoute = require("../../../controllers/vanthu/DeXuat/DeXuatTangCa")
const formData = require("express-form-data");
const funtions = require('../../../services/functions');

//Api show tất cả các loại đề xuất
router.get('/showAll',deXuatTangCaRoute.getAllDX);

// tìm đề xuất theo người dùng
router.post('/findByIdUser',formData.parse(),deXuatTangCaRoute.findByIdUser)

// thêm mới dxtc
router.post('/addDxTc',funtions.checkToken,formData.parse(),deXuatTangCaRoute.dxTangCa)

//




module.exports = router

