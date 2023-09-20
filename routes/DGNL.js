var express = require('express');
var router = express.Router();


var PhieuDanhGia = require('./DGNL/PhieuDanhGia');
var LoTrinhThangTien = require('./DGNL/LoTrinhThangTien');
var KetQuaDanhGia = require('./DGNL/KetQuaDanhGia');
var PhanQuyen = require('./DGNL/PhanQuyen');

router.use('/PhieuDanhGia', PhieuDanhGia);
router.use('/LoTrinhThangTien', LoTrinhThangTien);
router.use('/KetQuaDanhGia', KetQuaDanhGia);
router.use('/PhanQuyen', PhanQuyen);

module.exports = router;