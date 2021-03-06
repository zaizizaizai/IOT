/**
 * 根据请求url响应对应内容
 */

 var fs = require('fs');
 var url = require('url');
 var querystring = require('querystring');
 var sd = require('silly-datetime');
 var lists = require('../model/lists')();


 var getHandler = {};
 var postHandler = {};

 //处理对主页的响应
 getHandler['/'] = function(req, res){
    var listMenu ="";
    //把wet、temp、time拼接为首页数据
    var list = lists.getLastList();
    listMenu += '<table class="list" border="1"><tr><th>湿度</th><th id="wet">' + list.wet +
                '</th></tr><tr><th>温度</th><th id="temp">' + list.temp +
                '</th></tr><tr><th>时间</th><th id="time">' + list.time +
                '</th></tr></table>';

    res.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile(__dirname + '/../views/index.html', (err, data) => {
        if(err){
            console.log(err);
        } else {
            //动态渲染模板
            res.end(data.toString().replace('{{listMenu}}', listMenu));
        }
    });
 }

 //请求不存在的url，404响应
 getHandler['/404'] = function(req, res){
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end("404 Not Found");
 }

 // post请求的处理方法示例
postHandler['/'] = function(res, data) {
    // do something
};

 //get请求
 function get(req, res){
    var reqUrl = url.parse(req.url);

    //FIXME:把reqUrl解析，获取发送来的温度等数据，存入data
    var param = reqUrl.query;
    if(param){
        //解析参数为arduino的值
        var arduino = url.parse(decodeURI(req.url),true).query.arduino;
        if(arduino == 'yes'){
            //解析参数为wet的值
            var wet = url.parse(decodeURI(req.url),true).query.wet;
            if(wet)
                console.log(wet);
            //解析参数为temp的值
            var temp = url.parse(decodeURI(req.url),true).query.temp;
            if(temp)
                console.log(temp);
            //获取当前时间
            var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');

            //把数据写入json格式的data中
            lists.changeList(wet, temp, time);
        }
    }

    if(typeof getHandler[reqUrl.pathname] === "function"){
        getHandler[reqUrl.pathname](req, res);
    } else {
        getHandler["/404"](req, res);
    }
 }

 // post请求（示例）
function post(req, res) {
    var reqUrl = url.parse(req.url);

    if (typeof postHandler[reqUrl.pathname] === "function") {
    var postData = "";
    req.on('data', (data) => {
        postData += data;
    });
    req.on('end', () => {
        postData = querystring.parse(postData);
        postHandler[reqUrl.pathname](res, postData);
    });
    } else {
    getHandler["/404"](req, res);
    }
}

 //打包模块
module.exports = {
    get: get,
    post: post
}