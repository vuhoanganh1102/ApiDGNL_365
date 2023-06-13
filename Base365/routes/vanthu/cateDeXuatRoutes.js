const router = require('express').Router();
const cateDeXuat = require('../../controllers/vanthu/CateDeXuat/cateDeXuat');
var formData = require('express-form-data');



//Api hiển thị danh sách các loại đề xuất 
router.post('/showCate',formData.parse(),cateDeXuat.showCateCom)



//Api hiển thị trang home tài khoản công ty
router.post('/showHomeCt',formData.parse(),cateDeXuat.showHomeCt)




// Api hiển thị trang home tài khoản nhân viên
router.post('/showHomeNv',formData.parse(),cateDeXuat.showHomeNv)



//Api hiển thị trang tài khoản nghỉ + không lịch làm việc
router.post('/showNghi',formData.parse(),cateDeXuat.showNghi)



//Api tìm kiếm trang trang tài khoản nghỉ + không lịch làm việc
router.post('/searchNghi',formData.parse(),cateDeXuat.adminSearchN)


//Api hiển thị chi tiết đề xuất
router.post('/showCTDX',formData.parse(),cateDeXuat.ChitietDx)


//Api thay đổi trạng thái Dx
router.post('/chageCate',formData.parse(),cateDeXuat.changeCate)


//Api tim theo tên gần đúng trang danh sách các loại đề xuất
router.post('/searchcate',formData.parse(),cateDeXuat.findNameCate)


//Api hiển thị trang thành viên công ty
router.post('/thanhvien',formData.parse(),cateDeXuat.findthanhVien)


module.exports = router