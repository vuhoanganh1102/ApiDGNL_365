const functions = require("../../services/functions");
const Group = require('../../models/qlc/Group');
const Team = require('../../models/qlc/Team');
const Deparment = require('../../models/qlc/Deparment');
const Users = require('../../models/Users');


exports.createGroup = async (req, res) => {
    const companyId = req.body.companyId;
    const groupName = req.body.groupName;
    const managerId = req.body.managerId;
    const deputyManagerId = req.body.deputyManagerId;
    const depId = req.body.depId;
    const teamId = req.body.teamId;

    const fields = [
        companyId,
        groupName,
        managerId,
        deputyManagerId,
        depId,
        teamId
    ];

    //check cac truong not null
    for(let i=0; i<fields.length; i++){
        if(!fields[i]) 
            return functions.setError(res, `Missing input`, 400);
    }

    // check to cua nhom co ton tai khong
    const team = await functions.getDatafindOne(Team, { _id: teamId});
    if (!team) {
        return functions.setError(res, "team does not exist!", 501);
    }

    //check phong cua nhom co ton tai khon
    const dep = await functions.getDatafindOne(Deparment, { _id: depId});
    if (!dep) {
        return functions.setError(res, "dep does not exist!", 502);
    }

    //check cong ty co ton tai khong
    const company = await functions.getDatafindOne(Users, { _id: companyId});
    if (!company) {
        return functions.setError(res, "company does not exist!", 503);
    }

    //check nhom truong co ton tai khong
    const manager = await functions.getDatafindOne(Users, { _id: managerId});
    if (!manager) {
        return functions.setError(res, "manager does not exist!", 504);
    }

    //check nhom pho co ton tai khong
    const deputyManager = await functions.getDatafindOne(Users, { _id: deputyManagerId});
    if (!deputyManager) {
        return functions.setError(res, "deputy manager does not exist!", 505);
    }

    //check to day da ton tai chua
    let group = await functions.getDatafindOne(Group, {groupName: groupName, teamId: teamId, depId: depId});
    if (group) {
        return functions.setError(res, "group already exists in db!", 506);
    }

    //check truong nhom da o trong nhom nao chua
    let emp = await functions.getDatafindOne(Users, {idQLC: managerId, "inForPerson.groupID": !0});
    if (emp) {
        return functions.setError(res, "manager already exists in other group!", 507);
    }

    //check nhom pho da o trong nhom nao chua
    emp = await functions.getDatafindOne(Users, {idQLC: deputyManagerId, "inForPerson.groupID": !0});
    if (emp) {
        console.log(emp);
        return functions.setError(res, "deputy manager already exists in other group!", 508);
    }
    
    let maxID = await functions.getMaxID(Group);
    if (!maxID) {
        maxID = 0;
    };
    const _id = Number(maxID) + 1;

    group = new Group({
        _id: _id,
        groupName: groupName,
        teamId: teamId,
        depId: depId,
        managerId: managerId,
        deputyManagerId: deputyManagerId
    });

    await group.save()
        .then(() => {
            functions.success(res, "Group created successfully", group)
        })
        .catch((err) => {
            functions.setError(res, err.message, 709);
        });
};
//API thay đổi thông tin của một nhóm
exports.editGroup = async (req, res) => {
    const idGroup = req.body._id;
    const groupName = req.body.groupName;
    const managerId = req.body.managerId;
    const deputyManagerId = req.body.deputyManagerId;

    //check idGroup not null
    if(!idGroup){
        return functions.setError(res, "Missing input value!", 400);
    }

    const group = await functions.getDatafindOne(Group, { _id: idGroup});
    if (!group) {
        return functions.setError(res, "group does not exist!", 500);
    }

    await functions.getDatafindOneAndUpdate(Group, { _id: idGroup }, {groupName, managerId, deputyManagerId})
        .then((manager) => functions.success(res, "edit group success", manager))
        .catch((err) => functions.setError(res, err.message, 500));
};
//API Xóa một nhóm theo id
exports.deleteGroup = async (req, res) => {
    const _id = req.query._id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 702);
    } else {
        const group = await functions.getDatafindOne(Group, { _id: _id });
        if (!group) {
            functions.setError(res, "Group does not exist", 710);
        } else {
            functions.getDataDeleteOne(Group, { _id: _id })
                .then(() => functions.success(res, "Delete group successfully", group))
                .catch(err => functions.setError(res, err.message, 712));
        }
    }
};


exports.getListGroupByFields = async(req, res, next) => {
    try {
        if (req.body) {
            if(!req.body.page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!req.body.pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let _id = req.body._id;
            let groupName = req.body.groupName;
            let teamId = req.body.teamId;
            let depId = req.body.depId;
            let listGroup=[];
            let listCondition = {};

            // dua dieu kien vao ob listCondition
            if(_id) listCondition._id = _id;
            if(teamId) listCondition.teamId =  Number(teamId);
            if(depId) listCondition.depId = Number(depId);
            if(groupName) listCondition.groupName = new RegExp(groupName);
            listGroup = await functions.pageFind(Group, listCondition, { _id: 1 }, skip, limit); 
            return functions.success(res, "get individual success", { data: listGroup });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}
