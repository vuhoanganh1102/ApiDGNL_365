const capPhat = require('../../models/QuanLyTaiSan/CapPhat')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const suaChua = require('../../models/QuanLyTaiSan/Sua_chua')
const BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong')
const dangSd = require('../../models/QuanLyTaiSan/TaiSanDangSuDung')
const Mat = require('../../models/QuanLyTaiSan/Mat')
const Huy = require('../../models/QuanLyTaiSan/Huy')
const fnc = require('../../services/functions')

exports.Home = async(req, res) =>{
    try{
        const id_cty = req.user.data.com_id
        let data = {}
        let q_ts_chua_sd = await TaiSan.find({ id_cty: id_cty, ts_da_xoa: 0 })
            let sl_chua_sd = 0;
            let gt_ts_chua_sd = 0;
            q_ts_chua_sd.forEach(function(value_ts_chua_sd) {
                sl_chua_sd += value_ts_chua_sd.ts_so_luong;
                gt_ts_chua_sd += value_ts_chua_sd.ts_gia_tri * value_ts_chua_sd.ts_so_luong;
            });
            console.log("tai san",sl_chua_sd,gt_ts_chua_sd)

        let q_ts_dang_sd = await dangSd.aggregate([
            {$match:{id_cty : id_cty} },

            {$lookup: {
                from: "QLTS_Tai_San",
                localField: "id_ts_sd",
                foreignField : "ts_id",
                as : "info"
            }},
            {$unwind: "$info"},
            {$project : {
                "ts_id" : "$id_ts_sd",
                "id_cty" : "$com_id_sd",
                "ts_gia_tri" : "$info.ts_gia_tri",
                "ts_so_luong" : "$info.ts_so_luong",
            }
        }])
            let sl_dang_sd = 0;
            let gt_ts_dang_sd = 0;
            q_ts_dang_sd.forEach(function(value_ts_dang_sd) {
                sl_dang_sd += value_ts_dang_sd.ts_so_luong;
                gt_ts_dang_sd += value_ts_dang_sd.ts_gia_tri * value_ts_dang_sd.ts_so_luong;
            });
            console.log("tai san dang sd::::::",sl_dang_sd,gt_ts_dang_sd)
        
        let q_ts_sua_chua = await suaChua.aggregate([
            {$match:{id_cty : id_cty} },
            {$lookup: {
                from: "QLTS_Tai_San",
                localField: "suachua_taisan",
                foreignField : "ts_id",
                as : "info"
            }},
            {$unwind: "$info"},
         
            {
                $group: {
                    _id: "$sc_id",
                    ts_id: { $first: "$info.ts_id" },
                    id_cty: { $first: "$id_cty" },
                    ts_gia_tri: { $first: "$info.ts_gia_tri" },
                    ts_so_luong: { $first: "$sl_sc" }
                }
            },
            {$match:{id_cty : id_cty} },
    ])
            let sl_dang_sc = 0;
            let gt_ts_dang_sc = 0;
            q_ts_sua_chua.forEach(function(value_ts_dang_sd) {
                gt_ts_dang_sc += value_ts_dang_sd.ts_gia_tri * value_ts_dang_sd.ts_so_luong;
                sl_dang_sc += value_ts_dang_sd.ts_so_luong;
            });
            console.log("sua chua :::::",sl_dang_sc,gt_ts_dang_sc)
        
        let q_ts_bao_duong = await BaoDuong.aggregate([
            {$match:{id_cty : id_cty} },
            {$lookup: {
                from: "QLTS_Tai_San",
                localField: "baoduong_taisan",
                foreignField : "ts_id",
                as : "info"
            }},
            {$unwind: "$info"},
        
            {
                $group: {
                    _id: "$id_bd",
                    ts_id: { $first: "$info.ts_id" },
                    id_cty: { $first: "$id_cty" },
                    ts_gia_tri: { $first: "$info.ts_gia_tri" },
                    ts_so_luong: { $first: "$bd_sl" }
                }
            },

            {$match:{id_cty : id_cty} },
    ])
            let sl_dang_bd = 0;
            let gt_ts_dang_bd = 0;
            q_ts_bao_duong.forEach(function(value_ts_dang_sd) {
                gt_ts_dang_bd += value_ts_dang_sd.ts_gia_tri * value_ts_dang_sd.ts_so_luong;
                sl_dang_bd += value_ts_dang_sd.ts_so_luong;
            });
            let sl_tong_sc_bd = (sl_dang_sc + sl_dang_bd )
            let sl_tong_gt_sc_bd = (gt_ts_dang_bd + gt_ts_dang_sc)
            console.log(sl_dang_bd,gt_ts_dang_bd)
            console.log("Sua chua- bao duong::::::",sl_tong_sc_bd,sl_tong_gt_sc_bd)


            let q_ts_mat = await Mat.aggregate([
                {$match:{id_cty : id_cty} },
                {$lookup: {
                    from: "QLTS_Tai_San",
                    localField: "mat_taisan",
                    foreignField : "ts_id",
                    as : "info"
                }},
                {$unwind: "$info"},
                {
                    $group: {
                        _id: "$mat_id",
                        ts_id: { $first: "$info.ts_id" },
                        id_cty: { $first: "$id_cty" },
                        ts_gia_tri: { $first: "$info.ts_gia_tri" },
                        ts_so_luong: { $first: "$mat_soluong" }
                    }
                },
                {$match:{id_cty : id_cty} },
            ])
                let sl_mat = 0;
                let gt_ts_mat = 0;
                q_ts_mat.forEach(function(value_ts_dang_sd) {
                    gt_ts_mat += value_ts_dang_sd.ts_gia_tri * value_ts_dang_sd.ts_so_luong;
                    sl_mat += value_ts_dang_sd.ts_so_luong;
                });
            console.log("mat ::::::",sl_mat,gt_ts_mat)

            // let q_ts_huy = await Huy.aggregate([
            //     {$match:{id_cty : id_cty} },
            //     {$lookup: {
            //         from: "QLTS_Tai_San",
            //         localField: "mat_taisan",
            //         foreignField : "ts_id",
            //         as : "info"
            //     }},
            //     {$unwind: "$info"},
            //     {
            //         $group: {
            //             _id: "$mat_id",
            //             ts_id: { $first: "$info.ts_id" },
            //             id_cty: { $first: "$id_cty" },
            //             ts_gia_tri: { $first: "$info.ts_gia_tri" },
            //             ts_so_luong: { $first: "$mat_soluong" }
            //         }
            //     },
            //     {$match:{id_cty : id_cty} },
            // ])
            //     let sl_mat = 0;
            //     let gt_ts_mat = 0;
            //     q_ts_mat.forEach(function(value_ts_dang_sd) {
            //         gt_ts_mat += value_ts_dang_sd.ts_gia_tri * value_ts_dang_sd.ts_so_luong;
            //         sl_mat += value_ts_dang_sd.ts_so_luong;
            //     });
            console.log("mat ::::::",sl_mat,gt_ts_mat)

        return fnc.success(res,"lay thanh cong",{q_ts_mat})
    }catch(e){
        return fnc.setError(res, e.message)
    }
}