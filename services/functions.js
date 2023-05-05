const multer = require('multer');

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