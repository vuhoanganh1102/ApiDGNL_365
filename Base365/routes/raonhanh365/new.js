const express = require('express');
var router = express.Router();
const formData = require('express-form-data');

const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');

//api co the tao tat ca cac loai tin
router.post('/createSellNews', formData.parse(), newRN.postNewMain, newRN.postNewsGeneral, newRN.createNews);
router.put('/updateSellNews', formData.parse(), newRN.postNewMain, newRN.postNewsGeneral, newRN.updateNews);
router.post('/searchSellNews', formData.parse(), newRN.searchSellNews);
router.delete('/deleteNews', newRN.deleteNews);

router.get('/getNewsBeforeLogin', newRN.getNewsBeforeLogin);
router.get('/searchNews', newRN.searchNews);

module.exports = router;