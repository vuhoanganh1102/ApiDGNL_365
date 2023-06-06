const router = require('express').Router();
const deXuatPhongHopRoute = require("../../../controllers/vanthu/DeXuat/DeXuatPhongHop")
const formData = require("express-form-data");
const functions = require('../../../services/functions')

// thêm mới dxtc
router.post('/addDxPh',formData.parse(),functions.checkToken,deXuatPhongHopRoute.dxPhongHop)


module.exports = router