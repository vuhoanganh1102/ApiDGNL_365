const Users = require('../../models/Users');
const UvCvmm = require('../../models/ViecLamTheoGio/UvCvmm');
const functions = require('../../services/functions');

exports.getCongViecMongMuon = async(req, res, next) => {
  try{
    return functions.success(res, "get info cong viec mong muon thanh cong");
  }catch(error) {
    return functions.setError(res, error.message);
  }
}