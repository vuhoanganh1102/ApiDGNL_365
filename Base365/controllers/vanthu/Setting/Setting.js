const AdminUser = require('../../../models/AdminUser');
const SettingDX = require('../../../models/Vanthu/setting_dx');
const functions = require("../../../services/functions");
const Group = require("../../../models/qlc/Group");



// hàm tạo mới và hiển thị cài đặt tài khoản côngty

exports.findOrCreateSettingDx = async (req, res) => {
  try {
    let {  type_setting, type_browse, time_limit, shift_id, time_limit_l, list_user, time_tp, time_hh } = req.body;
    let createDate = new Date();
    let com_id = '';
    if(req.type == 1){
       com_id = req.comId
       if (!functions.checkNumber(com_id)) {
        return functions.setError(res, 'com_id phải là 1 số', 400);
       } else {
        let settingDx = await SettingDX.findOne({ com_id });
        if (!settingDx){
          let maxID = await functions.getMaxID(SettingDX);
          if (!maxID) {
            maxID = 0;
          }
          const _id = Number(maxID) + 1;
          settingDx = new SettingDX({
            _id: _id,
            com_id: com_id,
            type_setting: type_setting,
            type_browse: type_browse,
            time_limit: time_limit,
            shift_id: shift_id,
            time_limit_l: time_limit_l,
            list_user: list_user,
            time_tp: time_tp,
            time_hh: time_hh,
            time_created: createDate
          });
  
          await settingDx.save();
        }
  
        return functions.success(res, 'get data success', { settingDx });
      }
    }else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
      
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};



exports.editSettingDx = async (req, res) => {
  try {
    let updateDate = new Date();
    let com_id = '';
    let { type_setting, type_browse, time_limit, shift_id, time_limit_l, list_user, time_tp, time_hh, time_created } = req.body;
    if (req.type == 1) {
      com_id = req.comId
    }else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const editSetting = await functions.getDatafindOne(SettingDX, { com_id: com_id });
    if (!editSetting) {
      return functions.setError(res, 'c cài đặt không tồn tại', 400);
    } else {
      let chinhsuasetting = await SettingDX.findOneAndUpdate(
        {  com_id: com_id },
        {
          $set: {
            com_id: com_id,
            type_setting: type_setting,
            type_browse: type_browse,
            time_limit: time_limit,
            shift_id: shift_id,
            time_limit_l: time_limit_l,
            list_user: list_user,
            time_tp: time_tp,
            time_hh: time_hh,
            time_created: time_created,
            update_time: updateDate
          }
        },
        { new: true }
      );

      return functions.success(res, 'get data success', { chinhsuasetting });
    }
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};

