var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const kiemKeController = require('../../controllers/qlts/kiemKeController');

router.post('/create', formData.parse(), [kiemKeController.getAndCheckData, kiemKeController.create]);
router.post('/update', formData.parse(), [kiemKeController.getAndCheckData, kiemKeController.update]);
router.post('/danhSachKiemKe', formData.parse(), kiemKeController.danhSachKiemKe);
router.post('/delete', formData.parse(), kiemKeController.delete);
router.post('/duyet', formData.parse(), kiemKeController.duyet);

module.exports = router;