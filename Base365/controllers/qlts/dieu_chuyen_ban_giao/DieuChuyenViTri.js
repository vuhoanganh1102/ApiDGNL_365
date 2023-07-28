
const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen");
const ThongBao = require('../../../models/QuanLyTaiSan/ThongBao');
const ViTriTaiSan = require('../../../models/QuanLyTaiSan/ViTri_ts');
const TaiSanViTri = require('../../../models/QuanLyTaiSan/TaiSanVitri');
const TaiSan = require("../../../models/QuanLyTaiSan/TaiSan");
const fnc = require("../../../services/functions");
const Department = require('../../../models/qlc/Deparment');
const BaoDuong = require("../../../models/QuanLyTaiSan/BaoDuong");
const Users = require('../../../models/Users')
const capPhat = require('../../../models/QuanLyTaiSan/CapPhat')
const ThuHoi = require('../../../models/QuanLyTaiSan/ThuHoi')
//add_dc_ts

exports.addDieuchuyenTaiSan = async (req, res) => {


    try {
        let { loai_dc, dieuchuyen_taisan1, ngay_dc, ng_thuc_hien, khoi_chon_phong_ban_nv,
            khoi_chon_phong_ban_nv_den, khoi_dc_tu, khoi_dc_den, khoi_ng_dai_dien_dc_tu, khoi_ng_dai_dien_dc_den,
            id_dai_dien_nhan, vitri_dc, vitri_dc_tu, vitri_dc_den, ly_do_dc } = req.body;
        let id_cty, id_ng_tao = 0;
        let type_quyen = req.user.data.type;
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
        if (maxID_1) {
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
        fnc.success(res, "success", { insert_dc_vt });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

exports.editDCTS = async (req, res) => {
    try {




        let { id_dc, loai_dc, dieuchuyen_taisan1, ngay_dc, ng_thuc_hien, dai_dien_nhan, khoi_dc_tu, khoi_dc_den,
            khoi_ng_dai_dien_dc_tu, khoi_ng_dai_dien_dc_den, khoi_chon_phong_ban_nv, khoi_chon_phong_ban_nv_den, vitri_dc, vitri_dc_tu,
            vitri_dc_den, ly_do_dc } = req.body;
        let dc_da_xoa = 0;
        let dc_trang_thai = 0;
        let type_quyen = req.user.data.type;
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

        if (isNaN(id_dc) || id_dc <= 0) {
            return res.status(404).json({ message: "id_dc phai la 1 Number" });
        }
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
        fnc.success(res, "success");

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}
//
exports.deleteBBDieuChuyen = async (req, res) => {
    try {


        let { datatype, id, } = req.body;

        let com_id, id_ng_xoa = 0;
        if (req.user.data.type == 1) {
            com_id = req.user.data.idQLC;
            id_ng_xoa = req.user.data.idQLC;

        } else if (req.user.data.type == 2) {
            id_cty = req.user.data.com_id;
            id_ng_xoa = req.user.data.idQLC;
        }
        let date_delete = new Date().getTime();
        let type_quyen = req.user.data.type;

        if (isNaN(datatype) || datatype <= 0) {
            return res.status(404).json({ message: "datatype phai la 1 Number" });
        }
        if (isNaN(id) || id <= 0) {
            return res.status(404).json({ message: "id phai la 1 Number" });
        }
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

        if (isNaN(id_dc) || id_dc <= 0) {
            return res.status(404).json({ message: "id_dc phai la 1 Number" });
        }
        let chitiet_dcvitri = await DieuChuyen.findOne({ id_cty: com_id, dc_id: id_dc });

        let ngaytao = new Date(chitiet_dcvitri.dc_date_create * 1000);
        let ngaydc = new Date(chitiet_dcvitri.dc_ngay * 1000);

        //let qr_vitri = await ViTriTaiSan.find({ id_cty: com_id });

        let vi_tri_dc_tu = await fnc.nameViTri(ViTriTaiSan, {
            id_vitri: chitiet_dcvitri.vi_tri_dc_tu,
            id_cty: com_id
        }) || null;

        let dc_vitri_tsnhan = await fnc.nameViTri(ViTriTaiSan, {
            id_vitri: chitiet_dcvitri.dc_vitri_tsnhan,
            id_cty: com_id
        }) || null;

        let dep_nhan = await fnc.Department(Department, {
            idQLC: Number(chitiet_dcvitri.id_daidien_nhan),
            com_id: com_id
        }) || null;
        let dep_thuchien = await fnc.Department(Department, {
            idQLC: Number(chitiet_dcvitri.id_ng_thuchien),
            com_id: com_id
        }) || null;
        let nguoi_thien = await fnc.NameUser(Users, {
            idQLC: chitiet_dcvitri.id_ng_thuchien,
            type: { $ne: 1 }
        }) || null;
        let nguoi_nhan = await fnc.NameUser(Users, {
            idQLC: chitiet_dcvitri.id_daidien_nhan,
            type: { $ne: 1 }
        }) || null;
        let nguoi_tao = await fnc.NameUser(Users, {
            idQLC: chitiet_dcvitri.id_ng_tao_dc,
            type: { $ne: 1 }
        }) || null;
        let dc_vt = {
            dc_id: chitiet_dcvitri.dc_id,
            dc_trangthai: chitiet_dcvitri.dc_trangthai,
            ng_tao: nguoi_tao,
            dc_ngay: new Date(ngaydc * 1000),
            ngaytao: new Date(ngaytao * 1000),
            dc_hoan_thanh: new Date(chitiet_dcvitri.dc_hoan_thanh * 1000),
            vi_tri_dc_tu: vi_tri_dc_tu,
            dc_vitri_den: dc_vitri_tsnhan,
            daidien_nhan: nguoi_nhan,
            phong_ban_nhan: dep_nhan,
            ng_thuchien: nguoi_thien,
            phong_ban_thuchien: dep_thuchien,
            dc_lydo: chitiet_dcvitri.dc_lydo,
            dieuchuyen_taisan: chitiet_dcvitri.dieuchuyen_taisan,
        };
        let total = await DieuChuyen.countDocuments({
            id_cty: com_id, dc_id: id_dc
        })
        fnc.success(res, 'thanh cong ', { dc_vt })
    } catch (error) {
        console.log(error)
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

        if (isNaN(id_bb) || id_bb <= 0) {
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
        console.log(error)
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
        fnc.success(res, "tiep nhan thanh cong", { xac_nhan_bg });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }


}
exports.listBB = async (req, res) => {
    try {
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const id_cty = req.user.data.com_id
        const dc_id = req.body.dc_id
        const dc_trangthai = req.body.dc_trangthai
        let data = []

        let Num_dc_vitri = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 0}).count()
        let Num_dc_doituong = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 1}).count()
        let Num_dcdvQL = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 2}).count()
        let numAllocaction = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        let numRecall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        let dem_bg = (numAllocaction.length + numRecall.length)
        data.push({Num_dc_vitri : Num_dc_vitri})
        data.push({Num_dc_doituong : Num_dc_doituong})
        data.push({Num_dcdvQL : Num_dcdvQL})
        data.push({dem_bg : dem_bg})
        let filter = {};
        filter.id_cty = id_cty
        filter.xoa_dieuchuyen = 0
        filter.dc_type = 0
        if(dc_id)  filter.dc_id = Number(dc_id)
        if(dc_trangthai)  filter.dc_trangthai = Number(dc_trangthai)

        let dc_vitri = await DieuChuyen.aggregate([
            { $match: filter },
            {$sort : {dc_id: -1}},
            {$skip : skip },
            {$limit : limit },
            {
                $lookup: {
                    from: "QLTS_ViTri_ts",
                    localField: "vi_tri_dc_tu",
                    foreignField: "id_vitri", 
                    as: "infoVTtu" 
                }
            },
            { $unwind: { path: "$infoVTtu", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "QLTS_ViTri_ts",
                    localField: "dc_vitri_tsnhan",
                    foreignField: "id_vitri",
                    as: "infoVTden"
                }
            },
            { $unwind: { path: "$infoVTden", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "Users",
                    localField: "id_ng_thuchien",
                    foreignField: "idQLC",
                    as: "infoUser"
                }
            },
            { $unwind: { path: "$infoUser", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    "dc_id": "$dc_id",
                    "dc_ngay": "$dc_ngay",
                    "dc_trangthai": "$dc_trangthai",
                    "dc_lydo": "$dc_lydo",
                    "id_ng_thuchien": "$id_ng_thuchien",
                    "dc_vi_tri_tu": "$infoVTtu.vi_tri",
                    "dc_vi_tri_den": "$infoVTden.vi_tri",
                    "ten_ng_thuchien": "$infoUser.userName",
                }
            },

        ])
        data.push({dc_vitri : dc_vitri})
        let total = await DieuChuyen.countDocuments(filter)
        fnc.success(res, 'lấy thành công ', { data, total });
    } catch (error) {
        fnc.setError(res, error.message);
    }
}
exports.detailBB = async (req, res) => {
    try {
        const id_cty = req.user.data.com_id
        const dc_id = req.body.dc_id
        let data = []
        if(dc_id){
            let filter = {};
            filter.id_cty = id_cty
            filter.xoa_dieuchuyen = 0
            // filter.dc_type = 0
            filter.dc_id = Number(dc_id)
            let data1 = await DieuChuyen.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: "QLTS_Tai_San",
                        localField: "dieuchuyen_taisan.ds_dc.ts_id",
                        foreignField: "ts_id",
                        as: "infoTS"
                    }
                },
                { $unwind: { path: "$infoTS", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "QLTS_ViTri_ts",
                        localField: "vi_tri_dc_tu",
                        foreignField: "id_vitri",
                        as: "infoVTtu"
                    }
                },
                { $unwind: { path: "$infoVTtu", preserveNullAndEmptyArrays: true } },
    
                {
                    $lookup: {
                        from: "QLTS_ViTri_ts",
                        localField: "data1_tsnhan",
                        foreignField: "id_vitri",
                        as: "infoVTden"
                    } 
                },
                { $unwind: { path: "$infoVTden", preserveNullAndEmptyArrays: true } },
    
                {
                    $lookup: {
                        from: "Users",
                        localField: "id_ng_thuchien",
                        foreignField: "idQLC",
                        as: "infoUser"
                    }
                },
                { $unwind: { path: "$infoUser", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "Users",
                        localField: "id_cty_dang_sd",
                        foreignField: "idQLC",
                        as: "infoCtyDangSD"
                    }
                },
                { $unwind: { path: "$infoCtyDangSD", preserveNullAndEmptyArrays: true } },
                // { $unwind: "$infoCtyDangSD" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "id_cty_nhan",
                        foreignField: "idQLC",
                        as: "infoCty"
                    }
                },
                { $unwind: { path: "$infoCty", preserveNullAndEmptyArrays: true } },
    
                // { $unwind: "$infoCty" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "id_nv_nhan",
                        foreignField: "idQLC",
                        as: "infoNV"
                    }
                },
                { $unwind: { path: "$infoNV", preserveNullAndEmptyArrays: true } },
    
                // { $unwind: "$infoNV" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "id_nv_dangsudung",
                        foreignField: "idQLC",
                        as: "infoNVdangSD"
                    }
                },
                { $unwind: { path: "$infoNVdangSD", preserveNullAndEmptyArrays: true } },
    
                // { $unwind: "$infoNVdangSD" },
                {
                    $lookup: {
                        from: "QLC_Deparments",
                        localField: "id_pb_nhan",
                        foreignField: "dep_id",
                        as: "infoPhongBan"
                    }
                },
                { $unwind: { path: "$infoPhongBan", preserveNullAndEmptyArrays: true } },
    
                // { $unwind: "$infoPhongBan" },
                {
                    $lookup: {
                        from: "QLC_Deparments",
                        localField: "id_pb_dang_sd",
                        foreignField: "dep_id",
                        as: "infoPhongBanDangSD"
                    }
                },
                { $unwind: { path: "$infoPhongBanDangSD", preserveNullAndEmptyArrays: true } },
    
                {
                    $project: {
                        "dc_id": "$dc_id",
                        "dc_ngay": "$dc_ngay",
                        "dc_trangthai": "$dc_trangthai",
                        "dc_lydo": "$dc_lydo",
                        "id_ng_thuchien": "$id_ng_thuchien",
                        "dc_vi_tri_tu": "$infoVTtu.vi_tri",
                        "dc_vi_tri_den": "$infoVTden.vi_tri",
                        "id_pb_dang_sd": "$id_pb_dang_sd",
                        "id_pb_nhan": "$id_pb_nhan",
                        "id_nv_dangsudung": "$id_nv_dangsudung",
                        "id_nv_nhan": "$id_nv_nhan",
                        "id_cty_nhan": "$id_cty_nhan",
                        "id_cty_dang_sd": "$id_cty_dang_sd",
                        "ten_Cty": "$infoCty.userName",
                        "ten_Cty_dang_su_dung": "$infoCtyDangSD.userName",
                        "ten_nhanVien": "$infoNV.userName",
                        "pb_id_cua_nhan_vien": "$infoNV.inForPerson.employee.dep_id",
                        "ten_nhanVien_dang_su_dung": "$infoNVdangSD.userName", 
                        "pb_id_cua_nhan_vien_dang_sd": "$infoNVdangSD.inForPerson.employee.dep_id",
                        "ten_phongBan": "$infoPhongBan.dep_name",
                        "ten_phongBan_dang_su_dung": "$infoPhongBanDangSD.dep_name",
                        "ten_nguoi_thuchien": "$infoUser.userName",
                        "pb_id_nguoi_thuc_hien": "$infoUser.inForPerson.employee.dep_id",
                        "position_id": "$infoUser.inForPerson.employee.position_id",
                        "ten_tai_san": "$infoTS.ts_ten",
                        "Ma_tai_san": "$infoTS.ts_id",
                        "So_luong_tai_san": "$dieuchuyen_taisan.ds_dc.sl_ts",
                    }
                },  
                { $unwind: { path: "$So_luong_tai_san", preserveNullAndEmptyArrays: true } },
                {
                    "$group": {
                    "_id": "$_id",
                    "dc_ngay": {
                        "$first": "$dc_ngay"
                    },
                    "dc_trangthai": {
                        "$first": "$dc_trangthai"
                    },
                    "dc_lydo": {
                        "$first": "$dc_lydo"
                    },
                    "id_ng_thuchien": {
                        "$first": "$id_ng_thuchien"
                    },
                    "id_pb_dang_sd": {
                        "$first": "$id_pb_dang_sd"
                    },
                    "id_pb_nhan": {
                        "$first": "$id_pb_nhan"
                    },
                    "id_nv_dangsudung": {
                        "$first": "$id_nv_dangsudung"
                    },
                    "id_cty_nhan": {
                        "$first": "$id_cty_nhan"
                    },
                    "id_cty_dang_sd": {
                        "$first": "$id_cty_dang_sd"
                    },
                    "dc_id": {
                        "$first": "$dc_id"
                    },
                    "ten_Cty": {
                        "$first": "$ten_Cty"
                    },
                    "ten_Cty_dang_su_dung": {
                        "$first": "$ten_Cty_dang_su_dung"
                    },
                    "ten_nhanVien": {
                        "$first": "$ten_nhanVien"
                    },
                    "pb_id_cua_nhan_vien": {
                        "$first": "$pb_id_cua_nhan_vien"
                    },
                    "ten_nhanVien_dang_su_dung": {
                        "$first": "$ten_nhanVien_dang_su_dung"
                    },
                    "pb_id_cua_nhan_vien_dang_sd": {
                        "$first": "$pb_id_cua_nhan_vien_dang_sd"
                    },
                    "ten_phongBan": {
                        "$first": "$ten_phongBan"
                    },
                    "ten_phongBan_dang_su_dung": {
                        "$first": "$ten_phongBan_dang_su_dung"
                    },
                    "ten_tai_san": {
                        "$first": "$ten_tai_san"
                    },
                    "Ma_tai_san": {
                        "$first": "$Ma_tai_san"
                    },
                    "So_luong_tai_san": {
                        "$first": "$So_luong_tai_san"
                    },
                    "ten_nguoi_thuchien": {
                        "$first": "$ten_nguoi_thuchien"
                    },
                    "pb_id_nguoi_thuc_hien": {
                        "$first": "$pb_id_nguoi_thuc_hien"
                    },
                    "dc_vi_tri_tu": {
                        "$first": "$dc_vi_tri_tu"
                    },
                    "dc_vi_tri_den": { 
                        "$first": "$dc_vi_tri_den"
                    },
                    // "recipients_details": {
                    //     "$first": {
                    //         "user_id": "$filter.user_id",
                    //         "last_message": "$filter.last_message"
                    //     }
                    // }
                    }    
                }
      
            ])
            for (let i = 0; i < data1.length; i++) {
                let depName_ng_thuc_hien = await Department.findOne({ com_id: id_cty, dep_id: data1[i].pb_id_nguoi_thuc_hien })
                data1[i].depName_ng_thuc_hien = depName_ng_thuc_hien
                let depName_cua_nhan_vien = await Department.findOne({ com_id: id_cty, dep_id: data1[i].dep_id })
                data1[i].depName_cua_nhan_vien = depName_cua_nhan_vien
                let depName_cua_nhan_vien_dang_sd = await Department.findOne({ com_id: id_cty, dep_id: data1[i].pb_id_cua_nhan_vien_dang_sd })
                data1[i].depName_cua_nhan_vien_dang_sd = depName_cua_nhan_vien_dang_sd
            }
            data.push(data1)
            let total = await DieuChuyen.countDocuments(filter)
            return fnc.success(res, 'lấy thành công ', { data, total });
        }
        return fnc.setError(res, "vui lòng nhập dc_id");

    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.dataDieuChuyenBanGiaoDeleted = async (req, res, next) => {
    try {
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const id_cty = req.user.data.com_id
        const idQLC = req.user.data.idQLC
        const dc_id = req.body.dc_id
        const dc_trangthai = req.body.dc_trangthai
        let data = []

        let Num_dc_vitri = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 0}).count()
        let Num_dc_doituong = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 1}).count()
        let Num_dcdvQL = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 2}).count()
        let numAllocaction = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        let numRecall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        let dem_bg = (numAllocaction.length + numRecall.length)
        data.push({Num_dc_vitri : Num_dc_vitri})
        data.push({Num_dc_doituong : Num_dc_doituong})
        data.push({Num_dcdvQL : Num_dcdvQL})
        data.push({dem_bg : dem_bg})
        let filter = {};
        filter.id_cty = id_cty
        filter.xoa_dieuchuyen = 0
        filter.dc_type = 0
        if(dc_id)  filter.dc_id = Number(dc_id)
        if(dc_trangthai)  filter.dc_trangthai = Number(dc_trangthai)

        //1: điều chuyển vị trí tài sản
        if (type === 1) {
            // if (type_quyen === 2) filter.id_ng_tao_dc = idQLC
            let data = await DieuChuyen.aggregate([
                { $match: filter },
                { $sort: { dc_id: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "QLTS_ViTri_ts",
                        localField: "vi_tri_dc_tu",
                        foreignField: "id_vitri", 
                        as: "infoVTtu" 
                    }
                },
                { $unwind: { path: "$infoVTtu", preserveNullAndEmptyArrays: true } },
    
                {
                    $lookup: {
                        from: "QLTS_ViTri_ts",
                        localField: "dc_vitri_tsnhan",
                        foreignField: "id_vitri",
                        as: "infoVTden"
                    }
                },
                { $unwind: { path: "$infoVTden", preserveNullAndEmptyArrays: true } },
                {
                  $lookup: {
                    from: 'Users',
                    localField: 'id_ng_thuchien',
                    foreignField: 'idQLC',
                    as: 'users_id_ng_thuchien'
                  }
                },
                { $unwind: { path: "$users_id_ng_thuchien", preserveNullAndEmptyArrays: true } },
                {
                  $project: {
                    dc_ngay: 1,
                    dc_date_delete: 1,
                    dc_id: 1,
                    dc_trangthai: 1,
                    id_nv_dangsudung: '$id_nv_dangsudung',
                    id_pb_dang_sd: '$did_pb_dang_sd',
                    id_nv_nhan: '$id_nv_nhan',
                    id_pb_nhan: '$id_pb_nhan',
                    dc_lydo: 1,
                    id_ng_thuchien: '$users_id_ng_thuchien.userName',
                    dep_id: "$users_id_ng_thuchien.inForPerson.employee.dep_id",
                    dc_vi_tri_tu: "$infoVTtu.vi_tri",
                    dc_vi_tri_den: "$infoVTden.vi_tri",
                  }
                }
              ]);
              for (let i = 0; i < data.length; i++) {
                if (data[i].id_nv_dangsudung != 0) {
                  let id_nv_dangsudung = await Users.findOne({ idQLC: data[i].id_nv_dangsudung }, { userName: 1 })
                  if (id_nv_dangsudung) data[i].id_nv_dangsudung = id_nv_dangsudung.userName
                }
                if (data[i].id_pb_dang_sd != 0) {
                  let id_pb_dang_sd = await department.findOne({ dep_id: data[i].id_pb_dang_sd }, { dep_name: 1 })
                  if (id_pb_dang_sd) data[i].id_pb_dang_sd = id_pb_dang_sd.dep_name
          
                }
                if (data[i].id_nv_nhan != 0) {
                  let id_nv_nhan = await Users.findOne({ idQLC: data[i].id_nv_nhan }, { userName: 1 })
                  if (id_nv_nhan) data[i].id_nv_nhan = id_nv_nhan.userName
          
                }
                if (data[i].dep_id != 0) {
                    let depName = await dep.findOne({ com_id: id_cty, dep_id: data[i].dep_id })
                  if (depName) data[i].depName = depName.dep_name
          
                }
                if (data[i].id_pb_nhan != 0) {
                  let id_pb_nhan = await department.findOne({ dep_id: data[i].id_pb_nhan }, { dep_name: 1 })
                  if (id_pb_nhan) data[i].id_pb_nhan = id_pb_nhan.dep_name
                }
                data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
                data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
              }
          
              return functions.success(res, 'get data success', { dem, data })
        }
        //2: điều chuyển đối tượng sd
        if (type === 2) {
            // if (type_quyen === 2) filter.id_ng_tao_dc = idQLC
            let data = await DieuChuyen.aggregate([
                { $match: filter },
                { $sort: { dc_id: -1 } },
                { $skip: skip },
                { $limit: limit },
          
                {
                  $lookup: {
                    from: 'Users',
                    localField: 'id_ng_thuchien',
                    foreignField: 'idQLC',
                    as: 'users_id_ng_thuchien'
                  }
                },
                { $unwind: { path: "$users_id_ng_thuchien", preserveNullAndEmptyArrays: true } },
                {
                  $project: {
                    dc_ngay: 1,
                    dc_date_delete: 1,
                    dc_id: 1,
                    dc_trangthai: 1,
                    id_nv_dangsudung: '$id_nv_dangsudung',
                    id_pb_dang_sd: '$id_pb_dang_sd',
                    id_nv_nhan: '$id_nv_nhan',
                    id_pb_nhan: '$id_pb_nhan',
                    dc_lydo: 1,
                    id_ng_thuchien: '$users_id_ng_thuchien.userName',
                  }
                }
              ]);
              for (let i = 0; i < data.length; i++) {
                if (data[i].id_nv_dangsudung != 0) {
                  let id_nv_dangsudung = await Users.findOne({ idQLC: data[i].id_nv_dangsudung }, { userName: 1 })
                  if (id_nv_dangsudung) data[i].id_nv_dangsudung = id_nv_dangsudung.userName
                }
                if (data[i].id_pb_dang_sd != 0) {
                  let id_pb_dang_sd = await department.findOne({ dep_id: data[i].id_pb_dang_sd }, { dep_name: 1 })
                  if (id_pb_dang_sd) data[i].id_pb_dang_sd = id_pb_dang_sd.dep_name
          
                }
                if (data[i].id_nv_nhan != 0) {
                  let id_nv_nhan = await Users.findOne({ idQLC: data[i].id_nv_nhan }, { userName: 1 })
                  if (id_nv_nhan) data[i].id_nv_nhan = id_nv_nhan.userName
          
                }
                if (data[i].id_pb_nhan != 0) {
                  let id_pb_nhan = await department.findOne({ dep_id: data[i].id_pb_nhan }, { dep_name: 1 })
                  if (id_pb_nhan) data[i].id_pb_nhan = id_pb_nhan.dep_name
                }
                data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
                data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
              }
          
              return functions.success(res, 'get data success', { dem, data })
        }

        //3: điều chuyển đơn vị quản lý
        if (type === 3) {
            // if (type_quyen === 2) filter.id_ng_tao_dc = idQLC
            let data = await DieuChuyen.aggregate([
                { $match: filter },
                { $sort: { dc_id: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "QLTS_ViTri_ts",
                        localField: "vi_tri_dc_tu",
                        foreignField: "id_vitri", 
                        as: "infoVTtu" 
                    }
                },
                { $unwind: { path: "$infoVTtu", preserveNullAndEmptyArrays: true } },
    
                {
                    $lookup: {
                        from: "QLTS_ViTri_ts",
                        localField: "dc_vitri_tsnhan",
                        foreignField: "id_vitri",
                        as: "infoVTden"
                    }
                },
                { $unwind: { path: "$infoVTden", preserveNullAndEmptyArrays: true } },
                {
                  $lookup: {
                    from: 'Users',
                    localField: 'id_cty_dang_sd',
                    foreignField: 'idQLC',
                    as: 'users'
                  }
                },
                { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
          
                {
                  $lookup: {
                    from: 'Users',
                    localField: 'id_cty_nhan',
                    foreignField: 'idQLC',
                    as: 'users_id_nv_nhan'
                  }
                },
                { $unwind: { path: "$users_id_nv_nhan", preserveNullAndEmptyArrays: true } },
          
                {
                  $lookup: {
                    from: 'Users',
                    localField: 'id_ng_thuchien',
                    foreignField: 'idQLC',
                    as: 'users_id_ng_thuchien'
                  }
                },
                { $unwind: { path: "$users_id_ng_thuchien", preserveNullAndEmptyArrays: true } },
                {
                  $project: {
                    dc_ngay: 1,
                    dc_id: 1,
                    dc_date_delete: 1,
                    dc_trangthai: 1,
                    id_cty_dang_sd: '$users.userName',
                    id_cty_nhan: '$users_id_nv_nhan.userName',
                    dc_lydo: 1,
                    id_ng_thuchien: '$users_id_ng_thuchien.userName',
                    dc_vi_tri_tu: "$infoVTtu.vi_tri",
                    dc_vi_tri_den: "$infoVTden.vi_tri",
                  }
                }
              ]);
              for (let i = 0; i < data.length; i++) {
                data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
                data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
              }
          
              return functions.success(res, 'get data success', { dem, data })
        }
    } catch (error) {
        console.error(error)
        return functions.setError(res, error)
    }
};
