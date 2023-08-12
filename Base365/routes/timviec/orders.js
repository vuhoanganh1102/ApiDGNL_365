const express = require('express');
const router = express.Router();
const orders = require('../../controllers/timviec/orders');
const formData = require('express-form-data');
const functions = require('../../services/functions')

//Đặt hàng
router.post('/placeOrder', formData.parse(), functions.checkToken, orders.orderProduct);

module.exports = router;