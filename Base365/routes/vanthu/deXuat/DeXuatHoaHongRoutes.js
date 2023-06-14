const router = require('express').Router();
const dexuatHoaHong = require('../../../controllers/vanthu/DeXuat/DeXuatHoaHong')
const funtions = require('../../../services/functions');
const formData = require('express-form-data');

//Api them moi hoa hong doanh thu

router.post('/addDXHH',funtions.checkToken,formData.parse(),dexuatHoaHong.dxHoaHong)

module.exports = router

