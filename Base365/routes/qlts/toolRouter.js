var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const toolQLTS =  require('../../controllers/tools/qlts');


//Api tool quét data Lâm
router.post('/bao_duong',toolQLTS.toolBaoDuong)


module.exports = router