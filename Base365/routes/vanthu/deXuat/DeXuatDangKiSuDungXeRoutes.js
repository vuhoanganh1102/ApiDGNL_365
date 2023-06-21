const router = require('express').Router();
const deXuatDangKiSuDungXeRoute = require("../../../controllers/vanthu/DeXuat/DeXuatDangKiSuDungXe")
const formData = require("express-form-data");
const funtions = require('../../../services/functions');

// thêm mới dxtc
router.post('/addDXXe',funtions.checkToken,formData.parse(),deXuatDangKiSuDungXeRoute.dxDangKiSuDungXe)


module.exports = router