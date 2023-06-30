var express = require('express');
var router = express.Router();

var adddeXuat = require("../routes/vanthu/deXuat/create_dx")
var settingDXroutes = require('./vanthu/SettingRoutes')
var cateDXroutes = require('./vanthu/cateDeXuatRoutes');
var toolVT = require('./vanthu/RoutertoolVT')
var DeleteDX = require('./vanthu/deXuat/delete_Dx')
var EditDX = require('./vanthu/deXuat/edit_deXuat')
var TKNP = require('./vanthu/deXuat/thong_ke_nghi_phep')
var EditDXSend = require('./vanthu/deXuat/User_Dx')
var homeRoute = require('./vanthu/QuanLyCongVan/homeRoute')
var listVanBan = require('./vanthu/QuanLyCongVan/listVanBanRoute')

//Api thêm mới các loại đề xuất
router.use('/vanthu/dexuat',adddeXuat);

//Api setting đề xuất
router.use('/vanthu/setting',settingDXroutes)

//Api  de xuat và hiển thị đề xuất
router.use('/vanthu/catedx', cateDXroutes)

//Api xóa để xuất và sửa đề xuất
router.use('/vanthu/deletedx',DeleteDX)
router.use('/vanthu/editdx',EditDX)

//Api gửi nhận đề xuất
router.use('/vanthu/DeXuat',EditDXSend)

router.use('/vanthu/thongkenp',TKNP)


router.use('/vanthu/trangchu',homeRoute)

router.use('/vanthu/listVanBan',listVanBan)








//Api tool quét data văn thư
router.use('/tooldata',toolVT)


module.exports = router