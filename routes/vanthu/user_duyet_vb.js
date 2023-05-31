const express = require('express');
const router = express.Router();
const nguoiDuyetVanBan = require('../../controllers/tools/vanthu');

router.get('/NguoiDuyetVanBan', nguoiDuyetVanBan.tool_NguoiDuyetVB);
module.exports = router;