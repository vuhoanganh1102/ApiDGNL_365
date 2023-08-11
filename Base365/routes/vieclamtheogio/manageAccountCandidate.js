var express = require('express');
var router = express.Router();
var manageAccountCandidate = require('../../controllers/vieclamtheogio/manageAccountCandidate');
var formData = require('express-form-data');
const functions = require('../../services/functions');

//lay ra thong tin cong viec mong muon
router.post('/getCongViecMongMuon', formData.parse(), functions.checkToken, manageAccountCandidate.getCongViecMongMuon);

module.exports = router;