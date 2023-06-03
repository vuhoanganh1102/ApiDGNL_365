const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New')
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
    // đăng tin
exports.postNewMain = async(req, res, next) => {
    try {
        let img = req.files.img;
        let video = req.files.video;
        let listImg = [];
        let nameVideo = '';
        let request = req.body,
            userID = request.user_id,
            cateID = request.cate_id,
            title = request.title,
            money = request.money,
            until = request.until,
            description = request.description,
            free = request.free,
            poster = request.poster,
            name = request.name,
            email = request.email,
            address = request.address,
            phone = request.phone,
            status = request.status,
            detailCategory = request.detailCategory,
            buySell = request.buySell,
            productType = request.productType,
            productGroup = request.productGroup,
            city = request.city,
            district = request.district,
            ward = request.ward,
            brand = request.brand;
        let fields = [userID, cateID, title, money, until, description, free, poster, name, email, address, phone, status, detailCategory];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, 'Missing input value', 404)
        }
        const maxIDNews = await New.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDNews;
        if (maxIDNews) {
            newIDNews = Number(maxIDNews._id) + 1;
        } else newIDNews = 1;
        if (money) {
            if (img && img.length >= 1 && img.length <= 10) {
                let isValid = true;
                for (let i = 0; i < img.length; i++) {
                    let checkImg = await functions.checkImage(img[i].path);
                    if (checkImg) {
                        // day mot object gom 2 truong(nameImg, size) vao listImg
                        listImg.push({nameImg: img[i].originalFilename, size: img[i].size});
                    } else {
                        isValid = false;
                    }
                }
                if (isValid == false) {
                    await functions.deleteImgVideo(img, video)
                    return functions.setError(res, 'đã có ảnh sai định dạng hoặc lớn hơn 2MB', 405)
                }
            } else if (img && img.length > 10) {
                await functions.deleteImgVideo(img, video)
                return functions.setError(res, 'chỉ được đưa lên tối đa 10 ảnh', 406)
            }else{
                return functions.setError(res, 'Missing input image', 406)
            }

            if (video) {
                if (video.length == 1) {
                    let checkVideo = await functions.checkVideo(video[0]);
                    if (checkVideo) {
                        nameVideo = video[0].filename
                    } else {
                        video.forEach(async(element) => {
                            await functions.deleteImg(element)
                        })
                        return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 407)
                    }
                } 
                else if (video.length > 1) {
                    await functions.deleteImgVideo(img, video)
                    return functions.setError(res, 'chỉ được đưa lên 1 video', 408)
                }
            }
            req.info = {
                _id: newIDNews,
                userID: userID,
                cateID: cateID,
                title: title,
                money: money,
                until: until,
                description: description,
                free: free,
                poster: poster,
                name: name,
                status: status,
                email: email,
                address: address,
                phone: phone,
                detailCategory: detailCategory,
                district: district,
                img: listImg,
                video: nameVideo,
                productGroup: productGroup,
                productType: productType,
                city,
                district,
                ward,
                brand
            }
            return next()
        }
        return functions.setError(res, 'Thiếu dữ liệu ', 404)
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}

// đăng tin chung cho tat ca cac tin
exports.postNewsGeneral = async(req, res, next) => {
    try {
        let exists = await Category.find({ _id: req.cateID }); 
        let fields = req.info;
        if (exists) {
            let request = req.body;
            
            //cac truong khi dang tin do dien tu
            let fieldsElectroniceDevice = {
                microprocessor : request.microprocessor,
                ram : request.ram,
                hardDrive : request.hardDrive,
                typeHarđrive : request.typeHarđrive,
                screen : request.screen,
                size : request.size,
                brand : request.brand,
                machineSeries : request.machineSeries
            }

            //cac truong khi dang tin do xe co
            let fieldsVehicle = {
                brandMaterials : request.brandMaterials,
                vehicles : request.vehicles,
                spareParts : request.spareParts,
                interior : request.interior,
                device : request.device,
                color : request.color,
                capacity : request.capacity,
                connectInternet : request.connectInternet,
                generalType : request.generalType,
                wattage : request.wattage,
                resolution : request.resolution,
                engine : request.engine,
                accessary : request.accessary,
                frameMaterial : request.frameMaterial,
                volume : request.volume,
                manufacturingYear : request.manufacturingYear,
                fuel : request.fuel,
                numberOfSeats : request.numberOfSeats,
                gearBox : request.gearBox,
                style : request.style,
                payload : request.payload,
                carNumber : request.carNumber,
                km : request.km,
                origin : request.origin,
                version : request.version
            }

            // cac truong khi dang tin bat dong san
            let fieldsRealEstate = {
                statusSell: request.statusSell,
                nameApartment: request.nameApartment,
                numberOfStoreys: request.numberOfStoreys,
                storey: request.storey,
                mainDirection: request.mainDirection,
                balconyDirection: request.balconyDirection,
                legalDocuments: request.legalDocuments,
                statusInterior: request.statusInterior,
                acreage: request.acreage,
                length: request.length,
                width: request.width,
                buyingArea: request.buyingArea,
                numberToletRoom: request.numberToletRoom,
                numberBedRoom: request.numberBedRoom,
                typeOfApartment: request.typeOfApartment,
                special: request.special,
                statusBDS: request.statusBDS,
                codeApartment: request.codeApartment,
                cornerUnit: request.cornerUnit,
                nameArea: request.nameArea,
                useArea: request.useArea,
                landType: request.landType,
                officeType: request.officeType,
                block: request.block,
                htmchrt: request.htmchrt
            };
            // cac truong cua ship
            let fieldsShip = {
                product: request.product,
                timeStart: Date(request.timeStart),
                timeEnd: Date(request.timeEnd),
                allDay: request.allDay,
                vehicloType: request.vehicloType
            };
            //cac truong cua danh muc thu cung
            let fieldsPet = {
                age: req.body.age,
                gender: req.body.gender,
                weigth: req.body.weigth,
            };
            //cac truong cua danh muc cong viec
            let fieldsJob = {
                minAge: req.body.minAge,
                exp: req.body.exp,
                level: req.body.level,
                skill: req.body.skill,
                quantity: req.body.quantity,
                addressNumber: req.body.addressNumber,
                payBy: req.body.payBy,
                benefit: req.body.benefit,
                salary: req.body.salary,
                gender: req.body.gender,
                degree: req.body.degree,
            };

            //
            fields.electroniceDevice = fieldsElectroniceDevice;
            fields.vehicle = fieldsVehicle;
            fields.realEstate = fieldsRealEstate;
            fields.ship = fieldsShip;
            fields.pet = fieldsPet;
            fields.Job = fieldsJob;

            req.fields = fields;
            return next();
            
        }
        return functions.setError(res, "Category not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

exports.createNews = async(req, res, next)=>{
    try {
        let fields = req.fields;
        fields.createTime = new Date(Date.now());
        const news = new New(fields);
        await news.save();
        return functions.success(res, "create news success");
    }catch(err){
        console.log(err);
        return functions.setError(res, err)
    }
}

//chinh sua tat ca cac loai tin
exports.updateNews = async(req, res, next) => {
    try {
        let idNews = Number(req.body.news_id);
        if(!idNews)
            return functions.setError(res, "Missing input news_id!", 405);
        let existsNews = await New.find({_id: idNews});
        let fields = req.fields;
        fields.updateTime = new Date(Date.now());
        if (existsNews ) {
            // console.log(existsNews);
            console.log(fields);
            await New.findByIdAndUpdate(idNews, fields);
            return functions.success(res, "News edited successfully");
        }
        return functions.setError(res, "News not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err);
    }
}

// đăng tin do dien tu
exports.postNewElectron = async(req, res, next) => {
    try {
        let listID = [];
        let listCategory = await functions.getDatafind(Category, { parentId: 1 });
        for (let i = 0; i < listCategory.length; i++) {
            listID.push(listCategory[i]._id)
        }
        let fields = req.info;
        const exists = listID.includes(Number(fields.cateID));
        if (exists) {
            let request = req.body,
                microprocessor = request.microprocessor,
                ram = request.ram,
                hardDrive = request.hardDrive,
                typeHarđrive = request.typeHarđrive,
                screen = request.screen,
                size = request.size,
                brand = request.brand,
                machineSeries = request.machineSeries;
            let subFields = {microprocessor, ram, hardDrive, typeHarđrive, screen, size, brand, machineSeries};
            fields.createTime = new Date(Date.now());
            fields.electroniceDevice = subFields;
            const news = new New(fields);
            await news.save();
            return functions.success(res, "create news electronic device success");
        }
        return functions.setError(res, "Category electronic device not found!", 505);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err)
    }
}

// lấy tin trước đăng nhập
exports.getNewsBeforeLogin = async(req, res, next) => {
        try {
            // tạo mảng
            let output = [];
            // tìm tin được ưu tiên đẩy lên đầu với trường pinHome và pinCate
            let data_pinHome = await New.find({ pinHome: 1 }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber');

            if (data_pinHome) {
                for (let i = 0; i < data_pinHome.length; i++) {
                    // thêm tin vào mảng 
                    output.push(data_pinHome[i])
                }
            }
            // nếu dữ liệu ưu tiên ít hơn 50 thì thêm dữ liệu thường vào
            if (output.length < 50) {
                // lấy data với những tin có ngày cập nhật mới nhất
                let data = await New.find({}).sort({ updatedAt: -1 }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50 - output.length);
                for (let i = 0; i < data.length; i++) {
                    // thêm tin vào mảng 
                    output.push(data[i])
                }
            }
            return functions.success(res, "get data success", { output })
        } catch (error) {
            return functions.setError(res, error)
        }
    }
    // tìm kiếm tin 
exports.searchNews = async(req, res, next) => {
        try {
            // tạo mảng
            let output = [];
            // trường hợp không nhập gì mà tìm kiếm
            if (!req.body.key || req.body.key === undefined) {
                let data = await New.find({}).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                for (let i = 0; i < data.length; i++) {
                    // thêm tin vào mảng 
                    output.push(data[i])
                }
            } else {
                // lấy giá trị search key
                let search = req.body.key;
                // đưa câu truy vấn về chữ thường
                let key_lower = search.toLowerCase();
                // đổi chữ cái đầu thành chữ hoa
                let key = key_lower.charAt(0).toUpperCase() + key_lower.slice(1);
                // tìm kiếm danh mục với key
                let query = await CategoryRaoNhanh365.find({ name: key })
                if (!query || query.length === 0) {
                    //tạo biểu thức chính quy cho phép truy vấn key không phân biệt hoa thường
                    const regex = new RegExp(key, "i");
                    // tìm data với biểu thức chính quy 
                    let data_search = await CategoryRaoNhanh365.find({ name: regex });
                    if (data_search) {
                        // lấy data nếu có trong danh mục
                        let data = await New.find({ cateID: data_search[0]._id }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                        if (data) {
                            for (let i = 0; i < data.length; i++) {
                                output.push(data[i])
                            }
                        } else {
                            // lấy data với tên của sản phẩm
                            let data = await New.find({ name: regex }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                            for (let i = 0; i < data.length; i++) {
                                output.push(data[i])
                            }
                        }
                    }

                } else {
                    // tìm kiếm tin với id của danh mục đã tìm được
                    let data = await New.find({ cateID: query[0]._id }).select('_id title linkTitle money cateID type city image video buySell createTime updateTime active detailCategory viewCount name phone email address district img description hashtag poster producType moneyPinning free status apartmentNumber').limit(50);
                    // đẩy dữ liệu vào mảng
                    if (data) {
                        for (let i = 0; i < data.length; i++) {
                            output.push(data[i])
                        }
                    } else {
                        return functions.setError(res, "get data failed")
                    }
                }

            }
            return functions.success(res, "get data success", { output })
        } catch (error) {
            return functions.setError(res, error)
        }
    }


exports.deleteAllNews = async (req, res) => {

    if (!await functions.getMaxID(New)) {
        functions.setError(res, "No deparment existed", 513);
    } else {
        New.deleteMany()
            .then(() => functions.success(res, "Delete all news successfully"))
            .catch(err => functions.setError(res, err.message, 514));
    }

};