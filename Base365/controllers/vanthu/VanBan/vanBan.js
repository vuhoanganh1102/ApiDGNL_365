const VanBan = require('../../../models/Vanthu/van_ban')
const functions = require("../../../services/functions");
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
            title_vb, des_vb, so_vb, nd_vb, book_vb, time_ban_hanh, time_hieu_luc, nhom_vb, user_send, name_user_send,com_user,user_nhan,user_cty,user_forward,type_thu_hoi,gui_ngoai_cty,file_vb,trang_thai_vb,duyet_vb,type_xet_duyet,thoi_gian_duyet,nguoi_xet_duyet,nguoi_theo_doi,nguoi_ky,so_van_ban,phieu_trinh,chuc_vu_nguoi_ky,ghi_chu,type_khan_cap,type_bao_mat,type_tai,type_duyet_chuyen_tiep,type_nhan_chuyen_tiep,type_thay_the,create_date,type_duyet,update_time
        } = req.body;

        if(!title_vb || !des_vb || !so_vb  || !book_vb || !time_ban_hanh || !time_hieu_luc || !nhom_vb  || !user_send || !user_nhan || !file_vb || !trang_thai_vb || !duyet_vb || !type_xet_duyet || !thoi_gian_duyet || !nguoi_xet_duyet || !nguoi_theo_doi || !nguoi_ky || !so_van_ban || !phieu_trinh || !chuc_vu_nguoi_ky || !ghi_chu || !type_khan_cap || !type_bao_mat || !type_tai || !type_duyet_chuyen_tiep ||!type_nhan_chuyen_tiep || !type_thay_the || !create_date || !type_duyet || !update_time){
        return res.status(404).json("bad request")
        }else {
            let maxID = await functions.getMaxID(VanBan)
            let _id = 0;
            if(maxID){
                _id = Number(maxID) + 1
            }
            let createVB = new VanBan({
                _id : _id,
                title_vb : title_vb,
                des_vb : des_vb,
                so_vb : so_vb,
                
            })
        }


    } catch (error) {
        console.error('Failed to add ', error);
        res.status(500).json({ error: 'Failed to add' });
    }
}