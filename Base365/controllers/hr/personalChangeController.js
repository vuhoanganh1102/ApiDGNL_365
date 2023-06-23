const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Users = require('../../models/Users');
const Appoint = require('../../models/hr/personalChange/Appoint');
const TranferJob = require('../../models/hr/personalChange/TranferJob');
const QuitJob = require('../../models/hr/personalChange/QuitJob');
const QuitJobNew = require('../../models/hr/personalChange/QuitJobNew');

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

exports.createAppoint = async(req, res, next) => {
    try {
        let {update_position, update_dep_id} = req.body;
        if(!update_position || !update_dep_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        let fields = req.fields;
        fields.update_position = update_position;
        fields.update_dep_id = update_dep_id;
        //lay id max
        let newIdAppoint = await Appoint.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        if (newIdAppoint) {
            newIdAppoint = Number(newIdAppoint.id) + 1;
        } else newIdAppoint = 1;
        fields.id = newIdAppoint;
        //tao
        let appoint = new Appoint(fields);
        appoint = await appoint.save();
        if(appoint){
            return functions.success(res, 'Create process train success!');
        }
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateAppoint = async(req, res, next) => {
    try {
        let {update_position, update_dep_id, appointId} = req.body;
        if(!appointId || !update_position || !update_dep_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        let fields = req.fields;

        //xoa cac truong kh can thiet
        delete fields.ep_id;
        delete fields.current_position;
        delete fields.current_dep_id;

        //them cac truong cho phan bo nhiem vao
        fields.update_position = update_position;
        fields.update_dep_id = update_dep_id;

        let appoint = await Appoint.findOneAndUpdate({id: appointId},fields);
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

        let appointId = Number(req.body.appointId);
        if(!appointId){
            return functions.setError(res, "Missing input value id", 404);
        }
        let appoint = await functions.getDataDeleteOne(Appoint ,{id: appointId});
        if (appoint.deletedCount===1) {
            return functions.success(res, `Delete appoint with _id=${appointId} success`);
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
        console.log(com_id);
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

exports.createTranferJob = async(req, res, next) => {
    try {
        let {update_position, update_dep_id, mission, new_com_id} = req.body;
        if(!update_position || !update_dep_id || !mission || !new_com_id) {
            return functions.setError(res, "Missing input value!", 405);
        }
        let fields = req.fields;
        fields = {...fields, update_position, update_dep_id, mission: Buffer.from(mission), new_com_id};

        //lay id max
        let newIdTranferJob = await TranferJob.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        if (newIdTranferJob) {
            newIdTranferJob = Number(newIdTranferJob._id) + 1;
        } else newIdTranferJob = 1;
        fields._id = newIdTranferJob;
        
        //tao
        let tranferJob = new TranferJob(fields);
        tranferJob = await tranferJob.save();
        if(tranferJob){
            hrService.sendChat(fields.ep_id, 1, fields.ep_id, new_com_id, update_position, update_dep_id, fields.create_at, 'TranferJob');
            return functions.success(res, 'Create process train success!');
        }
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateTranferJob = async(req, res, next) => {
    try {
        let {update_position, update_dep_id, tranferJobId, mission, new_com_id} = req.body;
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