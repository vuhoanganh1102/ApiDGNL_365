const express = require('express')
const router = express.Router();
const GroupCustomerController = require('../../controllers/crm/GroupCustomer')

// get danh sách group
// router.get("/all", GroupCustomerController.getListGroup)

// // get group theo i
// router.get("/:id", GroupCustomerController.getGroupById)

// // tạo group mới
// router.post("/create", GroupCustomerController.createGroup)

// // chỉnh sửa các thuộc tính 1 group
// router.post("/update/:id", GroupCustomerController.update)

// // xoá group chỉ định
// router.post("/delete", GroupCustomerController.delete)

module.exports = router;