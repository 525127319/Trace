export default {
    // 正则匹配获取token
    getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
     //根据日历时间（中国标准时间）转换成时间格式yyyy-MM-dd
     formatDateTime (inputTime) {
        if (inputTime == undefined) {
            return "";
        }
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        // return y + '-' + m + '-' + d + '' + ''  + h + ':' + minute;
        return y + '-' + m + '-' + d +' ' + h +':' + minute ;
    },
    /**************************************时间格式化处理************************************/
    // date参数 是==>new Date()的时间格式
    dateFormate: function (fmt, date) { //author: meizz   
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    // 百分比，取两位小数
     drawProgressNum:function(num, total) {
         if(total == 0){
            percentNum = 0 + '.00%';
            return percentNum;
         }
        var leftWidth = (num / total) * 100;
    
        //将百分比保留两位小数
        var percentNum = (Math.round(leftWidth*100)/100).toFixed(2) + '%';
        return percentNum;
    },
    // 数组去重
     removeDuplicatedItem:function(ar) {
        var ret = [];
    
        for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
                ret.push(ar[i]);
            }
        }
    
        return ret;
    },
    // 点击或者滑动其它地方收起软键盘
    hiddenSoftKeyboard: function(){
        
    },
    uniqueArr(arr){
        var n = []; // 存放已遍历的满足条件的元素
        for (var i = 0; i < arr.length; i++) {
            // indexOf()判断当前元素是否已存在
            if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
        }
        return n;
    },
    formatClass:function(arr){
        let nameArr = [];
        let resultObj = {};
        for(var i=0; i<arr.length;i++){
            nameArr.push(arr[i].dorn + ' ' +arr[i].reportTime);
        }
        let uniqueArr =this.uniqueArr(nameArr);//去重得到唯一的name
        for(var j=0; j<uniqueArr.length; j++){
            let name = uniqueArr[j];
            let tempArr = [];        
            for(var k = 0; k<arr.length; k++){
                if(name == (arr[k].dorn + ' ' +arr[k].reportTime)){
                    tempArr.push(arr[k]);
                }
            }
            resultObj[name] = tempArr;
        }
        return resultObj;
    },
    formatData:function(arr){
        let nameArr = [];
        let resultObj = {};
        for(var i=0; i<arr.length;i++){
            nameArr.push(arr[i].modelName + ' ' +arr[i].upcCode);
        }
        let uniqueArr =this.uniqueArr(nameArr);//去重得到唯一的name
        for(var j=0; j<uniqueArr.length; j++){
            let name = uniqueArr[j];
            let tempArr = [];        
            for(var k = 0; k<arr.length; k++){
                if(name == (arr[k].modelName + ' ' +arr[k].upcCode)){
                    tempArr.push(arr[k]);
                }
            }
            resultObj[name] = tempArr;
        }
        return resultObj;
    },
    formatOtherData:function(arr){
        let nameArr = [];
        let resultObj = {};
        for(var i=0; i<arr.length;i++){
            nameArr.push(arr[i].partNo);
        }
        let uniqueArr =this.uniqueArr(nameArr);//去重得到唯一的name
        for(var j=0; j<uniqueArr.length; j++){
            let name = uniqueArr[j];
            let tempArr = [];        
            for(var k = 0; k<arr.length; k++){
                if(name == (arr[k].partNo)){
                    tempArr.push(arr[k]);
                }
            }
            resultObj[name] = tempArr;
        }
        return resultObj;
    },
    formatManyData:function(arr){
        let nameArr = [];
        let resultObj = {};
        for(var i=0; i<arr.length;i++){
            nameArr.push(arr[i].modelName +' '+arr[i].partName +' ' +arr[i].upcCode +' ' +arr[i].partNo);
        }
        let uniqueArr =this.uniqueArr(nameArr);//去重得到唯一的name
        for(var j=0; j<uniqueArr.length; j++){
            let name = uniqueArr[j];
            let tempArr = [];        
            for(var k = 0; k<arr.length; k++){
                if(name == (arr[k].modelName +' ' +arr[k].partName +' '+arr[k].upcCode +' ' +arr[k].partNo)){
                    tempArr.push(arr[k]);
                }
            }
            resultObj[name] = tempArr;
        }
        return resultObj;
    },
    formatModelName:function(arr){
        let nameArr = [];
        let resultObj = {};
        for(var i=0; i<arr.length;i++){
            nameArr.push(arr[i].modelName +' '+arr[i].partName +' ' +arr[i].upcCode);
        }
        let uniqueArr =this.uniqueArr(nameArr);//去重得到唯一的name
        for(var j=0; j<uniqueArr.length; j++){
            let name = uniqueArr[j];
            let tempArr = [];        
            for(var k = 0; k<arr.length; k++){
                if(name == (arr[k].modelName +' ' +arr[k].partName +' '+arr[k].upcCode )){
                    tempArr.push(arr[k]);
                }
            }
            resultObj[name] = tempArr;
        }
        return resultObj;
    },
   
}