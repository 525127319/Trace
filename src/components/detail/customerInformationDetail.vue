<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>成品信息</h1>
        </nav>
        <section class="section">

            <section class="main">
                <div class="content-box">
                    <div class="tbale-box ">
                        <table class="table table-del t-h c4">
                            <thead>
                                <tr>
                                    <th>站点</th>
                                    <th>数量</th>
                                    <th>是否出货</th>
                                    <th>机种</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="t-b"> 
                           <!-- <scroll class="wrapper"
                                          ref="scroll"
                                          :dataList="CustomerInformationDetail"
                                          :pullUpLoad="pullUpLoad"
                                          @onPullUp="getCustomerInformationDetail"
                                        > -->
                           <table class="table table-del  c4">
                                    <tbody>
                                        <tr  v-for="(item,index) in CustomerInformationDetail" :key="index">
                                            <td v-text="item.terminalName"></td>
                                            <td v-text="item.totalQty"></td>
                                            <td v-text="item.status"></td>
                                            <td v-text="item.modelName"></td>
                                        </tr>
                                    </tbody>
                                
                                  <!-- <Loading v-show="showLoading" ></Loading> -->
                           
                               <!-- <div v-show="finishShow" class="tips">暂无更多数据</div>  -->
                            </table>
                          <!-- </scroll> -->
                        </div>
                        
                        <!-- <div v-show="showNothing" class="none">没有数据</div> -->
                    </div>
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
import Loading from "../base/loading.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      CustomerInformationDetail: [], // 客户信息导出详情数据
      pullup: true, // 上拉加载
      scrollY: 0,
      pullUpLoad: {
        threshold: -20
      },
      pageNum: 1, // 初始页面
      showLoading: true, // 显示正在加载
      finishShow: false, // 显示没有更多数据
      errorMsg: "", //错误信息
      // showNothing: false, // 没有数据显示
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
        text: "成品信息", //控制显示文本，空字符串表示显示默认文本
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

    this.listenScroll = true;
    this.probeType = 3;
    
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
      
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.processName = asyncData.traceContext.processName;

      //将制程数据渲染到界面
      this.CustomerInformationDetail = asyncData.traceResult.data;  // 缓存的数据
         console.log(typeof asyncData.traceResult , '看看格式')
     
    } else {
       this.getCustomerInformationDetail(); // 获取客户信息导出明细
    }
    
  },
  computed: {
    scrollElement() {
      return this.$refs.scroll;
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
          "tracePath":"customerInformationDetail",
          "traceParams" : {
                  partId: this.$route.query.partId, //'102111(料号ID)',
                  processId: this.$route.query.processId, //'制程id',
                  terminalId: this.$route.query.terminalId, //'站点id',
                  startTime: this.$route.query.startTime, //'开始时间',
                  endTime: this.$route.query.endTime, //'结束时间'
                },
          "traceApi":"http://ks-rinse/reality/queryCustomerExportDetailVo.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "客户信息查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  processName: this.$route.query.processName,
                  terminalId: this.$route.query.terminalId,
                  processId: this.$route.query.processId
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



    // 获取客户信息导出明细
    getCustomerInformationDetail() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        partId: this.$route.query.partId, //'102111(料号ID)',
        processId: this.$route.query.processId, //'制程id',
        terminalId: this.$route.query.terminalId, //'站点id',
        startTime: this.$route.query.startTime, //'开始时间',
        endTime: this.$route.query.endTime, //'结束时间'
        // pageNum: this.pageNum
        // partId: 1000004985, //'102111(料号ID)',
        // partId: '1000004977', //'102111(料号ID)',
        // processId: 101753, //'制程id',
        // terminalId: 60001279, //'站点id',
        // startTime: "2013-08-02 00:00:00", //'开始时间',
        // endTime: "2013-08-02 23:59:59" //'结束时间'
        //  startTime: "2013-08-02 00:00:00",
        // endTime: "2013-08-02 23:59:00",
      };
      if (this.flag) {
        this.flag = false;
        this.$axiosHttp
          .axiosPost("ks-rinse/reality/queryCustomerExportDetailVo.api", data)
          .then(res => {
            console.log(res, "---");
            clearInterval(timer);
            this.number = 0;
            this.isWaiting = false;
            if (res.code == 200) {
              if (res.data.length == 0 && this.pageNum == 1) {
                this.flag = false;
                this.errorMsg = "没有数据";
                return false;
              }
              if (res.data.length > 0) {
                setTimeout(() => {
                  // this.scrollElement.finishPullUp();

                  // 客户信息导出详情数据
                  this.CustomerInformationDetail = this.CustomerInformationDetail.concat(
                    res.data
                  );
                  console.log(this.CustomerInformationDetail, "AAA");
                  this.CustomerInformationDetail.forEach(val => {
                    if (val.status == null) {
                      val.status = "未出货";
                    }
                  });
                }, 500);
              } else {
                setTimeout(() => {
                  // this.scrollElement.finishPullUp();
                  this.scrollElement.beforePullUpWord = "暂无更多数据";
                }, 100);
              }
              // this.CustomerInformationDetail = res.data; // 客户信息导出详情数据
            } else if (res.code == 500) {
              this.errorMsg = "网络速度太慢，加载不出来";
            } else if (res.code == 10005 || res.code == 10002) {
              this.errorMsg = "您的身份校验已过期，请重新登录";
            } else if (res.code == -404) {
                  this.showDrag = true;
                 
            } else {
              this.errorMsg = res.msg;
            }
            this.flag = true;
          });
      }
      this.pageNum++;
    }
  },
  components: {
    scroll,
    Loading,
    popup,
    waiting,
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
.bad-list {
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
.table thead tr{
  height: auto;
}
</style>


