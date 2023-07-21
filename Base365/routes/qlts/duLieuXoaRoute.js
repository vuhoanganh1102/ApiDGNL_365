var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/duLieuXoaController")
const formData = require("express-form-data")
const functions = require('../../services/functions');
const QLTS = require('../../services/QLTS/qltsService');

// dữ liệu xoá trang chủ
router.get('/dataDeleteHome',functions.checkToken,QLTS.checkRole('none',1),formData.parse(),controller.dataDeleteHome)

// danh sách tài sản đã xoá
router.post('/dataDeleted',functions.checkToken,QLTS.checkRole('none',1),formData.parse(),controller.dataDeleted)
module.exports = router