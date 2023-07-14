const functions = require("../../services/functions");
const Group = require('../../models/qlc/Group');
const Users = require("../../models/Users")

//tìm kiếm danh sách nhom
exports.getListGroupByFields = async (req, res) => {
    try {
        const type = req.user.data.type
        let com_id = req.user.data.com_id
        // let com_id = req.body.com_id
        let gr_id = req.body.gr_id
        let dep_id = req.body.dep_id
        let team_id = req.body.team_id
        let data = []
        let condition = {}
        let total_emp = {}
        if (type == 1) {
            if (com_id) condition.com_id = com_id
            if (gr_id) condition.gr_id = gr_id
            if (dep_id) condition.dep_id = dep_id
            if (team_id) condition.team_id = team_id
            data = await Group.find(condition).select('gr_id team_id gr_name dep_id com_id')
            const groupID = data.map(item => item.gr_id)
            for (let i = 0; i < groupID.length; i++) {
                const group = groupID[i];
                total_emp = await Users.countDocuments({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.gr_id": group, type: 2, "inForPerson.employee.ep_status": "Active" })
                if (total_emp) data.total_emp = total_emp
            }
            if (data) {
                return functions.success(res, 'Lấy thành công', { data });
            }
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (err) {
        return functions.setError(res, err.message)
    }
};
//Tạo mới dữ liệu của một nhom
exports.createGroup = async (req, res) => {
    try {
        const type = req.user.data.type
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const { dep_id, team_id, gr_name } = req.body;
        if (type == 1) {
            if (dep_id && com_id && team_id && gr_name) {
                let max = await Group.findOne({}, {}, { sort: { gr_id: -1 } }).lean() || 0
                const data = new Group({
                    gr_id: Number(max.gr_id) + 1 || 1,
                    dep_id: dep_id,
                    com_id: com_id,
                    team_id: team_id,
                    gr_name: gr_name,
                });
                await data.save()
                return functions.success(res, "Tạo thành công", { data })
            }
            return functions.setError(res, "nhập thiếu trường");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (e) {
        return functions.setError(res, e.message);

    }
};
//API thay đổi thông tin của một nhóm
exports.editGroup = async (req, res) => {
    try {
        const type = req.user.data.type
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const gr_id = req.body.gr_id
        if (type == 1) {
            const { dep_id, team_id, gr_name } = req.body;
            const data = await functions.getDatafindOne(Group, { com_id: com_id, dep_id: dep_id, team_id: team_id, gr_id: gr_id });
            if (data) {
                await functions.getDatafindOneAndUpdate(Group, { com_id: com_id, dep_id: dep_id, team_id: team_id, gr_id: gr_id }, {
                    dep_id: dep_id,
                    gr_name: gr_name,
                    team_id: team_id,
                })
                return functions.success(res, "Sửa thành công", { data });
            }
            return functions.setError(res, "Nhóm không tồn tại ");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (e) {
        return functions.setError(res, e.message)
    }
};
//API Xóa một nhóm theo id
exports.deleteGroup = async (req, res) => {
    try {
        const { gr_id } = req.body
        const type = req.user.data.type
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        if (type == 1) {
            if (com_id && gr_id) {
                await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.gr_id": gr_id }, { $set: { "inForPerson.employee.gr_id": 0 } })
                const data = await functions.getDatafindOne(Group, { com_id: com_id, gr_id: gr_id });
                if (data) {
                    functions.getDataDeleteOne(Group, { com_id: com_id, gr_id: gr_id })
                    return functions.success(res, "Xóa thành công", { data })
                }
                return functions.setError(res, "Nhóm không tồn tại ", 610);
            }
            return functions.setError(res, "Nhập thiếu trường gr_id ", 502);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);

    } catch (e) {
        return functions.setError(res, e.message);
    }
};