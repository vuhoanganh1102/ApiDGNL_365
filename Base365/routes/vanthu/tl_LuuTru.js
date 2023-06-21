const express = require('express');
const router = express.Router();
const tl_LuuTru = require('../../controllers/tools/vanthu');

var formData = require('express-form-data');

const functions = require('../../services/functions');

router.get('/TaiLieuluuTru', tl_LuuTru.tool_tlLuuTru);
module.exports = router;