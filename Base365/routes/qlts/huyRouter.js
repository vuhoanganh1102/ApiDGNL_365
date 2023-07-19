var express = require('express');
var router = express.Router();
const controller = require("../../controllers/qlts/huyController")
const formData = require("express-form-data")
const functions = require('../../services/functions');

// tạo đề xuất tài sản huỷ
router.post('/createAssetProposeCancel',functions.checkToken,formData.parse(),controller.createAssetProposeCancel)

// danh sách đề xuất tài sản huỷ
router.post('/getDataAssetProposeCancel',functions.checkToken,formData.parse(),controller.getDataAssetProposeCancel)

// duyệt đề xuất tài sản huỷ
router.post('/approveAssetDisposal',functions.checkToken,formData.parse(),controller.approveAssetDisposal)

// từ chối đề xuất tài sản huỷ
router.post('/rejectAssetDisposal',functions.checkToken,formData.parse(),controller.rejectAssetDisposal)

// xoá đề xuất tài sản huỷ
router.post('/deleteAssetDisposal',functions.checkToken,formData.parse(),controller.deleteAssetDisposal)

// chi tiết đề xuất tài sản huỷ
router.get('/detailAssetDisposal',functions.checkToken,controller.detailAssetDisposal)

// chỉnh sửa đề xuất tài sản huỷ
router.put('/updateAssetDisposal',functions.checkToken,formData.parse(),controller.updateAssetDisposal)
module.exports = router