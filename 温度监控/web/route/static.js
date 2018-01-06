/**
 * 静态文件请求
 * 将被请求的文件发送给客户机
 * 1、判断文件是否存在
 *    存在，发送给客户机
 *    不存在，暂不处理
 * 2、设置http报头的MIME type（方便客户机识别文件类型）
 * 3、多媒体文件需要用二进制的读写方式，相应图片时加"binary""
 */

var fs = require('fs');
var path = require('path');

var MIME = {};
MIME[".css"] = "text/css";
MIME[".js"] = "text/javascript";
MIME[".jpg"] = "image/jpg";
MIME[".jpeg"] = "image/jpeg";
MIME[".png"] = "image/png";
MIME[".gif"] = "image/gif";

function get(pathName, res){
    //文件存在
    if(fs.existsSync(pathName)){
        //拓展名
        var extName = path.extname(pathName);
        res.writeHead(200, {'Content-Type': MIME[extName]});

        fs.readFile(pathName, (err,data) => {
            if(err){
                console.log(err);
            } else if(isImage(extName)){    //二进制文件需要加binary
                res.end(data, "binary")
            } else {
                res.end(data.toString());
            }
        });
    }
}

//根据拓展名判断是否为图片
function isImage(extName){
    if(extName === '.jpg' || extName === '.jpeg' ||
    extName === '.png' || extName === '.gif'){
        return true;
    }
    return false;
}

//打包模块
module.exports = {
    get: get
};