const { checkPhoneNumber } = require("../functions");
const sharp = require('sharp');

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

    // Đọc dữ liệu ảnh từ buffer hoặc đường dẫn file
    const image = sharp(logo);

    // Lấy thông tin về định dạng và kích thước ảnh
    const { format, width, height } = await image.metadata();

    // Kiểm tra định dạng ảnh
    if (format !== 'jpeg' && format !== 'png') {
      return { isValid: false, message: 'Định dạng ảnh không hợp lệ. Chỉ hỗ trợ định dạng JPEG và PNG.' };
    }

    // Kiểm tra kích thước ảnh
    if (width < 300 || height < 300) {
      return { isValid: false, message: 'Kích thước ảnh quá nhỏ. Yêu cầu kích thước tối thiểu là 300x300 pixels.' };
    }

    return { isValid: true };
 
};


exports.uploadFileCRM = (id, file) => {
  let path = `../Storage/base365/CRM/Customer/${id}/`;
  let filePath = `../Storage/base365/CRM/Customer/${id}/` + file.originalFilename;

  if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
      console.log("chua ton tai")
      fs.mkdirSync(path, { recursive: true });
  }

  fs.readFile(file.path, (err, data) => {
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



exports.validateCustomerInput = (customerData) => {
    const { name, phone_number,address,email } = customerData;
  
    if (!name) {
      throw { code: 400, message: 'Tên khách hàng là bắt buộc.' };
    }
    else if(this.checkPhoneNumberCRM(phone_number)){
      throw { code : 400,message : 'số Điện thoại là bắt buộc phải nhập đủ'}
    }
    else if(this.checkEmailCRM(email)) {
      throw { code : 400,message : 'email là bắt buộc phải nhập đủ'}
    }
    else if(!address) {
      throw {code : 4000 , message : "địa chỉ là bắt buộc"} 
    }
  };
  

  exports.createLinkFileCRM = ( id, name) => {
    let link = process.env.DOMAIN_CRM + '/base365/CRM/Customer' + '/' + id + '/' + name;
    return link;
}