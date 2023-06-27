// const { checkPhoneNumber } = require("../functions");
// const sharp = require('sharp');
const path = require('path');
// const { log } = require("console");
const fs = require('fs');


exports.getMaxIDCRM = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { cus_id: -1 } }).lean() || 0;
    return maxUser.cus_id;
};

exports.getMaxIDConnectApi = async (model) => {
  const maxUser = await model.findOne({}, {}, { sort: { id: -1 } }).lean() || 0;
  return maxUser.id;
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


exports.vavalidateCustomerSearchQuery = ( page, cus_id,status,resoure,user_edit_id,time_s,time_e,group_id) => {
  if (typeof page !== 'number' && isNaN(Number(page))) {
    return { success: false, error: 'page phải là 1 số' };
  }
  else if (typeof cus_id !== 'number' && isNaN(Number(cus_id))) {
    return { success: false, error: 'cus_id phải là 1 số' };
}
  else if (typeof status !== 'number' && isNaN(Number(status))) {
    return { success: false, error: 'status phải là 1 số' };
}
  else if (typeof resoure !== 'number' && isNaN(Number(resoure))) {
    return { success: false, error: 'resoure phải là 1 số' };
}
  else if (typeof user_edit_id !== 'number' && isNaN(Number(user_edit_id))) {
    return { success: false, error: 'user_edit_id người phụ trách phải là 1 số' };
}
  else if (typeof group_id !== 'number' && isNaN(Number(group_id))) {
    return { success: false, error: 'group_id id nhóm phải là 1 số' };
}
  else if (time_s && !isValidDate(time_s)) {
    return { success: false, error: 'thời gian bắt đầu không hợp lệ.' };
}
else if (time_e && !isValidDate(time_e)) {
  return { success: false, error: 'thời gian kết thúc không hợp lệ.' };
}
if (time_s && time_e && isInvalidDateRange(time_s, time_e)) {
  return { success: false, error: 'thời gian bắt đầu không được lớn hơn thời gian kết thúc' };
}
  return true;
};


function isValidDate(dateString) {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
  return true;
}

function isInvalidDateRange(time_s, time_e) {
  const start = new Date(time_s);
  const end = new Date(time_e);

  return start.getTime() > end.getTime();
}



exports.validateCustomerInput = (name, phone_number,address,email,type) => {
    if (!name) {
      throw { code: 400, message: 'Tên khách hàng là bắt buộc.' };
    }
    else if(!comId){
      throw {code : 4000 , message : "company_id không được bỏ trống"} 
    }
    return true;
  };
  

  exports.createLinkFileCRM = ( id, name) => {
    let link = process.env.DOMAIN_CRM + '/base365/CRM/Customer' + '/' + id + '/' + name;
    return link;
}


exports.upFileCRM = async (folder, id, file,allowedExtensions) => {

  let path1 = `../../Storage/base365/CRM/Customer/${folder}/${id}/`;
  let filePath = `../../Storage/base365/CRM/Customer/${folder}/${id}/` + file.name;
  let fileCheck =  path.extname(filePath);
  if(allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false)
  {
      return false
  }
 
  if (!fs.existsSync(path1)) {   
      fs.mkdirSync(path1, { recursive: true });
  }
  fs.readFile(file.path, (err, data) => {
      if (err) {
          console.log(err)
      }
  
      fs.writeFile(filePath, data, (err) => {
          if (err) {
          console.log(err)
          }
      });
  });
  return true
}

exports.deleteFileCRM = (id, file) => {
  let filePath = `../../Storage/base365/CRM/Customer/${id}/` + file;
  fs.unlink(filePath, (err) => {
  if (err) console.log(err);
  });
  }

  // hàm khi thành công
exports.success = async (res, messsage = "", data = []) => {
  return res.status(200).json({ data: { result: true, message: messsage, ...data }, error: null, })
};

// hàm thực thi khi thất bại
exports.setError = async (res, message, code = 500) => {
  return res.status(code).json({ code, message })
};
// hàm tìm id max
exports.getMaxID = async (model) => {
  const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
  return maxUser._id;
};
