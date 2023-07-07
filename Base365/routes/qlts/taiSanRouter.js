var express = require('express');
var router = express.Router();
const formData = require('express-form-data');
const controllerTs =  require('../../controllers/qlts/taiSan');


//Api thêm mới
router.post('/add',formData.parse(),controllerTs.addTaiSan)

//Api hiển thị dữ liệu thêm mới
router.post('/showadd',formData.parse(),controllerTs.showadd)

module.exports = router