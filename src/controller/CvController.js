import axios from 'axios'
import CVUV from '../model/Timviec365/CV/CVUV.js';
import NganhCV from '../model/Timviec365/CV/NganhCV.js';
import NgonNguCV from '../model/Timviec365/CV/NgonNguCV.js';
import CV from '../model/Timviec365/CV/CV.js';
const url={
    CVUV:'https://timviec365.vn/cv365/api_nodejs/get_tbl_cv_ungvien.php?page=1',
    ngangCV:'https://timviec365.vn/cv365/api_nodejs/get_dm_nganhcv.php?page=1',
    ngonNguCV:'https://timviec365.vn/cv365/api_nodejs/get_dm_nn_cv.php?page=1',
    CV:'https://timviec365.vn/cv365/api_nodejs/get_tbl_cv.php?page=1'
}
export const getDataCVUV = async (req, res, next) => {
    try {
        await axios({
            method: "post",
            url: url.CV,
            data: {
            },
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async(response) => {
            // postDataCVUV(response.data)
            // postDataNgangCV(response.data)
            // postDataNgonNguCV(response.data)
            postDataCV(response.data)
            return res.status(200).json(response.data)
        });
    } catch (err) {
        console.log(err);
    }
};
const postDataCVUV=async(data)=>{
    try{
        data.forEach(async(element) => {
                const insert= new CVUV({
                    _id:element.id,
                    userId:element.uid,
                    cvId:element.cvid,
                    lang:element.lang,
                    html:{
                        color:element.html.css.color,
                        font:element.html.css.font,
                        fontSize:element.html.css.font_size,
                        fontSpacing:element.html.css.font_spacing,

                    },
                    nameImage:element.name_img,
                    timeEdit:element.time_edit,
                    cv:element.cv,
                    status:element.status,
                    deleteCv:element.delete_cv,
                    heightCv:element.height_cv,
                    scan:element.scan,
                    state:element.state,
                })
                await insert.save()
            })

    } catch(err){
        console.log(err)
    }
}
const postDataNgangCV=(data)=>{
    try{
        data.forEach(async(element) => {
                const insert= new NganhCV({
                    _id:element.id,
                    name:element.name,
                    alias:element.alias,
                    metaH1:element.meta_h1,
                    content:element.content,
                    cId:element.cid,
                    metaTitle:element.meta_title,
                    metaKey:element.meta_key,
                    metaDes:element.meta_des,
                    metaTt:element.meta_tt,
                    status:element.status,
                })
                await insert.save()
            })

    } catch(err){
        console.log(err)
    }
}
const postDataNgonNguCV=(data)=>{
    try{
        data.forEach(async(element) => {
                const insert= new NgonNguCV({
                    _id:element.id,
                    name:element.name,
                    alias:element.alias,
                    metaH1:element.meta_h1,
                    content:element.content,
                    cId:element.cid,
                    metaTitle:element.meta_title,
                    metaKey:element.meta_key,
                    metaDes:element.meta_des,
                    metaTt:element.meta_tt,
                    status:element.status,
                })
                await insert.save()
            })

    } catch(err){
        console.log(err)
    }
}
const postDataCV=(data)=>{
    try{
        data.forEach(async(element) => {
                const insert= new CV({
                    _id:element.id,
                    name:element.name,
                    alias:element.alias,
                    urlAlias:element.url_alias,
                    urlCanonical:element.url_canonical,
                    image:element.image,
                    price:element.price,
                    color:element.colors,
                    view:element.view,
                    favorite:element.love,
                    download:element.download,
                    vip:element.vip,
                    cvIndex:element.cv_index,
                    cId:element.cid,
                    langId:element.lang_id,
                    motaCv:element.meta_tt,
                    content:element.status,
                    htmlVi:JSON.stringify(element.html_vi),
                    htmlEn:JSON.stringify(element.html_en),
                    htmlJp:JSON.stringify(element.html_jp),
                    htmlCn:JSON.stringify(element.html_cn),
                    htmlKr:JSON.stringify(element.html_kr),
                    cateId:element.cate_id,
                    designId:element.design_id,
                    exp:element.exp,
                    nhuCau:element.nhucau,
                    metaTitle:element.meta_title,
                    metaKey:element.meta_key,
                    metaDes:element.meta_des,
                    full:element.full,
                    status:element.status,
                    thuTu:element.thutu
                })
                await insert.save()
            })

    } catch(err){
        console.log(err)
    }
}
export const getDataCV = async(req,res,next)=>{
    await CV.find({}).exec().then(async(response)=>{
        return res.status(200).json(response)
    })
}
