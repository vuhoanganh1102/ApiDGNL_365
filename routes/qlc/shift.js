const router = require('express').Router();

const ShiftController = require('../../controllers/qlc/shift')

//API lấy toàn bộ danh sách ca làm việc
router.get("/", ShiftController.getListShifts)

//API lấy ca làm việc theo id
// router.get("/:id", ShiftController.getShiftById)

//API lấy danh sách ca làm việc theo Id công ty
router.get("/all/company", ShiftController.getShiftByComId)

//API tạo một ca làm việc mới
router.post("/", ShiftController.createShift)

//API chỉnh sửa thông tin của một ca làm việc
router.post("/:id", ShiftController.editShift)

//API xóa một ca làm việc theo Id
router.delete("/:id", ShiftController.deleteShift)

//API xóa toàn bộ ca làm việc của một công ty
router.delete("/all/company", ShiftController.deleteShiftCompany)

//API xóa toàn bộ ca làm việc đã có trong hệ thống
router.delete("/", ShiftController.deleteAllShifts)

module.exports = router