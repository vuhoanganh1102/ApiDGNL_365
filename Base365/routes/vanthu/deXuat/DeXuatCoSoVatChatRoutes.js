const router = require('express').Router();
const deXuatCoSoVatChatRoute = require("../../../controllers/vanthu/DeXuat/DeXuatCoSoVatChat")
const formData = require("express-form-data");
const funtions = require("../../../services/functions")

// thêm mới  De xuat co so vat chat
router.post('/addDXVC',formData.parse(),deXuatCoSoVatChatRoute.dxCoSoVatChat)


module.exports = router