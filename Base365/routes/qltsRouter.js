var express = require('express');
var router = express.Router();
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
<<<<<<< HEAD
const nhomTsRouter = require('./qlts/nhomTaiSanRouter')
=======
var capPhat = require('./qlts/CapPhat.js')
var ThuHoi = require('./qlts/ThuHoi.js')
>>>>>>> a8bc31a5397217c1749139574c25474a9f586736

//Api tool quét data
router.use('/tool',toolData)

//Api tài sản
router.use('/taisan',taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);

//Api nhóm tài sản
router.use('/nhomts',nhomTsRouter)



module.exports = router