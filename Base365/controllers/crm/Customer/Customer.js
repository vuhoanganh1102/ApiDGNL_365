
const CustomerContact = require('../../../models/crm/Customer/contact_customer')
const Customer = require('../../../models/crm/Customer/customer')
const functions = require("../../../services/functions");
const customerService = require('../../../services/CRM/CRMservice')

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
     console.log(type);
    const validationResult = customerService.validateCustomerInput(name,email,address,phone_number,type);

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
 

                                 
                                    

// exports.addCustomer = async (req, res) => {
//   try {
//     let { name, stand, logo, birthday, tax_code, cit_id, district_id, ward, address } = req.body
//   } catch (error) {
//     res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
//   }
// }
// nhosm khách hàng
