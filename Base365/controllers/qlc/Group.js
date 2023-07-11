const functions = require("../../services/functions");
const Group = require('../../models/qlc/Group');
const Users = require("../../models/Users")

//tìm kiếm danh sách nhom

exports.getListGroupByFields = async(req, res) => {
    try {
        const type = req.user.data.type

        let com_id = req.user.data.com_id
        // let com_id = req.body.com_id
        let group_id = req.body.group_id
        let dep_id = req.body.dep_id
        let team_id = req.body.team_id
        let data = []
        let condition = {}
        let total_emp = {}
    if(type == 1){

        if ((com_id) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(com_id)) {
            functions.setError(res, "id must be a Number")
        } else {
            if (com_id) condition.com_id = com_id
            if (group_id) condition.group_id = group_id
            if (dep_id) condition.dep_id = dep_id
            if (team_id) condition.team_id = team_id
            data = await Group.find(condition).select('team_id groupName dep_id managerId deputyManagerId total_emp ')
            const groupID = data.map(item => item.group_id)
            for (let i = 0; i < groupID.length; i++) {
                const group = groupID[i];

                total_emp = await Users.countDocuments({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.group_id": group, type: 2, "inForPerson.employee.ep_status": "Active" })


                await Group.findOneAndUpdate({ com_id: com_id, group_id: group }, { $set: { total_emp: total_emp } })
            }

            if (!data) {
                return functions.setError(res, 'Không có dữ liệu', 404);
            } else {

                return functions.success(res, 'Lấy thành công', { data });
            }
        }
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);

    } catch (err) {
        return functions.setError(res, err.message)
    }
};

//Tạo mới dữ liệu của một nhom
exports.createGroup = async(req, res) => {
    try{
        const type = req.user.data.type
        const com_id = req.user.data.com_id
        const { dep_id, team_id, groupName, deputyManagerId, managerId, total_emp, groupCreated } = req.body;
    if(type == 1){
    
        if (dep_id && com_id && team_id && groupName) {
            
            
            let max = await Group.findOne({},{},{sort:{group_id:-1}}).lean() || 0
            const data = new Group({
                group_id: Number(max) + 1 || 1,
                com_id: com_id,
                dep_id: dep_id,
                team_id: team_id,
                groupName: groupName,
                deputyManagerId: deputyManagerId || null,
                managerId: managerId || null,
                total_emp: 0,
                groupCreated: new Date()
            });
            
            await data.save()
            
                return functions.success(res, "Tạo thành công", { data })
        }
        return functions.setError(res, "nhập thiếu trường", 604);
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);

    }catch(e){
        return functions.setError(res, e.message);

    }


};
//API thay đổi thông tin của một nhóm

exports.editGroup = async(req, res) => {
    try{
        const type = req.user.data.type
        const com_id = req.user.data.com_id
        // const com_id = req.body.com_id
        const group_id = req.body.group_id
    if(type == 1){

        const { dep_id, team_id, groupName, deputyManagerId, managerId } = req.body;

        if (com_id) {
    
            const data = await functions.getDatafindOne(Group, { com_id: com_id, dep_id: dep_id, team_id: team_id, group_id: group_id });
            if (data) {
                await functions.getDatafindOneAndUpdate(Group, { com_id: com_id, dep_id: dep_id, team_id: team_id, group_id: group_id }, {
                    dep_id: dep_id,
                    groupName: groupName,
                    com_id: com_id,
                    team_id: team_id,
                    deputyManagerId: deputyManagerId || null,
                    managerId: managerId || null
                })
                return functions.success(res, "Sửa thành công", {data});
                
                
            }
            return functions.setError(res, "Nhóm không tồn tại ", 610);
            
        }
        return functions.setError(res, "thiếu thông tin công ty", 604);

    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);
    }catch(e){
        return functions.setError(res, e.message)
    }




};
//API Xóa một nhóm theo id

exports.deleteGroup = async(req, res) => {
try{
    const {group_id} = req.body
    const type = req.user.data.type

    const com_id = req.user.data.com_id
    // const com_id = req.body.com_id
    if(type == 1){

    if (com_id && group_id) {
        
        await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.group_id": group_id }, { $set: { "inForPerson.employee.group_id": 0 } })
        
        const data = await functions.getDatafindOne(Group, { com_id: com_id, group_id: group_id });
        if (data) {
            functions.getDataDeleteOne(Group, { com_id: com_id, group_id: group_id })
            return functions.success(res, "Xóa thành công", { data })
            }
            return functions.setError(res, "Nhóm không tồn tại ", 610);
        }
        return functions.setError(res, "Nhập thiếu trường ", 502);
    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);

}catch(e){
        return functions.setError(res, e.message );
}
};