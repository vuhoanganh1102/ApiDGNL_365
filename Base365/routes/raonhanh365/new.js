const express = require('express');
var router = express.Router();
const formData = require('express-form-data');

const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');

const {  uploadFileImage } = require('../../services/functions.js');

router.post('/postNew', formData.parse(), newRN.postNewMain, newRN.postNewElectron);

router.get('/getNewBeforeLogin', newRN.getNewBeforeLogin);

// tìm kiếm tin
router.get('/searchNew', newRN.searchNew);
//------------------------api lien quan den tin ban---------------------------
router.post('/createSellNews', formData.parse(),[functions.checkToken], newRN.postNewMain, newRN.postNewsGeneral, newRN.createNews);
router.put('/updateSellNews', formData.parse(),[functions.checkToken], newRN.postNewMain, newRN.postNewsGeneral, newRN.updateNews);
router.delete('/deleteNews',[functions.checkToken, functions.isAdminRN365], newRN.deleteNews);
router.post('/searchSellNews', formData.parse(), newRN.searchSellNews);
router.post('/hideNews', formData.parse(), [functions.checkToken], newRN.hideNews);


// tạo mới tin mua
router.post('/createBuyNew',formData.parse(), functions.checkToken, newRN.createBuyNew)

// update tin mua
router.put('/updateBuyNew',formData.parse(), functions.checkToken, newRN.updateBuyNew)

// lấy tất cả tin bán
router.get('/getAllNew/:sort/:page',newRN.getAllNew)

// lấy tất cả tin mua
router.get('/getAllBuyNew/:sort/:page',newRN.getAllNew)

// chi tiết tin bán
router.get('/getDetailNew',newRN.getDetailNew)

// chi tiết tin mua
router.get('/getDetailBuyNew',newRN.getDetailBuyNew)

// yêu thích tin
router.post('/loveNew',functions.checkToken,newRN.loveNew)

// cập nhật thông tin user
router.put('/updateInfoUserRaoNhanh',formData.parse(),functions.checkToken,newRN.updateInfoUserRaoNhanh)
module.exports = router;