const express = require('express');
var router = express.Router();
const formData = require('express-form-data');

const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');

router.post('/postNew', formData.parse(), newRN.postNewMain, newRN.postNewElectron);

router.get('/getNewsBeforeLogin', newRN.getNewsBeforeLogin);

router.get('/searchNews', newRN.searchNews);

module.exports = router;