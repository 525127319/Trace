<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                 <span class="icon icon-left"></span>
            </span>
            <h1>投入产出</h1>
        </nav>
        <section class="section">

            <section class="main">
                <div class="content-box">
                    <div class="tbale-box">
                        <table class="table t-h c5">
                            <thead>
                                <tr>
                                    <th>当前制程分布(英文)</th>
                                    <th>当前制程分布(中文)</th>
                                    <th>总数</th>
                                    <th>OK</th>
                                    <th>NG</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="t-b">
                              <table class="table  c5">
                                <tbody>
                                    <tr v-for="(item,index) in processDistributionData" :key="index">
                                        <td v-text="item.processName"></td>
                                        <td v-text="item.processDesc"></td>
                                        <td v-text="item.totalInputQty"></td>
                                        <td v-text="item.okQty"></td>
                                        <td v-text="item.ngQty"></td>                                      
                                    </tr>                              
                                </tbody>
                            </table>
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
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      processDistributionData: [], //制程分布数据
      isWaiting: true,
      number: 0,
      errorMsg: "", //错误信息
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
      this.$route.query.woType = asyncData.traceContext.woType;
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.startTimeZore = asyncData.traceContext.startTimeZore;
      this.$route.query.endTimeZore = asyncData.traceContext.endTimeZore;

      //将制程数据渲染到界面
      this.processDistributionData = asyncData.traceResult.data;  // 缓存的数据
         console.log(typeof asyncData.traceResult , '看看格式')
     
    } else {
        this.getProcessDistributionData(); //制程分布数据
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
          "tracePath":"processDistribution",
          "traceParams" : {
                  partId: this.$route.query.partId,
                  processId: this.$route.query.processId,
                  processName: this.$route.query.processName,
                  terminalId: this.$route.query.terminalId,
                  startTime: this.$route.query.startTimeZore,
                  endTime: this.$route.query.endTimeZore,
                  woType: this.$route.query.woType
                },
          "traceApi":"http://ks-rinse/reality/queryCurrProcessVo.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "投入产出查询",
                  partId: this.$route.query.partId,  // 请求参数
                  processId: this.$route.query.processId,
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  startTimeZore: this.$route.query.startTimeZore,
                  endTimeZore: this.$route.query.endTimeZore,
                  woType: this.$route.query.woType,
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


    //制程分布数据
    getProcessDistributionData() {
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
        woType: this.$route.query.woType
      };
      this.$axiosHttp
        // .axiosPost("ks-trace/traceReport/queryCurrProcessVo.api", data)
        .axiosPost("ks-rinse/reality/queryCurrProcessVo.api", data)
        .then(res => {
          console.log(res, 199);
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          if (res.code == 200) {
            this.processDistributionData = res.data;
            if (this.processDistributionData.length == 0) {
              this.errorMsg = "没有数据";
            }
          } else if (res.code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
            this.showDrag = true;
          } else {
            this.errorMsg = res.msg;
          }
        });
    }
  },
  components: {
    popup,
    waiting,
    asyncPop
  }
};
</script>
<style scoped>
.none {
  color: red;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
}
</style>

