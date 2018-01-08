const express=require('express');
const bodyParser=require('body-parser');
const consolidate=require('consolidate');

var server=express();
server.listen(8080);

//1.获取请求数据
//get自带
server.use(bodyParser.urlencoded({ extended: false }));


//3.模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');

//4.route
server.use('/', require('./route/index.js')());


console.log('server is running at port 8080...');
