const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');



router.post('/postNew', formData.parse(), newRN.postNewMain, newRN.postNewElectron);


// tìm kiếm tin
router.get('/searchNew/:link', newRN.searchNew);
//------------------------api lien quan den tin ban---------------------------
router.post('/createSellNews', formData.parse(),[functions.checkToken], newRN.postNewMain, newRN.postNewsGeneral, newRN.createNews);
router.put('/updateSellNews', formData.parse(),[functions.checkToken], newRN.postNewMain, newRN.postNewsGeneral, newRN.updateNews);
router.delete('/deleteNews',[functions.checkToken, functions.isAdminRN365], newRN.deleteNews);
router.post('/searchSellNews', formData.parse(), newRN.searchSellNews);
router.post('/hideNews', formData.parse(), [functions.checkToken], newRN.hideNews);
router.post('/pinNews', formData.parse(), [functions.checkToken], newRN.pinNews);
router.post('/pushNews', formData.parse(), [functions.checkToken], newRN.pushNews);


// trang chủ 
router.get('/getNewBeforeLogin', newRN.getNewBeforeLogin);

// tạo mới tin mua
router.post('/createBuyNew',formData.parse(), functions.checkToken, newRN.createBuyNew)

// update tin mua
router.put('/updateBuyNew',formData.parse(), functions.checkToken, newRN.updateBuyNew)


// chi tiết tin 
router.get('/getDetailNew/:linkTitle',newRN.getDetailNew)

// yêu thích tin
router.post('/loveNew',functions.checkToken,newRN.loveNew)

router.get('/createToken',newRN.createToken)

// danh sách tin đã yêu thích
router.get('/newfavorite/:linkTitle',functions.checkToken,newRN.newfavorite)

// quản lí tin mua
router.get('/managenew/:linkTitle',functions.checkToken,newRN.managenew)

// quản lí tin bán
router.get('/manageNewBuySell/:linkTitle',functions.checkToken,newRN.manageNewBuySell)

// tin đang dự thầu
router.get('/newisbidding/:linkTitle',functions.checkToken,newRN.newisbidding)

// danh sách danh mục cha va con
router.post('/getListCate',formData.parse(), newRN.getListCate);

// quản lí tin tìm ứng viên
router.get('/listCanNew/:linkTitle',functions.checkToken,newRN.listCanNew)

// quản lí đang ứng tuyển
// router.get('/listJobNewApply',functions.checkToken,newRN.listJobNewApply)

// quản lý tin tìm việc làm
router.get('/listJobNew/:linkTitle',functions.checkToken,newRN.listJobNew)

//api thich tin
router.post('/likeNews', formData.parse(), functions.checkToken, newRN.likeNews);

router.post('/candiApply', formData.parse(),functions.checkToken, newRN.createApplyNews);

router.delete('/deleteCandiApply',functions.checkToken, newRN.deleteUv);

<<<<<<< HEAD
// danh sách giảm giá
router.get('/manageDiscount', formData.parse(),functions.checkToken, newRN.manageDiscount);

// thêm giảm giá
router.post('/addDiscount', formData.parse(),functions.checkToken, newRN.addDiscount);

// bình luận
router.post('/comment', formData.parse(),functions.checkToken, newRN.comment);

// sửa bình luận
router.put('/updateComment', formData.parse(),functions.checkToken, newRN.updateComment);



=======
>>>>>>> 424b8297bfc10b98bbd5dd66734cb03cb961a441
module.exports = router;