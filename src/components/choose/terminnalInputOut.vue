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
                    <div class="mache-type  no-bg">
                      <div  class="m-name">机种类型</div>
                      <div  class='m-val'>
                          <p>{{this.$route.query.modelType}}</p>
                      </div>
                    </div>      
                    <div class="mache-type no-bg ">
                      <div  class="m-name">机种名称</div>
                      <div  class='m-val'>
                         <p class="e-name" ><span v-text="this.$route.query.modelName || 'Thor TC'"></span> <span v-text="this.$route.query.upccode || 'Sparrow'"></span></p>
                          <p class="c-name" v-text="this.$route.query.partNo ||'604-05132'"> </p>
                      </div>
                    </div>
                    <ul class="time-selects no-bg">
                      <li>
                        <span  class="key">开始时间</span>
                        <div class="val">
                            <span  class="s-time" v-text="this.$route.query.startTime">2018-03-02</span>
                            <!-- <input type="date" name="" id="" v-model="startTime">  -->
                        </div>
                        <div class="d-n" >
                            <span class="day" v-show='this.$route.query.startShow'>白班</span>
                            <span class='night' v-show='!this.$route.query.startShow'>晚班</span>
                        </div>
                      </li>
                      <li>
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time" v-text="this.$route.query.endTime">2018-03-02</span>
                              <!-- <input type="date" name="" id="" v-model="endTime">                        -->
                        </div>
                        <div class="d-n" >
                            <span class="day" v-show="this.$route.query.endShow">白班</span>
                            <span class='night' v-show='!this.$route.query.endShow'>晚班</span>
                        </div>
                      </li>
                    </ul>
                   
                    <ul class="m-pro-list no-bg">
                          <li class="m-pro-list-item"> 
                              <span class="type-icon " :class="{repar:this.$route.query.operateId==1001,product:this.$route.query.operateId==1006,inproducts:this.$route.query.operateId==1008,warehouse:this.$route.query.operateId==1004||1007||1009||1010,qc:this.$route.query.operateId==1003,other:this.$route.query.operateId==1005,pack:this.$route.query.operateId==1002}"></span>
                             <div class="t-name">
                                <p class="en" v-text="this.$route.query.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="this.$route.query.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num">
                                <span class="num" v-text="this.$route.query.totalInputQty">80</span>
                                <span class="tex">滞留总数</span>
                              </div>
                          </li>
                    </ul>
                    <div class="form">
                        <h3 class="form-title">选择站点 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>                       
                      
                        <!-- <h3 class=form-title>选择站点 <button @click="filterAll()">全部</button><button @click="filterData()">有数据</button></h3> -->
                        <ul class="station-list" v-show="!showNoData">
                            <li class="station-item" @click="selectAll">
                            <div class="station-name">全部</div>
                            
                          </li>
                          <li class="station-item" v-for="(item,index) in siteList" :key="index" @click="selectSite(item)">
                            <div class="station-name" v-text="item.terminalName">BVCS Post AN01 QC-1</div>
                            <div class="r-num">
                              <p class="num" v-text="item.totalInputQty">800</p>
                              <p class="tex">滞留总数</p>
                            </div>
                          </li>
                         
                        </ul>
                    </div>
                      <!-- 没有数据的时候显示 -->
                  <div v-show="showNoData" class="no-data"></div>
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
import Utils from "../../common/utils";
import moment from "moment";
import waiting from "../base/waiting.vue";
import waitingProduction from "../base/waitingProduction.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      startTime: "", // 开始时间 2018-01-30T11:00:52.738
      endTime: "", // 结束时间
      errorMsg: "", //错误信息
      flag: false, // 是否点中全选按钮
      activeIndex: -1, // 站点点中索引
      selectList: [], // 站点选中的数据
      siteList: [], // 站点数据
      terminalId: "", // 站点ID
      terminalValue: "", // 选中的站点值
      showNoData: false, // 显示数据不为0的数据有的时候显示
      errorMsg: "", // 错误信息
      isWaiting: true,
      isWaitingProduction:false,
      selectActive: false,
      number: 0,
      cover: false, // 提示选择站点弹窗
      retryCount: 0,
      timer:null,
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

      //  this.showDrag = true;
    console.log(this.$route.query,'传来的参数');
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
      this.terminalId = asyncData.traceContext.terminalId;
      this.$route.query.processId = asyncData.traceContext.processId;
      
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.sTime = asyncData.traceContext.sTime;
      this.$route.query.eTime = asyncData.traceContext.eTime;
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.totalInputQty = asyncData.traceContext.totalInputQty;
      this.$route.query.processDesc = asyncData.traceContext.processDesc;
      this.$route.query.startShow = asyncData.traceContext.startShow;
      this.$route.query.endShow = asyncData.traceContext.endShow;
      this.$route.query.seq = asyncData.traceContext.seq;
      this.$route.query.modelType=asyncData.traceContext.modelType;
      //将制程数据渲染到界面
      this.siteList = asyncData.traceResult.data;  // 缓存的数据
         console.log(typeof asyncData.traceResult , '看看格式')
      //控制是否显示“选择制程”面板
       this.showSelectProcess = true;
      this.filterData();

      if (this.siteList.length == 0) {
        this.errorMsg = "没有数据";
      }

    } else {
        if (sessionStorage.getItem("siteList4")&&JSON.parse(sessionStorage.getItem("siteList4")).length!=0) {
          console.log(JSON.parse(sessionStorage.getItem("siteList4")).length==0,'98888')
          this.siteList = JSON.parse(sessionStorage.getItem("siteList4"));
          this.isWaiting = false;
        }else{
          this.getSite(); // 获取站点
        }
        if (
          sessionStorage.getItem("startShow") &&
          sessionStorage.getItem("endShow")
        ) {
          this.$route.query.startShow = (sessionStorage.getItem("startShow")) == 'false'? false: true;
          this.$route.query.endShow = (sessionStorage.getItem("endShow")) == 'true'? true: false;
          
          console.log(typeof this.startShow,'++++')
          console.log(typeof this.endShow,'----')
        }else{
          this.startShow = true;
          this.endShow = true;
        }
    }
  },
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
       if(sessionStorage.getItem('siteList4All')||sessionStorage.getItem('siteList4')){
           sessionStorage.removeItem('siteList4All')
           sessionStorage.removeItem('siteList4')
           this.siteList=[]
       }
    
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
     cancelAsync(){
      this.showDrag = false;
    },
    // 全部数据
    filterAll() {
       this.selectActive = true;
      if (sessionStorage.getItem("siteList4All")) {
        this.siteList = [];
        this.siteList = JSON.parse(sessionStorage.getItem("siteList4All"));
         if(this.siteList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
      }
    },
    // 筛选有数据
    filterData() {
       this.selectActive = false;
      let newArray = [];
      this.siteList.forEach((val, index) => {
        if (val.totalInputQty != "0") {
          newArray.push(val);
        }
      });
      this.siteList = [];
      this.siteList = newArray;
       sessionStorage.setItem(
              "siteList4",
              JSON.stringify(this.siteList)
            );
             if(this.siteList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
    },

    
     ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"terminnalInputOut",
          "traceParams" : {
                  processId: this.$route.query.processId,
                  partId: this.$route.query.partId,
                  startTime: this.$route.query.sTime,
                  endTime: this.$route.query.eTime,
                  seq: this.$route.query.seq,
                },
          "traceApi":"http://ks-rinse/rinse/queryInputOutputInfoStation.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "投入产出查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  sTime: this.$route.query.sTime, 
                  eTime: this.$route.query.eTime, 
                  seq: this.$route.query.seq,
                  processName: this.$route.query.processName,
                  totalInputQty: this.$route.query.totalInputQty,
                  processDesc: this.$route.query.processDesc,
                  terminalId: this.terminalId,
                  processId: this.$route.query.processId,
                  startShow: this.$route.query.startShow,
                  endShow: this.$route.query.endShow,
                  modelType:this.$route.query.modelType
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


    // 获取站点
    getSite() {
      this.showNoData = false;
       clearInterval(this.timer);
      this.timer= setInterval(() => {
          this.number = this.number + 1;
        }, 1000);
         this.isWaiting = true;
      var data = {
        processId: this.$route.query.processId,
        partId: this.$route.query.partId,
        startTime: this.$route.query.sTime,
        endTime: this.$route.query.eTime,
        seq: this.$route.query.seq,
      };
      console.log(data,'data');
      this.$axiosHttp
        .axiosPost("ks-rinse/rinse/queryInputOutputInfoStation.api", data)
        .then(res => {
          console.log(res);
       clearInterval(this.timer);
           this.number = 0;
          this.isWaiting = false;
            this.filterData()
          if (res.code == 200) {
               
            this.isWaitingProduction = false;
            if (res.data.length == 0) {
              this.errorMsg = "没有数据";
            }
            this.siteList = res.data; // 站点数据
              sessionStorage.setItem(
              "siteList4All",
              JSON.stringify(this.siteList)
              
            );
             this.filterData()
          } else if (res.code == 500) {
              this.isWaiting = false;
            this.isWaitingProduction = false;
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
              this.isWaiting = false;
            this.isWaitingProduction = false;
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
            this.showDrag = true;
            
          } else {
            this.errorMsg = res.msg;
              this.isWaiting = false;
             this.isWaitingProduction = false;
          }
        });
    },
    // 选择全部站点
    selectAll(event) {
      // 去往投入产出查询页面
      this.terminalId = ""; // 全选，默认传空字符串即可
      this.$router.push({
        path: "inputAndOutputQuery",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode, //upccode
          seq: this.$route.query.seq,
          partNo: this.$route.query.partNo,
          terminalId: this.terminalId,
          terminalValue: this.terminalValue,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          startShow: this.$route.query.startShow,
          endShow: this.$route.query.endShow,
          startTimeZore: this.$route.query.sTime, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.eTime, // 用来下一个页面发请求的
          modelType:this.$route.query.modelType
        }
      });
        sessionStorage.setItem('startShow',this.$route.query.startShow)
        sessionStorage.setItem('endShow',this.$route.query.endShow)
    
    },
    // 选择站点
    selectSite(item, index) {
      this.terminalId = item.terminalId;
      this.terminalValue = item.terminalName;
      this.$router.push({
        path: "inputAndOutputQuery",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo,
          seq: this.$route.query.seq,
          terminalId: this.terminalId,
          terminalValue: this.terminalValue,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          startShow: this.$route.query.startShow,
          endShow: this.$route.query.endShow,
          startTimeZore: this.$route.query.sTime, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.eTime, // 用来下一个页面发请求的
          modelType:this.$route.query.modelType
        }
      });
        sessionStorage.setItem('startShow',this.$route.query.startShow)
        sessionStorage.setItem('endShow',this.$route.query.endShow)
    
    },
  },
  components: {
    popup,
    waiting,
    waitingProduction,
    asyncPop
  }
};
</script>
<style scoped>
.mache-type{
  height: 44px !important;
  min-height: 44px !important;
}
.mache-type:nth-child(2){
  border-top: none;
}
</style>