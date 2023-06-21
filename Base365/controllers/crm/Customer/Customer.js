
const CustomerContact = require('../../../models/crm/Customer/contact_customer')
const Customer = require('../../../models/crm/Customer/customer')
const functions = require("../../../services/functions");
const customerService = require('../../../services/CRM/CRMservice')
const User = require('../../../models/Users')
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
     
     const com_id = req.user.data
     console.log(com_id);
     return
    const validationResult = customerService.validateCustomerInput(name,email,address,phone_number,type,company_id);

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
exports.showKH = async(req,res) =>{
  try{
    
    let {page} = req.body
    const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
    const userId = req.user.data.idQLC
    const startIndex = (page - 1) * perPage; 
    const endIndex = page * perPage; 
  const checkUser = await User.findOne({idQLC : userId})
  if(
       checkUser.inForPerson.employee.position_id == 1 
    || checkUser.inForPerson.employee.position_id == 2 
    || checkUser.inForPerson.employee.position_id == 9 
    || checkUser.inForPerson.employee.position_id == 3
    )
    { 
     
      let id_dataNhanvien = checkUser.idQLC
      let id_com = checkUser.inForPerson.employee.com_id
      let showNV = await Customer.find({emp_id : id_dataNhanvien,company_id : id_com,is_delete : 0}).skip(startIndex).limit(perPage);
      res.status(200).json(showNV);
    }
    else if(
      checkUser.inForPerson.employee.position_id == 7 ||
      checkUser.inForPerson.employee.position_id == 8 ||
      checkUser.inForPerson.employee.position_id == 14 ||
      checkUser.inForPerson.employee.position_id == 16 ||
      checkUser.inForPerson.employee.position_id == 22 ||
      checkUser.inForPerson.employee.position_id == 21 ||
      checkUser.inForPerson.employee.position_id == 18 ||
      checkUser.inForPerson.employee.position_id == 19 ||
      checkUser.inForPerson.employee.position_id == 17 ){
      let id_com = checkUser.inForPerson.employee.com_id
      let showGD = await Customer.find({company_id : id_com,is_delete : 0}).skip(startIndex).limit(perPage)
      res.status(200).json(showGD)
    }
    else if (
    checkUser.inForPerson.employee.position_id ==20 ||
    checkUser.inForPerson.employee.position_id == 4 ||
    checkUser.inForPerson.employee.position_id ==12 ||
    checkUser.inForPerson.employee.position_id ==13 ||
    checkUser.inForPerson.employee.position_id ==11 ||
    checkUser.inForPerson.employee.position_id ==10 ||
    checkUser.inForPerson.employee.position_id ==5 ||
    checkUser.inForPerson.employee.position_id ==6 ) {
      let id_com = checkUser.inForPerson.employee.com_id
      let id_pb = checkUser.inForPerson.employee.dep_id
      
      let nv = await User.find({ 'inForPerson.employee.dep_id': id_pb, 'inForPerson.employee.com_id': id_com }).select(
        'idQLC'
      );
      
      const totalItems = await Customer.countDocuments({
        emp_id: { $in: nv.map((user) => user.idQLC) },
        is_delete: 0,
      });

      const paginatedData = await Customer.find({
        emp_id: { $in: nv.map((user) => user.idQLC) },
        is_delete: 0,
      })
        .skip(startIndex)
        .limit(perPage);

      res.status(200).json({
        totalItems,
        currentPage: page,
        data: paginatedData,
      });
  }
  else {
    res.status(400).json({ error: 'khong co ket qua' })
  }   
  }catch (error) {
    console.error('Failed to show', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
  }
}
                                 
//Xoa khach hang
exports.DeleteKH = async (req,res) => {
  try{let {cus_id} = req.body;
  if (isNaN(!cus_id)) {
    throw { code: 704, message: " cus_id required" };
}else{
  await customerService.getDatafindOneAndUpdate(Customer,{cus_id : cus_id},{
    cus_id: cus_id,
    is_delete: 1,
 })
 res.status(200).json({ message: 'xoa thanh cong' })
}
}catch (error) {
  console.error('Failed to show', error);
  res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
}
  

}                             


