const Contact = require('../../models/crm/Customer/contact');
const ContactCustomer = require('../../models/crm/Customer/contact_customer')
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
                    if (data[i].time_create != 0) {
                        createAt = new Date(data[i].created_at * 1000)
                    }
                    if (data[i].time_tiep_nhan != 0) {
                        updateAt = new Date(data[i].updated_at * 1000)
                    }
                    let post = await fnc.getDatafindOne(Contact, {_id: data[i].id})
                    if(post == null){
                         let newC = new Contact({
                        _id: data[i].id,
                        id_customer: data[i].id_customer,
                        user_created: data[i].user_created,
                        id_form_contract: data[i].id_form_contract,
                        status: data[i].status,
                        emp_id: data[i].emp_id,
                        comp_id: data[i].comp_id,
                        path_dowload: data[i].path_dowload,
                        is_delete: data[i].is_delete,
                        created_at: data[i].createAt,
                        updated_at: data[i].updateAt
                        
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
            const form = new FormData();
            form.append('page', page);

            const response = await axios.post('https://crm.timviec365.vn/ApiDataTable/listContactCustomer', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data.data
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const cate = new ContactCustomer({
                        _id: data[i].contact_id,
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
                        created_at: data[i].created_at,
                        updated_at: data[i].updated_at,

                    });
                    await PriceList.create(cate);
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