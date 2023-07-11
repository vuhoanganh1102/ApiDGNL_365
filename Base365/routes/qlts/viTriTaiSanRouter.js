var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerViTriTs =  require('../../controllers/qlts/viTriTaiSan');
const functions = require('../../services/functions')


//Api thêm mới
router.post('/add',functions.checkToken,formData.parse(),controllerViTriTs.addViTriTaiSan)

//Api hiển thị
router.post('/list',functions.checkToken,formData.parse(),controllerViTriTs.showViTriTs)


module.exports = router