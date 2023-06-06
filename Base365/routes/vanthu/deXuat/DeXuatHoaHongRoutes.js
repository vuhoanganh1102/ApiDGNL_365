const router = require('express').Router();
const dexuatHoaHong = require('../../../controllers/vanthu/DeXuat/DeXuatHoaHong')
const funtions = require('../../../services/functions');

const formData = require('express-form-data');

//Api them moi hoa hong doanh thu

router.post('/addDXHH',formData.parse(),funtions.checkToken,dexuatHoaHong.dxHoaHong)

module.exports = router

