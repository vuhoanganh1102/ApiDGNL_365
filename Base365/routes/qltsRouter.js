var express = require('express');
var router = express.Router();
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
var capPhat = require('./qlts/CapPhat.js')
var ThuHoi = require('./qlts/ThuHoi.js')

//Api tool quét data
router.use('/tool',toolData)


//Api tài sản
router.use('/taisan',taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);



module.exports = router