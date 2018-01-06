var http = require('http');
var url = require('url');
var api = require('./route/api');
var static = require('./route/static');

//匹配静态文件夹路径的正则表达式，用于判断请求是否为静态文件请求
var staticExp = /\/public\/(img|css|js)\/[a-z]*\.(jpg|png|gif|css|js)/;

//创建服务器，监听本机3000端口
http.createServer((req,res) => {
    //获取请求url中的pathname
    var pathName = url.parse(req.url).pathname;

    //静态请求由static处理
    if(staticExp.test(pathName)){   
        static.get(__dirname + pathName, res);
    }
    //处理普通POST请求
    else if(req.method == 'POST'){
        api.post(req,res);
    }
    //处理普通get请求
    else{
        api.get(req,res);
    }

}).listen(3000);

console.log('[Server Info] Satrt server at http://localhost:3000/');