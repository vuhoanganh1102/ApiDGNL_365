// const GroupCustomer = require("../../models/crm/GroupCustomer")
const functions = require('../../../services/functions')
const serviceCRM = require('../../../services/CRM/CRMservice')
const Customer_group = require("../../../models/crm/Customer/customer_group");
const Users = require('../../../models/Users');


exports.getListGroup = async (req, res) => {
    try {
        let { page, gr_name } = req.body;
        const perPage = 10; // Số lượng giá trị hiển thị trên mỗi trang
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;

        if (req.user.data.type == 1) {
            let com_id = req.user.data.idQLC
            let showGr = await Customer_group.find({ company_id: com_id, is_delete: 0 })
                .sort({ gr_id: -1 })
                .skip(startIndex)
                .limit(perPage);
            return res.status(200).json({ showGr });
        }

        if (req.user.data.type == 2) {
            let emp_id = req.user.data.idQLC
            let dep_id = req.user.data.inForPerson.employee.dep_id
            let query = {
                is_delete: 0,
                company_id: com_id,
                $or: [
                    { emp_id: { $in: [emp_id] } },
                    { dep_id: { $in: [dep_id] } },
                    { emp_id: 'all' },
                    { dep_id: 'all' },
                ],
            };

            if (gr_name) {
                query.gr_name = { $regex: new RegExp(gr_name, 'i') };
            }

            let checkEmp = await Customer_group.find(query)
                .sort({ gr_id: -1 })
                .skip(startIndex)
                .limit(perPage);
            return res.status(200).json({ checkEmp });
        } else {
            return res.status(400).json({ error: 'Bạn không có quyền' });
        }
    } catch (error) {
        console.error("Failed to show", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
};



exports.createGroup = async (req, res) => {
    try {
        const {
            groupName,
            groupDescription,
            groupParents,
            companyId,
            dep_id,
            emp_id,


        } = req.body
        if (!groupName) {
            //kiểm tra thuộc tính groupName truyền vào
            functions.setError(res, "groupName must not leave empty")

        } if (groupName) {
            const checkName = await Customer_group.findOne({ gr_name: groupName, company_id: req.user.company_id });
            if (!checkName) {
                let depId = dep_id
                let maxId = 0;
                let Cus_gr = await Customer_group.findOne({}, {}, { sort: { gr_id: -1 } }).lean() || 0;
                if (Cus_gr) {
                    maxId = Cus_gr.gr_id;
                }
                let group = new Customer_group({
                    gr_id: maxId,
                    gr_name: groupName,
                    gr_description: groupDescription,
                    group_parent: (groupParents !== null) ? groupParents : 0,
                    company_id: companyId,
                    dep_id: dep_id,
                    emp_id: emp_id,
                    created_at: new Date(),
                    updated_at: new Date(),

                })
                await group.save();
                return res.status(200).json({ data: group, message: "success" });

            } else {
                res.status(400).json({ error: 'tên đã được sử dụng' })
            }

        }
    } catch (error) {
        console.error("Failed to create", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }




}


exports.update = async (req, res) => {
    const {
        gr_id,
        name,
        group_cus_parent,
        description,
        share_group_child,
        dep_id,
        emp_id,
        emp_id_share
    } = req.body;

    if (name && gr_id) {
        try {
            // Kiểm tra sự tồn tại của nhóm khách hàng
            const check = await Customer_group.findOne({ gr_name: name, gr_id: gr_id });
            if (check) {
                error_msg(res, 'Nhóm khách hàng đã tồn tại', { load: false });
                return;
            }

            // Cập nhật nhóm khách hàng
            const updatedGroup = await Customer_group.findByIdAndUpdate(
                gr_id,
                {
                    gr_name: name,
                    gr_description: description,
                    group_parent: group_cus_parent || 0,
                    dep_id: dep_id,
                    emp_id: emp_id,
                    updated_at: Date.now()
                },
                { new: true }
            );

            if (updatedGroup) {
                // Chia sẻ nhóm khách hàng con
                if (group_parent === 0 && share_group_child === 1) {
                    // Lấy danh sách nhóm khách hàng con
                    const list_gr_child = await Customer_group.find({ company_id: company_id, group_parent: gr_id, is_delete: 0 });

                    const data_update_child = {
                        dep_id: dep_id,
                        emp_id: emp_id,
                        updated_at: Date.now()
                    };

                    const gr_id_child = list_gr_child.map(item => item.gr_id);

                    if (gr_id_child.length > 0) {
                        const condition_update_child = { gr_id: { $in: gr_id_child } };
                        await Customer_group.updateMany(condition_update_child, data_update_child);
                    }
                }

                success(res, "Chỉnh sửa nhóm khách hàng thành công!");
            } else {
                error_msg(res, 'Có lỗi!', { load: true });
            }
        } catch (err) {
            error_msg(res, err.message);
        }
    } else {
        error_msg(res, 'Có lỗi!', { load: true });
    }
};





exports.delete = async (req, res) => {
    try {
        const listDeleteId = req.body.listDeleteId;
        if (!listDeleteId || !Array.isArray(listDeleteId)) {
            functions.setError(res, "listDeleteId must not leave empty")
        } else {
            await GroupCustomer.deleteMany({ _id: { $in: listDeleteId } })
                .then(() => functions.success(res, "Group Customer deleted successfully"))
                .catch((err) => functions.setError(res, err.message))
        }
    } catch (error) {
        console.error("Failed to show", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }


}


