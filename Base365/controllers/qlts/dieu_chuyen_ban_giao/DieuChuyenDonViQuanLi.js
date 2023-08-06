const thongBao = require('../../../models/QuanLyTaiSan/ThongBao')
const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen");
const ViTriTaiSan = require('../../../models/QuanLyTaiSan/ViTri_ts');
const TaiSanViTri = require('../../../models/QuanLyTaiSan/TaiSanVitri');
const TaiSan = require("../../../models/QuanLyTaiSan/TaiSan");
const fnc = require("../../../services/functions");
const department = require('../../../models/qlc/Deparment');
const BaoDuong = require("../../../models/QuanLyTaiSan/BaoDuong");
const Users = require('../../../models/Users')
const capPhat = require('../../../models/QuanLyTaiSan/CapPhat')
const ThuHoi = require('../../../models/QuanLyTaiSan/ThuHoi')
exports.create = async(req,res) =>{
    try{//code theo PHP : add_dc_ts.php
        const id_cty = req.user.data.com_id
        const idQLC = req.user.data._id
        const dieuchuyen_taisan = req.body.dieuchuyen_taisan
        const loai_dc = req.body.loai_dc
        const ng_thuc_hien = req.body.ng_thuc_hien
        const vi_tri_dc_tu = req.body.vi_tri_dc_tu
        const vitri_dc_den = req.body.vitri_dc_den
        const dc_ngay = new Date(req.body.ngay_dc)
        const ly_do_dc = req.body.ly_do_dc
        const id_dai_dien_nhan = req.body.id_dai_dien_nhan
        const khoi_chon_phong_ban_nv = req.body.khoi_chon_phong_ban_nv
        const khoi_chon_phong_ban_nv_den = req.body.khoi_chon_phong_ban_nv_den
        const khoi_dc_tu = req.body.khoi_dc_tu
        const khoi_dc_den = req.body.khoi_dc_den
        const khoi_ng_dai_dien_dc_den = req.body.khoi_ng_dai_dien_dc_den
        const khoi_ng_dai_dien_dc_tu = req.body.khoi_ng_dai_dien_dc_tu
        const dc_trangthai = req.body.dc_trangthai
        const dc_da_xoa = req.body.dc_da_xoa
        const date_delete = req.body.date_delete
        //thongbao
        const type_quyen = req.type
        const id_ng_nhan = req.body.id_ng_nhan

        let maxThongBao = await thongBao.findOne({},{},{sort: {id_tb : -1}}).lean() || 0 ;
        let maxDieuChuyen = await DieuChuyen.findOne({},{},{sort: {dc_id : -1}}).lean() || 0 ;
        let now = new Date()
        let ds_dc = ""
        if(dieuchuyen_taisan) ds_dc = JSON.parse(dieuchuyen_taisan).ds_dc;
                        const updated_ds_dc = ds_dc.map((item) => ({
                        ts_id: item[0],
                        sl_ts: item[1]
                        }));
        // let updateThongBao = new thongBao({
        //     id_tb : Number(maxThongBao.id_tb) +1 || 1,
        //     id_ts : updated_ds_dc[0].ts_id,
        //     id_cty : id_cty,
        //     id_ng_tao : idQLC,
        //     type_quyen :1,
        //     type_quyen_tao:1,
        //     loai_tb: 3,
        //     add_or_duyet: 1,
        //     da_xem: 0,
        //     date_create :  Date.parse(now)/1000,
        //  })
        //  await updateThongBao.save()
        if(loai_dc == 0){
            let insert_dc_vt = new DieuChuyen({
                dc_id: Number(maxDieuChuyen.dc_id) +1 || 1,
                id_cty : id_cty,
                dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                id_ng_thuchien : ng_thuc_hien,
                vi_tri_dc_tu : vi_tri_dc_tu,
                dc_vitri_tsnhan :vitri_dc_den,
                dc_type_quyen:type_quyen,
                dc_type: loai_dc,
                dc_ngay: Date.parse(dc_ngay)/1000,
                vitri_ts_daidien: id_dai_dien_nhan,
                dc_lydo: ly_do_dc,
                id_ng_tao_dc: idQLC,
                dc_date_create :  Date.parse(now)/1000,
             })
             await insert_dc_vt.save()
             let updateThongBaoNguoiNhan = new thongBao({
                id_tb : Number(maxThongBao.id_tb) +1 || 1,
                id_ng_nhan: id_ng_nhan,
                id_cty : id_cty,
                id_ng_tao : idQLC,
                type_quyen :2,
                type_quyen_tao:type_quyen,
                loai_tb: 3,
                add_or_duyet: 1,
                da_xem: 0,
                date_create :  Date.parse(now)/1000,
            })
            await updateThongBaoNguoiNhan.save()
             let updateThongBaoDaidienNhan = new thongBao({
                id_tb : Number(maxThongBao.id_tb) +2 || 2,
                id_ng_nhan: id_dai_dien_nhan,
                id_cty : id_cty,
                id_ng_tao : idQLC,
                type_quyen :2,
                type_quyen_tao:type_quyen,
                loai_tb: 3,
                add_or_duyet: 1,
                da_xem: 0,
                date_create :  Date.parse(now)/1000,
            })
            await updateThongBaoDaidienNhan.save()
            return fnc.success(res, "tạo thành công",{insert_dc_vt,updateThongBaoNguoiNhan,updateThongBaoDaidienNhan})
        }else if(loai_dc == 1){
            if(khoi_chon_phong_ban_nv == 0 && khoi_chon_phong_ban_nv_den == 0){
                let insert_dc_vt = new DieuChuyen({
                    dc_id: Number(maxDieuChuyen.dc_id) +1 || 1,
                    id_cty : id_cty,
                    dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                    id_ng_thuchien : ng_thuc_hien,
                    id_nv_dangsudung: khoi_dc_tu,
                    id_nv_nhan :khoi_dc_den ,
                    dc_lydo: ly_do_dc,
                    vi_tri_dc_tu : vi_tri_dc_tu,
                    dc_vitri_tsnhan :vitri_dc_den,
                    dc_ngay:  Date.parse(dc_ngay)/1000,
                    dc_trangthai:dc_trangthai,
                    dc_type_quyen:type_quyen,
                    dc_type: loai_dc,
                    id_ng_tao_dc: idQLC,
                    xoa_dieuchuyen:dc_da_xoa,
                    dc_date_create :  Date.parse(now)/1000,
                    dc_date_delete:date_delete ,
                 })
                 await insert_dc_vt.save()
                 let updateThongBaoNguoiNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
                    id_cty : id_cty,
                    id_ng_nhan: ng_thuc_hien,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoNguoiNhan.save()
                 let updateThongBaoDaidienNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +2 || 2,
                    id_cty : id_cty,
                    id_ng_nhan: khoi_dc_den,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoDaidienNhan.save()
            return fnc.success(res, "tạo thành công",{insert_dc_vt,updateThongBaoNguoiNhan,updateThongBaoDaidienNhan})

            }else if(khoi_chon_phong_ban_nv == 1 && khoi_chon_phong_ban_nv_den == 0){
                let insert_dc_vt = new DieuChuyen({
                    dc_id: Number(maxDieuChuyen.dc_id) +1 || 1,
                    id_cty : id_cty,
                    dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                    id_ng_thuchien : ng_thuc_hien,
                    id_pb_dang_sd: khoi_dc_tu,
                    id_daidien_dangsd: khoi_ng_dai_dien_dc_tu,
                    id_nv_nhan :khoi_dc_den ,
                    dc_lydo: ly_do_dc,
                    vi_tri_dc_tu : vi_tri_dc_tu,
                    dc_vitri_tsnhan :vitri_dc_den,
                    dc_ngay: Date.parse(dc_ngay)/1000,
                    dc_trangthai:dc_trangthai,
                    dc_type_quyen:type_quyen,
                    dc_type: loai_dc,
                    id_ng_tao_dc: idQLC,
                    xoa_dieuchuyen:dc_da_xoa,
                    dc_date_create :  Date.parse(now)/1000,
                    dc_date_delete:date_delete ,
                 })
                 await insert_dc_vt.save()
                 let updateThongBaoNguoiNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
                    id_cty : id_cty,
                    id_ng_nhan: ng_thuc_hien,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoNguoiNhan.save()
                 let updateThongBaoDaidienNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +2 || 2,
                    id_cty : id_cty,
                    id_ng_nhan: khoi_dc_den,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoDaidienNhan.save()
            return fnc.success(res, "tạo thành công",{insert_dc_vt,updateThongBaoNguoiNhan,updateThongBaoDaidienNhan})

            }else if(khoi_chon_phong_ban_nv == 0 && khoi_chon_phong_ban_nv_den == 1){
                let insert_dc_vt = new DieuChuyen({
                    dc_id: Number(maxDieuChuyen.dc_id) +1 || 1,
                    id_cty : id_cty,
                    dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                    id_ng_thuchien : ng_thuc_hien,
                    id_nv_dangsudung: khoi_dc_tu,
                    id_pb_nhan :khoi_dc_den ,
                    id_daidien_nhan :khoi_ng_dai_dien_dc_den ,
                    dc_lydo: ly_do_dc,
                    vi_tri_dc_tu : vi_tri_dc_tu,
                    dc_vitri_tsnhan :vitri_dc_den,
                    dc_ngay: Date.parse(dc_ngay)/1000,
                    dc_trangthai:dc_trangthai,
                    dc_type_quyen:type_quyen,
                    dc_type: loai_dc,
                    id_ng_tao_dc: idQLC,
                    xoa_dieuchuyen:dc_da_xoa,
                    dc_date_create :  Date.parse(now)/1000,
                    dc_date_delete:date_delete ,
                 })
                 await insert_dc_vt.save()
                 let updateThongBaoNguoiNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
                    id_cty : id_cty,
                    id_ng_nhan: ng_thuc_hien,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoNguoiNhan.save()
                 let updateThongBaoDaidienNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +2 || 2,
                    id_cty : id_cty,
                    id_ng_nhan: khoi_ng_dai_dien_dc_den,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoDaidienNhan.save()
            return fnc.success(res, "tạo thành công",{insert_dc_vt,updateThongBaoNguoiNhan,updateThongBaoDaidienNhan})

            }else if(khoi_chon_phong_ban_nv == 1 && khoi_chon_phong_ban_nv_den == 1){
                let insert_dc_vt = new DieuChuyen({
                    dc_id: Number(maxDieuChuyen.dc_id) +1 || 1,
                    id_cty : id_cty,
                    dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                    id_ng_thuchien : ng_thuc_hien,
                    id_pb_dang_sd: khoi_dc_tu,
                    id_daidien_dangsd :khoi_ng_dai_dien_dc_tu ,
                    id_pb_nhan :khoi_dc_den ,
                    id_daidien_nhan :khoi_ng_dai_dien_dc_den ,
                    dc_lydo: ly_do_dc,
                    vi_tri_dc_tu : vi_tri_dc_tu,
                    dc_vitri_tsnhan :vitri_dc_den,
                    dc_ngay: Date.parse(dc_ngay)/1000,
                    dc_trangthai:dc_trangthai,
                    dc_type_quyen:type_quyen,
                    dc_type: loai_dc,
                    id_ng_tao_dc: idQLC,
                    xoa_dieuchuyen:dc_da_xoa,
                    dc_date_create :  Date.parse(now)/1000,
                    dc_date_delete:date_delete ,
                 })
                 await insert_dc_vt.save()
                 let updateThongBaoNguoiNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
                    id_cty : id_cty,
                    id_ng_nhan: ng_thuc_hien,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoNguoiNhan.save()
                 let updateThongBaoDaidienNhan = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +2 || 2,
                    id_cty : id_cty,
                    id_ng_nhan: id_dai_dien_nhan,
                    id_ng_tao : idQLC,
                    type_quyen :2,
                    type_quyen_tao:type_quyen,
                    loai_tb: 3,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                })
                await updateThongBaoDaidienNhan.save()
            return fnc.success(res, "tạo thành công",{insert_dc_vt,updateThongBaoNguoiNhan,updateThongBaoDaidienNhan})

            }else{
            return fnc.setError(res, "loai_dc 1 nhưng lỗi ở khoi_chon_phong_ban_nv và khoi_chon_phong_ban_nv_den")

            }
        }else if(loai_dc == 2){
            let insert_dc_vt = new DieuChuyen({
                dc_id: Number(maxDieuChuyen.dc_id) +1 || 1,
                id_cty : id_cty,
                dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                id_ng_thuchien : ng_thuc_hien,
                id_cty_dang_sd: khoi_dc_tu,
                id_daidien_dangsd :khoi_ng_dai_dien_dc_tu ,
                id_cty_nhan :khoi_dc_den ,
                id_daidien_nhan :khoi_ng_dai_dien_dc_den ,
                dc_lydo: ly_do_dc,
                vi_tri_dc_tu : vi_tri_dc_tu,
                dc_vitri_tsnhan :vitri_dc_den,
                dc_ngay: Date.parse(dc_ngay)/1000,
                dc_trangthai:dc_trangthai,
                dc_type_quyen:type_quyen,
                dc_type: loai_dc,
                id_ng_tao_dc: idQLC,
                xoa_dieuchuyen:dc_da_xoa,
                dc_date_create :  Date.parse(now)/1000,
                dc_date_delete:date_delete ,
             })
             await insert_dc_vt.save()
            return fnc.success(res, "tạo thành công",{insert_dc_vt})
        }else{
            return fnc.setError(res, " lỗi không điền loai_dc")
        }
    }catch(e){
        return fnc.setError(res, e.message)
    }
}

exports.edit = async(req,res) =>{
    try{//code theo PHP : edit_dc_ts.php
        const id_cty = req.user.data.com_id
        const idQLC = req.user.data.idQLC
        const dieuchuyen_taisan = req.body.dieuchuyen_taisan
        const loai_dc = req.body.loai_dc
        const ng_thuc_hien = req.body.ng_thuc_hien
        const vi_tri_dc_tu = req.body.vi_tri_dc_tu
        const vitri_dc_den = req.body.vitri_dc_den
        const dc_ngay = new Date(req.body.ngay_dc)
        const ly_do_dc = req.body.ly_do_dc
        const dc_id = req.body.dc_id
        const khoi_chon_phong_ban_nv = req.body.khoi_chon_phong_ban_nv
        const khoi_chon_phong_ban_nv_den = req.body.khoi_chon_phong_ban_nv_den
        const khoi_dc_tu = req.body.khoi_dc_tu
        const khoi_dc_den = req.body.khoi_dc_den
        const khoi_ng_dai_dien_dc_den = req.body.khoi_ng_dai_dien_dc_den
        const khoi_ng_dai_dien_dc_tu = req.body.khoi_ng_dai_dien_dc_tu
        const dai_dien_nhan = req.body.dai_dien_nhan
        let updated_ds_dc = ""
        let now = new Date()
        if(dieuchuyen_taisan){
          const ds_dc = JSON.parse(dieuchuyen_taisan).ds_dc;
          updated_ds_dc = ds_dc.map((item) => ({
          ts_id: item[0],
          sl_ts: item[1]
          }));
        }
     
        if(loai_dc == 0){
             const DC = await DieuChuyen.findOne({ dc_id: dc_id });
             if (DC) {
                await DieuChuyen.updateOne({ dc_id: dc_id }, {
                    dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                    id_ng_thuchien : ng_thuc_hien,
                    dc_ngay: Date.parse(dc_ngay)/1000,
                    dc_lydo: ly_do_dc,
                    vi_tri_dc_tu : vi_tri_dc_tu,
                    dc_vitri_tsnhan :vitri_dc_den,
                    vitri_ts_daidien:dai_dien_nhan,
                    })
                    return fnc.success(res, "cập nhật thành công", {DC})
            } 
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            
        }else if(loai_dc == 1){
                if(khoi_chon_phong_ban_nv == 0 && khoi_chon_phong_ban_nv_den == 0){
                    const DC = await DieuChuyen.findOne({ dc_id: dc_id });
                    if (DC) {
                       await DieuChuyen.updateOne({ dc_id: dc_id }, {
                           dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                           id_ng_thuchien : ng_thuc_hien,
                           id_nv_dangsudung: khoi_dc_tu,
                           id_pb_dang_sd: 0,
                           id_daidien_dangsd: 0,
                           id_nv_nhan: khoi_dc_den,
                           id_pb_nhan: 0,
                           id_daidien_nhan: 0,
                           vi_tri_dc_tu: vi_tri_dc_tu,
                           dc_vitri_tsnhan: vitri_dc_den,
                           dc_ngay: Date.parse(dc_ngay)/1000,
                           dc_lydo: ly_do_dc,
                           })
                           return fnc.success(res, "cập nhật thành công", {DC})
                   } 
                   return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                }else if(khoi_chon_phong_ban_nv == 1 && khoi_chon_phong_ban_nv_den == 0){
                    const DC = await DieuChuyen.findOne({ dc_id: dc_id });
                    if (DC) {
                       await DieuChuyen.updateOne({ dc_id: dc_id }, {
                           dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                           id_ng_thuchien : ng_thuc_hien,
                           id_nv_dangsudung: 0,
                           id_pb_dang_sd: khoi_dc_tu,
                           id_daidien_dangsd: khoi_ng_dai_dien_dc_tu,
                           id_nv_nhan: khoi_dc_den,
                           id_pb_nhan: 0,
                           id_daidien_nhan: 0,
                           vi_tri_dc_tu: vi_tri_dc_tu,
                           dc_vitri_tsnhan: vitri_dc_den,
                           dc_ngay: Date.parse(dc_ngay)/1000,
                           dc_lydo: ly_do_dc,
                           })
                           return fnc.success(res, "cập nhật thành công", {DC})
                   } 
                   return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                }else if(khoi_chon_phong_ban_nv == 0 && khoi_chon_phong_ban_nv_den == 1){
                    const DC = await DieuChuyen.findOne({ dc_id: dc_id });
                    if (DC) {
                       await DieuChuyen.updateOne({ dc_id: dc_id }, {
                           dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                           id_ng_thuchien : ng_thuc_hien,
                           id_nv_dangsudung: khoi_dc_tu,
                           id_pb_dang_sd: 0,
                           id_daidien_dangsd: 0,
                           id_nv_nhan: 0,
                           id_pb_nhan: khoi_dc_den,
                           id_daidien_nhan: khoi_ng_dai_dien_dc_den,
                           vi_tri_dc_tu: vi_tri_dc_tu,
                           dc_vitri_tsnhan: vitri_dc_den,
                           dc_ngay: Date.parse(dc_ngay)/1000,
                           dc_lydo: ly_do_dc,
                           })
                           return fnc.success(res, "cập nhật thành công", {DC})
                   } 
                   return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                }else if(khoi_chon_phong_ban_nv == 1 && khoi_chon_phong_ban_nv_den == 1){
                    const DC = await DieuChuyen.findOne({ dc_id: dc_id });
                    if (DC) {
                       await DieuChuyen.updateOne({ dc_id: dc_id }, {
                           dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                           id_ng_thuchien : ng_thuc_hien,
                           id_nv_dangsudung: 0,
                           id_pb_dang_sd: khoi_dc_tu,
                           id_daidien_dangsd: khoi_ng_dai_dien_dc_tu,
                           id_nv_nhan: 0,
                           id_pb_nhan: khoi_dc_den,
                           id_daidien_nhan: khoi_ng_dai_dien_dc_den,
                           vi_tri_dc_tu: vi_tri_dc_tu,
                           dc_vitri_tsnhan: vitri_dc_den,
                           dc_ngay: Date.parse(dc_ngay)/1000,
                           dc_lydo: ly_do_dc,
                           })
                           return fnc.success(res, "cập nhật thành công", {DC})
                   } 
                   return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                }else{
                    return fnc.setError(res, "loai_dc 1 nhưng sửa lỗi ở khoi_chon_phong_ban_nv và khoi_chon_phong_ban_nv_den")
                }
             }else if(loai_dc == 2){
                const DC = await DieuChuyen.findOne({ dc_id: dc_id });
                if (DC) {
                   await DieuChuyen.updateOne({ dc_id: dc_id }, {
                       dieuchuyen_taisan : {ds_dc:updated_ds_dc },
                       id_ng_thuchien : ng_thuc_hien,
                       id_cty_dang_sd: khoi_dc_tu,
                       id_daidien_dangsd: khoi_ng_dai_dien_dc_tu,
                       id_cty_nhan: khoi_dc_den,
                       id_daidien_nhan: khoi_ng_dai_dien_dc_den,
                       vi_tri_dc_tu: vi_tri_dc_tu,
                       dc_vitri_tsnhan: vitri_dc_den,
                       dc_ngay: Date.parse(dc_ngay)/1000,
                       dc_lydo: ly_do_dc,
                       })
                       return fnc.success(res, "cập nhật thành công", {DC})
               } 
               return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
             }else{
                return fnc.setError(res, " lỗi không điền loai_dc")
             }
    }catch(e){
        return fnc.setError(res, e.message)
    }
}

//code theo dieuchuyen_dvQL2.php

exports.list = async (req, res, next) => {
    try {
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const id_cty = req.user.data.com_id
        const idQLC = req.user.data.idQLC
        const dc_id = req.body.dc_id
        const dc_trangthai = req.body.dc_trangthai
        const type = req.body.type
        // let data = []

        let Num_dc_vitri = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 0}).count()
        let Num_dc_doituong = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 1}).count()
        let Num_dcdvQL = await DieuChuyen.find({id_cty: id_cty,xoa_dieuchuyen: 0, dc_type : 2}).count()
        let numAllocaction = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        let numRecall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        let dem_bg = (numAllocaction.length + numRecall.length)
        let thongKe = {
            Num_dc_vitri: Num_dc_vitri,
            Num_dc_doituong: Num_dc_doituong,
            Num_dcdvQL: Num_dcdvQL,
            dem_bg: dem_bg,
        };
        // data.push({Num_dc_vitri : Num_dc_vitri})
        // data.push({Num_dc_doituong : Num_dc_doituong})
        // data.push({Num_dcdvQL : Num_dcdvQL})
        // data.push({dem_bg : dem_bg})
        let filter = {};
        filter.id_cty = id_cty
        filter.xoa_dieuchuyen = 0
        filter.dc_type = 0
        if(dc_id)  filter.dc_id = Number(dc_id)
        if(dc_trangthai)  filter.dc_trangthai = Number(dc_trangthai)
        //1: điều chuyển vị trí tài sản
        if (type == 1) {
            filter.dc_type = 0
            console.log(filter)

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
                          from: "Users",
                          localField: "id_ng_thuchien",
                          foreignField: "_id",
                        //   pipeline: [
                        //       { $match: {$and : [
                        //       { "type" : {$ne : 1 }},
                        //       {"idQLC":{$ne : 0}},
                        //       {"idQLC":{$ne : 1}}
                        //       ]},
                        //       }
                        //   ],
                           as : "users_id_ng_thuchien"
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
                    ten_ng_thuchien: '$users_id_ng_thuchien.userName',
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
                    let depName = await department.findOne({ com_id: id_cty, dep_id: data[i].dep_id })
                  if (depName) data[i].depName = depName.dep_name
          
                }
                if (data[i].id_pb_nhan != 0) {
                  let id_pb_nhan = await department.findOne({ dep_id: data[i].id_pb_nhan }, { dep_name: 1 })
                  if (id_pb_nhan) data[i].id_pb_nhan = id_pb_nhan.dep_name
                }
                data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
                data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
              }
              let totalCount = await DieuChuyen.count(filter) 

              return fnc.success(res, 'get data success', {thongKe, data , totalCount })
        }
        //2: điều chuyển đối tượng sd
        if (type == 2) {
            filter.dc_type = 1
            console.log(filter)

            let data = await DieuChuyen.aggregate([
                { $match: filter },
                { $sort: { dc_id: -1 } },
                { $skip: skip },
                { $limit: limit },
                    {
                      $lookup: {
                          from: "Users",
                          localField: "id_ng_thuchien",
                          foreignField: "_id",
                        //   pipeline: [
                        //       { $match: {$and : [
                        //       { "type" : {$ne : 1 }},
                        //       {"idQLC":{$ne : 0}},
                        //       {"idQLC":{$ne : 1}}
                        //       ]},
                        //       }
                        //   ],
                           as : "users_id_ng_thuchien"
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
                    ten_ng_thuchien: '$users_id_ng_thuchien.userName',
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
              let totalCount = await DieuChuyen.count(filter)
          
              return fnc.success(res, 'get data success', {thongKe, data ,totalCount})
        }

        //3: điều chuyển đơn vị quản lý
        if (type == 3) {
            // if (type_quyen == 2) filter.id_ng_tao_dc = idQLC
            filter.dc_type = 2
            console.log(filter)
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
                          from: "Users",
                          localField: "id_cty_dang_sd",
                          foreignField: "_id",
                        //   pipeline: [
                        //       { $match: {$and : [
                        //       { "type" : 1},
                        //       {"idQLC":{$ne : 0}},
                        //       {"idQLC":{$ne : 1}}
                        //       ]},
                        //       }
                        //   ],
                           as : "cty_dang_sd"
                      }
                  },
                { $unwind: { path: "$cty_dang_sd", preserveNullAndEmptyArrays: true } },
          
               {
                      $lookup: {
                          from: "Users",
                          localField: "id_cty_dang_sd",
                          foreignField: "_id",
                        //   pipeline: [
                        //       { $match: {$and : [
                        //       { "type" : 1},
                        //       {"idQLC":{$ne : 0}},
                        //       {"idQLC":{$ne : 1}}
                        //       ]},
                        //       }
                        //   ],
                           as : "cty_nhan"
                      }
                  },
                { $unwind: { path: "$cty_nhan", preserveNullAndEmptyArrays: true } },

                {
                  $lookup: {
                    from: 'Users',
                    localField: 'id_ng_thuchien',
                    foreignField: '_id',
                    as: 'users_id_ng_thuchien'
                  }
                },
                { $unwind: { path: "$users_id_ng_thuchien", preserveNullAndEmptyArrays: true } },
                { $match: {"users_id_ng_thuchien.type" : 2} },

                {
                  $project: {
                    dc_ngay: 1,
                    dc_id: 1,
                    dc_date_delete: 1,
                    dc_trangthai: 1,
                    dc_lydo: 1,
                    ten_ng_thuchien: '$users_id_ng_thuchien.userName',
                    ten_cty_nhan: '$cty_nhan.userName',
                    ten_cty_dang_sd: '$cty_dang_sd.userName',
                    dc_vi_tri_tu: "$infoVTtu.vi_tri",
                    dc_vi_tri_den: "$infoVTden.vi_tri",
                  }
                }
              ]);
              for (let i = 0; i < data.length; i++) {
                data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
                data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
              } 
              let totalCount = await DieuChuyen.count(filter)
          
              return fnc.success(res, 'get data success', {thongKe, data , totalCount })
        }
    } catch (error) {
         console.error(error)
        return fnc.setError(res, error)
    }
};
//tu choi dieu chuyen 
exports.refuserTransfer = async (req , res) =>{
    try{
        const id_cty = req.user.data.com_id
        const dc_id = req.body.dc_id
        const content = req.body.content
        if(dc_id){
            const data = await DieuChuyen.findOne({ dc_id: dc_id,id_cty: id_cty });
            if (!data) {
               return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
            await DieuChuyen.updateOne({ dc_id: dc_id,id_cty:id_cty }, {
                dc_trangthai : 4,
                dc_lydo_tuchoi : content,
                })
            }
            return fnc.success(res, "cập nhật thành công")
        }
        return fnc.setError(res, "thiếu trường dc_id")

    }catch(e){
        return fnc.setError(res, e.message)
    }
}