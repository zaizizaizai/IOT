const express = require('express');
const sd = require('silly-datetime');
const fs = require('fs');

module.exports = function (){
    var router = express.Router();

    var data = JSON.parse(fs.readFileSync(__dirname + '/../data/data.json'));

    //首页
    router.get('/', (req, res) => {

        var list =  data.lists[data.lists.length - 1];
        wet = list.wet;
        temp = list.temp;
        time = list.time;

        res.render('index.ejs', {
            wet: wet,
            temp: temp,
            time: time
        });
    });

    //传送数据
    router.get('/a/', function(req, res){


        //FIXME:把reqUrl解析，获取发送来的温度等数据，存入data
        //解析参数为arduino的值
        var arduino = req.query.arduino;
        if(arduino == 'yes'){
            //解析参数为wet的值
            var wet = req.query.wet;
            if(wet)
                console.log('wet:'+wet);
            //解析参数为temp的值
            var temp = req.query.temp;
            if(temp)
                console.log('temp:'+temp);
            //获取当前时间
            var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
            console.log('time:'+time);

            //把数据写入json格式的data中
            data.lists[data.lists.length - 1].wet = wet;
            data.lists[data.lists.length - 1].temp = temp;
            data.lists[data.lists.length - 1].time = time;

            res.render('index.ejs', {
                wet: wet,
                temp: temp,
                time: time
            });
        }
    });

    return router;
}