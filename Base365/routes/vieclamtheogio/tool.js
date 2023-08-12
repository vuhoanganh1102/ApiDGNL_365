var express = require('express');
var router = express.Router();
var toolVLTG =  require('../../controllers/vieclamtheogio/toolVLTG');

router.post('/job_category', toolVLTG.job_category);

module.exports = router;