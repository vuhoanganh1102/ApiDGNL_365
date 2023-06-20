
const CustomerContact = require('../../../models/crm/Customer/contact_customer')
const functions = require("../../../services/functions");


exports.addCustomer = async (req, res) => {
  try {
    let { name, stand, logo, birthday, tax_code, cit_id, district_id, ward, address } = req.body
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
  }
}
// nhosm khách hàng