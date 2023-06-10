const router = require('express').Router();
const deXuatDangKiSuDungXeRoute = require("../../../controllers/vanthu/DeXuat/DeXuatDangKiSuDungXe")
const formData = require("express-form-data");


// thêm mới dxtc
router.post('/addDXXe',formData.parse(),deXuatDangKiSuDungXeRoute.dxDangKiSuDungXe)


module.exports = router