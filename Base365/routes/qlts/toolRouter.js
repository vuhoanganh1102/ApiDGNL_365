var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const toolQLTS =  require('../../controllers/tools/qlts');


//Api tool quét data Lâm
router.post('/bao_duong',toolQLTS.toolBaoDuong)
router.post('/loaitaisan',toolQLTS.toolLoaits)
router.post('/taisan',toolQLTS.toolTaisan)
router.post('/vitrits',toolQLTS.toolViTriTS)
router.post('/nhomts',toolQLTS.toolNhomts)
router.post('/tsvitri',toolQLTS.toolTSvitri)
router.post('/phanquyen',toolQLTS.toolPhanQuyen)

//dung
router.post('/kiemke',toolQLTS.kiemKe);








//trung
router.post('/ViTriTaiSan',toolQLTS.toolViTriTaiSan)
router.post('/ThuHoiTaiSan',toolQLTS.toolThuHoiTaiSan)
router.post('/ThongTinTuyChinh',toolQLTS.toolThongTinTuyChinh)
router.post('/ThongBao',toolQLTS.toolThongBao)
router.post('/TheoDoiCongSuat',toolQLTS.toolTheoDoiCongSuat)
router.post('/ThanhLy',toolQLTS.toolThanhLy)
router.post('/TaiSanDangSuDung',toolQLTS.toolTaiSanDangSuDung)
router.post('/TaiSanDaiDienNhan',toolQLTS.toolTaiSanDaiDienNhan)
router.post('/CapPhat',toolQLTS.toolCapPhat)


module.exports = router