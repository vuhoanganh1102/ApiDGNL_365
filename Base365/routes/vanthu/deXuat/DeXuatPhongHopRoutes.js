const router = require('express').Router();
const deXuatPhongHopRoute = require("../../../controllers/vanthu/DeXuat/DeXuatPhongHop")
const formData = require("express-form-data");


// thêm mới dxtc
router.post('/addDxPh',formData.parse(),deXuatPhongHopRoute.dxPhongHop)


module.exports = router