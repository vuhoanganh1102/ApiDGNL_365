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


//Api hiển thị trang tài khoản nghỉ + khoog lịch làm việc

exports.showNghi = async(req,res)=> {
        try{
        let {page,time_s,time_e,phong_ban,emp_id,type_duyet} = req.body
        let com_id = req.user.data.inForPerson.employee.com_id
        const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
        const startIndex = (page - 1) * perPage; 
        const shownghi = await DeXuat.find({ type_dx: { $in: [1, 18] }}).sort({ _id: -1 }).skip(startIndex).limit(perPage);
            res.status(200).json(shownghi);
        }catch(error) {
        console.error('Failed to get DX', error);
        res.status(500).json({ error: 'Failed to get DX' });
      }
    }

//Api tìm kiếm tài khoản nghỉ + ko llv

exports.adminSearchN = async (req, res) => {
  let com_id = req.body.com_id? req.body.com_id :0;
  let id_phong_ban = req.body.id_phong_ban ? req.body.id_phong_ban : 0;
  let id_user = req.body.id_user ? req.body.id_user : 0;
  let loai_de_xuat = req.body.loai_de_xuat ? req.body.loai_de_xuat : 0;
  let trang_thai_de_xuat = req.body.active ? req.body.active : 0;
  let time_send_from = req.body.time_send_form ? req.body.time_send_form : new Date('1970-01-01').getTime();
  let time_send_to = req.body.time_send_to ? req.body.time_send_to : new Date().getTime();

  let page = Number(req.body.page) ? Number(req.body.page) : 1;
  let pageSize = Number(req.body.pageSize) ? Number(req.body.pageSize) : 10;
  const skip = (page - 1) * pageSize;

  console.log("id_phong_ban: " + id_phong_ban);
  console.log("id_user: " + id_user);
  console.log("loai_de_xuat: " + loai_de_xuat);
  console.log("trang_thai_de_xuat: " + trang_thai_de_xuat);

  let condition = {};
  if (id_phong_ban) {
      condition.phong_ban = Number(id_phong_ban);
      console.log("  condition.phong_ban" + condition.phong_ban)
  }
  if (id_user) {
      condition.id_user = Number(id_user);
  }
  if (loai_de_xuat) {
      condition.type_dx = loai_de_xuat;
  }
  if (trang_thai_de_xuat) {
      condition.active = Number(trang_thai_de_xuat);
      console.log("  condition.active" + condition.active);
  }
  console.log("  condition" + condition);
  console.log("  condition.phong_ban" + condition.phong_ban)
  console.log("  condition.active" + condition.active);
  let filterArray = [];

 let de_Xuat = await DeXuat.find({com_id,type_dx : 1}).skip(skip).limit(pageSize);
  console.log("de_Xuat" + de_Xuat)
  if (de_Xuat) {

      for (let i = 0; i < de_Xuat.length; i++) {
          let de_xuat = {
              _id: de_Xuat[i]._id,
              id_user: de_Xuat[i].id_user,
              com_id : de_Xuat[i].com_id,
              name_dx: de_Xuat[i].name_dx,
              type_duyet: de_Xuat[i].type_duyet,//3- huy 5-duyệt 6 -bắt buộc đi làm 7- đã tiếp nhận
              active: de_Xuat[i].active,//đòng ý hoặc từ chối 
              time_create: de_Xuat[i].time_create,
              phong_ban: de_Xuat[i].phong_ban,
          }
          if (de_xuat.time_create >= time_send_from && de_xuat.time_create <= time_send_to) {

              filterArray.push(de_xuat);

          }
      }
      return res.status(200).json({ data: filterArray, massage: 'thanh cong ' });
  } else {
      return res.satus(200).json("khong co de xuat nao ");
  }
}



    //Api Hiển thị trang thống kế nghỉ phép

    exports.showTKN = async(req,res) => {
        try {
        let {com_id} = req.body;
        const checkNp = await DeXuat.find({})
        }catch(error) {
        console.error('Failed to get DX', error);
        res.status(500).json({ error: 'Failed to get DX' });
      }
    }






    //Api thay đổi trạng thái tháo ẩn hiện đề xuất
exports.changeCate  = async (req, res) => {
    
          try {
            const { com_id, id, value } = req.body;
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






// tìm theo tên loại đề xuất

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
     let {companyID} = req.body
     if(Number.NaN(companyID)) {
      return functions.error('cant find')
     }else{
      const checkTV = await UserDX.find({companyID}) 
      res.status(200).json(checkTV);
     }
    
  }catch (error) {
    console.error('Failed to find', error);
    res.status(500).json({ error: 'Failed to find' });
  }
}