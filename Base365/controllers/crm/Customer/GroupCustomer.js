// const GroupCustomer = require("../../models/crm/GroupCustomer")
const functions = require('../../../services/functions')
const Customer_group = require("../../../models/crm/Customer/customer_group");
exports.getListGroup = async (req, res) => {
    let name_gr = req.body.name_gr;
    let id_parent = req.body.id_parent;
    let skip = Number(req.body.skip) || 1;
    let limit = Number(req.body.limit) || 10;
    let list_Cus_gr = [];
    let Cus_gr = await Customer_group.find({ gr_name: { $regex: `${name_gr}` }, group_parent: 0 }).skip((skip - 1) * limit).limit(limit);

    return res.status(200).json({ data: Cus_gr, count: Cus_gr.length, message: "success" });

}
// exports.getGroupById = async (req, res) => {
//     const _id = parseInt(req.params.id)
//const group = await functions.getDatafindOne(GroupCustomer, { _id: _id })
//         .then((group) => res.json(group))
//         .catch((err) => functions.setError(res, err.message))
//}
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
    } else {
        let maxId = 0;
        let Cus_gr = await Customer_group.findOne({}, {}, { sort: { gr_id: -1 } }).lean() || 0;
        if (Cus_gr) {
            maxId = Cus_gr.gr_id;
        }

        console.log(maxId);

        let group = new Customer_group({
            gr_id: maxId,
            gr_name: groupName,
            gr_description: groupDescription,
            group_parent: groupParents,
            company_id: companyId,
            dep_id: dep_id,
            emp_id: emp_id,
            created_at: new Date().getTime(),
            updated_at: new Date().getTime(),

        })
        await group.save();
        return res.status(200).json({ data: group, message: "success" });

    }

}
exports.update = async (req, res) => {
    console.log("updateG Group_KH");
    const { id,
        groupName,
        groupDescription,
        groupParents,
        companyId,
        departmentId,
        employeeShare_id,
    } = req.body;

    // console.log(' URLSearchParams.id' + URLSearchParams.id);
    console.log(' id: ' + id);
    // await functions.getDatafindOneAndUpdate(Customer_group, { gr_id: URLSearchParams.id }, {
    await functions.getDatafindOneAndUpdate(Customer_group, { gr_id: id, company_id: companyId, }, {
        gr_name: groupName,
        gr_description: groupDescription,
        group_parent: groupParents,
        company_id: companyId,
        dep_id: departmentId,
        emp_id: employeeShare_id,
        updated_at: new Date().getTime()
    })
        .then(() => functions.success(res, "Group Customer update successfully"))
        .catch((err) => functions.setError(res, err.message));
}
exports.delete = async (req, res) => {
    const listDeleteId = req.body.listDeleteId;
    if (!listDeleteId || !Array.isArray(listDeleteId)) {
        functions.setError(res, "listDeleteId must not leave empty")
    } else {
        await GroupCustomer.deleteMany({ _id: { $in: listDeleteId } })
            .then(() => functions.success(res, "Group Customer deleted successfully"))
            .catch((err) => functions.setError(res, err.message))
    }
}
