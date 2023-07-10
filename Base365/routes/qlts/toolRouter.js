var express = require('express');
var router = express.Router();
var formData = require('express-form-data');
const toolQLTS =  require('../../controllers/tools/qlts');


//Api tool quét data Lâm
router.post('/bao_duong',toolQLTS.toolBaoDuong)
router.post('/loaitaisan',toolQLTS.toolLoaits)
router.post('/taisan',toolQLTS.toolTaisan)
router.post('/vitrits',toolQLTS.toolViTriTS)
router.post('/nhomts',toolQLTS.toolNhomts)
router.post('/tsvitri',toolQLTS.toolTSvitri)

module.exports = router