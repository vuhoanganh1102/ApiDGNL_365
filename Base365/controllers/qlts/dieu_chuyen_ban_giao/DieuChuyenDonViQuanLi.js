const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen");
const fnc = require("../../../services/functions");
const thongBao = require('../../../models/QuanLyTaiSan/ThongBao')

exports.create = async(req,res) =>{
    try{//code theo PHP : add_dc_ts.php
        const id_cty = req.user.data.com_id
        const idQLC = req.user.data.idQLC
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
        const type_quyen = req.body.type_quyen
        const id_ng_nhan = req.body.id_ng_nhan

        let maxThongBao = await thongBao.findOne({},{},{sort: {id_tb : -1}}).lean() || 0 ;
        let maxDieuChuyen = await DieuChuyen.findOne({},{},{sort: {dc_id : -1}}).lean() || 0 ;
        let now = new Date()
        let ds_dc = ""
        console.log(maxDieuChuyen.dc_id)

        if(dieuchuyen_taisan) ds_dc = JSON.parse(dieuchuyen_taisan).ds_dc;
                        const updated_ds_dc = ds_dc.map((item) => ({
                        ts_id: item[0],
                        sl_ts: item[1]
                        }));
        let updateThongBao = new thongBao({
            id_tb : Number(maxThongBao.id_tb) +1 || 1,
            id_ts : updated_ds_dc[0].ts_id,
            id_cty : id_cty,
            id_ng_tao : idQLC,
            type_quyen :1,
            type_quyen_tao:1,
            loai_tb: 3,
            add_or_duyet: 1,
            da_xem: 0,
            date_create :  Date.parse(now)/1000,
         })
         await updateThongBao.save()
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
                id_tb : Number(maxThongBao.id_tb) +1 || 1,
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
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
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
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
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
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
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

            }else if(khoi_chon_phong_ban_nv == 0 && khoi_chon_phong_ban_nv_den == 1){
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
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
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
        let now = new Date()
        const ds_dc = JSON.parse(dieuchuyen_taisan).ds_dc;
        const updated_ds_dc = ds_dc.map((item) => ({
        ts_id: item[0],
        sl_ts: item[1]
        }));
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
exports.list = async(req,res) =>{
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
    if (page && pageSize) {
        const data = await DieuChuyen.find(conditions).skip(skip).limit(limit).lean()
        let count = await DieuChuyen.count(conditions)
        const totalCount = data.length > 0 ? data[0].totalCount : 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        if(data){
            return fnc.success(res,"lấy thành công",{data,totalPages,count})
        }
        return fnc.setError(res,"không tìm thấy dữ liệu")
    }else{
        const data = await DieuChuyen.find(conditions).lean()
        let count = await DieuChuyen.count(conditions)
        if(data){
            return fnc.success(res,"lấy thành công",{data,count})
        }
        return fnc.setError(res,"không tìm thấy dữ liệu")
    }
    }catch(e){
        return fnc.setError(res, e.message)
    }
}