const express = require('express');
const router = express.Router();
const thongBao = require('../../controllers/tools/vanthu');

router.get('/ThongBao', thongBao.tool_ThongBao);
module.exports = router;