var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerTs =  require('../../controllers/qlts/taiSan');
const functions = require('../../services/functions')

//Api danh sach
router.post('/list',functions.checkToken,formData.parse(),controllerTs.showAll)


//Api show dữ liệu tìm kiếm danh sách
router.post('/datasearch',functions.checkToken,formData.parse(),controllerTs.showDataSearch)


//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerTs.addTaiSan)


//Api hiển thị dữ liệu thêm mới
router.post('/showadd',functions.checkToken,formData.parse(),controllerTs.showadd)


//Api hiển thị chi tiết tài sản
router.post('/details',functions.checkToken,formData.parse(),controllerTs.showCTts)


//Api hiển thị quá trình sử dụng
router.post('/quatrinhSd',functions.checkToken,formData.parse(),controllerTs.quatrinhsd)


//Api hiển thị khấu hao
router.post('/showkh',functions.checkToken,formData.parse(),controllerTs.khauhaoCTTS)

//Apo thêm khấu hao
router.post('/addkhauhao',functions.checkToken,formData.parse(),controllerTs.addKhauHao)


//Api tài liệu đính kèm
router.post('/listFile',functions.checkToken,formData.parse(),controllerTs.showFile)

router.post('/addFile',functions.checkToken,formData.parse(),controllerTs.addFile)

router.post('/addFile',functions.checkToken,formData.parse(),controllerTs.deleteFile)
//Api Bảo duongx theo chi tiết
router.post('/showBDCT',functions.checkToken,formData.parse(),controllerTs.showBDCT)

//Api sửa chữa theo chi tiết 
router.post('/showSCCT',functions.checkToken,formData.parse(),controllerTs.showScCT)

//Api sửa chữa theo chi tiết
router.post('/editTS',functions.checkToken,formData.parse(),controllerTs.editTS)

//Api xóa tài sản
router.post('/delete',functions.checkToken,formData.parse(),controllerTs.deleteTs)




//Api hiển thị ghi tăng
router.post('/DTghitang',functions.checkToken,formData.parse(),controllerTs.showGhiTang)


//duyệt ghi tăng
router.post('/Deleteghitang',functions.checkToken,formData.parse(),controllerTs.duyetHuyGhiTang)

//xóa ghi tăng
router.post('/Deleteghitang',functions.checkToken,formData.parse(),controllerTs.XoaGhiTang)

//sửa ghi tăng
router.post('/Editghitang',functions.checkToken,formData.parse(),controllerTs.showGhiTang)

//Thông tin phân bổ
router.post('/ShowTTPB',functions.checkToken,formData.parse(),controllerTs.showTTPB)

module.exports = router