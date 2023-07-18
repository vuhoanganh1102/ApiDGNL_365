const Users = require('../../../models/Users');
const VanBan = require('../../../models/Vanthu365/van_ban');
const functions = require("../../../services/functions");
const vanThuService = require("../../../services/vanthu");
const ThayThe = require("../../../models/Vanthu365/tbl_thay_the");
const ThongBao = require("../../../models/Vanthu365/tl_thong_bao");
const UserVT = require("../../../models/Vanthu365/user_model");
const NhomVanBan = require('../../../models/Vanthu/group_van_ban');
const QuanLyCongVan = require('../../../models/Vanthu365/tbl_qly_congvan');
const FeedBack = require('../../../models/Vanthu365/tbl_feedback');

const folder = 'file_van_ban';
//----------------------------------------VAN BAN DI---------------------------------------------------

let checkBanHanh = async(type, comId, empId, type_ban_hanh)=>{
  try{
    let banHanh = false;
    if(type==1) banHanh = true;
    else {
      let user_model = await UserVT.findOne({id_user: comId});
      if(!user_model) return false;
      let data_banhanh;
      if(type_ban_hanh == 1) {
        data_banhanh = user_model.type_cong_ty;
      }else if(type_ban_hanh == 2) {
        data_banhanh = user_model.type_ngoai;
      }
      if(data_banhanh.includes(empId)) banHanh = true;
    }
    return banHanh;
  }catch(err){
    console.log(err);
  }
}

exports.getDataAndCheck = async(req, res, next) => {
  try{
    let {ten_vanban, so_vanban, trich_yeu, noidung_vanban, nam_vb, ten_so_vanban, nhom_van_ban, thoi_gian_ban_hanh,
      nguoi_theo_doi, ghi_chu, 
      xet_duyet_van_ban, loai_xet_duyet,  thoi_gian_duyet, data_nguoi_duyet,
      type_khan_cap, type_bao_mat, type_tai, type_duyet_chuyen_tiep, type_nhan_chuyen_tiep 
    } = req.body;

    let fieldsCheck = [ten_vanban, so_vanban, trich_yeu, nam_vb, ten_so_vanban, xet_duyet_van_ban, nhom_van_ban, thoi_gian_ban_hanh];
    for(let i=0; i<fieldsCheck.length; i++){
      if(!fieldsCheck[i]) {
        return functions.setError(res, `Missing input ${i+1}!`, 404);
      }
    }
    thoi_gian_ban_hanh = vanThuService.convertTimestamp(thoi_gian_ban_hanh);
    created_date = vanThuService.convertTimestamp(Date.now());

    let type_xet_duyet = '';
    let nguoi_xet_duyet = '';
    let type_duyet = 1;
    let trang_thai_vb = 6;

    if(xet_duyet_van_ban == 2) {
      if(!loai_xet_duyet || !thoi_gian_duyet || !data_nguoi_duyet) {
        return functions.setError(res, "Missing input xet duyet van ban!", 406);
      }
      thoi_gian_duyet = thoi_gian_duyet;
      type_xet_duyet = loai_xet_duyet;
      nguoi_xet_duyet = data_nguoi_duyet.join(", ");
      type_duyet = 0;
      trang_thai_vb = 0;
    }else {
      thoi_gian_duyet = '';
    }


    let file = req.files.file_vb;
    let file_vb_name='';
    let NameFile = '';
    let InfoFile = '';
    let date = new Date(Date.now());
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    if(file) {
      for(let i=0; i<file.length; i++){
        let checkFile = await functions.checkFile(file[i].path);
        let fileNameOrigin = file[i].name;

        if(!checkFile){
          return functions.setError(res, `File ${fileNameOrigin} khong dung dinh dang hoac qua kich cho phep!`, 405);
        }
        let fileName = await vanThuService.uploadFileNameRandom(folder, file[i]);
        if(fileName) {
          file_vb_name += fileName;
        }

        const filePath = `https://vanthu.timviec365.vn/uploads/file_van_ban/${y}/${m}/${d}/${fileName}`;
        if(NameFile==''){
          NameFile += `'${file[i].originalFilename.replace(/,/g, '')}'`;
          InfoFile += `'${filePath.replace(/,/g, '')}'`;
        }else {
          NameFile += `,'${file[i].originalFilename.replace(/,/g, '')}'`;
          InfoFile += `,'${filePath.replace(/,/g, '')}'`;
        }
      }
    }
    req.NameFile = NameFile;
    req.InfoFile = InfoFile;
    let id = req.id;
    let comId = req.comId;
    let userName = req.userName;
    req.fields = {
      title_vb: ten_vanban, 
      so_vb: so_vanban, 
      des_vb: trich_yeu, 
      nd_vb: noidung_vanban, //but phe
      book_vb: nam_vb,
      time_ban_hanh: thoi_gian_ban_hanh, 
      time_hieu_luc: thoi_gian_ban_hanh, 
      nhom_vb: nhom_van_ban, 
      user_send: id,
      com_user: comId,
      name_user_send: userName, 
      file_vb: file_vb_name, 
      type_xet_duyet: type_xet_duyet, 
      thoi_gian_duyet: thoi_gian_duyet, 
      nguoi_xet_duyet: nguoi_xet_duyet, 
      nguoi_theo_doi: nguoi_theo_doi, 
      type_khan_cap: type_khan_cap, 
      type_bao_mat: type_bao_mat, 
      type_tai: type_tai, 
      type_duyet_chuyen_tiep: type_duyet_chuyen_tiep, 
      type_nhan_chuyen_tiep : type_nhan_chuyen_tiep,
      created_date: created_date,
      type_duyet: type_duyet,
      trang_thai_vb: trang_thai_vb,
      duyet_vb: xet_duyet_van_ban,
      ghi_chu: ghi_chu,
      so_van_ban: ten_so_vanban,
    }
    return next();
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.createVanBanOut = async(req, res, next) => {
  try{
    //user_send,com_user,name_user_send => lay tu token

    //user_cty, mail_cty, name_com, user_nhan, gui_ngoai_cty => cac truong thay doi so voi van ban trong cong ty
    let fields = req.fields;
    let {id_cong_ty, mail_congty, id_user_nhan, tk_mail_nhan, noidung_guimail, type_usn, name_cty_nhan} = req.body;

    if(!id_cong_ty || !mail_congty || !name_cty_nhan) {
      return functions.setError(res, "Missing input value!", 407);
    }
    if(!id_user_nhan){
      return functions.setError(res, "Vui lòng chọn tài khoản người nhận!", 408);
    }
    if(fields.duyet_vb != 2) {
      if(!await checkBanHanh(req.type, req.comId, req.id, 2)) {
        return functions.setError(res, "Tai khoan chua duoc phan quyen de ban hanh ngoai cong ty!", 409);
      }
    }
    id_user_nhan = id_user_nhan.join(", ");
    fields = {...fields, 
      user_cty: id_cong_ty, 
      mail_cty: mail_congty,
      name_com: name_cty_nhan, //mang
      user_nhan: id_user_nhan, //mang
      gui_ngoai_cty: 1,
    }

    let maxIdVB = await vanThuService.getMaxId(VanBan);
    fields._id = maxIdVB;
    let vanBan = new VanBan(fields);
    vanBan = await vanBan.save();
    if(!vanBan) {
      return functions.setError(res, "Create van ban fail!", 504);
    }

    //
    let type_user = '';
    let type_sent = '';
    if(req.role == 2){
      if(type_usn == 2) type_user = 1;
      else type_user = 2;
      type_sent = 3;
    }else {
      if(type_usn == 2) type_user = 3;
      else type_user = 4;
      type_sent = 1;
    }

    let Status = 2;
    let ListReceive = id_user_nhan;// mang
    if(fields.xet_duyet_van_ban == 2){
      Status = 1;
      ListReceive = fields.nguoi_xet_duyet;
    } 

    const link = `https://vanthu.timviec365.vn/chi-tiet-vb/${vanThuService.replaceTitle(fields.title_vb)}-vb${maxIdVB}.html`;
    //gui thong bao qua chat
    let dataSend = {
      EmployeeId: req.id,
      ListReceive: `[${ListReceive}]`,
      CompanyId: req.comId,
      ListFollower: `[${fields.nguoi_theo_doi}]`,
      Status: Status,
      Message: fields.nhom_vb,
      Type: type_user,
      Title: fields.title_vb,
      Link: link,
      SenderId: req.id
    }
    // gui email
    let dataSendChat = await functions.getDataAxios(vanThuService.arrAPI().NotificationReport, dataSend);
    //gui file qua chat
    dataSend = {
      SenderId: req.id,
      ReceiveId: `[${ListReceive}]`,
      CompanyId: req.comId,
      Type: type_sent,
      InfoFile: req.InfoFile,
      NameFile: req.NameFile,
      Status: fields.nhom_vb,
      Title: fields.title_vb,
      Link: link
    }
    dataSendChat = await functions.getDataAxios(vanThuService.arrAPI().SendContractFile, dataSend);

    let maxIdThongBao = await vanThuService.getMaxId(ThongBao);
    let fieldsThongBao = {_id: maxIdThongBao, id_user: fields.user_send, id_user_nhan: id_user_nhan, type: 1, view: 0, created_date: fields.created_date, id_van_ban: maxIdVB};
    if(noidung_guimail == ''){
      if(id_user_nhan == 0){
        return functions.setError(res, "Email not found!", 406);
      }
      fieldsThongBao.id_user_nhan = tk_mail_nhan;
      delete fieldsThongBao.view;
    }
    //them thong bao
    let thongBao = new ThongBao(fieldsThongBao);
    thongBao = await thongBao.save();
    if(!thongBao) {
      return functions.setError(res, "Insert data into tbl thong bao fail!", 505);
    }
    return functions.success(res, "Create van ban gui di ngoai cong ty thanh cong!");
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.createVanBanIn = async(req, res, next) => {
  try{
    let fields = req.fields;
    let {vb_th, type_nhieu_nguoi_ky, nguoi_ky, chuc_vu_nguoi_ky, id_uv_nhan} = req.body;
    let comId = req.comId;
    let id_user_send = req.id;
    let user_cty = '';
    let com_user = comId;
    let type_thu_hoi = 0, so_vb_th;

    if(!vb_th || !type_nhieu_nguoi_ky || !nguoi_ky || !chuc_vu_nguoi_ky || !id_uv_nhan) {
      return functions.setError(res, "Missing input value", 408);
    }
    if(fields.duyet_vb != 2) {
      if(!await checkBanHanh(req.type, req.comId, req.id, 1)) {
        return functions.setError(res, "Tai khoan chua duoc phan quyen de ban hanh ngoai cong ty!", 409);
      }
    }

    let vanBan = await VanBan.findOne({_id: vb_th}, {_id: 1, so_vb: 1});
    if(vanBan){
      so_vb_th = vanBan._id;
      type_thu_hoi = 1;
    }

    let list_duyet = await UserVT.findOne({id_user: comId}, {duyet_pb: 1, type_cong_ty: 1});
    // let data_banhanh = '';
    // if(list_duyet) {
    //   data_banhanh = list_duyet.type_cong_ty;
    // }

    // if(id_uv_nhan==0) {
    //   user_cty = req.comId;
    //   if(!data_banhanh.includes(String(id_user_send)) && !req.comRoleId) {
    //     return functions.setError(res, "Bạn chưa được cấp quyền ban hành cho toàn bộ công ty!", 404);
    //   }
    // }
    id_uv_nhan = id_uv_nhan.join(", ");

    if(type_nhieu_nguoi_ky=='on'){
      nguoi_ky = nguoi_ky.join(", ");
    }
    let phieu_trinh = req.files.phieu_trinh;
    let fileName = '';
    if(phieu_trinh) {
      let checkFile = await functions.checkFile(phieu_trinh.path);
      if(!checkFile){
        return functions.setError(res, `File khong dung dinh dang hoac qua kich cho phep!`, 411);
      }
      fileName = await vanThuService.uploadFileNameRandom('file_van_ban', phieu_trinh);
    }

    fields = {...fields, 
      user_nhan: id_uv_nhan,
      user_cty: user_cty,
      type_thu_hoi: type_thu_hoi,
      phieu_trinh: fileName,
      nguoi_ky: nguoi_ky,
      chuc_vu_nguoi_ky: chuc_vu_nguoi_ky,
    }
    let maxIdVB = await vanThuService.getMaxId(VanBan);
    fields._id = maxIdVB;
    vanBan = new VanBan(fields);
    vanBan = await vanBan.save();
    if(!vanBan) {
      return functions.setError(res, "Create van ban fail!", 504);
    }

    if(type_thu_hoi==1){
      await VanBan.deleteOne({_id: so_vb_th});
    }

    // thay the van ban
    let {type_thay_the, so_vb_tt, ten_vb_tt, trich_yeu_tt,} = req.body;
    if(type_thay_the==1){
      if(!so_vb_tt || !ten_vb_tt || !trich_yeu_tt){
        return functions.setError(res, "Missing input van ban thay the!", 405);
      }
      let maxIdThayThe = await vanThuService.getMaxId(ThayThe);
      let fieldsThayThe = {_id: maxIdThayThe, id_vb_tt: maxIdVB,so_vb_tt, ten_vb_tt, trich_yeu_tt, create_time: fields.created_date};
      
      let thayThe = new ThayThe(fieldsThayThe);
      thayThe = thayThe.save();
      if(!thayThe) {
        return functions.setError(res, "Insert data into tbl thay the fail!", 505);
      }
    }

    //thong bao
    let maxIdThongBao = await vanThuService.getMaxId(ThongBao);
    let fieldsThongBao = {_id: maxIdThongBao, id_user: fields.user_send, id_user_nhan: id_uv_nhan, type: 1, view: 0, created_date: fields.created_date, id_van_ban: maxIdVB};
    //them thong bao
    let thongBao = new ThongBao(fieldsThongBao);
    thongBao = await thongBao.save();
    if(!thongBao) {
      return functions.setError(res, "Insert data into tbl thong bao fail!", 505);
    }
    let type_user = '';
    let type_sent = '';
    if(req.type == 2){
      type_user = 1;
      type_sent = 3;
    }else {
      type_user = 3;
      type_sent = 1;
    }

    let Status = 2;
    let ListReceive = fields.user_nhan;// mang
    if(fields.xet_duyet_van_ban == 2){
      Status = 1;
      ListReceive = fields.nguoi_xet_duyet;
    } 

    const link = `https://vanthu.timviec365.vn/chi-tiet-vb/${vanThuService.replaceTitle(fields.title_vb)}-vb${maxIdVB}.html`;
    //gui thong bao qua chat
    let dataSend = {
      EmployeeId: req.id,
      ListReceive: `[${ListReceive}]`,
      CompanyId: req.comId,
      ListFollower: `[${fields.nguoi_theo_doi}]`,
      Status: Status,
      Message: fields.nhom_vb,
      Type: type_user,
      Title: fields.title_vb,
      SenderId: req.id,
      Link: link
    }
    let dataSendchat = await functions.getDataAxios(vanThuService.arrAPI().NotificationReport, dataSend);
    //gui file qua chat
    
    dataSend = {
      SenderId: req.id,
      ReceiveId: `[${ListReceive}]`,
      CompanyId: req.comId,
      Type: type_sent,
      InfoFile: req.InfoFile,
      NameFile: req.NameFile,
      Status: fields.nhom_vb,
      Title: fields.title_vb,
      Link: link
    }
    dataSendchat = await functions.getDataAxios(vanThuService.arrAPI().SendContractFile, dataSend);
    return functions.success(res, "Create van ban gui di trong cong ty thanh cong!");
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.getListVanBanDiDaGui = async(req, res, next) => {
  try{
    let {id_vb, ten_vb_search, trang_thai_search, fromDate, toDate, page, pageSize} = req.body;
    page = Number(page);
    pageSize = Number(pageSize);
    if(!page || !pageSize) {
      return functions.setError(res, "Missing input page or pageSize!", 404);
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    if(fromDate) fromDate = fromDate? vanThuService.convertTimestamp(fromDate): null;
    if(toDate) toDate = toDate? vanThuService.convertTimestamp(toDate): null;

    let id = req.id;
    let condition = {user_send: id};
    if(id_vb) condition._id = Number(id_vb);
    if(ten_vb_search) condition.title_vb = new RegExp(ten_vb_search, 'i');
    if(trang_thai_search) condition.trang_thai_vb = Number(trang_thai_search);
    if(fromDate && !toDate) condition.created_date = {$gte: fromDate};
    if(toDate && !fromDate) condition.created_date = {$lte: toDate};
    if(fromDate && toDate) condition.created_date = {$gte: fromDate, $lte: toDate}

    let listVanBanDi = await VanBan.aggregate([
        {$match: condition},
        {
            $lookup: {
            from: "vanthu_group_van_bans",
            localField: "nhom_vb",
            foreignField: "id_group_vb",
            as: "matchedDocuments"
            }
        },
        // {
        //     $unwind: "$matchedDocuments"
        // },
        // {
        //     $replaceRoot: {
        //     newRoot: {
        //         $mergeObjects: ["$$ROOT", "$matchedDocuments"]
        //     }
        //     }
        // },
        {$sort: {_id: 1}},
        {$skip: skip},
        {$limit: limit}
        ]);
    let totalCount = await VanBan.aggregate([
        {$match: condition},
        {
            $lookup: {
            from: "vanthu_group_van_bans",
            localField: "nhom_vb",
            foreignField: "id_group_vb",
            as: "matchedDocuments"
            }
        },
        {
          $group: {_id: null, count: { $sum: 1 }}
        },
        {
          $project: {_id: 0, count: 1}
        }
        ]);
    if(listVanBanDi && listVanBanDi.length>0) {
      for(let i=0; i<listVanBanDi.length; i++) {
        let link = vanThuService.getLinkFile(folder, listVanBanDi[i].created_date, listVanBanDi[i].file_vb);
        listVanBanDi[i].linkFile = link;
      }
    }
    totalCount = totalCount.length > 0 ? totalCount[0].count : 0;
    return functions.success(res, "Get list van ban gui di success!", {totalCount, listVanBanDi});
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.getDetailVanBan = async(req, res, next) => {
  try{
    let id_vb = req.body.id_vb;
    let id = req.id;
    if(!id_vb) {
      return functions.setError(res, "Missing input value!", 404);
    }
    let vanBan = await VanBan.findOne({_id: id_vb}).lean();
    if(!vanBan) {
      return functions.setError(res, "Khong tin tai van ban!", 405);
    }
    //check luu van ban
    let checkLuuQLCV = await QuanLyCongVan.findOne({cv_id_vb: id_vb});
    let checkLuu = false;
    if(checkLuuQLCV) {
      checkLuu = true;
    }
    vanBan.check_qlcv = checkLuu;

    //lay ra phan hoi
    let feedBack = await FeedBack.findOne({vb_fb: id_vb}).lean();
    vanBan.feedBack = feedBack;

    //lay ra thong tin van ban thay the
    let thayThe;
    if(vanBan.type_thay_the==1) {
      thayThe = await ThayThe.findOne({id_vb_tt: id_vb}).lean();
    }
    vanBan.thayThe = thayThe;

    //neu la van ban den se chuyen du lieu da xem hay chua
    let checkThongBao = await ThongBao.findOneAndUpdate({id_user_nhan: req.id, id_van_ban: id_vb, view: 0, type: 1}, {view: 1}, {new: true});
    
    return functions.success(res, "Get detail van ban success!", {vanBan: vanBan});
  }catch(err) {
    console.log(err);
    return functions.setError(res, err, 500);
  }
}

exports.createChuyenTiep = async(req, res, next)=> {
  try{
    let {ten_nguoi_nhan, id_vb} = req.body;
    if(!ten_nguoi_nhan || !id_vb) {
      return functions.setError(res, "Missing input value!", 404);
    }

    ten_nguoi_nhan = ten_nguoi_nhan.join(",");
    let user_nhan = ten_nguoi_nhan;
    let vanBan = await VanBan.findOne({_id: id_vb});
    if(!vanBan) {
      return functions.setError(res, "Van ban not found!", 504);
    }
    if(vanBan.user_forward !='') user_nhan = `${vanBan.user_forward},${ten_nguoi_nhan}`;

    vanBan = await VanBan.findOneAndUpdate({_id: id_vb}, {user_forward: user_nhan, update_time: vanThuService.convertTimestamp(Date.now())}, {new: true});
    if(!vanBan) {
      return functions.setError(res, "Chuyen tiep van ban that bai!", 505);
    }
    return functions.success(res, "Chuyen tiep van ban thanh cong!");
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.deleteVanBan = async(req, res, next)=> {
  try{
    let id_vb = req.body.id_vb;
    if(!id_vb || id_vb==0){
      return functions.setError(res, "Missing input id_vb!", 404);
    }
    let vanBan = await VanBan.deleteOne({_id: id_vb});
    if(vanBan && vanBan.deletedCount==1) {
      return functions.success(res, "Delete van ban success!");
    }
    return functions.setError(res, "Van ban not found!", 504);
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.checkLuuQLCV = async(req, res, next)=> {
  try{
    let id_vb = req.body.id_vb;
    if(!id_vb || id_vb==0) {
      return functions.setError(res, "Missing input id_vb!", 404);
    }
    let checkLuuQLCV = await QuanLyCongVan.findOne({cv_id_vb: id_vb});
    let checkLuu = false;
    if(checkLuuQLCV) {
      checkLuu = true;
    }
    return functions.success(res, "Check luu van ban noi bo cong ty!", {checkLuu: checkLuu})

  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.luuVBCTY = async(req, res, next) => {
  try{
    let {id_vb, book_vb, so_vb} = req.body;
    if(!id_vb || !book_vb || !so_vb) {
      return functions.setError(res, "Missing input value!", 404);
    }
    let type=2;
    let congVan = await QuanLyCongVan.findOne({cv_id_vb: id_vb});
    if(congVan) {
      return functions.setError(res, "Cong van da duoc luu!", 405);
    }
    let vanBan = await VanBan.findOne({_id: id_vb});
    if(!vanBan) {
      return functions.setError(res, "Van ban khong tim thay!", 406);
    }
    let kieu='', type_hd=0, status_hd=0, type_soan, phong_soan, user_soan, nhan_noibo, chuyen_noibo;

    if(vanBan.type_khan_cap==1) kieu=1;
    if(vanBan.type_bao_mat==1) kieu=2;

    if(vanBan.nhom_vb==17){
      type_hd = 1;
      status_hd = 1;
      if(vanBan.trang_thai_vb==6) status_hd = 2;
    }
    type_soan = 1;
    phong_soan = "";
    user_soan = vanBan.user_send;
    let soan_ngoai="", name_soan = "", nhan_ngoai = "", chuyen_ngoai = "";
    let type_nhan = 1, type_chuyenden=1;
    chuyen_noibo = vanBan.user_nhan;
    if(vanBan.gui_ngoai_cty==1) {
      type_nhan = type_chuyenden = 2;
      nhan_noibo = chuyen_noibo = "";
      nhan_ngoai = chuyen_ngoai = vanBan.mail_cty? vanBan.mail_cty: vanBan.name_com;
    }
    let maxIdQLCV = await vanThuService.getMaxId(QuanLyCongVan);
    congVan = new QuanLyCongVan({
      _id: maxIdQLCV,
      cv_id_vb: vanBan._id,
      cv_id_book: book_vb, 
      cv_name: vanBan.title_vb, 
      cv_kieu: kieu, 
      cv_so: so_vb, 
      cv_type_soan: type_soan, 
      cv_soan_ngoai: soan_ngoai, 
      cv_phong_soan: phong_soan, 
      cv_user_soan: user_soan, 
      cv_name_soan: name_soan, 
      cv_date: vanBan.created_date, 
      cv_user_save: vanBan.user_nhan, 
      cv_user_ky: vanBan.nguoi_ky, 
      cv_type_nhan: type_nhan, 
      cv_nhan_noibo: nhan_noibo, 
      cv_nhan_ngoai: nhan_ngoai, 
      cv_type_chuyenden: type_chuyenden, 
      cv_chuyen_noibo: chuyen_noibo, 
      cv_chuyen_ngoai: chuyen_ngoai, 
      cv_trich_yeu: vanBan.des_vb, 
      cv_ghi_chu: vanBan.nd_vb, 
      cv_file: vanBan.file_vb, 
      cv_type_loai: type, 
      cv_type_hd: type_hd,
      cv_status_hd: status_hd,
      cv_usc_id: vanBan.usc_id, 
      cv_time_created: vanBan.created_date
    })
    congVan = await congVan.save();
    if(!congVan) {
      return functions.setError(res, "Luu cong van fail!", 506);
    }
    return functions.success(res, "Luu cong van thanh cong!");
  }catch(err) {
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.setTrangThaiVanBan = async(req, res, next) => {
  try{
    let {id_vb, trang_thai_vb} = req.body;
    if(!id_vb || !trang_thai_vb) {
      return functions.setError(res, "Missing input value!", 404);
    }
    let vanBan = await VanBan.findOneAndUpdate({_id: id_vb}, {trang_thai_vb: trang_thai_vb}, {new: true});
    if(!vanBan) {
      return functions.setError(res, "Khong ton tai van ban!", 504);
    }
    return functions.success(res, "Cap nhat trang thai thanh cong!");
  }catch(err) {
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.checkQuyenBanHanh = async(req, res, next) => {
  try{
    let type = req.body.type;
    if(type!=1 && type!=2) {
      return functions.setError(res, "Truyen type=1 or type=2!", 404);
    }
    let banHanh;
    if(type==1) {
      banHanh = await checkBanHanh(req.type, req.comId, req.id, 1);
      return functions.success(res, "Check ban hanh noi bo cong ty", {banHanh: banHanh});
    }
    banHanh = await checkBanHanh(req.type, req.comId, req.id, 2);
    return functions.success(res, "Check ban hanh ngoai", {banHanh: banHanh});
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}

exports.getUserByEmail = async(req, res, next) => {
  try{
    let {type, email} = req.body;
    if(!type || !email) {
      return functions.setError(res, "Missing input type or email!", 404);
    }
    let user = await Users.findOne({email: email, type: type}, {_id: 1, idQLC: 1, userName: 1, email: 1});
    if(!user) {
      return functions.setError(res, "User khong ton tai!", 405);
    }
    return functions.success(res, "Get user by email success!", {user: user});
  }catch(err){
    console.log("Error from server!", err);
    return functions.setError(res, err, 500);
  }
}