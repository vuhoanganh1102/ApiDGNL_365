const CateDeXuat = require("../../../models/Vanthu/cate_de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");
const DeXuat = require('../../../models/Vanthu/de_xuat')
const HideCateDX = require('../../../models/Vanthu/hide_cate_dx')


//Hiển thị danh sách các loại đề xuất 

exports.showCateCom = async (req, res) => {
    try {
      const { page } = req.body;
      const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
  
      const startIndex = (page - 1) * perPage; 
      const endIndex = page * perPage; 
  
      const showCateCom = await CateDeXuat.find({ com_id: 0 ,active : 1}).skip(startIndex).limit(perPage);
      res.status(200).json(showCateCom);
    } catch (error) {
      console.error('Failed to get cate', error);
      res.status(500).json({ error: 'Failed to get cate' });
    }
  };



 //Api hiển thị chi tiết đề xuất 

 exports.ChitietDx = async(req,res) => {
     try{
      let {_id} = req.body 
      if (Number.isNaN(_id)) {
        throw new Error("Invalid _id");
      }else{
       const showCTDX = await DeXuat.findOne({_id})
       res.status(200).json(showCTDX);
      }
     }catch (error) {
      console.error('Failed to get cate', error);
      res.status(500).json({ error: 'Failed to get cate' });
    }
 } 





  // Api hiển thị trang home tài khoản công ty

  exports.showHomeCt = async (req, res) => {
    try {
      const { com_id, page } = req.body;
      if (Number.isNaN(com_id)) {
        throw new Error("Invalid com_id");
      }else{
        const perPage = 6; // Số lượng giá trị hiển thị trên mỗi trang
      const startIndex = (page - 1) * perPage; 
      const showHomeCt = await DeXuat.find({ com_id }).sort({ _id: -1 }).skip(startIndex).limit(perPage);
  
      res.status(200).json(showHomeCt);
      }    
    } catch (error) {
      console.error('Failed to get DX', error);
      res.status(500).json({ error: 'Failed to get DX' });
    }
  };



  //Api hiển thị trang Home tài khoản nhân viên

  exports.showHomeNv = async(req,res) => {
    try{
        const {id_user, page } = req.body;
        console.log(id_user);
        if (Number.isNaN(id_user)) {
          throw new Error("Invalid id_user");
        }else{
          const perPage = 6; // Số lượng giá trị hiển thị trên mỗi trang
        const startIndex = (page - 1) * perPage; 
        const showHomeNv = await DeXuat.find({id_user}).sort({ _id: -1 }).skip(startIndex).limit(perPage);
    
        res.status(200).json(showHomeNv);
        }    
    }catch (error) {
        console.error('Failed to get DX', error);
        res.status(500).json({ error: 'Failed to get DX' });
      }
    };
  

    //Api hiển thị trang tài khoản nghỉ + khoog lịch làm việc

    exports.showNghi = async(req,res)=> {
        try{
        let {com_id,page} = req.body
        if(Number.isNaN(com_id)){
            throw new Error("Invalid com_id");
        }else {
            const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
            const startIndex = (page - 1) * perPage; 
            const shownghi = await DeXuat.find({ com_id ,type_dx : 1}).sort({ _id: -1 }).skip(startIndex).limit(perPage);
            res.status(200).json(shownghi);
        }
        }catch(error) {
        console.error('Failed to get DX', error);
        res.status(500).json({ error: 'Failed to get DX' });
      }
    }

    //Api Hiển thị trang thống kế nghỉ phép

    exports.showTKN = async(req,res) => {
        try {
        let {com_id} = req.body;
        
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