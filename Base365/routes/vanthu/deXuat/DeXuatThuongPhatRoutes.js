const router = require('express').Router();
const dexuatThuongPhat = require('../../../controllers/vanthu/DeXuat/DeXuatThuongPhat');
const formData = require('express-form-data');
const funtions = require('../../../services/functions');

router.post('/addDXTP',funtions.checkToken,formData.parse(),dexuatThuongPhat.dxThuongPhat)

module.exports = router