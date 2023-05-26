const express = require('express');
var router = express.Router();
const formData = require('express-form-data');

const functions = require('../../services/functions')
const newRN = require('../../controllers/raonhanh365/new');

router.post('/postNew', newRN.postNewMain, newRN.postNewElectron);

module.exports = router;