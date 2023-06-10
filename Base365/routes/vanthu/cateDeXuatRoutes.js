const router = require('express').Router();
const cateDeXuat = require('../../controllers/vanthu/CateDeXuat/cateDeXuat');
var formData = require('express-form-data');
router.get('/',cateDeXuat.showCateDX)

module.exports = router