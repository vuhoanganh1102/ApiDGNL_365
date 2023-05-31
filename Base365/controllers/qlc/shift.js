const Shift = require('../../models/qlc/Shift');
const functions = require("../../services/functions");
//lấy danh sách ca làm việc
exports.getListShifts = async (req, res) => {
    await functions.getDatafind(Shift, {})
        .then((shifts) => functions.success(res, "Get shift's data successfully", shifts))
        .catch(err => functions.setError(res, err.message, 620));
};
//lấy danh sách ca làm việc theo id
exports.getShiftById = async (req, res) => {

    const _id = req.params.id;

    if (!functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number", 621);
    } else {
        const shift = await functions.getDatafindOne(Shift, { _id: _id });
        if (shift) {
            functions.success(res, "Get data successfully", shift);
        } else {
            functions.setError(res, "Shift cannot be found or does not exist", 622);
        }
    }
};

exports.getShiftByComId = async (req, res) => {

    const { companyId } = req.body;

    if (!companyId) {
        functions.setError(res, "Company id required");
    } else if (typeof companyId !== "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        await functions.getDatafind(Shift, { companyId: companyId })
            .then((shifts) => functions.success(res, "Get shift's data successfully", shifts))
            .catch(err => functions.setError(res, err.message, 623));
    }


};

exports.createShift = async (req, res) => {

    const companyId = req.body.companyId;;
    const shiftName = req.body.shiftName;
    const timeCheckIn = req.body.timeCheckIn;
    const timeCheckOut = req.body.timeCheckOut;
    const timeCheckInEarliest = req.body.timeCheckInEarliest;
    const timeCheckOutLastest = req.body.timeCheckOutLastest;
    const idTypeCalculateWork = req.body.idTypeCalculateWork;
    let numOfWorkPerShift = req.body.numOfWorkPerShift;
    let money = req.body.money;



    if (!companyId) {
        functions.setError(res, "Company id required");
    } else if (typeof companyId !== "number") {
        functions.setError(res, "Company id must be a number");
    } else if (!shiftName) {
        functions.setError(res, "Shift name required");
    } else if (!timeCheckIn) {
        functions.setError(res, "Time check in required");
    } else if (!timeCheckOut) {
        functions.setError(res, "Time check out required");
    }
    // else if (!timeCheckInEarliest) {
    //     functions.setError(res, "Time check in earliest required");
    // } else if (!timeCheckOutLastest) {
    //     functions.setError(res, "Time check out lastest required");
    // }
    else if (!idTypeCalculateWork) {
        functions.setError(res, "Id type calculation work required");
    } else {
        let typeCalculateWork = "";
        if (idTypeCalculateWork === 2) {
            if (!numOfWorkPerShift) {
                functions.setError(res, "Number of work per shift required");
                return
            } else {
                money = null;
                typeCalculateWork = "Tính công theo số ca";
            }
        } else if (idTypeCalculateWork === 3) {
            if (!money) {
                functions.setError(res, "Money of shift required");
                return
            } else {
                numOfWorkPerShift = null;
                typeCalculateWork = "Tính công theo tiền";
            }
        }

        if (idTypeCalculateWork === 1) {
            numOfWorkPerShift = null;
            money = null;
            typeCalculateWork = "Tính công theo giờ";
        }

        let maxId = await functions.getMaxID(Shift);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;
        const shift = new Shift({
            _id: _id,
            companyId: companyId,
            shiftName: shiftName,
            timeCheckIn: timeCheckIn,
            timeCheckOut: timeCheckOut,
            timeCheckInEarliest: timeCheckInEarliest,
            timeCheckOutLastest: timeCheckOutLastest,
            idTypeCalculateWork: idTypeCalculateWork,
            typeCalculateWork: typeCalculateWork,
            numOfWorkPerShift: numOfWorkPerShift,
            money: money,

        });

        await shift.save()
            .then(() => {
                functions.success(res, "Shift saved successfully", shift);
            })
            .catch(err => {
                functions.setError(res, err.message);
            })
    }

};

exports.editShift = async (req, res) => {
    const _id = req.params.id;

    if (!functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const companyId = req.body.companyId;;
        const shiftName = req.body.shiftName;
        const timeCheckIn = req.body.timeCheckIn;
        const timeCheckOut = req.body.timeCheckOut;
        const timeCheckInEarliest = req.body.timeCheckInEarliest;
        const timeCheckOutLastest = req.body.timeCheckOutLastest;
        const idTypeCalculateWork = req.body.idTypeCalculateWork;
        const numOfWorkPerShift = req.body.numOfWorkPerShift;
        const money = req.body.money;

        if (!companyId) {
            functions.setError(res, "Company id required");
        } else if (typeof companyId !== "number") {
            functions.setError(res, "Company id must be a number");
        } else if (!shiftName) {
            functions.setError(res, "Shift name required");
        } else if (!timeCheckIn) {
            functions.setError(res, "Time check in required");
        } else if (!timeCheckOut) {
            functions.setError(res, "Time check out required");
        }
        // else if (!timeCheckInEarliest) {
        //     functions.setError(res, "Time check in earliest required");
        // } else if (!timeCheckOutLastest) {
        //     functions.setError(res, "Time check out lastest required");
        // } 
        else if (!idTypeCalculateWork) {
            functions.setError(res, "Id type calculation work required");
        } else {
            if (idTypeCalculateWork === 2) {
                if (!numOfWorkPerShift) {
                    functions.setError(res, "Number of work per shift required");
                    return
                } else {
                    money = null;
                    typeCalculateWork = "Tính công theo số ca";
                }
            } else if (idTypeCalculateWork === 3) {
                if (!money) {
                    functions.setError(res, "Money of shift required");
                    return
                } else {
                    numOfWorkPerShift = null;
                    typeCalculateWork = "Tính công theo tiền";
                }
            }

            if (idTypeCalculateWork === 1) {
                typeCalculateWork = "Tính công theo giờ";
            }

            const shift = await functions.getDatafindOne(Shift, { _id: _id });
            if (!shift) {
                functions.setError(res, "Shift does not exist!");
            } else {
                await functions.getDatafindOneAndUpdate({ _id: _id }, {
                    companyId: companyId,
                    shiftName: shiftName,
                    timeCheckIn: timeCheckIn,
                    timeCheckOut: timeCheckOut,
                    timeCheckInEarliest: timeCheckInEarliest,
                    timeCheckOutLastest: timeCheckOutLastest,
                    idTypeCalculateWork: idTypeCalculateWork,
                    typeCalculateWork: typeCalculateWork,
                    numOfWorkPerShift: numOfWorkPerShift,
                    money: money
                })
                    .then((shift) => functions.success(res, "Shift edited successfully", shift))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
}

exports.deleteShift = async (req, res) => {
    const _id = req.params.id;

    if (!functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number", 621);
    } else {
        const shift = await functions.getDatafindOne(Shift, { _id: _id });
        if (!shift) {
            functions.setError(res, "Shift does not exist");
        } else {
            functions.getDataDeleteOne(Shift, { _id: _id })
                .then(() => functions.success(res, "Delete shift successfully", shift))
                .catch((err) => functions.setError(res, err.message));
        }
    }
}

exports.deleteShiftCompany = async (req, res) => {
    const { companyId } = req.body;

    if (!companyId) {
        functions.setError(res, "Company id required");
    } else if (typeof companyId !== "number") {
        functions.setError(res, "Company id must be a number");
    } else {
        const shifts = await functions.getDatafind(Shift, { companyId: companyId });
        if (!shifts) {
            functions.setError(res, "No shifts found in this company");
        } else {
            await Shift.deleteMany({ companyId: companyId })
                .then(() => functions.success(res, "Shifts deleted successfully", shifts))
                .catch((err) => functions.setError(res, err.message));
        }
    }



}

exports.deleteAllShifts = async (req, res) => {
    if (!await functions.getMaxID(Shift)) {
        functions.setError(res, "No shift existed");
    } else {
        Shift.deleteMany()
            .then(() => functions.success(res, "Delete all shifts sucessfully"))
            .catch(err => functions.setError(err, err.message));
    }
}