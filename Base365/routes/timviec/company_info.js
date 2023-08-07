const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions')
const CompanyInfo = require('../../controllers/timviec/company_info');

router.patch('/userCompanyMulti', formData.parse(), functions.checkToken, CompanyInfo.editUserCompanyMulti);

router.post('/userCompanyAddressBranch', formData.parse(), functions.checkToken, CompanyInfo.createUserCompanyAddressBranch);

router.patch('/userCompanyAddressBranch', formData.parse(), functions.checkToken, CompanyInfo.editUserCompanyAddressBranch);

router.delete('/userCompanyAddressBranch/:index', formData.parse(), functions.checkToken, CompanyInfo.deleteUserCompanyAddressBranch);

module.exports = router;