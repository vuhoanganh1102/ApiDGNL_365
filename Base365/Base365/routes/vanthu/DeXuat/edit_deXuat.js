const express = require('express');
const router = express.Router();
const data = require('express-form-data');
const edit_Controller = require('../../../controllers/vanthu/DeXuat/edit_deXuat');
const functions = require('../../../services/functions');

router.post('/edit_active',functions.checkToken,data.parse(), edit_Controller.edit_active);
router.post('/duyet_de_xuat_tam_ung',functions.checkToken,data.parse(), edit_Controller.duyet_de_xuat_tam_ung);

module.exports = router;