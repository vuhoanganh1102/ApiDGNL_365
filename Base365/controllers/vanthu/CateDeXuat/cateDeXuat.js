const CateDeXuat = require("../../../models/Vanthu/cate_de_xuat");
const { storageVT } = require('../../../services/functions');
const multer = require('multer');
const functions = require("../../../services/functions");

exports.showCateDX = async(req,res) => {
  
    try {
        const cateDx = await CateDeXuat.find();
        res.status(200).json(cateDx)
    } catch (error) {
        console.error('Failed to get cate', error);
        res.status(500).json({ error: 'Failed to get cate' });
    }
}