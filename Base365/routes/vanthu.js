var express = require('express');
var router = express.Router();


var deXuatCongRoute = require("./vanthu/deXuat/DeXuatCongRoutes")
var deXuatThaiSanRoutes = require("./vanthu/deXuat/DeXuatThaiSanRoutes")
var dexuatTangcaRoutes = require('./vanthu/deXuat/DeXuatTangCaRoutes')
var dexuatCosovatchat = require('./vanthu/deXuat/DeXuatCoSoVatChatRoutes')
var dexuatdangkiSudungxe = require('./vanthu/deXuat/DeXuatDangKiSuDungXeRoutes')
var dexuatHoahong = require('./vanthu/deXuat/DeXuatHoaHongRoutes')
var dexuatKhieuNai = require('./vanthu/deXuat/DeXuatKhieuNaiRoutes');
var dexuatThanhtoan = require('./vanthu/deXuat/DeXuatThanhToanRoutes');
var dexuatthuongPhat = require('./vanthu/deXuat/DeXuatThuongPhatRoutes')
var dexuatPhonghopRoutes = require('./vanthu/deXuat/DeXuatPhongHopRoutes')
var settingDXroutes = require('./vanthu/SettingRoutes')
var cateDXroutes = require('./vanthu/cateDeXuatRoutes');

var settingDxVanThu = require('./vanthu/setingdx');
var FeedbackRouter = require('./vanthu/tbl_feedback');
var qlcv_editRouter = require('./vanthu/qlcv_edit');
var qlcv_roleRouter = require('./vanthu/qlcv_Role');
var ql_CongVan = require('./vanthu/quanLiCongVan');
var vb_thay_the = require('./vanthu/VanBanThayThe');
var view = require('./vanthu/view');
var textBook = require('./vanthu/TextBook');
var tlLuuTru = require('./vanthu/tl_LuuTru');
var thongBao = require('./vanthu/thong_bao');
var NguoiDuyetVanBan = require('./vanthu/user_duyet_vb');
var UserModel = require('./vanthu/user_model');
var VanBan = require('./vanthu/van_ban');
var Vanthu = require('./vanthu')
var toolVT = require('./vanthu/RoutertoolVT')


//Api thêm mới các loại đề xuất
router.use('/dexuat', deXuatCongRoute);
router.use('/dexuat', deXuatThaiSanRoutes);
router.use('/dexuat', dexuatTangcaRoutes);
router.use('/dexuat', dexuatCosovatchat);
router.use('/dexuat', dexuatdangkiSudungxe);
router.use('/dexuat', dexuatPhonghopRoutes);
router.use('/dexuat', dexuatthuongPhat);
router.use('/dexuat', dexuatHoahong);
router.use('/dexuat', dexuatThanhtoan);
router.use('/dexuat', dexuatKhieuNai);

//Api setting 
router.use('/setting', settingDXroutes)

//Api cate de xuat và hiển thị
router.use('/catedx', cateDXroutes)

router.use('/vanthu', settingDxVanThu);
router.use('/vanthu', FeedbackRouter);
router.use('/vanthu', qlcv_editRouter);
router.use('/vanthu', qlcv_roleRouter);
router.use('/vanthu', ql_CongVan);
router.use('/vanthu', vb_thay_the);
router.use('/vanthu', view);
router.use('/vanthu', textBook);
router.use('/vanthu', tlLuuTru);
router.use('/vanthu', thongBao);
router.use('/vanthu', NguoiDuyetVanBan);
router.use('/vanthu', UserModel);
router.use('/vanthu', VanBan);
module.exports = router