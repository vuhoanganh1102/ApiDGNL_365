const express = require('express');
const router = express.Router();
const data = require('express-form-data');
const edit_Controller = require('../../../controllers/vanthu/DeXuat/edit_deXuat');
router.put('/edit_delType/:id/:delType', data.parse(), edit_Controller.edit_del_type);


router.put('/edit_active/:id/:active', data.parse(), edit_Controller.edit_active);
module.exports = router;