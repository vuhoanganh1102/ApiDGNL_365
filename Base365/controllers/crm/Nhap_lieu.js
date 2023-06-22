const Customer = require("../../models/crm/Customer/customer");
const Cus_Group = require("../../models/crm/Customer/customer_group");
exports.nhap_lieu = async (req, res) => {
    // ['name', 'resoure', 'phone_number', 'email', 'description', 'parent_group', 'child_group', 'user_create_id', 'user_create_type'];
    let { phone_number, email, name, resoure, description, parent_group, child_group, user_create_id } = req.body;
    let check_phoneNumber = await Customer.findOne({ phone_number: phone_number }, {}, { sort: { cus_id: -1 } }).lean() || 0;

    let timeCreate = check_phoneNumber.created_at.getTime() + 604800000;

    if (timeCreate >= new Date().getTime()) {
        return res.status(200).json({ message: "Số điện thoại này đã được tạo trong thời gian 7 ngày gần đây" });
    } else {
        let max_ID = 0;
        let max_cus = await Customer.findOne({}, {}, { sort: { cus_id: -1 } }).lean() || 0;
        if (max_cus) {
            max_ID = max_cus.cus_id;
        }
        //group_id
        let group_id = (child_group != null && child_group != 0) ? child_group : parent_group;
        let list_ep_id = [];
        if (group_id != 0) {
            let gr_cus = await Cus_Group.findOne({ gr_id: group_id });
            if (gr_cus.dep_id == 'all') {

            }

        }
        let new_customer = new Customer({
            cus_id: max_ID + 1,
            email: email,
            resoure: resoure,
            phone_number: phone_number,
            name: name,
            description: description,
            user_create_type: user_create_id,
            user_edit_id: user_create_id,
            group_id: group_id,
            type: 2,
            is_input: 1,
            //emp_id: ,
            created_at: new Date(),
            updated_at: new Date()
        })
        await new_customer.save();


        return res.status(200).json({ data: check_phoneNumber.created_at, message: "success" });
    }


}