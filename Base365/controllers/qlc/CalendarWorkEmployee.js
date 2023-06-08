const calEmp = require("../../models/qlc/CalendarWorkEmployee")
const functions = require("../../services/functions")
//lấy tất cả lịch làm việc nhân viên
exports.getAllCalendarEmp = async (req, res) => {
    await functions.getDatafind(calEmp, {})
        .then((calendars) => functions.success(res, "Get data successfully", calendars))
        .catch((err) => functions.setError(res, err.message));
};
//lấy danh sách lịch làm việc của nhân viên theo id
exports.getCalendarById = async (req, res) => {

    try {
        const _id = req.params.id;
        console.log(_id)
        // const companyID = req.user.data.companyID
        const data = await functions.getDatafindOne(calEmp, { _id: _id });
        console.log(data)
        if (data) {
            return await functions.success(res, 'Lấy lich thành công', data);
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };

}

//lấy danh sách lịch làm việc của nhân viên theo cty
exports.getAllCalendarEmpByCom = async (req, res) => {
    const companyID = req.user.data.companyID
    console.log(companyID)
    if (!companyID) {
        await functions.setError(res, 'thiếu dữ liệu công ty')
    } else {
        const data = await functions.getDatafind(calEmp, { companyID :companyID })
        console.log(data)
        if(!data){
            return  functions.setError(res,"không tìm thấy lịch làm việc cuẩ công ty")
        }else{
            return  functions.success(res,"lấy dữ liệu thành công", {data})
        }
    }
}

//tạo danh sách lịch làm việc cho nhân viên
exports.createCalEmp = async (req,res)=>{
    // const email = req.user.data.email;
    const {employeeID ,companyID ,calendarID , timeApply, Detail ,shiftID } = req.body;
    if(!employeeID) {
        functions.setError(res,"employeeID required")
    }else if (isNaN(employeeID)){
        functions.setError(res,"employeeID must be a number ")
    }else if (!companyID) {
        functions.setError(res,"companyID required")
    }else if (isNaN(companyID) ){
        console.log(companyID)
        functions.setError(res,"companyID not a number")
    }else if (!calendarID) {
        functions.setError(res,"calendarID required")
    }else if (isNaN(calendarID)){
        functions.setError(res,"calendarID not a number")
    }else if (!timeApply) {
        functions.setError(res,"timeApply required")
    }else {
        let maxID = await functions.getMaxID(calEmp);
            if(!maxID){
                maxID = 0
            }
        

        const tApply = timeApply != 0 ? new Date(timeApply *1000) : null
        const empCal = new calEmp({
            _id : Number(maxID) + 1,
            employeeID: employeeID,
            companyID :companyID,
            calendarID :calendarID,
            shiftID: shiftID,
            timeApply: tApply,
            Detail: Detail
        })
        await empCal.save()
        .then(()=>{functions.success(res,'creat successful',{empCal})})
        .catch(err=>functions.setError(res,err.message,509))
    }
};
//sửa danh sách 
exports.editCalendar = async (req, res) => {

    const _id = req.body.id;
      console.log(_id)
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const { companyID, calendarID, timeApply, employeeID, Detail, } = req.body;

        if(!employeeID) {
            functions.setError(res,"employeeID required")
        }else if (isNaN(employeeID)){
            functions.setError(res,"employeeID must be a number ")
        }else if (!companyID) {
            functions.setError(res,"companyID required")
        }else if (isNaN(companyID) ){
            console.log(companyID)
            functions.setError(res,"companyID not a number")
        }else if (!calendarID) {
            functions.setError(res,"calendarID required")
        }else if (isNaN(calendarID)){
            functions.setError(res,"calendarID not a number")
        }else if (!timeApply) {
            functions.setError(res,"timeApply required")
        }else {
            
            const tApply = timeApply != 0 ? new Date(timeApply *1000) : null

            const calendar = await functions.getDatafindOne(calEmp, { _id: _id });
            console.log(calendar)
            if (!calendar) {
                functions.setError(res, "Calendar does not exist");
            } else {
                await functions.getDatafindOneAndUpdate(calEmp, { _id: _id }, {
                    employeeID: employeeID,
                    companyID :companyID,
                    calendarID :calendarID,
                    timeApply: tApply,
                    Detail: Detail
                })
                    .then((data) => functions.success(res, "Calendar edited successfully",data))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
}
//Xóa một lịch làm việc đã có sẵn
 
exports.deleteCalendar = async (req, res) => {
    const _id = req.body.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendar = await functions.getDatafindOne(calEmp, { _id: _id });
        if (!calendar) {
            functions.setError(res, "Calendar does not exist");
        } else {
            await functions.getDataDeleteOne(calEmp, { _id: _id })
                .then(() => functions.success(res, "Delete calendar successfully", calendar))
                .catch((err) => functions.setError(res, err.message));
        }
    }
}
//Xóa toàn bộ lịch làm việc của một công ty

exports.deleteCompanyCalendar = async (req, res) => {
    const { companyID } = req.body;
    console.log(companyID)
    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (typeof companyID == "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        const calendars = await functions.getDatafind(calEmp, { companyID: companyID });
        console.log(calendars)
        if (!calendars) {
            await functions.setError(res, "No calendars found in this company");
        } else {
            await calEmp.deleteMany({ companyID: companyID })
                .then(() => functions.success(res, "Calendars deleted successfully", calendars))
                .catch((err) => functions.setError(res, err.message))
        }
    }
}
//Xóa toàn bộ lịch làm việc của hệ thống

exports.deleteAllCalendars = async (req, res) => {
    if (!await functions.getMaxID(calEmp)) {
        functions.setError(res, "No Calendar existed")
    } else {
        calEmp.deleteMany()
            .then(() => functions.success(res, "Delete all calendars successfully"))
            .catch(err => functions.setError(res, err.message))
    }
};

