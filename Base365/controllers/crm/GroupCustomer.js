// const GroupCustomer = require("../../models/crm/GroupCustomer")
// const functions = require('../../services/functions')

const functions = require('../../services/functions')

// exports.getListGroup = async(req, res) => {
//     await functions.getDatafind(GroupCustomer, {})
//         .then((groups) => functions.success(res, "Get data successfully", groups))
//         .catch((err) => functions.setError(res, err.message));
// }
// exports.getGroupById = async(req, res) => {
//     const _id = parseInt(req.params.id)
//     const group = await functions.getDatafindOne(GroupCustomer, { _id: _id })
//         .then((group) => res.json(group))
//         .catch((err) => functions.setError(res, err.message))
// }
// exports.createGroup = async(req, res) => {
//     const {
//         groupName,
//         groupDescription,
//         groupParents,
//         departmentId,
//         companyId,
//         employeeShare
//     } = req.body
//     if (!groupName) {
//         //kiểm tra thuộc tính groupName truyền vào
//         functions.setError(res, "groupName must not leave empty")
//     } else {
//         // const _id = Number(maxId) + 1;
//         let maxId = await functions.getMaxID(GroupCustomer);
//         if (!maxId) {
//             maxId = 0;
//         }
//         const _id = Number(maxId) + 1;
//         const group = new GroupCustomer({
//             _id: _id,
//             groupName: groupName
//         })
//         await group.save()
//             .then(() => {
//                 functions.success(res, "Group saved successfully", group);
//             })
//             .catch(err => functions.setError(res, err.message));
//     }
// }
// exports.update = async(req, res) => {
//     const {
//         groupName,
//         groupDescription,
//         groupParents,
//         companyId,
//         departmentId,
//         employeeShare,
//         isDelete
//     } = req.body
//     await functions.getDatafindOneAndUpdate(GroupCustomer, { _id: URLSearchParams.id }, {
//             groupName: groupName,
//             groupDescription: groupDescription,
//             groupParents: groupParents,
//             companyId: companyId,
//             departmentId: departmentId,
//             employeeShare: employeeShare,
//             isDelete: isDelete
//         })
//         .then(() => functions.success(res, "Group Customer update successfully"))
//         .catch((err) => functions.setError(res, err.message))

// }
// exports.delete = async(req, res) => {
//     const listDeleteId = req.body.listDeleteId;
//     if (!listDeleteId || !Array.isArray(listDeleteId)) {
//         functions.setError(res, "listDeleteId must not leave empty")
//     } else {
//         await GroupCustomer.deleteMany({ _id: { $in: listDeleteId } })
//             .then(() => functions.success(res, "Group Customer deleted successfully"))
//             .catch((err) => functions.setError(res, err.message))
//     }
// }