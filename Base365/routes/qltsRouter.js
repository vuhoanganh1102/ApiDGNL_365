var express = require('express');
var router = express.Router();
var functions = require('../services/functions');
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
const nhomTsRouter = require('./qlts/nhomTaiSanRouter')
const loaiTsRouter = require('./qlts/loaiTaiSanRouter')
const vitriTsRouter = require('./qlts/viTriTaiSanRouter')
var capPhat = require('./qlts/CapPhat.js')
var ThuHoi = require('./qlts/ThuHoi.js')
var mat = require('./qlts/matRouter')
var huy = require('./qlts/huyRouter')
var SuaChua = require('./qlts/SuaChua_BaoDuong/SuaChua');
var kiemKeRouter = require('./qlts/kiemKeRouter');
var DieuChuyenBanGiao = require("./qlts/DieuChuyenBanGiao/DieuChuyenViTri");
var BaoDuong = require('./qlts/SuaChua_BaoDuong/BaoDuong');
var DieuChuyenBanGiaoDVQL = require("./qlts/DieuChuyenBanGiao/DieuChuyenDonViQuanLi");
var baoDuongRouter = require("./qlts/SuaChua_BaoDuong/baoDuongRouter");
var DieuChuyenBanGiaoDT = require('./qlts/DieuChuyenBanGiao/DieuchuyenDoiTuong')
//Api tool quét data
router.use('/tool', toolData)

//Api tài sản
router.use('/taisan', taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);

// nhóm tài sản
router.use('/nhomts', nhomTsRouter)

//loại tài sản
router.use('/loaits', loaiTsRouter)

// vị trí tài sản
router.use('/vitrits', vitriTsRouter)
//API mất huỷ thanh lý
router.use('/mat', mat)
router.use('/huy', huy)
//api kiem ke
router.use('/kiemKe', functions.checkToken, kiemKeRouter);

//api Phân quyền
//router.use('/phanQuyen', phanQuyen)


router.use('/DieuChuyenBanGiao/DVQL', DieuChuyenBanGiaoDVQL);
router.use('/DieuChuyenBanGiaoDoiTuong', DieuChuyenBanGiaoDT)
//suachua
//Tinh
router.use('/SuaChua', SuaChua);
router.use('/BaoDuong', BaoDuong);
router.use('/DieuChuyenBanGiao', DieuChuyenBanGiao);
module.exports = router