const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions')
const orderRN = require('../../controllers/raonhanh365/order');

// đặt hàng
<<<<<<< HEAD
router.post('/order',formData.parse(),functions.checkToken,orderRN.order)
=======
router.post('/order',functions.checkToken,orderRN.order)
>>>>>>> 424b8297bfc10b98bbd5dd66734cb03cb961a441

// đấu thầu
router.post('/bidding',formData.parse(),functions.checkToken,orderRN.bidding)

// quản lý đơn mua
router.get('/manageOrderBuy/:linkTitle',functions.checkToken,orderRN.manageOrderBuy)

// quản lý đơn bán
router.get('/manageOrderSell/:linkTitle',functions.checkToken,orderRN.manageOrderSell)

// trạng thái đơn hàng
router.post('/statusOrder',functions.checkToken,orderRN.statusOrder)

// Huỷ đơn hàng
router.post('/cancelOrder',formData.parse(),functions.checkToken,orderRN.cancelOrder)
module.exports = router;