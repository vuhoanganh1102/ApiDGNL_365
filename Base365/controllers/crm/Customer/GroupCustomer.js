// const GroupCustomer = require("../../models/crm/GroupCustomer")
const functions = require('../../../services/functions')
const serviceCRM = require('../../../services/CRM/CRMservice')
const Customer_group = require("../../../models/crm/Customer/customer_group");
const { find } = require('../../../models/Users');
const Users = require('../../../models/Users');
exports.getListGroup = async (req, res) => {
    try {
        let name_gr = req.body.name_gr;
        let id_parent = req.body.id_parent;
        let skip = Number(req.body.skip) || 1;
        let limit = Number(req.body.limit) || 10;
        let list_Cus_gr = [];
        let Cus_gr = await Customer_group.find({ gr_name: { $regex: `${name_gr}` }, group_parent: 0 }).skip((skip - 1) * limit).limit(limit);

        return res.status(200).json({ data: Cus_gr, count: Cus_gr.length, message: "success" });
    } catch (error) {
        console.error("Failed to show", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }


}

exports.createGroup = async (req, res) => {
    console.log("create)KHJ");
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

        }else{
            res.status(400).json({error : 'tên đã được sử dụng'})
        }


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

exports.showListShareEmp = async (req, res) => {
    const { gr_id } = req.body;
  
    if (gr_id) {
      const gr_detail = await Customer_group.findOne({ gr_id, is_delete: 0 }, 'dep_id emp_id').exec(); // Get group details
  
      if (gr_detail) {
        let all_share = '';
        const data_emp = [];
  
        if (gr_detail.dep_id === 'all') {
          all_share = "Tất cả nhân viên";
        } else if (gr_detail.dep_id) {
          const arr_dep = gr_detail.dep_id.split(',');
  
          const list_emp_promises = arr_dep.map((depId) => {
            return serviceCRM.getEmployeesFromDepartment(depId) // Get employees from selected departments as an array of promises
          });
  
          const list_emp = await Promise.all(list_emp_promises); // Wait for all promises to resolve
  
          if (gr_detail.emp_id === 'all') {
            arr_dep.forEach((depId) => {
              list_emp.forEach((emp) => {
                if (emp.dep_id === depId) {
                  const img = emp.ep_image ? `https://chamcong.24hpay.vn/upload/employee/${emp.ep_image}` : '/assets/img/user_kh.png';
                  const depName = emp.dep_name;
                  const empId = emp.ep_id;
                  const empName = emp.ep_name;
                  data_emp.push({ imgSrc: img, empId, empName, depName });
                }
              });
            });
            gr_detail.check_emp_all = true;
          } else {
            const emp_share = gr_detail.emp_id.split(',');
           
            arr_dep.forEach((depId) => {
              list_emp.forEach((emp) => {
                console.log(emp);
                if (emp.dep_id === depId && emp_share.includes(emp.ep_id)) {
                  const img = emp
                  data_emp.push({img});
                }
              });
            });
          }
        }
  
        const data = {
          all_share,
          list_share: data_emp,
        };
  
        res.json({ success: true, message: 'Danh sách nhân viên được chia sẻ', data });
      } else {
        res.json({ success: false, message: 'Không tìm thấy chi tiết nhóm khách hàng' });
      }
    } else {
      res.json({ success: false, message: 'Vui lòng cung cấp gr_id' });
    }
  };
  
