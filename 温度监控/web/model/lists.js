var fs = require('fs');

module.exports = function(){
    //读取data中数据
    var data = JSON.parse(fs.readFileSync(__dirname + '/../data/data.json'));
    var lists = {
        getAllLists: getAllLists,
        getLastList: getLastList
    };

    //获取所有list
    function getAllLists(){
        return data.lists;
    }

    //获取最新的list
    function getLastList(){
        return data.lists[data.lists.length - 1];
    }

    //添加数据
    function changeList(wet, temp, time){
        data.lists[data.lists.length - 1].wet = wet;
        data.lists[data.lists.length - 1].temp = temp;
        data.lists[data.lists.length - 1].time = time;
    }

    return lists;
};
