const ThongBao = require("../../../models/QuanLyTaiSan/ThongBao");
const SuaChua = require("../../../models/QuanLyTaiSan/Sua_chua");
const TaiSan = require('../../../models/QuanLyTaiSan/TaiSan');
const QuaTrinhSuDung = require("../../../models/QuanLyTaiSan/QuaTrinhSuDung");
const TaiSanDangSuDung = require("../../../models/QuanLyTaiSan/TaiSanDangSuDung");
//Tài sản đang sửa chữa
exports.addSuaChua = async (req, res) => {
    let { id_ts, sl_sc, trangthai_sc, type_quyen, loai_bb, sc_quyen_sd, ng_sd, vitri_ts, dv_sc, dia_chi_nha_cung_cap,
        ngay_sc, ngay_dukien, hoanthanh_sc, chiphi_dukien, chiphi_thucte, nd_sc, ng_thuc_hien, dia_diem_sc, } = req.body;
    const id_ng_tao = req.user.data.idQLC;// nguoi tao la cong ty 

    try {
        let maxID = 0;
        let ID_bb_sua_chua = 0;
        let maxID_1 = await ThongBao.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
        if (maxID_1) {
            maxID = maxID_1._id;
        }
        let new_thongBao_1 = new ThongBao({
            _id: Number(maxID + 1),
            id_ts: null,
            id_cty: id_ng_tao,
            id_ng_nhan: id_ng_tao,
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
            maxID = maxID_2._id;
        }
        let new_thongBao_2 = new ThongBao({
            _id: Number(maxID + 1),
            id_cty: id_ng_tao,
            id_ng_nhan: id_ng_tao,
            type_quyen: 1,
            loai_tb: 4,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: new Date().getTime()
        });
        await new_thongBao_2.save();
        let bb_sc = 0;
        if (loai_bb == 0) {
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
                id_cty: id_ng_tao,
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
                id_cty: id_ng_tao,
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
            ts = await TaiSan.findOne({ id_cty: id_ng_tao, ts_id: id_ts });
            let sl_ts_cu = ts.ts_so_luong;
            let update_sl = 0;
            if (ts.ts_so_luong > sl_sc) {
                update_sl = sl_ts_cu - sl_sc;
                let update_taiSan = await TaiSan.findOneAndUpdate({ id_cty: id_ng_tao, ts_id: id_ts }, { ts_so_luong: update_sl, soluong_cp_bb: update_sl });
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
                    id_cty: id_ng_tao,
                    id_cty_sudung: id_ng_tao,
                    qt_ngay_thuchien: ngay_sc,
                    qt_nghiep_vu: 4,
                    vitri_ts: vitri_ts,
                    ghi_chu: nd_sc,
                    time_created: new Date().getTime()
                });
                await qr_qtr_sd.save();
                console.log("OK");


            } else {
                return res.status(404).json({ message: "so luong sua chua lon hon so tai san hien co" });
            }
        }
        if (sc_quyen_sd == 2) {
            // sc tai san cp cho nv
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: id_ng_tao, id_nv_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu - sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: id_ng_tao, id_ts_sd: id_ts, id_nv_sd: ng_sd }, { sl_dang_sd: update_sl });
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
                id_cty: id_ng_tao,
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
            let q_taisan_doituong = await TaiSanDangSuDung.findOne({ com_id_sd: id_ng_tao, id_pb_sd: ng_sd, id_ts_sd: id_ts });
            let sl_ts_cu = q_taisan_doituong.sl_dang_sd;
            let update_sl = sl_ts_cu - sl_sc;
            let update_taisan = await TaiSanDangSuDung.findOneAndUpdate({ com_id_sd: id_ng_tao, id_ts_sd: id_ts, id_pb_sd: ng_sd }, { sl_dang_sd: update_sl });
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
                id_cty: id_ng_tao,
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
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}




exports.HoanThanhSuaChua = async (req, res) => {
    let { id_bb, chiphi_thucte, date_nhapkho, date_done, type_quyen_duyet } = req.body;
    let com_id = req.user.data.idQLC;
    let ng_duyet = req.user.data.userName;

    try {

        let hoan_thanh_sua_chua = await SuaChua.findOneAndUpdate({ sc_id: id_bb, id_cty: com_id }, {
            sc_trangthai: 3, sc_chiphi_thucte: chiphi_thucte, sc_hoanthanh: date_done,
            sc_ngay_nhapkho: date_nhapkho, sc_date_duyet: new Date().getTime(), sc_ng_duyet: com_id, sc_type_quyet_duyet: type_quyen_duyet
        });
        let q_this_sc = await SuaChua.findOne({ id_cty: com_id, sc_id: id_bb });
        let quyen_ng_sd = q_this_sc.sc_quyen_sd;
        // console.log("quyen_ng_sd  : " + quyen_ng_sd);
        let id_ts = q_this_sc.suachua_taisan;
        // console.log("id_ts  : " + id_ts);
        let sl_sc = q_this_sc.sl_sc;
        // console.log("sl_sc  : " + sl_sc);
        let ng_sd = q_this_sc.sc_ng_sd;
        //console.log("ng_sd  : " + ng_sd);
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
        console.log(error);
        return res.status(500).json({ message: error.message });

    }
}

// exports.XoaSuaChua = async(req,res) =>{
//     let {datatype , id, type_quyen,id_ng_xoa, } = req.body;
//     let com_id = req.user.data.idQLC;

// }


exports.SuaChuaBB = async (req, res) => {
    let { id_sc, sl_sc, trangthai_sc, ngay_sc, ngay_dukien, hoanthanh_sc, chiphi_dukien, chiphi_thucte, nd_sc, ng_thuc_hien } = req.body;
    let dia_diem_sc = req.body.dia_diem_sc || 0;
    let dv_sc = req.body.dv_sc || 0;
    let dia_chi_nha_cung_cap = req.body.dia_chi_nha_cung_cap || 0;
    let com_id = req.user.data.idQLC;
    console.log("comid :  " + com_id);

    try {
        let q_sua_chua = await SuaChua.findOne({ id_cty: com_id, sc_id: id_sc });
        console.log(q_sua_chua);
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
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

}

exports.Seach = async (req, res) => {
    let id_bb = req.body.id_bb;
    try {
        if (isNaN(id_bb)) {
            return res.status(400).json("id bien ban phai la 1 so");
        } else {
            let listdata = await SuaChua.findOne({ sc_id: id_bb });
            if (listdata) {
                return res.status(200).json({ data: listdata, message: " thanh cong " });
            } else {
                return res.status(202).json({ data: [], message: " khong co du lieu " });
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });

    }

}

exports.listDataSuaChua = async (req, res) => {
    let trang_thai = req.body.trang_thai;
    try {
        if (isNaN(trang_thai)) {

            return res.status(404).json({ message: "trang thai phai la 1 so" });

        } else {
            let listData = await SuaChua.find({ sc_trangthai: trang_thai });
            if (listData) {
                return res.status(200).json({ data: listData, message: "thanh cong" });
            } else {
                return res.status(202).json({ data: [], message: "khong co du lieu" });
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}