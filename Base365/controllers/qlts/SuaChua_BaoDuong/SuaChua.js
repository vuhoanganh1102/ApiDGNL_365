const ThongBao = require("../../../models/QuanLyTaiSan/ThongBao");
const SuaChua = require("../../../models/QuanLyTaiSan/Sua_chua");
const TaiSan = require('../../../models/QuanLyTaiSan/TaiSan');
const QuaTrinhSuDung = require("../../../models/QuanLyTaiSan/QuaTrinhSuDung");
const TaiSanDangSuDung = require("../../../models/QuanLyTaiSan/TaiSanDangSuDung");
const Users = require("../../../models/Users");
const fnc = require("../../../services/functions")


//Tài sản đang sửa chữa




//hoanthanh
exports.HoanThanhSuaChua = async (req, res) => {
    let { id_bb, chiphi_thucte, date_nhapkho, date_done, type_quyen_duyet } = req.body;
    let com_id = 0;
    // let id_ng_xoa = 0;

    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
        //  id_ng_xoa = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
        // id_ng_xoa = req.user.data.idQLC;

    }
    let ng_duyet = req.user.data.idQLC;

    try {

        let hoan_thanh_sua_chua = await SuaChua.findOneAndUpdate({ sc_id: id_bb, id_cty: com_id }, {
            sc_trangthai: 3, sc_chiphi_thucte: chiphi_thucte, sc_hoanthanh: date_done,
            sc_ngay_nhapkho: date_nhapkho, sc_date_duyet: new Date().getTime(), sc_ng_duyet: ng_duyet, sc_type_quyet_duyet: type_quyen_duyet
        });
        let q_this_sc = await SuaChua.findOne({ id_cty: com_id, sc_id: id_bb });
        let quyen_ng_sd = q_this_sc.sc_quyen_sd;
        let id_ts = q_this_sc.suachua_taisan;
        let sl_sc = q_this_sc.sl_sc;
        let ng_sd = q_this_sc.sc_ng_sd;
        if (quyen_ng_sd == 1) {
            //sua chua tai san chua cap phat
            let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
            let sl_ts_cu = q_taisan.ts_so_luong;
            let update_sl = sl_ts_cu + sl_sc;
            let update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl, soluong_cp_bb: update_sl });

        }
        if (quyen_ng_sd == 2) {
            //tai san cap phat cho nhan vien
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu + sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });

        }
        if (quyen_ng_sd == 3) {
            //tai san cap phat cho phong ban
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu + sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
        }

        return res.status(200).json({ data: hoan_thanh_sua_chua, message: "thanhcong" });
    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
}



//edit_suachua
exports.SuaChuaBB = async (req, res) => {
    let { id_sc, sl_sc, trangthai_sc, ngay_sc, ngay_dukien, hoanthanh_sc, chiphi_dukien, chiphi_thucte, nd_sc, ng_thuc_hien } = req.body;
    let dia_diem_sc = req.body.dia_diem_sc || 0;
    let dv_sc = req.body.dv_sc || 0;
    let dia_chi_nha_cung_cap = req.body.dia_chi_nha_cung_cap || 0;
    let com_id = 0;
    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id
    }
    try {
        let q_sua_chua = await SuaChua.findOne({ id_cty: com_id, sc_id: id_sc });
        let sc_quyen_sd = q_sua_chua.sc_quyen_sd;
        let sl_sc_cu = q_sua_chua.sl_sc;
        let ng_sd = q_sua_chua.sc_ng_sd;
        let id_ts = q_sua_chua.suachua_taisan;
        let taisan = {};
        if (sc_quyen_sd == 1) {
            let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
            let sl_ts_cu_ts = q_taisan.ts_so_luong;
            let sl_ts_ban_dau = (sl_ts_cu_ts + sl_sc_cu);
            let update_sl = sl_ts_ban_dau - sl_sc;
            taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl, soluong_cp_bb: update_sl });
        }
        if (sc_quyen_sd == 2) {
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu_ts = q_taisan_doituong.sl_dang_sd;
            let sl_ts_ban_dau = sl_ts_cu_ts + sl_sc_cu;
            let update_sl = sl_ts_ban_dau - sl_sc;
            taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_nv_sd: ng_sd }, { sl_dang_sd: update_sl });
        }
        if (sc_quyen_sd == 3) {
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu_ts = q_taisan_doituong.sl_dang_sd;
            let sl_ts_ban_dau = sl_ts_cu_ts + sl_sc_cu;
            let update_sl = sl_ts_ban_dau - sl_sc;
            taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_pb_sd: ng_sd }, { sl_dang_sd: update_sl });

        }

        let suachua = await SuaChua.findOneAndUpdate({ id_cty: com_id, sc_id: id_sc }, {
            sl_sc: sl_sc,
            sc_ng_thuchien: ng_thuc_hien,
            sc_trangthai: trangthai_sc,
            sc_ngay: ngay_sc,
            sc_dukien: ngay_dukien,
            sc_hoanthanh: hoanthanh_sc,
            sc_noidung: nd_sc,
            sc_chiphi_dukien: chiphi_dukien,
            sc_chiphi_thucte: chiphi_thucte,
            sc_donvi: dv_sc,
            sc_loai_diadiem: dia_diem_sc,
            sc_diachi: dia_chi_nha_cung_cap,

        })

        return res.status(200).json({ data: { taisan: taisan, suachua: suachua }, message: "thanh cong" });
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }

}

// exports.Seach = async (req, res) => {
//     let id_bb = req.body.id_bb;
//     let trang_thai = req.body.trang_thai;
//     try {
//         if (isNaN(id_bb) || isNaN(trang_thai)) {
//             return res.status(404).json("id  và trang thaibien ban phai la 1 so");
//         } else {
//             let listdata = await SuaChua.findOne({ sc_id: id_bb });
//             if (listdata) {
//                 return res.status(200).json({ data: listdata, message: " thanh cong " });
//             } else {
//                 return res.status(202).json({ data: [], message: " khong co du lieu " });
//             }
//         }

//     } catch (error) {

//         return res.status(500).json({ message: error.message });
//     }
// }

exports.listBBDangSuaChua = async (req, res) => {


    try {
        let skip = req.body.skip || 1;
        let limit = req.body.limit || 10;
        let key = req.body.key || null;

        let com_id = 0;

        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
        }
        let filter = {
            id_cty: com_id,
            sc_trangthai: 1,
            sc_da_xoa: 0,
        }
        if (key) {
            filter.sc_id = Number(key);
        }

        let condition = {};
        let filter2 = {};
        let filter3 = {};
        if (type_quyen == 2) {
            // condition = ep_id;
            filter2.sc_id_ng_tao = ep_id;
            filter3.sc_ng_thuchien = ep_id;

        }

        let tsda_suachua = await SuaChua.aggregate([
            {
                $match:
                {
                    $and: [
                        filter,
                        {
                            $or: [
                                filter2,
                                filter3
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'QLTS_Tai_San',
                    localField: 'suachua_taisan',
                    foreignField: 'ts_id',
                    as: 'infoTS'
                }
            },
            {
                $project: {
                    'sc_ngay': '$sc_ngay',
                    'sc_dukien': '$sc_dukien',
                    'suachua_taisan': '$suachua_taisan',
                    'sc_id': '$sc_id',
                    'sc_chiphi_dukien': '$sc_chiphi_dukien',
                    'sc_noidung': '$sc_noidung',
                    'sl_sc': '$sl_sc',
                    'ten_ts': '$infoTS.ts_ten',
                }
            },
            {
                $sort: {
                    sc_id: -1
                }
            },
            {
                $skip: (skip++ - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        fnc.success(res, 'OK', [tsda_suachua]);


    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}
//xoa_sc2
exports.XoabbSuaChua = async (req, res) => {
    //nhân viên không có quyền xóa
    //xóa riêng lẻ từng biên bản

    let { datatype,
        id, //id bien ban sua chua
        type_quyen, } = req.body;
    let com_id = 0;
    let id_ng_xoa = 0;


    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
        id_ng_xoa = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
        id_ng_xoa = req.user.data.idQLC;

    }
    try {
        let suachua = await SuaChua.findOne({ id_cty: com_id, sc_id: id });
        let ng_sd = suachua.sc_ng_sd;
        let sc_quyen_sd = suachua.sc_quyen_sd;
        let sl_sc = suachua.sl_sc;
        let id_ts = suachua.suachua_taisan;
        let trang_thai_sc = suachua.sc_trangthai;
        let update_taisan = {};
        let bb_crr = {};
        if (datatype == 1) {
            //xoa 
            bb_crr = await SuaChua.findOneAndUpdate({ sc_id: id, id_cty: com_id }, { sc_da_xoa: 1, sc_type_quyen_xoa: type_quyen, sc_id_ng_xoa: id_ng_xoa, sc_date_delete: new Date().getTime() });
            if (trang_thai_sc == 0) {
                if (sc_quyen_sd == 1) {
                    let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
                    let sl_ts_cu = q_taisan.ts_so_luong;
                    let update_sl = sl_ts_cu + sl_sc;
                    update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl });
                }
                if (sc_quyen_sd == 2) {
                    let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
                    let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                    let update_sl = sl_ts_cu + sl_sc;
                    update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                }
                if (sc_quyen_sd == 3) {
                    let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
                    let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                    let update_sl = sl_ts_cu + sl_sc;
                    update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                }
            }
            if (datatype == 2) {
                //khoi phuc
                bb_crr = await SuaChua.findOneAndUpdate({ sc_id: id, id_cty: com_id }, { sc_da_xoa: 0, sc_type_quyen_xoa: 0, sc_id_ng_xoa: 0, sc_date_delete: 0 });
                if (trang_thai_sc == 0) {
                    if (sc_quyen_sd == 1) {
                        let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
                        let sl_ts_cu = q_taisan.ts_so_luong;
                        let update_sl = sl_ts_cu - sl_sc;
                        update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl });
                    }
                    if (sc_quyen_sd == 2) {
                        let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
                        let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                        let update_sl = sl_ts_cu - sl_sc;
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                    }
                    if (sc_quyen_sd == 3) {
                        let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
                        let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                        let update_sl = sl_ts_cu - sl_sc;
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                    }
                }
            }
            if (datatype == 3) {
                //xoa vinh vien
                bb_crr = await SuaChua.findOneAndRemove({ sc_id: id, id_cty: com_id });
            }
        }
        return res.status(200).json({ data: { bb_crr: bb_crr, update_taisan: update_taisan }, message: "thanh cong" });
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}

//xoa_all2
exports.deleteAll = async (req, res) => {
    //xoa cùng lúc nhiều biên bản , bao gồm cả khôi phục và xóa vĩnh viễn
    let { xoa_vinh_vien,
        array_xoa, // danh sach bien ban muon xoa
        type_quyen } = req.body;
    let com_id = 0;
    let id_ng_xoa = 0;

    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
        id_ng_xoa = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = user_xoa.inForPerson.employee.type.com_id;
        id_ng_xoa = req.user.data.idQLC;
    }
    try {
        let xoa = array_xoa.split(",");
        let dem = xoa.length;
        let xoa_sua_chua = {};
        let update_taisan = {};

        if (xoa_vinh_vien == 0) {
            //xoa
            for (let i = 0; i < dem; i++) {
                let suachua = await SuaChua.findOne({ id_cty: com_id, sc_id: xoa[i] });
                let ng_sd = suachua.sc_ng_sd;
                let sc_quyen_sd = suachua.sc_quyen_sd;
                let sl_sc = suachua.sl_sc;
                let id_ts = suachua.suachua_taisan;
                let trang_thai_sc = suachua.sc_trangthai;
                xoa_sua_chua = await SuaChua.findOneAndUpdate({ sc_id: xoa[i], id_cty: com_id }, { sc_da_xoa: 1, sc_type_quyen_xoa: type_quyen, sc_id_ng_xoa: id_ng_xoa, sc_date_delete: new Date().getTime() });
                if (trang_thai_sc == 0) {
                    if (sc_quyen_sd == 1) {
                        let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
                        let sl_ts_cu = q_taisan.ts_so_luong;
                        let update_sl = sl_ts_cu + sl_sc;
                        update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl });

                    }
                    if (sc_quyen_sd == 2) {
                        let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
                        let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                        let update_sl = sl_ts_cu + sl_sc;
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                    }
                    if (sc_quyen_sd == 3) {
                        let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
                        let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                        let update_sl = sl_ts_cu + sl_sc;
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                    }
                }
            }

        } else if (xoa_vinh_vien == 2) {
            //khoi phuc 
            for (let i = 0; i < dem; i++) {
                let suachua = await SuaChua.findOne({ id_cty: com_id, sc_id: xoa[i] });
                let ng_sd = suachua.sc_ng_sd;
                let sc_quyen_sd = suachua.sc_quyen_sd;
                let sl_sc = suachua.sl_sc;
                let id_ts = suachua.suachua_taisan;
                let trang_thai_sc = suachua.sc_trangthai;
                xoa_sua_chua = await SuaChua.findOneAndUpdate({ sc_id: xoa[i], id_cty: com_id }, { sc_da_xoa: 0, sc_type_quyen_xoa: 0, sc_id_ng_xoa: 0, sc_date_delete: 0 });
                if (trang_thai_sc == 0) {
                    if (sc_quyen_sd == 1) {
                        let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
                        let sl_ts_cu = q_taisan.ts_so_luong;
                        let update_sl = sl_ts_cu - sl_sc;
                        update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl });

                    }
                    if (sc_quyen_sd == 2) {
                        let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
                        let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                        let update_sl = sl_ts_cu - sl_sc;
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                    }
                    if (sc_quyen_sd == 3) {
                        let q_taisan_doituong = TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
                        let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                        let update_sl = sl_ts_cu - sl_sc;
                        update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts }, { sl_dang_sd: update_sl });
                    }
                }
            }
        } else {
            //xoa vinh vien
            for (let i = 0; i < dem; i++) {
                xoa_sua_chua = await SuaChua.findOneAndRemove({ sc_id: xoa[i], id_cty: com_id });
            }
        }
        return res.status(200).json({ data: { xoa_sua_chua: xoa_sua_chua, update_taisan: update_taisan }, message: "thanh cong " });
        // } else {
        //     return res.status(404).json({ message: "loai_xoa khong dung" });
        // }
    } catch (error) {


        return res.status(500).json({ message: error.message });

    }
}


exports.details = async (req, res) => {
    let iddsc = req.body.iddsc;
    let com_id = 0;

    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;


    } else if (req.user.data.type == 2) {
        com_id = req.user.data.com_id;

    }
    try {
        if (isNaN(iddsc)) {
            fnc.setError(res, "iddsc phai la 1 Number")
        }
        else {
            let bb = await SuaChua.findOne({ sc_id: id_bb });
            let tenTaiSan = await TaiSan.findOne({ ts_id: Number(bb.suachua_taisan) });
            let nguoiSD = await Users.findOne({
                'idQLC': bb.sc_ng_sd,
                type: { $ne: 1 }
            });
            let nguoiThucHien = await Users.findOne({
                idQLC: bb.sc_ng_thuchien,
                type: { $ne: 1 }
            });
            let nguoi_tao = await Users.findOne({
                idQLC: bb.sc_id_ng_tao,
                type: { $ne: 1 }
            });
            let nguoi_duyet = await Users.findOne({
                idQLC: bb.sc_ng_duyet,

            });

            let info_bb = {
                //thong tin chung 
                so_bb: bb.sc_id,
                nguoi_tao: nguoi_tao.userName,
                ngay_tao: bb.sc_date_create,
                nguoi_duyet: nguoi_duyet != null ? nguoi_duyet.userName : 'chua cap nhap',
                ngay_duyet: bb.sc_date_duyet,
                trang_thai: bb.sc_trangthai,
                //thong tin tai san
                ma_tai_san: bb.suachua_taisan,
                ten_tai_san: tenTaiSan.ts_ten,
                so_luong: bb.sl_sc,
                doi_tuong_su_dung: nguoiSD.userName,
                vi_tri_tai_san: bb.sc_ts_vitri,
                //thong tin sua chua 
                ngay_hong: bb.sc_ngay_hong,
                noi_dung_sua_chua: bb.sc_noidung,
                nguoi_thuc_hien: nguoiThucHien.userName,
                phong_ban: nguoiThucHien.inForPerson.employee.dep_id,
                ngay_sua_chua: bb.sc_ngay,
                ngay_du_kien_hoan_thanh: bb.sc_dukien,
                chi_phi_du_kien: bb.sc_chiphi_dukien,
                don_vi_sua_chua: bb.sc_donvi,
                dia_diem_sua_chua: bb.sc_diachi
            };
            fnc.success(res, "ok", chitietdangsuachua);

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

//Tài sản đã sủa chữa
//xoa_bb_sua_chua
exports.xoa_bb_sua_chua = async (req, res) => {
    //xóa riêng lẻ từng biên bản 
    //
    let { datatype, id, type_quyen } = req.body;
    let com_id = 0;
    let id_ng_xoa = 0;
    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
        id_ng_xoa = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
        id_ng_xoa = req.user.data.idQLC;

    }
    try {
        if (isNaN(datatype) || isNaN(id) || isNaN(type_quyen) || isNaN(id_ng_xoa)) {
            return res.status(404).json({ message: "datatype, id, type_quyen, id_ng_xoa phai la 1 so" });
        } else {
            if (datatype == 1) {
                let suachua = await SuaChua.findOneAndUpdate({ sc_id: id, id_cty: com_id }, { sc_da_xoa: 1, sc_type_quyen_xoa: type_quyen, sc_id_ng_xoa: id_ng_xoa, date_delete: new Date().getTime() });
                return res.status(200).json({ data: suachua, message: " xoa thanh cong" });
            }
            if (datatype == 2) {
                let khoiphuc = await SuaChua.findOneAndUpdate({ sc_id: id, id_cty: com_id }, { sc_da_xoa: 0, sc_type_quyen_xoa: 0, sc_id_ng_xoa: 0 });
                return res.status(200).json({ data: khoiphuc, message: " khoi phuc thanh cong" });
            }
            if (datatype == 3) {
                let xoa = await SuaChua.findOneAndRemove({ sc_id: id, id_cty: com_id });
                return res.status(200).json({ data: xoa, message: " xoa vinh vien thanh cong" });
            } else {
                return res.status(500).json({ message: 'datatype phai la 1 so tu 1- 3' })
            }
        }
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}
//xoa_all
exports.xoa_all = async (req, res) => {
    let { xoa_vinh_vien, array_xoa, type_quyen } = req.body;
    let com_id = 0;
    let id_ng_xoa = 0;

    //let com_id  =req.comId || 1763;

    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
        id_ng_xoa = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = user_xoa.inForPerson.employee.type.com_id;
        id_ng_xoa = req.user.data.idQLC;

    }

    try {

        if (isNaN(xoa_vinh_vien) || isNaN(type_quyen)) {
            return res.status(404).json({ message: "xoa_vinh_vien,type_quyen phai la 1 so  " });
        } else {
            let xoa = array_xoa.split(",");
            let dem = xoa.length;
            if (xoa_vinh_vien == 0) {
                //xoa
                let xoa_sua_chua = await SuaChua.findOneAndUpdate({ id_cty: com_id, sc_id: { $in: xoa } },
                    { sc_da_xoa: 1, sc_type_quyen_xoa: type_quyen, sc_id_ng_xoa: id_ng_xoa });
                return res.status(200).json({ message: "xoa thanh cong" });
            } else if (xoa_vinh_vien == 2) {
                //khoi phuc
                let xoa_sua_chua = await SuaChua.findOneAndUpdate({ id_cty: com_id, sc_id: { $in: xoa } },
                    { sc_da_xoa: 0, sc_type_quyen_xoa: 0, sc_id_ng_xoa: 0 });
                return res.status(200).json({ message: "khoi phuc thanh cong" });
            } else {
                //xoa vinh vien 
                let xoa_sua_chua = await SuaChua.findOneAndRemove({ id_cty: com_id, sc_id: { $in: xoa } });
                return res.status(200).json({ message: "xoa  vinh vien thanh cong" });
            }
        }
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }

}


exports.details_bb_da_sua_chua = async (req, res) => {



    let id_bb = req.body.id_bb;
    let com_id = 0;


    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
    }
    try {

        if (isNaN(id_bb)) {
            return res.status(404).json({ message: "id bien ban phai la 1 so " });
        }
        else {
            let bb = await SuaChua.findOne({ sc_id: id_bb });
            let tenTaiSan = await TaiSan.findOne({ ts_id: Number(bb.suachua_taisan) });
            let nguoiSD = await Users.findOne({
                'idQLC': bb.sc_ng_sd,
                type: { $ne: 1 }
            });
            let nguoiThucHien = await Users.findOne({
                idQLC: bb.sc_ng_thuchien,
                type: { $ne: 1 }
            });
            let nguoi_tao = await Users.findOne({
                idQLC: bb.sc_id_ng_tao,
                type: { $ne: 1 }
            });

            let info_bb = {
                //thong tin chung 
                so_bb: bb.sc_id,
                nguoi_tao: nguoi_tao.userName,
                ngay_tao: new Date(bb.sc_date_create * 1000),
                //   nguoi_duyet: bb.sc_ng_duyet,
                ngay_duyet: new Date(bb.sc_date_duyet * 1000),
                trang_thai: bb.sc_trangthai,
                //thong tin tai san
                ma_tai_san: bb.suachua_taisan,
                ten_tai_san: tenTaiSan.ts_ten,
                so_luong: bb.sl_sc,
                doi_tuong_su_dung: nguoiSD.userName,
                vi_tri_tai_san: bb.sc_ts_vitri,
                //thong tin sua chua 
                ngay_hong: bb.sc_ngay_hong,
                noi_dung_sua_chua: bb.sc_noidung,
                nguoi_thuc_hien: nguoiThucHien.userName,
                phong_ban: nguoiThucHien.inForPerson.employee.dep_id,
                chi_phi_du_kien: bb.sc_chiphi_dukien,
                chi_phi_thuc_te: bb.sc_chiphi_thucte,
                ngay_sua_chua: bb.sc_ngay,
                ngay_du_kien_hoan_thanh: bb.sc_dukien,
                ngay_sua_chua_xong: bb.sc_hoanthanh,
                don_vi_sua_chua: bb.sc_donvi,
                dia_diem_sua_chua: bb.sc_diachi
            };
            return res.status(200).json({ data: info_bb, message: 'thanh cong' });
        }
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}
exports.listBBDaSuaChua = async (req, res) => {
    try {
        let token = req.user;

        let page = req.body.page || 1;
        let limit = req.body.perPage || 10;
    
        let type_quyen = req.body.type_quyen;
        let key = req.body.key;
        let com_id = 0;
        let ep_id = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
            ep_id = req.user.data.inForPerson.employee.dep_id;
        }
        let filter = {
            id_cty: com_id,
            sc_trangthai: 1,
            sc_da_xoa: 0,
        }
        if (key) {
            filter.sc_id = Number(key);
        }

        let condition = {};
        let filter2 = {};
        let filter3 = {};
        if (type_quyen == 2) {
            // condition = ep_id;
            filter2.sc_id_ng_tao = ep_id;
            filter3.sc_ng_thuchien = ep_id;

        }

        let tsda_suachua = await SuaChua.aggregate([
            {
                $match:
                {
                    $and: [
                        filter,
                        {
                            $or: [
                                filter2,
                                filter3
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'QLTS_Tai_San',
                    localField: 'suachua_taisan',
                    foreignField: 'ts_id',
                    as: 'infoTS'
                }

            },
            {
                $project: {
                    'sc_ngay': '$sc_ngay',
                    'sc_dukien': '$sc_dukien',
                    'sc_hoanthanh': '$sc_hoanthanh',
                    'suachua_taisan': '$suachua_taisan',
                    'sc_id': '$sc_id',
                    'sc_chiphi_dukien': '$sc_chiphi_dukien',
                    'sc_chiphi_thucte': '$sc_chiphi_thucte',
                    'sc_noidung': '$sc_noidung',
                    'sl_sc': '$sl_sc',
                    'ten_ts': '$infoTS.ts_ten',
                }
            },
            {
                $sort: {
                    sc_id: -1
                }
            },
            {
                $skip: (skip - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        fnc.success(res, 'OK', [tsda_suachua]);
    } catch (error) {
        console.log(error);
        fnc.setError(res, "loi he thong");

    }
}

//tài sản cần sửa chữa
//add_suachua
exports.addSuaChua = async (req, res) => {

    let { id_ts, sl_sc, trangthai_sc, type_quyen, loai_bb, sc_quyen_sd, ng_sd, vitri_ts, dv_sc, dia_chi_nha_cung_cap,
        ngay_sc, ngay_dukien, hoanthanh_sc, chiphi_dukien, chiphi_thucte, nd_sc, ng_thuc_hien, dia_diem_sc, } = req.body;
    let com_id = 0;
    let id_ng_tao = 0;
    //let com_id  =req.comId || 1763;

    if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
        id_ng_tao = req.user.data.idQLC;

    } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
        id_ng_tao = req.user.data.idQLC;

    }


    try {
        let maxID = 0;
        let ID_bb_sua_chua = 0;
        let maxID_1 = await ThongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        if (maxID_1) {
            maxID = maxID_1.id_tb;
        }
        let new_thongBao_1 = new ThongBao({
            id_tb: Number(maxID + 1),

            id_cty: com_id,
            id_ng_nhan: com_id,
            id_ng_tao: id_ng_tao,//người tạo là công ty 
            type_quyen: 2,
            type_quyen_tao: type_quyen,
            loai_tb: 4,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: new Date().getTime()
        });
        await new_thongBao_1.save();

        maxID = 0;
        let maxID_2 = await ThongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        if (maxID_2) {
            maxID = maxID_2.id_tb;
        }
        let new_thongBao_2 = new ThongBao({
            id_tb: Number(maxID + 1),
            id_cty: com_id,
            id_ng_nhan: ng_sd,
            id_ng_tao: id_ng_tao,
            type_quyen: 2,
            type_quyen_tao: type_quyen,
            loai_tb: 4,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: new Date().getTime()
        });
        await new_thongBao_2.save();



        let bb_sc = 0;
        if (loai_bb == 0) {
            // sc ts da cp
            let max_ID = 0;
            let max_id = await SuaChua.findOne({}, {}, { sort: { sc_id: -1 } }).lean();
            if (max_id) {
                max_ID = max_id.sc_id;
            } max_id
            ID_bb_sua_chua = max_ID + 1;
            let new_SuaChua = new SuaChua({
                sc_id: max_ID + 1,
                suachua_taisan: id_ts,
                sl_sc: sl_sc,
                id_cty: com_id,
                sc_ng_thuchien: ng_thuc_hien,
                sc_trangthai: trangthai_sc,
                sc_ngay_hong: ngay_sc,
                sc_ngay: ngay_sc,
                sc_dukien: ngay_dukien,
                sc_hoanthanh: hoanthanh_sc,
                sc_noidung: nd_sc,
                sc_chiphi_dukien: chiphi_dukien,
                sc_chiphi_thucte: chiphi_thucte,
                sc_donvi: dv_sc,
                sc_loai_diadiem: dia_diem_sc,
                sc_diachi: dia_chi_nha_cung_cap,
                sc_ngay_nhapkho: 0,
                sc_type_quyen: type_quyen,
                sc_id_ng_tao: id_ng_tao,
                sc_ng_sd: ng_sd,
                sc_quyen_sd: sc_quyen_sd,
                sc_ts_vitri: vitri_ts,
                sc_date_create: new Date().getTime()
            });
            await new_SuaChua.save();
            bb_sc = new_SuaChua;

        } else if (loai_bb == 1) {
            // sc ts chua cp
            let max_ID_1 = 0;
            let max_id_1 = await SuaChua.findOne({}, {}, { sort: { sc_id: -1 } }).lean();
            if (max_id_1) {
                max_ID_1 = max_id_1.sc_id;
            }
            ID_bb_sua_chua = max_ID_1 + 1;
            let new_SuaChua_1 = new SuaChua({
                sc_id: max_ID_1 + 1,
                suachua_taisan: id_ts,
                sl_sc: sl_sc,
                id_cty: com_id,
                sc_ng_thuchien: ng_thuc_hien,
                sc_trangthai: 1,
                sc_ngay_hong: ngay_sc,
                sc_ngay: ngay_sc,
                sc_dukien: ngay_dukien,
                sc_hoanthanh: hoanthanh_sc,
                sc_noidung: nd_sc,
                sc_chiphi_dukien: chiphi_dukien,
                sc_chiphi_thucte: chiphi_thucte,
                sc_donvi: dv_sc,
                sc_loai_diadiem: dia_diem_sc,
                sc_diachi: dia_chi_nha_cung_cap,
                sc_ngay_nhapkho: 0,
                sc_type_quyen: type_quyen,
                sc_id_ng_tao: id_ng_tao,//nguoi tao la cong ty 
                sc_ng_sd: ng_sd,
                sc_quyen_sd: sc_quyen_sd,
                sc_ts_vitri: vitri_ts,
                sc_date_create: new Date().getTime()
            });
            await new_SuaChua_1.save();
            bb_sc = new_SuaChua_1;

        }
        let ts = 0;
        if (sc_quyen_sd == 1) {
            // sc tai san chua cap phat
            ts = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
            let sl_ts_cu = ts.ts_so_luong;
            let update_sl = 0;
            if (ts.ts_so_luong > sl_sc) {
                update_sl = sl_ts_cu - sl_sc;
                let update_taiSan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl, soluong_cp_bb: update_sl });
                let max_ID = 0;
                let maxID_QTSD = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } }).lean();
                if (maxID_QTSD) {
                    max_ID = maxID_QTSD.quatrinh_id;
                }
                let qr_qtr_sd = new QuaTrinhSuDung({
                    quatrinh_id: max_ID + 1,
                    id_ts: id_ts,
                    id_bien_ban: ID_bb_sua_chua,
                    so_lg: sl_sc,
                    id_cty: com_id,
                    id_cty_sudung: com_id,
                    qt_ngay_thuchien: ngay_sc,
                    qt_nghiep_vu: 4,
                    vitri_ts: vitri_ts,
                    ghi_chu: nd_sc,
                    time_created: new Date().getTime()
                });
                await qr_qtr_sd.save();



            } else {
                return res.status(404).json({ message: "so luong sua chua lon hon so tai san hien co" });
            }
        }
        if (sc_quyen_sd == 2) {
            // sc tai san cp cho nv
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu - sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_nv_sd: ng_sd }, { sl_dang_sd: update_sl });
            let max_ID = 0;
            let maxID_QTSD = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } }).lean();
            if (maxID_QTSD) {
                max_ID = maxID_QTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: max_ID + 1,
                id_ts: id_ts,
                id_bien_ban: ID_bb_sua_chua,
                so_lg: sl_sc,
                id_cty: com_id,
                id_ng_sudung: ng_sd,
                qt_ngay_thuchien: ngay_sc,
                qt_nghiep_vu: 4,
                vitri_ts: vitri_ts,
                ghi_chu: nd_sc,
                time_created: new Date().getTime()
            });
            await qr_qtr_sd.save();
        }

        if (sc_quyen_sd == 3) {
            // sc tai san cp cho phong ban
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu - sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_pb_sd: ng_sd }, { sl_dang_sd: update_sl });
            let max_ID = 0;
            let maxID_QTSD = await QuaTrinhSuDung.findOne({}, {}, { sort: { quatrinh_id: -1 } }).lean();
            if (maxID_QTSD) {
                max_ID = maxID_QTSD.quatrinh_id;
            }
            let qr_qtr_sd = new QuaTrinhSuDung({
                quatrinh_id: max_ID + 1,
                id_ts: id_ts,
                id_bien_ban: ID_bb_sua_chua,
                so_lg: sl_sc,
                id_cty: com_id,
                id_phong_sudung: ng_sd,
                qt_ngay_thuchien: ngay_sc,
                qt_nghiep_vu: 4,
                vitri_ts: vitri_ts,
                ghi_chu: nd_sc,
                time_created: new Date().getTime()

            });
            await qr_qtr_sd.save();
        }
        return res.status(200).json({ data: bb_sc, message: "thanh cong" });
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}
//tu_choi
exports.tuChoiSC = async (req, res) => {
    let { id_bb, content } = req.body;
    let com_id = 0;
    try {
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
        } else if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
        }

        let tuchoi_sua_chua = await SuaChua.findOneAndUpdate({ sc_id: id_bb, id_cty: com_id }, { sc_trangthai: 2, sc_lydo_tuchoi: content });
        let q_suachua = await SuaChua.findOne({ id_cty: com_id, sc_id: id_bb });
        let ng_sd = q_suachua.sc_ng_sd;
        let sc_quyen_sd = q_suachua.sc_quyen_sd;
        let sl_sc = q_suachua.sl_sc;
        let id_ts = q_suachua.suachua_taisan;
        if (sc_quyen_sd == 1) {
            let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
            let sl_ts_cu = q_taisan.ts_so_luong;
            let update_sl = sl_ts_cu + sl_sc;
            let update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl, soluong_cp_bb: update_sl });
            return res.status(200).json({ data: { tuchoi_sua_chua: tuchoi_sua_chua, update_taisan: update_taisan }, message: "success" });
        } else if (sc_quyen_sd == 2) {
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu + sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_nv_sd: ng_sd }, { sl_dang_sd: update_sl, });
            return res.status(200).json({ data: { tuchoi_sua_chua: tuchoi_sua_chua, update_taisan: update_taisan }, message: "success" });
        } else if (sc_quyen_sd == 3) {
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu + sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_pb_sd: id_ts, id_nv_sd: ng_sd }, { sl_dang_sd: update_sl, });
            return res.status(200).json({ data: { tuchoi_sua_chua: tuchoi_sua_chua, update_taisan: update_taisan }, message: "success" });
        } else {
            return res.status(500).json({ message: " sc_quyen_sd  fails" });
        }


    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}

//xoa_sc2
exports.xoaBBcanSC = async (req, res) => {


    //xóa riêng lẻ từng biên bản
    let { datatype, id, type_quyen, } = req.body;
    let com_id = 0;
    let id_ng_xoa = 0;
    try {
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
            id_ng_xoa = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = user_xoa.inForPerson.employee.type.com_id;
            id_ng_xoa = req.user.data.idQLC;

        }
        let q_suachua = await SuaChua.findOne({ id_cty: com_id, sc_id: id });
        let ng_sd = q_suachua.sc_ng_sd;
        let sc_quyen_sd = q_suachua.sc_quyen_sd;
        let sl_sc = q_suachua.sl_sc;
        let id_ts = q_suachua.suachua_taisan;
        let trang_thai_sc = q_suachua.sc_trangthai;
        if (datatype == 1) {
            //xoa
            let suachua = await SuaChua.findOneAndUpdate({ sc_id: id, id_cty: com_id },
                { sc_da_xoa: 1, sc_type_quyen_xoa: type_quyen, sc_id_ng_xoa: id_ng_xoa, sc_date_delete: new Date().getTime() });
            if (trang_thai_sc == 0) {
                if (sc_quyen_sd == 1) {
                    let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
                    let sl_ts_cu = q_taisan.ts_so_luong;
                    let update_sl = sl_ts_cu + sl_sc;
                    let update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl });
                    return res.status(200).json({ data: { suachua: suachua, update_taisan: update_taisan, message: "xoa thanh cong " } });

                }
                if (sc_quyen_sd == 2) {
                    let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
                    let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                    let update_sl = sl_ts_cu + sl_sc;
                    let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_nv_sd: ng_sd }, { sl_dang_sd: update_sl, });
                    return res.status(200).json({ data: { suachua: suachua, update_taisan: update_taisan, message: "xoa thanh cong " } });
                }
                if (sc_quyen_sd == 3) {
                    let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
                    let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                    let update_sl = sl_ts_cu + sl_sc;
                    let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_pb_sd: ng_sd }, { sl_dang_sd: update_sl, });
                    return res.status(200).json({ data: { suachua: suachua, update_taisan: update_taisan, message: "xoa thanh cong " } });

                }
            }
            return res.status(200).json({ data: suachua, message: "xoa thanh cong " });
        }
        if (datatype == 2) {
            //khoiphuc
            let khoiphuc = await SuaChua.findOneAndUpdate({ sc_id: id, id_cty: com_id },
                { sc_da_xoa: 0, sc_type_quyen_xoa: 0, sc_id_ng_xoa: 0, sc_date_delete: 0 });
            if (trang_thai_sc == 0) {

                if (sc_quyen_sd == 1) {
                    let q_taisan = await TaiSan.findOne({ id_cty: com_id, ts_id: id_ts });
                    let sl_ts_cu = q_taisan.ts_so_luong;
                    let update_sl = sl_ts_cu - sl_sc;
                    let update_taisan = await TaiSan.findOneAndUpdate({ id_cty: com_id, ts_id: id_ts }, { ts_so_luong: update_sl });
                    return res.status(200).json({ data: { khoiphuc: khoiphuc, update_taisan: update_taisan, message: "khoi phuc thanh cong" } });
                }
                if (sc_quyen_sd == 2) {
                    let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_nv_sd: ng_sd, id_ts_sd: id_ts });
                    let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                    let update_sl = sl_ts_cu - sl_sc;
                    let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_nv_sd: ng_sd },
                        { sl_dang_sd: update_sl, });
                    return res.status(200).json({ data: { khoiphuc: khoiphuc, update_taisan: update_taisan, message: "khoi phuc thanh cong" } });
                }
                if (sc_quyen_sd == 3) {
                    let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: com_id, id_pb_sd: ng_sd, id_ts_sd: id_ts });
                    let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
                    let update_sl = sl_ts_cu - sl_sc;
                    let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: com_id, id_ts_sd: id_ts, id_pb_sd: ng_sd }, { sl_dang_sd: update_sl, });
                    return res.status(200).json({ data: { khoiphuc: khoiphuc, update_taisan: update_taisan, message: "khoi phuc thanh cong" } });


                }
            }
            return res.status(200).json({ data: khoiphuc, message: "khoi phuc thanh cong " });
        }
        if (datatype == 3) {
            //xoavinhvien
            let xoa = await Suachua.findOneAndRemove({ sc_id: id, id_cty: com_id });
            return res.status(200).json({ data: xoa, message: "xoa vinh vien thanh cong " });
        }


    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}
// chua biết cần trả ra những trường gì vì chưa test được
exports.detailBBCanSuaChua = async (req, res) => {

    let id = req.body.id;
    try {
        let com_id = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
        }
        if (isNaN(id)) {
            return res.status(404).json({ message: "id phai la 1 Number" });
        }

        let bb = await SuaChua.findOne({ sc_id: id, id_cty: com_id });

        let tenTaiSan = await TaiSan.findOne({ ts_id: Number(bb.suachua_taisan) });

        let nguoiSD = await Users.findOne({
            'idQLC': bb.sc_ng_sd,
            type: { $ne: 1 }
        });
        let nguoiThucHien = await Users.findOne({
            idQLC: bb.sc_ng_thuchien,
            type: { $ne: 1 }
        });
        let nguoi_tao = await Users.findOne({
            idQLC: bb.sc_id_ng_tao,
            type: { $ne: 1 }
        });
        let nguoi_duyet = await Users.findOne({
            idQLC: bb.sc_ng_duyet,
        }) || null;
        let info_bb = {
            //thong tin chung 
            so_bb: bb.sc_id,
            nguoi_tao: nguoi_tao.userName,
            ngay_tao: new Date(bb.sc_date_create * 1000),
            nguoi_duyet: nguoi_duyet != null ? nguoi_duyet.userName : " chua cap nhat",
            ngay_duyet: new Date((bb.sc_date_duyet || 0) * 1000) == 0 ? 'chua cap nhat' : new Date((bb.sc_date_duyet || 0) * 1000),
            trang_thai: bb.sc_trangthai,
            //thong tin tai san
            ma_tai_san: bb.suachua_taisan,
            ten_tai_san: tenTaiSan.ts_ten,
            so_luong: bb.sl_sc,
            doi_tuong_su_dung: nguoiSD.userName,
            vi_tri_tai_san: bb.sc_ts_vitri,
            //thong tin sua chua 
            ngay_hong: bb.sc_ngay_hong,
            noi_dung_sua_chua: bb.sc_noidung,
            nguoi_thuc_hien: nguoiThucHien.userName,
            phong_ban: nguoiThucHien.inForPerson.employee.dep_id,
            ngay_sua_chua: bb.sc_ngay,
            ngay_du_kien_hoan_thanh: bb.sc_dukien,
            chi_phi_du_kien: bb.sc_chiphi_dukien,
            don_vi_sua_chua: bb.sc_donvi,
            dia_diem_sua_chua: bb.sc_diachi

        }
        return res.status(200).json({ data: info_bb, message: "success" });

    } catch (error) {

        return res.status(500).json({ message: error.message });
    }

}

exports.listBBCanSuaChua = async (req, res) => {
    try {
        let skip = req.body.skip || 1;
        let limit = req.body.limit || 10;
        let com_id = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
        }
        let filter = {
            id_cty: com_id,
            sc_trangthai: 1,
            sc_da_xoa: 0,
        }
        if (key) {
            filter.sc_id = Number(key);
        }

        let condition = {};
        let filter2 = {};
        let filter3 = {};
        if (type_quyen == 2) {
            // condition = ep_id;
            filter2.sc_id_ng_tao = ep_id;
            filter3.sc_ng_thuchien = ep_id;

        }

        let tsda_suachua = await SuaChua.aggregate([
            {
                $match:
                {
                    $and: [
                        filter,
                        {
                            $or: [
                                filter2,
                                filter3
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'QLTS_Tai_San',
                    localField: 'suachua_taisan',
                    foreignField: 'ts_id',
                    as: 'tenTaiSan'
                }
            },
            {
                $project: {
                    "sc_date_create": "$sc_date_create",
                    "ten_ts": "$tenTaiSan.ts_ten",
                    "sc_quyen_sd": "$sc_quyen_sd",
                    "sc_ng_sd": '$sc_ng_sd',
                    'sc_ngay_hong': '$sc_ngay_hong',
                    "sc_hoanthanh": '$sc_hoanthanh',
                    'sc_id': '$sc_id',
                    'sc_trangthai': '$sc_trangthai',
                    'suachua_taisan': '$suachua_taisan',
                    'sl_sc': '$sl_sc',
                    'sc_noidung': '$sc_noidung',
                    'sc_ts_vitri': '$sc_ts_vitri',
                    'ts_date_sd': '$tenTaiSan.ts_date_sd'
                }
            },
            {
                $skip: (skip++ - 1) * 10
            },
            {
                $limit: limit
            },
            {
                $sort: {
                    sc_id: -1
                }
            }
        ]);



        fnc.success(res, "thanh cong ", [tscan_suachua]);
    } catch (error) {
        console.log(error);
        fnc.setError(res, "loi he thong");
    }

}
