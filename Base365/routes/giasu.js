var express = require('express');
var router = express.Router();

var account = require('./giasu/updateInfo');
var post = require('./giasu/postNews');
var tool =  require('./giasu/tools');
var tutorRouter = require('./giasu/tutor')


router.use('/account', account);
<<<<<<< HEAD
router.use('/tutor',tutorRouter)
=======
router.use('/post', post);
>>>>>>> 2286414875f61458284cc020fd7869492aeba420
router.use('/tool', tool);

module.exports = router;