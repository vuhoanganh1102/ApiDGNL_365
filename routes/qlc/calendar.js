const router = require('express').Router();

const CalendarController = require("../../controllers/qlc/calendar")

//Lấy danh sách toàn bộ lịch làm việc
router.get("/", CalendarController.getAllCalendar);

//:ấy danh sách lịch làm việc của một công ty
router.get("/company/all", CalendarController.getAllCalendarCompany)

//Lấy thông tin của 1 lịch làm việc
router.get("/:id", CalendarController.getCalendarById)

//Tạo một lịch làm việc mới
router.post("/", CalendarController.createCalendar)

//Chỉnh sửa một lịch làm việc đã có sẵn
router.post("/:id", CalendarController.editCalendar)

//Copy một lịch làm việc đã có sẵn
router.post("/copy/:id", CalendarController.copyCalendar)

//Xóa một lịch làm việc đã có sẵn
router.delete("/:id", CalendarController.deleteCalendar)

//Xóa toàn bộ lịch làm việc của một công ty
router.delete("/company/all", CalendarController.deleteCompanyCalendar)

//Xóa toàn bộ lịch làm việc của hệ thống
router.delete("/", CalendarController.deleteAllCalendars)

module.exports = router