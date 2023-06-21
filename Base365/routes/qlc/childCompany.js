const router = require('express').Router();
const CompanyController = require('../../controllers/qlc/childCompany')
const formData = require('express-form-data')
const functions= require ("../../services/functions")

//API lấy tất cả dữ liệu cty 
router.post("/",formData.parse(),CompanyController.getListCompany);

//API lấy dữ liệu một cty
// router.get("/:id",CompanyController.getCompanyById);

//API tạo mới một cty
router.post("/create",formData.parse(),CompanyController.createCompany);

//API thay dổi thông tin của một cty
router.post("/edit",formData.parse(),CompanyController.editCompany);

// //API xóa một cty theo id
// router.delete("/:id",CompanyController.deleteCompany);

// // API xóa toàn bộ cty hiện có
// router.delete("/",CompanyController.deleteAllCompanys);

module.exports = router