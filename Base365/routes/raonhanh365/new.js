const express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');



router.post('/postNew', formData.parse(), newRN.postNewMain, newRN.postNewElectron);


// tìm kiếm tin
router.get('/searchNew', newRN.searchNew);
//------------------------api lien quan den tin ban---------------------------
router.post('/createSellNews', formData.parse(),[functions.checkToken], newRN.postNewMain, newRN.postNewsGeneral, newRN.createNews);
router.put('/updateSellNews', formData.parse(),[functions.checkToken], newRN.postNewMain, newRN.postNewsGeneral, newRN.updateNews);
router.delete('/deleteNews',[functions.checkToken, functions.isAdminRN365], newRN.deleteNews);
router.post('/searchSellNews', formData.parse(), newRN.searchSellNews);
router.post('/hideNews', formData.parse(), [functions.checkToken], newRN.hideNews);



// trang chủ 
router.get('/getNewBeforeLogin', newRN.getNewBeforeLogin);

// tạo mới tin mua
router.post('/createBuyNew',formData.parse(), functions.checkToken, newRN.createBuyNew)

// update tin mua
router.put('/updateBuyNew',formData.parse(), functions.checkToken, newRN.updateBuyNew)

// lấy tất cả tin 
router.get('/getAllNew/:title/:sort/:page',newRN.getAllNew)

// chi tiết tin 
router.get('/getDetailNew/:linkTitle',newRN.getDetailNew)

// yêu thích tin
router.post('/loveNew',functions.checkToken,newRN.loveNew)

router.get('/createToken',newRN.createToken)

// danh sách tin đã yêu thích
router.get('/newfavorite/:linkTitle',functions.checkToken,newRN.newfavorite)

// quản lí tin mua
router.get('/managenewbuy/:linkTitle',functions.checkToken,newRN.managenewbuy)

// tin đang dự thầu
router.get('/newisbidding/:linkTitle',functions.checkToken,newRN.newisbidding)

// danh sách danh mục
router.get('/listCate/:link',newRN.listCate)

module.exports = router;