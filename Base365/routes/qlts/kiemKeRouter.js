var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const kiemKeController = require('../../controllers/qlts/kiemKeController');
const functions = require('../../services/functions');

router.post('/create', functions.checkToken, formData.parse(), [kiemKeController.getAndCheckData, kiemKeController.create]);
router.post('/update', functions.checkToken,  formData.parse(), [kiemKeController.getAndCheckData, kiemKeController.update]);
router.post('/danhSachKiemKe', functions.checkToken, formData.parse(), kiemKeController.danhSachKiemKe);
router.post('/delete', functions.checkToken, formData.parse(), kiemKeController.delete);
router.post('/duyet', functions.checkToken, formData.parse(), kiemKeController.duyet);
router.post('/chitiet', functions.checkToken, formData.parse(), kiemKeController.chiTiet);

module.exports = router;