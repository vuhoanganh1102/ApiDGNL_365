var express = require('express');
var router = express.Router();
var managerEmployeeController = require('../../controllers/hr/managerEmployeeController');
var formData = require('express-form-data');
const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');

//------------------------------api module quan ly nhan vien

//api lay ra danh sach nhan vien va tim kiem
router.post('/listEmp', formData.parse(), hrService.checkRoleUser, managerEmployeeController.getListEmployee);

module.exports = router;