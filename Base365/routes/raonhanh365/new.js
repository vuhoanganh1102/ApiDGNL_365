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

// tạo mới tin mua
router.post('/createBuyNew',functions.checkToken, uploadFileImage.any(), newRN.createBuyNew)

// update tin mua
router.put('/updateBuyNew',functions.checkToken, uploadFileImage.any(), newRN.updateBuyNew)
module.exports = router;