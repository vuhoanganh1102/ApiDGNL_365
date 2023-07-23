
const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen");
const ThongBao = require('../../../models/QuanLyTaiSan/ThongBao');
const ViTriTaiSan = require('../../../models/QuanLyTaiSan/ViTri_ts');
const TaiSanViTri = require('../../../models/QuanLyTaiSan/TaiSanVitri');
const TaiSan = require("../../../models/QuanLyTaiSan/TaiSan");
const fnc = require("../../../services/functions");
const Department = require('../../../models/qlc/Deparment');
//add_dc_ts

exports.addDieuchuyenTaiSan = async (req, res) => {


    try {
        let { loai_dc, type_quyen, dieuchuyen_taisan1, ngay_dc, ng_thuc_hien, khoi_chon_phong_ban_nv,
            khoi_chon_phong_ban_nv_den, khoi_dc_tu, khoi_dc_den, khoi_ng_dai_dien_dc_tu, khoi_ng_dai_dien_dc_den,
            id_dai_dien_nhan, vitri_dc, vitri_dc_tu, vitri_dc_den, ly_do_dc } = req.body;
        let id_cty, id_ng_tao = 0;

        if (req.user.data.type == 1) {
            id_cty = req.user.data.idQLC;
            id_ng_tao = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            id_cty = req.user.data.com_id;
            id_ng_tao = req.user.data.idQLC;
        }

        let dieuchuyen_vippro = dieuchuyen_taisan1;
        let dc_da_xoa = 0;
        let date_delete = 0;

        let dc_trang_thai = 0;


        let ID_tb = 0;
        let maxID = await ThongBao.findOne({}, {}, { sort: { id_tb: -1 } });

        if (maxID) {
            ID_tb = maxID.id_tb;
        }

        let insert_thongbao = new ThongBao({
            id_tb: ID_tb + 1,
            id_cty: id_cty,
            id_ng_nhan: id_cty,
            id_ng_tao: id_ng_tao,
            type_quyen: 2,
            type_quyen_tao: type_quyen,
            loai_tb: 3,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: new Date().getTime()
        });
        await insert_thongbao.save();

        let ID_dc = 0;
        let maxIDDc = await DieuChuyen.findOne({}, {}, { sort: { dc_id: -1 } });
        if (maxIDDc) {
            ID_dc = maxIDDc.dc_id;
        }
        const ds_dc = JSON.parse(dieuchuyen_vippro)?.ds_dc || [];
        const updated_ds_dc = ds_dc.map((item) => ({
            ts_id: item[0],
            sl_ts: item[1]
        }));


        let insert_dc_vt = new DieuChuyen({
            dc_id: ID_dc + 1,
            id_cty: id_cty,
            dieuchuyen_taisan: { ds_dc: updated_ds_dc },

            id_ng_thuchien: ng_thuc_hien,
            vi_tri_dc_tu: vitri_dc_tu,
            dc_vitri_tsnhan: vitri_dc_den,
            dc_type_quyen: type_quyen,
            dc_type: loai_dc,
            dc_ngay: ngay_dc,
            vitri_ts_daidien: id_dai_dien_nhan,
            dc_lydo: ly_do_dc,
            id_ng_tao_dc: id_ng_tao,
            dc_date_create: new Date().getTime(),
        });
        await insert_dc_vt.save();
        let ID_tb_1 = 0;
        let maxID_1 = await ThongBao.findOne({}, {}, { sort: { id_tb: -1 } });
        if (maxID) {
            ID_tb_1 = maxID_1.id_tb;
        }
        //thong bao den nguoi thuc hien
        let insert_thongbao1 = new ThongBao({
            id_tb: ID_tb_1 + 1,
            id_cty: id_cty,
            id_ng_nhan: ng_thuc_hien,
            id_ng_tao: id_ng_tao,
            type_quyen: 2,
            type_quyen_tao: type_quyen,
            loai_tb: 3,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: new Date().getTime()

        });
        await insert_thongbao1.save();

        let ID_tb_2 = 0;
        let maxID_2 = await ThongBao.findOne({}, {}, { sort: { id_tb: -1 } });
        if (maxID) {
            ID_tb_2 = maxID_2.id_tb;
        }
        //thong boa den nguoi nhan
        let insert_thongbao2 = new ThongBao({
            id_tb: ID_tb_2 + 1,
            id_cty: id_cty,
            id_ng_nhan: id_dai_dien_nhan,
            id_ng_tao: id_ng_tao,
            type_quyen: 2,
            type_quyen_tao: type_quyen,
            loai_tb: 3,
            add_or_duyet: 1,
            da_xem: 0,
            date_create: new Date().getTime()
        });
        await insert_thongbao2.save();
        fnc.success(res, "success", insert_dc_vt);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

exports.editDCTS = async (req, res) => {
    try {




        let { id_dc, loai_dc, type_quyen, dieuchuyen_taisan1, ngay_dc, ng_thuc_hien, dai_dien_nhan, khoi_dc_tu, khoi_dc_den,
            khoi_ng_dai_dien_dc_tu, khoi_ng_dai_dien_dc_den, khoi_chon_phong_ban_nv, khoi_chon_phong_ban_nv_den, vitri_dc, vitri_dc_tu,
            vitri_dc_den, ly_do_dc } = req.body;
        let dc_da_xoa = 0;
        let dc_trang_thai = 0;

        let date_create = new Date().getTime();
        let date_delete = 0;
        let id_cty = 0;
        let id_ng_tao = 0;
        if (req.user.data.type == 1) {
            id_cty = req.user.data.idQLC;
            id_ng_tao = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            id_cty = req.user.data.inForPerson.employee.com_id;
            id_ng_tao = req.user.data.idQLC;
        }

        // let edit_dieuchuyen = await DieuChuyen.findOne({
        //     dc_id: id_dc,
        //     id_cty: id_cty

        // });
        const ds_dc = JSON.parse(dieuchuyen_taisan1)?.ds_dc || [];
        const updated_ds_dc = ds_dc.map((item) => ({
            ts_id: item[0],
            sl_ts: item[1]
        }));

        let qr_update_dc = await DieuChuyen.findOneAndUpdate(
            {
                dc_id: id_dc,
                id_cty: id_cty
            },
            {
                dieuchuyen_taisan: { ds_dc: updated_ds_dc },

                id_ng_thuchien: ng_thuc_hien,
                dc_ngay: ngay_dc,
                dc_lydo: ly_do_dc,
                vi_tri_dc_tu: khoi_dc_tu,
                dc_vitri_tsnhan: khoi_dc_den,
                vitri_ts_daidien: dai_dien_nhan,

            });
        fnc.success(res, "success", qr_update_dc);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
//
exports.deleteBBDieuChuyen = async (req, res) => {
    try {


        let { datatype, id, type_quyen } = req.body;

        let com_id, id_ng_xoa = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
            id_ng_xoa = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            id_cty = req.user.data.com_id;
            id_ng_xoa = req.user.data.idQLC;
        }
        let date_delete = new Date().getTime();

        if (datatype == 1) {
            let dieuchuyen = await DieuChuyen.findOneAndUpdate(
                {
                    dc_id: id,
                    id_cty: com_id
                }, {
                xoa_dieuchuyen: 1,
                dc_type_quyen_xoa: type_quyen,
                id_ng_xoa_dc: id_ng_xoa,
                dc_date_delete: date_delete
            });

            fnc.success(res, 'xoa thanh cong ');
        } else if (datatype == 2) {
            let khoiphuc = await DieuChuyen.findOneAndUpdate(
                {
                    dc_id: id,
                    id_cty: com_id
                },
                {
                    xoa_dieuchuyen: 0,
                    dc_type_quyen_xoa: 0,
                    id_ng_xoa_dc: 0,
                    dc_date_delete: 0
                });

            fnc.success(res, 'khoi phuc thanh cong ');
        } else if (datatype == 3) {
            let xoavv = await DieuChuyen.findOneAndRemove(
                {
                    dc_id: id,
                    id_cty: com_id
                });
            fnc.success(res, 'xoa vinh vien thanh cong ');

        } else {
            return res.status(404).json({ message: "datatype phai la 1 Number tu 1 den 3" });
        }
    } catch (error) {

        return res.satus(500).json({ message: error.message });
    }
}
//dieuchuyen_vitriTS2
exports.detailsDCVTTS = async (req, res) => {
    try {
        let { id_dc } = req.body;
        let com_id = 0;

        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        }

        let chitiet_dcvitri = await DieuChuyen.findOne({ id_cty: com_id, dc_id: id_dc });

        let ngaytao = new Date(chitiet_dcvitri.dc_date_create * 1000).toLocaleDateString();
        let ngaydc = new Date(chitiet_dcvitri.dc_ngay * 1000).toLocaleDateString();

        //let qr_vitri = await ViTriTaiSan.find({ id_cty: com_id });

        let vi_tri_dc_tu = await fnc.nameViTri(ViTriTaiSan, {
            id_vitri: chitiet_dcvitri.vi_tri_dc_tu,
            id_cty: com_id
        })

        let dc_vitri_tsnhan = await fnc.nameViTri(ViTriTaiSan, {
            id_vitri: chitiet_dcvitri.dc_vitri_tsnhan,
            id_cty: com_id
        })
        console.log(com_id)
        let dep_nhan = await fnc.Department(Department, {
            idQLC: Number(chitiet_dcvitri.id_daidien_nhan),
            com_id: com_id
        })
        let dep_thuchien = await fnc.Department(Department, {
            idQLC: Number(chitiet_dcvitri.id_ng_thuchien),
            com_id: com_id
        })
        let dc_vt = {
            dc_id: chitiet_dcvitri.dc_id,
            dc_trangthai: chitiet_dcvitri.dc_trangthai,
            id_ng_tao: chitiet_dcvitri.id_ng_tao_dc,
            dc_ngay: ngaydc,
            ngaytao: ngaytao,
            dc_hoan_thanh: new Date(chitiet_dcvitri.dc_hoan_thanh * 1000).toLocaleDateString(),
            vi_tri_dc_tu: vi_tri_dc_tu,
            dc_vitri_den: dc_vitri_tsnhan,
            id_daidien_nhan: chitiet_dcvitri.id_daidien_nhan,
            phong_ban_nhan: dep_nhan,
            id_ng_thuchien: chitiet_dcvitri.id_ng_thuchien,
            phong_ban_thuchien: dep_thuchien,
            dc_lydo: chitiet_dcvitri.dc_lydo,
            dieuchuyen_taisan: chitiet_dcvitri.dieuchuyen_taisan,
        };

        fnc.success(res, 'thanh cong ', [dc_vt])
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
}
//Từ chối thực hiện bàn giao tài sản - tu_choi
exports.TuchoiDCVT = async (req, res) => {
    try {
        let { id_bb, content } = req.body;

        let com_id = 0;

        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        }

        if (isNaN(id_bb)) {
            return res.status(404).json({ message: "id_bb phai la 1 Number" });
        }

        let qr_tuchoi_nhan_dc = await DieuChuyen.findOneAndUpdate(
            {
                dc_id: id_bb,
                id_cty: com_id
            }, {
            dc_trangthai: 2,
            dc_lydo_tuchoi: content,
        })

        fnc.success(res, "tu choi thanh cong")
    } catch (error) {

        fnc.setError(res, error.message);
    }
}
//xac_nhan_dc
exports.TiepNhanDCVT = async (req, res) => {
    try {
        let { id_dc, vitri_dc_tu, } = req.body;
        let com_id = 0;

        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            com_id = req.user.data.com_id;

        }
        if (isNaN(id_dc)) {
            return res.status(404).json({ message: "id_dc phai la 1 Number" });
        }
        let filter = {
            dc_id: id_dc,
            id_cty: com_id,
        };
        // if (dc_type) {
        //     filter.dc_type = dc_type;
        // }
        let this_dc = await DieuChuyen.findOne(filter);

        let arr_val = this_dc.dieuchuyen_taisan.ds_dc;

        let val_dc = [];
        let val_dc_1 = [];
        arr_val.map((item, index) => {
            val_dc.push(item.ts_id);

            val_dc_1.push(item.sl_ts);
        })
        let check_ts_tu = '';
        for (let i = 0; i < val_dc.length; i++) {
            let check_tsvt_tu = await TaiSanViTri.findOne(// noi tai san co san
                {
                    tsvt_taisan: val_dc[i],
                    tsvt_vitri: vitri_dc_tu,
                    tsvt_cty: com_id
                });
            check_ts_tu = await TaiSan.findOne({ ts_id: val_dc[i], ts_vi_tri: vitri_dc_tu, id_cty: com_id });
            if (check_tsvt_tu) {
                let sl_tu_moi = check_tsvt_tu.tsvt_soluong - val_dc_1[i];

                let update_sl_tu = await TaiSanViTri.findOneAndUpdate(
                    {
                        tsvt_cty: com_id,
                        tsvt_taisan: val_dc[i],
                        tsvt_vitri: vitri_dc_tu
                    }
                    , {
                        tsvt_soluong: sl_tu_moi

                    });
            } else {

                let sl_tu_moi = check_ts_tu.sl_bandau - val_dc_1[i];


                let maxId = 0;
                let maxId_crr = await TaiSanViTri.findOne({}, {}, { sort: { tsvt_id: -1 } });
                if (maxId_crr) {
                    maxId = maxId_crr.tsvt_id;
                }
                console.log(maxId);

                let add_sl_tu = new TaiSanViTri({

                    tsvt_id: maxId + 1,
                    tsvt_cty: com_id,
                    tsvt_taisan: val_dc[i],
                    tsvt_vitri: vitri_dc_tu,
                    tsvt_soluong: sl_tu_moi

                });
                await add_sl_tu.save();
            }
        }
        let xac_nhan_bg = await DieuChuyen.findOneAndUpdate({ dc_id: id_dc, id_cty: com_id }, { dc_trangthai: 1 });
        fnc.success(res, "tiep nhan thanh cong", xac_nhan_bg);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }


}
exports.listBB = async (req, res) => {
    try {
        let key = req.body.key;
        let skip = req.body.page || 1;
        let limit = req.body.perPage || 10;
        let type_quyen = req.user.data.type;
        let status = req.body.status;
        let com_id = 0;
        let id_ng_tao = 0;

        let filter = {};


        if (type_quyen == 1) {
            com_id = req.user.data.com_id;
            id_ng_tao = req.user.data.idQLC;

        } else if (type_quyen == 2) {
            com_id = req.user.data.com_id;
            id_ng_tao = req.user.data.idQLC;
            filter = {
                id_cty: com_id,
                xoa_dieuchuyen: 0,
                dc_type: 0,
                $or: [
                    {
                        id_ng_thuchien: id_ng_tao
                    },
                    {
                        vitri_ts_daidien: id_ng_tao
                    }
                ]

            }
        }
        filter = {
            id_cty: com_id,
            xoa_dieuchuyen: 0,
            dc_type: 0,

        };
        if (key) {
            filter.dc_id = Number(key);
            if (status == 1) {
                filter.dc_trangthai = 0;
            } else if (status == 2) {
                filter.dc_trangthai = 1;
            } else {
                return res.status(404).json({ message: " status phai la 0 hoac 1 " });
            }
        }
       
        let dc_vitri = await DieuChuyen.aggregate([
            {
                $match: filter

            },
            {
                $project: {
                    'dc_ngay': '$dc_ngay',
                    'dc_id': '$dc_id',
                    'dc_trangthai': '$dc_trangthai',
                    ';vi_tri_dc_tu': '$vi_tri_dc_tu',
                    'dc_vitri_tsnhan': '$dc_vitri_tsnhan',
                    'dc_lydo': '$dc_lydo',
                    'id_ng_thuchien': '$id_ng_thuchien'
                }
            },
            {
                $sort: {
                    dc_id: -1
                }
            },
            {
                $skip: (skip - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        fnc.success(res, dc_vitri);



    } catch (error) {
        console.log(error);
        fnc.setError(res, error.message);
    }
}