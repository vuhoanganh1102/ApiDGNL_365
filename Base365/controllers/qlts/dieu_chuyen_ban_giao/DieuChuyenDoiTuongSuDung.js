const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen")
const functions = require('../../../services/functions')



// exports.showDieuChuyenDoiTuong = async (req, res) => {
//     try {
//         let { dc_id, page, perPage } = req.body
//         let com_id = '';
//         if (req.user.data.type == 1 || req.user.data.type == 2) {
//             com_id = req.user.data.com_id;
//         } else {
//             return functions.setError(res, 'không có quyền truy cập', 400);
//         }
//         page = page || 1;
//         perPage = perPage || 10;
//         let query = {
//             xoa_dieuchuyen: 0,
//         };
//         const startIndex = (page - 1) * perPage;
//         const endIndex = page * perPage;
//         if (dc_id) {
//             query.dc_id = dc_id;
//         }
//         const showDieuChuyen = await DieuChuyen.find({ id_cty : com_id, ...query })
//             .sort({ dc_id: -1 })
//             .skip(startIndex)
//             .limit(perPage);
//         const totalTsCount = await DieuChuyen.countDocuments({ id_cty: com_id, ...query });

//         // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
//         const totalPages = Math.ceil(totalTsCount / perPage);
//         const hasNextPage = endIndex < totalTsCount;

//         return functions.success(res, 'get data success', { showDieuChuyen, totalPages, hasNextPage });
//     } catch (error) {
//         console.error('Failed ', error);
//         return functions.setError(res, error);
//     }
// }
exports.showDieuChuyenDoiTuong = async(req,res) =>{
    try{//code theo PHP : add_dc_ts.php
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const id_cty = req.user.data.com_id
        const dc_id = req.body.dc_id
        let conditions = {}
        conditions.id_cty = id_cty
        if(dc_id) conditions.dc_id = dc_id
        const  data = await DieuChuyen.aggregate([
            { $match: conditions },
            {
                $lookup: {
                    from: "QLTS_Tai_San",
                    localField: "dieuchuyen_taisan.ds_dc.ts_id",
                    foreignField: "ts_id",
                    as: "infoTS"
                }
            },
            { $unwind: "$infoTS" },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_cty_dang_sd",
                    foreignField: "idQLC",
                    as: "infoCtyDangSD"
                }
            },
            // { $unwind: "$infoCtyDangSD" },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_cty_nhan",
                    foreignField: "idQLC",
                    as: "infoCty"
                }
            },
            // { $unwind: "$infoCty" },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_nv_nhan",
                    foreignField: "idQLC",
                    as: "infoNV"
                }
            },
            // { $unwind: "$infoNV" },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_nv_dangsudung",
                    foreignField: "idQLC",
                    as: "infoNVdangSD"
                }
            },
            // { $unwind: "$infoNVdangSD" },
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "id_pb_nhan",
                    foreignField: "dep_id",
                    as: "infoPhongBan"
                }
            },
            // { $unwind: "$infoPhongBan" },
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "id_pb_dang_sd",
                    foreignField: "dep_id",
                    as: "infoPhongBanDangSD"
                }
            },
            // { $unwind: "$infoPhongBanDangSD" },
            {
                $project: {
                    "dc_id": "$dc_id",
                    "dc_ngay": "$dc_ngay",
                    "dc_trangthai": "$dc_trangthai",
                    "dc_lydo": "$dc_lydo",
                    "id_ng_thuchien": "$id_ng_thuchien",
                    "id_pb_dang_sd": "$id_pb_dang_sd",
                    "id_pb_nhan": "$id_pb_nhan",
                    "id_nv_dangsudung": "$id_nv_dangsudung",
                    "id_nv_nhan": "$id_nv_nhan",
                    "id_cty_nhan": "$id_cty_nhan",
                    "id_cty_dang_sd": "$id_cty_dang_sd",
                    "ten_Cty": "$infoCty.userName",
                    "ten_Cty_dang_su_dung": "$infoCtyDangSD.userName",
                    "ten_nhanVien": "$infoNV.userName",
                    "ten_nhanVien_dang_su_dung": "$infoNVdangSD.userName",
                    "ten_phongBan": "$infoPhongBan.dep_name",
                    "ten_phongBan_dang_su_dung": "$infoPhongBanDangSD.dep_name",
                    "ten_tai_san": "$infoTS.ts_ten",
                    "Ma_tai_san": "$infoTS.ts_id",
                }
            },

        ]).skip(skip).limit(limit)
        let count = await DieuChuyen.count(conditions)
        const totalCount = data.length > 0 ? data[0].totalCount : 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        if(data){
            return fnc.success(res,"lấy thành công",{data,totalPages,count})
        }
        return fnc.setError(res,"không tìm thấy dữ liệu")
    }catch(e){
        return fnc.setError(res, e.message)
    }
}