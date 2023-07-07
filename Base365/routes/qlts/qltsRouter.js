var express = require('express');
var router = express.Router();
const toolData = require('./toolRouter')



var capPhat = require('./CapPhat.js')

//Api tool 
router.use('/tool',toolData)
router.use('/CapPhat', capPhat);

module.exports = router