const router = require('express').Router();
const functions = require('../../../services/functions')
const contractController = require('../../../controllers/vanthu/QuanLyCongVan/contractController')

// get data trang chủ site quản lý công văn
router.post('/getListVanBan',functions.checkToken,contractController.index)
module.exports = router;