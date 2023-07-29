const CC365_CompanyWorkday = require('../../models/Tinhluong/CC365_CompanyWorkday');
const User = require('../../models/Users');
const CC365_Cycle = require('../../models/Chamcong/CC365_Cycle');
const CC365_Resign = require('../../models/Chamcong/Resign');
const CC365_TimeSheet = require('../../models/Chamcong/CC365_TimeSheet');
const Vanthu_de_xuat = require('../../models/Vanthu/de_xuat')
const Department = require('../../models/qlc/Deparment')
// lấy só công chuẩn 1 tháng của 1 công ty 
exports.take_count_standard_works= async (id,year,month) => {
    try{
        let string_date = `${year}-${month}`;
        return  await CC365_CompanyWorkday.aggregate([
            {
                $match:{
                    com_id:id,
                    apply_month:new RegExp(string_date,'i')
                }
            }
        ]);
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js take_count_standard_works',error);
        return [];
    }
}

const GetDayOfWeek = (day) =>{
    let tempt = day.getDay();
    if(tempt == 0){
        return 'CN'
    }
    else if(tempt == 1){
        return 'Hai';
    }
    else if(tempt == 2){
        return 'Ba'
    }
    else if(tempt == 3){
        return 'Tư'
    }
    else if(tempt == 4){
        return 'Năm'
    }
    else if(tempt == 5){
        return 'Sáu'
    }
    else if(tempt == 6){
        return 'Bảy'
    }
}

// lấy só công thực 
exports.take_count_real_works= async (id_ep,id_com,start_date,end_date,time_check) => {
    try{
       let cycle;
       let status = 1;
       // kiểm tra nhân viên xem có tồn tại không
       let condition_take_detail = {
            "CC365_EmployeCycle.ep_id":id_ep,
            "apply_month":{"$gte": start_date},
            "apply_month":{"$lte": end_date},
        };
        if(id_com){
            condition_take_detail = {
                "CC365_EmployeCycle.ep_id":id_ep,
                "apply_month":{"$gte": start_date},
                "apply_month":{"$lte": end_date},
                "com_id":id_com
            };
        }

       let user = await User.findOne(
            {idQLC:id_ep,type:{$ne:1}},
            {   
                idQLC : 1,
                email: 1,
                phoneTK: 1,
                userName: 1,
                "inForPerson.employee.ep_status":1,
                "inForPerson.employee.time_quit_job":1,
            }
        ).lean();
        if(user && (user.phoneTK || user.email)){
            // lịch làm việc 
            let list_cy_detail = await CC365_Cycle.aggregate([
                    {   
                        $lookup: { 
                            from: 'CC365_EmployeCycle', 
                            localField: 'cy_id', 
                            foreignField: 'cy_id', 
                            as: 'CC365_EmployeCycle' 
                        } 
                    },
                    {
                        $match:{
                            "CC365_EmployeCycle.ep_id":id_ep,
                            "apply_month":{"$gte": start_date},
                            "apply_month":{"$lte": end_date},
                            "com_id":id_com
                        }
                    },
                    {
                        $project:{
                            "cy_detail":1,
                            "apply_month":1
                        }
                    }
            ]);
            let list_detail = []; //thông tin ca của từng ngày 
            for(let i=0; i<list_cy_detail.length;i++){
                    let array = JSON.parse(list_cy_detail[i].cy_detail);
                    for(let j = 0; j < array.length;j++){
                        if(array[j].shift_id){
                            let date = new Date(
                                Number(array[j].date.split('-')[0]),
                                Number(array[j].date.split('-')[1])-1, // js tháng giảm 1 
                                Number(array[j].date.split('-')[2]),
                                7
                            )
                            if(array[j].shift_id.includes(',')){
                                let array_shift = array[j].shift_id.split(',');
                                for(let k = 0; k < array_shift.length; k++){
                                    list_detail.push({
                                        shift_id:Number(array_shift[k]),
                                        date
                                    });
                                }
                            }
                            else{
                                list_detail.push({
                                    shift_id:Number(array[j].shift_id),
                                    date
                                });
                            }
                        }
                    }
            };
            
            let ep_resign;
            if (user.email == '' && user.inForPerson.employee.ep_status == 'Deny' && user.phoneTK == '') {
                ep_resign = await CC365_Resign.find({ep_id:id_ep},{shift_id:1})
            }

            // lịch sử chấm công gắn với từng ca. 
            let listData = await CC365_TimeSheet.aggregate([
                {   
                    $lookup: { 
                        from: 'shifts', 
                        localField: 'shift_id', 
                        foreignField: 'shift_id', 
                        as: 'shift' 
                    } 
                },
                {
                    $match:{
                        "ep_id":id_ep,
                        "at_time":{"$gte": start_date},
                        "at_time":{"$lte": end_date},
                    }
                },
                {  
                    $project:{
                        "ep_id":1,
                        "sheet_id":1,
                        "shift_id":1,
                        "at_time":1,
                        "shift.start_time":1,
                        "shift.end_time":1,
                        "shift.start_time_lateste":1,
                        "shift.end_time_earliest":1,
                        "shift.num_to_money":1,
                        "shift.shift_type":1,
                        "shift.num_to_calculate":1,
                        "shift.is_overtime":1,
                    }
                }
            ])
            const day_of_month = Number(String((end_date - start_date) / (24 * 3600 * 1000)).split('.')[0]);
            let listDataFinal = [];
            for(let i = 1; i <= day_of_month; i++){
                let listTimeSheet  = listData.filter((e)=> e.at_time.getDate() == i);
                if(listTimeSheet.length){
                    let day_of_week = GetDayOfWeek(listTimeSheet[0].at_time);
                    let lst_time = [];
                    let total_time = 0;
                    let ep_id = id_ep;
                    let listShift = [];
                    let ep_name = user.userName;
                    let ts_date; 
                    let late = 0;
                    let early = 0; 
                    let num_to_calculate = 0;
                    let num_to_money = 0;
                    let num_overtime = 0;
                    for(let j=0; j<listTimeSheet.length; j++){
                        if(!listShift.find((e)=> e ==listTimeSheet[j].shift_id)){
                            listShift.push(listTimeSheet[j].shift_id);
                        }
                    };
                    let listShiftNotInCycle = [];
                    for(let j=0; j<listShift.length; j++){

                        let listTimeSheetOnShift = listTimeSheet.filter((e)=> e.shift_id == listShift[j]);
                        if(!list_detail.find((e)=> (e.shift_id == listShift[j]) && (e.date.getDate() == i))){
                            listShiftNotInCycle.push(listShift[j]);
                        }
                        else{
                            if(listTimeSheetOnShift.length > 1){
                                listTimeSheetOnShift = listTimeSheetOnShift.sort((a, b) => {
                                    return a.at_time - b.at_time;
                                });
                                let tempt = Math. round(Math.abs(listTimeSheetOnShift[0].at_time - listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time) / 3600 / 1000);
                                total_time = total_time + tempt;
                                
                                if(listTimeSheetOnShift[0].at_time > listTimeSheetOnShift[0].shift.start_time){
                                    let tempt2 = Math. round(Math.abs(listTimeSheetOnShift[0].at_time - listTimeSheetOnShift[0].shift.start_time) / 3600 / 1000);
                                    late = late + tempt2;
                                }
    
                                if(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time < listTimeSheetOnShift[listTimeSheetOnShift.length -1].shift.end_time){
                                    let tempt2 = Math. round(Math.abs(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time - listTimeSheetOnShift[listTimeSheetOnShift.length -1].shift.end_time) / 3600 / 1000);
                                    early = early + tempt2;
                                }
    
                                num_to_calculate = num_to_calculate + listTimeSheetOnShift[0].shift.num_to_calculate;
                                num_to_money = num_to_money + listTimeSheetOnShift[0].shift.num_to_money;
                                if(listTimeSheetOnShift[0].shift.is_overtime){
                                    num_overtime = num_overtime + listTimeSheetOnShift[0].shift.num_to_calculate;
                                }
                            }
                        }
                    }
                    for(let j=0; j<listTimeSheet.length; j++){
                        if(!listShiftNotInCycle.find((e)=> e == listTimeSheet[j].shift_id)){
                            lst_time.push(listTimeSheet[j].at_time);
                        }
                    };
                    if(lst_time.length){
                        ts_date = lst_time[0];
                        listDataFinal.push({
                            ep_id,
                            ep_name,
                            ts_date,
                            day_of_week,
                            total_time,
                            late,
                            early,
                            num_to_calculate,
                            num_to_money,
                            num_overtime,
                            lst_time,
                        })
                    }
                }
            };
            return listDataFinal;
        }
        else{
            return false;
        }
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js take_count_real_works',error);
        return false;
    }
}

// lấy số công thực công ty 
exports.take_count_real_works_com= async (array,id_com,start_date,end_date,time_check) => {
    try{
       let listUser = await User.find(
          {
            idQLC:{$in:array},
            type:{$ne:1}
          },
          {   
            idQLC : 1,
            email: 1,
            phoneTK: 1,
            userName: 1,
            "inForPerson.employee.ep_status":1,
            "inForPerson.employee.time_quit_job":1,
          }
       ).lean();
        let list_cy_detail_total = await CC365_Cycle.aggregate([
                {   
                    $lookup: { 
                        from: 'CC365_EmployeCycle', 
                        localField: 'cy_id', 
                        foreignField: 'cy_id', 
                        as: 'CC365_EmployeCycle' 
                    } 
                },
                {
                    $match:{
                        $and:[
                            {"CC365_EmployeCycle.ep_id":{$in:array}},
                            {"apply_month":{"$gte": start_date}},
                            {"apply_month":{"$lte": end_date}},
                            {"com_id":id_com}
                        ]
                    }
                },
                {
                    $project:{
                        "cy_detail":1,
                        "apply_month":1,
                        "CC365_EmployeCycle.ep_id":1
                    }
                }
        ]);
        let listDataTotal = await CC365_TimeSheet.aggregate([
            {   
                $lookup: { 
                    from: 'shifts', 
                    localField: 'shift_id', 
                    foreignField: 'shift_id', 
                    as: 'shift' 
                } 
            },
            {
                $match:{
                    $and:[
                        {"ep_id":{$in:array}},
                        {"at_time":{"$gte": start_date}},
                        {"at_time":{"$lte": end_date}}
                    ]
                }
            },
            {  
                $project:{
                    "ep_id":1,
                    "sheet_id":1,
                    "shift_id":1,
                    "at_time":1,
                    "shift.start_time":1,
                    "shift.end_time":1,
                    "shift.start_time_lateste":1,
                    "shift.end_time_earliest":1,
                    "shift.num_to_money":1,
                    "shift.shift_type":1,
                    "shift.num_to_calculate":1,
                    "shift.is_overtime":1,
                }
            }
        ])
        let listDataFinal = [];
        for(let h = 0; h <listUser.length; h++){
            let user = listUser[h];
            if(user && (user.phoneTK || user.email)){
                    // lịch làm việc 
                    let list_cy_detail = list_cy_detail_total.filter((e) => 
                         ( e.CC365_EmployeCycle && e.CC365_EmployeCycle.length 
                           && (e.CC365_EmployeCycle[0].ep_id == user.idQLC)
                         )
                    )
                    let list_detail = []; //thông tin ca của từng ngày 
                    for(let i=0; i<list_cy_detail.length;i++){
                            let array = JSON.parse(list_cy_detail[i].cy_detail);
                            for(let j = 0; j < array.length;j++){
                                if(array[j].shift_id){
                                    let date = new Date(
                                        Number(array[j].date.split('-')[0]),
                                        Number(array[j].date.split('-')[1])-1, // js tháng giảm 1 
                                        Number(array[j].date.split('-')[2]),
                                        7
                                    )
                                    if(array[j].shift_id.includes(',')){
                                        let array_shift = array[j].shift_id.split(',');
                                        for(let k = 0; k < array_shift.length; k++){
                                            list_detail.push({
                                                shift_id:Number(array_shift[k]),
                                                date
                                            });
                                        }
                                    }
                                    else{
                                        list_detail.push({
                                            shift_id:Number(array[j].shift_id),
                                            date
                                        });
                                    }
                                }
                            }
                    };
                    

                    // lịch sử chấm công gắn với từng ca. 
                    let listData = listDataTotal.filter((e)=> e.ep_id == user.idQLC)
                    const day_of_month = Number(String((end_date - start_date) / (24 * 3600 * 1000)).split('.')[0]);
        
                    for(let i = 1; i <= day_of_month; i++){
                        let listTimeSheet  = listData.filter((e)=> e.at_time.getDate() == i);
                        if(listTimeSheet.length){
                            let day_of_week = GetDayOfWeek(listTimeSheet[0].at_time);
                            let lst_time = [];
                            let total_time = 0;
                            let ep_id = id_ep;
                            let listShift = [];
                            let ep_name = user.userName;
                            let ts_date; 
                            let late = 0;
                            let early = 0; 
                            let num_to_calculate = 0;
                            let num_to_money = 0;
                            let num_overtime = 0;
                            for(let j=0; j<listTimeSheet.length; j++){
                                if(!listShift.find((e)=> e ==listTimeSheet[j].shift_id)){
                                    listShift.push(listTimeSheet[j].shift_id);
                                }
                            };
                            let listShiftNotInCycle = [];
                            for(let j=0; j<listShift.length; j++){

                                let listTimeSheetOnShift = listTimeSheet.filter((e)=> e.shift_id == listShift[j]);
                                if(!list_detail.find((e)=> (e.shift_id == listShift[j]) && (e.date.getDate() == i))){
                                    listShiftNotInCycle.push(listShift[j]);
                                }
                                else{
                                    if(listTimeSheetOnShift.length > 1){
                                        listTimeSheetOnShift = listTimeSheetOnShift.sort((a, b) => {
                                            return a.at_time - b.at_time;
                                        });
                                        let tempt = Math. round(Math.abs(listTimeSheetOnShift[0].at_time - listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time) / 3600 / 1000);
                                        total_time = total_time + tempt;
                                        
                                        if(listTimeSheetOnShift[0].at_time > listTimeSheetOnShift[0].shift.start_time){
                                            let tempt2 = Math. round(Math.abs(listTimeSheetOnShift[0].at_time - listTimeSheetOnShift[0].shift.start_time) / 3600 / 1000);
                                            late = late + tempt2;
                                        }
            
                                        if(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time < listTimeSheetOnShift[listTimeSheetOnShift.length -1].shift.end_time){
                                            let tempt2 = Math. round(Math.abs(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time - listTimeSheetOnShift[listTimeSheetOnShift.length -1].shift.end_time) / 3600 / 1000);
                                            early = early + tempt2;
                                        }
            
                                        num_to_calculate = num_to_calculate + listTimeSheetOnShift[0].shift.num_to_calculate;
                                        num_to_money = num_to_money + listTimeSheetOnShift[0].shift.num_to_money;
                                        if(listTimeSheetOnShift[0].shift.is_overtime){
                                            num_overtime = num_overtime + listTimeSheetOnShift[0].shift.num_to_calculate;
                                        }
                                    }
                                }
                            }
                            for(let j=0; j<listTimeSheet.length; j++){
                                if(!listShiftNotInCycle.find((e)=> e == listTimeSheet[j].shift_id)){
                                    lst_time.push(listTimeSheet[j].at_time);
                                }
                            };
                            if(lst_time.length){
                                ts_date = lst_time[0];
                                listDataFinal.push({
                                    ep_id,
                                    ep_name,
                                    ts_date,
                                    day_of_week,
                                    total_time,
                                    late,
                                    early,
                                    num_to_calculate,
                                    num_to_money,
                                    num_overtime,
                                    lst_time,
                                })
                            }
                        }
                    };
                }
        }
        return listDataFinal;
        
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js take_count_real_works_com',error);
        return false;
    }
}

// công đi muộn về sớm
exports.get_list_timekeeping_late_early_by_employee= async (id_ep,id_com,start_date,end_date) => {
    try{

       let user = await User.findOne(
            {idQLC:id_ep,type:{$ne:1}},
            {   
                idQLC : 1,
                email: 1,
                phoneTK: 1,
                userName: 1,
                "inForPerson.employee.ep_status":1,
                "inForPerson.employee.time_quit_job":1,
                "inForPerson.account.gender":1,
            }
        ).lean();
        if(user && (user.phoneTK || user.email)){
           
            
            // let ep_resign;
            // if (user.email == '' && user.inForPerson.employee.ep_status == 'Deny' && user.phoneTK == '') {
            //     ep_resign = await CC365_Resign.find({ep_id:id_ep},{shift_id:1})
            // }

            // lịch sử chấm công gắn với từng ca. 
            let listData = await CC365_TimeSheet.aggregate([
                {   
                    $lookup: { 
                        from: 'shifts', 
                        localField: 'shift_id', 
                        foreignField: 'shift_id', 
                        as: 'shift' 
                    } 
                },
                {
                    $match:{
                        "ep_id":id_ep,
                        "at_time":{"$gte": start_date},
                        "at_time":{"$lte": end_date},
                    }
                },
                {  
                    $project:{
                        "ep_id":1,
                        "sheet_id":1,
                        "shift_id":1,
                        "ts_image":1,
                        "at_time":1,
                        "note":1,
                        "ts_location_name":1,
                        "ts_error":1,
                        "is_success":1,
                        "shift.start_time":1,
                        "shift.end_time":1,
                        "shift.start_time_latest":1,
                        "shift.end_time_earliest":1,
                        "shift.num_to_money":1,
                        "shift.shift_type":1,
                        "shift.num_to_calculate":1,
                        "shift.is_overtime":1,
                    }
                }
            ])
            //return listData
            const day_of_month = Number(String((end_date - start_date) / (24 * 3600 * 1000)).split('.')[0]);
            let listDataFinal = [];
            for(let i = 1; i <= day_of_month; i++){
                let listTimeSheet  = listData.filter((e)=> e.at_time.getDate() == i);
                if(listTimeSheet.length){
                    let listShift = [];
                    for(let j=0; j<listTimeSheet.length; j++){
                        if(!listShift.find((e)=> e ==listTimeSheet[j].shift_id)){
                            listShift.push(listTimeSheet[j].shift_id);
                        }
                    };
                    
                    for(let j=0; j<listShift.length; j++){
                        let sheet_id = 0;
                        let ep_id = id_ep;
                        let ts_image = "";
                        let ts_date = "";
                        let status = "1"; 
                        let ep_name = user.userName;
                        let ep_gender = user.inForPerson.account.gender;
                        let late = 0;
                        let late_second =0;
                        let early = 0;
                        let early_second = 0;
                        
                        
                        let listTimeSheetOnShift = listTimeSheet.filter((e)=> e.shift_id == listShift[j]);
                        if(listTimeSheetOnShift.length > 1){
                            listTimeSheetOnShift = listTimeSheetOnShift.sort((a, b) => {
                                return a.at_time - b.at_time;
                            });
                            
                            let start_real = listTimeSheetOnShift[0].at_time;
                            let start_time_shift_str = listTimeSheetOnShift[0].shift[0].start_time;
                            let start_time = new Date(
                                start_real.getFullYear(),start_real.getMonth(),start_real.getDate(),
                                Number(start_time_shift_str.split(':')[0]),
                                Number(start_time_shift_str.split(':')[1]),
                                Number(start_time_shift_str.split(':')[2]),
                            )
                            
                            let end_real = listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time;
                            let end_time_shift_str = listTimeSheetOnShift[0].shift[0].end_time;
                            let end_time = new Date(
                                end_real.getFullYear(),end_real.getMonth(),end_real.getDate(),
                                Number(end_time_shift_str.split(':')[0]),
                                Number(end_time_shift_str.split(':')[1]),
                                Number(end_time_shift_str.split(':')[2]),
                            )

                            if(listTimeSheetOnShift[0].at_time > start_time){
                                late_second = Math.round(Math.abs(listTimeSheetOnShift[0].at_time - start_time) / 1000);
                                console.log(late_second);
                                late = Math.round(late_second  / 60);
                                sheet_id = listTimeSheetOnShift[0].sheet_id;
                                ts_image = listTimeSheetOnShift[0].ts_image;
                                ts_date = listTimeSheetOnShift[0].at_time;
                            }

                            if(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time < end_time){
                                early_second = Math.round(Math.abs(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time - end_time) / 1000);
                                early = Math.round(early_second  / 60);
                                sheet_id = listTimeSheetOnShift[listTimeSheetOnShift.length -1].sheet_id;
                                ts_image = listTimeSheetOnShift[listTimeSheetOnShift.length -1].ts_image;
                                ts_date = listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time;
                            }
                            let check_in = listTimeSheetOnShift[0].at_time;
                            let check_out = listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time;
                            let ts_location_name = listTimeSheetOnShift[0].ts_location_name;
                            let shift_id = listTimeSheetOnShift[0].shift_id;
                            let shift_name = listTimeSheetOnShift[0].shift.shiftname;
                            let note = listTimeSheetOnShift[0].note;
                            let is_success = listTimeSheetOnShift[0].is_success;
                            let ts_error = listTimeSheetOnShift[0].ts_error;
                            if(late_second || early_second){
                                listDataFinal.push({
                                    sheet_id,
                                    ep_id,
                                    ts_image,
                                    ts_date,
                                    check_in,
                                    check_out,
                                    ts_location_name,
                                    shift_id,
                                    shift_name,
                                    note,
                                    ts_error,
                                    status,
                                    is_success,
                                    ep_name,
                                    ep_gender,
                                    late,
                                    late_second,
                                    early,
                                    early_second
                                })
                            }
                        }
                    }

       
                }
            };
            return listDataFinal;
        }
        else{
            return false;
        }
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_list_timekeeping_late_early_by_employee',error);
        return false;
    }
}

exports.get_list_timekeeping_late_early_by_company= async (id_ep,id_com,start_date,end_date) => {
    try{
       let listDataFinal = [];
       let listUser = await User.findOne(
            {
                idQLC:{$in:array},
                type:{$ne:1}},
            {   
                idQLC : 1,
                email: 1,
                phoneTK: 1,
                userName: 1,
                "inForPerson.employee.ep_status":1,
                "inForPerson.employee.time_quit_job":1,
                "inForPerson.account.gender":1,
            }
        ).lean();
       let data_timesheet_total = CC365_TimeSheet.aggregate([
            {   
                $lookup: { 
                    from: 'shifts', 
                    localField: 'shift_id', 
                    foreignField: 'shift_id', 
                    as: 'shift' 
                } 
            },
            {
                $match:{
                    "ep_id":{$in:array},
                    "at_time":{"$gte": start_date},
                    "at_time":{"$lte": end_date},
                }
            },
            {  
                $project:{
                    "ep_id":1,
                    "sheet_id":1,
                    "shift_id":1,
                    "ts_image":1,
                    "at_time":1,
                    "note":1,
                    "ts_location_name":1,
                    "ts_error":1,
                    "is_success":1,
                    "shift.start_time":1,
                    "shift.end_time":1,
                    "shift.start_time_latest":1,
                    "shift.end_time_earliest":1,
                    "shift.num_to_money":1,
                    "shift.shift_type":1,
                    "shift.num_to_calculate":1,
                    "shift.is_overtime":1,
                }
            }
        ]);
       for(let h=0;h<listUser.length;h++){
          let user = listUser[h];
          if(user && (user.phoneTK || user.email)){
                // lịch sử chấm công gắn với từng ca. 
                let listData = data_timesheet_total.filter((e)=> e.ep_id == user.idQLC);
                const day_of_month = Number(String((end_date - start_date) / (24 * 3600 * 1000)).split('.')[0]);
                for(let i = 1; i <= day_of_month; i++){
                    let listTimeSheet  = listData.filter((e)=> e.at_time.getDate() == i);
                    if(listTimeSheet.length){
                        let listShift = [];
                        for(let j=0; j<listTimeSheet.length; j++){
                            if(!listShift.find((e)=> e ==listTimeSheet[j].shift_id)){
                                listShift.push(listTimeSheet[j].shift_id);
                            }
                        };
                        
                        for(let j=0; j<listShift.length; j++){
                            let sheet_id = 0;
                            let ep_id = id_ep;
                            let ts_image = "";
                            let ts_date = "";
                            let status = "1"; 
                            let ep_name = user.userName;
                            let ep_gender = user.inForPerson.account.gender;
                            let late = 0;
                            let late_second =0;
                            let early = 0;
                            let early_second = 0;
                            
                            
                            let listTimeSheetOnShift = listTimeSheet.filter((e)=> e.shift_id == listShift[j]);
                            if(listTimeSheetOnShift.length > 1){
                                listTimeSheetOnShift = listTimeSheetOnShift.sort((a, b) => {
                                    return a.at_time - b.at_time;
                                });
                                
                                let start_real = listTimeSheetOnShift[0].at_time;
                                let start_time_shift_str = listTimeSheetOnShift[0].shift[0].start_time;
                                let start_time = new Date(
                                    start_real.getFullYear(),start_real.getMonth(),start_real.getDate(),
                                    Number(start_time_shift_str.split(':')[0]),
                                    Number(start_time_shift_str.split(':')[1]),
                                    Number(start_time_shift_str.split(':')[2]),
                                )
                                
                                let end_real = listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time;
                                let end_time_shift_str = listTimeSheetOnShift[0].shift[0].end_time;
                                let end_time = new Date(
                                    end_real.getFullYear(),end_real.getMonth(),end_real.getDate(),
                                    Number(end_time_shift_str.split(':')[0]),
                                    Number(end_time_shift_str.split(':')[1]),
                                    Number(end_time_shift_str.split(':')[2]),
                                )

                                if(listTimeSheetOnShift[0].at_time > start_time){
                                    late_second = Math.round(Math.abs(listTimeSheetOnShift[0].at_time - start_time) / 1000);
                                    console.log(late_second);
                                    late = Math.round(late_second  / 60);
                                    sheet_id = listTimeSheetOnShift[0].sheet_id;
                                    ts_image = listTimeSheetOnShift[0].ts_image;
                                    ts_date = listTimeSheetOnShift[0].at_time;
                                }

                                if(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time < end_time){
                                    early_second = Math.round(Math.abs(listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time - end_time) / 1000);
                                    early = Math.round(early_second  / 60);
                                    sheet_id = listTimeSheetOnShift[listTimeSheetOnShift.length -1].sheet_id;
                                    ts_image = listTimeSheetOnShift[listTimeSheetOnShift.length -1].ts_image;
                                    ts_date = listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time;
                                }
                                let check_in = listTimeSheetOnShift[0].at_time;
                                let check_out = listTimeSheetOnShift[listTimeSheetOnShift.length -1].at_time;
                                let ts_location_name = listTimeSheetOnShift[0].ts_location_name;
                                let shift_id = listTimeSheetOnShift[0].shift_id;
                                let shift_name = listTimeSheetOnShift[0].shift.shiftname;
                                let note = listTimeSheetOnShift[0].note;
                                let is_success = listTimeSheetOnShift[0].is_success;
                                let ts_error = listTimeSheetOnShift[0].ts_error;
                                if(late_second || early_second){
                                    listDataFinal.push({
                                        sheet_id,
                                        ep_id,
                                        ts_image,
                                        ts_date,
                                        check_in,
                                        check_out,
                                        ts_location_name,
                                        shift_id,
                                        shift_name,
                                        note,
                                        ts_error,
                                        status,
                                        is_success,
                                        ep_name,
                                        ep_gender,
                                        late,
                                        late_second,
                                        early,
                                        early_second
                                    })
                                }
                            }
                        }
                    }
                };
            }
       }
       return listDataFinal;
      
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_list_timekeeping_late_early_by_company',error);
        return false;
    }
}

// công đi muộn về sớm
exports.get_dx_cong_tl365= async (id_ep,id_com,start_date,end_date) => {
    try{
        let data = await Vanthu_de_xuat.find({
            "xac_nhan_cong.time_xnc":{$gte:start_date},
            "xac_nhan_cong.time_xnc":{$lte:end_date},
            type_duyet:13,
            active:1,
            com_id:id_com,
            id_user:id_ep
        }).sort({id_de_xuat:-1});
        return data;
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_dx_cong_tl365',error);
        return false;
    }
}
exports.get_dx_cong_tl365_com= async (array,id_com,start_date,end_date) => {
    try{
        let data = await Vanthu_de_xuat.find({
            "xac_nhan_cong.time_xnc":{$gte:start_date},
            "xac_nhan_cong.time_xnc":{$lte:end_date},
            type_duyet:13,
            active:1,
            com_id:id_com,
            id_user:{$in:array}
        }).sort({id_de_xuat:-1});
        return data;
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_dx_cong_tl365_com',error);
        return false;
    }
}
// lấy thông tin nhân viên 
exports.take_info_dep_com = async (ep_id,cp) =>{
    try{
        let user = await User.findOne({
            _id:ep_id,
            $or:[
                {type:0},
                {type:2}
            ]
        },{password:0}).lean();
        let company = await User.findOne({_id:cp,type:1}).lean();
        let department = {};
        if(user && user.inForPerson && user.inForPerson.employee && user.inForPerson.employee){
            department = await Department.findOne({_id:user.inForPerson.employee.dep_id}).lean()
        }
        return {
            user,
            company,
            department
        }
    }
    catch(e){
        console.log('service/tinhluong/nhanvien take_info_dep_com',e);
        return {};
    }
}

exports.get_de_xuat_tl365= async (id_ep,id_com,start_date,end_date) => {
    try{
        let data = await Vanthu_de_xuat.find({
            $or:[
                {type_duyet:6},
                {type_duyet:5}
            ],
            id_user:id_ep,
            com_id:id_com,
            time_create:{$gte:start_date},
            time_duyet:{$lte:end_date}
        }).sort({id_de_xuat:-1});
        return data;
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_dx_cong_tl365',error);
        return false;
    }
}

exports.get_de_xuat_tl365_congty= async (array,id_com,start_date,end_date) => {
    try{
        let data = await Vanthu_de_xuat.find({
            $or:[
                {type_duyet:6},
                {type_duyet:5}
            ],
            id_user:{$in:array},
            com_id:id_com,
            time_create:{$gte:start_date},
            time_duyet:{$lte:end_date}
        }).sort({id_de_xuat:-1});
        return data;
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_dx_cong_tl365',error);
        return false;
    }
}

exports.get_circle_em= async (id_ep,id_com,start_date,end_date) => {
    try{
        let list_cy_detail = await CC365_Cycle.aggregate([
                {   
                    $lookup: { 
                        from: 'CC365_EmployeCycle', 
                        localField: 'cy_id', 
                        foreignField: 'cy_id', 
                        as: 'CC365_EmployeCycle' 
                    } 
                },
                {
                    $match:{
                        $and:[
                            {"CC365_EmployeCycle.ep_id":id_ep},
                            {"apply_month":{"$gte": start_date}},
                            {"apply_month":{"$lte": end_date}},
                            {"com_id":id_com}
                        ]
                    }
                },
                {
                    $project:{
                        "cy_detail":1,
                        "apply_month":1
                    }
                }
        ]);
        let list_detail = []; //thông tin ca của từng ngày 
        for(let i=0; i<list_cy_detail.length;i++){
                let array = JSON.parse(list_cy_detail[i].cy_detail);
                for(let j = 0; j < array.length;j++){
                    if(array[j].shift_id){
                        let date = new Date(
                            Number(array[j].date.split('-')[0]),
                            Number(array[j].date.split('-')[1])-1,
                            Number(array[j].date.split('-')[2]),
                            7
                        )
                        if(array[j].shift_id.includes(',')){
                            let array_shift = array[j].shift_id.split(',');
                            for(let k = 0; k < array_shift.length; k++){
                                list_detail.push({
                                    shift_id:Number(array_shift[k]),
                                    date
                                });
                            }
                        }
                        else{
                            list_detail.push({
                                shift_id:Number(array[j].shift_id),
                                date
                            });
                        }
                    }
                }
        };

        
        return list_detail;
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_circle_em',error);
        return false;
    }
}

exports.get_circle_listem= async (list_ep,id_com,start_date,end_date) => {
    try{
        let list_cy_detail = await CC365_Cycle.aggregate([
                {   
                    $lookup: { 
                        from: 'CC365_EmployeCycle', 
                        localField: 'cy_id', 
                        foreignField: 'cy_id', 
                        as: 'CC365_EmployeCycle' 
                    } 
                },
                {
                    $match:{
                        $and:[
                            {"CC365_EmployeCycle.ep_id":{$in:list_ep}},
                            {"apply_month":{"$gte": start_date}},
                            {"apply_month":{"$lte": end_date}},
                            {"com_id":id_com}
                        ]
                    }
                },
                {
                    $project:{
                        "cy_detail":1,
                        "apply_month":1,
                        "CC365_EmployeCycle.ep_id":1
                    }
                }
        ]);
        
        let list_detail = []; //thông tin ca của từng ngày 
        for(let i=0; i<list_cy_detail.length;i++){
                let array = JSON.parse(list_cy_detail[i].cy_detail);
                for(let j = 0; j < array.length;j++){
                    if(array[j].shift_id){
                        let date = new Date(
                            Number(array[j].date.split('-')[0]),
                            Number(array[j].date.split('-')[1])-1,
                            Number(array[j].date.split('-')[2]),
                            7
                        )
                        if(array[j].shift_id.includes(',')){
                            let array_shift = array[j].shift_id.split(',');
                            for(let k = 0; k < array_shift.length; k++){
                                list_detail.push({
                                    shift_id:Number(array_shift[k]),
                                    date
                                });
                            }
                        }
                        else{
                            list_detail.push({
                                shift_id:Number(array[j].shift_id),
                                date,
                                ep_id:list_cy_detail[i].CC365_EmployeCycle[0].ep_id,
                            });
                        }
                    }
                }
        };

        
        return list_detail;
    }catch (error) {
        console.log('service/tinhluong/nhanvien.js get_circle_em',error);
        return false;
    }
}