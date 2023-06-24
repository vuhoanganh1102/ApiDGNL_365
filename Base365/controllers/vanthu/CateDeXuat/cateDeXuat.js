const CateDeXuat = require("../../../models/Vanthu/cate_de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");
const DeXuat = require('../../../models/Vanthu/de_xuat')
const HideCateDX = require('../../../models/Vanthu/hide_cate_dx')
const UserDX = require("../../../models/Users")

//Hiển thị danh sách các loại đề xuất 

exports.showCateCom = async (req, res) => {
    try {
      const { page } = req.body;
      const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
  
      const startIndex = (page - 1) * perPage; 
      const endIndex = page * perPage; 
  
      const showCateCom = await CateDeXuat.find({ com_id: 0 }).skip(startIndex).limit(perPage);
      res.status(200).json(showCateCom);
    } catch (error) {
      console.error('Failed to get cate', error);
      res.status(500).json({ error: 'Failed to get cate' });
    }
  };



 //Api hiển thị chi tiết đề xuất 

 exports.ChitietDx= async (req, res) => {
    try {
      let {_id} = req.body
      let dexuat = await DeXuat.findOne({_id});
      if (!dexuat) {
        // Xử lý khi không tìm thấy bản ghi dexuat
        res.status(404).json({ message: 'Không tìm thấy bản ghi dexuat' });
      } else {
        let userduyet = await UserDX.findOne({idQLC: dexuat.id_user_duyet});
        console.log(userduyet);
        if (!userduyet) {
          // Xử lý khi không tìm thấy bản ghi userduyet
          res.status(404).json({ message: 'Không tìm thấy bản ghi userduyet' });
        } else {
          // Tiếp tục xử lý và trả về kết quả
          let usertd = await UserDX.findOne({idQLC: dexuat.id_user_theo_doi});
          if (!usertd) {
            // Xử lý khi không tìm thấy bản ghi usertd
            res.status(404).json({ message: 'Không tìm thấy bản ghi usertd' });
          } else {
            let namnUserDuyet = userduyet.userName;
            let namnUsertd = usertd.userName;
            let data = {dexuat, namnUserDuyet, namnUsertd};
            res.status(200).json(data);
          }
        }
      }
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Lỗi server' });
   }
 };
 



  // Api hiển thị trang home tài khoản công ty

exports.showHome = async (req, res) => {
    try {
      const { page } = req.body;
      const perPage = 6; // Số lượng giá trị hiển thị trên mỗi trang
      const startIndex = (page - 1) * perPage; 
      const endIndex = page * perPage;
      let com_id = req.user.data.inForPerson.employee.com_id
      let id_user = req.user.data.idQLC
      if(req.user.data.type == 2){
        const totaldx = await DeXuat.countDocuments({ com_id,del_type : 1 });
        const dxduyet = await DeXuat.countDocuments({com_id,del_type : 1,type_duyet : 0})
        let showCT  = await DeXuat.find({com_id}).sort({ _id: -1 }).skip(startIndex).limit(perPage);
        res.status(200).json({ totaldx,dxduyet, data: showCT });
      }if(req.user.data.type == 1) {
        const totaldx = await DeXuat.countDocuments({ id_user ,del_type : 1});
        const dxduyet = await DeXuat.countDocuments({id_user_duyet,del_type : 1,type_duyet : 0})
        let showNV  = await DeXuat.find({id_user,del_type : 1}).sort({ _id: -1 }).skip(startIndex).limit(perPage);
        res.status(200).json({ totaldx,dxduyet, data: showNV })
      } 
    } catch (error) {
      console.error('Failed to get DX', error);
      res.status(500).json({ error: 'Failed to get DX' });
    }
  };


//Api hiển thị trang tài khoản nghỉ + khoog lịch làm việc + tìmkiếm

// exports.showNghi = async(req,res)=> {
//         try{
//         let {page,time_s,time_e,dep_id,emp_id,type_duyet} = req.body
//         let com_id = req.user.data.inForPerson.employee.com_id
//         const perPage = 10; 
//         const startIndex = (page - 1) * perPage;
//         const endIndex = page * perPage;
//         const checkUser = await UserDX.findOne({'inForPerson.employee.com_id' : com_id })
//         let query = {
//           del_type : 1,
//         };
//         if(dep_id){
//           query.dep_id = dep_id;
//         }
//         if(emp_id){
//           query.emp_id = emp_id
//         }
//         if (type_duyet){
//           query.type_duyet = type_duyet
//         }
//         if (time_s && time_e) {
//           if (time_s > time_e) {
//             res.status(400).json({ error: "Thời gian bắt đầu không thể lớn hơn thời gian kết thúc."});
//             return;
//           }
//           query.created_at = { $gte: time_s, $lte: time_e };
//         }
//         let validCondition = false;
 
//         const shownghi = await DeXuat.find({ type_dx: { $in: [1, 18] }}).sort({ _id: -1 }).skip(startIndex).limit(perPage);
//             res.status(200).json(shownghi);
//         }catch(error) {
//         console.error('Failed to get DX', error);
//         res.status(500).json({ error: 'Failed to get DX' });
//       }
//     }

exports.showNghi = async (req, res) => {
  try {
    const { page,time_s, time_e, dep_id, emp_id, type_duyet } = req.body;
    const com_id = req.user.data.inForPerson.employee.com_id;
    const perPage = 10;
    const skip = (page - 1) * perPage;

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

    res.status(200).json(shownghi);
  } catch (error) {
    console.error('Failed to get DX', error);
    res.status(500).json({ error: 'Failed to get DX' });
  }
};





    //Api thay đổi trạng thái tháo ẩn hiện đề xuất
exports.changeCate  = async (req, res) => {
    
          try {
            const { id, value } = req.body;
            let com_id = req.user.data.inForPerson.employee.com_id
              // Kiểm tra xem loại đề xuất đã được ẩn hay chưa
              const hideCate = await HideCateDX.findOne({ id_com: com_id });
              const hideCateArr = hideCate.id_cate_dx.toString(',');
             
              // Xác định vị trí của id trong mảng hideCateArr
              const index = hideCateArr.indexOf(id.toString());
              console.log(index)
              if (value ==1) {
                // Xóa ẩn loại đề xuất
                if (index > -1) {
                  hideCateArr.replace(index, "");
                  hideCate.id_cate_dx = hideCateArr.join(',');
                  await hideCate.save();
                  res.status(200).json({ success: true, message: 'Hủy ẩn loại đề xuất thành công!' });
                } else {
                  res.status(200).json({ success: true, message: 'Loại đề xuất này chưa được ẩn!' });
                }
              } else  {
                // Thêm ẩn loại đề xuất
                if (hideCateArr.includes(id.toString())) {
                  res.status(200).json({ success: true, message: 'Loại đề xuất này đã được ẩn rồi!' });
                } else {
                  hideCateArr.push(id.toString());
                  hideCate.id_cate_dx = hideCateArr.join(',');
                  await hideCate.save();
                  res.status(200).json({ success: true, message: 'Ẩn loại đề xuất thành công!' });
                }
              }
    
  } catch (error) {
    console.error('Failed to change trang_thai_dx', error);
    res.status(500).json({ error: 'Failed to change trang_thai_dx' });
  }
};



///1345246578564


// tìm theo tên loại đề xuất + hiển thị các loại đề xuất

exports.findNameCate = async (req, res) => {
  try {
    let { name_cate_dx, page } = req.body;
    const perPage = 10; 
    page = parseInt(page) || 1; 

    const regex = new RegExp(name_cate_dx, 'i'); // biểu thức chính quy không phân biệt chữ hoa chữ thường

    const count = await CateDeXuat.countDocuments({ name_cate_dx: regex });
    const totalPages = Math.ceil(count / perPage); // Tổng số trang

    const result = await CateDeXuat.find({ name_cate_dx: regex,com_id : 0 })
      .skip((page - 1) * perPage) 
      .limit(perPage); 

    res.status(200).json({
      result,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error('Failed to search', error);
    res.status(500).json({ error: 'Failed to search' });
  }
};



//Api hiển thị thành viên công ty

exports.findthanhVien = async(req,res) => {
  try{
    let {page} = req.body
    let com_id = req.user.data.inForPerson.employee.com_id
    const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
    const startIndex = (page - 1) * perPage; 
      const checkTV = await UserDX.find({'inForPerson.employee.com_id' : com_id}).select('idQlC userName inForPerson ').sort({ 'inForPerson.employee.dep_id': -1 }).skip(startIndex).limit(perPage); 
      res.status(200).json(checkTV);
  }catch (error) {
    console.error('Failed to find', error);
    res.status(500).json({ error: 'Failed to find' });
  }
}