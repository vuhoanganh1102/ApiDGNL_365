const router = require('express').Router();
const dexuatThuongPhat = require('../../../controllers/vanthu/DeXuat/DeXuatThuongPhat');
const formData = require('express-form-data');


router.post('/addDXTP',formData.parse(),dexuatThuongPhat.dxThuongPhat)

module.exports = router