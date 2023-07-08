







exports.getMaxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { ts_id: -1 } }).lean() || 0;
    return maxUser.ts_id;
  };


exports.validateTaiSanInput = (ts_ten,ts_don_vi,id_dv_quanly,id_ten_quanly,id_loai_ts,id_nhom_ts,ts_vi_tri) => {
    if (!ts_ten) {
      throw { code: 400, message: 'Tên tài sản bắt buộc.' };
    }
    else if(!ts_don_vi){
      throw {code : 400 , message : "đơn vị tính không không được bỏ trống"} 
    }
    else if(!id_dv_quanly){
      throw {code : 400 , message : "id_dv_quanly không không được bỏ trống"} 
    }
    else if(!id_ten_quanly){
      throw {code : 400 , message : "id_ten_quanly không không được bỏ trống"} 
    }
    else if(!id_loai_ts){
      throw {code : 400 , message : "id_loai_ts không không được bỏ trống"} 
    }
    else if(!id_nhom_ts){
      throw {code : 400 , message : "id_nhom_ts không không được bỏ trống"} 
    }
    else if(!ts_vi_tri){
      throw {code : 400 , message : "ts_vi_tri không không được bỏ trống"} 
    }
    return true;
  };
  


exports.getDatafindOneAndUpdate = async (model, condition, projection) => {
    return model.findOneAndUpdate(condition, projection);
  };