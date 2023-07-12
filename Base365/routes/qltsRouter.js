var express = require('express');
var router = express.Router();
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
const nhomTsRouter = require('./qlts/nhomTaiSanRouter')
var capPhat = require('./qlts/CapPhat.js')
var ThuHoi = require('./qlts/ThuHoi.js')
var mat = require('./qlts/matRouter')
var huy = require('./qlts/huyRouter')


//Api tool quét data
router.use('/tool',toolData)

//Api tài sản
router.use('/taisan',taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);

//Api nhóm tài sản
router.use('/nhomts',nhomTsRouter)

//API mất huỷ thanh lý
router.use('/mat',mat)
router.use('/huy',huy)
module.exports = router