<template>
  <div>
      <article>
        <nav class="nav"  v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>生产在制</h1>
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
                    <div class="mache-type no-bg">
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
                            <span  class="s-time" >{{this.$route.query.startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.startTime.split(' ')[1]}}</span>
                            <!-- <input type="datetime-local" name="" id="" v-model="this.$route.query.startTime">  -->
                        </div>
                       
                      </li>
                      <li>
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time" >{{this.$route.query.endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.endTime.split(' ')[1]}}</span>
                              <!-- <input type="datetime-local" name="" id="" v-model="this.$route.query.endTime">                        -->
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
                                <span class="num" v-text="this.$route.query.production">80</span>
                                <span class="tex">在制总数</span>
                              </div>
                          </li>
                    </ul>
                   
                    
                     <ul class="station-list">
                      <li  class="station-l-item"></li>
                    </ul>
                    <div class="form" >
                      
                        <!-- <h3 class=form-title>选择站点 <button @click="filterAll()">全部</button><button @click="filterData()">有数据</button></h3> -->
                        <h3 class="form-title">选择站点 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>                       
                        <ul class="station-list" v-show="!showNoData">
                            <li class="station-item" @click="selectAll">
                            <div class="station-name">全部</div>
                            
                          </li>
                          <li class="station-item" v-for="(item,index) in siteList" :key="index" @click="selectSite(item)">
                            <div class="station-name" v-text="item.terminalName">BVCS Post AN01 QC-1</div>
                            <div class="r-num">
                              <p class="num" v-text="item.production">800</p>
                              <p class="tex">在制总数</p>
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
      showNoData: false, // 显示数据不为0的数据有的时候显示
      selectActive: false,
      tag: true,
      activeIndex: -1, // 站点点中索引
      selectList: [], // 站点选中的数据
      siteList: [], // 站点数据
      terminalId: "", // 站点ID
      terminalValue: "", // 选中的站点值
      errorMsg: "", // 错误信息
      isWaiting: true,
      isWaitingProduction:false,
      number: 0,
      cover: false, // 提示选择站点弹窗
      retryCount: 0,
      timer:null,
      showDrag: false, // 是否弹窗提示异步加载任务
      showH5Title: true // 是否显示H5的头部，默认显示
    };
  },
  created() {
    console.log(this.$route.query,"this.$route.query");
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
        text: "生产在制", //控制显示文本，空字符串表示显示默认文本
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
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.production = asyncData.traceContext.production;
      this.$route.query.processDesc = asyncData.traceContext.processDesc;
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
        if (sessionStorage.getItem("siteList5")&&JSON.parse(sessionStorage.getItem("siteList5")).length!=0) {
          this.siteList = JSON.parse(sessionStorage.getItem("siteList5"));
          this.isWaiting = false;
        }else{
          this.getSite(); // 获取站点
        }
    }
  },
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
       if(sessionStorage.getItem('siteList5All')||sessionStorage.getItem('siteList5')){
           sessionStorage.removeItem('siteList5All')
           sessionStorage.removeItem('siteList5')
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
      if (sessionStorage.getItem("siteList5All")) {
        this.siteList = [];
        this.siteList = JSON.parse(sessionStorage.getItem("siteList5All"));
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
        if (val.production != "0") {
          newArray.push(val);
        }
      });
      this.siteList = [];
      this.siteList = newArray;
        sessionStorage.setItem(
              "siteList5",
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
          "tracePath":"terminalProduction",
          "traceParams" : {
                  processId: this.$route.query.processId,
                  partId: this.$route.query.partId,
                  startTime: this.$route.query.startTime,
                  endTime: this.$route.query.endTime
                },
          "traceApi":"http://ks-trace/traceSort/queryProductionStation.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "生产在制查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  processName: this.$route.query.processName,
                  production: this.$route.query.production,
                  processDesc: this.$route.query.processDesc,
                  terminalId: this.terminalId,
                  processId: this.$route.query.processId,
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
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime
      };
      console.log("data",data);
      this.$axiosHttp
        .axiosPost("ks-trace/traceSort/queryProductionStation.api", data)
        .then(res => {
          console.log(res);
          // this.filterData()
           clearInterval(this.timer);
            this.number = 0;
            this.isWaiting = false;
          if (res.code == 200) {
           
            if (res.data.length == 0) {
              this.errorMsg = "没有数据";
            }
            this.siteList = res.data; // 站点数据
             sessionStorage.setItem(
              "siteList5All",
              JSON.stringify(this.siteList)
            );
            this.filterData()
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
    },
    // 选择全部站点
    selectAll(event) {
      // 去往生产在制查询页面
      this.terminalId = ""; // 全选，默认传空字符串即可
      this.$router.push({
        path: "productionQuery",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo,
          terminalId: this.terminalId,
          terminalValue: this.terminalValue,
          startTimeZore: this.$route.query.startTime, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.endTime, // 用来下一个页面发请求的
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          modelType:this.$route.query.modelType
        }
      });
    
    },
    // 选择站点
    selectSite(item, index) {
      this.terminalId = item.terminalId;
      this.terminalValue = item.terminalName;
      this.$router.push({
        path: "productionQuery",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo,
          terminalId: this.terminalId,
          terminalValue: this.terminalValue,
          startTimeZore: this.$route.query.sTime, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.eTime, // 用来下一个页面发请求的
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          modelType:this.$route.query.modelType
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
.mache-type{
  height: 44px !important;
  min-height: 44px !important;
}
.mache-type:nth-child(2){
  border-top: none;
}
</style>