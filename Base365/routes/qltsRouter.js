var express = require('express');
var router = express.Router();
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
var capPhat = require('./qlts/CapPhat.js')
var ThuHoi = require('./qlts/ThuHoi.js')
var nhomTsRouter = require('./qlts/nhomTaiSanRouter')
//Api tool quét data
router.use('/tool',toolData)

//Api tài sản
router.use('/taisan',taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);

//Api nhóm tài sản
router.use('/nhomts',nhomTsRouter)



module.exports = router