const router = require('express').Router();


const deXuatCongRoute = require("./deXuat/DeXuatCongRoutes")
const deXuatThaiSanRoutes = require("./deXuat/DeXuatThaiSanRoutes")
const dexuatTangcaRoutes = require('./deXuat/DeXuatTangCaRoutes')
const dexuatCosovatchat = require('./deXuat/DeXuatCoSoVatChatRoutes')
const dexuatdangkiSudungxe = require('./deXuat/DeXuatDangKiSuDungXeRoutes')
const dexuatHoahong = require('./deXuat/DeXuatHoaHongRoutes')
const dexuatKhieuNai = require('./deXuat/DeXuatKhieuNaiRoutes');
const dexuatThanhtoan =require('./deXuat/DeXuatThanhToanRoutes');
const dexuatthuongPhat = require('./deXuat/DeXuatThuongPhatRoutes')
const dexuatPhonghopRoutes = require('./deXuat/DeXuatHoaHongRoutes')
const settingDXroutes = require('./SettingRoutes')
const cateDXroutes = require('./cateDeXuatRoutes');


//Api thêm mới các loại đề xuất
router.use('/dexuat',deXuatCongRoute);
router.use('/dexuat',deXuatThaiSanRoutes);
router.use('/dexuat',dexuatTangcaRoutes);
router.use('/dexuat',dexuatCosovatchat);
router.use('/dexuat',dexuatdangkiSudungxe);
router.use('/dexuat',dexuatPhonghopRoutes);
router.use('/dexuat',dexuatthuongPhat);
router.use('/dexuat',dexuatHoahong);
router.use('/dexuat',dexuatThanhtoan);
router.use('/dexuat',dexuatKhieuNai);


//Api setting 
router.use('/setting',settingDXroutes)

//Api cate de xuat và hiển thị
router.use('/catedx',cateDXroutes)
module.exports = router