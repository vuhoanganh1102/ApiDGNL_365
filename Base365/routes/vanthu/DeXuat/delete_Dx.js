const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/vanthu/DeXuat/delete_dx');
router.post('/:id', controller.delete_dx)
module.exports = router;