const router = require('express').Router();

const CalendarController = require("../../controller/qlc/calendar")

router.get("/", CalendarController.getAllCalendar);

router.get("/company/all", CalendarController.getAllCalendarCompany)

router.get("/:id", CalendarController.getCalendarById)

module.exports = router