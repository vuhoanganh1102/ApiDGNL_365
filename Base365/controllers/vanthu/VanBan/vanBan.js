const VanBan = require('../../../models/Vanthu/van_ban')
const functions = require("../../../services/functions");
const fs = require('fs');
const path = require('path');

exports.showAll = async (req, res) => {
    try {

        const showVanBan = await VanBan.find();
        res.status(200).json(showVanBan)
    } catch (error) {
        console.error('Failed to get history', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
}


exports.inCompany = async (req, res) => {
    try {
        let {
            title_vb, 
            des_vb, 
            so_vb, 
            nd_vb, 
            book_vb, 
            time_ban_hanh,
            time_hieu_luc,
            nhom_vb,
            user_send,
            name_user_send,
            com_user,
            user_nhan,
            user_cty,
            user_forward,//danh sách nhiều người kí
            type_thu_hoi,
            gui_ngoai_cty,
            trang_thai_vb,
            duyet_vb,
            type_xet_duyet,
            thoi_gian_duyet,
            nguoi_xet_duyet,
            nguoi_theo_doi,
            nguoi_ky,
            so_van_ban,
            chuc_vu_nguoi_ky,
            ghi_chu,
            type_khan_cap,
            type_bao_mat,
            type_tai,
            type_duyet_chuyen_tiep,
            type_nhan_chuyen_tiep,
            type_thay_the,
            type_duyet,
            update_time
        } = req.body;
        let createdDate = new Date(Date.now)
        if(!title_vb || !des_vb || !so_vb ||!nd_vb || !book_vb || !time_ban_hanh || !time_hieu_luc || !nhom_vb  || !user_send || !user_nhan || !file_vb || !trang_thai_vb || !duyet_vb || !type_xet_duyet || !thoi_gian_duyet || !nguoi_xet_duyet || !nguoi_theo_doi || !nguoi_ky || !so_van_ban || !phieu_trinh || !chuc_vu_nguoi_ky || !ghi_chu || !type_khan_cap || !type_bao_mat || !type_tai || !type_duyet_chuyen_tiep ||!type_nhan_chuyen_tiep || !type_thay_the  || !type_duyet ){
        return res.status(404).json("bad request")
        }else {
            
            let phieu_trinh = req.files.phieu_trinh
            functions.uploadVanthuCongVan(user_send,phieu_trinh)
            const FilePt = path.resolve(__dirname,`../Storage/base365/vanthu/congvan/${user_send}` , phieu_trinh.name);
            const pathStringPt = FilePt.toString();
            let file_vb = req.files.file_vb
            functions.uploadVanthuCongVan(user_send,file_vb)
            const FileVb = path.resolve(__dirname,`../Storage/base365/vanthu/congvan/${user_send}` ,file_vb.name)
            const pathStringVB = FileVb.toString();
            let maxID = await functions.getMaxID(VanBan)
            let _id = 0;
            if(maxID){
                _id = Number(maxID) + 1
            }
            let createVBI = new VanBan({
                _id : _id,
                title_vb : title_vb,
                des_vb : des_vb,
                nd_vb : nd_vb,
                so_vb : so_vb,
                time_ban_hanh : time_ban_hanh,
                time_hieu_luc : time_hieu_luc,
                nhom_vb : nhom_vb,
                user_send : user_send,
                user_nhan : user_nhan,
                user_cty : user_cty,
                user_forward : user_forward,
                type_thu_hoi : type_thu_hoi,
                file_vb : pathStringVB,
                trang_thai_vb : trang_thai_vb,
                duyet_vb : duyet_vb,
                type_xet_duyet : type_xet_duyet,
                thoi_gian_duyet : thoi_gian_duyet,
                nguoi_xet_duyet : nguoi_xet_duyet,
                nguoi_theo_doi : nguoi_theo_doi,
                nguoi_ky : nguoi_ky,
                so_van_ban : so_van_ban,
                phieu_trinh : pathStringPt,
                chuc_vu_nguoi_ky : chuc_vu_nguoi_ky,
                ghi_chu: ghi_chu,
                type_khan_cap: type_khan_cap,
                type_bao_mat : type_bao_mat,
                type_tai : type_tai,
                type_duyet_chuyen_tiep : type_duyet_chuyen_tiep,
                type_nhan_chuyen_tiep : type_nhan_chuyen_tiep,
                type_thay_the : type_thay_the,
                created_date : createdDate,
                type_duyet : type_duyet,
                update_time : update_time            
            })
            let saveCreateVBI = await createVBI.save();
            res.status(200).json(saveCreateVB);
        }
    } catch (error) {
        console.error('Failed to add ', error);
        res.status(500).json({ error: 'Failed to add' });
    }
}