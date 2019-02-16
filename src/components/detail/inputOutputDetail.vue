<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <!-- 分页下拉 -->
            <h1>投入产出</h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <div class="in-out-total" v-show="inputOutputData.length>0">
                      <span >数据总数</span>
                      <span class="name" v-text="total" v-show="total"> </span>
                      <span class="loading-icon" style="width:28px;height:28px;" v-show="!total">
                      <svg class="lds-spinner" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.875s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(45 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(90 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.625s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(135 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(180 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.375s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(225 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(270 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.125s" repeatCount="indefinite"></animate>
                        </rect>
                      </g><g transform="rotate(315 50 50)">
                        <rect x="46" y="8" rx="29.44" ry="5.12" width="8" height="28" fill="#ffffff">
                          <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                        </rect>
                      </g></svg>
                      </span>
                    </div>
                    <!-- <scroll class="wrapper"
                             ref="scroll"
                            :dataList="inputOutputData"
                            :pullUpLoad="pullUpLoad"
                            @onPullUp="pullUpHandle"
                              > -->
                    <ul class="in-out-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                        <li v-for="(item,index) in inputOutputData" :key="index">
                            <div class="pro-num">
                                <p class="number"><span class="na">产品序列号：</span><span v-text="item.serialNumber"></span></p>
                                <span class="status" v-if="item.frozenStatus==null">非冻结</span>
                                <span class="status" v-if="item.frozenStatus!=null" v-text="item.frozenStatus"></span>
                            </div>
                            <div class="packge">
                                <p class="time"><span class="na">包装时间</span>：<span v-text="item.outProcessTime"></span></p>
                                <p class="status">当前状态：<span :class="{oks:item.currStatus=='NG',goodStatus:item.currStatus=='OK'}" v-text="item.currStatus"></span></p>
                            </div>
                            <div class="packge">
                                <p class="time"><span class="na">出货时间：</span><span v-text="item.shipmentTime"></span></p>
                                <p class="status"><span class="na">制程状态：</span><span :class="{oks:item.processStatus=='NG',goodStatus:item.processStatus=='OK'}" v-text="item.processStatus"></span></p>
                            </div>
                            <div class="pac-num">
                                <p><span class="na">箱号：</span><span v-text="item.cartonNo"></span></p>
                                <p><span class="na">一维条码：</span><span v-text="item.oneBarCode"></span></p>
                            </div>
                            <span class="list-number" v-text="index + 1"></span>
                        </li>
                        <Loading class="loading" v-show="showLoading" ></Loading>
                         <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>
                    </ul>
                     <!-- </scroll> -->
                </div>
            </section>
        </section>
        <popup :errorMsg="errorMsg" ></popup>
        <waiting v-show="isWaiting" :number="number"></waiting>
        <asyncPop v-show="showDrag" ></asyncPop>
    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import moment from "moment";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import Loading from "../base/loading.vue";
import pullingWord from "../base/pulling-word.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      inputOutputData: [], // 明细数据
      scrollY: 0,
      pullUpLoad: {
        threshold: -50
      },
      pageNum: 1, // 初始页面
      errorMsg: "", //错误信息
      showLoading: false, // 显示加载动画
      showWord: false, // 显示文字提示
      loadingWord: "", // 提示文字
      busy: false,
      isWaiting: true,
      total: 0, // 数据总量
      number: 0,
      flag: true, // 用来判断请求的与否
      showDrag: false, // 是否弹窗提示异步加载任务
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
        text: "投入产出", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });
      // 设置右侧按钮
      this.IM.setRight({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "0", //0：文字     1：图标   （必传）
        text: "", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });
    // this.pullUpHandle();
   

          // this.showDrag = true;

   if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){  
     this.isWaiting = false; // 异步过来的已经有数据了，不需要动画
      // 如果有缓存异步数据
    let asyncData =JSON.parse(sessionStorage.getItem("asyncResult"));
    asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
    asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
    console.log(asyncData,'缓存数据的获取')
    console.log(asyncData.traceContext ,'context')
    console.log(typeof asyncData)
      //原传递给服务端的参数
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
      this.$route.query.partId = asyncData.traceContext.partId;
      this.$route.query.terminalId = asyncData.traceContext.terminalId;
      this.$route.query.processId = asyncData.traceContext.processId;
      this.$route.query.defectCode = asyncData.traceContext.defectCode;
      this.pageNum = asyncData.traceContext.pageNum;
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.woType = asyncData.traceContext.woType;
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.startTimeZore = asyncData.traceContext.startTimeZore;
      this.$route.query.endTimeZore = asyncData.traceContext.endTimeZore;

       //将制程数据渲染到界面

       this.inputOutputData = asyncData.traceResult.data; 
        this.pageNum++;
        this.loadMore();
         console.log(typeof asyncData.traceResult , '看看格式')
         
      //控制是否显示“选择制程”面板
    }else{
    }
  },
mounted(){
    this.getTotal(); 
  
},
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
     cancelAsync(){
      this.showDrag = false;
    },
    // 获取数据总量
    getTotal() {
      const info = {
        partId: this.$route.query.partId,
        processId: this.$route.query.processId,
        processName: this.$route.query.processName,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTimeZore,
        endTime: this.$route.query.endTimeZore,
        woType: this.$route.query.woType

        //  'partId':'1000004968',
        // 'processId':'100774',
        // 'terminalId':'52204656',
        // 'startTime':'2013-08-02 00:10:00',
        // 'endTime':'2013-08-02 23:59:00',
        //  'woType': 'RAMP',
      };
      this.$axiosHttp
        // .axiosPost("ks-trace/traceReport/queryInputOutputDetailCount.api", info)
        .axiosPost("ks-rinse/reality/queryInputOutputDetailCount.api", info)
        .then(res => {
          console.log(res, "|||||||");
          if (res.code == 200) {
            this.total = res.data.linSum;
          }
        });
    },

                ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"inputOutputDetail",
          "traceParams" : {
                    partId: this.$route.query.partId,
                    processId: this.$route.query.processId,
                    processName: this.$route.query.processName,
                    terminalId: this.$route.query.terminalId,
                    startTime: this.$route.query.startTimeZore,
                    endTime: this.$route.query.endTimeZore,
                    woType: this.$route.query.woType,
                    pageNum: 1
                },
          "traceApi":"http://ks-rinse/reality/queryInputOutputDetail.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "投入产出查询",
                  partId: this.$route.query.partId,  // 请求参数
                  processId: this.$route.query.processId,
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  processName: this.$route.query.processName,
                  terminalId: this.$route.query.terminalId,
                  defectCode: this.$route.query.defectCode,
                  startTimeZore: this.$route.query.startTimeZore,
                  endTimeZore: this.$route.query.endTimeZore,
                  woType: this.$route.query.woType,
                  pageNum: 1
          }

          
      }
       this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/sendAsynTask.api", info)
        .then(res => {
              console.log('异步请求查询res',res)
              if(res.code == 200){
                  this.unreadData(); // 当天未读数量获取
              }
        })
  },
  // 当天未读数量请求
  unreadData(){
     this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/querySaDayCount.api")
        .then(res => {
            console.log('当天未读数量：res',res)
            let {code, msg, data} = res;
            switch (code){
              case 200:
                  this.$store.commit('SET_COUNT',data)
                   this.cancelAsync(); // 取消弹窗
              break;
            }
        })
  },


    loadMore() {
      this.busy = true;
     var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        partId: this.$route.query.partId,
        processId: this.$route.query.processId,
        processName: this.$route.query.processName,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTimeZore,
        endTime: this.$route.query.endTimeZore,
        woType: this.$route.query.woType,
        pageNum: this.pageNum

        //   'partId':'1000004968',
        //   'processId':'100774',
        //   'terminalId':'52204656',
        //   'startTime':'2013-08-02 00:10:00',
        //   'endTime':'2013-08-02 23:59:00',
        //   'woType': this.$route.query.woType

        // partId: "1000004968",
        // processId: "100774",
        // terminalId: "52204656",
        // startTime: "2013-08-02 00:10:00",
        // endTime: "2013-08-02 23:59:00",
        // woType: "RAMP"
      };
      this.$axiosHttp
        .axiosPost("ks-rinse/reality/queryInputOutputDetail.api", data)
        .then(res => {
           clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          console.log(res, "123");
          console.log(res.data.length, "长度是否为0");
          if (res.data.length === 0) {
             this.showLoading = false;
            this.showWord = true;
            this.loadingWord = "没有更多数据";
          }
          if (res.code == 200 && res.data.length != 0) {
            this.inputOutputData = this.inputOutputData.concat(res.data);
            this.showLoading = true;
            this.busy = false;
            this.pageNum++;
            if (res.data.length < 20) {
              this.showLoading = false;
            }
          } else if (res.code == 500) {
            this.errorMsgMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
              this.showDrag = true;
          } 
          else {
            this.errorMsgMsg = res.msg;
          }
        })
        .catch(() => {
          this.showDrag = true;
        });
      console.log(this.modelList, 5656);
      console.log(this.pageNum, 777777);
    },

    // loadMore1() {
    //   this.busy = true;
    //   var timer = setInterval(() => {
    //     this.number = this.number + 1;
    //   }, 1000);
    //   var data = {
    //     partId: this.$route.query.partId,
    //     processId: this.$route.query.processId,
    //     processName: this.$route.query.processName,
    //     terminalId: this.$route.query.terminalId,
    //     startTime: this.$route.query.startTimeZore,
    //     endTime: this.$route.query.endTimeZore,
    //     woType: this.$route.query.woType,
    //     pageNum: this.pageNum

    //     //   'partId':'1000004968',
    //     //   'processId':'100774',
    //     //   'terminalId':'52204656',
    //     //   'startTime':'2013-08-02 00:10:00',
    //     //   'endTime':'2013-08-02 23:59:00',
    //     //   'woType': this.$route.query.woType

    //     // partId: "1000004968",
    //     // processId: "100774",
    //     // terminalId: "52204656",
    //     // startTime: "2013-08-02 00:10:00",
    //     // endTime: "2013-08-02 23:59:00",
    //     // woType: "RAMP"
    //   };

    //   this.$axiosHttp
    //     // .axiosPost("ks-trace/traceReport/queryInputOutputDetail.api", data)
    //     .axiosPost("ks-rinse/reality/queryInputOutputDetail.api", data)
    //     .then(res => {
    //       clearInterval(timer);
    //       this.number = 0;
    //       this.isWaiting = false;
    //       console.log(res, 123);
    //       if (res.code == 200) {
    //         if (res.data.length == 0 && this.pageNum == 1) {
    //           this.errorMsg = "没有数据";
    //         }
    //         if (res.data.length > 0) {
    //           setTimeout(() => {
    //             this.inputOutputData = this.inputOutputData.concat(res.data);
    //             this.inputOutputData.forEach(element => {
    //               //   console.log(element,'---')
    //               element.outProcessTime = moment(
    //                 element.outProcessTime
    //               ).format("YYYY-MM-DD HH:mm:ss"); // 格式化包装时间
    //               element.shipmentTime = moment(element.shipmentTime).format(
    //                 "YYYY-MM-DD HH:mm:ss"
    //               ); // 格式化出货时间
    //             });
    //             console.log(this.inputOutputData, "AAA");
    //           }, 300);
    //         } else {
    //         }
    //       } else if (res.code == 500) {
    //         this.errorMsg = "网络速度太慢，加载不出来";
    //       } else if (res.code == 10005 || res.code == 10002) {
    //         this.errorMsg = "您的身份校验已过期，请重新登录";
    //       } else if (res.code == -404) {
    //         this.errorMsg = "数据较大，请稍后重试";
    //       } else {
    //         this.errorMsg = res.msg;
    //       }
    //       this.flag = true;
    //     });

    //   this.pageNum++;
    // }
  },
  components: {
    scroll,
    waiting,
    Loading,
    popup,
    pullingWord,
    asyncPop
  }
};
</script>
<style scoped>
.wrapper {
  position: absolute;
  top: 52px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.in-out-list {
  position: absolute;
  width: 100%;
   top: 52px;
  overflow: hidden;
  z-index: 999;
}
.in-out-list li {
  overflow: hidden;
}
.in-out-list li .list-number {
  position: absolute;
  left: -1.25rem;
  top: 0.25rem;
  width: 4rem;
  height: 1rem;
  line-height: 1rem;
  background-color: #e1e1e1;
  text-align: center;
  font-size: 10px;
  transform: rotate(-45deg);
  color: rgba(0, 0, 0, 0.53);
}
.in-out-total {
  position: relative;
  margin: 0.5rem 0;
  padding: 0 1rem 0 1.5rem;
  height: 36px;
  min-height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0cb2ff;
  color: #fff;
}
.goodStatus{
  color:rgb(127,229,189)
}
.ok{
  color: #ff7e00;
}
</style>