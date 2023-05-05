const sharp = require('sharp');
const fs = require('fs');
const util = require('util');
const stat = util.promisify(fs.stat);
const { promisify } = require('util');
const probe = promisify(require('ffmpeg-probe'));
const multer=require('multer')

exports.CheckPhoneNumber =async(phone)=>{
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    return phoneNumberRegex.test(phone)
}

exports.CheckEmail = async(email)=>{
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
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
exports.success =async(messsage = "", data = [])=>{
    return {
        code: 200,
        data,
        messsage
    };
}
exports.setError = async (code,message) => {
    return {
        code, message
    }
}
exports.getMaxID= async(model) => {
    const maxUser= await model.findOne({}, {}, { sort: { _id: -1 } }).lean();
    return maxUser._id;
}

const MAX_IMG_SIZE = 2 * 1024 * 1024; 

const isImage = async (filePath) => {
    const { format } = await sharp(filePath).metadata();
    return !!format;
};

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

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const SUPPORTED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'wmv', 'flv'];

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
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/avatarUser')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
  })
  
  exports.upload = multer({ storage: storage })
  exports.deleteFile = (filePath)=>{
     fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log('File was deleted');
      });
  }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/cvUpload')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname +uniqueSuffix+'.pdf')
    }
  })
  
  exports.uploadFile = multer({ storage: storage })

exports.createError = async(code, message) => {
    const err = new Error();
    err.code = code;
    err.message = message;
    return {data:null,error:err};
  };
