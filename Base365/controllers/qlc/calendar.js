const Calendar = require("../../models/qlc/Calendar");
const CalendarOfEmp = require("../../models/qlc/CalendarWorkEmployee");
const functions = require("../../services/functions");
const Users = require("../../models/Users");

// const shift_id = require("../../models/Users")
//Lấy danh sách toàn bộ lịch làm việc

exports.getAllCalendarCompany = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
            const _id = req.body._id ;
            let condition = {}
            let total_emp = {}

                if (_id) condition._id = _id
                if (com_id) condition.com_id = com_id
                const data = await Calendar.find(condition).lean();
                if (data) {
                    const calendarID = data.map(item => item._id);
                    for (let i = 0; i < calendarID.length; i++) {
                    const cId = calendarID[i];
                        total_emp = await functions.findCount(CalendarOfEmp, { com_id: com_id, calendar_id : cId })

                    if(total_emp) data.total_emp = total_emp
                }
                    return functions.success(res, 'lấy thành công ', { data })
                }
                return functions.setError(res, 'không tìm thấy lịch làm việc')
            }
            return functions.setError(res, "Tài khoản không phải Công ty");
        } catch (error) {
            functions.setError(res, error.message);
        }
    }
    //Tạo một lịch làm việc mới

exports.createCalendar = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
        const { calendarName, typeCalender, timeApply, timeStart, calendarDetail, shift_id } = req.body;
        if (com_id&&typeCalender&&timeApply) {
            let maxId = await functions.getMaxID(Calendar);
            if (!maxId) {
                maxId = 0;
            }
            const _id = Number(maxId) + 1;
            const tCreate = timeApply != 0 ? new Date(timeApply * 1000) : null,
                tUpdate = timeStart != 0 ? new Date(timeStart * 1000) : null
            const calendar = new Calendar({
                _id: _id,
                com_id: com_id,
                shift_id: shift_id || 0,
                calendarName: calendarName,
                typeCalender: typeCalender,
                timeApply: tCreate,
                timeStart: tUpdate,
                isCopy: false,
                timeCopy: null,
                calendarDetail: calendarDetail
            })
            await calendar.save()
                   return functions.success(res, "tạo thành công", {calendar});
        }
        return functions.setError(res, "nhập thiếu thông tin", 504);
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);

} catch (error) {
    return functions.setError(res, error.message)

}
    }
    //Chỉnh sửa một lịch làm việc đã có sẵn

exports.editCalendar = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        const _id = req.body._id;
        if (type == 1) {

            const { com_id, calendarName, typeCalender, timeApply, timeStart, calendarDetail, shift_id } = req.body;

                const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
                if (calendar) {
                    await functions.getDatafindOneAndUpdate(Calendar, { _id: _id }, {
                            com_id: com_id,
                            shift_id: shift_id || 0,
                            calendarName: calendarName,
                            typeCalender: typeCalender,
                            timeApply: timeApply,
                            timeStart: timeStart,
                            isCopy: false,
                            timeCopy: null,
                            calendarDetail: calendarDetail
                        })
                        return functions.success(res, "Calendar edited successfully", {calendar})
                    }
                    return functions.setError(res, "Calendar does not exist");
            }
            return functions.setError(res, "Tài khoản không phải Công ty", 604);
        } catch (error) {
            return functions.setError(res, error.message)
        }
      
}
    //Copy một lịch làm việc đã có sẵn

exports.copyCalendar = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        const _id = req.body._id;
        if (type == 1) {
            const calendar = await functions.getDatafindOne(Calendar, {com_id: com_id, _id: _id });
            if (calendar) {
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
                      return functions.success(res, "Calendar copied successfully", {newCalendar});
                }
                return functions.setError(res, "Calendar does not exist");
            }
            return functions.setError(res, "Tài khoản không phải Công ty", 604);
        } catch (error) {
            return functions.setError(res, error.message)
        }
      
    }
    //Xóa một lịch làm việc đã có sẵn

exports.deleteCalendar = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        const _id = req.body._id;
        if (type == 1) {
            const calendar = await functions.getDatafindOne(Calendar, {com_id: com_id, _id: _id });
            if (calendar) {
                await functions.getDataDeleteOne(Calendar, {com_id: com_id, _id: _id })
                return functions.success(res, "Delete calendar successfully", {calendar})
            }
            return functions.setError(res, "Calendar does not exist");
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);
} catch (error) {
    return functions.setError(res, error.message)
}
}
    //Xóa toàn bộ lịch làm việc của một công ty

exports.deleteCompanyCalendar = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {

            const calendars = await functions.getDatafind(Calendar, { com_id: com_id });
            if (calendars) {
                await Calendar.deleteMany({ com_id: com_id })
                return functions.success(res, "Calendars deleted successfully", {calendars})
            }
            return functions.setError(res, "No calendars found in this company");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
    }
