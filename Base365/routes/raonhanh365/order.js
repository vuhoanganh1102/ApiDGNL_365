const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions')
const orderRN = require('../../controllers/raonhanh365/order');

// đặt hàng
router.post('/order',formData.parse(),functions.checkToken,orderRN.order)

// đấu thầu
router.post('/bidding',formData.parse(),functions.checkToken,orderRN.bidding)

// quản lý đơn mua
router.get('/manageOrderBuy/:linkTitle',functions.checkToken,orderRN.manageOrderBuy)


module.exports = router;