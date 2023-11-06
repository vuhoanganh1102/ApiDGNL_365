var express = require('express');
var router = express.Router();


var PhieuDanhGia = require('./DGNL/PhieuDanhGia');
var LoTrinhThangTien = require('./DGNL/LoTrinhThangTien');
var KetQuaDanhGia = require('./DGNL/KetQuaDanhGia/KetQuaDanhGia');
var PhanQuyen = require('./DGNL/PhanQuyen');
// const TieuChiDeDG = require('./DGNL/Dulieuxoaganday/TieuChiDeDG')
// const KehoachDG = require('./DGNL/Dulieuxoaganday/KehoachDG')
const PhieuDG = require('./DGNL/Dulieuxoaganday/PhieuDG')
// const DeKt = require('./DGNL/Dulieuxoaganday/DeKt')

router.use('/PhieuDanhGia', PhieuDanhGia);
router.use('/LoTrinhThangTien', LoTrinhThangTien);
router.use('/KetQuaDanhGia', KetQuaDanhGia);
router.use('/PhanQuyen', PhanQuyen);

// router.use('/TieuChiDeDG',TieuChiDeDG)
// router.use('/KehoachDG',KehoachDG)
router.use('/PhieuDG',PhieuDG)
// router.use('/DeKt',DeKt)

module.exports = router;