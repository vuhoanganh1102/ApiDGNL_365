var express = require('express');
var router = express.Router();
const toolData = require('./toolRouter')

//Api tool 
router.use('/tool',toolData)

module.exports = router