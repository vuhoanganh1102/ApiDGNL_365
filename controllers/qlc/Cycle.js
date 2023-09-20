const Cycle = require("../../models/qlc/Cycle");
const EmployeCycle = require("../../models/qlc/CalendarWorkEmployee");
const functions = require("../../services/functions");
const Users = require("../../models/Users");
const service = require("../../services/qlc/functions");

// const shift_id = require("../../models/Users")
//Lấy danh sách toàn bộ lịch làm việc

exports.getAllCalendarCompany = async(req, res) => {
    try {
        const com_id = req.user.data.com_id,
            type = req.user.data.type;
        if (type == 1) {
            const cy_id = req.body.cy_id;
            let condition = { com_id: com_id };
            let total_emp = {}

            if (cy_id) condition.cy_id = cy_id
            const data = await Cycle.find(condition).lean();

            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                element.cy_detail = JSON.parse(element.cy_detail);
                element.ep_count = await EmployeCycle.countDocuments({ cy_id: element.cy_id });
            }
            return functions.success(res, 'lấy thành công ', { data })
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (error) {
        functions.setError(res, error.message);
    }
}

//Tạo một lịch làm việc mới
exports.create = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const { cy_name, apply_month, cy_detail, is_personal } = req.body;
            if (cy_name && apply_month && cy_detail) {
                // Kiểm tra tên llv đã tồn tại hay chưa
                const check_cy_name = await Cycle.findOne({ cy_name: cy_name, com_id: com_id, apply_month: apply_month });
                if (!check_cy_name) {
                    // Tạo mới
                    const calendar_max = await Cycle.findOne({}, { cy_id: 1 }).sort({ cy_id: -1 }).lean();
                    const calendar = new Cycle({
                        cy_id: Number(calendar_max.cy_id) + 1,
                        com_id: com_id,
                        cy_name: cy_name,
                        apply_month: apply_month,
                        cy_detail: cy_detail,
                        is_personal: is_personal
                    })
                    await calendar.save();
                    return functions.success(res, "Lưu lịch làm việc thành công");
                }
                return functions.setError(res, "Lịch làm việc trong tháng đã tồn tại");
            }
            return functions.setError(res, "nhập thiếu tên lịch làm việc, tháng áp dụng, chi tiết");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

//Chỉnh sửa một lịch làm việc đã có sẵn
exports.edit = async(req, res) => {
        try {
            const com_id = req.user.data.com_id;
            const type = req.user.data.type;
            if (type == 1) {
                const { cy_id, cy_name, status, apply_month, is_personal, cy_detail } = req.body;
                if (cy_id && cy_name && apply_month && cy_detail) {
                    const calendar = await functions.getDatafindOne(Cycle, { cy_id: cy_id });
                    if (calendar) {
                        // Kiểm tra tên llv đã tồn tại hay chưa
                        const check_cy_name = await Cycle.findOne({
                            cy_name: cy_name,
                            com_id: com_id,
                            apply_month: apply_month,
                            cy_id: { $ne: cy_id }
                        });
                        if (!check_cy_name) {
                            await Cycle.updateOne({ cy_id: cy_id }, {
                                $set: {
                                    cy_name: cy_name,
                                    apply_month: apply_month,
                                    is_personal: is_personal,
                                    cy_detail: cy_detail
                                }
                            });
                            return functions.success(res, "Sửa thành công");
                        }
                        return functions.setError(res, "Lịch làm việc trong tháng đã tồn tại");
                    }
                    return functions.setError(res, "lịch không tồn tại");
                }
                return functions.setError(res, "nhập thiếu tên lịch làm việc, tháng áp dụng, chi tiết");
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
                const calendar = await functions.getDatafindOne(Cycle, { com_id: com_id, cy_id: cy_id });
                if (calendar) {
                    let maxId = await Cycle.findOne({}, {}, { sort: { cy_id: -1 } }).lean() || 0;
                    const newId = Number(maxId.cy_id) + 1;
                    const newCalendar = new Cycle({
                        ...calendar,
                        _id: undefined,
                        cy_id: newId,
                    })
                    await newCalendar.save()
                    return functions.success(res, "copy thành công", { newCalendar });
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
            const calendar = await functions.getDatafindOne(Cycle, { com_id: com_id, cy_id: cy_id });
            if (calendar) {
                await functions.getDataDeleteOne(Cycle, { com_id: com_id, cy_id: cy_id })
                return functions.success(res, "xóa thành công", { calendar })
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
                return functions.success(res, "xóa thành công")
            }
            return functions.setError(res, "lịch làm việc không tồn tại");
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// Thêm nhân viên
exports.add_employee = async(req, res) => {
    try {
        const list_id = req.body.list_id;
        const cy_id = req.body.cy_id;
        if (list_id && cy_id) {
            const array = list_id.split(',').map(Number);
            for (let index = 0; index < array.length; index++) {
                const ep_id = array[index];
                const max = await EmployeCycle.findOne({}, { epcy_id: 1 }).sort({ epcy_id: -1 }).lean();
                const item = new EmployeCycle({
                    epcy_id: Number(max.epcy_id) + 1,
                    ep_id: ep_id,
                    cy_id: cy_id,
                    update_time: Date.now(),
                });
                await item.save();
            }
            return functions.success(res, "Thêm thành công")
        }
        return functions.setError(res, "Chưa truyền id nhân viên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

// Loại bỏ nhân viên khỏi llv
exports.delete_employee = async(req, res) => {
    try {
        const { cy_id, ep_id } = req.body;
        if (cy_id && ep_id) {
            const check = await EmployeCycle.findOne({
                cy_id: cy_id,
                ep_id: ep_id
            });
            if (check) {
                await EmployeCycle.deleteOne({ epcy_id: check.epcy_id });
                return functions.success(res, "Xóa thành công")
            }
            return functions.setError(res, "Không tồn tại dữ liệu trùng khớp");
        }
        return functions.setError(res, "Chưa truyền id nhân viên và id llv");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.list_employee = async(req, res) => {
    try {
        const { cy_id } = req.body;
        if (cy_id) {
            const page = req.body.page || 1,
                pageSize = req.body.pageSize || 3;
            const list = await EmployeCycle.aggregate([
                { $match: { cy_id: Number(cy_id) } },
                { $skip: (page - 1) * pageSize },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: "Users",
                        foreignField: "idQLC",
                        localField: "ep_id",
                        as: "user",
                    }
                },
                { $unwind: "$user" },
                { $match: { "user.type": 2 } },
                {
                    $lookup: {
                        from: "QLC_Deparments",
                        foreignField: "dep_id",
                        localField: "user.inForPerson.employee.dep_id",
                        as: "deparment",
                    }
                },
                {
                    $project: {
                        ep_id: 1,
                        ep_name: "$user.userName",
                        dep_id: "$user.inForPerson.employee.dep_id",
                        phone: "$user.phone",
                        email: "$user.email",
                        avatarUser: "$user.avatarUser",
                        dep_name: "$deparment.dep_name"
                    }
                }
            ]);
            const count = await EmployeCycle.countDocuments({ cy_id: Number(cy_id) });

            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                element.dep_name = element.dep_name.toString();
                element.avatarUser = service.createLinkFileEmpQLC(element.idQLC, element.avatarUser);
            }

            return functions.success(res, "Danh sách", { list, count });
        }
        return functions.setError(res, "Chưa truyền id llv");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.list_not_in_cycle = async(req, res) => {
    try {
        const { apply_month } = req.body;
        if (apply_month) {
            const list_id = await Cycle.aggregate([
                { $match: { apply_month: apply_month } },
                {
                    $lookup: {
                        from: "CC365_EmployeCycle",
                        foreignField: "cy_id",
                        localField: "cy_id",
                        as: "EmployeCycle",
                    }
                },
                { $unwind: "$EmployeCycle" },
                {
                    $project: {
                        ep_id: 1
                    }
                },
                // {
                //     $group: {
                //         _id: '$ep_id',
                //     },
                // },
            ]);

            return functions.success(res, "Danh sách nhân viên chưa có lịch làm việc", { list_id });
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}