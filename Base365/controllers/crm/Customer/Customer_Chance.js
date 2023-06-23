const Cus_Chance = require('../../../models/crm/Customer/customer_chance');
const Share_Cus = require("../../../models/crm/tbl_share_customer");
const Share_Chance = require("../../../models/crm/tbl_shareChance");
exports.listChance = async (req, res) => {
    let skip = req.body.skip ? req.body.skip : 1;
    let limit = req.body.limit ? req.body.limit : 10;
    let chances = await Cus_Chance.find().skip((skip - 1) * 10).limit(limit);
    return res.status(200).json({ data: chances, message: "sucess" });
}
exports.create_Chance = async (req, res) => {
    let { com_id, id_customer, contact_id, chance_name, chance_type, commodities, money, stages, success_rate,
        expected_sales, expected_end_date, campaign_id, source, discount_total_rate, discount_total_money,
        total, description, country_chance, city_chance, district_chance, ward_chance, street_chance,
        area_code_chance, address_chance, share_all, emp_id
    } = req.body;
    let maxID = await Cus_Chance.findOne({}, {}, { sort: { id: -11 } }).lean() || 0;
    let new_chance = new Cus_Chance({
        id: maxID.id + 1,
        name: chance_name,
        com_id: com_id,
        cus_id: id_customer,
        contact_id: contact_id,
        type: chance_type,
        group_commodities: commodities,
        money: money,
        stages: stages,
        success_rate: success_rate,
        expected_sales: expected_sales,
        expected_end_date: newDate(expected_end_date),
        campaign_id: campaign_id,
        soure: source,
        emp_id: emp_id,
        discount_total_rate: discount_total_rate.replace(",", ""),
        discount_total_money: discount_total_money.replace(",", ""),
        total_money: total,
        description: description,
        country_change: country_chance,
        city_chance: city_chance,
        district_chace: district_chance,
        ward_chance: ward_chance,
        street_chance: street_chance,
        area_code_chance: area_code_chance,
        address_chance: address_chance,
        share_all: share_all,
        user_id_create: emp_id,
        created_at: new Date(),
        update_at: new Date()
    });
    await new_chance.save();
    return res.status(200).json({ data: new_chance, message: 'sucess' });

}

exports.update_chance = async (req, res) => {
    let { chance_id, id_customer, contact_id, name, chance_type, commodities, money, stages, success_rate,
        expected_sale, expected_end_date, campaign_id, source, discount_total_rate, discount_total_money,
        total, description, country_chance, city_chance, district_chance, ward_chance, street_chance,
        area_code_chance, address_chance, share_all, emp_id, } = req.body;
    let Contact_id;
    if (chance_id > 0 && id_customer > 0 && name != "" && expected_end_date != "") {
        let check_chance = await Cus_Chance.findOne({ id: chance_id, cus_id: id_customer, delete_chance: 0 });
        if (check_chance.contact_id != null && check_chance.contact_id != 0) {
            let arr_contact = check_chance.contact_id.split(",");//contact cũ
            //contact_id la 1 chuoi nhieu gtri
            let arr_contact_id = contact_id.split(",");
            for (let i = 0; i < arr_contact_id.length; i++) {
                let index = arr_contact.indexOf(arr_contact_id[i]);
                if (index != -1) {
                    arr_contact.splice(index, 1);
                }
            }
            arr_contact.unshift(arr_contact_id);
            Contact_id = arr_contact.join(',');
        } else {
            Contact_id = contact_id;
        }
        let Chance_update = await Cus_Chance.findOneAndUpdate({ id: chance_id, cus_id: id_customer }, {
            name: name,
            contact_id: Contact_id,
            type: chance_type,
            group_commodities: commodities,
            money: money,
            stages: stages,
            success_rate: success_rate,
            expected_sales: expected_sale,
            expected_end_date: expected_end_date,
            campaign_id: campaign_id,
            source: source,
            emp_id: emp_id,
            discount_total_rate: discount_total_rate,
            discount_total_money: discount_total_money.replace(",", ""),
            total_money: total.replace(',', ''),
            description: description,
            country_chance: country_chance,
            city_chance: city_chance,
            district_chance: district_chance,
            ward_chance: ward_chance,
            street_chance: street_chance,
            area_code_chance: area_code_chance,
            address_chance: address_chance,
            share_all: share_all,
            user_id_edit: emp_id,
            update_at: new Date()

        })
        await Chance_update.save();
        return res.status(200).json({ data: Chance_update, message: "update sucess" });

    } else {
        return res.status(404).json({ message: "bad request " });
    }
}

exports.deleteChange = async (req, res) => {
    let { chance_id, cus_id } = req.body;
    if (chance_id > 0 && cus_id > 0) {
        let del_chance = await Cus_Chance.findOneAndUpdate({ id: chance_id, cus_id: cus_id }, { delete_chance: 1 });
        return res.status(200).json({ data: del_chance, message: 'sucess' });
    } else {
        return res.status(404).json({ message: "bad request" });
    }
}

exports.shareChance = async (req, res) => {
    console.log("shareChance")
    let id_user = req.body.id_user;
    let { department, employ, role, chance_id, share_all } = req.body;
    let list_dep = department.split(",");
    let list_role = role.split(',');
    let list_emp = employ.split(',');
    let list_chanceId = chance_id.split(',');
    if (share_all != null) {
        let share_related_list = 1;
        let list_emp_id = [];
        let arr_dep_cus = [];// danh sach phong duoc chia se khach hang
        let arr_emp_cus = []; // danh sach nhan vien duoc chia se khach hang 
        let customer = await Cus_Chance.find({ id: { $in: list_chanceId }, delete_chance: 0 });
        customer.map((item, index) => {
            list_emp_id.push(item.cus_id);
        })
        // list_emp_id.map(item => {
        //     console.log(item);
        // })
        let list_emp_share_cus = await Share_Cus.find({ customer_id: { $in: list_emp_id } });
        list_emp_share_cus.map((item, index) => {
            //phòng ban đã được chia sẻ khách hàng
            if (item.dep_id != 0 && arr_dep_cus.includes(item.dep_id) == false) {
                arr_dep_cus.push(item.dep_id);
            }
            //nhân viên đã được chia sẻ khách hàng
            if (item.receiver_id != 0 && arr_emp_cus.includes(item.receiver_id) == false) {
                arr_emp_cus.push(item.receiver_id);
            }
        });
        let array_dep = [];
        if (department != null) {
            let list_department = await Share_Chance.find({ dep_id: { $ne: null }, chance_id: { $in: chance_id }, type: "dep" });
            console.log(list_department);
            list_department.map((item, index) => {
                array_dep.push(item.dep_id);// danh sach nhung co hoi da duojc chia se
            })
            console.log(array_dep);
            //kiểm tra xem danh sách phòng ban được chia sẻ
            let check_dep_all = false;
            let roles = [];
            let array_dep_share = [];
            let role_all;
            list_dep.map((item, index) => {
                if (item == 0) {
                    check_dep_all = true;
                    role_all = list_role[index];
                } else {
                    array_dep_share.push(item);
                    roles.push(list_role[index]);
                }
            })
            if (array_dep_share.length > 0) {
                list_dep.map((item, index) => {
                    if (array_dep.includes(item) == false) {
                        array_dep.push(item);
                        let maxID = Share_Chance.findOne({}, {}, { sort: { id: -1 } }).lean() || 0;

                        let new_share_chance = new Share_Chance({
                            id: maxID.id + 1,
                            dep_id: item,
                            type: "dep",
                            created_at: new Date().getTime()
                        });
                        new_share_chance.save();

                    }
                    if (share_related_list == 1) {


                        if (arr_dep_cus.includes(item) == false) {
                            arr_dep_cus.push(item);
                            let maxID = Share_Cus.findOne({}, {}, { sort: { id: -1 } }).lean() || 0;

                            let new_shareCustomer = new Share_Cus({
                                id: maxID.id + 1,
                                created_at: new Date().getTime(),
                                updated_at: new Date().getTime(),
                                emp_share: id_user,
                                role: list_role[index],
                                share_related_list: 1,
                                dep_id: item,
                                customer_id: list_emp_id

                            });
                            new_shareCustomer.save();
                        }
                    }

                })
            }




        }
        return;

    }
}