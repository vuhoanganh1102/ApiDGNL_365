const TblTieuChi = require('../../../models/DanhGiaNangLuc/TblTieuChi');
const functions = require('../../../services/functions')





//Tim kiem theo tieu chi  va trang thai
exports.SearchTieuChi = async (req, res, next) => {
    try {

        const resultApi = { hienThi: 5, skipped: 0 }
        const ten = req.body.tcd_ten
        const station = req.body.tcd_trangthai
        const hienThi = req.body.hienThi
        const skipped = req.body.skipped
        const trangthai_xoa = req.body.trangthai_xoa
        const option = [
            'id',
            'tcd_ten',
            'tcd_nguoitao',
            'tcd_loai',
            'tcd_trangthai',
            'tc_id_tonghop',
            'id_congty'
        ]
        const filters = { tcd_loai: 2, id_congty: 0 };
        /// lay id cong ty
        const type = req.user.data.type


        if (type === 1) {
            filters.id_congty = req.user.data._id
        }
        else {
            filters.id_congty = req.user.data.com_id
        }
        ////lay ten
        if (ten) {
            filters.tcd_ten = ten;
        }
        // lay trang thai
        if (station) {
            filters.tcd_trangthai = parseInt(station);
        }
        if (trangthai_xoa) filters.trangthai_xoa = trangthai_xoa
        if (hienThi) resultApi.hienThi = hienThi
        if (skipped) resultApi.skipped = Number(skipped) * resultApi.hienThi

        const arrayTieuChi = await TblTieuChi.find(filters, option).lean()
        const countDocs = arrayTieuChi.length

        if (countDocs) {
            resultApi.countI = countDocs
            resultApi.arrayRender = await TblTieuChi.find(filters, option).lean().skip(resultApi.skipped).find(filters, option).limit(resultApi.hienThi)

            resultApi.arrayTcd = []

            for (let index = 0; index < resultApi.arrayRender.length; index++) {
                const element = resultApi.arrayRender[index].id;
                const tcd = await TblTieuChi.find({ tc_id_tonghop: element, id_congty: filters.id_congty }, option)
                resultApi.arrayTcd.push(tcd)
            }

        }

        if (arrayTieuChi !== null) {

            return functions.success(res, 'Succesfully', {
                data: resultApi
            })
        }
        else return res.status(503).json({ error: 'No data available' })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// change station 

exports.ChangeStation = async (req, res) => {
    try {

        const id = req.body.id
        const tcd_trangthai = req.body.tcd_trangthai
        TblTieuChi.createIndexes({ id: 1 })
        const DataTC = await TblTieuChi.updateOne({ id }, {
            tcd_trangthai
        }, {
            new: true
        })
        return functions.success(res, 'sucessfully', {
            data: DataTC
        })
    }
    catch (error) {
        console.log(error)
        return functions.setError(res, 'Internal Server Error', 500)
    }
}


// Them moi
exports.ThemMoiTC = async (req, res) => {
    try {
        const type = req.user.data.type

        const tokenData = { id_congty: 0 }; // Define usc_id as needed
        if (type === 1) {
            tokenData.id_congty = req.user.data._id
        }
        else {
            tokenData.id_congty = req.user.data.com_id
        }
        //Guarding clause
        // if (!req.user || !req.user.data || !req.user.data.idQLC)
        //     return functions.setError(res, "Không có thông tin tài khoản", 400);
        // let usc_id = req.user.data.idQLC;
        const now = functions.getTimeNow()

        const tcd_capnhat = functions.convertDate(now)

        let tcd_ten = String(req.body.tcd_ten)
        if (!tcd_ten) return functions.setError(res, "Fill name")

        let tcd_loai = req.body.tcd_loai ? Number(req.body.tcd_loai) : 2

        let tcd_trangthai = req.body.tcd_trangthai ? Number(req.body.tcd_trangthai) : 2

        let tcd_nguoitao = req.user.data._id

        let tcd_thangdiem = Number(req.body.tcd_thangdiem)
        if (!tcd_thangdiem) return functions.setError(res, "Fill point")

        let tcd_ghichu = String(req.body.tcd_ghichu)

        const id = (await TblTieuChi.countDocuments()) + 1

        if (tcd_loai === 2) {
            const tblTieuChi = await (new TblTieuChi(
                {
                    id_congty: tokenData.id_congty,
                    id,
                    tcd_ten,
                    tcd_loai,
                    tc_id_tonghop: 0,
                    tcd_trangthai,
                    tcd_nguoitao,
                    tcd_thangdiem,
                    tcd_ghichu,
                    tcd_ngaytao: now,
                    tcd_capnhat,
                    trangthai_xoa: 1,

                }

            )).save()
            return functions.success(res, "Successfully Added", { data: tblTieuChi })
        }
        if (tcd_loai === 1) {
            const tc_id_tonghop = req.body.tc_id_tonghop
            const elementPoint = await TblTieuChi.aggregate(
                [
                    {
                        $match: {
                            tc_id_tonghop, id_congty: tokenData.id_congty
                        }
                    },
                    {
                        $group:
                        {
                            totalAmount: { $sum: "$tcd_thangdiem" },
                        }
                    }
                ]
            )
            const totalPoint = await TblTieuChi.findOne({ id: tc_id_tonghop, id_congty: tokenData.id_congty }, { tcd_thangdiem: 1 })
            if ((elementPoint.totalAmount + tcd_thangdiem) < totalPoint) {
                const tblTieuChi = await (new TblTieuChi(
                    {
                        id_congty: tokenData.id_congty,
                        id,
                        tcd_ten,
                        tcd_loai,
                        tc_id_tonghop,
                        tcd_trangthai,
                        tcd_nguoitao,
                        tcd_thangdiem,
                        tcd_ghichu,
                        tcd_ngaytao: now,
                        tcd_capnhat,
                        trangthai_xoa: 1
                    }
                )).save()
                return functions.success(res, "Sucessfully Added", { data: tblTieuChi })
            }
            else{
                return functions.setError(res,"Select again total title and point's single title")
            }
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, 'Them khong thanh cong', 400)

    }

}
// Chi tiet
exports.ChiTietTC = async (req, res) => {

    try {
        let id = req.body.id
        const ThongTin = await TblTieuChi.findOne({ id }).lean()
        if (ThongTin === null) {
            return functions.setError(res, 'Not Found', 404)
        }
        else return functions.success(res, 'Succesfully', { data: ThongTin })
    }
    catch (error) {
        console.log(error)
        return functions.setError(res, 'Not Found', 404)
    }
}
//xoa
exports.XoaTC = async (req, res) => {
    try {
        const id = req.body.id
        const deleteItem = await TblTieuChi.updateOne({ id }, { trangthai_xoa: 2 }, {
            new: true
        })
        if (!deleteItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        return functions.success(res, 'successfully', {
            data: deleteItem
        })
    }
    catch (error) {
        console.log(error)
        return functions.setError(res, 'Internal Server Error', 500)
    }
}
// Chinh sua TC
exports.ChinhSua = async (req, res) => {
    try {
        const id = req.body.id
        if (id) {
            const tcd_ten = req.body.tcd_ten
            if (!tcd_ten) functions.setError(res, "fill Name")

            const tcd_trangthai = req.body.tcd_trangthai

            const tcd_thangdiem = req.body.tcd_thangdiem
            if (!tcd_thangdiem) functions.setError(res, "fill Point")

            const tcd_ghichu = req.body.tcd_ghichu

            const updateItem = await TblTieuChi.updateOne({ id }, { tcd_ten, tcd_trangthai, tcd_thangdiem, tcd_ghichu }, { new: true })
            return functions.success(res, 'Successfully Updated', { data: updateItem })
        }

        return functions.setError(res, 'missing data', 403)
    }
    catch (error) {
        console.log(error)
        return functions.setError(res, 'missing data', 500)
    }
}

/// search danh sasch tieu chi tong hop 

exports.searchTC = async (req, res, next) => {
    try {
       
        // id cong ty
        const type = req.user.data.type

        const tokenData = { id_congty: 0 }; // Define usc_id as needed
        if (type === 1) {
            tokenData.id_congty = req.user.data._id
        }
        else {
            tokenData.id_congty = req.user.data.com_id
        }

        const option = [
            'id',
            'tcd_ten',
            'tcd_thangdiem',
            'id_congty'
        ]

        const dataResult = await TblTieuChi.find({ trangthai_xoa: 1, tcd_loai: 2, id_congty: tokenData.id_congty }, option)
        //const TdResult = await TblTieuChi.find({tc_id_tonghop: filter.id,trangthai_xoa:1,tcd_loai:1},option)
        const result = {
            data1: dataResult,
            ///tcd:[TdResult]
        }

        return functions.success(res, 'sucessfully', {
            data: dataResult
        })
    }
    catch (error) {
        console.log(error)
        return functions.setError(res, 'Internall server', 500)
    }
}

/// show danh sach tieu chi (default 10 latest records)
exports.listTC = async (req, res, next) => {
    try {
        const filter = { trangthai_xoa: 1, tcd_loai: 2, id_congty: 0 }
        const numRecords = parseInt(req.body.numRecords) || 10;
        const option = [
            'id',
            'tcd_ten',
            'tcd_thangdiem', 'id_congty'
        ]
        // id cong ty
        const type = req.user.data.type

        if (type === 1) {
            filter.id_congty = req.user.data._id
        }
        else {
            filter.id_congty = req.user.data.com_id
        }
        const result = await TblTieuChi.find(filter, option).sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
            .limit(numRecords);
        return functions.success(res, 'sucessfully', {
            data: result
        })
    }
    catch (error) {
        return functions.setError(res, 'internall server', 500)
    }
}


/// get tcd 
exports.searchTCD = async (req, res, next) => {
    try {
        const filter = { trangthai_xoa: 1, id_congty: 0 }

        const id = req.body.id
        if (id) filter.id = id

        // id cong ty
        const type = req.user.data.type

        if (type === 1) {
            filter.id_congty = req.user.data._id
        }
        else {
            filter.id_congty = req.user.data.com_id
        }
        const option = [
            'id',
            'tcd_ten',
            'tcd_thangdiem',
            'tc_id_tonghop',
            'id_congty'
        ]
        const result = await TblTieuChi.find({ tc_id_tonghop: id, id_congty: filter.id_congty }, option)


        return functions.success(res, 'sucessfully', {
            data: result
        })
    }
    catch (error) {
        console.log(error)
        return functions.setError(res, 'Internall server' , 500)
    }
}