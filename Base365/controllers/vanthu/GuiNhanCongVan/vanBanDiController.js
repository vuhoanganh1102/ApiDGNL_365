// const AdminUser = require('../../../models/AdminUser');
const VanBan = require('../../../models/Vanthu365/van_ban');
const functions = require("../../../services/functions");
const vanThuService = require("../../../services/vanthu");
const ThayThe = require("../../../models/Vanthu365/tbl_thay_the");
const ThongBao = require("../../../models/Vanthu365/tl_thong_bao");

//----------------------------------------VAN BAN DI---------------------------------------------------

//--Them van ban di
exports.createVanBanDi = async (req, res, next) => {
    try { 

        let {title_vb, des_vb, so_vb, nd_vb, book_vb,time_ban_hanh,
          nhom_vb, user_nhan, nguoi_theo_doi,nguoi_ky, 
          chuc_vu_nguoi_ky, type_khan_cap, type_bao_mat, type_tai, type_duyet_chuyen_tiep, 
          type_nhan_chuyen_tiep,type_thay_the, created_date, so_vb_th,
          ghi_chu, so_van_ban, type_thu_hoi, xet_duyet_van_ban, type_nhieu_nguoi_ky} = req.body;
        let checkFields = [title_vb, des_vb, so_vb, book_vb, time_ban_hanh, nhom_vb, user_nhan, nguoi_ky,
          chuc_vu_nguoi_ky, xet_duyet_van_ban
        ]
        
        for(let i=0; i<checkFields.length; i++){
          if(!checkFields[i]) {
            return functions.setError(res, "Missing input value!", 404);
          }
        }

        //
        let type_xet_duyet = '';
        let thoi_gian_duyet = '';
        let nguoi_xet_duyet = '';
        let type_duyet = 1;
        let trang_thai_vb = 6;
        created_date = Date.now();
        if(xet_duyet_van_ban == 2) {
          type_xet_duyet = type_xet_duyet;
          thoi_gian_duyet = thoi_gian_duyet;
          nguoi_xet_duyet = nguoi_xet_duyet;
          type_duyet = 0;
          trang_thai_vb = 0;
        }

        //nguoi xet duet => mang
        //nguoi nhan => mang
        //nguoi ky => mang
        let data_nhan = user_nhan;
        
        let nguoiky_vanban=nguoi_ky;
        if(type_nhieu_nguoi_ky=='on') {
          nguoiky_vanban = nguoi_ky;
        }
        
        
        let file = req.files.file_vb;
        let file_vb_name='';
        if(file) {
          for(let i=0; i<file.length; i++){
            let checkFile = await functions.checkFile(file[i].path);
            let fileNameOrigin = file[i].name;

            if(!checkFile){
              return functions.setError(res, `File{fileNameOrigin khong dung dinh dang hoac qua kich cho phep!`, 405);
            }
            let fileName = await vanThuService.uploadFileNameRandom('file_van_ban', file[i]);
            file_vb_name += fileName;
          }
        }
        let phieu_trinh = req.files.phieu_trinh;
        if(phieu_trinh) {
          let checkFile = await functions.checkFile(phieu_trinh.path);
          let fileNameOrigin = phieu_trinh.name;

          if(!checkFile){
            return functions.setError(res, `File{fileNameOrigin khong dung dinh dang hoac qua kich cho phep!`, 405);
          }
          phieu_trinh = await vanThuService.uploadFileNameRandom('file_van_ban', phieu_trinh);
        }
        console.log(user_nhan);
        let user_cty = '';
        let com_user = req.comId;
        if(data_nhan == 0){
          user_cty = req.comId;
        }
        let name_user_send = req.name_user;
        let user_send = req.id;
        let maxIdVB = await vanThuService.getMaxId(VanBan);
        console.log(maxIdVB);
        let fields = {
          _id: maxIdVB,
          title_vb: title_vb,
          des_vb: des_vb, //trich yeu
          so_vb: so_vb,
          nd_vb: nd_vb, //noi dung
          book_vb: book_vb, //nam nam hanh
          time_ban_hanh: time_ban_hanh,//thoi gian ban hanh
          time_hieu_luc: time_ban_hanh,//thoi tian ban hanh
          nhom_vb: nhom_vb, //loai van ban
          user_send: user_send, // --token
          name_user_send: name_user_send, //--token
          user_nhan: data_nhan, //mang
          com_user: com_user, //--token
          user_cty: user_cty, //--token
          file_vb: file_vb_name,
          //xet duyet van ban
          // check
          
          type_xet_duyet: type_xet_duyet, 
          thoi_gian_duyet: thoi_gian_duyet,
          nguoi_xet_duyet: nguoi_xet_duyet, //mang
          type_duyet: type_duyet,
          trang_thai_vb: type_duyet,

          nguoi_theo_doi: nguoi_theo_doi,
          nguoi_ky: nguoi_ky, 
          chuc_vu_nguoi_ky: chuc_vu_nguoi_ky, 
          type_khan_cap: type_khan_cap,
          type_bao_mat: type_bao_mat,
          type_tai: type_tai,
          type_duyet_chuyen_tiep: type_duyet_chuyen_tiep,
          type_nhan_chuyen_tiep: type_nhan_chuyen_tiep,

          //van ban thay the
          type_thay_the: type_thay_the,

          created_date: created_date,
          // xet_duyet_van_ban: xet_duyet_van_ban,
          duyet_vb: xet_duyet_van_ban, //xet_duyet_van_ban,
          so_van_ban: so_van_ban,
          ghi_chu: ghi_chu,
          // ten_so_vanban: ten_so_vanban,
          
          phieu_trinh: phieu_trinh,// fileName1
          type_thu_hoi: type_thu_hoi //check id ton tai chua
        }

        if(type_thu_hoi != 1 && !so_vb_th){
          let vanBan = new VanBan(fields);
          vanBan = await vanBan.save();
          if(!vanBan) {
            return functions.setError(res, "Insert data into tbl van ban fail!", 505);
          }
        }
        //them thay the
        if(type_thay_the==1){
          let {so_vb_tt, ten_vb_tt, trich_yeu_tt} = req.body;
          let maxIdThayThe = await vanThuService.getMaxId(ThayThe);
          let fieldsThayThe = {_id: maxIdThayThe, so_vb_tt, ten_vb_tt, trich_yeu_tt, create_time: Date.now()};
          
          let thayThe = new ThayThe(fieldsThayThe);
          thayThe = thayThe.save();
          if(!thayThe) {
            return functions.setError(res, "Insert data into tbl thay the fail!", 505);
          }
        }
        
        //them thong bao
        let maxIdThongBao = await vanThuService.getMaxId(ThongBao);
        let fieldsThongBao = {_id: maxIdThongBao, id_user: user_send, id_user_nhan: user_nhan, type: 1, view: 2, created_date: Date.now(), id_van_ban: maxIdVB};
        let thongBao = new ThongBao(fieldsThongBao);
        thongBao = await thongBao.save();
        if(!thongBao) {
          return functions.setError(res, "Insert data into tbl thong bao fail!", 505);
        }

        //gui chat

        // user_forward:
        // type_thu_hoi:
        // gui_ngoai_cty:
        // mail_cty:
        // name_com:

        return functions.success(res, "Create van ban success!");
    } catch (error) {
        console.error('Err from server', error);
        res.status(500).json({ error: 'Err from server' });
    }
};


// exports.createVanBanOut = async(req, res, next)=>{
//   try{
//     // let {
//     // ten_vanban,trich_yeu, so_vanban, noidung_vanban, ten_so_vanban, thoi_gian_ban_hanh, 
//     // ngay_co_hieu_luc, nhom_van_ban, nam_vb, ac, id_cong_ty, mail_congty,name_com, data_nhan, nguoi_theo_doi,
//     // file_name, loai_xet_duyet, thoi_gian_duyet, data_nguoi_duyet, type_khan_cap, type_bao_mat, 
//     // type_tai, type_duyet_chuyen_tiep, type_nhan_chuyen_tiep,time,com_user,type_duyet,trang_thai_vb,
//     // xet_duyet_van_ban, ghi_chu, so_van_ban} = req.body;
//     // let {ten_vanban, so_vanban, mail_congty, id_cong_ty, tk_mail_nhan, trich_yeu, nguoi_theo_doi, noidung_vanban, noidung_guimail, nam_vb, type_usn, loai_van_ban, ghi_chu, 
//     //   xet_duyet_van_ban, loai_xet_duyet, thoi_gian_duyet, nguoi_xet_duyet, type_duyet, trang_thai_vb, 
//     //   id_user_nhan, data_name_nhan, data_nguoi_duyet, ten_so_vanban, thoi_gian_ban_hanh, nhom_van_ban, 
//     //   type_khan_cap, type_bao_mat, type_tai, type_duyet_chuyen_tiep, type_nhan_chuyen_tiep, type_tb_mail=0, 
//     // }

//     //data_name_nhan=>name_cty_nhan
//    // data_nhan => id_user_nhan
//    //ngay_co_hieu_luc => ngay ban hanh

//    //check ng nhan

//    //upload file
//     let fieldsCheck = [ten_vanban, trich_yeu, so_vanban, noidung_vanban, ten_so_vanban, thoi_gian_ban_hanh, nhom_van_ban, data_nhan,
//       xet_duyet_van_ban
//     ]

//     for(let i=0; i<fieldsCheck.length; i++){
//       if(!fieldsCheck[i]) {
//         return functions.setError(res, `Missing input ${i+1}`, 404);
//       }
//     }

//     let file = req.files.file_vb;
//     let file_vb_name='';
//     if(file) {
//       for(let i=0; i<file.length; i++){
//         let checkFile = await functions.checkFile(file[i].path);
//         let fileNameOrigin = file[i].name;

//         if(!checkFile){
//           return functions.setError(res, `File{fileNameOrigin khong dung dinh dang hoac qua kich cho phep!`, 405);
//         }
//         let fileName = await vanThuService.uploadFileNameRandom('file_van_ban', file[i]);
//         file_vb_name += fileName;
//       }
//     }
//     let phieu_trinh = req.files.phieu_trinh;
//     if(phieu_trinh) {
//       let checkFile = await functions.checkFile(phieu_trinh.path);
//       let fileNameOrigin = phieu_trinh.name;

//       if(!checkFile){
//         return functions.setError(res, `File{fileNameOrigin khong dung dinh dang hoac qua kich cho phep!`, 405);
//       }
//       phieu_trinh = await vanThuService.uploadFileNameRandom('file_van_ban', phieu_trinh);
//     }
//     let {id_cong_ty, tk_mail_nhan, noidung_guimail, type_usn, id_user_nhan, name_cty_nhan
//     type_tb_mail}
//     //tao
//     //check role
//     if (type_usn == 2) {
//         type_user = 1;
//     } else {
//         type_user = 2;
//     }
//     type_sent = 3;
//     let = com_user = us_com_id;
//     let fields = {
//       title_vb: ten_vanban, 
//       des_vb: trich_yeu, 
//       so_vb: so_vanban, 
//       nd_vb: noidung_vanban, 
//       book_vb: nam_vb,
//       time_ban_hanh: thoi_gian_ban_hanh, 
//       time_hieu_luc: thoi_gian_ban_hanh, 
//       nhom_vb: nhom_van_ban, 
//       user_send: ,
//       com_user: ,
//       name_user_send: , 
//       user_cty: , 
//       mail_cty: mail_congty, 
//       name_com: , 
//       user_nhan: , 
//       file_vb: , 
//       type_xet_duyet: loai_xet_duyet, 
//       thoi_gian_duyet: thoi_gian_duyet, 
//       nguoi_xet_duyet: data_nguoi_duyet, 
//       nguoi_theo_doi: nguoi_theo_doi, 
//       type_khan_cap: type_khan_cap, 
//       type_bao_mat: type_bao_mat, 
//       type_tai: type_tai, 
//       type_duyet_chuyen_tiep: type_duyet_chuyen_tiep, 
//       type_nhan_chuyen_tiep : type_nhan_chuyen_tiep,
//       created_date: Date.now(),
//       type_duyet: type_duyet,
//       trang_thai_vb: trang_thai_vb,
//       duyet_vb: xet_duyet_van_ban,
//       ghi_chu: ghi_chu,
//       so_van_ban: so_van_ban,
//       phieu_trinh: phieu_trinh,
//       gui_ngoai_cty
//     }

//     //gui chat
    
//     // const data = {
//     //   SenderId: ac,
//     //   ReceiveId: JSON.stringify(ListReceive),
//     //   CompanyId: com_user,
//     //   Type: type_sent,
//     //   InfoFile: JSON.stringify(InfoFile),
//     //   NameFile: JSON.stringify(NameFile),
//     //   Status: loai_van_ban,
//     //   Title: ten_vanban,
//     //   Link: link
//     // };

//     // await vanThuService.sendChat(link, data);


//   }catch(err){
//     console.log("Err from server!", err);
//     return functions.setError(res, err, 500);
//   }
// }