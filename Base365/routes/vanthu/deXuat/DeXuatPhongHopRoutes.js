const router = require('express').Router();
const deXuatPhongHopRoute = require("../../../controllers/vanthu/DeXuat/DeXuatPhongHop")
const formData = require("express-form-data");
const funtions = require('../../../services/functions');

// thêm mới dxtc
router.post('/addDxPh',funtions.checkToken,formData.parse(),deXuatPhongHopRoute.dxPhongHop)


module.exports = router