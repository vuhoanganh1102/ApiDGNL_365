const functions = require('../../../services/CRM/CRMservice')
const set = require('../../../models/crm/setting/AccountAPI')
const md5 = require('md5');
// cài đặt hợp đồng 
exports.addContract = async (req,res) =>{
    const com_id = req.user.data.inForPerson.employee.com_id

    const { account, password, switchboard,domain,status,} = req.body;

    if((account&& password&& switchboard&&domain)== undefined) {
        functions.setError(res," nhap thieu truong ")
    }else{
        let max = set.findOne({},{_id:1}).sort( {_id : -1}).limit(1).lean()
        const setting = new set({
            _id : Number(max) + 1||1,
            switchboard:switchboard,
            account:account,
            password:md5(password),
            domain:domain,
            status:status,
            created_at: new Date(),

        })
        await setting.save()
        .then(()=>functions.success(res , "lasy thanh cong",{setting}))
        .catch((err)=>functions.setError(res,err.message))
    }
}





//kết nối tổng đài kiểm tra theo com nếu có sẽ hiển thị ko có sẽ tạo mới
exports.connectTd = async (req,res) => {
    try{
        let {account,password,switchboard,domain,status} =req.body;
        const com_id = req.user.data.inForPerson.employee.com_id;
        const checkCom = await set.findOne({id_company : com_id})
        if(checkCom){
           res.status(200).json({checkCom})
        }else{
            if((account&& password&& switchboard&&domain)== undefined) {
                functions.setError(res," nhap thieu truong ")
            }else{
                let max = set.findOne({},{id:1}).sort( {id : -1}).limit(1).lean()
                const setting = new set({
                    id : Number(max) + 1||1,
                    switchboard:switchboard,
                    account:account,
                    password:password,
                    domain:domain,
                    status:status,
                    created_at: new Date(),
        
                })
               let saveST = await setting.save()
               res.status(200).json({saveST})
            }
        }
    }catch(err){
        console.log(err)
        functions.setError(res,err.message)
    }

}

//hàm chỉnh sửa kết nối tổng đài


exports.settingSwitchboard = async (req, res) => {
  const { account, password, switchboard } = req.body;
  const { id, domain } = req.body;

  if (!account || !password || !switchboard) {
    return res.status(400).json({ success: false, message: 'Chưa nhập đủ thông tin' });
  }

  const apiUrl = 'http://118.68.169.39:8899/api/account/credentials/verify';
  const requestData = {
    name: account,
    password: password,
  };

  try {
    const apiResponse = await sendApiRequest(apiUrl, requestData);

    // Kiểm tra phản hồi từ API
    if (apiResponse.err_code) {
      return res.status(400).json({ success: false, message: 'Kết nối thất bại, Tài khoản kết nối không tồn tại' });
    }

    // Tiếp tục xử lý khi kết nối thành công
    const time = Date.now();

    // Thực hiện thêm mới hoặc cập nhật bản ghi
    if (!id) {
      const newApi = new set({
        id: generateUniqueId(),
        id_company: req.session.company_id,
        account: account,
        password: password,
        switchboard: switchboard,
        domain: domain,
        status: 1,
        created_at: time,
        updated_at: time,
      });

      await newApi.save();

      req.session.access_token_call = apiResponse.access_token;
      req.session.set_time_api = time;

      return res.json({ success: true, message: 'Kết nối thành công' });
    } else {
      const updatedData = {
        account: account,
        password: password,
        switchboard: switchboard,
        domain: domain,
        updated_at: time,
      };

      await set.findByIdAndUpdate(id, updatedData);

      return res.json({ success: true, message: 'Cập nhật thành công' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi khi gọi API' });
  }
};
