const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Users = require('../../models/Users');
const Appoint = require('../../models/hr/personalChange/Appoint');
const TranferJob = require('../../models/hr/personalChange/TranferJob');
const QuitJob = require('../../models/hr/personalChange/QuitJob');
const QuitJobNew = require('../../models/hr/personalChange/QuitJobNew');
const Salary = require('../../models/Tinhluong/Tinhluong365SalaryBasic');
const Resign = require('../../models/hr/personalChange/Resign');
const EmployeeHistory = require('../../models/qlc/EmployeeHistory');
const Department = require('../../models/qlc/Deparment');
const Shifts = require('../../models/qlc/Shifts');


exports.getListEmployee = async(req, res, next) => {
    try{
        let com_id = req.infoLogin.comId;
        let listEmployee = await Users.find({"inForPerson.employee.com_id": com_id}, {_id: 1, userName: 1}); 
        const totalCount = await functions.findCount(Users, {"inForPerson.employee.com_id": com_id});
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, listEmployee });
    }catch(e){
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

// lay ra danh sach quy trinh dao tao
exports.getListAppoint = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;

        let {page, pageSize, appointId, ep_id, update_dep_id, fromDate, toDate} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {com_id: com_id};

        // dua dieu kien vao ob listCondition
        if(appointId) listCondition.appointId = Number(appointId);
        if(ep_id) listCondition.ep_id = Number(ep_id);
        if(update_dep_id) listCondition.update_dep_id = Number(update_dep_id);
        if(fromDate) listCondition.created_at = {$gte: new Date(fromDate)};
        if(toDate) listCondition.created_at = {$lte: new Date(toDate)};

        // const listAppoint = await functions.pageFind(Appoint, listCondition, { _id: 1 }, skip, limit); 
        let fields = {com_id: 1, ep_id: 1, current_position: 1, current_dep_id: 1, update_position: 1, update_dep_id: 1, created_at: 1, decision_id: 1, note: 1, userName: 1}
        let listAppoint = await Appoint.aggregate([
        {$match: listCondition},
        {
            $lookup: {
            from: "Users",
            localField: "ep_id",
            foreignField: "idQLC",
            as: "matchedDocuments"
            }
        },
        {
            $unwind: "$matchedDocuments"
        },
        {
            $replaceRoot: {
            newRoot: {
                $mergeObjects: ["$$ROOT", "$matchedDocuments"]
            }
            }
        },
        {
            $project: fields
        },
        // {$project: fields},
        {$sort: {id: 1}},
        {$skip: skip},
        {$limit: limit}
        ]);
        const totalCount = await functions.findCount(Appoint, listCondition);
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: listAppoint });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

exports.getAndCheckData = async (req, res, next) =>{
    try{
        //check quyen
        let infoLogin = req.infoLogin;
        let {ep_id, com_id, new_com_id, current_position, current_dep_id, update_position, update_dep_id, created_at, decision_id, note, mission} = req.body;
        if(!com_id) {
            com_id = infoLogin.comId;
        }
        if(!ep_id || !created_at) {
            return functions.setError(res, "Missing input value!", 404);
        }
        req.fields = {com_id, ep_id, current_position, current_dep_id, created_at, decision_id, note: note};
        next();
    }catch(e){
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

exports.updateAppoint = async(req, res, next) => {
    try {
        let {update_position, update_dep_id} = req.body;
        if(!update_position || !update_dep_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        let fields = req.fields;

        //lay ra id lon nhat
        let ep_id = Number (req.body.ep_id);
        let com_id = req.infoLogin.comId;
        let employee = await Users.findOne({idQLC: ep_id});
        if(!employee) {
            return functions.setError(res, "Employee not found!");
        }
        let check = await Appoint.findOne({com_id: com_id, ep_id: ep_id});
        if(!check) {
            let newIdAppoint = await Appoint.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            if (newIdAppoint) {
                newIdAppoint = Number(newIdAppoint.id) + 1;
            } else newIdAppoint = 1;
            fields.id = newIdAppoint;
        }

        //them cac truong
        fields = {...fields, update_position, update_dep_id};

        //neu chua co thi them moi
        let appoint = await Appoint.findOneAndUpdate({com_id: com_id, ep_id: ep_id},fields, {new: true, upsert: true});
        if(appoint){
            return functions.success(res, "Update Appoint success!");
        }
        return functions.setError(res, "Appoint not found!", 405);
    } catch (error) {
        console.log("Error from server", error);
        return functions.setError(res, e.message);
    }
}

//xoa 
exports.deleteAppoint = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let ep_id = Number(req.body.ep_id);
        if(!ep_id){
            return functions.setError(res, "Missing input value ep_id", 404);
        }
        let appoint = await functions.getDataDeleteOne(Appoint ,{ep_id: ep_id});
        if (appoint.deletedCount===1) {
            return functions.success(res, `Delete appoint with ep_id=${ep_id} success`);
        }
        return functions.setError(res, "Appoint not found", 505);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

//----------------------------------------------luan chuye cong tac

// lay ra danh sach luan chuyen cong tac
exports.getListTranferJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let {page, pageSize, ep_id, update_dep_id, fromDate, toDate} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {com_id: com_id};
        let condition2 = {};
        // dua dieu kien vao ob listCondition
        if(update_dep_id) condition2["user.inForPerson.employee.dep_id"] = Number(update_dep_id);
        if(ep_id) listCondition.ep_id = Number(ep_id);
        if(fromDate && !toDate) listCondition.created_at = {$gte: new Date(fromDate)};
        if(toDate && !fromDate) listCondition.created_at = {$lte: new Date(toDate)};
        if(fromDate && toDate) listCondition.created_at = {$gte: new Date(fromDate), $lte: new Date(toDate)};

        let listTranferJob = await functions.pageFind(TranferJob, listCondition, {_id: -1}, skip, limit);

        let position = hrService.positionNames;
        const total = await TranferJob.aggregate([
            {$match: listCondition},
            {
                $lookup: {
                    from: "Users",
                    localField: "ep_id",
                    foreignField: "idQLC",
                    as: "user"
                }
            },
            {$unwind: "$user"},
            {$match: condition2},
            {
                $group: {
                _id: null,
                total: { $sum: 1 }
                }
            }
        ]);
        const totalCount = total.length>0?total[0].total:0;
        // const totalCount = await functions.findCount(TranferJob, listCondition);
        let dataTranferJob = [];
        //lay thong tin chi tiet
        for(let i=0; i<listTranferJob.length; i++) {
            let infoTransfer = {};
            let ep_id = listTranferJob[i].ep_id;
            let infoUser = await Users.findOne({idQLC: ep_id});

            infoTransfer._id = listTranferJob[i]._id;
            infoTransfer.ep_id = listTranferJob[i].ep_id;
            infoTransfer.created_at = listTranferJob[i].created_at;
            infoTransfer.note = listTranferJob[i].note;
            infoTransfer.mission = listTranferJob[i].mission;

            infoTransfer.userName = infoUser.userName;
            if(infoUser && infoUser.inForPerson.employee) {
                
                let new_com_id = infoUser.inForPerson.employee.com_id;
                let new_dep = infoUser.inForPerson.employee.dep_id;
                let new_position = infoUser.inForPerson.employee.position_id;
                //tim theo phong ban
                if(update_dep_id && new_dep != update_dep_id) continue; 
                
                //lay ra phong ban cu
                let oldDep = await Department.findOne({com_id: infoTransfer.com_id, dep_id: infoTransfer.dep_id});
                if(oldDep) infoTransfer.old_dep_name = oldDep.dep_name;
                else infoTransfer.old_dep_name = "Chưa cập nhật";

                //lay ra vi tri cu
                infoTransfer.old_position = position[infoTransfer.position_id];
                
                //lay ra ten cong ty
                let inForCompany = await Users.findOne({idQLC: new_com_id});
                if(inForCompany) infoTransfer.new_com_name = inForCompany.userName;
                else return functions.setError(res, "Khong tim thay cong ty moi!", 406);

                //lay ra ten phong ban cu
                let infoDep = await Department.findOne({com_id: new_com_id, dep_id: new_dep});
                if(infoDep) infoTransfer.new_dep_name = infoDep.dep_name;
                else infoTransfer.new_dep_name = "Chưa cập nhật";
                infoTransfer.new_dep_id = new_dep;

                //lay ra vi tri moi
                infoTransfer.new_position = position[new_position];

                dataTranferJob.push(infoTransfer);
            }else {
                return functions.setError(res, "Khong tim thay thong tin nhan vien!", 405);
            }
        }
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: dataTranferJob });
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.updateTranferJob = async(req, res, next) => {
    try {
        // com_id, ep_id, current_position, current_dep_id, created_at, decision_id, note: note
        let {com_id,ep_id, position_id, dep_id, created_at, decision_id, note, update_position, update_dep_id, mission, new_com_id, team_id, group_id} = req.body;
        if(!com_id || !ep_id || !update_position || !update_dep_id || !mission || !new_com_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        
        let fields = {
            ep_id: ep_id, 
            com_id: com_id,
            dep_id: dep_id,
            position_id: position_id,
            decision_id: decision_id,
            created_at: created_at,
            decision_id: decision_id,
            note: note,
            mission: mission,
        };
        //update nhan vien
        let employee = await Users.findOneAndUpdate({idQLC: ep_id}, {
            inForPerson: {
                employee: {
                    com_id: new_com_id,
                    dep_id: update_dep_id,
                    position_id: update_position,
                    team_id: team_id,
                    group_id: group_id
                }
            }
        }, {new: true})
        if(!employee){
            return functions.setError(res, "Employee not found!", 503);
        }

        let check = await TranferJob.findOne({com_id: com_id, ep_id: ep_id});
        if(!check) {
            let newIdTranferJob = await functions.getMaxIdByField(TranferJob, '_id');
            fields._id = newIdTranferJob;
        }
        //neu chua co thi them moi
        let tranferJob = await TranferJob.findOneAndUpdate({com_id: com_id, ep_id: ep_id},fields, {new: true, upsert: true});
        if(tranferJob){
            return functions.success(res, "Update TranferJob success!");
        }
        return functions.setError(res, "TranferJob not found!", 405);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

//xoa 
exports.deleteTranferJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let ep_id = req.body.ep_id;
        if(!ep_id){
            return functions.setError(res, "Missing input value ep_id", 404);
        }
        let tranferJob = await functions.getDataDeleteOne(TranferJob ,{ep_id: ep_id});
        if (tranferJob.deletedCount===1) {
            return functions.success(res, `Delete appoint with ep_id=${ep_id} success`);
        }
        return functions.setError(res, "TranferJob not found", 505);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

//----------------------------------------------giam bien che

// lay ra danh giam bien che
exports.getListQuitJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let {page, pageSize, ep_id, current_dep_id, fromDate, toDate} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {hs_com_id: com_id};

        // dua dieu kien vao ob listCondition
        if(ep_id) listCondition.hs_ep_id = Number(ep_id);
        if(current_dep_id) listCondition.hs_dep_id = Number(current_dep_id);
        if(fromDate && !toDate) listCondition.hs_time_end = {$gte: new Date(fromDate)};
        if(toDate && !fromDate) listCondition.hs_time_end = {$lte: new Date(toDate)};
        if(fromDate && toDate) listCondition.hs_time_end = {$gte: new Date(fromDate), $lte: new Date(toDate)};

        let listQuitJob = await functions.pageFind(EmployeeHistory, listCondition, {hs_id: -1}, skip, limit);
        listResign = [];
        for(let i=0; i<listQuitJob.length; i++) {
            let infoQuitJob = {};
            infoQuitJob.ep_id = listQuitJob[i].hs_ep_id;

            //lay ra ten
            let infoUser = await Users.findOne({idQLC: listQuitJob[i].hs_ep_id});
            if(infoUser) infoQuitJob.ep_name = infoUser.userName;
            else return functions.setError(res, "Employee not found!");

            //lay ra ten phong ban
            let infoDep = await Department.findOne({dep_id: listQuitJob[i].hs_dep_id});
            if(infoDep) infoQuitJob.dep_name = infoDep.dep_name;
            else infoQuitJob.dep_name = "Chưa cập nhật";

            //lay ra chuc vu
            if(infoUser && infoUser.inForPerson && infoUser.inForPerson.employee) {
                let position_name = hrService.positionNames[infoUser.inForPerson.employee.position_id];
                if(position_name)infoQuitJob.position_name = position_name;
                else infoQuitJob.position_name = "Chưa cập nhật";
            }else {
                infoQuitJob.position_name = "Chưa cập nhật";
            }

            // lay ra ca nghi
            let infoResign = await Resign.findOne({id: listQuitJob[i].hs_resign_id});
            console.log(listQuitJob[i].hs_resign_id);
            if(infoResign) {
                let infoShift = await Shifts.findOne({shift_id: shift_id});
                if(infoShift) infoQuitJob.shift_name = infoShift.shift_name;
                else infoQuitJob.shift_name = "Chưa cập nhật";

                infoQuitJob.type = infoShift.type;
            }else {
                infoQuitJob.shift_name = "Chưa cập nhật";
                infoQuitJob.type = 0;
            }
            infoQuitJob.time = listQuitJob[i].hs_time_end;
            listResign.push(infoQuitJob);
        }
        // let listResign = await EmployeeHistory.aggregate([
        //     {$match: listCondition},
        //     {
        //         $lookup: {
        //         from: "HR_Resigns",
        //         localField: "hs_ep_id",
        //         foreignField: "ep_id",
        //         as: "matchedDocuments"
        //         }
        //     },
        //     {$match: {matchedDocuments: {$ne: []}}},
        //     {$sort: {hs_ep_id: -1}},
        //     {$skip: skip},
        //     {$limit: limit},
        // ]);
        const totalCount = listResign.length;
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: listResign });
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.updateQuitJob = async(req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let {ep_id, com_id, new_com_id, current_position, current_dep_id, update_position, update_dep_id, created_at, decision_id, note, mission, type, shift_id} = req.body;
        if(ep_id && created_at && type && com_id) {
            let employee = await Users.findOne({idQLC: ep_id});
            if(employee) {
                await Users.findOneAndUpdate({idQLC: ep_id}, {role: 3, type: 0, 
                    inForPerson: {
                        employee: {
                            com_id: 0,
                            dep_id: 0,
                            group_id: 0,
                            team_id: 0,
                            ep_status: "Deny",
                            time_quit_job: new Date(created_at)
                        }
                    }});
                
                let fieldsResign = {
                    ep_id: ep_id,
                    com_id: com_id,
                    created_at: created_at,
                    decision_id: decision_id,
                    note: note,
                    shift_id: shift_id,
                    type: type
                }
                let resign = await Resign.findOne({id: decision_id});
                if(!resign) {
                    let maxIdResign = await functions.getMaxIdByField(Resign, 'id');
                    fieldsResign.id = maxIdResign;
                }
                resign = await Resign.findOneAndUpdate({ep_id: ep_id}, fieldsResign, {new: true, upsert: true});
                if(resign) {
                    let employee_hs = await EmployeeHistory.findOne({hs_ep_id: ep_id, hs_com_id: com_id});
                    let hs_time_end = new Date(created_at);
                    let hs_time_start = (employee.inForPerson && employee.inForPerson.employee)? employee.inForPerson.employee.start_working_time: 0;
                    let hs_dep_id = (employee.inForPerson && employee.inForPerson.employee)? employee.inForPerson.employee.dep_id: 0;
                    let hs_group_id = (employee.inForPerson && employee.inForPerson.employee)?employee.inForPerson.employee.dep_id.group_id: 0;
                    let resign = await Resign.findOne({ep_id, com_id});
                    let hs_resign_id = 0;
                    if(resign) hs_resign_id = resign.id;
                    if(employee_hs) {
                        employee_hs = await EmployeeHistory.updateOne({ep_id: ep_id, com_id: com_id}, {
                            hs_time_end,
                            hs_time_start,
                            hs_dep_id,
                            hs_group_id,
                            hs_resign_id,
                        });
                    }else {
                        let hs_id = await functions.getMaxIdByField(EmployeeHistory, 'hs_id')
                        employee_hs = new EmployeeHistory({
                            hs_id,
                            hs_com_id: com_id,
                            hs_ep_id: ep_id,
                            hs_time_end,
                            hs_time_start,
                            hs_dep_id,
                            hs_group_id,
                            hs_resign_id
                        });
                        employee_hs = await  employee_hs.save();
                    }
                    return functions.success(res, "Cho nhan vien nghi viec thanh cong!");
                }
                return functions.setError(res, "Update or Create resign fail!");
            }
            return functions.setError(res, "Employee not found!", 404);
        }
        return functions.setError(res, "Missing input value!", 404);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

//xoa 
exports.deleteQuitJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let ep_id = req.body.ep_id;
        if(!ep_id){
            return functions.setError(res, "Missing input value ep_id", 404);
        }
        let quitJob = await functions.getDataDeleteOne(QuitJob ,{ep_id: ep_id});
        if (quitJob.deletedCount===1) {
            return functions.success(res, `Delete appoint with ep_id=${ep_id} success`);
        }
        return functions.setError(res, "QuitJob not found", 505);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}


//----------------------------------------------nghi sai quy dinh

// lay ra danh nghi viec sai quy dinh
exports.getListQuitJobNew = async(req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let {page, pageSize, ep_id, current_dep_id, fromDate, toDate} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition ={hs_com_id: com_id};

        // dua dieu kien vao ob listCondition
        if(ep_id) listCondition.ep_id = Number(ep_id);
        if(current_dep_id) listCondition.hs_dep_id = Number(current_dep_id);
        if(fromDate && !toDate) listCondition.hs_time_end = {$gte: new Date(fromDate)};
        if(toDate && !fromDate) listCondition.hs_time_end = {$lte: new Date(toDate)};
        if(fromDate && toDate) listCondition.hs_time_end = {$gte: new Date(fromDate), $lte: new Date(toDate)};
        let listQuitJob = await EmployeeHistory.aggregate([
            {$match: listCondition},
            {
                $lookup: {
                from: "HR_QuitJobs",
                localField: "hs_ep_id",
                foreignField: "ep_id",
                as: "matchedDocuments"
                }
            },
            {$match: {matchedDocuments: {$ne: []}}},
            {$sort: {hs_ep_id: -1}},
            {$skip: skip},
            {$limit: limit},
        ]);
        const totalCount = listQuitJob.length;
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: listQuitJob });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

exports.updateQuitJobNew = async(req, res, next) => {
    try {
        let {com_id, ep_id, current_position, current_dep_id, note, created_at} = req.body;
        if(!com_id) com_id = req.infoLogin.comId; 
        if(ep_id && created_at) {
            let employee = await Users.findOne({idQLC: ep_id});
            if(!employee) return functions.setError(res, "Employee not found!", 405);

            if(note) note = note;
            let fields = {ep_id: ep_id, note: note, created_at: created_at};
            let check = await QuitJob.findOne({ep_id: ep_id});
            if(!check) {
                let newIdQuitJobNew = await functions.getMaxIdByField(QuitJob, 'id');
                fields.id = newIdQuitJobNew;
            }
            
            let quitJob = await QuitJob.findOneAndUpdate({ep_id: ep_id},fields, {new: true, upsert: true});
            if(quitJob){
                await Users.findOneAndUpdate({idQLC: ep_id}, {role: 3, type: 0, 
                    inForPerson: {
                        employee: {
                            com_id: 0,
                            dep_id: 0,
                            group_id: 0,
                            team_id: 0,
                            position_id: 0,
                            ep_status: "Deny",
                            time_quit_job: created_at
                        }
                    }});
                let employee_hs = await EmployeeHistory.findOne({hs_ep_id: ep_id, hs_com_id: com_id});
                let hs_time_end = new Date(created_at);
                let hs_time_start = (employee.inForPerson && employee.inForPerson.employee)? employee.inForPerson.employee.start_working_time: 0;
                let hs_dep_id = (employee.inForPerson && employee.inForPerson.employee)? employee.inForPerson.employee.dep_id: 0;
                let hs_group_id = (employee.inForPerson && employee.inForPerson.employee)?employee.inForPerson.employee.dep_id.group_id: 0;
                let resign = await Resign.findOne({ep_id, com_id});
                let hs_resign_id = 0;
                if(resign) hs_resign_id = resign.id;
                if(employee_hs) {
                    employee_hs = await EmployeeHistory.updateOne({ep_id: ep_id, com_id: com_id}, {
                        hs_time_end,
                        hs_time_start,
                        hs_dep_id,
                        hs_group_id,
                        hs_resign_id,
                    });
                }else {
                    let hs_id = await functions.getMaxIdByField(EmployeeHistory, 'hs_id')
                    employee_hs = new EmployeeHistory({
                        hs_id,
                        hs_com_id: com_id,
                        hs_ep_id: ep_id,
                        hs_time_end,
                        hs_time_start,
                        hs_dep_id,
                        hs_group_id,
                        hs_resign_id
                    });
                    employee_hs = await  employee_hs.save();
                }
                return functions.success(res, "Update QuitJob success!");
            }
            return functions.setError(res, "QuitJobN not found!", 405);
        }
        return functions.setError(res, "Missing input ep_id or create_at!", 404);
        
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

//xoa 
exports.deleteQuitJobNew = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let ep_id = req.body.ep_id;
        if(!ep_id){
            return functions.setError(res, "Missing input value ep_id", 404);
        }
        let quitJob = await functions.getDataDeleteOne(QuitJob ,{ep_id: ep_id});
        if (quitJob.deletedCount===1) {
            return functions.success(res, `Delete appoint with ep_id=${ep_id} success`);
        }
        return functions.setError(res, "QuitJobNew not found", 505);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

exports.getListSalary = async(req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let {ep_id, fromDate, toDate, page, pageSize} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);

        let condition = {sb_id_com: infoLogin.comId};
        if(ep_id) condition.sb_id_user = ep_id;
        if(fromDate && !toDate) condition.sb_time_up = {$gte: new Date(fromDate)};
        if(toDate && !fromDate) condition.sb_time_up = {$lte: new Date(toDate)};
        if(fromDate && toDate) condition.sb_time_up = {$gte: new Date(fromDate), $lte: new Date(toDate)};

        let dataLuong = await Salary.find(condition).sort({ sb_time_up: -1 });
        let tangLuong = 0;
        let giamLuong = 0;
        let arr = [];
        if (dataLuong.length !== 0) {
            for (let i = 0; i < dataLuong.length; i++) {
                condition.sb_id_user = dataLuong[i].sb_id_user;
                condition.sb_time_up = { $lt: dataLuong[i].sb_time_up }

                checkTangGiam = await Salary.findOne(condition)

                if (checkTangGiam && dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic > 0) {
                    tangLuong++;
                } else if (checkTangGiam && dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic < 0) {
                    giamLuong++;
                }
                if (checkTangGiam) {
                    let tangGiam = dataLuong[i].sb_salary_basic - checkTangGiam.sb_salary_basic
                    checkTangGiam.tangGiam = tangGiam
                    arr.push(checkTangGiam)
                }
            }
        }
        let total =  arr.length;
        return functions.success(res, "Get list salary success!", {total, listSalary: arr, });
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

