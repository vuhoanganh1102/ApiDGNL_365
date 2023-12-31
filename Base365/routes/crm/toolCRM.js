const router = require('express').Router();
const formData = require("express-form-data");
const ToolCRM = require("../../controllers/tools/CRM");
const funtions = require('../../services/functions')

router.get('/campaign',ToolCRM.toolCampaign)
router.get('/contact',ToolCRM.toolContact)
router.get('/tablePriceList',ToolCRM.toolTablePriceList)
router.get('/appointmentSchedule',ToolCRM.toolAppointmentSchedule)
router.get('/detailCampaign',ToolCRM.toolDetailCampaign)
router.get('/historyCustomerCare',ToolCRM.toolHistoryCustomerCare)
router.get('/fundbook',ToolCRM.toolFundbook)
router.get('/detailPriceList',ToolCRM.toolDetailPriceList)
router.get('/listSurvey',ToolCRM.toollistSurvey)
router.get('/form',ToolCRM.toolForm)
router.get('/formContract',ToolCRM.toolFormContract)
router.get('/formEmail',ToolCRM.toolFormEmail)
router.get('/formRegister',ToolCRM.toolFormRegister)
router.get('/emailPersonal',ToolCRM.toolEmailPersonal)
router.get('/emailSms',ToolCRM.toolEmailSms)
router.get('/emailSystem',ToolCRM.toolEmailSystem)
router.get('/groupSupplier',ToolCRM.toolGroupSupplier)
router.get('/groupPins',ToolCRM.toolGroupPins)
router.get('/detailSurvery',ToolCRM.toolDetailSurvery)

router.post('/contactCustomer',ToolCRM.toolContactCustomer)
router.post('/customer',ToolCRM.toolCustomer)
router.post('/customerCare',ToolCRM.toolCustomerCare)
router.get('/detailListOrder',ToolCRM.toolDetailListOrder)
router.post('/customerCare',ToolCRM.toolCustomerCare)
router.post('/customerChance',ToolCRM.toolCustomerChance)
router.post('/customerChanceFile',ToolCRM.toolCustomerChanceFile)
router.get('/detailFormContract',ToolCRM.toolDetailFormContract)
router.post('/chanFoots',ToolCRM.toolChanFoots)
router.get('/detailEmailSms',ToolCRM.toolDetailEmailSms)
router.post('/cusFile',ToolCRM.toolCusFile)
router.post('/customerGroup',ToolCRM.toolCustomerGroup)
router.post('/customerMulti',ToolCRM.toolCustomeMulti)
router.post('/customerNote',ToolCRM.toolCustomerNote)
router.post('/customerStatus',ToolCRM.toolCustomerStatus)
router.post('/phieu',ToolCRM.tool_phieu)
router.post('/shareCampaign',ToolCRM.tbl_share_campaign)
router.post('/shareChance',ToolCRM.tbl_share_chance)
router.post('/shareCustomer',ToolCRM.tbl_share_customer)
router.post('/ward',ToolCRM.ward)
router.post('/historyEditCustomer',ToolCRM.history_edit_customer)
router.post('/historyStages',ToolCRM.history_stages)
router.post('/listNew',ToolCRM.list_new_3321)
router.post('/listOrder',ToolCRM.list_order)
router.get('/detailForm',ToolCRM.toolDetailForm)
router.post('/manageAdmin',ToolCRM.toolmanageAdmin)
router.get('/products',ToolCRM.toolProducts)
router.post('/manageExtension',ToolCRM.toolmanageExtension)
router.post('/moduleParent',ToolCRM.toolmoduleParent)
router.get('/productGroups',ToolCRM.toolProductGroups)
router.post('/notify',ToolCRM.toolNotify)
router.post('/packages',ToolCRM.toolPackages)
router.post('/savestatusC',ToolCRM.toolSavestatusC)
router.post('/surveyRegister',ToolCRM.survey_register)
router.post('/acceptRole',ToolCRM.accept_role)
router.post('/accountApi',ToolCRM.account_api)
router.post('/appointmentContentCall',ToolCRM.appointment_content_call)
router.post('/bank',ToolCRM.bank)
router.post('/callHistory',ToolCRM.call_history)
router.post('/connnectApiConfig',ToolCRM.connnect_api_config)
router.post('/detailtblPhieu',ToolCRM.detail_tbl_phieu)
router.post('/returnProduct',ToolCRM.return_product)
router.post('/supplier',ToolCRM.supplier)
router.post('/receiverEmail',ToolCRM.receiver_email)
router.post('/promotionProduct',ToolCRM.promotion_product)

module.exports = router;