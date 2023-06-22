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
        let comId = infoLogin.comId;
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
        
        let listCondition = {};

        // dua dieu kien vao ob listCondition
        if(appointId) listCondition.appointId = appointId;
        if(ep_id) listCondition.ep_id = ep_id;
        if(update_dep_id) listCondition.update_dep_id = update_dep_id;
        if(created_at) listCondition.created_at = {$gte: fromDate, $lte: toDate};

        const listProcess = await functions.pageFind(ProcessTraining, listCondition, { _id: 1 }, skip, limit); 
        const totalCount = await functions.findCount(ProcessTraining, listCondition);
        return functions.success(res, "Get list process training success", {totalCount: totalCount, data: listProcess });
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
      if(!ep_id || !created_at) {
        return functions.setError(res, "Missing input value!", 404);
      }
      req.fields = {ep_id, current_position, current_dep_id, created_at, decision_id, note: Buffer.from(note, 'base64')};
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