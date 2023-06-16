const Phieu = require("../../models/crm/tbl_phieu");
const share_campaign = require("../../models/crm/tbl_share_campaign");
const shareChance = require('../../models/crm/tbl_shareChance');
const shareCustomer = require("../../models/crm/tbl_share_customer");
const Ward = require("../../models/crm/ward");
const history_edit_customer = require("../../models/crm/history/history_edit_customer");
const history_stages = require("../../models/crm/history/history_stages");
const List_new = require("../../models/crm/list/list_new_3312");
const List_order = require("../../models/crm/list/list_order");
const fnc = require('../../services/functions');

exports.tool_phieu = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblPhieu?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_phieu = new Phieu({
                        id: listItem[i].id,
                        company_id: listItem[i].company_id,
                        name: listItem[i].name,
                        number: listItem[i].number,
                        user_create: listItem[i].user_create,
                        money: listItem[i].money,
                        money_history: listItem[i].money_history,
                        contract_id: listItem[i].contract_id,
                        content: listItem[i].content,
                        supplier_id: listItem[i].supplier_id,
                        id_customer: listItem[i].id_customer,
                        name_unit: listItem[i].name_unit,
                        user_contact_name: listItem[i].user_contact_name,
                        user_contact_phone: listItem[i].user_contact_phone,
                        type: listItem[i].type,
                        status: listItem[i].status,
                        accepted: listItem[i].accepted,
                        site: listItem[i].site,
                        is_delete: listItem[i].is_delete,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                        date_created: listItem[i].date_created,
                        date_receit: listItem[i].date_receit,
                    })
                    await new_phieu.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.tbl_share_campaign = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblShareCampaign?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_share_campaign = new share_campaign({
                        id: listItem[i].id,
                        campaign_id: listItem[i].campaign_id,
                        emp_share: listItem[i].emp_share,
                        type: listItem[i].type,
                        dep_id: listItem[i].dep_id,
                        receiver_id: listItem[i].receiver_id,
                        receiver_name: listItem[i].receiver_name,
                        role: listItem[i].role,
                        share_related_list: listItem[i].share_related_list,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,



                    })
                    await new_share_campaign.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.tbl_share_chance = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblShareChance?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_shareChance = new shareChance({
                        id: listItem[i].id,
                        chance_id: listItem[i].chance_id,
                        emp_share: listItem[i].emp_share,
                        type: listItem[i].type,
                        dep_id: listItem[i].dep_id,
                        receiver_id: listItem[i].receiver_id,
                        receiver_name: listItem[i].receiver_name,
                        role: listItem[i].role,
                        share_related_list: listItem[i].share_related_list,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,
                    })
                    await new_shareChance.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.tbl_share_customer = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listTblShareCustomer?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_shareCustormer = new shareCustomer({
                        id: listItem[i].id,
                        customer_id: listItem[i].customer_id,
                        emp_share: listItem[i].emp_share,
                        dep_id: listItem[i].dep_id,
                        receiver_id: listItem[i].receiver_id,
                        role: listItem[i].role,
                        share_related_list: listItem[i].share_related_list,
                        created_at: listItem[i].created_at,
                        created_at: listItem[i].created_at,

                    })
                    await new_shareCustormer.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.ward = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listWard?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_ward = new Ward({
                        ward_id: listItem[i].ward_id,
                        ward_name: listItem[i].ward_name,
                        district_id: listItem[i].district_id,
                    })
                    await new_ward.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.history_edit_customer = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listHistoryEditEustomer?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_history_edit_customer = new history_edit_customer({
                        id: listItem[i].id,
                        customer_id: listItem[i].customer_id,
                        content: listItem[i].customer_id,
                        contact_id: listItem[i].contact_id,
                        type: listItem[i].type,
                        created_at: listItem[i].created_at,

                    })
                    await new_history_edit_customer.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}

exports.history_stages = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listHistoryStages?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_history_stages = new history_stages({
                        id: listItem[i].id,
                        chance_id: listItem[i].chance_id,
                        stages_id: listItem[i].stages_id,
                        stages_name: listItem[i].stages_name,
                        money: listItem[i].money,
                        success_rate: listItem[i].success_rate,
                        expected_sales: listItem[i].expected_sales,
                        time_complete: listItem[i].time_complete,
                        user_id_edit: listItem[i].user_id_edit,
                        created_at: listItem[i].created_at,
                        update_at: listItem[i].update_at,


                    })
                    await new_history_stages.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.list_new_3321 = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listNew3312?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_List_new = new List_new({
                        id: listItem[i].id,
                        com_id: listItem[i].com_id,
                        cus_id: listItem[i].cus_id,
                        id_new: listItem[i].id_new,
                        title: listItem[i].title,
                        content: listItem[i].content,
                        link: listItem[i].link,
                        resoure: listItem[i].resoure,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,

                    })
                    await new_List_new.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}
exports.list_order = async (req, res) => {
    try {
        let result = true;
        let page = 1;
        do {
            let data = await fnc.getDataAxios(`https://crm.timviec365.vn/ApiDataTable/listOrder?page=${page}`);
            let listItem = data.data;
            if (listItem.length > 0) {
                for (let i = 0; i < listItem.length; i++) {
                    let new_List_order = new List_order({
                        id: listItem[i].id,
                        comp_id: listItem[i].comp_id,
                        id_customer: listItem[i].id_customer,
                        emp_id: listItem[i].emp_id,
                        order_date: listItem[i].order_date,
                        quote_id: listItem[i].quote_id,
                        chance_id: listItem[i].chance_id,
                        campaign_id: listItem[i].campaign_id,
                        explanation: listItem[i].explanation,
                        category_order: listItem[i].category_order,
                        number_of_days_owed: listItem[i].number_of_days_owed,
                        delivery_term: listItem[i].delivery_term,
                        payment_expires_date: listItem[i].payment_expires_date,
                        discount: listItem[i].discount,
                        percent_discount: listItem[i].percent_discount,
                        discount_type: listItem[i].discount_type,
                        is_delete: listItem[i].is_delete,
                        status: listItem[i].status,
                        delivery_status: listItem[i].delivery_status,
                        actual_amount_earned: listItem[i].actual_amount_earned,
                        order_fulfillment_costs: listItem[i].order_fulfillment_costs,
                        status_pay: listItem[i].status_pay,
                        invoicing: listItem[i].invoicing,
                        contact_user_id: listItem[i].contact_user_id,
                        country_bill: listItem[i].country_bill,
                        city_bill: listItem[i].city_bill,
                        district_bill: listItem[i].district_bill,
                        ward_bill: listItem[i].ward_bill,
                        address_bill: listItem[i].address_bill,
                        area_code_bill: listItem[i].area_code_bill,
                        address_in_bill: listItem[i].address_in_bill,
                        email_receive: listItem[i].email_receive,
                        receive_user: listItem[i].receive_user,
                        phone: listItem[i].phone,
                        receive_country: listItem[i].receive_country,
                        receive_city: listItem[i].receive_city,
                        receive_district: listItem[i].receive_district,
                        receive_ward: listItem[i].receive_ward,
                        receive_address: listItem[i].receive_address,
                        receive_area_code: listItem[i].receive_area_code,
                        address_delivery: listItem[i].address_delivery,
                        description: listItem[i].description,
                        sum: listItem[i].sum,
                        share_all: listItem[i].share_all,
                        created_date: listItem[i].created_date,
                        type: listItem[i].type,
                        active_by_warehouse: listItem[i].active_by_warehouse,
                        created_at: listItem[i].created_at,
                        updated_at: listItem[i].updated_at,


                    })
                    await new_List_order.save();

                }
                page += 1;
                console.log(page);
            } else {
                result = false;
            }

        } while (result)
        await fnc.success(res, "thanh cong ");
    } catch (error) {
        console.log(error)
        return fnc.setError(res, error)
    }
}