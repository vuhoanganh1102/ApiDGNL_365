const CateDeXuat = require("../../../models/Vanthu/cate_de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");
const DeXuat = require('../../../models/Vanthu/de_xuat')
const HideCateDX = require('../../../models/Vanthu/hide_cate_dx')
const UserDX = require("../../../models/Users")
const fnc = require('../../../services/qlc/functions')
const serviceVanthu = require('../../../services/vanthu')
const HistoryHandling = require('../../../models/Vanthu/history_handling_dx')

//Api hiển thị chi tiết đề xuất 

exports.ChitietDx = async (req, res) => {
  try {
    let {_id} = req.body;
    let currentTime = new Date();
    if(req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id
    }else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let dexuat = await DeXuat.findOne({ _id : _id, com_id : com_id});
    if (!dexuat) {
      return functions.setError(res, 'Không tìm thấy bản ghi dexuat', 400);
    } else {
      let checkhandling = await HistoryHandling.find({id_dx : _id ,id_user : dexuat.id_user,type_handling : 1})
      const checkuserduyet = dexuat.id_user_duyet.split(',').map(Number);
      // Tìm bản ghi trong bảng User dựa trên checkuserduyet
      const users = await UserDX.find({ idQLC: { $in: checkuserduyet } });
      // Tìm bản ghi trong bảng UserDX dựa trên id_nguoi_theo_doi
      const checkusertheodoi = dexuat.id_user_theo_doi.split(',').map(Number); 
      const usertd = await UserDX.find({ idQLC: { $in: checkusertheodoi }  });
      // Tiếp tục xử lý và trả về kết quả
      const namnUserDuyet = users.map(user => ({ 
        userName: user.userName, 
        avatarUser: user.avatarUser,
        idQLC : user?.idQLC 
      }));
      const namnUsertd = usertd.map(user => ({ 
        userName: user.userName,
        avatarUser: user.avatarUser,
        idQLC : user?.idQLC 
      }));
      let avatar = [];
      if (dexuat) {
        for (let i = 0; i < dexuat.file_kem.length; i++) {
          const fileLink = await serviceVanthu.createLinkFileVanthu(dexuat.id_user, dexuat.file_kem[i].file);
          if (fileLink) {
            avatar.push({ file: fileLink });
          }
        }
      }
      if (namnUserDuyet && namnUserDuyet[0] && namnUserDuyet[0].idQLC) {
         avatar = await fnc.createLinkFileEmpQLC(namnUserDuyet[0].idQLC, namnUserDuyet[0].avatarUser);
        if (avatar) {
          namnUserDuyet[0].avatarUser = avatar;
        }
      }
      
      if (namnUsertd && namnUsertd[0] && namnUsertd[0].idQLC) {
         avatar = await fnc.createLinkFileEmpQLC(namnUsertd[0].idQLC, namnUsertd[0].avatarUser);
        if (avatar) {
          namnUsertd[0].avatarUser = avatar;
        }
      }
      let timeCreateInMillis = dexuat.time_create * 1000;
      let timeDifferenceInMillis = currentTime.getTime() - timeCreateInMillis;
      let numberOfDays = Math.floor(timeDifferenceInMillis / (1000 * 60 * 60 * 24));
      let detailDeXuat = [
        {
      ten_de_xuat : dexuat.name_dx,
      nguoi_tao : dexuat.name_user,
      nhom_de_xuat : dexuat.type_dx,
      thoi_gian_tao : dexuat.time_create * 1000,
      loai_de_xuat : dexuat.type_time,
      cap_nhat : numberOfDays,
      thong_tin_chung : dexuat.noi_dung,
      kieu_phe_duyet : dexuat.kieu_duyet,
      lanh_dao_duyet :namnUserDuyet,
      nguoi_theo_doi :namnUsertd,
      file_kem : avatar,
      thoi_gian_tao : dexuat.time_create * 1000,
      thoi_gian_duyet : dexuat.time_duyet,
      thoi_gian_tiep_nhan : checkhandling.time ,
        }
      ]
      return functions.success(res, 'get data success', { detailDeXuat });
    }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};



// Api hiển thị trang home tà khoản công ty và cá nhân

exports.showHome = async (req, res) => {
  try {
    const { page } = req.body;
    const perPage = 6; // Số lượng giá trị hiển thị trên mỗi trang
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    let com_id = '';
    let id_user = '';
    let dxChoDuyet = '';
    let totaldx = '';
    let dxCanduyet = '';
    let dxduyet = '';
    if (req.user.data.type == 1) {
      com_id = req.user.data.com_id
      totaldx = await DeXuat.countDocuments({ 
        com_id, del_type: 1 
      }); // đếm tổng số đề xuất
      dxChoDuyet = await DeXuat.countDocuments({ 
        com_id,
        del_type: 1, 
        type_duyet: 7
       }) //đếm tổng số đề xuất chờ duyệt
      dxCanduyet = await DeXuat.countDocuments({
         com_id,
         del_type: 1, 
         type_time: 2, 
         type_duyet: 0 
        }) // đếm số đề xuất cần duyệt
      dxduyet = await DeXuat.countDocuments({ 
        com_id,
        com_id, 
        del_type: 1,
        type_duyet: 5 
        }) // đếm tổng số dề xuất đã được duyệt
      let showCT = await DeXuat.find({ com_id,del_type: 1})
      .sort({ _id: -1 })
      .skip(startIndex).
      limit(perPage);
      // hiển thị trang home công ty
      return functions.success(res, 'get data success', {totaldx, dxChoDuyet, dxCanduyet, dxduyet, data: showCT });
    } else if (req.user.data.type == 2) {
      id_user = req.user.data.com_id
      totaldx = await DeXuat.countDocuments({ 
        id_user, 
        del_type: 1 
      }); // đếm tổng số đề xuất
      dxChoDuyet = await DeXuat.countDocuments({
        id_user : id_user, 
        del_type: 1, 
        type_duyet: 7 
      }) //đếm tổng số đề xuất chờ duyệt
      dxCanduyet = await DeXuat.countDocuments({
        id_user_duyet : id_user, 
        del_type: 1, 
        type_time: 2, 
        type_duyet: 0 
      }) // đếm số đề xuất cần duyệt
      dxduyet = await DeXuat.countDocuments({ 
        id_user : id_user, 
        del_type: 1, 
        type_duyet: 5 
      })// đếm tổng số dề xuất đã được duyệt
      let showNV = await DeXuat.find({ 
        id_user, del_type: 1 
      }).sort({ _id: -1 })
      .skip(startIndex)
      .limit(perPage);
      // hiển thị trang home nhân viên
      return functions.success(res, 'get data success', {totaldx, dxChoDuyet, dxCanduyet, dxduyet, data: showNV });
    }else{
      return functions.setError(message, 'Bạn ko có quyền',400);
    }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};


// Hiển thị trang show nghỉ  tìm kiếm
exports.showNghi = async (req, res) => {
  try {
    const { page, time_s, time_e, dep_id, emp_id, type_duyet } = req.body;
    let com_id = '';
    const perPage = 10;
    const skip = (page - 1) * perPage;
    if(req.user.data.type == 1) {
      com_id = req.user.data.com_id
    }else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const query = {
      del_type: 1,
      type_dx: { $in: [1, 18] },
      ...(time_s && time_e && { time_create: { $gte: time_s, $lte: time_e } })
    };

    if (time_s > time_e) {
      return res
        .status(400)
        .json({ error: "Thời gian bắt đầu không thể lớn hơn thời gian kết thúc." });
    }
    if (type_duyet) {
      query.type_duyet = type_duyet;
    }

    // Tìm các đề xuất liên quan dựa trên trường dep_id và emp_id từ bảng User
    const userQuery = {
      'inForPerson.employee.com_id': com_id,
      ...(dep_id && { 'inForPerson.employee.dep_id': dep_id }),
      ...(emp_id && { 'inForPerson.employee.emp_id': emp_id })
    };

    const users = await UserDX.find(userQuery);

    // Lấy danh sách các com_id từ các người dùng tìm được
    const comIds = users.map(user => user.inForPerson.employee.com_id);

    // Thêm trường com_id và type_dx vào query để tìm kiếm đề xuất
    query.com_id = { $in: comIds };

    const shownghi = await DeXuat.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();
    return functions.success(res, 'get data success', { shownghi});
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};



//Api thay đổi trạng thái thái ẩn hiện đề xuất
exports.changeCate = async (req, res) => {
  try {
    const {  id, value } = req.body;
     let com_id =  '';
     if(req.user.data.type == 1){
      com_id = req.user.data.com_id
      // Kiểm tra xem loại đề xuất đã được ẩn hay chưa
    const hideCate = await HideCateDX.findOne({ id_com: com_id });
    let hideCateStr = hideCate.id_cate_dx.toString();

    if (value == 1) {
      // Xóa ẩn loại đề xuất
      const idStr = id.toString();
      if (hideCateStr.includes(idStr)) {
        hideCateStr = hideCateStr.replace(',' + idStr, '');
        hideCate.id_cate_dx = hideCateStr;
        await hideCate.save();
        return functions.success(res, 'Hủy ẩn loại đề xuất thành công!');
      } else {
        return functions.success(res, 'Loại đề xuất này chưa được ẩn!');
      }
    } else {
      // Thêm ẩn loại đề xuất
      const idStr = id.toString();
      if (hideCateStr.includes(idStr)) {
        return functions.success(res,  'Loại đề xuất này đã được ẩn rồi!');
      } else {
        hideCateStr += ',' + idStr;
        hideCate.id_cate_dx = hideCateStr;
        await hideCate.save();
        return functions.success(res,  'Ẩn loại đề xuất thành công!');
      }
    }
     }else{
      return functions.setError(res, 'không có quyền truy cập', 400);
     }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};







// tìm theo tên loại đề xuất + hiển thị các loại đề xuất

exports.findNameCate = async (req, res) => {
  try {
    let { name_cate_dx, page,perPage } = req.body;
    
    let com_id ='';
    if(req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id
      perPage = parseInt(perPage) || 10;
      page = parseInt(page) || 1;

    const regex = new RegExp(name_cate_dx, 'i');

    const count = await CateDeXuat
      .countDocuments({ name_cate_dx: regex });
    const totalPages = Math.ceil(count / perPage); // Tổng số trang

    const result = await CateDeXuat
      .find({ name_cate_dx: regex, com_id: 0 })
      .skip((page - 1) * perPage)
      .limit(perPage);
      const checkhide = await HideCateDX.findOne({ id_com : com_id }).select('id_cate_dx');
      if (checkhide) {
        const idHideCateDX = checkhide.id_cate_dx.split(',').map(Number);
        return functions.success(res, 'get data success', { result,idHideCateDX, currentPage: page, totalPages, });
      } else {
        return functions.success(res, 'get data success', { result,idHideCateDX : [], currentPage: page, totalPages, });
      }
    }else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};



//Api hiển thị thành viên công ty

exports.findthanhVien = async (req, res) => {
  try {
    let { page } = req.body
    let com_id = '';
    const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
    const startIndex = (page - 1) * perPage;
    if(req.user.data.type == 1) {
      com_id = req.user.data.com_id
      const checkTV = await UserDX.find({ 'inForPerson.employee.com_id': com_id,type : 2 })
      .select('idQlC userName inForPerson.employee.position_id ')
      .sort({ 'inForPerson.employee.dep_id': -1 })
      .skip(startIndex).limit(perPage);
      return functions.success(res, 'get data success', { checkTV });
    }else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }  
  }  catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

//Api hiển thị đề xuất tạm ứng
exports.listtamung = async (req, res) => {
  try {
    let { page, id_user, time } = req.body;
    let com_id = '';
    page = parseInt(page) || 1;
    const perPage = 8;

    if (req.user.data.type == 1) {
      com_id = req.user.data.com_id;

      let matchQuery = {
        com_id: com_id,
        type_dx: 3,
      };

      if (id_user) {
        matchQuery.id_user = parseInt(id_user);
      }

      if (time) {
        matchQuery.time = new Date(time);
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;

      const listDeXuat = await DeXuat.find(matchQuery)
        .select('name_user noi_dung.tam_ung.sotien_tam_ung type_duyet id_user')
        .sort({_id : -1})
        .skip(startIndex)
        .limit(perPage);

      const totalTsCount = await DeXuat.countDocuments(matchQuery);

      const listUserId = listDeXuat.map(item => item.id_user);
      const listUser = await UserDX.find({ idQLC: { $in: listUserId } })
        .select('userName avatarUser idQLC');

      const data = {
        listDeXuat,
        listUser,
      };

      const totalPages = Math.ceil(totalTsCount / perPage);
      const hasNextPage = endIndex < totalTsCount;

      return functions.success(res, 'get data success', { data, totalPages, hasNextPage });
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
  }catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};

exports.showloaicate = async(req,res) => {
  try{
    let showcatedx = await CateDeXuat.find({com_id : 0})
    .select('id_cate_dx name_cate_dx')
    return functions.success(res, 'get data success', {showcatedx})
  } catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
}
