// const { checkPhoneNumber } = require("../functions");
// const sharp = require('sharp');
const path = require('path');
// const { log } = require("console");
const fs = require('fs');
exports.getMaxIDCRM = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { cus_id: -1 } }).lean() || 0;
    return maxUser.cus_id;
};


// hàm validate phone
exports.checkPhoneNumberCRM = async (phone) => {
  const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
  return phoneNumberRegex.test(phone)
}
// hàm validate email
exports.checkEmailCRM = async (email) => {
  const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return gmailRegex.test(email);
}
// hàm validate link
exports.checkLinkCRM= async (link) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(link);
}
// hàm validate thơi gian
exports.checkTimeCRM = async (time) => {
  const currentTime = new Date(); // Lấy thời gian hiện tại
  const inputTime = new Date(time); // Thời gian nhập vào
  if (inputTime < currentTime) {
      return false
  } else {
      return true
  }
}



exports.validateImage = async (logo) => {
  
  const fileExtension = path.extname(logo.name).toLowerCase();
  const validExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.bmp'];

  if (!validExtensions.includes(fileExtension)) {
    return { isValid: false, message: 'Định dạng ảnh không hợp lệ. Chỉ hỗ trợ định dạng JPEG, JPG, PNG, GIF và BMP.' };
  }

  // Thực hiện kiểm tra kích thước ảnh và các yêu cầu khác nếu cần

  return  true ;
};

exports.uploadFileCRM = (cus_id,logo) => {
  console.log(cus_id);
  let path = `../Storage/base365/CRM/Customer/${cus_id}/`;
  let filePath = `../Storage/base365/CRM/Customer/${cus_id}/` + logo.originalFilename;

  if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
      console.log("chua ton tai")
      fs.mkdirSync(path, { recursive: true });
  }

  fs.readFile(logo.path, (err, data) => {
      if (err) {
          console.log(err)
      }
      fs.writeFile(filePath, data, (err) => {
          if (err) {
              console.log(err)
          } else {
              console.log(" luu thanh cong ");
          }
      });
  });
}

exports.success = async (res, messsage = "", data = []) => {
  return res.status(200).json({ data: { result: true, message: messsage, ...data }, error: null, })
};

exports.getDatafindOneAndUpdate = async (model, condition, projection) => {
  return model.findOneAndUpdate(condition, projection);
};

exports.validateCustomerInput = (name, phone_number,address,email,type) => {
    if (!name) {
      throw { code: 400, message: 'Tên khách hàng là bắt buộc.' };
    }
    else if(!phone_number){
      throw { code : 400,message : 'số Điện thoại là bắt buộc phải nhập đủ'}
    }
    else if(!email) {
      throw { code : 400,message : 'email là bắt buộc phải nhập đủ'}
    }
    else if(!address) {
      throw {code : 4000 , message : "địa chỉ là bắt buộc"} 
    }
    else if(!type) {
      throw {code : 4000 , message : "type không được bỏ trống"} 
    }
    else if(!company_id){
      throw {code : 4000 , message : "company_id không được bỏ trống"} 
    }
    return true;
  };
  

  exports.createLinkFileCRM = ( id, name) => {
    let link = process.env.DOMAIN_CRM + '/base365/CRM/Customer' + '/' + id + '/' + name;
    return link;
}