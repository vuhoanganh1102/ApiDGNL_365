var express = require('express');
var router = express.Router();

// var recruitment = require('./giasu/recruitmentRoute');
var tool =  require('./giasu/tools');

// router.use('/recruitment', recruitment);
router.use('/tool', tool);

module.exports = router;