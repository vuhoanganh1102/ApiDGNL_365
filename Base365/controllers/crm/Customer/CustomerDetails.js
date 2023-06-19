const Customer = require('../../../models/crm/Customer/customer')
let functions = require('../../../services/functions')




// hàm hiển thị chi tiết khách hàng
exports.findOneCus = async (req,res) =>{
    try {
        let {cus_id} = req.body
        if(Number.isNaN(cus_id)) {
            throw { code: 704, message: "cus_id required" }; 
        }else {
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
                        size : findCus.size,
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
            res.status(200).json(data2);
        }else {
            functions.setError(res, "cant find Customer")
        }
        } 
      }
      catch (error) {
        console.error('Failed to find Customer', error);
        res.status(500).json({ error: 'Failed to find  Customer' });
      }
}