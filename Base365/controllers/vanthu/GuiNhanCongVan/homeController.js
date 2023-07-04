// const AdminUser = require('../../../models/AdminUser');
const VanBan = require('../../../models/Vanthu365/van_ban');
const functions = require("../../../services/functions");
// const vanThuService = require("../../../services/vanthu");
// const ThayThe = require("../../../models/Vanthu365/tbl_thay_the");
// const ThongBao = require("../../../models/Vanthu365/tl_thong_bao");
// const UserVT = require("../../../models/Vanthu365/user_model");

exports.getTotalVanBan = async(req, res, next) => {
  try{
    let id = req.id || 145;
    let vanbanden = await VanBan.countDocuments({user_nhan: id});
    let vanbandi = await VanBan.countDocuments({user_send: id});
    // let tong_so_vb = await VanBan.countDocuments({$or: [{user_nhan: id}, {user_send: id}]});
    let tong_so_vb = vanbanden + vanbandi;
    let vanbanchoduyet = await VanBan.countDocuments({user_send: id, trang_thai_vb: 0});
    let vanbancanduyet = await VanBan.countDocuments({user_nhan: id, trang_thai_vb: 0});
    let ht_vbdi = Math.round(((vanbandi-vanbanchoduyet)/vanbandi)*100);
    let ht_vbden = Math.round(((vanbanden-vanbancanduyet)/vanbanden)*100);
    let condition = new RegExp(id);
    let cong_van_gan_day = await VanBan.find({
      $or: [
        {$or: [{user_nhan: condition}, {user_nhan: '0', user_cty: req.comId}], duyet_vb: 1},
        {$or: [{user_nhan: condition}, {user_nhan: '0', user_cty: req.comId}], duyet_vb: 2, type_duyet: 1},
        {nguoi_xet_duyet: condition, type_duyet: 1},
        {user_forward: condition}
      ]
    }).sort({_id:1}).limit(3);
    return functions.success(res, "Get home page success!", {tong_so_vb, vanbanden, vanbandi, vanbanchoduyet, vanbancanduyet, ht_vbdi, ht_vbden, cong_van_gan_day});
  }catch(err){
    console.log("Err from server!", err);
    return functions.setError(res, err, 500);
  }
}