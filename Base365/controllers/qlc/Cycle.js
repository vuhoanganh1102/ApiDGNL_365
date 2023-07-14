const Cycle = require("../../models/qlc/Cycle");
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
            const cy_id = req.body.cy_id ;
            let condition = {}
            let total_emp = {}

                if (cy_id) condition.cy_id = cy_id
                if (com_id) condition.com_id = com_id
                const data = await Cycle.find(condition).lean();
                if (data) {
                    const calendarID = data.map(item => item.cy_id);
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
        const { cy_name, status, apply_month, is_personal, cy_detail } = req.body;
        if (com_id&&cy_name&&apply_month) {
            let maxId = await Cycle.findOne({},{},{sort : {cy_id : -1}}).lean() || 0;
            const cy_id = Number(maxId.cy_id) + 1 || 1 ;
            const tCreate = apply_month != 0 ? new Date(apply_month * 1000) : null
            const calendar = new Cycle({
                cy_id: cy_id,
                com_id: com_id,
                cy_name: cy_name,
                status: status,
                apply_month: tCreate,
                cy_detail: cy_detail,
                is_personal : is_personal,
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
        const cy_id = req.body.cy_id;
        if (type == 1) {

            const {cy_name, status, apply_month, is_personal, cy_detail } = req.body;

                const calendar = await functions.getDatafindOne(Cycle, { cy_id: cy_id });
                if (calendar) {
                    await functions.getDatafindOneAndUpdate(Cycle, { cy_id: cy_id }, {
                            com_id: com_id,
                            cy_name: cy_name,
                            status: status,
                            apply_month: Date.parse(apply_month),
                            is_personal: is_personal,
                            cy_detail: cy_detail
                        })
                        return functions.success(res, "sửa thành công ", {calendar})
                    }
                    return functions.setError(res, "lịch không tồn tại");
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
        const cy_id = req.body.cy_id;
        if (type == 1) {
            const calendar = await functions.getDatafindOne(Cycle, {com_id: com_id, cy_id: cy_id });
            if (calendar) {
                let maxId = await Cycle.findOne({},{},{sort : {cy_id : -1}}).lean() || 0;
                const newId = Number(maxId.cy_id) + 1  ;
                const newCalendar = new Cycle({
                    ...calendar,
                    _id: undefined,
                    cy_id: newId,
                })
                await newCalendar.save()
                      return functions.success(res, "copy thành công", {newCalendar});
                }
                return functions.setError(res, "lịch không tồn tại");
            }
            return functions.setError(res, "Tài khoản không phải Công ty");
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
        const cy_id = req.body.cy_id;
        if (type == 1) {
            const calendar = await functions.getDatafindOne(Cycle, {com_id: com_id, cy_id: cy_id });
            if (calendar) {
                await functions.getDataDeleteOne(Cycle, {com_id: com_id, cy_id: cy_id })
                return functions.success(res, "xóa thành công", {calendar})
            }
            return functions.setError(res, "lịch làm việc không tồn tại");
    }
    return functions.setError(res, "Tài khoản không phải Công ty");
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

            const calendars = await functions.getDatafind(Cycle, { com_id: com_id });
            if (calendars) {
                await Cycle.deleteMany({ com_id: com_id })
                return functions.success(res, "xóa thành công", {calendars})
            }
            return functions.setError(res, "lịch làm việc không tồn tại");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
    }
