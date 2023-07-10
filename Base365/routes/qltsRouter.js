var express = require('express');
var router = express.Router();
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
var capPhat = require('./qlts/CapPhat.js')

//Api tool quét data
router.use('/tool',toolData)


//Api tài sản
router.use('/taisan',taisanRouter)
router.use('/CapPhat', capPhat);



module.exports = router