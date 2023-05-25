const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions');

const syll = require('../../controllers/timviec/syll');

//lấy danh sách các mẫu syll
router.post('/getSYLL', formData.parse(), syll.getSYLL);

// xem trước syll
router.post('/previewSYLL', formData.parse(), syll.previewSYLL);

//xem chi tiết syll
router.post('/detailSYLL', formData.parse(), functions.checkToken, syll.detailSYLL);

//lưu syll
router.post('/saveSYLL', functions.checkToken, formData.parse(), functions.decrypt, syll.saveSYLL);

// tạo mới mẫu SYLL
router.post('/createSYLL', functions.checkToken, functions.uploadImgKhoAnh.single('image'), syll.createSYLL);

// sửa mẫu SYLL - findSYLL & updateSYLL
router.post('/findSYLL', functions.checkToken, formData.parse(), syll.findSYLL);
router.post('/updateSYLL', functions.checkToken, functions.uploadImgKhoAnh.single('image'), syll.updateSYLL);

// xóa mẫu SYLL
router.post('/deleteSYLL', functions.checkToken, formData.parse(), syll.deleteSYLL);

module.exports = router;