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


        // let city2 = await City.find({}, { _id: 1, name: 1, parentId: 1 });

        // let city3 = await City.find({ parentId: { $ne: 0 } }, { _id: 1, name: 1, parentId: 1 });

        // let cat = await category.find({ active: 1 })

        // let cat1 = await category.find({ active: 1, parentId: 0 })

        // let tagsTk = await Tags.find({}, { _id: 1, name: 1 })

        // let catVl = await CateVl.find({ active: 1 }, { _id: 1, name: 1 })

        // let ward = await PhuongXa.find();

        // let allCate = await category.find({ _id: { $nin: [119, 120] }, active: 1 });

        // let allCateChild = await category.find({ active: 1, _id: { $nin: [1, 2, 3, 13, 18, 20, 21, 22, 23, 25, 51, 119, 74, 77, 93] } })

        // let allCate1 = await category.find({ active: 1, _id: { $nin: [119, 121, 19, 24] } })

        let screen = await CateDetail.findById(cateId,{screen:1})
        
        let productGroup = await CateDetail.findById(cateId,{productGroup:1})

        let productMaterial = await CateDetail.findById(cateId,{productMaterial:1})

        let productShape = await CateDetail.findById(cateId,{productShape:1})

        let petPurebred = await CateDetail.findById(cateId,{petPurebred:1})

        let petInfo = await CateDetail.findById(cateId,{petInfo:1})

        let origin = await CateDetail.findById(cateId,{origin:1})

        let capacity  = await CateDetail.findById(cateId,{capacity:1})

        let brand = await  CateDetail.findById(cateId,{brand:1})

        let colors = await  CateDetail.findById(cateId,{colors:1})

        let processor = await CateDetail.findById(cateId,{processor:1})

        let sport = await CateDetail.findById(cateId,{sport:1})

        let storyAndRoom = await  CateDetail.findById(cateId,{storyAndRoom:1})

        let warranty = await  CateDetail.findById(cateId,{warranty:1})

        let yearManufacture = await  CateDetail.findById(cateId,{yearManufacture:1})

        let allType = await CateDetail.findById(cateId,{allType:1})
        // data.arrcity2 = city2;
        // data.arrcity3 = city3;
        // data.cat = cat;
        // data.cat1 = cat1;
        // data.tagsTk = tagsTk;
        // data.catVl = catVl;
        // data.ward = ward;
        // data.allCate = allCate;
        // data.allCateChild = allCateChild;
        // data.allCate1 = allCate1;
        data.screen = screen;
        data.productGroup = productGroup;
        data.productMaterial = productMaterial;
        data.productShape = productShape;
        data.petPurebred = petPurebred;
        data.petInfo = petInfo;
        data.origin = origin;
        data.capacity = capacity;
        data.brand = brand;
        data.colors = colors;
        data.processor = processor;
        data.sport = sport;
        data.storyAndRoom = storyAndRoom;
        data.warranty = warranty;
        data.yearManufacture = yearManufacture;
        data.allType = allType;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.log("🚀 ~ file: topCache.js:12 ~ exports.getTopCache= ~ error:", error)
        return functions.setError(res, error)
    }
}