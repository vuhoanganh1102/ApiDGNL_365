

const router = require('express').Router();
const employeeController = require('../../controllers/qlc/employee.controller');

//-----------------------------------API crud-----------------------------------
//API tao moi nhan vien
router.post("/",employeeController.createEmployee);

//API lay danh sach tat ca nhan vien hoac lay ra 1 nhan vien theo idQLC;
router.get("/",employeeController.getEmployee);

//API thay doi thong tin nhan vien
router.put("/",employeeController.editEmployee);

//API xoa nhan vien theo idQLC
router.delete("/", employeeController.deleteEmployee);

//-------------------------------API search by fields-------------------------------
//search by experience
router.post("/emp_exp", employeeController.getListEmployeeByExp);
//by education
router.post("/emp_edu", employeeController.getListEmployeeByEducation);
//by depID
router.post("/emp_dep", employeeController.getListEmployeeByDepartment);
//by position ID
router.post("/emp_pos", employeeController.getListEmployeeByPosition);
//by phone
router.post("/emp_birthday", employeeController.getListEmployeeByBirthday);


module.exports = router