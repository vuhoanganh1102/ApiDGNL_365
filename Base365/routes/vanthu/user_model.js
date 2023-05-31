const express = require('express');
const router = express.Router();
const userModel = require("../../controllers/tools/vanthu");

router.get('/UserModel', userModel.tool_userModel);
module.exports = router;