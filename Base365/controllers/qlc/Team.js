const Team = require('../../models/qlc/Team');
const functions = require("../../services/functions");
const Users = require("../../models/Users")

//tìm kiếm danh sách tổ

exports.getListTeam = async(req, res) => {
    try {
        // const com_id = req.user.data.com_id
        // const type = req.user.data.type
        let com_id = req.body.com_id
        let dep_id = req.body.dep_id
        let team_id = req.body.team_id
        let data = []
        let condition = {}
        let total_emp = {}
        // if (type == 1) {
        
            if (com_id) condition.com_id = com_id
            if (team_id) condition.team_id = team_id
            if (dep_id) condition.dep_id = dep_id
            data = await Team.find(condition).select(' team_id com_id teamName dep_id createdAt ')
            const teamID = data.map(item => item.team_id)
            for (let i = 0; i < teamID.length; i++) {
                const team = teamID[i];
                total_emp = await Users.countDocuments({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.team_id": team, type: 2, "inForPerson.employee.ep_status": "Active" })
                if(total_emp) data.total_emp = total_emp
            }

            if (!data) {
                return functions.setError(res, 'Không có dữ liệu', 404);
            };
            return functions.success(res, 'Lấy thành công', {data});
        // }
        // return functions.setError(res, "Tài khoản không phải Công ty", 604);

    } catch (err) {
        functions.setError(res, err.message)
    }
};


    //Tạo mới dữ liệu của một tổ
exports.createTeam = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        let now = new Date()
        if (type == 1) {
        const { dep_id, teamName } = req.body;
        if (com_id&&dep_id&&teamName) {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await Team.findOne({},{},{sort:{team_id : -1}}).lean() || 0 ;
        const team = new Team({
            team_id: Number(maxID.team_id) + 1 || 1,
            com_id: com_id,
            dep_id: dep_id,
            teamName: teamName,
            createdAt: Date.parse(now)

        });
        await team.save()
                return functions.success(res, "Tạo thành công", { team })
            }
            return functions.setError(res, "nhập thiếu thông tin");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }
};
//Chỉnh sửa dự liệu của một tổ
exports.editTeam = async(req, res) => {
    try {
    const com_id = req.user.data.com_id
    // const com_id = req.body.com_id
    const type = req.user.data.type
    if (type == 1) {
        const {team_id,dep_id, teamName} = req.body
            const team = await functions.getDatafindOne(Team, {com_id: com_id, team_id: team_id });
            if (team) {
                await functions.getDatafindOneAndUpdate(Team, { com_id: com_id, team_id: team_id }, {
                    com_id: com_id,
                    dep_id: dep_id,
                    teamName: teamName,
                    })
                   return functions.success(res, "Sửa thành công", { team })
                }
                return functions.setError(res, "Tổ không tồn tại");
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);
} catch (error) {
    return functions.setError(res, error.message)
}
};
//Xóa dữ liệu của một tổ cua 1 cty
exports.deleteTeam = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const type = req.user.data.type
        if (type == 1) {
    const { team_id,dep_id } = req.body
    if (com_id && team_id) {
        await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.team_id": team_id }, { $set: { "inForPerson.employee.team_id": 0 } })
        
        const team = await functions.getDatafindOne(Team, { com_id: com_id, team_id: team_id });
        if (team) {
            functions.getDataDeleteOne(Team, { com_id: com_id, team_id: team_id })
            return functions.success(res, "xóa thành công", { team })
        }
        return functions.setError(res, "Tổ không tồn tại", 610);
    }
    return functions.setError(res, "thiếu thông tin id tổ cần xóa");
}
return functions.setError(res, "Tài khoản không phải Công ty", 604);
} catch (error) {
return functions.setError(res, error.message)
}

};
