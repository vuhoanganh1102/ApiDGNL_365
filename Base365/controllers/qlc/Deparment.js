const Deparment = require("../../models/qlc/Deparment")
const functions = require("../../services/functions")
const Users = require("../../models/Users")


//API lấy tất cả dữ liệu phòng ban 
exports.getListDeparment = async (req, res) => {
    try {
        const com_id = req.user.data.com_id
        const type = req.user.data.type
        // let com_id = req.body.com_id
        let dep_id = req.body.dep_id

        let condition = {};
        let data = []
        let total_emp = {}
        if (type == 1) {

            if (com_id) condition.com_id = com_id
            if (dep_id) condition.dep_id = dep_id



            data = await Deparment.find(condition);
            const depID = data.map(item => item.dep_id);
            for (let i = 0; i < depID.length; i++) {
                const depId = depID[i];
                total_emp = await functions.findCount(Users, { "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": depId, type: 2, "inForPerson.employee.ep_status": "Active" })

                if(total_emp) data.total_emp = total_emp
            }
            if (!data) {
                return functions.setError(res, 'Không có dữ liệu', 404);
            };
            return functions.success(res, 'Lấy thành công', {data});
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);

    } catch (err) {

        return functions.setError(res, err.message)
    }
};


//API tạo mới một phòng ban
exports.createDeparment = async (req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        let now = new Date()
        if (type == 1) {

            const { dep_name, manager_id, dep_order } = req.body;
            if (com_id && dep_name) {
                //Kiểm tra Id công ty khác null

                //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
                let maxID = await Deparment.findOne({}, {}, { sort: { dep_id: -1 } }).lean() || 0;
                const deparments = new Deparment({
                    dep_id: Number(maxID.dep_id) + 1 || 1,
                    com_id: com_id,
                    dep_name: dep_name,
                    manager_id: manager_id || null,
                    dep_create_time:  Date.parse(now),
                    dep_order: dep_order || 0,
                });

                await deparments.save()
                return functions.success(res, "Tạo thành công", {deparments});
            }
            return functions.setError(res, "nhập thiếu thông tin", 504);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);

    } catch (error) {
        return functions.setError(res, error.message)

    }
};
//API thay dổi thông tin của một phòng ban
exports.editDeparment = async (req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        const dep_id = req.body.dep_id;
        if (type == 1) {
            const {dep_name, manager_id,dep_order } = req.body;
            const deparment = await functions.getDatafindOne(Deparment, { dep_id: dep_id });
            if (deparment) {
                await functions.getDatafindOneAndUpdate(Deparment, { com_id: com_id, dep_id: dep_id }, {
                    com_id: com_id,
                    dep_name: dep_name,
                    manager_id: manager_id,
                    dep_order : dep_order,
                })
                return functions.success(res, "Sửa phòng ban thành công", { deparment })
            }
            functions.setError(res, "Deparment does not exist!", 510);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};
//API xóa một phòng ban theo id
exports.deleteDeparment = async (req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        const dep_id = req.body.dep_id;
        if (type == 1) {

            if (com_id && dep_id) {
                // cập nhật thông tin phòng ban đã xóa = 0 cho user
                await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": dep_id }, { $set: { "inForPerson.employee.dep_id": 0 } })
                const deparment = await functions.getDatafindOne(Deparment, { com_id: com_id, dep_id: dep_id });
                if (deparment) {
                    functions.getDataDeleteOne(Deparment, { com_id: com_id, dep_id: dep_id })
                    return functions.success(res, "Delete deparment successfully!", { deparment })
                }
                return functions.setError(res, "Deparment not exist!", 510);

            }
            return functions.setError(res, "Thiếu id phòng ban muốn xóa hoặc thiếu id công ty", 502);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};