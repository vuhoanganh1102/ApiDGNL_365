const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions')
const Credits = require('../../controllers/timviec/credits');

/**
 * Route này dùng cho admin nạp tiền sau khi nhận được chuyển khoản của khách hàng
 */
// router.post('/topup', formData.parse(), Credits.topupCredits);
/**
 * Chỗ này đáng ra phải dùng middleware để nối vào cùng với route của làm mới ứng viên, route này chỉ để
 * demo, không nên sử dụng cho production
 */
router.post('/payToRefreshCandidate', formData.parse(), functions.checkToken,/*Dùng cái này =>*/Credits.useCredits(2000), Credits.success);
/** Đổi điểm thành tiền */ 
router.post('/exchangePoints', formData.parse(), functions.checkToken, Credits.exchangePointToCredits);

/** Kiểm tra tiền trong tài khoản */
router.get('/balance', formData.parse(), functions.checkToken, Credits.getCreditBalance);
/** Lịch sử dùng tiền
 *  0: Sử dụng tiền
 *  1: Nạp tiền
 *  2: Đổi tiền từ điểm
 */
router.get('/history', formData.parse(), functions.checkToken, Credits.getCreditsHistory);
/** Lịch sử điểm uy tín */
router.get('/points', formData.parse(), functions.checkToken, Credits.getPresPointHistory);
/** Lịch sử đổi điểm uy tín */
router.get('/exchangeHistory', formData.parse(), functions.checkToken, Credits.getCreditExchangeHistory);

module.exports = router;