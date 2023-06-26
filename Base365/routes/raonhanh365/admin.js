var express = require('express');
var router = express.Router();
var admin = require('../../controllers/raonhanh365/admin');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const serviceRN = require('../../services/rao nhanh/raoNhanh');
var adminPayment = require('../../controllers/raonhanh365/admin/verifyPayment');
var adminTagsIndex = require('../../controllers/raonhanh365/admin/tagAndIndex');
var news = require('../../controllers/raonhanh365/new');
var blog = require('../../controllers/raonhanh365/blog');

//------------------------------------------------api quan ly tai khoan admin
router.post('/account/createAcc', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.loginAdminUser);
router.post('/account/getListAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListAdminUser);
router.post('/account/createAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(27, 2)],admin.getAndCheckDataAdminUser, admin.createAdminUser);
router.put('/account/updateAdmin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(27, 3)], admin.getAndCheckDataAdminUser, admin.updateAdminUser);

//------------------------------------------------api quan ly danh muc
router.post('/category/getListCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListCategory);
router.post('/category/createCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(15, 2)], admin.getAndCheckDataCategory, admin.createCategory);
router.put('/category/updateCate', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(15, 3)], admin.getAndCheckDataCategory, admin.updateCategory);

//------------------------------------------------api quan ly tin(tin rao vat, tin mua)
router.post('/news/getListNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListNews);
router.put('/news/updateNews', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 3)], admin.getAndCheckDataNews, admin.updateNews);
router.delete('/news/deleteNews', [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 4)], admin.deleteNews);
router.post('/news/pinNews', formData.parse(),[functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 3)], news.pinNews);
router.post('/news/pushNews', formData.parse(),[functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(14, 3)], news.pushNews);

//------------------------------------------------api quan ly bang gia(gia ghim gian hang)
router.post('/priceList/getListPriceList', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListPriceList);
// router.post('/priceList/updatePriceList', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.updatePriceList);

//------------------------------------------------api lich su nap the---------------------------------------------------
router.post('/history/getListHistory', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListHistory);

//------------------------------------------------api quan ly tai khoan(tai khoan chua xac thuc va da xac thuc)
router.post('/user/getListUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListUser);
router.put('/user/updateUser', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(23, 3)], admin.getAndCheckDataUser, admin.updateUser);
router.delete('/user/deleteUser', [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(23, 4)], admin.deleteUser);

//------------------------------------------------api blog
router.post('/blog/getListBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.getListBlog);
router.post('/blog/createBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(37, 2)], admin.getAndCheckDataBlog, admin.createBlog);
router.put('/blog/updateBlog', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(37, 3)], admin.getAndCheckDataBlog, admin.updateBlog);

//------------------------------------------------api xac thuc thanh toan dam bao
router.post('/payment/getUserVerifyPayment', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], adminPayment.getListUserVerifyPayment);
router.put('/payment/verifyPayment', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(35, 3)], adminPayment.adminVerifyPayment);

//-----------------------------------------------api nguoi mua xac nhan thanh toan
router.post('/order/getListOrderPayment', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], adminPayment.getListOrderPayment);
router.put('/order/verifyOrder', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(34, 3)], adminPayment.adminVerifyOrder);

//----------------------------------------------api tags index
router.post('/tagsIndex', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], adminTagsIndex.getListTagsIndex);



//------------------------------------------------api giá ghim tin đăng
//api danh sách và tìm kiếm giá ghim tin đăng
router.post('/priceList/getListPricePin', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getListNewWithPin );

//api thêm mới giá ghim tin đăng
router.post('/priceList/createPricePin',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(32, 2)],admin.createNewWithPin);

//api sửa giá tin đăng
router.put('/priceList/putPricePin/:id',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(32, 3)],admin.putNewWithPin);



//------------------------------------------------api giá đẩy tin đăng
//api danh sách và tìm kiếm Giá đẩy tin đăng
router.post('/priceList/getListPricePush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365],admin.getListPushNew );

//api thêm mới giá đẩy tin đăng
router.post('/priceList/getListPricePush', formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(33, 2)],admin.createNewWithPush );

//api sửa giá đẩy tin đăng dựa vào id
router.put('/priceList/getListPricePush/:id',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(33, 3)], admin.putNewWithPin);


//------------------------------------------------api danh sách lỗi đăng ki
//api danh sách lỗi đăng ký
router.post('/failRegisterUser',formData.parse(), [functions.checkToken, serviceRN.isAdminRN365], admin.failRegister);

//------------------------------------------------api báo cáo tin
// api tạo mới tin báo cáo
router.post('/newReportt',formData.parse(),[functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(31, 2)], admin.createReport);
// api danh sách và tìm kiếm báo cáo tin
router.post('report/listReport',formData.parse(),[functions.checkToken, serviceRN.isAdminRN365], admin.getListNewReports);
// api sửa tin dựa vào param
router.post('report/fixNewReport/:id',formData.parse(),[functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(31, 3)], admin.fixNewReport);


//------------------------------------------------api chiết khấu nạp thẻ
// api tạo mới chiết khấu nạp thẻ
router.post('/discountCreate',formData.parse(),[functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(39, 2)], admin.createDiscount);
// api lấy ra danh sách và tìm kiếm chiết khấu nap thẻ
router.post('/discountCard',formData.parse(),[functions.checkToken, serviceRN.isAdminRN365], admin.getListDiscountCard);
// api update chiết khấu nạp thẻ
router.post('/updateDiscountCard/:id',formData.parse(),[functions.checkToken, serviceRN.isAdminRN365, serviceRN.checkRight(39, 3)], admin.updateDiscount);

router.post('/createTokenAdmin',formData.parse(), blog.createToken);
router.post('/createTokenUser',formData.parse(), blog.createTokenUser);

module.exports = router;

