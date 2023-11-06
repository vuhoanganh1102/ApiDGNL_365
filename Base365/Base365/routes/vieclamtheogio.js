var express = require('express');
var router = express.Router();
var manageAccountCandidate = require('./vieclamtheogio/manageAccountCandidate');
var toolVLTG = require('./vieclamtheogio/tool');

router.use('/tool', toolVLTG);

router.use('/manageAccountCandidate', manageAccountCandidate);

module.exports = router