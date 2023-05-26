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
                            'vehicle.spareParts': data[i].loai_phu_tung,
                            'vehicle.interior': data[i].loai_noithat,
                            'vehicle.device': data[i].thiet_bi,
                            'vehicle.color': data[i].mau_sac,
                            'vehicle.capacity': data[i].dung_luong,
                            'vehicle.connectInternet': data[i].knoi_internet,
                            'vehicle.generalType': data[i].loai_chung,
                            'vehicle.resolution': data[i].do_phan_giai,
                            'vehicle.wattage': data[i].cong_suat,
                            'vehicle.engine': data[i].dong_co,
                            'vehicle.frameMaterial': data[i].chat_lieu_khung,
                            'vehicle.accessary': data[i].link_kien_phu_kien,
                            'vehicle.volume': data[i].dung_tich,
                            'vehicle.manufacturingYear': data[i].nam_san_xuat,
                            'vehicle.fuel': data[i].nhien_lieu,
                            'vehicle.numberOfSeats': data[i].so_cho,
                            'vehicle.gearBox': data[i].hop_so,
                            'vehicle.style': data[i].kieu_dang,
                            'vehicle.payload': data[i].trong_tai,
                            'vehicle.carNumber': data[i].td_bien_soxe,
                            'vehicle.version': data[i].phien_ban,
                            'vehicle.km': data[i].so_km_da_di,
                            'vehicle.origin': data[i].xuat_xu,
                            'realEstate.statusSell': data[i].can_ban_mua,
                            'realEstate.nameApartment': data[i].ten_toa_nha,
                            'realEstate.numberOfStoreys': data[i].tong_so_tang,
                            'realEstate.storey': data[i].tang_so,
                            'realEstate.mainDirection': data[i].huong_chinh,
                            'realEstate.balconyDirection': data[i].huong_ban_cong,
                            'realEstate.legalDocuments': data[i].giay_to_phap_ly,
                            'realEstate.statusInterior': data[i].tinh_trang_noi_that,
                            'realEstate.acreage': data[i].dien_tich,
                            'realEstate.length': data[i].chieu_dai,
                            'realEstate.width': data[i].chieu_rong,
                            'realEstate.kvCity': data[i].kv_thanhpho,
                            'realEstate.kvDistrict': data[i].kv_quanhuyen,
                            'realEstate.kvWard': data[i].kv_phuongxa,
                            'realEstate.numberToletRoom': data[i].so_pve_sinh,
                            'realEstate.numberBedRoom': data[i].so_pngu,
                            'realEstate.typeOfApartment': data[i].loai_hinh_canho,
                            'realEstate.landType': data[i].loai_hinh_dat,
                            'realEstate.special': data[i].dac_diem,
                            'realEstate.statusBDS': data[i].tinh_trang_bds,
                            'realEstate.codeApartment': data[i].td_macanho,
                            'realEstate.cornerUnit': data[i].cangoc,
                            'realEstate.nameArea': data[i].ten_phan_khu,
                            'realEstate.useArea': data[i].dientichsd,
                            'realEstate.block': data[i].td_block_thap,
                            'realEstate.officeType': data[i].loaihinh_vp,
                            'realEstate.htmchrt': data[i].td_htmch_rt,
                            'ship.product': data[i].loai_hinh_sp,
                            'ship.timeStart': data[i].tgian_bd,
                            'ship.timeEnd': data[i].tgian_kt,
                            'ship.allDay': data[i].ca_ngay,
                            'ship.vehicloType': data[i].loai_xe,
                            'entertainmentService.brand': data[i],
                            'sports.sport': data[i].mon_the_thao,
                            'sports.typeSport': data[i],
                            'material': data[i],
                            'pet.kindOfPet': data[i].giong_thu_cung,
                            'pet.age': data[i].do_tuoi,
                            'pet.gender': data[i].gioi_tinh,
                            'pet.weigth': data[i].khoiluong,
                            'houseWare.typeDevice': data[i],
                            'houseWare.typeProduct': data[i].loai_linhphu_kien,
                            'houseWare.guarantee': data[i],
                            'health.typeProduct': data[i],
                            'health.kindCosmetics': data[i],
                            'health.expiry': data[i].han_su_dung,
                            'health.brand': data[i],
                            'Job.jobType': data[i].new_job_type,
                            'Job.jobKind': data[i].new_job_kind,
                            'Job.maxAge': data[i].new_min_age,
                            'Job.minAge': data[i].new_max_age,
                            'Job.exp': data[i].new_exp,
                            'Job.level': data[i].new_level,
                            'Job.skill': data[i].new_skill,
                            'Job.quantity': data[i].new_quantity,
                            'Job.city': data[i].com_city,
                            'Job.district': data[i].com_district,
                            'Job.ward': data[i].com_ward,
                            'Job.addressNumber': data[i].com_address_num,
                            'Job.payBy': data[i].new_pay_by,
                            'Job.benefit': data[i].quyen_loi,
                            'food.typeFood': data[i],
                            'food.expiry': data[i],
                            'newBuy.tenderFile': data[i].new_file_dthau,
                            'newBuy.fileContenApply': data[i].new_file_nophs,
                            'newBuy.fileContent': data[i].new_file_nophs,
                            'newBuy.instructionContent': data[i].noidung_chidan,
                            'newBuy.instructionFile': data[i].new_file_chidan,
                            'newBuy.until': data[i].donvi_thau,
                            'newBuy.bidFee': data[i].phi_duthau,
                            'newBuy.desFile': data[i].file_mota,
                            'newBuy.procedureFile': data[i].file_thutuc,
                            'newBuy.file': data[i].file_hoso,
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

exports.updateInfoSell = async(req, res, next) => {
    try {
        let result = true;
        let page = 1;
        do {
            let listItems = await fnc.getDataAxios('https://raonhanh365.vn/api/list_new.php', { page: page, pb: 2 })
            let data = listItems.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {

                    let post = await fnc.getDatafindOne(New, { _id: data[i].id_new });
                    if (post != null) {
                        await New.updateOne({ _id: data[i].id_new }, {
                            $set: {
                                'infoSell.groupType': data[i].nhom_phan_loai,
                                'infoSell.classify': data[i].phan_loai,
                                'infoSell.numberWarehouses': data[i].so_luong_kho,
                                'infoSell.promotionType': data[i].loai_khuyenmai,
                                'infoSell.promotionValue': data[i].giatri_khuyenmai,
                                'infoSell.transport': data[i].van_chuyen,
                                'infoSell.transportFee': data[i].phi_van_chuyen,
                                'infoSell.productValue': data[i].gia_sanpham_xt,
                                'infoSell.untilMoney': data[i].donvi_tien_xt,
                                'infoSell.untilTranpost': data[i].donvi_tien_vc,
                            }
                        });
                        console.log(data[i].id_new)
                    }
                }
                page += 1;
            } else result = false;
        } while (result)
        await fnc.success(res, 'thành công');

    } catch (err) {
        console.log(err);
        return fnc.setError(res, err)
    }
}