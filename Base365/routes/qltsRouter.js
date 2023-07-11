var express = require('express');
var router = express.Router();
var functions = require('../services/functions');
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
const nhomTsRouter = require('./qlts/nhomTaiSanRouter')
var capPhat = require('./qlts/CapPhat.js')
var ThuHoi = require('./qlts/ThuHoi.js')
var kiemKeRouter = require('./qlts/kiemKeRouter');

//Api tool quét data
router.use('/tool',toolData)

//Api tài sản
router.use('/taisan',taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);

//Api nhóm tài sản
router.use('/nhomts',nhomTsRouter)

//api kiem ke
router.use('/kiemKe', [functions.checkToken, functions.dataFromToken], kiemKeRouter);


module.exports = router