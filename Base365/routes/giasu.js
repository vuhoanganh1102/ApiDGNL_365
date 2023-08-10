var express = require('express');
var router = express.Router();

var account = require('./giasu/updateInfoParent');
var tool =  require('./giasu/tools');

router.use('/account', account);
router.use('/tool', tool);

module.exports = router;