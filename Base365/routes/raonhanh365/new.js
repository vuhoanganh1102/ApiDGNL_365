const express = require('express');
var router = express.Router();
const formData = require('express-form-data');

const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');

const {  uploadFileImage } = require('../../services/functions.js');

router.post('/postNew', formData.parse(), newRN.postNewMain, newRN.postNewElectron);

router.get('/getNewBeforeLogin', newRN.getNewBeforeLogin);

router.get('/searchNew', newRN.searchNew);

router.post('/createBuyNew',functions.checkToken, uploadFileImage.any(), newRN.createBuyNew)
module.exports = router;