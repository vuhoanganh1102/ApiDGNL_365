const Calendar = require("../../models/qlc/Calendar");
const functions = require("../../services/functions");
const Users = require("../../models/Users");

// const shiftID = require("../../models/Users")
//Lấy danh sách toàn bộ lịch làm việc
exports.getAllCalendar = async (req, res) => {
    await functions.getDatafind(Calendar, {})
        .then((calendars) => functions.success(res, "Get data successfully", calendars))
        .catch((err) => functions.setError(res, err.message));
};
exports.getShiftById = async (req, res) => {

    const _id = req.body.id;
    const companyID = req.body.companyID
    if((_id && companyID) == undefined){
        functions.setError(res, "input required", 621);
    }else if (isNaN(_id && companyID)) {
        functions.setError(res, "Id must be a number", 621);
    } else {
        const shift = await functions.getDatafindOne(Shifts, { _id: _id, companyID:companyID });
        if (shift) {
            functions.success(res, "Get data successfully", shift);
        } else {
            functions.setError(res, "Shifts cannot be found or does not exist", 622);
        }
    }
};
exports.getShiftByComId = async (req, res) => {

    const companyID = req.body.companyID;
    console.log(companyID)
    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if ( isNaN(companyID)) {
        functions.setError(res, "Company id must be a number");
    } else {
        await functions.getDatafind(Shifts, { companyID: companyID })
            .then((shifts) => functions.success(res, "Get shift's data successfully", shifts))
            .catch(err => functions.setError(res, err.message, 623));
    }


};
exports.getTrackingtime = async (req,res)=>{


    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let companyID = request.companyID,
            CreateAt = request.CreateAt || true
            inputNew = request.inputNew 
            inputOld = request.inputOld



        if((companyID && CreateAt && inputNew && inputOld )==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            // const data = await Tracking.find({companyID: companyID, CreateAt: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            const data = await Tracking.find({companyID: companyID, CreateAt: { $gte: inputOld , $lte: inputNew } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };


}
//:ấy danh sách lịch làm việc của một công ty
exports.getAllCalendarCompany = async (req, res) => {

    try {
        const companyID = req.body.companyID;
        const calendarID = req.body.calendarID;
        const numberUser = await functions.findCount(Users,{ "inForPerson.companyID":companyID , "inForPerson.calendarID": calendarID, type: 2})

        const data = await functions.getDatafind(Calendar, { companyID: companyID  });
        if (data) {
            return await functions.success(res, 'Lấy lich thành công', {data,numberUser});
        };
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };

}

//Lấy thông tin của 1 lịch làm việc

exports.getCalendarById = async (req, res) => {
  
    try {
        const _id = req.params.id;
        console.log(_id)
        // const companyID = req.user.data.companyID
        const data = await functions.getDatafindOne(Calendar, { _id: _id });
        console.log(data)
        // const data = await Calendar.findOne({ _id: _id }).select(" companyID calendarName idCalendarWork").exec();
        if (data) {
            return await functions.success(res, 'Lấy lich thành công', data);
        };
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };

}
//Tạo một lịch làm việc mới

exports.createCalendar = async (req, res) => {
    const { companyID, calendarName, idCalendarWork, timeApply, timeStart, calendarDetail,shiftID } = req.body;

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
        const _id = Number(maxId) + 1;
        const tCreate = timeApply != 0 ? new Date(timeApply * 1000) : null,
              tUpdate = timeStart != 0 ? new Date(timeStart * 1000) : null

        const calendar = new Calendar({
            _id: _id,
            companyID: companyID,
            shiftID: shiftID||0,
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

exports.editCalendar = async (req, res) => {

    const _id = req.body.id;
      console.log(_id)
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const { companyID, calendarName, idCalendarWork, timeApply, timeStart, calendarDetail,shiftID } = req.body;

        if (!companyID) {
            functions.setError(res, "Company id required");
        } else if (typeof companyID === "number") {
            functions.setError(res, "Company id must be a number");
        } else if (!calendarName) {
            functions.setError(res, "Calendar name required");
        } else if (!idCalendarWork) {
            functions.setError(res, "Calendar work required");
        // } else if (typeof idCalendarWork !== "number") {
        //     functions.setError(res, "Calendar work must be a number")
        // } else if (!Number.isInteger(idCalendarWork) || idCalendarWork <= 0 || idCalendarWork >= 3) {
        //     functions.setError(res, "Calendar is invalid");
        } else if (!timeApply) {
            functions.setError(res, "Time apply required");
        } else if (!timeStart) {
            funtions.setError(res, "Time start required");
        // } else if (timeApply.getMonth() !== timeStart.getMonth()) {
            functions.setError(res, "Time start must be in the same month as time apply");
        // } else if (!calendarDetail) {
        //     functions.setError(res, "Calendar required");
        } else {
            const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
            console.log(calendar)
            if (!calendar) {
                functions.setError(res, "Calendar does not exist");
            } else {
                await functions.getDatafindOneAndUpdate(Calendar, { _id: _id }, {
                    companyID: companyID,
                    shiftID: shiftID || 0,
                    calendarName: calendarName,
                    idCalendarWork: idCalendarWork,
                    timeApply: timeApply,
                    timeStart: timeStart,
                    isCopy: false,
                    timeCopy: null,
                    calendarDetail: calendarDetail
                })
                    .then((data) => functions.success(res, "Calendar edited successfully",data))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
}
//Copy một lịch làm việc đã có sẵn

exports.copyCalendar = async (req, res) => {
    const _id = req.body.id;

    if (isNaN(_id)) {
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

exports.deleteCalendar = async (req, res) => {
    const _id = req.body.id;

    if (isNaN(_id)) {
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

exports.deleteCompanyCalendar = async (req, res) => {
    const { companyID } = req.body;
    console.log(companyID)
    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (typeof companyID == "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        const calendars = await functions.getDatafind(Calendar, { companyID: companyID });
        console.log(calendars)
        if (!calendars) {
            await functions.setError(res, "No calendars found in this company");
        } else {
            await Calendar.deleteMany({ companyID: companyID })
                .then(() => functions.success(res, "Calendars deleted successfully", calendars))
                .catch((err) => functions.setError(res, err.message))
        }
    }
}
//Xóa toàn bộ lịch làm việc của hệ thống

exports.deleteAllCalendars = async (req, res) => {
    if (!await functions.getMaxID(Calendar)) {
        functions.setError(res, "No Calendar existed")
    } else {
        Calendar.deleteMany()
            .then(() => functions.success(res, "Delete all calendars successfully"))
            .catch(err => functions.setError(res, err.message))
    }
};