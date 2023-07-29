const express = require('express');
const router = express.Router();


const test = require("../routes/tinhluong/test")
const nhanvien = require("../routes/tinhluong/nhanvien")

router.use('/test', test);
router.use('/nhanvien', nhanvien);


module.exports = router