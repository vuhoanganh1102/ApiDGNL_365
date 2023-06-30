const router = require('express').Router();
const functions = require('../../../services/functions')
const homeController = require('../../../controllers/vanthu/QuanLyCongVan/homeController')

// get data trang chủ site quản lý công văn
router.get('/index',functions.checkToken,homeController.index)
module.exports = router;