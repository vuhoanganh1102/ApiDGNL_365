var express = require('express');
var router = express.Router();
const toolData = require('./toolRouter')
const SuaChua = require('./SuaChua_BaoDuong/SuaChua');
//Api tool 
router.use('/tool', toolData);



//Tinh
router.use('/QLTS/SuaChua', SuaChua);
module.exports = router