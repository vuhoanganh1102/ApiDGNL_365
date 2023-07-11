const Shifts = require('../../models/qlc/Shifts');
const functions = require("../../services/functions");
//lấy danh sách ca làm việc
exports.getListShifts = async(req, res) => {
    try {
        const com_id = req.user.data.idQLC;
        const list = await Shifts.find({
            com_id: com_id
        }).sort({ _id: -1 });
        return functions.success(res, 'Danh sách ca làm việc của công ty', { list });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//lấy danh sách ca làm việc theo id
exports.getShiftById = async(req, res) => {
    try {
        const { shift_id } = req.body;

        if (shift_id) {
            const shift = await Shifts.findOne({
                shift_id: shift_id
            }).lean();
            if (shift) {
                return functions.success(res, "Lấy thông tin thành công", { shift });
            }
            return functions.setError(res, "Không tồn tại ca làm việc", 404);
        }
        return functions.setError(res, "Bạn chưa truyền lên id ca làm việc");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
//API lấy danh sách ca làm việc theo Id công ty
exports.getShiftByComId = async(req, res) => {
    const com_id = req.user.data.com_id;
    if (!com_id) {
        functions.setError(res, "Company id required");
    } else if (isNaN(com_id)) {
        functions.setError(res, "Company id must be a number");
    } else {
        await functions.getDatafind(Shifts, { com_id: com_id })
            .then((shifts) => functions.success(res, "Get shift's data successfully", shifts))
            .catch(err => functions.setError(res, err.message, 623));
    }
};

exports.createShift = async(req, res) => {
    try {
        const { shift_name, start_time, end_time, start_time_latest, end_time_earliest, shift_type, num_to_calculate, num_to_money } = req.body;
        if (req.user.data.type == 1) {
            const com_id = req.user.data.idQLC;
            if (shift_name && start_time && end_time && shift_type) {
                const check = await Shifts.findOne({ shift_name: shift_name, com_id: com_id }).lean();
                if (!check) {
                    const max = await Shifts.findOne({}, {},{ sort: {shift_id: -1 }}).lean() || 0;
                    const item = new Shifts({
                        shift_id: Number(max.shift_id) + 1 || 1,
                        com_id: com_id,
                        shift_name: shift_name,
                        start_time: start_time,
                        start_time_latest: start_time_latest,
                        end_time: end_time,
                        end_time_earliest: end_time_earliest,
                        shift_type: shift_type,
                        num_to_calculate: num_to_calculate,
                        num_to_money: num_to_money,
                    });
                    await item.save();
                    return functions.success(res, 'tạo ca làm việc thành công');
                }
                return functions.setError(res, "Ca làm việc này đã được tạo");
            }
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        }
        return functions.setError(res, "Tài khoản không thể thực hiện chức năng này");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.editShift = async(req, res) => {
    try {
        if (req.user.data.type == 1) {
            const { shift_id, shift_name, start_time, end_time, start_time_latest, end_time_earliest, shift_type, num_to_calculate, num_to_money } = req.body;
            const com_id = req.user.data.idQLC;
            if (shift_id) {
                const shift = await functions.getDatafindOne(Shifts, { shift_id: shift_id });
                if (shift) {
                    await Shifts.updateOne({ shift_id: shift_id, com_id: com_id }, {
                        $set: {
                            shift_name: shift_name,
                            start_time: start_time,
                            end_time: end_time,
                            start_time_latest: start_time_latest,
                            end_time_earliest: end_time_earliest,
                            shift_type: shift_type,
                            num_to_calculate: num_to_calculate,
                            num_to_money: num_to_money,
                        }
                    });
                    return functions.success(res, "Cập nhật thành công");
                }
                return functions.setError(res, "Ca làm việc không tồn tại");
            }
            return functions.setError(res, "Chưa truyền id ca làm việc");
        }
        return functions.setError(res, "Tài khoản không thể thực hiện chức năng này");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}



exports.deleteShift = async(req, res) => {
    const _id = req.params.id;
    if (!functions.checkNumber(_id)) {
        functions.setError(res, "Id must be a number", 621);
    } else {
        const shift = await functions.getDatafindOne(Shifts, { _id: _id });
        if (!shift) {
            functions.setError(res, "Shifts does not exist");
        } else {
            functions.getDataDeleteOne(Shifts, { _id: _id })
                .then(() => functions.success(res, "Delete shift successfully", shift))
                .catch((err) => functions.setError(res, err.message));
        }
    }
}

exports.deleteShiftCompany = async(req, res) => {
    const { com_id } = req.body;

    if (!com_id) {
        functions.setError(res, "Company id required");
    } else if (isNaN(com_id)) {
        functions.setError(res, "Company id must be a number");
    } else {
        const shifts = await functions.getDatafind(Shifts, { com_id: com_id });
        if (!shifts) {
            functions.setError(res, "No shifts found in this company");
        } else {
            await Shifts.deleteMany({ com_id: com_id })
                .then(() => functions.success(res, "Shifts deleted successfully", shifts))
                .catch((err) => functions.setError(res, err.message));
        }
    }



}

exports.deleteAllShifts = async(req, res) => {
    if (!await functions.getMaxID(Shifts)) {
        functions.setError(res, "No shift existed");
    } else {
        Shifts.deleteMany()
            .then(() => functions.success(res, "Delete all shifts sucessfully"))
            .catch(err => functions.setError(err, err.message));
    }
}