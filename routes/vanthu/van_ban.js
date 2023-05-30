const express = require('express');
const router = express.Router();
const vanBan = require('../../controllers/tools/vanthu');

router.get('/Vanban', vanBan.tool_VanBan);
module.exports = router;