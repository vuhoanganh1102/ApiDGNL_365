const express = require('express')
const router = express.Router();
const formData = require("express-form-data")
const GroupCustomerController = require('../../controllers/crm/GroupCustomer')

// get danh sách group
router.post("/listCustomerGroup", formData.parse(), GroupCustomerController.getListGroup)

//tạo group mới

router.post("/createCustomerGroup", formData.parse(), GroupCustomerController.createGroup)

//chỉnh sửa các thuộc tính 1 group
router.post("/updateCustomerGroup", formData.parse(), GroupCustomerController.update)

// xoá group chỉ định
router.post("/deleteCustomerGroup", formData.parse(), GroupCustomerController.delete);
// chi tiet khom khach hang
router.post('/detailCustomerGroup', formData.parse(), GroupCustomerController.detail_groupKH);

module.exports = router;