<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1 v-text="this.$route.query.defectCode"></h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                     <!-- <scroll class="wrapper"
                            ref="scroll"
                            :dataList="badInformationDetail"
                            :pullUpLoad="pullUpLoad"
                            @onPullUp="pullUpHandle"
                           > -->
                    <ul class="bad-detial" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                        <li v-for="(item,index) in badInformationDetail" :key="index">
                            <p class="tit">
                                <span class="name" v-text="item.serialNumber"></span>
                                <span class="status " :class="{red:isRed,yellow:isYellow}" v-text="item.status"></span>
                            </p>
                            <p class="cn" v-text="item.chineseDefectDesc"></p>
                            <p>
                                <span v-text="item.englishDefectDesc"></span>
                                <span v-text="item.empName"></span>
                            </p>
                            <p class="gr">
                                <span v-text="item.processName"></span>
                                <span v-text="item.responsibilityUnit"></span>
                            </p>
                            <p class="gr">
                                <span v-text="item.terminalName"></span>
                                <span v-text="item.recTime"></span>
                            </p>
                        </li>
                         <Loading class="loading" v-show="showLoading" ></Loading>
                         <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>
                    </ul>
                    <!-- </scroll> -->
                </div>
            </section>
        </section>
         <popup :errorMsg="errorMsg"></popup>
         <waiting v-show="isWaiting" :number="number"></waiting>
         <asyncPop v-show="showDrag" ></asyncPop>
    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import Loading from "../base/loading.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import pullingWord from "../base/pulling-word.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      badInformationDetail: [], // 不良统计信息数据
      scrollY: 0,
      pullUpLoad: {
        threshold: -20
      },
      pageNum: 1, // 初始页面
      errorMsg: "", //错误信息
      isRed: false, // 报废的样式显示
      isYellow: false, // 不良的样式显示
      showLoading: false, // 显示加载动画
      showWord: false, // 显示文字提示
      loadingWord: "", // 提示文字
       busy: false,
      isWaiting: true,
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
        text: "不良信息", //控制显示文本，空字符串表示显示默认文本
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

    // this.pullUpHandle(); // 获取不良统计信息详情数据
  
        //  this.showDrag = true;

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
      
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;

       //将制程数据渲染到界面
       this.badInformationDetail = asyncData.traceResult.data; 
        this.pageNum++;
        this.loadMore()
         console.log(typeof asyncData.traceResult , '看看格式')
      //控制是否显示“选择制程”面板
    }else{
      this.loadMore()
    }
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

             ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"badInformationDetail",
          "traceParams" : {
                  partId: this.$route.query.partId,
                  processId: this.$route.query.processId,
                  terminalId: this.$route.query.terminalId,
                  startTime: this.$route.query.startTime,
                  endTime: this.$route.query.endTime,
                  defectCode: this.$route.query.defectCode,
                  pageNum: 1
                },
          "traceApi":"http://ks-trace/traceReport/queryDefectInfoDetail.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "不良信息查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  processName: this.$route.query.processName,
                  terminalId: this.$route.query.terminalId,
                  defectCode: this.$route.query.defectCode,
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
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        defectCode: this.$route.query.defectCode,
        pageNum: this.pageNum
      };
      this.$axiosHttp
          .axiosPost("ks-trace/traceReport/queryDefectInfoDetail.api", data)
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
            this.badInformationDetail = this.badInformationDetail.concat(res.data);
            this.showLoading = true;
            this.busy = false;
             this.badInformationDetail.forEach(val => {
                if (val.status == "报废") {
                  this.isRed = true;
                } else if (val.status == "不良") {
                  this.isYellow = true;
                }
              });
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
          } else {
            this.errorMsgMsg = res.msg;
          }
        })
        .catch(() => {
          this.errorMsg = "数据较大，请稍后重试";
        });
      console.log(this.modelList, 5656);
      console.log(this.pageNum, 777777);
    },




    // 获取不良统计信息详情数据
    // pullUpHandle() {
    //   var timer = setInterval(() => {
    //     this.number = this.number + 1;
    //   }, 1000);
    //   var data = {
    //     partId: this.$route.query.partId,
    //     processId: this.$route.query.processId,
    //     terminalId: this.$route.query.terminalId,
    //     startTime: this.$route.query.startTimeZore,
    //     endTime: this.$route.query.endTimeZore,
    //     // defectCode: this.$route.query.defectCode,
    //     //  pageNum: this.pageNum

    //     // partId: "1000005030",
    //     // processId: "105153",
    //     // terminalId: "60011604",
    //     // startTime: "2017-11-29 00:00:00",
    //     // endTime: "2017-11-29 23:59:00",
    //     defectCode: this.$route.query.defectCode,
    //     pageNum: this.pageNum
    //   };
    //   console.log(data, "+++");
    //   if (this.flag) {
    //     this.flag = false;
    //     this.$axiosHttp
    //       .axiosPost("ks-trace/traceReport/queryDefectInfoDetail.api", data)
    //       .then(res => {
    //         console.log(res, 123);
    //         clearInterval(timer);
    //         this.number = 0;
    //         this.isWaiting = false;
    //         if (res.code == 200) {
    //           if (res.data.length == 0 && this.pageNum == 1) {
    //             this.errorMsg = "没有数据";
    //           }
    //           if (res.data.length > 0) {
    //             setTimeout(() => {
    //               this.scrollElement.finishPullUp();
    //               this.badInformationDetail = this.badInformationDetail.concat(
    //                 res.data
    //               );
    //               this.badInformationDetail.forEach(val => {
    //                 if (val.status == "报废") {
    //                   this.isRed = true;
    //                 } else if (val.status == "不良") {
    //                   this.isYellow = true;
    //                 }
    //               });
    //               console.log(this.badInformationDetail, "AAA");
    //             }, 500);
    //           } else {
    //             setTimeout(() => {
    //               this.scrollElement.finishPullUp();
    //               this.scrollElement.beforePullUpWord = "暂无更多数据";
    //             }, 100);
    //           }
    //         } else if (res.code == 500) {
    //           this.errorMsg = "网络速度太慢，加载不出来";
    //         } else if (res.code == 10005 || res.code == 10002) {
    //           this.errorMsg = "您的身份校验已过期，请重新登录";
    //         } else if (res.code == -404) {
    //           this.errorMsg = "数据较大，请稍后重试";
    //         } else if (res.code == -404) {
    //           this.errorMsg = "数据较大，请稍后重试";
    //         } else {
    //           this.errorMsg = res.msg;
    //         }
    //         this.flag = true;
    //       });
    //   }
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
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.bad-detial {
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
.none {
  color: red;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
}
</style>


