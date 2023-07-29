const express = require('express');
const router = express.Router();


const test = require("../routes/tinhluong/test")
<<<<<<< HEAD

router.use('/test', test);

=======
const nhanvien = require("../routes/tinhluong/nhanvien")

router.use('/test', test);
router.use('/nhanvien', nhanvien);
>>>>>>> 93b2358e97ed4d1db1444e660f4cbd347d3e847d


module.exports = router