var express = require('express');
var router = express.Router();
var cv = require('../../controllers/timviec/cv');

router.get('/', cv.index);

module.exports = router;