const AdminUser = require('../../../models/AdminUser');
const SettingDX = require('../../../models/Vanthu/setting_dx');
const functions = require("../../../services/functions");
const Group = require("../../../models/qlc/Group");

// Hàm lấy dữ liệu Setting
exports.getSettings = async (req, res) => {
    try {
        const settings = await SettingDX.find();
        res.status(200).json(settings)
    } catch (error) {
        console.error('Failed to get settings', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
};

exports.findOneSetting = async (req,res) => {
    try {
        let id_setting = req.body._id

        if(isNaN(id_setting)) {
            functions.setError(res, "Id must be a number", 702);
        }else {
            let settingCom = await SettingDX.findOne({_id : id_setting} )
            res.status(200).json(settingCom)
        }

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed ' });
    }
}



//Hàm tạo mới đề xuất
exports.createSettingDx = async (req,res) => {

        let {com_id,type_setting,type_browse,time_limit,shift_id,time_limit_l,list_user,time_tp,time_hh,time_created,update_time} = req.body;
        if(!com_id){
            //Kiểm tra Id công ty khác null
            functions.setError(res, "Com Id required", 704);
        }else if(!functions.checkNumber(com_id)) {
            functions.setError(res, "Com Id must be a number", 705);
        }else if(!type_setting){
            //Kiểm tra loại setting khác null
            functions.setError(res, "type setting required", 704);
        }else  if(!type_browse){
            //kiểm tra loại duyệt khác null
            functions.setError(res, "type_browse required", 704);
        }else  if(!time_limit){
            functions.setError(res, "time_limit required", 704);
        }else if(!shift_id) {
            functions.setError(res, "shift_id required", 704);
        }else if(!time_limit_l) {
            functions.setError(res, "time_limit_l required", 704);
        }else if(!list_user) {
            functions.setError(res, "list_user required", 704);
        }else if(!time_tp){
            functions.setError(res, "time_tp required", 704);
        }else if(!time_hh) {
            functions.setError(res, "time_hh required", 704);
        }else if(!time_created){
            functions.setError(res, "time_created required", 704);
        }else if(!update_time) {
            functions.setError(res, "update_time required", 704);
        } else {
            //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
            let maxID = await functions.getMaxID(SettingDX);
            if (!maxID) {
                maxID = 0;
            };
            const _id = Number(maxID) + 1;

            const settingDx = new SettingDX({
                _id : _id,
                com_id : com_id,
                type_setting : type_setting,
                type_browse : type_browse,
                time_limit : time_limit,
                shift_id : shift_id,
                time_limit_l : time_limit_l,
                list_user : list_user,
                time_tp : time_tp,
                time_hh : time_hh,
                time_created : time_created,
                update_time : update_time

            })
            await settingDx.save()
                .then(() => {
                functions.success(res, "Group created successfully", settingDx)
            })
                .catch((err) => {
                    functions.setError(res, err.message, 709);
                });
        }

}




//hàm sửa setting
exports.editSettingDx = async (req,res) => {

        const _id  = req.params.id;
        if(isNaN(_id)){
            functions.setError(res, "Id must be a number", 702);
        }else {
            let {com_id,type_setting,type_browse,time_limit,shift_id,time_limit_l,list_user,time_tp,time_hh,time_created,update_time} = req.body;
            if(!com_id){
                //Kiểm tra Id công ty khác null
                functions.setError(res, "Com Id required", 704);
            }else if(typeof com_id != "number") {
                functions.setError(res, "Com Id must be a number", 705);

            }else if(!type_setting){
                //Kiểm tra loại setting khác null
                functions.setError(res, "type setting required", 704);
            }else  if(!type_browse){
                //kiểm tra loại duyệt khác null
                functions.setError(res, "type_browse required", 704);
            }else  if(!time_limit){
                functions.setError(res, "time_limit required", 704);
            }else if(!shift_id) {
                functions.setError(res, "shift_id required", 704);
            }else if(!time_limit_l) {
                functions.setError(res, "time_limit_l required", 704);
            }else if(list_user) {
                functions.setError(res, "list_user required", 704);
            }else if(time_tp){
                functions.setError(res, "time_tp required", 704);
            }else if(time_hh) {
                functions.setError(res, "time_hh required", 704);
            }else if(time_created){
                functions.setError(res, "time_created required", 704);
            }else if(update_time) {
                functions.setError(res, "update_time required", 704);
            }else {
                const editSetting = await functions.getDatafindOne(SettingDX,{_id : _id});
                if(!editSetting){
                    functions.setError(res, "editSetting does not exist", 710);
                }else {
                    await functions.getDatafindOneAndUpdate(SettingDX,{_id : _id},{
                        com_id : com_id,
                        type_setting : type_setting,
                        type_browse : type_browse,
                        time_limit : time_limit,
                        shift_id : shift_id,
                        time_limit_l : time_limit_l,
                        list_user : list_user,
                        time_tp : time_tp,
                        time_hh : time_hh,
                        time_created : time_created,
                        update_time : update_time
                    })
                        .then((group) => functions.success(res, "Group edited successfully".group))
                        .catch(err => functions.setError(res, err.message), 711);
                }
            }
        }
}

// Xóa setting

exports.removeSetting = async (req,res) => {
        let id = req.body._id;

        if(isNaN(id)){
            functions.setError(res, "Id must be a number", 702);

        }else {
            const removeSettingDx = await functions.getDatafindOne(SettingDX,{_id : id});
            console.log(removeSettingDx)
            if(!removeSettingDx) {
                functions.setError(res, "Group does not exist", 710);
            }else {
                functions.getDataDeleteOne(SettingDX,{_id : id})
                    .then(() => functions.success(res, "Delete setting Dx successfully", removeSettingDx))
                    .catch(err => functions.setError(res, err.message, 712));
            }
        }
}

