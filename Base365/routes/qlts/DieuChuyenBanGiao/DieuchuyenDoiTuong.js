const router = require('express').Router();
const formData = require('express-form-data');
const controllers = require('../../../controllers/qlts/dieu_chuyen_ban_giao/DieuChuyenDoiTuongSuDung');
const functions = require('../../../services/functions');


//Api đổ ra danh sách
router.post('/list', functions.checkToken, formData.parse(), controllers.showDieuChuyenDoiTuong);

module.exports = router;