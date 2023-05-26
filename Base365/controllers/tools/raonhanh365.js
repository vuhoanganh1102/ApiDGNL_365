const fnc = require('../../services/functions');
const New = require('../../models/Raonhanh365/UserOnSite/New');
const Category = require('../../models/Raonhanh365/Category');
const axios = require('axios');
const FormData = require('form-data');



// danh mục sản phẩm
exports.toolCategory = async(req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);

            const response = await axios.post('https://raonhanh365.vn/api/list_category.php', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            let data = response.data.data.items;
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    const cate = new Category({
                        _id: data[i].cat_id,
                        adminId: data[i].admin_id,
                        name: data[i].cat_name,
                        parentId: data[i].cat_parent_id,
                        order: data[i].cat_order,
                        type: data[i].cat_type,
                        hasChild: data[i].cat_has_child,
                        active: data[i].cat_active,
                        show: data[i].cat_show,
                        langId: data[i].lang_id,
                        description: data[i].cat_description,
                        md5: data[i].cat_md5,
                        isCheck: data[i].phan_loai,
                    });
                    await Category.create(cate);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolNewRN = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            let listItems = await fnc.getDataAxios('https://raonhanh365.vn/api/list_new.php', { page: page, pb: 0 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let timeSell = null;
                    let timeStartPinning = null;
                    let dayStartPinning = null;
                    let dayEndPinning = null;
                    let timePinning = null;
                    let refreshTime = null;
                    let timeHome = null;
                    let timeCate = null;
                    let bidExpirationTime = null;
                    let timePromotionStart = null;
                    let timePromotionEnd = null;
                    if (data[i].tgian_ban != 0) {
                        timeSell = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].thoigian_bdghim != 0) {
                        timeStartPinning = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].ngay_bdghim != 0) {
                        dayStartPinning = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].ngay_ktghim != 0) {
                        dayEndPinning = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].tgian_tghim != 0) {
                        timePinning = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].refresh_time != 0) {
                        refreshTime = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].new_time_home != 0) {
                        timeHome = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].new_time_cate != 0) {
                        timeCate = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].tgian_hethan_thau != 0) {
                        bidExpirationTime = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].thoigian_kmbd != 0) {
                        timePromotionStart = new Date(data[i].tgian_ban * 1000)
                    }
                    if (data[i].thoigian_kmkt != 0) {
                        timePromotionEnd = new Date(data[i].tgian_ban * 1000)
                    }
                    const images = data[i].new_image.split(";").map((image, index) => {
                        const parts = image.split("/");
                        const filename = parts[parts.length - 1];
                        const _id = index + 1;
                        return {
                            _id,
                            nameImg: filename
                        };
                    });
                    let post = await fnc.getDatafindOne(New, { _id: data[i].new_id });
                    if (post == null) {
                        let newRN = new New({
                            _id: data[i].new_id,
                            userID: data[i].new_user_id,
                            title: data[i].new_title,
                            linkTitle: data[i].link_title,
                            money: data[i].new_money,
                            endvalue: data[i].gia_kt,
                            downPayment: data[i].datcoc,
                            until: data[i].new_unit,
                            cateID: data[i].new_cate_id,
                            type: data[i].new_type,
                            city: data[i].new_city,
                            buySell: data[i].new_buy_sell,
                            viewCount: data[i].new_view_count,
                            name: data[i].new_name,
                            active: data[i].new_active,
                            detailCategory: data[i].new_ctiet_dmuc,
                            createTime: new Date(data[i].new_create_time * 1000),
                            updateTime: new Date(data[i].new_update_time * 1000),
                            phone: data[i].new_phone,
                            email: data[i].new_email,
                            address: data[i].dia_chi,
                            district: data[i].quan_huyen,
                            ward: data[i].phuong_xa,
                            apartmentNumber: data[i].new_sonha,
                            status: data[i].new_tinhtrang,
                            warranty: data[i].new_baohanh,
                            free: data[i].chotang_mphi,
                            sold: data[i].da_ban,
                            timeSell: timeSell,
                            pinHome: data[i].new_pin_home,
                            pinCate: data[i].new_pin_cate,
                            timePushNew: data[i].new_gap,
                            timeStartPinning: timeStartPinning,
                            dayStartPinning: dayStartPinning,
                            dayEndPinning: dayEndPinning,
                            timePinning: timePinning,
                            numberDayPinning: data[i].so_ngay_ghim,
                            moneyPinning: data[i].tien_ghim,
                            countRefresh: data[i].new_count_refresh,
                            authen: data[i].new_authen,
                            pinCount: data[i].new_pin_count,
                            refreshTime: refreshTime,
                            timeHome: timeHome,
                            timeCate: timeCate,
                            bidExpirationTime: bidExpirationTime,
                            quantitySold: data[i].sluong_daban,
                            totalSold: data[i].tong_sluong,
                            quantityMin: data[i].soluong_min,
                            quantityMax: data[i].soluong_max,
                            timePromotionStart: timePromotionStart,
                            timePromotionEnd: timePromotionEnd,
                            img: images,
                            video: data[i].new_video,
                        });
                        await newRN.save();
                    }
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result);
        await fnc.success(res, 'thành công');

    } catch (err) {
        console.log(err);
        return fnc.setError(res, err)
    }
}

exports.updateNewDescription = async() => {
    try {
        let result = true;
        let page = 1;
        do {
            let listItems = await fnc.getDataAxios('https://raonhanh365.vn/api/list_new.php', { page: page, pb: 1 })
            let data = listItems.data.items;
            if (data.length > 0) {
                let post = await fnc.getDatafindOne(New, { _id: data[i].new_id });
                if (post != null) {
                    await New.updateOne({ _id: data[i].new_id }, {
                        $set: {
                            'poster': data[i].canhan_moigioi,
                            'description': data[i].new_description,
                            'producType': data[i].new_description,
                            'hashtag': data[i].new_hsashtag,
                            'electroniceDevice.microprocessor': data[i].bovi_xuly,
                            'electroniceDevice.ram': data[i].ram,
                            'electroniceDevice.hardDrive': data[i].o_cung,
                            'electroniceDevice.typeHarđrive': data[i].loai_o_cung,
                            'electroniceDevice.screen': data[i].man_hinh,
                            'electroniceDevice.size': data[i].kich_co,
                            'electroniceDevice.brand': data[i].hang,
                            'electroniceDevice.machineSeries': data[i].hang_vattu,
                            'vehicle.brandMaterials': data[i].dong_may,
                            'vehicle.vehicles': data[i].dong_xe,
                            'vehicle.accessary': data[i].loai_phu_tung,
                            'vehicle.interior': data[i].loai_noithat,
                            'vehicle.device': data[i].thiet_bi,
                            'vehicle.color': data[i].mau_sac,
                            'vehicle.capacity': data[i].dung_luong,
                            'vehicle.connectInternet': data[i].knoi_internet,
                            'vehicle.generalType': data[i].loai_chung,
                            'vehicle.resolution': data[i].do_phan_giai,
                            'vehicle.wattage': data[i].cong_suat,
                            'vehicle.frameMaterial': data[i],
                            'vehicle.volume': data[i],
                            'vehicle.manufacturingYear': data[i],
                            'vehicle.numberOfSeats': data[i],
                            'vehicle.gearBox': data[i],
                            'vehicle.style': data[i],
                            'vehicle.payload': data[i],
                            'vehicle.carNumber': data[i],
                            'vehicle.km': data[i],
                            'vehicle.origin': data[i],
                            'realEstate.statusSell': data[i],
                            'realEstate.nameApartment': data[i],
                            'realEstate.numberOfStoreys': data[i],
                            'realEstate.storey': data[i],
                            'realEstate.mainDirection': data[i],
                            'realEstate.balconyDirection': data[i],
                            'realEstate.legalDocuments': data[i],
                            'realEstate.statusInterior': data[i],
                            'realEstate.acreage': data[i],
                            'realEstate.length': data[i],
                            'realEstate.width': data[i],
                            'realEstate.kvCity': data[i],
                            'realEstate.kvDistrict': data[i],
                            'realEstate.kvWard': data[i],
                            'realEstate.numberToletRoom': data[i],
                            'realEstate.numberBedRoom': data[i],
                            'realEstate.typeOfApartment': data[i],
                            'realEstate.special': data[i],
                            'realEstate.codeApartment': data[i],
                            'realEstate.cornerUnit': data[i],
                            'realEstate.nameArea': data[i],
                            'realEstate.useArea': data[i],
                            'ship.product': data[i],
                            'ship.timeStart': data[i],
                            'ship.timeEnd': data[i],
                            'ship.allDay': data[i],
                            'ship.vehicloType': data[i],
                            'entertainmentService.brand': data[i],
                            'sports.sport': data[i],
                            'sports.typeSport': data[i],
                            'material': data[i],
                            'pet.kindOfPet': data[i],
                            'pet.age': data[i],
                            'pet.gender': data[i],
                            'pet.weigth': data[i],
                            'houseWare.typeDevice': data[i],
                            'houseWare.typeProduct': data[i],
                            'houseWare.guarantee': data[i],
                            'health.typeProduct': data[i],
                            'health.kindCosmetics': data[i],
                            'health.expiry': data[i],
                            'health.brand': data[i],
                            'Job.jobType': data[i],
                            'Job.jobKind': data[i],
                            'Job.maxAge': data[i],
                            'Job.minAge': data[i],
                            'Job.exp': data[i],
                            'Job.level': data[i],
                            'Job.skill': data[i],
                            'Job.quantity': data[i],
                            'Job.city': data[i],
                            'Job.district': data[i],
                            'Job.ward': data[i],
                            'Job.payBy': data[i],
                            'Job.benefit': data[i],
                            'food.typeFood': data[i],
                            'food.expiry': data[i],
                            'newBuy.tenderFile': data[i],
                            'newBuy.fileContenApply': data[i],
                            'newBuy.fileContent': data[i],
                            'newBuy.instructionContent': data[i],
                            'newBuy.instructionFile': data[i],
                            'newBuy.until': data[i],
                            'newBuy.bidFee': data[i],
                            'newBuy.desFile': data[i],
                            'newBuy.procedureFile': data[i],
                            'newBuy.file': data[i],
                        }
                    });
                }
                page += 1;
                console.log(page)
            } else result = false;
        } while (result)
        await fnc.success(res, 'thành công');

    } catch (err) {
        console.log(err);
        return fnc.setError(res, err)
    }
}


exports.toolCateDetail = async(req, res, next) => {
    try {

    } catch (error) {
        return fnc.setError(res, error.message, )
    }
};