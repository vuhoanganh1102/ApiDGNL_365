const City = require('../../models/Raonhanh365/City');
const functions = require('../../services/functions');
const category = require('../../models/Raonhanh365/Category');
const Tags = require('../../models/Raonhanh365/Tags');
const CateVl = require('../../models/Raonhanh365/CateVl');
const PhuongXa = require('../../models/Raonhanh365/PhuongXa');
const CateDetail = require('../../models/Raonhanh365/CateDetail');

exports.getTopCache = async (req, res, next) => {
    try {
        let data = {};

        let cateId = req.body.cateId;

        let city2 = await City.find({}, { _id: 1, name: 1, parentId: 1 });

        let city3 = await City.find({ parentId: { $ne: 0 } }, { _id: 1, name: 1, parentId: 1 });

        let db_cat = await category.find({ active: 1 })

        let db_cat1 = await category.find({ active: 1, parentId: 0 })

        let tags_tk = await Tags.find({}, { _id: 1, name: 1 })

        let db_catvl = await CateVl.find({ active: 1 }, { _id: 1, name: 1 })

        let db_tkcatvl = [];

        let db_tkcat = [];

        let db_pxa = await PhuongXa.find();

        let db_all_dmuc = await category.find({ _id: { $nin: [119, 120] }, active: 1 });

        let db_all_dmuc_con = await category.find({ active: 1, _id: { $nin: [1, 2, 3, 13, 18, 20, 21, 22, 23, 25, 51, 119, 74, 77, 93] } })

        let db_all_dmuc1 = await category.find({ active: 1, _id: { $nin: [119, 121, 19, 24] } })

        let manHinhTheoDanhMuc = await CateDetail.findById(cateId,{screen:1})
        
        let nhomSanPham = await CateDetail.findById(cateId,{productGroup:1})

        let nhomSanPhamChatLieu = await CateDetail.findById(cateId,{productMaterial:1})

        let nhomSanPhamHinhDang = await CateDetail.findById(cateId,{productShape:1})

        let giongThuCung = await CateDetail.findById(cateId,{petPurebred:1})

        let thongTinThuCung = await CateDetail.findById(cateId,{petInfo:1})

        let xuatXu = await CateDetail.findById(cateId,{origin:1})

        let dungLuong  = await CateDetail.findById(cateId,{capacity:1})

        let hang = await  CateDetail.findById(cateId,{brand:1})

        let mauSac = await  CateDetail.findById(cateId,{colors:1})

        let boViSuLi = await CateDetail.findById(cateId,{processor:1})

        let monTheThao = await CateDetail.findById(cateId,{sport:1})

        let tangPhong = await  CateDetail.findById(cateId,{storyAndRoom:1})

        let baoHanh = await  CateDetail.findById(cateId,{warranty:1})

        let namSanXuat = await  CateDetail.findById(cateId,{yearManufacture:1})
        data.arrcity2 = city2;
        data.arrcity3 = city3;
        data.db_cat = db_cat;
        data.db_cat1 = db_cat1;
        data.tags_tk = tags_tk;
        data.db_catvl = db_catvl;
        data.db_tkcatvl = db_tkcatvl;
        data.db_tkcat = db_tkcat;
        data.db_pxa = db_pxa;
        data.db_all_dmuc = db_all_dmuc;
        data.db_all_dmuc_con = db_all_dmuc_con;
        data.db_all_dmuc1 = db_all_dmuc1;
        data.manHinhTheoDanhMuc = manHinhTheoDanhMuc;
        data.nhomSanPham = nhomSanPham;
        data.nhomSanPhamChatLieu = nhomSanPhamChatLieu;
        data.nhomSanPhamHinhDang = nhomSanPhamHinhDang;
        data.giongThuCung = giongThuCung;
        data.thongTinThuCung = thongTinThuCung;
        data.xuatXu = xuatXu;
        data.dungLuong = dungLuong;
        data.hang = hang;
        data.mauSac = mauSac;
        data.boViSuLi = boViSuLi;
        data.monTheThao = monTheThao;
        data.tangPhong = tangPhong;
        data.baoHanh = baoHanh;
        data.namSanXuat = namSanXuat;

        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: topCache.js:12 ~ exports.getTopCache= ~ error:", error)
        return functions.setError(res, error)
    }
}