
const CustomerContact = require('../../../models/crm/Customer/contact_customer')
const Customer = require('../../../models/crm/Customer/customer')
const functions = require("../../../services/functions");
const customerService = require('../../../services/CRM/CRMservice')
const HistoryEditCustomer = require('../../../models/crm/history/history_edit_customer')
const ShareCustomer = require('../../../models/crm/tbl_share_customer')

// hàm hiển thị chi tiết khách hàng
exports.findOneCus = async (req,res) =>{
    try {
        let {cus_id} = req.body
    if (typeof cus_id === 'undefined') {
      res.status(400).json({ success: false, error: 'cus_id không được bỏ trống' });
    }
    if (typeof cus_id !== 'number' && isNaN(Number(cus_id))) {
      res.status(400).json({ success: false, error: 'cus_id phải là 1 số' });
  }else{ 
        const findCus = await Customer.findOne({cus_id})
        if(findCus.type == 2) {
                    let data1 = {
                        cus_id : findCus.cus_id,
                        email : findCus.email,
                        name : findCus.name,
                        stand_name : findCus.stand_name,
                        phone_number : findCus.phone_number,
                        logo : findCus.logo,
                        cit_id : findCus.cit_id,
                        district_id : findCus.district_id,
                        ward : findCus.ward,
                        address : findCus.address,
                        ship_invoice_address : findCus.ship_invoice_address,
                        cmnd_ccnd_number : findCus.cmnd_ccnd_number,
                        cmnd_ccnd_address : findCus.cmnd_ccnd_address,
                        cmnd_ccnd_time : findCus.cmnd_ccnd_time,
                        resoure : findCus.resoure,
                        description : findCus.description,
                        tax_code : findCus.tax_code,
                        group_id : findCus.group_id,
                        status : findCus.status,
                        business_areas : findCus.business_areas,
                        category : findCus.category,
                        business_type : findCus.business_type,
                        classify : findCus.classify,
                        bill_city : findCus.bill_city,
                        bil_district: findCus.bil_district,
                        bill_ward: findCus.bill_ward,
                        bill_address: findCus.bill_address,
                        bill_area_code: findCus.bill_area_code,
                        bill_invoice_address: findCus.bill_invoice_address,
                        bill_invoice_address_email: findCus.bill_invoice_address_email,
                        ship_city: findCus.ship_city,
                        ship_area: findCus.ship_area,
                        bank_id : findCus.bank_id,
                        bank_account: findCus.bank_account,
                        revenue : findCus.resoure,
                        rank : findCus.rank,
                        website : findCus.website,
                        number_of_day_owed: findCus.number_of_day_owed,
                        gender : findCus.gender,
                        deb_limit : findCus.deb_limit,
                        share_all : findCus.share_all,
                        type : findCus.type,
                        is_input : findCus.is_input,
                        is_delete : findCus.is_delete,
                        created_at : findCus.created_at,
                        updated_at : findCus.updated_at,
                        id_cus_from : findCus.id_cus_from,
                        cus_from : findCus.cus_from,
                        link : findCus.link 
                    }   
             res.status(200).json(data1);
        }else if(findCus.type == 1) {
            let data2 = {
                        cus_id : findCus.cus_id,
                        email : findCus.email,
                        name : findCus.name,
                        stand_name : findCus.stand_name,
                        phone_number : findCus.phone_number,
                        logo : findCus.logo,
                        cit_id : findCus.cit_id,
                        district_id : findCus.district_id,
                        ward : findCus.ward,
                        address : findCus.address,
                        ship_invoice_address : findCus.ship_invoice_address,
                        resoure : findCus.resoure,
                        description : findCus.description,
                        tax_code : findCus.tax_code,
                        group_id : findCus.group_id,
                        status : findCus.status,
                        business_areas : findCus.business_areas,
                        category : findCus.category,
                        business_type : findCus.business_type,
                        classify : findCus.classify,
                        bill_city : findCus.bill_city,
                        bil_district: findCus.bil_district,
                        bill_ward: findCus.bill_ward,
                        bill_address: findCus.bill_address,
                        bill_area_code: findCus.bill_area_code,
                        bill_invoice_address: findCus.bill_invoice_address,
                        bill_invoice_address_email: findCus.bill_invoice_address_email,
                        ship_city: findCus.ship_city,
                        ship_area: findCus.ship_area,
                        bank_id : findCus.bank_id,
                        bank_account: findCus.bank_account,
                        revenue : findCus.resoure,
                        size : findCus.size,
                        rank : findCus.rank,
                        website : findCus.website,
                        number_of_day_owed: findCus.number_of_day_owed,
                        deb_limit : findCus.deb_limit,
                        share_all : findCus.share_all,
                        type : findCus.type,
                        is_input : findCus.is_input,
                        is_delete : findCus.is_delete,
                        created_at : findCus.created_at,
                        updated_at : findCus.updated_at,
                        id_cus_from : findCus.id_cus_from,
                        cus_from : findCus.cus_from,
                        link : findCus.link
            }
            res.status(200).json(data2);
        }else {
          res.status(400).json({ error: 'khong co ket qua' })
        }
        } 
      }
      catch (error) {
        console.error('Failed to find Customer', error);
        res.status(500).json({ error: 'Failed to find  Customer' });
      }
}

// hàm chỉnh sửa khách hàng 
exports.editCustomer = async(req,res) => {
  try {
    let {
        cus_id,email,name,stand_name,phone_number,cit_id,district_id,ward,address,ship_invoice_address,
        cmnd_ccnd_number,cmnd_ccnd_address,cmnd_ccnd_time,user_handing_over_work,resoure,
        description,tax_code,group_id,status,business_areas,category,business_type,classify,
        bill_city,bil_district,bill_ward,bill_address,bill_area_code,bill_invoice_address,
        bill_invoice_address_email,ship_city,ship_area,bank_id,type,bank_account,
        revenue,size,rank,website,number_of_day_owed,gender,deb_limit,share_all,is_input,is_delete,
        id_cus_from,created_at,cus_from,link,
        content
      } = req.body;
      let logo = req.files.logo ;
      let updateDate = new Date();
      let createHtime = new Date();
      let linkDL = '';
      if (logo) {
        const imageValidationResult = await customerService.validateImage(logo);
        if (imageValidationResult === true) {
          await customerService.uploadFileCRM(cus_id, logo);
          linkDL = customerService.createLinkFileCRM(cus_id, logo.name);
        }
      } 
      if (typeof cus_id === 'undefined') {
        res.status(400).json({ success: false, error: 'cus_id không được bỏ trống' });
      }
      if (typeof cus_id !== 'number' && isNaN(Number(cus_id))) {
        res.status(400).json({ success: false, error: 'cus_id phải là 1 số' });
      }
      if(type == 1 ){
          await customerService.getDatafindOneAndUpdate(Customer,{cus_id : cus_id},{
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
          created_at : created_at,
          updated_at: updateDate,
          id_cus_from: id_cus_from,
          cus_from: cus_from,
          link: link
          })
      //  customerService.success(res, "Customer edited successfully");
          if(typeof content === 'undefined'){
           customerService.success(res, "Customer edited successfully");
          }else {
          let maxID = await customerService.getMaxIDConnectApi(HistoryEditCustomer);
          let id = 0;
          if (maxID) {
          id = Number(maxID) + 1;
          }
          let newHT = new HistoryEditCustomer({
            id : id,
            customer_id : cus_id,
            content : content,
            created_at : createHtime

          })
          let savehis = await newHT.save();
          res.status(200).json({savehis,message: 'Customer edited successfully'}); 
          }
      }
      if(type == 2){
        await customerService.getDatafindOneAndUpdate(Customer,{cus_id : cus_id},{
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
          created_at : created_at,
          updated_at: updateDate,
          id_cus_from: id_cus_from,
          cus_from: cus_from,
          link: link
         })
        //  customerService.success(res, "Customer edited successfully");  
        if(typeof content === 'undefined'){
          customerService.success(res, "Customer edited successfully");
        }else {
        let maxID = await customerService.getMaxIDConnectApi(HistoryEditCustomer);
         let id = 0;
        if (maxID) {
        id = Number(maxID) + 1;
        }
        let newHT = new HistoryEditCustomer({
           id : id,
           customer_id : cus_id,
           content : content,
           created_at : createHtime

        })
        let savehis = await newHT.save();
        res.status(200).json({savehis,message: 'Customer edited successfully'}); 
     }
    }else{
        res.status(400).json({message: 'không có loại khách hang đó'}); 
    }
  
  }  catch (error) {
        console.error('Failed to find Customer', error);
        res.status(500).json({ error: 'Failed to find  Customer' });
      }
}


// hàm hiển thị lịch sử trợ lý kinh doanh (theo id khach hang)
exports.showHisCus = async(req,res) => {
  try {
    let {cus_id} = req.body;
    const perPage = 6; // Số lượng giá trị hiển thị trên mỗi trang
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    if (typeof cus_id === 'undefined') {
      res.status(400).json({ success: false, error: 'cus_id không được bỏ trống' });
    }
    if (typeof cus_id !== 'number' && isNaN(Number(cus_id))) {
      res.status(400).json({ success: false, error: 'cus_id phải là 1 số' });
    }
    let checkHis = await HistoryEditCustomer.findOne({customer_id : cus_id})
    .sort({ id : -1 })
    .skip(startIndex)
    .limit(perPage);
   res.status(200).json(checkHis);
  } catch (error) {
    console.error('Failed to find Customer', error);
    res.status(500).json({ error: 'Failed to find  Customer' });
  }
}


//Ham ban giao cong viec
exports.banGiao = async(req,res) => {
  try{
    let {targets} = req.body;
    let comId = req.user.data.inForPerson.employee.com_id;
    let userID = req.user.idQLC;
    if (!Array.isArray(targets) || targets.length === 0) {
      res.status(400).json({ success: false, error: 'Không có mục tiêu được chọn' });
    }
    for (let i = 0; i < targets.length; i++) {
      let { cus_id, user_edit_id} = targets[i];
      
        await customerService.getDatafindOneAndUpdate(
          Customer,
          { cus_id: cus_id },
          {
            cus_id: cus_id,
            company_id: comId,
            emp_id : userID,
            user_handing_over_work : user_edit_id
          }
        );
        customerService.success(res, " edited successfully");
    }
  } catch (error) {
    console.error('Failed to find Customer', error);
    res.status(500).json({ error: 'Failed to find  Customer' });
  }
}

//hàm chia sẻ khách hàng
exports.ShareCustomer = async (req, res) => {
  try {
    let {com_id,emp_id} = req.body
    // const com_id = req.user.data.inForPerson.employee.com_id;
    // const emp_id = req.user.idQLC;
    const query = {
      company_id: com_id,
      $or: [
        { emp_id: emp_id },
        { emp_share: emp_id }
      ]
    };

    const result = await ShareCustomer.find(query)
      .populate('customer_id')
      .sort({ updated_at: -1 });
    res.json(result);
  } catch (error) {
    console.error('Failed to share customer', error);
    res.status(500).json({ error: 'Failed to share customer' });
  }
};

exports.ChosseCustomer = async(req,res) => {
  try{
    let {arrCus} = req.body
    const customers = await Customer.find({ cus_id: { $in: arrCus } });
    res.json(customers);
  }catch (error) {
    console.error('Failed to get customer', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
}



exports.CombineCustome = async(req,res)=> {
  try {
    let {
      arrCus,
      email,
      name,
      logo,
      stand_name,
      phone_number,
      cit_id,
      district_id,
      ward,
      address,
      ship_invoice_address,
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
      link,
      content
    } = req.body;

    if (!Array.isArray(arrCus)) {
      res.status(400).json({ error: 'arrCus must be an array' });
      return;
    }

    const type = req.body.type || 2;
    if (![1, 2].includes(type)) {
      res.status(400).json({ error: 'Invalid type value' });
      return;
    }

    const comId = req.user.data.inForPerson.employee.com_id;
    const empId = req.user.data.idQLC;
    const validationResult = customerService
    .validateCustomerInput(name,logo,stand_name,tax_code,phone_number,birthday,cit_id,district_id,ward,address,ship_invoice_address,
      gender,cmnd_ccnd_number,cmnd_ccnd_address,cmnd_ccnd_address,resoure,description,introducer,user_edit_id,group_id,status,
      bill_city,bil_district,bill_ward,bill_address,bill_area_code,bill_invoice_address,bill_invoice_address_email,ship_city,ship_area,
      bank_id,revenue,bank_account,size,rank,website,number_of_day_owed,deb_limit,comId);
    if (validationResult !== true) {
      res.status(400).json({ error: 'Invalid customer input' });
      return;
    }

    const maxID = await customerService.getMaxIDCRM(Customer);
    const cus_id = maxID ? Number(maxID) + 1 : 0;

    let createCustomer = new Customer({
      cus_id: cus_id,
      email: email,
      name: name,
      stand_name: stand_name,
      phone_number: phone_number,
      cit_id: cit_id,
      logo: logo,
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
      company_id: comId,
      emp_id: empId,
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

    if (content !== undefined && content.trim() !== '') {
      const maxID = await customerService.getMaxIDConnectApi(HistoryEditCustomer);
      const id = maxID ? Number(maxID) + 1 : 0;

      let newHT = new HistoryEditCustomer({
        id: id,
        customer_id: cus_id,
        content: content,
        created_at: createDate
      });

      let savehis = await newHT.save();
      res.status(200).json({ saveCS, savehis });
    } else {
      res.status(200).json(saveCS);
    }

    // Xóa các id khách hàng từ danh sách
    for (let i = 0; i < arrCus.length; i++) {
      const customerId = arrCus[i];
      await customerService.deleteCustomerById(customerId);
    }

  } catch (error) {
    console.error('Failed to add or choose customer', error);
    res.status(500).json({ error: 'Failed to add or choose customer' });
  }
}


