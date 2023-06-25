const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Users = require('../../models/Users');
const Appoint = require('../../models/hr/personalChange/Appoint');
const TranferJob = require('../../models/hr/personalChange/TranferJob');
const QuitJob = require('../../models/hr/personalChange/QuitJob');
const QuitJobNew = require('../../models/hr/personalChange/QuitJobNew');


exports.getListEmployee = async(req, res, next) => {
    try{
        let com_id = req.infoLogin.comId;
        let listEmployee = await Users.find({"inForPerson.employee.com_id": com_id}, {_id: 1, userName: 1}); 
        const totalCount = await functions.findCount(Users, {"inForPerson.employee.com_id": com_id});
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, listEmployee });
    }catch(e){
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

// lay ra danh sach quy trinh dao tao
exports.getListAppoint = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let checkRole = await hrService.checkRole(infoLogin, 4, 1);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }
        //
        let {page, pageSize, appointId, ep_id, update_dep_id, fromDate, toDate} = req.body;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pageSize", 401);
        }
        
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
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
            foreignField: "_id",
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
        return functions.setError(res, "Err from server", 500);
    }
}

exports.getAndCheckData = async (req, res, next) =>{
    try{
        //check quyen
        let infoLogin = req.infoLogin;
        let checkRole = await hrService.checkRole(infoLogin, 5, 2);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }
        let {ep_id, com_id, new_com_id, current_position, current_dep_id, update_position, update_dep_id, created_at, decision_id, note, mission} = req.body;
        if(!com_id) {
            com_id = infoLogin.comId;
        }
        if(!ep_id || !created_at) {
            return functions.setError(res, "Missing input value!", 404);
        }
        req.fields = {com_id, ep_id, current_position, current_dep_id, created_at, decision_id, note: Buffer.from(note, 'base64')};
        next();
    }catch(e){
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
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
        let ep_id = req.fields.ep_id;
        let check = await Appoint.findOne({ep_id: ep_id});
        if(!check) {
            let newIdAppoint = await Appoint.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            if (newIdAppoint) {
                newIdAppoint = Number(newIdAppoint._id) + 1;
            } else newIdAppoint = 1;
            fields.id = newIdAppoint;
        }

        //them cac truong
        fields = {...fields, update_position, update_dep_id};

        //neu chua co thi them moi
        let appoint = await Appoint.findOneAndUpdate({ep_id: ep_id},fields, {new: true, upsert: true});
        if(appoint){
            return functions.success(res, "Update Appoint success!");
        }
        return functions.setError(res, "Appoint not found!", 405);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//xoa 
exports.deleteAppoint = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let checkRole = await hrService.checkRole(infoLogin, 5, 2);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }

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
        return functions.setError(res, "Error from server", 500);
    }
}

//----------------------------------------------luan chuye cong tac

// lay ra danh sach luan chuyen cong tac
exports.getListTranferJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let checkRole = await hrService.checkRole(infoLogin, 4, 1);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }
        //
        let {page, pageSize, ep_id, update_dep_id, fromDate, toDate} = req.body;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pageSize", 401);
        }
        
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {com_id: com_id};

        // dua dieu kien vao ob listCondition
        if(ep_id) listCondition.ep_id = Number(ep_id);
        if(update_dep_id) listCondition.update_dep_id = Number(update_dep_id);
        if(fromDate) listCondition.created_at = {$gte: new Date(fromDate)};
        if(toDate) listCondition.created_at = {$lte: new Date(toDate)};

        // const listTranferJob = await functions.pageFind(TranferJob, listCondition, { _id: 1 }, skip, limit); 
        let fields = {com_id: 1, ep_id: 1, current_position: 1, current_dep_id: 1, update_position: 1, update_dep_id: 1, created_at: 1, decision_id: 1, note: 1, userName: 1}
        let listTranferJob = await TranferJob.aggregate([
        {$match: listCondition},
        {
            $lookup: {
            from: "Users",
            localField: "ep_id",
            foreignField: "_id",
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
        const totalCount = await functions.findCount(TranferJob, listCondition);
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: listTranferJob });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.updateTranferJob = async(req, res, next) => {
    try {
        let {update_position, update_dep_id, mission, new_com_id} = req.body;
        if(!update_position || !update_dep_id || !mission || !new_com_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        let fields = req.fields;

        //lay ra id lon nhat
        let ep_id = req.fields.ep_id;
        let check = await TranferJob.findOne({ep_id: ep_id});
        if(!check) {
            let newIdTranferJob = await TranferJob.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
            if (newIdTranferJob) {
                newIdTranferJob = Number(newIdTranferJob._id) + 1;
            } else newIdTranferJob = 1;
            fields._id = newIdTranferJob;
        }

        //them cac truong cho phan bo nhiem vao
        fields = {...fields, update_position, update_dep_id, mission: Buffer.from(mission), new_com_id};

        //neu chua co thi them moi
        let tranferJob = await TranferJob.findOneAndUpdate({ep_id: ep_id},fields, {new: true, upsert: true});
        if(tranferJob){
            return functions.success(res, "Update TranferJob success!");
        }
        return functions.setError(res, "TranferJob not found!", 405);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//xoa 
exports.deleteTranferJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let checkRole = await hrService.checkRole(infoLogin, 5, 2);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }

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
        return functions.setError(res, "Error from server", 500);
    }
}

//----------------------------------------------giam bien che

// lay ra danh giam bien che
exports.getListQuitJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let checkRole = await hrService.checkRole(infoLogin, 4, 1);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }
        //
        let {page, pageSize, ep_id, current_dep_id, fromDate, toDate} = req.body;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pageSize", 401);
        }
        
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {com_id: com_id};

        // dua dieu kien vao ob listCondition
        if(ep_id) listCondition.ep_id = Number(ep_id);
        if(current_dep_id) listCondition.current_dep_id = Number(current_dep_id);
        if(fromDate) listCondition.created_at = {$gte: new Date(fromDate)};
        if(toDate) listCondition.created_at = {$lte: new Date(toDate)};

        // const listQuitJob = await functions.pageFind(QuitJob, listCondition, { _id: 1 }, skip, limit); 
        let fields = {com_id: 1, ep_id: 1, current_position: 1, current_dep_id: 1, update_position: 1, update_dep_id: 1, created_at: 1, decision_id: 1, note: 1, userName: 1}
        let listQuitJob = await QuitJob.aggregate([
        {$match: listCondition},
        {
            $lookup: {
            from: "Users",
            localField: "ep_id",
            foreignField: "_id",
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
        const totalCount = await functions.findCount(QuitJob, listCondition);
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: listQuitJob });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.updateQuitJob = async(req, res, next) => {
    try {
        let {type, shift_id} = req.body;
        if(!type || !shift_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        let fields = req.fields;

        //lay ra id lon nhat
        let ep_id = req.fields.ep_id;
        let check = await QuitJob.findOne({ep_id: ep_id});
        if(!check) {
            let newIdQuitJob = await QuitJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            if (newIdQuitJob) {
                newIdQuitJob = Number(newIdQuitJob.id) + 1;
            } else newIdQuitJob = 1;
            fields.id = newIdQuitJob;
        }

        //them cac truong cho phan bo nhiem vao
        fields = {...fields, type, shift_id};

        //neu chua co thi them moi
        let quitJob = await QuitJob.findOneAndUpdate({ep_id: ep_id},fields, {new: true, upsert: true});
        if(quitJob){
            return functions.success(res, "Update QuitJob success!");
        }
        return functions.setError(res, "QuitJob not found!", 405);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//xoa 
exports.deleteQuitJob = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let checkRole = await hrService.checkRole(infoLogin, 5, 2);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }

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
        return functions.setError(res, "Error from server", 500);
    }
}


//----------------------------------------------nghi sai quy dinh

// lay ra danh giam bien che
exports.getListQuitJobNew = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let com_id = infoLogin.comId;
        let checkRole = await hrService.checkRole(infoLogin, 4, 1);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }
        //
        let {page, pageSize, ep_id, current_dep_id, fromDate, toDate} = req.body;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pageSize", 401);
        }
        
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {com_id: com_id};

        // dua dieu kien vao ob listCondition
        if(ep_id) listCondition.ep_id = Number(ep_id);
        if(current_dep_id) listCondition.current_dep_id = Number(current_dep_id);
        if(fromDate) listCondition.created_at = {$gte: new Date(fromDate)};
        if(toDate) listCondition.created_at = {$lte: new Date(toDate)};

        // const listQuitJobNew = await functions.pageFind(QuitJobNew, listCondition, { _id: 1 }, skip, limit); 
        let fields = {com_id: 1, ep_id: 1, current_position: 1, current_dep_id: 1, update_position: 1, update_dep_id: 1, created_at: 1, decision_id: 1, note: 1, userName: 1}
        let listQuitJobNew = await QuitJobNew.aggregate([
        {$match: listCondition},
        {
            $lookup: {
            from: "Users",
            localField: "ep_id",
            foreignField: "_id",
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
        const totalCount = await functions.findCount(QuitJobNew, listCondition);
        return functions.success(res, "Get list appoint success", {totalCount: totalCount, data: listQuitJobNew });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.updateQuitJobNew = async(req, res, next) => {
    try {
        let fields = req.fields;

        //lay ra id lon nhat
        let ep_id = req.fields.ep_id;
        let check = await QuitJobNew.findOne({ep_id: ep_id});
        if(!check) {
            let newIdQuitJobNew = await QuitJobNew.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            if (newIdQuitJobNew) {
                newIdQuitJobNew = Number(newIdQuitJobNew.id) + 1;
            } else newIdQuitJobNew = 1;
            fields.id = newIdQuitJobNew;
        }

        //neu chua co thi them moi
        let quitJob = await QuitJobNew.findOneAndUpdate({ep_id: ep_id},fields, {new: true, upsert: true});
        if(quitJob){
            return functions.success(res, "Update QuitJobNew success!");
        }
        return functions.setError(res, "QuitJobNew not found!", 405);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//xoa 
exports.deleteQuitJobNew = async(req, res, next) => {
    try {
        //check quyen
        let infoLogin = req.infoLogin;
        let checkRole = await hrService.checkRole(infoLogin, 5, 2);
        if(!checkRole) {
            return functions.setError(res, "no right", 444);   
        }

        let ep_id = req.body.ep_id;
        if(!ep_id){
            return functions.setError(res, "Missing input value ep_id", 404);
        }
        let quitJob = await functions.getDataDeleteOne(QuitJobNew ,{ep_id: ep_id});
        if (quitJob.deletedCount===1) {
            return functions.success(res, `Delete appoint with ep_id=${ep_id} success`);
        }
        return functions.setError(res, "QuitJobNew not found", 505);
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}