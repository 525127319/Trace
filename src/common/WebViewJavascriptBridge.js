/**
 * 函数描述:js调用webview事件
 *
 * jsBridge.callHandler(method, data, callBack(response));
 * @param method {string} 方法名
 * @param data {Object} 参数
 * @return {Object} 回调
 */

/**
 * 函数描述:webView调用JS事件
 *
 * jsBridge.registerHandler(method, callBack(response));
 * @param method {string} 方法名
 * @return {Object} 回调
 */

let init = function(callback) {
  // ----------------- IOS 可正常调用代码 end
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (!isiOS) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge);
    } else {
      document.addEventListener(
        "WebViewJavascriptBridgeReady",
        function() {
          callback(WebViewJavascriptBridge);
        },
        false
      );
    }
  } else {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    let WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "https://__BRIDGE_LOADED__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }
};

let registerHandler = function(name, fun) {
  let _this = this;
  init(function(bridge) {
    bridge.registerHandler(name, fun);
  });
};
let callHandler = function(name, data, fun) {
  let _this = this;
  init(function(bridge) {
    bridge.callHandler(name, data, fun);
  });
};

let ImCallHandlerApi = function(MethodName) {
  // 桥接的方法名
  let _name = MethodName;

  let Application = function(data) {
    return new Application.fn.init(_name, data);
  };

  Application.fn = Application.prototype = {
    constructor: Application,
    init: function(name, data) {
      const _this = this;
      callHandler(name, data,function(response){
        try {
          _this.onSuccess = data.onSuccess;
           _this.onSuccess(response);
        } catch (error) {
          //失败的回调
          _this.onFail = data.onFail;
           _this.onFail(response);
        }
      })


      registerHandler(name+'_onSuccess',function(response){
        try {
          _this.onSuccess = data.onSuccess;
          return _this.onSuccess(response);
        } catch (error) {
          //失败的回调
          _this.onFail = data.onFail;
          return _this.onFail(response);
        }
  });

    }
  };
  Application.fn.init.prototype = Application.fn;
  return Application;
};

// =====================================================================================================================
// 桥接的方法名     方法名 = ImCallHandlerApi("方法名");
// ****导航条****

// 左一  设置
let setLeft = ImCallHandlerApi("setLeft");
/**
 * {
 * isclickble: "0" //0 默认不受控    1受控  （必传）
 * type:''       //0:文字     1:图标   （必传）
 *  text: '',   //控制显示文本，空字符串表示显示默认文本
 * textColor:'',  //字体颜色  16进制，关键字
 *  url : '图标',   //控制标题文本，空字符串表示显示默认文本
 *  backcoler:''  //背景色
 * onSuccess : function(result) {},
 * onFail : function(err) {}
 * }
 */

// 左二  返回
let goBack = ImCallHandlerApi("goBack");
/**
 *{
 *isclickble: "0"     //0 默认不受控    1受控   （必传）
 * type:''       //0:文字     1:图标   （必传）
 * text: '',   //控制显示文本，空字符串表示显示默认文本
 * textColor:'', //字体颜色  16进制，关键字
 * url : '图标', //控制标题文本，空字符串表示显示默认文本
 * backcoler:''  //背景色
 * onSuccess : function(result) {}
 * onFail : function(err) {}
 *}
 */

// 左二  关闭
let close = ImCallHandlerApi("close");
/**
 *{
 * isclickble: "0"     //0 默认不受控    1受控   （必传）
 * type:''       //0:文字     1:图标   （必传）
 * text: '',   //控制显示文本，空字符串表示显示默认文本
 * textColor:'', //字体颜色  16进制，关键字
 * url : '图标', //控制标题文本，空字符串表示显示默认文本
 * backcoler:''  //背景色
 * onSuccess : function(result) {},
 * onFail : function(err) {}
 *}
 */

// 中间  标题
let setTitle = ImCallHandlerApi("setTitle");

/**
 *  {
 *  isclickble: "0"     //0 默认不受控    1受控   （必传）
 *  type:''       //0:文字     1:图标   （必传）
 *  text: '',   //控制显示文本，空字符串表示显示默认文本
 *  textColor:'', //字体颜色  16进制，关键字
 *  url : '图标', //控制标题文本，空字符串表示显示默认文本
 *  backcoler:''  //背景色
 *  onSuccess : function(result) {},
 *  onFail : function(err) {}
 *  }
 */

// 右一  操作
let setRight = ImCallHandlerApi("setRight");

/**
 * {
 *  isclickble: "0"     //0 默认不受控    1受控   （必传）
 *  type:''       //0:文字     1:图标   （必传）
 *  text: '',   //控制显示文本，空字符串表示显示默认文本
 *  textColor:'', //字体颜色  16进制，关键字
 *  url : '图标', //控制标题文本，空字符串表示显示默认文本
 *  backcoler:''  //背景色
 *  onSuccess : function(result) {},
 *  onFail : function(err) {}
 * }
 */

// 右二  菜单
let setMenu = ImCallHandlerApi("setMenu");
/**
 * {
 * isclickble: "0"     //0 默认不受控    1受控   （必传）
 * type:''       //0:文字     1:图标   （必传）
 * text: '',   //控制显示文本，空字符串表示显示默认文本
 * textColor:'', //字体颜色  16进制，关键字
 * url : '图标', //控制标题文本，空字符串表示显示默认文本
 * backcoler:''  //背景色
 *  items : [ {
 *            type:''       //0:文字     1:图标
 *            title : '邮箱正文',//控制标题文本，空字符串表示显示默认文本
 *            textColor:'', //字体颜色  16进制，关键字
 *            url : '图标',//控制标题文本，空字符串表示显示默认文本
 *            backcoler:''  //背景色
 *        }],  //菜单list
 * onSuccess: function(data) {},
 * onFail: function(err) {}
 */

//=====================================================================================================================
// ****展示图片****
let previewImage = ImCallHandlerApi("previewImage");
/**
 * {
 *  'current': resImg.showPhotograth, // 当前显示图片的http链接
 *  'urlList': imgList, //当前显示图片的list
 *  'RowNnumber': RowNnumber, //该图片在列表的位置
 *  'isDelete': false //是否需要删除功能
 * }
 */

//=====================================================================================================================
// ****调用相机 ****
let callCamera = ImCallHandlerApi("callCamera");
/**
 * {
 * 'system': 'x-project', //图片保存的文件加
 * 'count': 9, // 图片数量，默认不超过9张
 * 'sizeType': 'original', // 可以指定是原图还是压缩图，默认二者都有
 * 'sourceType': ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
 * }
 */
//=====================================================================================================================
// ****网络****

//=====================================================================================================================
// ****定位****
let geolocation = ImCallHandlerApi("geolocation");
/**
 * {
 *  targetAccuracy :200 // Number 期望定位精度半径（单位米）推荐使用200
 *  mapType:1       // Number  默认为1    1:获取高德坐标， 0:获取标准坐标；
 *  useCache:true,  //默认是true，如果需要频繁获取地理位置，请设置false
 *  onSuccess : function(result) {}
 *  onFail : function(err) {}
 * }
 */

//=====================================================================================================================
// ****电话****
let telephone = ImCallHandlerApi("telephone");
/**
 * {
 *  byMaillist:'true'    //Boolean 默认是通过通讯录拨打    false状态  必填phoneNumber
 *  phoneNumber: ‘17098072878’, // 期望拨打的电话号码
 *  onSuccess : function(result) {}
 *  onFail : function(err) {}
 * }
 */

//=====================================================================================================================
// ****蓝牙****

//=====================================================================================================================
// ****二维码****
let scan = ImCallHandlerApi("scan");

let scan_code128 = ImCallHandlerApi("scan_code128");
let scan_dataM = ImCallHandlerApi("scan_dataM");
/**
 *  type: String , // type 为 all、qrCode、barCode，默认是all。
 *  onSuccess: function(result) {
 *  onSuccess将在扫码成功之后回调
 *    result结构
 *    { 'text': String}
 *   },
 *  onFail : function(err) {
 *}
 */
//=====================================================================================================================
// ***弹窗 alert***
let notificationAlert = ImCallHandlerApi("notificationAlert");
/**
 * {
 *   message: "亲爱的",   // String   	消息内容
 *   title: "提示",       // String    弹窗标题   可传空
 *   buttonName: "收到",  // String     按钮名称
 *  onSuccess : function(result) {
 *       //onSuccess将在点击button之后回调
 *   },
 *  onFail : function(err) {}
 *}
 */
// *** 弹窗 confirm***
let notificationConfirm = ImCallHandlerApi("notificationConfirm");
/**
 * {
 *   message: "亲爱的",   // String   	消息内容
 *   title: "提示",       // String    弹窗标题   可传空
 *   buttonLabels: ['爱', '不爱'],//Array[String]    按钮名称
 *  onSuccess : function(result) {
 *      {
 *            buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
 *        }
 *   },
 *  onFail : function(err) {}
 *}
 */

// *** 下载/存储本地***

let domainStorageSetItem = ImCallHandlerApi("domainStorageSetItem");

// *** 上传/本地获取***

let domainStorageGetItem = ImCallHandlerApi("domainStorageGetItem");

// *** 语音录制***
let startRecord = ImCallHandlerApi("startRecord");

// *** 开启蓝牙***
let openBluetooth = ImCallHandlerApi("openBluetooth");

// *** 关闭蓝牙***
let closeBluetooth = ImCallHandlerApi("closeBluetooth");

// *** 获取手机基础信息***
let getPhoneInfo = ImCallHandlerApi("getPhoneInfo");

//*** 判断手机是否有网络 true有网络   false  没有
let getNetworkState = ImCallHandlerApi("getNetworkState");
/**
 * {
 *  onSuccess : function(result) {//成功回调 result = {"isNetConnected":false}    
 *   },
 *  onFail : function(err) {}
 *}
 */

//   注册到方法集合 ImBrige
let ImBrige = {
  getNetworkState,//判断手机是否有网络 true有网络   false  没有
  callHandler,
  registerHandler,
  // =====*导航条*=======
  // 左一  设置
  setLeft,
  // 左二  返回
  goBack,
  // 左二  关闭
  close,
  // 中间  标题
  setTitle,
  // 右一  操作
  setRight,
  // 右二  菜单
  setMenu,

  // ====*展示图片*=====
  previewImage,

  // ===*相机*=====
  callCamera,

  // ======*网络*======
  // =====*定位*=======
  geolocation,

  // =====*电话*========
  telephone,

  // ========*蓝牙*=========

  //======== *二维码*========
  scan,

  scan_code128,

  scan_dataM,



  //======== *弹窗*========
  //  Alert
  notificationAlert,
  // confirm
  notificationConfirm,

  // 下载/存储本地
  domainStorageSetItem,
  // 上传/本地获取
  domainStorageGetItem,

  // 语音录制
  startRecord,
  // 开启蓝牙
  openBluetooth,
  // 关闭蓝牙
  closeBluetooth,
  // 获取手机基础信息
  getPhoneInfo
};
// 抛出方法
export default ImBrige ;
