const Calendar = require("../../models/qlc/Calendar");
const functions = require("../../services/functions");

exports.getAllCalendar = async(req, res) => {
    await functions.getDatafind(Calendar, {})
        .then((calendars) => functions.success(res, "Get data successfully", calendars))
        .catch((err) => functions.setError(res, err.message));
};

exports.getAllCalendarCompany = async(req, res) => {
    const { compnayId } = req.body

    if (!compnayId) {
        functions.setError(res, "Company Id required")
    } else if (typeof compnayId !== "number") {
        functtions.setError(res, "Company Id must be a number");
    } else {
        const calendar = await functions.getDatafind(Calendar, { companyId: compnayId })
        if (!calendar) {
            functions.setError(res, "Calendar cannot be found or does not exist");
        } else {
            functions.success(res, "Calendar found", calendar)
        }
    }
};

exports.getCalendarById = async(req, res) => {
    const _id = req.params.id

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendars = await functions.getDatafindOne(Calendar, { _id: _id });
        if (!calendars) {
            functions.setError(res, "Calendar cannot be found or does not exist");
        } else {
            funtions.success(res, "Get calendar successfully", calendars);
        }
    }
};

exports.createCalendar = async(req, res) => {
    const { companyId, calendarName, idCalendarWork, timeApply, timeStart, calendarDate } = req.body;

    if (!companyId) {
        functions.setError(res, "Company id required");
    } else if (typeof companyId === "number") {
        functions.setError(res, "Company id must be a number");
    } else if (!calendarName) {
        functions.setErroe(res, "Calendar name required");
    } else if (!idCalendarWork) {
        functions.setError(res, "Calendar work required");
    } else if (typeof idCalendarWork !== "number") {
        functions.setError(res, "Calendar work must be a number")
    } else if (!Number.isInteger(idCalendarWork) || idCalendarWork <= 0 || idCalendarWork >= 3) {
        funtions.setError(res, "Calendar is invalid");
    } else if (!timeApply) {
        functions.setError(res, "Time apply required");
    } else if (!timeStart) {
        funtions.setError(res, "Time start required");
    } else if (timeApply.getMonth() !== timeStart.getMonth()) {
        functions.setError(res, "Time start must be in the same month as time apply");
    } else if (!calendarDate) {
        functions.setError(res, "Calendar required");
    } else {
        let maxId = await functions.getMaxID(Shift);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;

        const workCalendar = ""
        if (idCalendarWork === 1) {
            workCalendar = "Thứ 2 - thứ 6";
        }
        if (idCalendarWork === 2) {
            workCalendar = "Thứ 2 - thứ 7";
        }
        if (idCalendarWork === 3) {
            workCalendar = "Thứ 2 - thứ CN";
        }

        const calendar = new Calendar({
            _id: _id,
            companyId: companyId,
            calendarName: calendarName,
            idCalendarWork: idCalendarWork,
            workCalendar: workCalendar,
            timeApply: timeApply,
            timeStart: timeStart,
            isCopy: false,
            timeCopy: null,
            calendar: calendarDate
        })

        await calendar.save()
            .then(() => {
                functions.success(res, "Calendar saved successfully", calendar);
            })
            .catch(err => functions.setError(res, err.message));
    }
}

exports.editCalendar = async(req, res) => {

    const _id = req.params.id;

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const { companyId, calendarName, idCalendarWork, timeApply, timeStart, calendarDate } = req.body;

        if (!companyId) {
            functions.setError(res, "Company id required");
        } else if (typeof companyId === "number") {
            functions.setError(res, "Company id must be a number");
        } else if (!calendarName) {
            functions.setErroe(res, "Calendar name required");
        } else if (!idCalendarWork) {
            functions.setError(res, "Calendar work required");
        } else if (typeof idCalendarWork !== "number") {
            functions.setError(res, "Calendar work must be a number")
        } else if (!Number.isInteger(idCalendarWork) || idCalendarWork <= 0 || idCalendarWork >= 3) {
            funtions.setError(res, "Calendar is invalid");
        } else if (!timeApply) {
            functions.setError(res, "Time apply required");
        } else if (!timeStart) {
            funtions.setError(res, "Time start required");
        } else if (timeApply.getMonth() !== timeStart.getMonth()) {
            functions.setError(res, "Time start must be in the same month as time apply");
        } else if (!calendarDate) {
            functions.setError(res, "Calendar required");
        } else {
            if (idCalendarWork === 1) {
                workCalendar = "Thứ 2 - thứ 6";
            }
            if (idCalendarWork === 2) {
                workCalendar = "Thứ 2 - thứ 7";
            }
            if (idCalendarWork === 3) {
                workCalendar = "Thứ 2 - thứ CN";
            }
            const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
            if (!calendar) {
                functions.setError(res, "Calendar does not exist");
            } else {
                await functions.getDatafindOneAndUpdate(Calendar, { _id: _id }, {
                        companyId: companyId,
                        calendarName: calendarName,
                        idCalendarWork: idCalendarWork,
                        workCalendar: workCalendar,
                        timeApply: timeApply,
                        timeStart: timeStart,
                        isCopy: false,
                        timeCopy: null,
                        calendar: calendarDate
                    })
                    .then(() => functions.success(res, "Calendar edited successfully", shift))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
}

exports.copyCalendar = async(req, res) => {
    const _id = req.params.id;

    if (functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
        if (!calendar) {
            functions.setError(res, "Calendar does not exist");
        } else {
            let maxId = await functions.getMaxID(Shift);
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
                    functions.success(res, "Calendar copied successfully", calendar);
                })
                .catch(err => functions.setError(res, err.message));
        }
    }
}

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

exports.deleteCompanyCalendar = async(req, res) => {
    const { companyId } = req.body;

    if (!companyId) {
        functions.setError(res, "Company id required");
    } else if (typeof companyId !== "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        const calendars = await functions.getDatafind(Calendar, { companyId: companyId });
        if (!calendars) {
            functions.setError(res, "No calendars found in this company");
        } else {
            await Calendar.deleteMany({ companyId: companyId })
                .then(() => functions.success(res, "Calendars deleted successfully", calendars))
                .catch((err) => functions.setError(res, err.message))
        }
    }
}

exports.deleteAllCalendars = async(req, res) => {
    if (!await functions.getMaxID(Calendar)) {
        functions.setError(res, "No Calendar existed")
    } else {
        Calendar.deleteMany()
            .then(() => functions.success(res, "Delete all calendars successfully"))
            .catch(err => functions.setError(res, err.message))
    }
};