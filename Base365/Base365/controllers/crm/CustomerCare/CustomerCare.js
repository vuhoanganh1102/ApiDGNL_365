
const CallHistory = require('../../../models/crm/call_history')
const ManagerExtension = require('../../../models/crm/manager_extension');
const AcountApi = require('../../../models/crm/account_api')
const functions = require("../../../services/functions");
const customerService = require('../../../services/CRM/CRMservice')
const https = require('https');
const axios = require('axios');
const { log } = require('console');




exports.listLineSearch = async(req,res) =>{
    try{
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
            emp_id = req.user.data.idQLC;
        }else{
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        let listLine = await ManagerExtension.find({company_id : com_id}).select('id ext_number')
        if(!listLine){
            listLine = ''
        }
        return functions.success(res, 'success', {listLine});
    }catch (e) {
      console.log(e);
      return functions.setError(res, e.message);
    }
}



// hàm hiển thị lịch sử cuộc gọi
exports.Callhistory = async (req, res) => {
    try {
      let com_id = '';
      let emp_id = '';
      
      if (req.user.data.type == 1 || req.user.data.type == 2) {
        com_id = req.user.data.com_id;
        emp_id = req.user.data.idQLC;
        
        // Tìm kiếm danh sách các extension được quản lý bởi công ty
        let result = await customerService.check_connect(com_id);
        if (result) {
          let access_token_call = await customerService.getToken(result.account_api, result.pass_api);
          console.log(access_token_call);
          let checkHisCall = await customerService.getCallHistory(access_token_call.access_token)
          if (checkHisCall.items.length > 0) {
            let data = checkHisCall.items.map(item => ({
              so_goi: item.caller,
              so_nghe: item.callee,
              thoi_gian_bat_dau : item.start_time,
              thoi_gian_ket_thuc : item.end_time,
              thoi_luong : item.duration,
              trang_thai : item.status
              // Thêm các trường khác mà bạn cần
            }));
  
            if (req.body.nhan_vien) {
              let keyword = req.body.nhan_vien;
              data = data.filter(item =>
                item.so_goi.includes(keyword) || item.so_nghe.includes(keyword)
              );
            }
            if (req.body.thoi_gian_bat_dau && req.body.thoi_gian_ket_thuc) {
              data = data.filter(item => 
                item.thoi_gian_bat_dau >= req.body.thoi_gian_bat_dau && 
                item.thoi_gian_ket_thuc <= req.body.thoi_gian_ket_thuc
              );
            }
            if (req.body.trang_thai) {
              let requestedCount = parseInt(req.body.trang_thai);
              let matchedItems = [];
              let matchedCount = 0;
              for (let item of data) {
                if (item.trang_thai === 'ANSWERED' && matchedCount < requestedCount) {
                  matchedItems.push(item);
                  matchedCount++;
                }
              }
              data = matchedItems;
            }
            const total = data.length; // Tính tổng số bản ghi
            return functions.success(res, 'success', {data,total});
          }
        }
  
        return functions.success(res, 'success', data);
      } else {
        return functions.setError(res, 'không có quyền truy cập', 400);
      }
    } catch (e) {
      console.log(e);
      return functions.setError(res, e.message);
    }
  };
  
  
  // Hàm gọi điện 
  exports.Call = async (req, res) => {
    try {
      let com_id = "";
      if (req.user.data.type == 1 || req.user.data.type == 2) {
        com_id = req.user.data.com_id;
        emp_id = req.user.data.idQLC;
        let createDate = Math.floor(Date.now() / 1000);
        let maxIdCallHistory = await functions.getMaxIdByField(CallHistory, 'id');
        let { phone } = req.body
        if (phone) {
  
          // lay data cua tổng đài
          let connect = await AcountApi.findOne({
            com_id: com_id,
            switchboard: "fpt",
            status: 1
          })
            .select('account password domain')
  
          if (connect) {
            // lấy data của NV đc cài đặt với line
            let infor = await ManagerExtension.findOne({
              company_id: com_id,
              emp_id: emp_id
            }).select('ext_id ext_number')
            if (infor) {
              let checkToken = await customerService.getToken(connect.account, connect.password)
              if (checkToken) {
                let info_extension = await customerService.getExtensionInfo(checkToken.access_token, infor.ext_id)
                if (info_extension.err_code !== undefined) {
                  return functions.setError(res, info_extension.msg);
                } else {
                  let outbound_caller_id = info_extension.options.outbound_caller_id
                  let pass = info_extension.web_access_password
                  let data = {
                    src: infor.ext_number,
                    to: phone,
                    domain: connect.domain,
                    extension: infor.ext_number,
                    auth: pass,
                    outbound_caller_id: outbound_caller_id,
                    sendsdp: true
                  };
                  const response = await axios.post('https://s02.oncall.vn:8900/api/extensions/call', data, {
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Tắt kiểm tra chứng chỉ
                  });
                  let checkCalled = await CallHistory.findOne({
                    phone: phone,
                    extension: infor.ext_number,
                    com_id: com_id 
                  });
                  if (!checkCalled) {
                    let createCallHis = new CallHistory({
                      id: maxIdCallHistory,
                      phone: phone,
                      extension: infor.ext_number,
                      com_id: com_id,
                      created_at: createDate
                    })
                    await createCallHis.save()
                  } else {
                    let chinhsua = await CallHistory.findOneAndUpdate(
                      {
                        phone: phone,
                        extension: infor.ext_number,
                        com_id: com_id
                      }, {
                      $set: {
                        created_at: createDate
                      }
                    }, {
                      new: true
                    })
                    if (!chinhsua) {
                      return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
                    }
                    return functions.success(res, 'Cuộc gọi thành công');
  
                  }
                }
              }
            } else {
              return functions.setError(res, 'không tồn tại bản ghi nhân viên được cái đặt ', 400);
            }
          } else {
            return functions.setError(res, 'không tồn tại bản ghi ', 400);
          }
        } else {
          return functions.setError(res, 'số điện thoại khôn được bỏ trống', 400);
        }
      } else {
        return functions.setError(res, 'không có quyền truy cập', 400);
      }
    } catch (e) {
      console.log(e)
      return functions.setError(res, e.message)
    }
  }
  
  exports.QuanLyLine = async (req, res) => {
    try {
        let com_id = '';
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            com_id = req.user.data.com_id;
        } else {
            return functions.setError(res, 'không có quyền truy cập', 400);
        }
        
        let result = await customerService.check_connect(com_id);
        if (result) {
            let access_token_call = await customerService.getToken(result.account_api, result.pass_api);
            let ist_extension_paginate = await customerService.list_extension(access_token_call.access_token);
            let manager_extension = await ManagerExtension.find({company_id : com_id}).lean()
            let listUser = await User.find({'inForPerson.employee.com_id' : com_id,type : 2}).select('idQLC userName').lean()
            for(let i = 0 ; i < manager_extension.length ; i++){
              let element = manager_extension[i]
            let emplopyee =  listUser.find(e =>  Number(e.idQLC) == Number(element.emp_id) );
            element.emp_name = "";
            }
            
            for(let i = 0 ; i < ist_extension_paginate.extensions.length ; i++){
              let elementEmp = ist_extension_paginate.extensions[i]
              let name_emp = manager_extension.find(e => Number(e.ext_number) == Number(elementEmp.ext_number))
              elementEmp.emp_name = ""
            }
           
            return functions.success(res, 'success',{ist_extension_paginate});
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
  };
  