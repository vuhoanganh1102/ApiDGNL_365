const express = require('express')
const router = express.Router();
const formData = require("express-form-data")
const GroupCustomerController = require('../../../controllers/crm/Customer/GroupCustomer')

// // get danh sách group
// get danh sách group
router.post("/list_group_khach_hang", formData.parse(), GroupCustomerController.getListGroup)

// get group theo i
//router.get("/:id", GroupCustomerController.getGroupById)

//tạo group mới
// console.log("routers");
router.post("/create_GroupKH",formData.parse(), GroupCustomerController.createGroup)

//chỉnh sửa các thuộc tính 1 group
router.post("/update_GroupKH",formData.parse(), GroupCustomerController.update)

// xoá group chỉ định
router.post("/delete_khach_hang",formData.parse(), GroupCustomerController.delete)

//Api hiện chia sẻ
router.post('/showShareGroup',formData.parse(),GroupCustomerController.showListShareEmp)

module.exports = router;