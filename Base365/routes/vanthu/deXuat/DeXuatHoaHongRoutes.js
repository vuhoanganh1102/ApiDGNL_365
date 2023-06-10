const router = require('express').Router();
const dexuatHoaHong = require('../../../controllers/vanthu/DeXuat/DeXuatHoaHong')

const formData = require('express-form-data');

//Api them moi hoa hong doanh thu

router.post('/addDXHH',formData.parse(),dexuatHoaHong.dxHoaHong)

module.exports = router

