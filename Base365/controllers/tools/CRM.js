const Contact = require('../../models/crm/Customer/contract');
const ContactCustomer = require('../../models/crm/Customer/contact_customer')
const Customer = require('../../models/crm/Customer/customer')
const CustomerCare = require('../../models/crm/Customer/customer_care')
const CustomerChance = require('../../models/crm/Customer/customer_chance')
const CustomerChanceFile = require('../../models/crm/Customer/customer_chance_file')
const CustomerChanceFoot = require('../../models/crm/Customer/customer_chance_foots')
const CustomerFile = require('../../models/crm/Customer/customer_file')
const CustomerGroup = require('../../models/crm/Customer/customer_group')
const CustomerMulti = require('../../models/crm/Customer/customer_multi')
const CustomerNote = require('../../models/crm/Customer/customer_note')
const CustomerStatus = require('../../models/crm/Customer/customer_status')

const fnc = require('../../services/functions');


exports.toolContact = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listContract?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(Contact, {id: data[i].id})
                    if(post == null){
                         let newC = new Contact({
                        id: data[i].id,
                        id_customer: data[i].id_customer,
                        user_created: data[i].user_created,
                        id_form_contract: data[i].id_form_contract,
                        status: data[i].status,
                        emp_id: data[i].emp_id,
                        comp_id: data[i].comp_id,
                        path_dowload: data[i].path_dowload,
                        is_delete: data[i].is_delete,
                        created_at: createAt,
                        updated_at: updateAt,
                        
                    });
                    await newC.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolContactCustomer  = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {          
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listContactCustomer?page=${page}` );
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(ContactCustomer, {contact_id: data[i].contact_id})
                    if(post == null) {
                        let newCC = new ContactCustomer({
                        contact_id: data[i].contact_id,
                        id_customer: data[i].id_customer,
                        middle_name: data[i].middle_name,
                        name: data[i].name,
                        fullname: data[i].fullname,
                        vocative: data[i].vocative,
                        logo: data[i].logo,
                        contact_type: data[i].contact_type,
                        titles: data[i].titles,
                        department : data[i].department,
                        office_phone: data[i].office_phone,
                        office_email: data[i].office_email,
                        personal_phone: data[i].personal_phone,
                        personal_email: data[i].personal_email,
                        social: data[i].social,
                        social_detail: data[i].social_detail,
                        source: data[i].source,
                        country_contact: data[i].country_contact,
                        city_contact: data[i].city_contactl,
                        district_contact: data[i].district_contact,
                        ward_contact: data[i].ward_contact,
                        address_contact: data[i].address_contact,
                        area_code_contact: data[i].area_code_contact,
                        country_ship: data[i].country_ship,
                        city_ship: data[i].city_ship,
                        district_ship: data[i].district_ship,
                        ward_ship: data[i].ward_ship,
                        address_ship: data[i].address_ship,
                        area_code_ship: data[i].area_code_ship,
                        description: data[i].description,
                        share_all: data[i].share_all,
                        accept_phone: data[i].accept_phone,
                        accept_email: data[i].accept_email,
                        user_create_id: data[i].user_create_id,
                        user_create_type: data[i].user_create_type,
                        user_edit_id: data[i].user_edit_id,
                        user_edit_type: data[i].user_edit_type,
                        is_delete: data[i].is_delete,
                        created_at: createAt,
                        updated_at: updateAt,

                    });
                    await newCC.save();
                    }    
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCustomer = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {          
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomer?page=${page}` );
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    let CMNDtime = null;
                    
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    if(data[i].cmnd_ccnd_time !=0 ){
                        CMNDtime = new Date(data[i].cmnd_ccnd_time * 1000)
                    }
                    let post = await fnc.getDatafindOne(Customer, {cus_id: data[i].cus_id})
                    if(post == null) {
                        let newCS = new Customer({
                        cus_id: data[i].cus_id,
                        email: data[i].email,
                        phone_number: data[i].phone_number,
                        name: data[i].name,
                        stand_name: data[i].fullname,
                        logo: data[i].logo,
                        birthday : data[i].birthday,
                        tax_code: data[i].tax_code,
                        cit_id: data[i].cit_id,
                        district_id : data[i].district_id,
                        ward: data[i].ward,
                        address : data[i].address,
                        ship_invoice_address: data[i].ship_invoice_address,
                        gender : data[i]. gender,
                        cmnd_ccnd_number: data[i].cmnd_ccnd_number,
                        cmnd_ccnd_address: data[i].cmnd_ccnd_address,
                        cmnd_ccnd_time: CMNDtime,
                        resoure : data[i].resoure,
                        description: data[i].description,
                        district_contact: data[i].district_contact,
                        introducer: data[i].ward_contact,
                        contact_name : data[i].address_contact,
                        contact_email : data[i].area_code_contact,
                        contact_phone : data[i].country_ship,
                        contact_gender: data[i].city_ship,
                        company_id : data[i].district_ship,
                        emp_id : data[i].ward_ship,
                        user_handing_over_work : data[i].address_ship,
                        user_create_id : data[i].area_code_ship,
                        user_create_type : data[i].description,
                        user_edit_id : data[i].user_edit_id,
                        user_edit_type: data[i].user_edit_type,
                        group_id : data[i].group_id,
                        status : data[i].status,
                        business_areas : data[i].business_areas,
                        classify : data[i].classify,
                        user_edit_type: data[i].user_edit_type,
                        business_type : data[i].business_type,
                        category : data[i].category,
                        bill_city : data[i].bill_city,
                        bill_district : data[i].bill_district,
                        bill_ward : data[i].bill_ward,
                        bill_address : data[i].bill_address,
                        bill_area_code : data[i].bill_area_code,
                        bill_invoice_address : data[i].bill_invoice_address,
                        bill_invoice_address_email : data[i].bill_invoice_address_email,
                        ship_city : data[i].ship_city,
                        ship_area : data[i].ship_area,
                        bank_id   : data[i].bank_id,
                        bank_account : data[i].bank_account,
                        revenue : data[i].revenue,
                        size : data[i].size,
                        rank : data[i].rank,
                        website : data[i].website,
                        number_of_days_owed : data[i].number_of_days_owed,
                        debt_limit : data[i].debt_limit,
                        share_all : data[i].share_all,
                        type : data[i].type,
                        is_input : data[i].is_input,
                        is_delete : data[i].is_delete,
                        created_at : createAt,
                        updated_at : updateAt,
                        id_cus_from : data[i].id_cus_from,
                        cus_from : data[i].cus_from,
                        link : data[i].blink

                    });
                    await newCS.save();
                    }    
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCustomerCare = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerCare?page=${page}`, )
            let data = listItems.data;
            console.log(data.length)
            
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    let createDate = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    if (data[i].create_date != 0) {
                        createDate = new Date(data[i].create_date * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerCare, {id: data[i].id})
                    if(post == null){
                         let newCR = new CustomerCare({
                        id: data[i].id,
                        name: data[i].name,
                        id_creator: data[i].id_creator,
                        create_date: createDate,
                        option_care: data[i].option_care,
                        set_up_calendar: data[i].set_up_calendar,
                        description: data[i].description,
                        count: data[i].count,
                        company_id: data[i].company_id,
                        emp_id: data[i].emp_id,
                        is_delete: data[i].is_delete,
                        site: data[i].site,
                        created_at: createAt,
                        updated_at: updateAt, 
                    });
                    await newCR.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

 exports.toolCustomerChance = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {          
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerChance?page=${page}` );
            let data = listItems.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    let expectedDate = null;
                    
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    if(data[i].expected_end_date !=0 ){
                        expectedDate = new Date(data[i].expected_end_date * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerChance, {id: data[i].id})
                    if(post == null) {
                        let newCS = new CustomerChance({
                        id: data[i].id,
                        name: data[i].name,
                        com_id: data[i].com_id,
                        cus_id: data[i].cus_id,
                        contact_id : data[i].contact_id,
                        type: data[i].type,
                        group_commodities: data[i].group_commodities,
                        money : data[i].money,
                        stages: data[i].stages,
                        success_rate : data[i].success_rate,
                        expected_sales: data[i].expected_sales,
                        expected_end_date : expectedDate,
                        campaign_id: data[i].campaign_id,
                        source: data[i].source,
                        emp_id: data[i].emp_id,
                        discount_total_rate : data[i].discount_total_rate,
                        discount_total_money : data[i].discount_total_money,
                        total_money: data[i].total_money,
                        description: data[i].description,
                        country_chance : data[i].country_chance,
                        city_chance : data[i].city_chance,
                        district_chance : data[i].district_chance,
                        ward_chance : data[i].ward_chance,
                        street_chance : data[i].street_chance,
                        area_code_chance : data[i].area_code_chance,
                        address_chance : data[i].address_chance,
                        share_all : data[i].share_all,
                        user_id_create : data[i].user_id_create,
                        user_id_edit : data[i].user_id_edit,
                        result: data[i].result,
                        reason : data[i].reason,
                        time_complete : data[i].time_complete,
                        delete_chance : data[i].delete_chance,
                        created_at : createAt,
                        updated_at : updateAt
                    });
                    await newCS.save();
                    }    
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCustomerChanceFile = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerChanceFile?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].update_at != 0) {
                        updateAt = new Date(data[i].update_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerChanceFile, {id: data[i].id})
                    if(post == null){
                        let newCF = new CustomerChanceFile({
                        id: data[i].id,
                        file_name : data[i].file_name,
                        cus_id: data[i].cus_id,
                        user_created_id : data[i].user_created_id,
                        chance_id: data[i].chance_id,
                        file_size: data[i].file_size,
                        created_at:  createAt,
                        update_at:  updateAt
                    });
                    await newCF.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};


exports.toolChanFoots  = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerChanceFoots?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                   
                    let post = await fnc.getDatafindOne(CustomerChanceFoot, {id: data[i].id})
                    if(post == null){
                        let newCFO = new CustomerChanceFoot({
                        id: data[i].id,
                        chance_id : data[i].chance_id,
                        foots_id: data[i].foots_id,
                        foots_name : data[i].foots_name,
                        unit_of_measure: data[i].unit_of_measure,
                        quantity: data[i].quantity,
                        price: data[i].price,
                        discount_rate: data[i].discount_rate,
                        discount_money: data[i].discount_money,
                        tax: data[i].tax,
                        tax_money: data[i].tax_money,

                    });
                    await newCFO.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};


exports.toolCusFile  = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerFile?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerFile, {id: data[i].id})
                    if(post == null){
                        let newCuF = new CustomerFile({
                        id: data[i].id,
                        file_name : data[i].file_name,
                        cus_id: data[i].cus_id,
                        user_created_id : data[i].user_created_id,
                        file_size: data[i].file_size,
                        created_at : createAt,

                    });
                    await newCuF.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomerGroup =  async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerGroup?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerGroup, {gr_id: data[i].gr_id})
                    if(post == null){
                        let newCG = new CustomerGroup({
                            gr_id: data[i].gr_id,
                            gr_name : data[i].gr_name,
                            gr_description: data[i].gr_description,
                            group_parent : data[i].group_parent,
                            company_id: data[i].company_id,
                            dep_id: data[i].dep_id,
                            emp_id: data[i].emp_id,
                            count_customer: data[i].count_customer,
                            is_delete: data[i].is_delete,
                            created_at : createAt,
                            updated_at  : updateAt

                    });
                    await newCG.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomeMulti =  async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerMulti?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    
                    let post = await fnc.getDatafindOne(CustomerMulti, {id: data[i].id})
                    if(post == null){
                        let newCM = new CustomerMulti({
                            id: data[i].id,
                            customer_id : data[i].customer_id,
                            link: data[i].link,   

                    });
                    await newCM.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomerNote = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerNote?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerNote, {id: data[i].id})
                    if(post == null){
                        let newCN = new CustomerNote({
                            id: data[i].id,
                            content : data[i].content,
                            cus_id: data[i].cus_id,
                            user_created_id : data[i].user_created_id,
                            created_at : createAt,
                            updated_at  : updateAt

                    });
                    await newCN.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};

exports.toolCustomerStatus = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listCustomerStatus?page=${page}`, )
            let data = listItems.data;
            console.log(data.length) 
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let createAt = null;
                    let updateAt = null;
                    if (data[i].created_at != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].updated_at != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(CustomerStatus, {stt_id: data[i].stt_id})
                    if(post == null){
                        let newCS = new CustomerStatus({
                            id: data[i].id,
                            stt_name : data[i].stt_name,
                            com_id: data[i].com_id,
                            created_user : data[i].created_user,
                            type_created : data[i].type_created,
                            status : data[i].status,
                            is_delete : data[i].is_delete,
                            created_at : createAt,
                            updated_at  : updateAt

                    });
                    await newCS.save();
                    }
                }
                page+=1;
                console.log(page)
            } else result = false;   
        } while (result);
        return fnc.success(res, 'Thành Công');
    } catch (err) {
        return fnc.setError(res, err);
    }
};