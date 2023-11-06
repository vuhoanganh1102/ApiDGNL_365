const functions = require("../functions");

exports.removeAccent = async(title) => {
    var fromChars = "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ";
    var toChars = "aaaaaaaaaaaaaaaaadeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy";

    for (var i = 0; i < fromChars.length; i++) {
        title = title.replace(new RegExp(fromChars.charAt(i), "g"), toChars.charAt(i));
    }

    return title;
}

exports.replaceTitle = async(title) => {
    title = await exports.removeAccent(title);
    var arrStr = ["&lt;", "&gt;", "/", "\\", "&apos;", "&quot;", "&amp;", "lt;", "gt;", "apos;", "quot;", "amp;", "&lt", "&gt", "&apos", "&quot", "&amp", "&#34;", "&#39;", "&#38;", "&#60;", "&#62;"];
    title = title.replace(new RegExp(arrStr.join("|"), "g"), " ");
    title = title.replace(/[^0-9a-zA-Z\s]+/g, " ");
    title = title.replace(/ {2,}/g, " ");
    title = title.trim().replace(/ /g, "-");
    title = encodeURIComponent(title);
    var arrayAfter = ["%0D%0A", "%", "&"];
    title = title.replace(new RegExp(arrayAfter.join("|"), "g"), "-");
    title = title.toLowerCase();
    return title;
}