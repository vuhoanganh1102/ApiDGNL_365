const Calendar = require("../../models/qlc/Calendar");
const functions = require("../../services/functions");
//Lấy danh sách toàn bộ lịch làm việc
exports.getAllCalendar = async(req, res) => {
    await functions.getDatafind(Calendar, {})
        .then((calendars) => functions.success(res, "Get data successfully", calendars))
        .catch((err) => functions.setError(res, err.message));
};
//:ấy danh sách lịch làm việc của một công ty

exports.getAllCalendarCompany = async(req, res) => {
    const  companyID = req.body.companyID

    if (!companyID) {
       await functions.setError(res, "Company Id required")
    } else if (typeof companyID !== "number") {
       await functions.setError(res, "Company Id must be a number");
    } else {
        const calendar = await functions.getDatafind(Calendar, { companyID: companyID })
        if (!calendar) {
            functions.setError(res, "Calendar cannot be found or does not exist");
        } else {
            functions.success(res, "Calendar found", calendar)
        }
    }
};
//Lấy thông tin của 1 lịch làm việc

exports.getCalendarById = async(req, res) => {
    const _id = req.params.id

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendars = await functions.getDatafindOne(Calendar, { _id: _id });
        if (!calendars) {
            functions.setError(res, "Calendar cannot be found or does not exist");
        } else {
            functions.success(res, "Get calendar successfully", calendars);
        }
    }
};
//Tạo một lịch làm việc mới

exports.createCalendar = async(req, res) => {
    const { companyID, calendarName, idCalendarWork, timeApply, timeStart, calendarDetail } = req.body;

    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (typeof companyID === "number") {
        functions.setError(res, "Company id must be a number");
    } else if (!calendarName) {
        functions.setError(res, "Calendar name required");
    } else if (!idCalendarWork) {
        functions.setError(res, "Calendar work required");
    } else if (!timeApply) {
        functions.setError(res, "Time apply required");
    } else if (!timeStart) {
        functions.setError(res, "Time start required");
    // } else if (getMonth(timeApply) !== getMonth(timeStart)) {
    //     functions.setError(res, "Time start must be in the same month as time apply");
    // } else if (!calendarDetail) {
    //     functions.setError(res, "calendarDetail required");
    } else {
        let maxId = await functions.getMaxID(Calendar);
        if (!maxId) {
            maxId = 0;
        }
        const   _id = Number(maxId) + 1;
        const   tCreate = timeApply != 0 ? new Date(timeApply * 1000) : null,
                tUpdate = timeStart != 0 ? new Date(timeStart * 1000) : null

        const calendar = new Calendar({
            _id: _id,
            companyID: companyID,
            calendarName: calendarName,
            idCalendarWork: idCalendarWork,
            timeApply: tCreate,
            timeStart: tUpdate,
            isCopy: false,
            timeCopy: null,
            calendarDetail: calendarDetail
        })

        await calendar.save()
            .then(() => {
                functions.success(res, "Calendar saved successfully", calendar);
            })
            .catch(err => functions.setError(res, err.message));
    }
}
//Chỉnh sửa một lịch làm việc đã có sẵn

exports.editCalendar = async(req, res) => {

    const _id = req.params.id;

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const { companyID, calendarName, idCalendarWork, timeApply, timeStart, calendarDetail } = req.body;

        if (!companyID) {
            functions.setError(res, "Company id required");
        } else if (typeof companyID === "number") {
            functions.setError(res, "Company id must be a number");
        } else if (!calendarName) {
            functions.setError(res, "Calendar name required");
        } else if (!idCalendarWork) {
            functions.setError(res, "Calendar work required");
        } else if (typeof idCalendarWork !== "number") {
            functions.setError(res, "Calendar work must be a number")
        } else if (!Number.isInteger(idCalendarWork) || idCalendarWork <= 0 || idCalendarWork >= 3) {
            functions.setError(res, "Calendar is invalid");
        } else if (!timeApply) {
            functions.setError(res, "Time apply required");
        } else if (!timeStart) {
            funtions.setError(res, "Time start required");
        } else if (timeApply.getMonth() !== timeStart.getMonth()) {
            functions.setError(res, "Time start must be in the same month as time apply");
        } else if (!calendarDetail) {
            functions.setError(res, "Calendar required");
        } else {
            const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
            if (!calendar) {
                functions.setError(res, "Calendar does not exist");
            } else {
                await functions.getDatafindOneAndUpdate(Calendar, { _id: _id }, {
                        companyID: companyID,
                        calendarName: calendarName,
                        idCalendarWork: idCalendarWork,
                        timeApply: timeApply,
                        timeStart: timeStart,
                        isCopy: false,
                        timeCopy: null,
                        calendarDetail: calendarDetail
                    })
                    .then(() => functions.success(res, "Calendar edited successfully", shift))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
}
//Copy một lịch làm việc đã có sẵn

exports.copyCalendar = async(req, res) => {
    const _id = req.params.id;

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
        if (!calendar) {
            functions.setError(res, "Calendar does not exist");
        } else {
            let maxId = await functions.getMaxID(Calendar);
            if (!maxId) {
                maxId = 0;
            }
            const newId = Number(maxId) + 1;
            const newCalendar = new Calendar({
                ...calendar,
                _id: newId,
            })

            await newCalendar.save()
                .then(() => {
                    functions.success(res, "Calendar copied successfully", newCalendar);
                })
                .catch(err => functions.setError(res, err.message));
        }
    }
}
//Xóa một lịch làm việc đã có sẵn

exports.deleteCalendar = async(req, res) => {
    const _id = req.params.id;

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
        if (!calendar) {
            functions.setError(res, "Calendar does not exist");
        } else {
            await functions.getDataDeleteOne(Calendar, { _id: _id })
                .then(() => functions.success(res, "Delete calendar successfully", calendar))
                .catch((err) => functions.setError(res, err.message));
        }
    }
}
//Xóa toàn bộ lịch làm việc của một công ty

exports.deleteCompanyCalendar = async(req, res) => {
    const { companyID } = req.body;

    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (typeof companyID !== "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        const calendars = await functions.getDatafind(Calendar, { companyID: companyID });
        if (!calendars) {
            functions.setError(res, "No calendars found in this company");
        } else {
            await Calendar.deleteMany({ companyID: companyID })
                .then(() => functions.success(res, "Calendars deleted successfully", calendars))
                .catch((err) => functions.setError(res, err.message))
        }
    }
}
//Xóa toàn bộ lịch làm việc của hệ thống

exports.deleteAllCalendars = async(req, res) => {
    if (!await functions.getMaxID(Calendar)) {
        functions.setError(res, "No Calendar existed")
    } else {
        Calendar.deleteMany()
            .then(() => functions.success(res, "Delete all calendars successfully"))
            .catch(err => functions.setError(res, err.message))
    }
};