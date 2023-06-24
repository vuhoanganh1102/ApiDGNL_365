
const CustomerContact = require('../../../models/crm/Customer/contact_customer')
const Customer = require('../../../models/crm/Customer/customer')
const functions = require("../../../services/functions");
const customerService = require('../../../services/CRM/CRMservice')
const User = require('../../../models/Users')
const ConnectApi = require('../../../models/crm/connnect_api_config')
// hàm thêm mới khách hang
exports.addCustomer = async (req, res) => {
  try {
    let {
      email,name,stand_name,phone_number,cit_id,district_id,ward,address,ship_invoice_address,
      cmnd_ccnd_number,
      cmnd_ccnd_address,
      cmnd_ccnd_time,
      user_handing_over_work,
      resoure,
      description,
      tax_code,
      group_id,
      status,
      business_areas,
      category,
      business_type,
      classify,
      bill_city,
      bil_district,
      bill_ward,
      bill_address,
      bill_area_code,
      bill_invoice_address,
      bill_invoice_address_email,
      ship_city,
      ship_area,
      bank_id,
      type,
      bank_account,
      revenue,
      size,
      rank,
      website,
      number_of_day_owed,
      gender,
      deb_limit,
      share_all,
      is_input,
      is_delete,
      id_cus_from,
      cus_from,
      link
    } = req.body;
     
     const comId = req.user.data.inForPerson.employee.com_id;
     const empId = req.user.data.idQLC
    const validationResult = customerService.validateCustomerInput(name,email,address,phone_number,type,comId);

    let createDate = new Date();

    if (validationResult === true) {
      let maxID = await customerService.getMaxIDCRM(Customer);
      let cus_id = 0;
      if (maxID) {
        cus_id = Number(maxID) + 1;
      }
      if(type == 2) {
        let logo = req.files.logo || null;

        // Nếu không có logo hoặc không có yêu cầu bắt buộc logo,có thể bỏ qua kiểm tra định dạng ảnh và tải lên
        if (logo) {
          const imageValidationResult = await customerService.validateImage(logo);
          if (imageValidationResult === true) {
            await customerService.uploadFileCRM(cus_id, logo);
            let linkDL = customerService.createLinkFileCRM(cus_id, logo.name);
            
            let createCustomer = new Customer({
              cus_id: cus_id,
              email: email,
              name: name,
              stand_name: stand_name,
              phone_number: phone_number,
              logo: linkDL,
              cit_id: cit_id,
              district_id: district_id,
              ward: ward,
              address: address,
              ship_invoice_address: ship_invoice_address,
              cmnd_ccnd_number: cmnd_ccnd_number,
              cmnd_ccnd_address: cmnd_ccnd_address,
              cmnd_ccnd_time: cmnd_ccnd_time,
              resoure: resoure,
              description: description,
              tax_code: tax_code,
              group_id: group_id,
              status: status,
              business_areas: business_areas,
              category: category,
              business_type: business_type,
              classify: classify,
              bill_city: bill_city,
              bil_district: bil_district,
              bill_ward: bill_ward,
              bill_address: bill_address,
              bill_area_code: bill_area_code,
              bill_invoice_address: bill_invoice_address,
              bill_invoice_address_email: bill_invoice_address_email,
              ship_city: ship_city,
              company_id : comId,
              emp_id : empId,
              ship_area: ship_area,
              bank_id: bank_id,
              bank_account: bank_account,
              revenue: revenue,
              rank: rank,
              website: website,
              number_of_day_owed: number_of_day_owed,
              gender: gender,
              deb_limit: deb_limit,
              share_all: share_all,
              type: type,
              is_input: is_input,
              is_delete: is_delete,
              created_at: createDate,
              id_cus_from: id_cus_from,
              cus_from: cus_from,
              link: link
            });
  
            let saveCS = await createCustomer.save();
            res.status(200).json(saveCS);
          } else {
            res.status(400).json({ validationResult });
          }
        } else {
          let createCustomer = new Customer({
            cus_id: cus_id,
            email: email,
            name: name,
            stand_name: stand_name,
            phone_number: phone_number,
            cit_id: cit_id,
            district_id: district_id,
            ward: ward,
            address: address,
            ship_invoice_address: ship_invoice_address,
            cmnd_ccnd_number: cmnd_ccnd_number,
            cmnd_ccnd_address: cmnd_ccnd_address,
            cmnd_ccnd_time: cmnd_ccnd_time,
            resoure: resoure,
            description: description,
            tax_code: tax_code,
            group_id: group_id,
            status: status,
            business_areas: business_areas,
            category: category,
            business_type: business_type,
            classify: classify,
            bill_city: bill_city,
            bil_district: bil_district,
            bill_ward: bill_ward,
            bill_address: bill_address,
            bill_area_code: bill_area_code,
            bill_invoice_address: bill_invoice_address,
            bill_invoice_address_email: bill_invoice_address_email,
            company_id : comId,
            emp_id : empId,
            ship_city: ship_city,
            ship_area: ship_area,
            bank_id: bank_id,
            bank_account: bank_account,
            revenue: revenue,
            rank: rank,
            website: website,
            number_of_day_owed: number_of_day_owed,
            gender: gender,
            deb_limit: deb_limit,
            share_all: share_all,
            type: type,
            is_input: is_input,
            is_delete: is_delete,
            created_at: createDate,
            id_cus_from: id_cus_from,
            cus_from: cus_from,
            link: link
          });
  
          let saveCS = await createCustomer.save();
          res.status(200).json(saveCS);
        }
      }
      if(type == 1) {
        let logo = req.files.logo ;

        // Nếu không có logo hoặc không có yêu cầu bắt buộc logo,có thể bỏ qua kiểm tra định dạng ảnh và tải lên
        if (logo) {
          const imageValidationResult = await customerService.validateImage(logo);
          if (imageValidationResult === true) {
            await customerService.uploadFileCRM(cus_id, logo);
            let linkDL = customerService.createLinkFileCRM(cus_id, logo.name);
            
            let createCustomer = new Customer({
              cus_id: cus_id,
              email: email,
              name: name,
              stand_name: stand_name,
              phone_number: phone_number,
              logo: linkDL,
              cit_id: cit_id,
              district_id: district_id,
              ward: ward,
              address: address,
              ship_invoice_address: ship_invoice_address,
              resoure: resoure,
              description: description,
              tax_code: tax_code,
              group_id: group_id,
              status: status,
              business_areas: business_areas,
              category: category,
              business_type: business_type,
              classify: classify,
              bill_city: bill_city,
              bil_district: bil_district,
              bill_ward: bill_ward,
              bill_address: bill_address,
              bill_area_code: bill_area_code,
              bill_invoice_address: bill_invoice_address,
              bill_invoice_address_email: bill_invoice_address_email,
              company_id : comId,
              emp_id : empId,
              ship_city: ship_city,
              ship_area: ship_area,
              bank_id: bank_id,
              bank_account: bank_account,
              revenue: revenue,
              size: size,
              user_handing_over_work,
              rank: rank,
              website: website,
              number_of_day_owed: number_of_day_owed,
              deb_limit: deb_limit,
              share_all: share_all,
              type: type,
              is_input: is_input,
              is_delete: is_delete,
              created_at: createDate,
              id_cus_from: id_cus_from,
              cus_from: cus_from,
              link: link
            });
  
            let saveCS = await createCustomer.save();
            res.status(200).json(saveCS);
          } else {
            res.status(400).json({ validationResult });
          }
        } else {
          let createCustomer = new Customer({
            cus_id: cus_id,
            email: email,
            name: name,
            stand_name: stand_name,
            phone_number: phone_number,
            cit_id: cit_id,
            district_id: district_id,
            ward: ward,
            address: address,
            ship_invoice_address: ship_invoice_address,
            resoure: resoure,
            description: description,
            tax_code: tax_code,
            group_id: group_id,
            status: status,
            business_areas: business_areas,
            category: category,
            business_type: business_type,
            classify: classify,
            bill_city: bill_city,
            bil_district: bil_district,
            bill_ward: bill_ward,
            bill_address: bill_address,
            bill_area_code: bill_area_code,
            bill_invoice_address: bill_invoice_address,
            bill_invoice_address_email: bill_invoice_address_email,
            company_id : comId,
            emp_id : empId,
            ship_city: ship_city,
            ship_area: ship_area,
            bank_id: bank_id,
            bank_account: bank_account,
            revenue: revenue,
            size: size,
            user_handing_over_work,
            rank: rank,
            website: website,
            number_of_day_owed: number_of_day_owed,
            deb_limit: deb_limit,
            share_all: share_all,
            type: type,
            is_input: is_input,
            is_delete: is_delete,
            created_at: createDate,
            id_cus_from: id_cus_from,
            cus_from: cus_from,
            link: link
          });
  
          let saveCS = await createCustomer.save();
          res.status(200).json(saveCS);
        }
      
      }
    } else {
      res.status(400).json({ validationResult });
    }
  } catch (error) {
    console.error('Failed to add', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
  }
};
 
//hiển thị danh sách khách hàng
  
exports.showKH = async (req, res) => {
  try {
    let { page, cus_id, name, phone_number,status,resoure,user_edit_id,time_s,time_e,group_id} = req.body;
    // const validationResult = customerService.vavalidateCustomerSearchQuery( page, cus_id,status,resoure,user_edit_id,time_s,time_e,group_id);

    // if (!validationResult.success) {
    //   return res.status(400).json({ error: validationResult.error });
    // }
    const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
    const userId = req.user.data.idQLC;
    console.log(req.user);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const checkUser = await User.findOne({ idQLC: userId });

    let query = {
      is_delete: 0,
    };
    if(cus_id){
      query.cus_id = cus_id;
    }
    if(name){
      query.name = { $regex: name, $options: "i" };
    }
    if (phone_number){
      query.phone_number = { $regex: phone_number, $options: "i" };
    }
    if(status){
      query.status = status
    }
    if(resoure){
      query.resoure = resoure
    }
    if(user_edit_id){
      query.user_edit_id = user_edit_id
    }
    if(group_id){
      query.group_id = group_id
    }
    
    // if (!validationResult.success) {
    //   return res.status(400).json({ error: validationResult.error });
    // }
    let validCondition = false;

    if (
      checkUser.inForPerson.employee.position_id == 1 ||
      checkUser.inForPerson.employee.position_id == 2 ||
      checkUser.inForPerson.employee.position_id == 9 ||
      checkUser.inForPerson.employee.position_id == 3
    ) {
      let id_dataNhanvien = checkUser.idQLC;
      let id_com = checkUser.inForPerson.employee.com_id;
      query.emp_id = id_dataNhanvien;
      query.company_id = id_com;
      validCondition = true;
    }

    if (
      checkUser.inForPerson.employee.position_id == 7 ||
      checkUser.inForPerson.employee.position_id == 8 ||
      checkUser.inForPerson.employee.position_id == 14 ||
      checkUser.inForPerson.employee.position_id == 16 ||
      checkUser.inForPerson.employee.position_id == 22 ||
      checkUser.inForPerson.employee.position_id == 21 ||
      checkUser.inForPerson.employee.position_id == 18 ||
      checkUser.inForPerson.employee.position_id == 19 ||
      checkUser.inForPerson.employee.position_id == 17
    ) {
      let id_com = checkUser.inForPerson.employee.com_id;
      query.company_id = id_com;
      validCondition = true;
    }

    if (
      checkUser.inForPerson.employee.position_id == 20 ||
      checkUser.inForPerson.employee.position_id == 4 ||
      checkUser.inForPerson.employee.position_id == 12 ||
      checkUser.inForPerson.employee.position_id == 13 ||
      checkUser.inForPerson.employee.position_id == 11 ||
      checkUser.inForPerson.employee.position_id == 10 ||
      checkUser.inForPerson.employee.position_id == 5 ||
      checkUser.inForPerson.employee.position_id == 6
    ) {
      let id_com = checkUser.inForPerson.employee.com_id;
      let id_pb = checkUser.inForPerson.employee.dep_id;
      let nv = await User.find({
        "inForPerson.employee.dep_id": id_pb,
        "inForPerson.employee.com_id": id_com,
      }).select("idQLC");
      query.emp_id = { $in: nv.map((user) => user.idQLC) };
      validCondition = true;
    }
    
    if (time_s && time_e) {
      if (time_s > time_e) {
        res.status(400).json({ error: "Thời gian bắt đầu không thể lớn hơn thời gian kết thúc."});
        return;
      }
      query.created_at = { $gte: time_s, $lte: time_e };
    }
    if (validCondition) {
      const totalItems = await Customer.countDocuments(query);
      const paginatedData = await Customer.find(query)
      .sort({ cus_id : -1 })
        .skip(startIndex)
        .limit(perPage);
      res.status(200).json({
        totalItems,
        currentPage: page,
        data: paginatedData,
      });
    } else {
      res.status(400).json({ error: "khong co ket qua" });
    }
  } catch (error) {
    console.error("Failed to show", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
  }
};


//Xoa khach hang                            
exports.DeleteKH = async (req, res) => {
  try {
    let {cus_id} = req.body;
    if (typeof cus_id === 'undefined') {
      res.status(400).json({ success: false, error: 'cus_id không được bỏ trống' });
    }
    if (typeof cus_id !== 'number' && isNaN(Number(cus_id))) {
      res.status(400).json({ success: false, error: 'cus_id phải là 1 số' });
  }else{
      const existingCustomer = await Customer.findOne({ cus_id: cus_id });
      if (!existingCustomer) {
        res.status(400).json({ success: false, error: ' khách hàng không tồn tại' });
      }
      else if (existingCustomer.is_delete === 1) {
         res.status(400).json({ success: false, error: 'Khách hàng đã bị xóa trước đó' });
      }else{
         await customerService.getDatafindOneAndUpdate(Customer, { cus_id: cus_id }, {
        cus_id: cus_id,
        is_delete: 1,
      });
       res.status(200).json({ success: true, message: 'Xóa thành công' });
      }
    }
  } catch (error) {
    console.error('Failed to delete', error);
   res.status(500).json({ success: false, error: errorMessage });
  }
};

//Api thêm mới Api
exports.addConnectCs = async(req,res) => {
  try{
    let {appID,webhook} = req.body
    let comId = req.user.data.inForPerson.employee.com_id
    let tokenCn = req.headers["authorization"]
    let userID = req.user.idQLC   
    let createDate = new Date();
    
    if (typeof appID === 'undefined') {
      res.status(400).json({ success: false, error: 'appID không được bỏ trống' });
    }
    if (typeof webhook === 'undefined') {
      res.status(400).json({ success: false, error: 'webhook phải là 1 số' });
    }
    let maxID = await customerService.getMaxIDConnectApi(ConnectApi);
      let id = 0;
      if (maxID) {
        id = Number(maxID) + 1;
      }
    let checkCn = await ConnectApi.findOne({company_id : comId})
    if(checkCn){
      res.status(400).json({ success: false, error: "Api kết nối đã có không thể tạo mới"});
    }else{
      if(req.user.data.type == 2){
     let createApi = await new ConnectApi({
         id : id,
         company_id : comId,
         appID : appID,
         webhook : webhook,
         token : tokenCn,
         user_edit_id : comId,
         user_edit_type : 1,
         stt_conn : 1,
         created_at : createDate
     })
     let saveApi = await createApi.save();
          res.status(200).json(saveApi);
    }
    else if(req.user.data.type == 1) {
      let createApi = await new ConnectApi({
        id : id,
        company_id : comId,
        appID : appID,
        webhook : webhook,
        token : tokenCn,
        user_edit_id : userID,
        user_edit_type : 1,
        stt_conn : 1,
        created_at : createDate
    })
    let saveApi = await createApi.save();
         res.status(200).json(saveApi);
    }
    }
    
  }catch (error) {
    console.error('Failed to add', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
  }
  
}

exports.editConnectCs = async(req,res) =>{
  try{
    let {appID,webhook} = req.body
    let comId = req.user.data.inForPerson.employee.com_id
    let tokenCn = req.headers["authorization"]
    let userID = req.user.idQLC ;
    let updateDate = new Date();
    if (typeof appID === 'undefined') {
      res.status(400).json({ success: false, error: 'appID không được bỏ trống' });
    }
    if (typeof webhook === 'undefined') {
      res.status(400).json({ success: false, error: 'webhook phải là 1 số' });
    }
    if(req.user.data.type == 2){
       await customerService.getDatafindOneAndUpdate(ConnectApi,{company_id : comId},{
          id : id,
          company_id : comId,
          appID : appID,
          webhook : webhook,
          token : tokenCn,
          user_edit_id : comId,
          user_edit_type : 1,
          stt_conn : 1,
          updated_at :updateDate
      })
      customerService.success(res, "Api edited successfully");
     }
     else if(req.user.data.type == 1) {
      await customerService.getDatafindOneAndUpdate(ConnectApi,{company_id : comId},{
         id : id,
         company_id : comId,
         appID : appID,
         webhook : webhook,
         token : tokenCn,
         user_edit_id : userID,
         user_edit_type : 1,
         stt_conn : 1,
         updated_at :updateDate
     })
     customerService.success(res, "Api edited successfully");
     }
  }catch (error) {
    console.error('Failed to edit', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
  }
}


exports.ShowConnectCs = async(req,res) => {
  try{
    let comId = req.user.data.inForPerson.employee.com_id
    const check = await ConnectApi.findOne({company_id : comId})
    res.status(200).json(check)
  }catch (error) {
    console.error('Failed to get', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
  }
}

//12314ad