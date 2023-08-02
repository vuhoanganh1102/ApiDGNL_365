const express = require('express');
const formData = require('express-form-data');
const router = express.Router();
const functions = require('../../services/functions')
const CompanyInfo = require('../../controllers/timviec/company_info');


router.get('/userCompanyMulti', formData.parse(), functions.checkToken, CompanyInfo.getUserCompanyMulti);

router.get('/userCompanyAddressBranch', formData.parse(), functions.checkToken, CompanyInfo.getUserCompanyAddressBranch);

router.patch('/userCompanyMulti', formData.parse(), functions.checkToken, CompanyInfo.getUSCIDFromToken, CompanyInfo.editUserCompanyMulti);

router.patch('/userCompanyAddressBranch', formData.parse(), functions.checkToken, CompanyInfo.getUSCIDFromToken, CompanyInfo.editUserCompanyAddressBranch);


module.exports = router;