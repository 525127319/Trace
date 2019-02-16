<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                 <span class="icon icon-left"></span>
            </span>
            <h1>产品履历</h1>
        </nav>
        <section class="section">
            <header class="header">
                <div class="search">
                    <!-- <input type="text" placeholder="请输入产品序列号或FATP标签" v-model.trim="content">
                    <span class="icon icon-search-right" @click="search"></span> -->

                     <form style="width:100%" action="javascript:void(0);">
                       <div class="y_sm">
                          <input style="width:60%; " type="search" ref='search' placeholder="请输入产品序列号或FATP标签" v-model.trim="content" @keyup="search()" /> 
                          <i @click="scan"></i>
                       </div>
                      </form>
                </div>
            </header>
            <section class="main"  @click="blurEvent()"  @touchmove="blurEvent()">
                <div class="content-box">
                    <div class="pro-header" v-if="JSON.stringify(productCurrentInfoVo) !='{}'">
                        <p>
                            <span>工单号：{{content}}<span v-text="productCurrentInfoVo.workOrder"></span></span>
                            <!-- <span>工单类别：<span v-text="productCurrentInfoVo.woType"></span></span> -->
                             <span class="mod" >模具号：<span v-text="productCurrentInfoVo.checkSample"></span></span>
                        </p>
                        <p>
                            <span>
                                机种信息：<span v-text="productCurrentInfoVo.modelName"></span> 
                            </span>
                            <span>
                                途程： <span v-text="productCurrentInfoVo.routeName"></span>
                            </span>
                        </p>
                        <!-- <p v-text="'产品序列号：'+ `${productCurrentInfoVo.serialNumber==undefined?'':productCurrentInfoVo.serialNumber}`">  </p> -->
                        <p >
                          <span v-text="'FATP标签：'+`${productCurrentInfoVo.customerSn==undefined?'':productCurrentInfoVo.customerSn}`"></span>  
                          <span>料号：<span v-text="productCurrentInfoVo.partNo"></span></span>
                        </p>

                        <!-- <p>
                            <span>产品序列号：<span v-text="productCurrentInfoVo.serialNumber"></span></span>
                            <span>FATP标签：<span v-text="productCurrentInfoVo.customerSn"></span></span>
                        </p> -->
                        <P>
                            <!-- <span>料号：<span v-text="productCurrentInfoVo.partNo"></span></span> -->
                             <span>箱号：<span v-text="productCurrentInfoVo.cartonNo"></span></span>
                            <span :class="{status:productCurrentInfoVo.workFlag!='1'&&productCurrentInfoVo.currentStatus=='不良',bad:productCurrentInfoVo.workFlag=='1',good:productCurrentInfoVo.workFlag!='1'&&productCurrentInfoVo.currentStatus=='正常'}" v-text="productCurrentInfoVo.workFlag!='1'?productCurrentInfoVo.currentStatus:'报废'"></span>
                            <!-- <span class="bad" v-text="productCurrentInfoVo.currentStatus" v-show="productCurrentInfoVo.currentStatus == '报废'"></span> -->
                        </P>
                        <!-- <p>
                            <span class="mod">模具号：<span v-text="productCurrentInfoVo.checkSample"></span></span>
                            <span>箱号：<span v-text="productCurrentInfoVo.cartonNo"></span></span>
                        </p> -->
                        <p v-text="'原料二维码：'+`${productCurrentInfoVo.jancode==undefined?'':productCurrentInfoVo.jancode}`">
                            <!-- 原料二维码：<span v-text="'123'+productCurrentInfoVo.jancode"></span> -->
                        </p>
                    </div>
                    <div class="prio-list-con">                    
                        <ul class="prio-list">
                            <li v-for="(item,index) in productTravelVoList" :key="index">
                                <p>
                                    <!-- <span>
                                        <span>
                                            机种：<span v-text="item.modelName"></span>
                                        </span> 线别：<span v-text="item.pdlineName"></span>
                                    </span> -->
                                      <span v-text='"站点名称："+ item.terminalName '> </span>                                      
                                    <span v-text="item.empName">
                                    </span>
                                </p>
                                <!-- <p v-text="'制程名称：'+`${item.processName ==null?'':item.processName}`"></p>  -->
                                <!-- <p v-text="'FATP:'+`${item.customerId==null?'':item.customerId}`"></p> -->
                                <!-- <p>
                                    <span>制程名称：<span v-text="item.processName"></span></span>
                                    <span>FATP: <span v-text="item.customerId"></span></span>
                                </p> -->
                                <P>
                                    <!-- <span>站点名称：<span v-text="item.terminalName"></span></span> -->
                                    <span  v-text="'FATP:'+`${item.customerId==null?'':item.customerId}`"></span>
                                    <span :class="{status:item.workFlag!='1'&&item.currentStatus=='不良', bad:item.workFlag=='1',good:item.workFlag!='1'&&item.currentStatus=='正常'}" v-text="item.workFlag!='1'?item.currentStatus:'报废'"></span>
                                </P>
                                <p>
                                    <span class="gry" v-text="item.outProcessTime"></span>
                                    <span>箱号: <span v-text="item.cartonNo"></span></span>
                                </p>
                                <span class="number" v-text="index + 1">1</span>
                            </li>    
                        </ul>
                            <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>                   
                   </div>
                </div>
            </section>
        </section>
            <popup :errorMsg="errorMsg" ></popup>
            <waiting v-show="isWaiting" :number="number"></waiting>
    
     
    </article>
          <div class="pop" v-show="productRecordPrompt">
        <!-- 我知道 -->
        <div class="ok"  @click="handlePrompt"></div>
        <!-- 产品履历 -->
        <div class="record"></div>
      </div>
  </div>
</template>
<script>
import moment from "moment";
import popup from "../base/popup .vue";
import Loading from "../base/loading.vue";
import waiting from "../base/waiting.vue";
import pullingWord from "../base/pulling-word.vue";
import IM from "../../common/WebViewJavascriptBridge.js";
export default {
  data() {
    return {
      productRecordPrompt:true,
      // content: "DYH0100007358526", // 搜索内容单独有上面对象的参数
      content: "", // 搜索内容有完整数据
      productCurrentInfoVo: {}, // 产品履历信息对象
      productTravelVoList: [], // 产品履历列表数据
      showPopup: false, // 显示弹窗
      errorMsg: "", //错误信息
       loadingWord: "", // 提示文字
      isWaiting: false,
      showWord: false, // 显示文字提示
      number: 0,
      showH5Title: true // 是否显示H5的头部，默认显示
    };
  },
  created() {
     if(window.navigator.userAgent.indexOf('IOS')>-1||window.navigator.userAgent.slice(11)==='ANDROID-IAAPPCONTAINER'||window.navigator.userAgent.slice(11)==='PAD-IAAPPCONTAINER'){
          this.showH5Title = false;
        }

        const self = this;
        // 设置返回功能
       this.IM.goBack({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "1", //0：文字     1：图标   （必传）
        text: "返回", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        onSuccess: function(result) {
           self.back();
        },
      
      });
       // 设置关闭功能
      this.IM.close({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "1", //0：文字     1：图标   （必传）
        text: "关闭", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ef0655", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#efeeeb", //背景色
        onSuccess: function(result) {
          
        },
      });
      //  设置标题
       this.IM.setTitle({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "0", //0：文字     1：图标   （必传）
        text: "产品履历", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      
      });
      // 设置右侧按钮
      this.IM.setRight({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "0", //0：文字     1：图标   （必传）
        text: "", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ffffff", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });

    
    console.log(JSON.stringify(this.productCurrentInfoVo) == "{}", 2233);
    this.content = sessionStorage.getItem("content") || "";
    if(localStorage.getItem('productRecordPrompt') =='false'){
       this.productRecordPrompt=false;
    }
    
  },

  methods: {
    // 扫一扫，扫描二维码，调用摄像头
    scan() {
       const self = this;
       IM.scan_dataM({onSuccess : function(result){
                self.content =JSON.parse(result).qrCode;
                self.search();
          }});
     },
     handlePrompt(){
        this.productRecordPrompt=false;
        localStorage.setItem('productRecordPrompt',this.productRecordPrompt);
      },
    // 返回上一页
    back() {
      this.$router.go(-1);
      this.productRecordPrompt=false;
      localStorage.setItem('productRecordPrompt',this.productRecordPrompt);
      
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    
     blurEvent(){
     this.$refs.search.blur();
    },
    // 点击搜索
    // goSearch() {
    //   if (!this.content) {
    //     return;
    //   }
   
    //   this.inSearching = true;
    //   this.productTravelVoList = [];
    //   this.productCurrentInfoVo = {};
    //   this.pageNum = 1;
    //   this.fetchData(res => {

    //     console.log(res, 56768);
    //     this.productTravelVoList = res.productTravelVoList;
    //     this.productCurrentInfoVo = res.productCurrentInfoVo; // 产品履历信息对象
    //     if(JSON.stringigy(this.productCurrentInfoVo)=='{}'&&this.productTravelVoList.length==0)){
    //       this.errorMsg = '没有数据'
    //     }
    //      console.log(JSON.stringify(this.productCurrentInfoVo)=='{}',3344)
    //     if(this.productCurrentInfoVo == null){
    //       this.productCurrentInfoVo = {}
    //     }
    //     console.log( this.productTravelVoList,909090)
    //     console.log( this.productCurrentInfoVo,955555)
    //     this.productTravelVoList.forEach(val => {
    //       val.outProcessTime = moment(val.outProcessTime).format(
    //         "YYYY-MM-DD HH:mm:ss"
    //       );
    //     });
    //     console.log(this.receipteRecordList, "____+");
    //   });
    // },
    // pullUpHandle(val) {
    //   this.fetchData(res => {
    //     // this.scrollElement.PullingUpWord = "加载完成";
    //     setTimeout(() => {
    //       this.scrollElement.finish("PullUp");
    //       this.productTravelVoList = this.productTravelVoList.concat(
    //         res.productTravelVoList
    //       );
    //       this.productTravelVoList.forEach(val => {
    //         val.outProcessTime = moment(val.outProcessTime).format(
    //           "YYYY-MM-DD HH:mm:ss"
    //         );
    //       });
    //       console.log(this.receipteRecordList, "____++");
    //     }, 1000);
    //   });
    // },
    // fetchData(callback) {
    //   var data = {
    //     serialNumber: this.content, //'产品序列号或者FATP标签查询'
    //     pageNum: this.pageNum
    //   };
    //   console.log(data, "+++");
    //   this.$axiosHttp
    //     .axiosPost("ks-trace/traceReport/queryProductTravelVo.api", data)
    //     .then(res => {
    //       console.log(res, "123");
    //       // res = res.data;
    //       if (res.code == 200) {
    //         res = res.data;
    //         if (res.productTravelVoList.length >= 0) {
    //           callback && callback(res);
    //         } else {
    //           setTimeout(() => {
    //             this.scrollElement.finishPullUp();
    //             this.scrollElement.beforePullUpWord = "暂无更多数据";
    //           }, 100);
    //         }
    //         this.inSearching = false;
    //         this.pageNum++;
    //       } else if (res.code == 500) {
    //         this.inSearching = false;

    //         this.errorMsg = "网络速度太慢，加载不出来";
    //       } else if (res.code == 10005 || res.code == 10002) {
    //         this.errorMsg = "您的身份校验已过期，请重新登录";
    //       } else {
    //         this.inSearching = false;

    //         this.errorMsg = res.msg;
    //       }
    //     })
    //     .catch(() => {
    //       this.inSearching = false;
    //       this.errorMsg = "数据较大，请稍后重试";
    //     });
    // }

    //  获取产品履历查询数据
    search() {
      //  clearInterval(timer);
      if (this.content === "") {
        // this.errorMsg = "搜索内容不能为空";
        return;
      }
      sessionStorage.setItem("content", this.content);
      // this.number = 0;
      // this.isWaiting = true;
      // var timer = setInterval(() => {
      //   this.number = this.number + 1;
      // }, 1000);
      var data = {
        serialNumber: this.content //'产品序列号或者FATP标签查询'
      };
      console.log(data, "+++");
      console.log(this.errorMsg, "^^^");

      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryProductTravelVo.api", data)
        .then(res => {
          console.log(res, 123);
          // clearInterval(timer);
          //  this.number = 0;
          // this.isWaiting = false;
          if (res.code == 200) {
            this.productTravelVoList = res.data.productTravelVoList;
            this.productCurrentInfoVo = res.data.productCurrentInfoVo; // 产品履历信息对象
            if (
              this.productCurrentInfoVo == null &&
              this.productTravelVoList.length == 0
            ) {
              this.showWord = true
              this.loadingWord = '没有更多数据'
            }
            console.log(
              JSON.stringify(this.productCurrentInfoVo) == "{}",
              3344
            );
            if (this.productCurrentInfoVo == null) {
              this.productCurrentInfoVo = {};
            }
            this.productTravelVoList.forEach(val => {
              val.outProcessTime = moment(val.outProcessTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            console.log(this.productionList, "AAA");
          } else if (res.code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
            this.errorMsgMsg = "数据较大，请稍后重试";
          } else {
            this.errorMsg = res.msg;
          }
        });
    },
    close() {
      this.showPopup = false;
    }
  },
  components: {
    Loading,
    popup,
    waiting,
    pullingWord
  }
};
</script>
<style scoped>
.wrapper {
  position: absolute;
  top: 166px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.prio-list {
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.tips {
  position: absolute;
  bottom: 1rem;
  text-align: center;
  z-index: 100;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1000;
}
.failed {
  position: absolute;
  left: 50%;
  top: 182px;
  width: 18rem;
  height: 11.8rem;
  transform: translate3d(-50%, 0, 0);
  /* border: 1px solid #fff; */
  box-shadow: 0 0 5px #fff;
  border-radius: 4px;
  background: #ffffff;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success {
  position: absolute;
  left: 50%;
  top: 182px;
  width: 18rem;
  height: 11.8rem;
  transform: translate3d(-50%, 0, 0);
  /* border: 1px solid #fff; */
  box-shadow: 0 0 5px #fff;
  border-radius: 4px;
  background: #ffffff;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.failed .warn {
  width: 34px;
  height: 34px;
  margin-top: 29px;
  background: url("../../assets/images/warn.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.success .congratulations {
  width: 34px;
  height: 34px;
  margin-top: 29px;
  background: url("../../assets/images/right.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.failed .text,
.success .text {
  /* width: 34px; */
  font-size: 18px;
  margin-top: 2rem;
}
.failed .check {
  width: 96px;
  height: 26px;
  font-size: 13px;
  line-height: 26px;
  color: #2196f3;
  opacity: 0.87;
  border: 1px solid rgb(81, 166, 245);
  text-align: center;
  margin-top: 20px;
}
.success .check {
  width: 86px;
  height: 26px;
  font-size: 13px;
  line-height: 26px;
  color: rgb(153, 153, 153);
  opacity: 0.87;
  border: 1px solid rgba(153, 153, 153, 0.3);
  text-align: center;
  margin-top: 20px;
}

.pro-header {
  position: relative;
  min-height: 132px;
}
.pro-header + .prio-list-con {
  top: 148px;
}
.prio-list-con {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.bad{
  color: #f65151;
}
.status{
  color:#ff7e00;
}
.good{
  color:rgb(127,229,189);
}
.loadingWord{
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
