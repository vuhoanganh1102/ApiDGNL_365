var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerViTriTs =  require('../../controllers/qlts/viTriTaiSan');


//Api thêm mới
router.post('/add',formData.parse(),controllerViTriTs.addViTriTaiSan)

//Api hiển thị
router.post('/list',formData.parse(),controllerViTriTs.showViTriTs)


module.exports = router