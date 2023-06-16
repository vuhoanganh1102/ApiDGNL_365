const express = require('express');
const router = express.Router();
const textBook = require('../../controllers/tools/vanthu');
var formData = require('express-form-data');
const functions = require('../../services/functions');

router.get('/TextBook', textBook.tool_textBook);
module.exports = router;