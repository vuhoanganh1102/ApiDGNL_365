 // check ảnh
const sharp = require('sharp');
// check ảnh và video
const fs = require('fs'); 
// check video
const util = require('util'); 
// check video
const stat = util.promisify(fs.stat); 
// check video
const { promisify } = require('util');
 // check video
const probe = promisify(require('ffmpeg-probe'));
// upload file
const multer = require('multer')
// gửi mail
const nodemailer = require("nodemailer");
// tạo biến môi trường
const dotenv = require ("dotenv");
// mã hóa mật khẩu
const crypto = require('crypto');

// tọa token
const jwt = require('jsonwebtoken')

const Users=require('../models/Timviec365/Timviec/Users')
// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// định dạng video
const SUPPORTED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'wmv', 'flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * 1024 * 1024; 

dotenv.config();
// hàm mã otp ngẫu nhiên có 6 chữ số
exports.randomNumber = Math.floor(Math.random() * 900000) + 100000; 
// hàm validate phone
exports.CheckPhoneNumber =async(phone)=>{
    if(phone==undefined){
      return true
    }
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    return phoneNumberRegex.test(phone)
}
// hàm validate email
exports.CheckEmail = async(email)=>{
    const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return gmailRegex.test(email)
}

exports.getDatafindOne =async(model,condition)=>{
    return model.findOne(condition);
}

exports.getDatafind =async(model,condition)=>{
    return model.find(condition);
}

exports.getDatafindOneAndUpdate =async(model,condition,projection)=>{
    return model.findOneAndUpdate(condition,projection);
}
// hàm khi thành công
exports.success =async(res,messsage = "", data = [])=>{
  return res.status(200).json({result:true,messsage,data})

}
// hàm thực thi khi thất bại
exports.setError = async (res,message,code =500) => {

    return res.status(code).json({code,message})
}
// hàm tìm id max 
exports.getMaxID= async(model) => {
    const maxUser= await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id;
}
// hàm check định dạng ảnh
const isImage = async (filePath) => {
    const { format } = await sharp(filePath).metadata();
    return !!format;
};
// hàm check ảnh
exports.checkImage = async (filePath) => {
      const { size } = await fs.promises.stat(filePath);
      if (size > MAX_IMG_SIZE) {
        return 'dung luong anh > 2mb' ;
      }
  
      const isImg = await isImage(filePath);
      if (!isImg) {
        return  'file khong dung dinh dang anh' ;
      }
  
      return  true ;
  };

// hàm check video
exports.checkVideo = async (filePath) => {
  const { size } = await stat(filePath);
  if (size > MAX_VIDEO_SIZE) {
    return  'dung luong video > 100mb.' ;
  }

  const videoProbe = await probe(filePath);
  const format = videoProbe.format.format_name.split(',')[0];
  if (!SUPPORTED_VIDEO_FORMATS.includes(format)) {
    return  'file khong dung dinh dang video.' ;
  }

  return true;
};

  exports.getDataDeleteOne= async(model,condition) =>{
    return model.deleteOne(condition)
  }
// storage để updload file
  const storageMain = (destination, fileExtension) => {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, destination)
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + uniqueSuffix + fileExtension)
      }
    })
  }
//  hàm upload ảnh
  exports.uploadImg = multer({ storage: storageMain('public/company/avatar', '.jpg') })
// hàm upload file
  exports.uploadVideo = multer({ storage: storageMain('public/company/video', '.mp4') })

  const deleteFile = (filePath)=>{
     fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log('File was deleted');
      });
  }
  // hàm xóa file
  exports.deleteImg = async(condition) => {
    if(condition){
     await deleteFile(condition.path)
    }

  }
// storega check file
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/cvUpload')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname +uniqueSuffix+'.pdf')
    }
  })
  
  // hàm check file
  exports.uploadFile = multer({ storage: storage })

  exports.createError = async(code, message) => {
    const err = new Error();
    err.code = code;
    err.message = message;
    return {data:null,error:err};
  };
  // hàm cấu hình mail
  const transport = nodemailer.createTransport({
      host: process.env.NODE_MAILER_HOST,
      port: Number(process.env.NODE_MAILER_PORT),
      service: process.env.NODE_MAILER_SERVICE,
      secure: true,
      auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASSWORD
      }
  });
  // hàm gửi mail
  exports.sendEmailVerificationRequest = async (otp,email,nameCompany) => {
    let options = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Tìm việc 365 WEB xác thực email',
        html: `
    <body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;"><table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000"><tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;">
    <td style="padding-top: 23px;float: left;">
    <img src="https://timviec365.vn/images/email/logo2.png"></td>
    <td style="text-align: left;float: right;">
    <ul style="margin-top: 15px;padding-left: 0px;">
    <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">
    Hiển thị danh sách ứng viên online</span></li>
    <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Nhắn tin trực tiếp ứng viên qua Chat365</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Cam kết bảo hành 100%</span></li></ul></td></tr><tr style="float: left;padding:10px 30px 30px 30px;"><td colspan="2"><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào <span style="color:#307df1;">${nameCompany}</span></p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Chúc mừng bạn đã hoàn thành thông tin đăng ký tài khoản nhà tuyển dụng tại website Timviec365</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là thông tin tài khoản đã tạo:</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Tài khoản: ${email}</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Mật khẩu: ****** </p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là mã OTP của bạn</p><p style="margin: auto;margin-top: 45px;text-align: center;width: 160px;height: 43px;background:#307df1;border-radius: 5px;font-size: 22px;color: #fff">${otp}</a></p></td></tr><tr style="height: 160px;background-image: url(https://timviec365.vn/images/email/bg2.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;"><td style="padding-top: 50px;"><ul><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Liên hệ với chúng tôi để được hỗ trợ nhiều hơn:</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Hotline: <span style="color: #ffa111;">1900633682</span> - ấn phím 1</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;color: #ffa111;">Trân trọng !</span></li></ul></td></tr></table></body>
        `
    }
     transport.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    })
}


  exports.verifyPassword = async(inputPassword, hashedPassword) => {
    const md5Hash = crypto.createHash('md5').update(inputPassword).digest('hex');
    return md5Hash === hashedPassword;
  }
  // hàm check token
 exports.checkToken =async(req,res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401); // Nếu không tìm thấy token, trả về mã lỗi 401

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403); // Nếu token không hợp lệ, trả về mã lỗi 403
    req.user = user;
  });
 }