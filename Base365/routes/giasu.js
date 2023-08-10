var express = require('express');
var router = express.Router();

var account = require('./giasu/updateInfoParent');
var tool =  require('./giasu/tools');
var tutorRouter = require('./giasu/tutor')


router.use('/account', account);
router.use('/tutor',tutorRouter)
router.use('/tool', tool);

module.exports = router;