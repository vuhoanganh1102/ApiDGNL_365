const fnc = require('../../services/functions')
const Campaign = require('../../models/crm/Campaign/Campaign')
const DetailCampaign = require('../../models/crm/Campaign/DetailCampaign')
const TablePriceList = require('../../models/crm/TablePriceList')
const DetailPriceList = require('../../models/crm/DetailPriceList')
const Form = require('../../models/crm/Form')
const FormEmail = require('../../models/crm/FormEmail')
const FormContract = require('../../models/crm/FormContract')
const FormRegister = require('../../models/crm/FormRegister')
const EmailPersonal = require('../../models/crm/EmailPersonal')
const EmailSms = require('../../models/crm/EmailSms')
const EmailSystem = require('../../models/crm/EmailSystem')
const GroupSupplier = require('../../models/crm/GroupSupplier')
const Survey = require('../../models/crm/CustomerCare/Survey')
const HistoryCustomerCare = require('../../models/crm/CustomerCare/HistoryCustomerCare')
const AppointmentSchedule = require('../../models/crm/CustomerCare/AppointmentSchedule')
const Fundbook = require('../../models/crm/FinanceManager/Fundbook')
const GroupPins = require('../../models/crm/GroupPins')
const DetailSurvery = require('../../models/crm/DetailSurvery')
const DetailReturnProduct = require('../../models/crm/DetailReturnProduct')
const DetailListOrder = require('../../models/crm/DetailListOrder')
const DetailFormContract = require('../../models/crm/DetailFormContract')
const DetailEmailSms = require('../../models/crm/DetailEmailSms')



const axios = require('axios');
const FormData = require('form-data');



exports.toolCampaign = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let data = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listCampaign?page' + page)
            // let data = listItems.data;
            console.log(data)
            
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
            const element = DB[i];
            // let cityArray = item.new_city.split(",").map(String);

            const Campaigns = new Campaign({
                _id: element.id,
                groupID: element.group_id,
                nameCampaign: element.name,
                typeCampaign: element.campaign_type,
                timeStart: element.start_date,
                timeEnd: element.end_date,
                money: element.money,
                expectedSales: element.expected_sales,
                chanelCampaign: element.campaign_chanel,
                investment: element.investment,
                empID: element.emp_id,
                description: element.description,
                shareAll: element.share_all,
                companyID: element.company_id,
                countEmail: element.count_email,
                status: element.status,
                type: element.type,
                userIdCreate: element.user_id_create,
                userIdUpdate: element.user_id_update,
                site: element.site,
                isDelete: element.is_delete,
                hidden_null: element.hidden_null,
                createdAt: element.created_at,
                updatedAt: element.updated_at,
            })
            await Campaigns.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}




exports.toolTablePriceList = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listTablePriceList?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                const element = data[i];
                const PriceList = new TablePriceList({
                _id: element.id,
                company_id: element.company_id,
                emp_id: element.emp_id,
                id_customer: element.id_customer,
                image_logo: element.image_logo,
                name: element.name,
                website: element.website,
                user_bank: element.user_bank,
                name_bank: element.name_bank,
                number_bank: element.number_bank,
                branch_bank: element.branch_bank,
                count: element.count,
                discount: element.discount,
                type_discount: element.type_discount,
                content: element.content,
                is_delete: element.is_delete,
                status_save: element.status_save,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await PriceList.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolAppointmentSchedule = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listAppointmentSchedule?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await AppointmentSchedule.findById(element.id)
                    if (check) continue
                    // let post = await fnc.getDatafindOne(AppointmentSchedule, { _id: element.new_id });
                    // if (post == null) {
                const schedule = new DetailCampaign({
                _id: element.id,
                schedule_name: element.schedule_name,
                cus_id: element.cus_id,
                id_customer: element.id_customer,
                ep_id: element.ep_id,
                address: element.address,
                start_date_schedule: element.start_date_schedule,
                end_date_schedule: element.end_date_schedule,
                schedule_status: element.schedule_status,
                reason_cancel: element.reason_cancel,
                description: element.description,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await schedule.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolDetailCampaign = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailCampaign?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await DetailCampaign.findById(element.id)
                    if (check) continue
                    // let post = await fnc.getDatafindOne(AppointmentSchedule, { _id: element.new_id });
                    // if (post == null) {
                const Detail = new DetailCampaign({
                _id: element.id,
                id_campagin: element.id_campagin,
                id_cus: element.id_cus,
                status: element.status,
                note: element.note,
                emp_id: element.emp_id,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await Detail.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolAppointmentSchedule = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listAppointmentSchedule?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await AppointmentSchedule.findById(element.id)
                    if (check) continue
                    // let post = await fnc.getDatafindOne(AppointmentSchedule, { _id: element.new_id });
                    // if (post == null) {
                const schedule = new AppointmentSchedule({
                _id: element.id,
                schedule_name: element.schedule_name,
                cus_id: element.cus_id,
                id_customer: element.id_customer,
                ep_id: element.ep_id,
                address: element.address,
                start_date_schedule: element.start_date_schedule,
                end_date_schedule: element.end_date_schedule,
                schedule_status: element.schedule_status,
                reason_cancel: element.reason_cancel,
                description: element.description,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await schedule.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolHistoryCustomerCare = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listHistoryCustomerCare?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await HistoryCustomerCare.findById(element.id);
                    console.log(check)
                    if (check) continue
                    // let post = await fnc.getDatafindOne(HistoryCustomerCare, { _id: element.new_id });
                    // if (post == null) {
                const schedule = new HistoryCustomerCare({
                _id: element.id,
                id_customer: element.id_customer,
                id_customer_care: element.id_customer_care,
                days: element.days,
                weeks: element.weeks,
                month: element.month,
                count: element.count,
                start_date: element.start_date,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
           await schedule.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolFundbook = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFundbook?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await Fundbook.findById(element.id)
                    console.log(check)
                    if (check) continue
                    // let post = await fnc.getDatafindOne(Fundbook, { _id: element.new_id });
                    // if (post == null) {
                const datas = new Fundbook({
                _id: element.id,
                name: element.name,
                total_money: element.total_money,
                id_supplier: element.id_supplier,
                id_company: element.id_company,
                description: element.description,
                id_manager: element.id_manager,
                status: element.status,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await datas.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolDetailPriceList = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailPriceList?page' + page)
            let data = listItems.data;
            // console.log(data)
            // let cityArray = item.new_city.split(",").map(String);
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    let check = await DetailPriceList.findById(element.id)
                    console.log(check)
                    if (check) continue
                    // let post = await fnc.getDatafindOne(DetailPriceList, { _id: element.new_id });
                    // if (post == null) {
                const datas = new DetailPriceList({
                _id: element.id,
                id_table_price: element.id_table_price,
                sum_1: element.sum_1,
                id_product: element.id_product,
                quantity: element.quantity,
                tax: element.tax,
                discount: element.discount,
                type_discount: element.type_discount,
                sum: element.sum,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await datas.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}



exports.toollistSurvey = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listSurvey?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                let check = await Survey.findById(data[i].id)
                console.log(check)
                if (check) continue
                for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const listSurvey = new Survey({
                _id: element.id,
                title: element.title,
                url_survey: element.url_survey,
                description: element.description,
                create_date: element.create_date,
                company_id: element.company_id,
                emp_id: element.emp_id,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolForm = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listForm?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const listSurvey = new Form({
                _id: element.id,
                name: element.name,
                phone_number: element.phone_number,
                email: element.email,
                gender: element.gender,
                birthday: element.birthday,
                address: element.address,
                name_form: element.name_form,
                url_form: element.url_form,
                start_date: element.start_date,
                end_date: element.end_date,
                emp_id: element.emp_id,
                company_id: element.company_id,
                type: element.type,
                status: element.status,
                name_add_field: element.name_add_field,
                add_field: element.add_field,
                field_right: element.field_right,
                count_open: element.count_open,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolFormContract = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFormContract?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const listSurvey = new FormContract({
                _id: element.id,
                name: element.name,
                path_file: element.path_file,
                com_id: element.com_id,
                ep_id: element.ep_id,
                id_file: element.id_file,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolFormEmail = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFormEmail?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const listSurvey = new FormEmail({
                _id: element.id,
                company_id: element.company_id,
                name_form_email: element.name_form_email,
                title_form_email: element.title_form_email,
                content_form_email: element.content_form_email,
                user_create_id: element.user_create_id,
                user_create_type: element.user_create_type,
                user_edit_id: element.user_edit_id,
                user_edit_type: element.user_edit_type,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolFormRegister = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listFormEmail?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const listSurvey = new FormRegister({
                _id: element.id,
                id_form: element.id_form,
                name: element.name,
                phone_number: element.phone_number,
                email: element.email,
                gender: element.gender,
                birthday: element.birthday,
                address: element.address,
                question: element.question,
                answer: element.answer,
                choose_answer: element.choose_answer,
                type: element.type,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolEmailPersonal = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listEmailPersonal?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const listSurvey = new EmailPersonal({
                _id: element.id,
                company_id: element.company_id,
                server_mail: element.server_mail,
                port_number: element.port_number,
                address_send_mail: element.address_send_mail,
                name_mail: element.name_mail,
                name_login: element.name_login,
                password: element.password,
                method_security: element.method_security,
                number_email_sent: element.number_email_sent,
                time_send_mail: element.time_send_mail,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolEmailSms = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listEmailSms?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await EmailSms.findById(data[i].id)
                    console.log(check)
                    if (check) continue

            const element = data[i];
            const listSurvey = new EmailSms({
                _id: element.id,
                company_id: element.company_id,
                type: element.type,
                campaign_id: element.campaign_id,
                email_id: element.email_id,
                title: element.title,
                name: element.name,
                content: element.content,
                supplier: element.supplier,
                all_receiver: element.all_receiver,
                list_receiver: element.list_receiver,
                email_reply: element.email_reply,
                info_system: element.info_system,
                date_send_email: element.date_send_email,
                time_send_email: element.time_send_email,
                user_create_id: element.user_create_id,
                user_create_type: element.user_create_type,
                user_edit_id: element.user_edit_id,
                user_edit_type: element.user_edit_type,
                status: element.status,
                customer_id: element.customer_id,
                time_service: element.time_service,
                sell_value: element.sell_value,
                time_service_end: element.time_service_end,
                sell_value_end: element.sell_value_end,
                cit_id: element.cit_id,
                birth_day: element.birth_day,
                birthday_end: element.birthday_end,
                emp_id: element.emp_id,
                cus_date: element.cus_date,
                cus_date_end: element.cus_date_end,
                resoure: element.resoure,
                gender: element.gender,
                gr_id: element.gr_id,
                start_date: element.start_date,
                send_time: element.send_time,
                site: element.site,
                id_color: element.id_color,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolEmailSystem = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listEmailSystem?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await EmailSystem.findById(data[i].id)
                    console.log(check)
                    if (check) continue
            const element = data[i];
            const listSurvey = new EmailSystem({
                _id: element.id,
                company_id: element.company_id,
                server_mail: element.server_mail,
                port_number: element.port_number,
                address_send_mail: element.address_send_mail,
                name_mail: element.name_mail,
                name_login: element.name_login,
                password: element.password,
                method_security: element.method_security,
                is_delete: element.is_delete,
                created_at: element.created_at,
                updated_at: element.updated_at,
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolGroupSupplier = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listGroupSupplier?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await GroupSupplier.findById(data[i].gr_id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new GroupSupplier({

                        _id : element.gr_id, 
                        gr_name : element.gr_name, 
                        gr_description : element.gr_description, 
                        company_id : element.company_id, 
                        emp_id : element.emp_id, 
                        is_delete : element.is_delete, 
                        created_at : element.created_at, 
                        updated_at : element.updated_at, 
            })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}

exports.toolGroupPins = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listGroupPins?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await GroupPins.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new GroupPins({

                        _id : element.id,
                        user_id : element.user_id,
                        user_type : element.user_type,
                        group_id : element.group_id,
                        status : element.status,
                        is_parent : element.is_parent,
                        created_at : element.created_at,
                        updated_at : element.updated_at,
                    })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolDetailSurvery = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailSurvery?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await DetailSurvery.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailSurvery({

                        _id : element.id,
                        id_survey : element.id_survey,
                        title : element.title,
                        description : element.description,
                        question : element.question,
                        answer : element.answer,
                        answer_right : element.answer_right,
                        small_title : element.small_title,
                        small_description : element.small_description,
                        url_image : element.url_image,
                        url_video : element.url_video,
                        type : element.type,
                        type_part : element.type_part,
                        created_at : element.created_at,
                        updated_at : element.updated_at,    
                    
                        
                    })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolDetailReturnProduct = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailReturnProduct?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let check = await DetailReturnProduct.findById(data[i].id)
                    console.log(check)
                    if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailReturnProduct({

                        _id : element.id,
                        parent_id : element.parent_id,
                        product_id : element.product_id,
                        price : element.price,
                        quantity : element.quantity,
                        created_at : element.created_at, 
                    
                        
                    })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolDetailListOrder = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailListOrder?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    // let check = await DetailListOrder.findById(data[i].id)
                    // console.log(check)
                    // if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailListOrder({

                        _id : element.id,
                        id_product : element.id_product,
                        id_parent : element.id_parent,
                        product_name : element.product_name,
                        product_unit : element.product_unit,
                        quantity : element.quantity,
                        price : element.price,
                        total : element.total,
                        type_discount : element.type_discount,
                        percent_discount : element.percent_discount,
                        discount : element.discount,
                        vat : element.vat,
                        percent_tax : element.percent_tax,
                        tax_in_money : element.tax_in_money,
                        total_after_process : element.total_after_process,
                        status : element.status,
                        is_delete : element.is_delete,
                        created_at : element.created_at,
                        
                    })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}
exports.toolDetailFormContract = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailFormContract?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    // let check = await DetailListOrder.findById(data[i].id)
                    // console.log(check)
                    // if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailFormContract({

                        _id : element.id,
                        id_form_contract : element.id_form_contract,
                        new_field : element.new_field,
                        old_field : element.old_field,
                        index_field : element.index_field,
                        default_field : element.default_field,
                        
                    })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}


exports.toolDetailEmailSms = async(req, res, next) => {

    try {
        let page = 1;
        let result = true;
        do {
            let listItems = await fnc.getDataAxios('https://crm.timviec365.vn/ApiDataTable/listDetailEmailSms?page' + page)
            let data = listItems.data;
            // console.log(data)
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    // let check = await DetailListOrder.findById(data[i].id)
                    // console.log(check)
                    // if (check) continue
                    const element = data[i];
                    const listSurvey = new DetailEmailSms({

                        _id : element.id,
                        id_email_sms : element.id_email_sms,
                        id_cus : element.id_cus,
                        created_at : element.created_at,
                        updated_at : element.updated_at,
                        
                    })
            await listSurvey.save()
        }
        page++;
    } else {
        result = false;
    }
    console.log(page)
} while (result);
return fnc.success(res, 'Thành công')
} catch (error) {
console.log(error);
return fnc.setError(res, error.message);
}
}

