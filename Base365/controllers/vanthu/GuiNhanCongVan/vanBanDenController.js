const VanBan = require('../../../models/Vanthu365/van_ban');
const functions = require("../../../services/functions");
const vanThuService = require("../../../services/vanthu");

exports.getListVanBanCanDuyet = async(req, res, next) => {
  try{
    let {ten_vb_search, time_start, time_end, page, pageSize} = req.body;
    page = Number(page);
    pageSize = Number(pageSize);
    if(!page || !pageSize) {
      return functions.setError(res, "Missing input page or pageSize!", 404);
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    let id = req.id || 1761;
    let com_id = req.comId || 1763;
    // let condition = {$or: [{nguoi_xet_duyet: new RegExp(String(id), 'i')}, {user_send:  new RegExp(String(id), 'i')}]};
    let condition = {};
    condition.user_nhan = new RegExp(String(id));
    if(ten_vb_search) condition.title_vb = new RegExp(ten_vb_search, 'i');
    if(time_start) condition.created_date = {$gte: new Date(time_start)};
    if(time_end) condition.created_date = {$lte: new Date(time_end)};
    let listVanBanDenCanDuyet = await VanBan.aggregate([
        {$match: condition},
        {
            $lookup: {
            from: "vanthu_group_van_bans",
            localField: "nhom_vb",
            foreignField: "id_group_vb",
            as: "matchedDocuments"
            }
        },
        {$sort: {_id: 1}},
        {$skip: skip},
        {$limit: limit}
        ]);
    let totalCount = await VanBan.aggregate([
        {$match: condition},
        {
            $lookup: {
            from: "vanthu_group_van_bans",
            localField: "nhom_vb",
            foreignField: "id_group_vb",
            as: "matchedDocuments"
            }
        },
        {
          $group: {_id: null, count: { $sum: 1 }}
        },
        {
          $project: {_id: 0, count: 1}
        }
        ]);
    totalCount = totalCount.length > 0 ? totalCount[0].count : 0;
    return functions.success(res, "Get list van ban gui di success!", {totalCount, listVanBanDenCanDuyet});
  }catch(err) {
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}
