const router = require('express').Router();
const CompanyController = require('../../controllers/qlc/childCompany')

//API lấy tất cả dữ liệu phòng ban 
router.get("/",CompanyController.getListCompany);

//API lấy dữ liệu một phòng ban
router.get("/:id",CompanyController.getCompanyById);

//API tạo mới một phòng ban
router.post("/",CompanyController.createCompany);

//API thay dổi thông tin của một phòng ban
router.post("/:id",CompanyController.editCompany);

//API xóa một phòng ban theo id
router.delete("/:id",CompanyController.deleteCompany);

// API xóa toàn bộ phòng ban hiện có
router.delete("/",CompanyController.deleteAllCompanys);

module.exports = router
