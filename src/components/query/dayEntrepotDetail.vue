<template>
    <article>
        <nav class="nav"  v-show="showH5Title">
            <span class="left"  @click="goBack">
                <span class="icon icon-left"></span>
            </span>
            <!-- 下拉分页-->
            <h1>仓库领料</h1>
        </nav>
        <section class="section y_overflow">
            <div class="entrepot_particulars">
                <div class="particulars-top" >
                    <div class="particulars-left">
                        <p>{{modelName}} {{upcCode}}</p>
                        <span>{{partNo}}</span>
                        <i class="icon-left ic_bott"></i>
                    </div>
                    <div class="y_r-text">
                        <span>{{startTime}}</span>
                        <span>{{endTime}}</span>
                    </div>
                </div>
                <div class="particulars-tab" >
                    <!-- <table>
                        <thead>
                            <tr>
                                <th>机种</th>
                                <th>编号</th>
                                <th>数量</th>
                            </tr>
                        </thead>
                        <tbody v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                        <tbody  > 
                            <tr v-for="(item,index) in detailData" :key="index" >
                                 <td>
                                    <p>{{item.modelName}} {{item.upcCode}}</p>
                                    <span>{{item.partNo}}</span>
                                </td>
                                <td style="-webkit-user-select:text;user-select:text;"> 
                                    <input type="text" readonly="readonly" class="textarea" :value="item.carton">
                                     {{item.carton}} 
                                 </td>
                                <td>
                                    {{item.reportTotal}}
                                </td>
                            </tr>                          
                        </tbody> 
                    </table> --> 
                    <div class="details">
                        <div class="details-top">
                            <span>机种</span>
                            <span>编号</span>
                            <span>数量</span>
                        </div>
                        <ul class="details-foot" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                            <li v-for="(item,index) in detailData" :key="index" >
                                <div>
                                    <p>
                                       {{item.modelName}} {{item.upcCode}}
                                    </p>
                                    <span>{{item.partNo}}</span>
                                </div>
                                <div>
                                    {{item.carton}} 
                                </div>
                                <div>
                                    {{item.reportTotal}}
                                </div>

                            </li>
                             <Loading class="loading" v-show="showLoading" ></Loading>
                            <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>
                        </ul>
                    </div>
                </div>
                <asyncPop v-show="showDrag" ></asyncPop>
                <popup :errorMsg="errorMsg"></popup>
            </div>
        </section>
    </article>
</template>
<script>
import popup from "../base/popup .vue";
import Loading from "../base/loading.vue";
import pullingWord from "../base/pulling-word.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  components: {
    scroll,
    waiting,
    Loading,
    popup,
    pullingWord,
    asyncPop
  },
  data() {
    return {
      detailList: [],
      showDrag: false, // 是否弹窗提示异步加载任务
      showH5Title: true, // 是否显示H5的头部，默认显示
      detailData: [],
      errorMsg: "",
      pageNum: 1,
      busy: false,
      isWaiting: true, // 加载动画
      showLoading: false, // 显示加载动画
      showWord: false, // 显示文字提示
      loadingWord: "", // 提示文字
      startTime: "",
      endTime: "",
      modelName: "",
      upcCode: "",
      partNo: ""
    };
  },
  // 初始化弹窗文本信息为空
  initTxt() {
    this.errorMsg = "";
  },
  created() {
    if (
      window.navigator.userAgent.indexOf("IOS") > -1 ||
      window.navigator.userAgent.slice(11) === "ANDROID-IAAPPCONTAINER" ||
      window.navigator.userAgent.slice(11) === "PAD-IAAPPCONTAINER"
    ) {
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
        self.goBack();
      }
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
      text: "仓库领料", //控制显示文本，空字符串表示显示默认文本
      textColor: "#212121", //字体颜色  16进制，关键字
      url: "", //控制标题文本，空字符串表示显示默认文本
      backcoler: "#ffffff" //背景色
    });
    // 设置右侧按钮
    this.IM.setRight({
      isclickble: "1", //0 默认不受控    1受控   （必传）
      type: "0", //0：文字     1：图标   （必传）
      text: "", //控制显示文本，空字符串表示显示默认文本
      textColor: "#ff7e00", //字体颜色  16进制，关键字
      url: "", //控制标题文本，空字符串表示显示默认文本
      backcoler: "#ffffff" //背景色
    });
    if (this.$route.query.target == "daysEntrepot") {
      self.modelName = this.$route.query.sendData.modelName;
      self.upcCode = this.$route.query.sendData.upcCode;
      self.partNo = this.$route.query.sendData.partNo;
      self.startTime = this.$route.query.startTime;
      self.endTime = this.$route.query.endTime;
    }
    if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // 如果有缓存异步数据
      let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
      asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
      asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
      console.log(asyncData, "缓存数据的获取");
      console.log(asyncData.traceContext, "context");
      console.log(typeof asyncData);
      this.modelName = asyncData.traceContext.modelName;
      this.upcCode = asyncData.traceContext.upccode;
      this.partNo = asyncData.traceContext.partNo;
      this.startTime = asyncData.traceContext.startTime;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime =asyncData.traceContext.endTime;
      this.$route.query.modelStrs =asyncData.traceContext.partId;
      this.endTime = asyncData.traceContext.endTime;
      this.pageNum = asyncData.traceContext.pageNum;
      //将制程数据渲染到界面
      this.detailData = asyncData.traceResult.data; // 缓存的数据
      this.pageNum++;
      this.loadMore()
    }
  },
  methods: {
    //启动异步任务机制
    startAsyncTask: function() {
      // 发起异步请求
      const info = {
        tracePath: "/dayEntrepotDetail",
        traceParams: {
          partId: this.$route.query.modelStrs,
          startTime: this.startTime,
          endTime: this.endTime,
          pageNum: 1
        },
        traceApi:
          "http://ks-newrep/RepertoryMaterial/findReperMaterialDetail.api",
        traceContext: {
          modelName: this.modelName,
          upccode: this.upcCode,
          partNo: this.partNo,
          title: "仓库机种领料详情查询",
          partId: this.$route.query.modelStrs,
          startTime: this.startTime,
          endTime: this.endTime,
          pageNum: 1
        }
      };
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/sendAsynTask.api", info)
        .then(res => {
          console.log("异步请求查询res", res);
          if (res.code == 200) {
            this.unreadData(); // 当天未读数量获取
          }
        });
    },
    cancelAsync() {
      this.showDrag = false;
    },
    // 当天未读数量请求
    unreadData() {
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/querySaDayCount.api")
        .then(res => {
          console.log("当天未读数量：res", res);
          let { code, msg, data } = res;
          switch (code) {
            case 200:
              this.$store.commit("SET_COUNT", data);
              this.cancelAsync(); // 取消弹窗
              break;
          }
        });
    },
    goBack() {
      if(this.$route.query.asyncFlag){
          this.$router.push({
            path: "/asyncTaskList",
        });
      }else{
        this.$router.push({
          path: "/daysEntrepot",
          query: {
            reDraw: true
            }
          });
      }
     
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    loadMore() {
      let self = this;
      // self.busy = true;
      let params = {
        partId: this.$route.query.modelStrs,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        pageNum: this.pageNum
      };

      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      this.$axiosHttp
        .axiosPost(
          "ks-newrep/RepertoryMaterial/findReperMaterialDetail.api",
          params
        )
        .then(res => {
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
           let {code, msg, data} = res;
          if (res.data.length === 0) {
                this.showWord = true;
                this.loadingWord = "没有更多数据";
          }
          if (res.code == 200 && res.data.length != 0) {
                this.detailData = this.detailData.concat(res.data);
                this.showLoading = true;
                // self.busy = false;  
            if (res.data.length < 20) {
               this.showLoading = false;
            }
            self.pageNum++;
          } else if (code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (code == -404) {
               this.showDrag = true;
          } 
          
        });
        self.busy = false; // 放请求后面，避免多次请求 
    }
  }
};
</script>
<style>
.particulars-top {
  display: flex;
}
.y_r-text {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  color: #ff7e00;
}
.textarea {
  border: none;
  resize: none;
}
/* thead{
  position: absolute;
  width: 100%;
  z-index: 999;
  
} */
.myScroll{
  
  overflow: hidden;
}
.entrepot_particulars{
    flex: 1;
    display: flex;
    flex-direction: column;
}
.particulars-top{
    min-height: 44px;
}
.details{
    flex: 1;
    width: 100%;
    /* padding: 0 1rem; */
    position: relative;
    font-size: 12px;
    overflow-x: hidden;
    overflow-y: auto;
    
}
.details-top{
    display: flex;
}
.details-top span{
display: block;
border-bottom: 1px solid #c9c9c9;
text-align: left;
    padding-top: 10px;
    padding-bottom: 5px;
}
.details-top span:first-child,.details-foot>li>div:first-child{
    width: 9.2rem;
    min-width: 9.2rem;
}
.details-top span:nth-child(2),.details-foot>li>div:nth-child(2){
    width: 8.45rem;
     min-width: 8.45rem;
     -webkit-user-select: text;
    user-select: text;
}
.details-top span:last-child,.details-foot>li>div:last-child{
    flex: 1;
    text-align: right;
}
.details-foot{
  position: absolute;
  overflow: hidden;
  left: 0;
  z-index: 20;
    width: 100%;
    /* position: absolute; */
}
.details-foot>li{
    height: 45px;
    display: flex;
    align-items: center;
}
.details-foot>li:not(:last-child){
    border-bottom: 1px solid #c9c9c9;
}
.particulars-tab{
    position: relative;
    display: flex;
    flex-direction: column;
}
</style>

