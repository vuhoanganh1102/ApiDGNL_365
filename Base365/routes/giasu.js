var express = require('express');
var router = express.Router();

var account = require('./giasu/updateInfo');
var post = require('./giasu/postNews');
var tool =  require('./giasu/tools');

router.use('/account', account);
router.use('/post', post);
router.use('/tool', tool);

module.exports = router;