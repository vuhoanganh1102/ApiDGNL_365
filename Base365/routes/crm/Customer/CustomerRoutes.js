const express = require('express');
const router = express.Router();
var formData = require('express-form-data');
const CustomerRoutes = require('../../../controllers/crm/Customer/Customer');

router.post('/addCustomer', formData.parse(),CustomerRoutes.addCustomer);
module.exports = router;