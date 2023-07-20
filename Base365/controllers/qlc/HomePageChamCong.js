const functions = require("../../services/functions");
const users = require("../../models/Users")
const calEmp = require("../../models/qlc/CalendarWorkEmployee")
const Tracking = require("../../models/qlc/HisTracking")
    //lấy danh sách user chưa đăng kí lịch làm việc
exports.getlistUserNoneSetCarlendar = async(req, res) => {

    try {

        let pageNumber1 = req.body.pageNumber1 || 1;
        let pageNumber2 = req.body.pageNumber2 || 1;
        let com_id = req.body.com_id;
        let data = [];
        let data2 = [];
        let results = [];
        let data3 = []
        let comName = ""
        shift_id = req.body.shift_id
        CreateAt = req.body.CreateAt || true
        inputNew = req.body.inputNew || null
        inputOld = req.body.inputOld || null
            //ta tìm danh sách nhân viên của công ty
            data = await users.aggregate([
                {$lookup : {
                    from: "QLC_Deparments",
                    localField: "inForPerson.employee.dep_id",
                    foreignField : "dep_id",
                    as: "infodep"
                }},
                {$unwind: "$infodep"},
                {$project: {
                    "_id":"$_id",
                    "idQLC":"$idQLC",
                    "userName":"$userName",
                    "phoneTK":"$phoneTK",
                    "email":"$email",
                    "avatarUser":"$avatarUser",
                    "depName":"$infodep.dep_name",
                    "com_id" : "$inForPerson.employee.com_id",
                }}
            ])
            for(let i = 0 ; i<data.length ; i++){
                comName = await users.findOne({idQLC : data[i].com_id}).select("userName")
                if(comName) data[i].comName = comName.userName
            }
            //ta tìm danh sách nhân viên đã có lịch làm việc của công ty
            data2 = await calEmp.aggregate([
                {$lookup : {
                    from: "Users",
                    localField: "ep_id",
                    foreignField : "idQLC",
                    as: "info"
                }},
                {$unwind: "$info"},
                {$project: {
                    "idQLC":"$info.idQLC",
                    "com_id" : "$info.inForPerson.employee.com_id"
                }}
            ])
                //ta so sánh 2 mảng 
                // Lọc ra các phần tử không giống nhau trong cả hai mảng
            function compareObjects(obj1, obj2) {
                return JSON.stringify(obj1.idQLC) === JSON.stringify(obj2.idQLC);
            }
            function removeSimilarElements(data, data2) {
                const newArray = data.filter(
                    (item1) => !data2.some((item2) => compareObjects(item1, item2))
                );
                return newArray.concat(
                    data2.filter(
                        (item2) => !data.some((item1) => compareObjects(item1, item2))
                    )
                );
            }
            const ketQua = removeSimilarElements(data, data2);
            const pageSize = 20;
            const startIndex = (pageNumber1 - 1) * pageSize;
            const endIndex = pageNumber1 * pageSize;
            results = ketQua.slice(startIndex, endIndex);
            if (!ketQua) {
                return functions.setError(res, 'Không có dữ liệu danh sách NV chưa đăng kí lịch làm việc ', 404);
            }
            //lấy thành công danh sách NV đã chấm công gần nhất

            data3 = await Tracking.find({ com_id: com_id }).select('sheet_id ep_id ts_image ts_location_name at_time shift_id status is_success ').skip((pageNumber2 - 1) * 20).limit(20).sort({ _id: -1 });
            if (!data3) {
                return functions.setError(res, 'Không có dữ liệu danh sách NV đã chấm công gần nhất ', 404);
            }
        // await functions.success(res, 'Lấy thành công danh sách NV chưa đăng kí lịch làm việc', { results , pageNumber1 });
        // await functions.success(res, 'Lấy thành công danh sách NV đã chấm công gần nhất', { data3 , pageNumber2 });
        return functions.success(res, 'Lấy thành công danh sách NV chưa đăng kí lịch làm việc và danh sách NV đã chấm công gần nhất', { results, pageNumber1, data3, pageNumber2 });

    } catch (err) {
        functions.setError(res, err.message);
    };
}