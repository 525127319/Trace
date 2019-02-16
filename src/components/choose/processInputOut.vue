<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
               <span class="icon icon-left"></span>
            </span>
            <h1>投入产出</h1>
             <span class="right" @click="search">
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                  <ul class="y_section-nav">
                      <li class="active" >
                          <router-link to="/processInputOut">
                            投入产出
                          </router-link>
                      </li>
                      <li >
                          <router-link to="/manyModelYield">
                          机种良率
                          </router-link>
                      </li>
                    </ul>
                   <div class="gental-tip" style="min-height:84px;">
                     <span class="tip-title">温馨提示：</span>
                     <div class="tip-content">
                       <p>1.您可在10:30之后查询昨天晚班及之前的数据</p>
                       <p>2.您可在22:30之后查询当天白班及之前的数据</p>
                       <p>3.您可点击“白晚班图标”切换白晚班</p>
                      </div>
                     </div>
                     <li class="y_select" style="margin:0;border:1px solid rgba(0, 0, 0, 0.05)">
                        <span class="y_select-text">类型选择</span>
                        <div class="y_select-r" >
                            <div v-for="(item,index) in modelType" :key="index">
                               <label for="y_radio1"  :class="{'act':activeIndex == index}" @click="selecType(item,index)">{{item}}</label>                  
                            </div>
                        </div>
                    </li>
                    <div class="mache-type c" @click="tochooseModel">
                        <div  class="m-name">机种选择</div>
                        <div  class='m-val'>
                         <ul class="value"  v-for="(item,index) in bcModels" :key="index">
                              <li>
                                  <span class="y_text">{{item.modelName}} {{item.partName}} {{item.colorEn}}</span>
                                  <p class="gray-list-text">{{item.partNo}}</p>
                              </li>
                             </ul>
                        </div>
                        <span class="icon icon-right"></span>
                    </div>
                 <ul class="time-selects">
                      <li>
                        <span  class="key">开始时间</span>
                        <div class="val">
                            <span  class="s-time" v-text="startTime">2018-03-02</span>
                            <input type="date" name="" id="" v-model="startTime" @change="chooseStartTime"> 
                        </div>
                        <div class="d-n" @click="startShow = !startShow">
                          <transition name="rotate" mode="in-out">
                               <span class="day" v-show='startShow'>白班</span>
                            </transition>
                            <transition name="rotate" mode="in-out">
                               <span class='night' v-show='!startShow'>晚班</span>
                            </transition>                                                       
                        </div>
                      </li>
                      <li>
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time" v-text="endTime">2018-03-02</span>
                              <input type="date" name="" id="" v-model="endTime"  @change="chooseEndTime">                       
                        </div>
                        <div class="d-n" @click="endShow = !endShow">
                            <transition name="rotate" mode="in-out">
                                <span class="day" v-show="endShow">白班</span>
                            </transition>
                            <transition name="rotate" mode="in-out">
                                <span class='night' v-show='!endShow'>晚班</span>
                            </transition>                                                      
                        </div>
                      </li>
                    </ul>
                    <div class="form" >
                        <h3 v-show="showSelectProcess" class="form-title">选择制程 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>                       
                        <ul class="m-pro-list">
                          <li class="m-pro-list-item" v-for="(item,index) in processList" :key="index" @click="toChooseTerminal(item,queryPartId)" > 
                              <span class="type-icon " :class="{repar:item.operateId==1001,product:item.operateId==1006,inproducts:item.operateId==1008,warehouse:item.operateId==1004||1007||1009||1010,qc:item.operateId==1003,other:item.operateId==1005,pack:item.operateId==1002}"></span>
                              <div class="t-name">
                                <p class="en" v-text="item.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="item.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num">
                                <span class="num" v-text="item.totalInputQty">80</span>
                                <span class="tex">滞留总数</span>
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
          <div class="pop" v-show="processInputOutPrompt">
            <!-- 我知道 -->
            <div class="ok"  @click="handlePrompt"></div>
            <!-- 点击查询 -->
            <div class="inquire"></div>
            <!-- 选择查询条件 -->
            <div class="select-lists"></div>
            <!-- 切换查询类别 -->
            <div class="inquire-list"></div>
          </div>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import waitingProduction from "../base/waitingProduction.vue";
import moment from "moment";
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      processInputOutPrompt:true,
      bcModels:[],
      modelType: ["iPad", "Protable"], //类型选择
      processList: [], // 制程数据
      isWaiting: false,
      isWaitingProduction:false,
      cover: false,
      selectActive: false,
      showSelectProcess: false, // 选择制程
      showNoData: false, // 显示数据不为0的数据有的时候显示
      startShow: true, // 开始时间默认显示白班时间当天
      endShow: true, // 结束时间默认显示白班时间当天
      number: 0,
      errorMsg: "", //错误信息
      seq: "", // 途程号
      a: "", //
      b: "", //
      c: "", //
      modelName: this.$route.query.modelName, // 切换前机种名
      showDrag: false, // 是否弹窗提示异步加载任务
      startTime: "", // 开始时间 2018-01-30T11:00:52.738
      endTime: "", // 结束时间
      sTime: "", // 传给后台的实际开始时间
      eTime: "" ,// 传给后台的实际结束时间,
      retryCount: 0,
      timer:null,
      showH5Title: true, // 是否显示H5的头部，默认显示
      activeIndex: 0, //类型索引
      typeValue: "", //类型属性值
      queryPartId:'',  //传给站点页面的partId
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
        text: "查询", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        onSuccess: function(result) {
           self.search();
        },
      });

       if (self.$store.state.processInputOutType) {
        self.typeValue = this.$store.state.processInputOutType;
        self.activeIndex = this.$store.state.processInputOutIndex;
      } else {
        self.typeValue = "iPad";
        self.activeIndex = 0;
      } 
        
    if (Object.keys(self.$store.state.processInputOutItem).length != 0) {
      console.log(self.$store.state.processInputOutItem, "参数");
        self.bcModels.push(self.$store.state.processInputOutItem);
      } else {
        self.getinitModel();
      }

    if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){  
      // 如果有缓存异步数据
    let asyncData =JSON.parse(sessionStorage.getItem("asyncResult"));
    asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
    asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
    console.log(asyncData,'缓存数据的获取')
    console.log(asyncData.traceContext ,'context')
    console.log(typeof asyncData)
      //原传递给服务端的参数
       this.bcModels=[];
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
       this.sTime =asyncData.traceContext.startTime;
       this.eTime =asyncData.traceContext.endTime;
      // this.$route.query.partId = asyncData.traceContext.partId;      
      //界面渲染参数
      let items ={};
      items.modelName = asyncData.traceContext.modelName;
      items.modelId = asyncData.traceContext.partId;
      items.partName = asyncData.traceContext.upccode;
      items.partNo = asyncData.traceContext.partNo;
      items.colorEn =asyncData.traceContext.colorEn;         
      this.queryPartId = asyncData.traceContext.partId;
      if (asyncData.traceContext.partId) {
        sessionStorage.setItem("queryPartId",this.queryPartId);
      }
      this.$store.commit('SET_PROCESSINPUTOUT_ITEM',items);
      this.bcModels.push(items);
      // this.$route.query.path = asyncData.traceContext.path;
      // console.log(this.bcModels[0],'shensdfjadsgjsdjklgjdakls');
      // 将制程数据渲染到界面
      this.processList = asyncData.traceResult.data;  // 缓存的数据
         console.log(this.processList , '缓存数据看看')
      // 控制是否显示“选择制程”面板
      this.showSelectProcess = true;
      this.filterData();
      if (this.processList.length == 0) {
        this.errorMsg = "没有数据";
      }

     }else{

    const self = this;
    if (sessionStorage.getItem("s3") && sessionStorage.getItem("e3")) {
      self.startTime = sessionStorage.getItem("s3");
      self.endTime = sessionStorage.getItem("e3");
      self.sTime = sessionStorage.getItem("sTimes");
      self.eTime = sessionStorage.getItem("eTimes");
    } else {
     
      const nowselectTime = moment().format("X"); // 当前时间戳
      const yesterdayTime = nowselectTime - 86400; // 当前时间的前一日
      const zeroTime = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
      const zeroTimeTemp = moment(zeroTime).format('X'); // 当前0点时间戳
      const nineTime = new Date();
      const tenTime = new Date();
      nineTime.setHours(10, 30); // 当天10:30
      tenTime.setHours(22, 30); // 当天22:30
      const nineTimeTemp = moment(nineTime).format("X"); // 当天10:30 时间戳
      const tenTimeTemp = moment(tenTime).format("X"); // 当天22:30 时间戳
      console.log(tenTimeTemp, "当天22:30的时间戳");
      console.log(zeroTimeTemp, "当天0:0的时间戳");
      if (
        nowselectTime - nineTimeTemp >= 0 &&
        nowselectTime - tenTimeTemp < 0
      ) {
        // 当天10:30---22: 30的情况
        // 情况1
        self.startShow = true;
        self.endShow = false;
        self.startTime = moment(yesterdayTime * 1000).format("YYYY-MM-DD");
        self.endTime = moment(yesterdayTime * 1000).format("YYYY-MM-DD");
        var stTimes = self.startTime.replace(/\-/g, "/");
        var edTimes = self.endTime.replace(/\-/g, "/");
        self.sTime = moment(stTimes)
          .hour(8)
          .minute(0)
          .format("YYYY-MM-DD HH:mm");
        self.eTime = moment(edTimes)
          .add(1, "days")
          .hour(7)
          .minute(59)
          .format("YYYY-MM-DD HH:mm");
      } else if (
        nowselectTime - tenTimeTemp > 0 &&
        nowselectTime - tenTimeTemp <= 9000
      ) {
        // 时间位于当天时间的22:30--0:00
        // 情况2
        self.startShow = false;
        self.endShow = true;
        self.startTime = moment(yesterdayTime * 1000).format("YYYY-MM-DD");
        self.endTime = moment(nowselectTime * 1000).format("YYYY-MM-DD");
        var stTimes = self.startTime.replace(/\-/g, "/");
        var edTimes = self.endTime.replace(/\-/g, "/");
        self.sTime = moment(stTimes)
          .hour(20)
          .minute(0)
          .format("YYYY-MM-DD HH:mm");
        self.eTime = moment(edTimes)
          .hour(19)
          .minute(59)
          .format("YYYY-MM-DD HH:mm");
      } else if (
        nowselectTime - zeroTimeTemp >= 0 &&
        nowselectTime - nineTimeTemp <= 0
      ) {
        // 时间位于第二天时间的0:00--10:30
         // 情况2
        self.startShow = false;
        self.endShow = true;
         self.startTime = moment((yesterdayTime- 86400) * 1000).format("YYYY-MM-DD");
        self.endTime = moment(yesterdayTime * 1000).format("YYYY-MM-DD");
         var stTimes = self.startTime.replace(/\-/g, "/");
        var edTimes = self.endTime.replace(/\-/g, "/");
        self.sTime = moment(stTimes)
          .hour(20)
          .minute(0)
          .format("YYYY-MM-DD HH:mm");
        self.eTime = moment(edTimes)
          .hour(19)
          .minute(59)
          .format("YYYY-MM-DD HH:mm");
      }
    }
    if (
      sessionStorage.getItem("startShow") &&
      sessionStorage.getItem("endShow")
    ) {
      this.startShow =
        sessionStorage.getItem("startShow") == "false" ? false : true;
      this.endShow = sessionStorage.getItem("endShow") == "true" ? true : false;
    }
   
    if (sessionStorage.getItem("processList4")) {
      this.processList = JSON.parse(sessionStorage.getItem("processList4"));
      if(this.processList.length>0){
        this.showSelectProcess = true;
      }
      if (sessionStorage.getItem("queryPartId")) {
        this.queryPartId =  sessionStorage.getItem("queryPartId");
      }
    }
    

    if (this.$route.query.partId === undefined) {
        this.$route.query.partId = "6000000086";
      }
      if (this.$route.query.modelName === null) {
        this.$route.query.modelName = "";
      }
      if (this.$route.query.modelName === undefined) {
        this.$route.query.modelName = "Flash TC";
      }
      if (this.$route.query.upccode === null) {
        this.$route.query.upccode = "";
      }
      if (this.$route.query.upccode === undefined) {
        this.$route.query.upccode = "Sparrow";
      }
      if (this.$route.query.partNo === undefined) {
        this.$route.query.partNo = "604-70711";
      }
    }
    if(localStorage.getItem('processInputOutPrompt') =='false'){
       this.processInputOutPrompt=false;
    } 
  },
  methods: {
     handlePrompt(){
        this.processInputOutPrompt=false;
        localStorage.setItem('processInputOutPrompt',this.processInputOutPrompt);
      },
     //类型选择
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_PROCESSINPUTOUT_TYPE", item);
      this.$store.commit("SET_PROCESSINPUTOUT_INDEX", index);
      this.getinitModel();
    },
    //初始化机种
    getinitModel() {
      let self = this;
      self.bcModels = [];
      let params = { type: self.typeValue, keyWord: "" };
      this.$axiosHttp
        .axiosPost("ks-newrep/ReportTool/findModelByTypeName.api", params)
        .then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            self.bcModels.push(data[0]);
            this.$store.commit('SET_PROCESSINPUTOUT_ITEM',data[0]); 
          } else {
            this.errorMsg = msg;
          }
        });
    },
    ...mapActions([
        'deleteProInputOutList'
    ]),
    // 返回上一页
    back() {
       this.deleteProInputOutList();
       if(sessionStorage.getItem('processList4All')||sessionStorage.getItem('processList4')){
        sessionStorage.removeItem('processList4All')
        sessionStorage.removeItem('processList4')
      }
      if(this.$route.query.asyncFlag){
          this.$router.push({
            path: "/asyncTaskList",
        });
      }else{
          this.$router.push({
              path: "/index",
          });
      }
      this.processInputOutPrompt=false;
      localStorage.setItem('processInputOutPrompt',this.processInputOutPrompt);
    },
     cancelAsync(){
      this.showDrag = false;
    },
    // 全部数据
    filterAll() {
      this.selectActive = true;
      if (sessionStorage.getItem("processList4All")) {
        this.processList = [];
        this.processList = JSON.parse(sessionStorage.getItem("processList4All"));
         if(this.processList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
      }else if(sessionStorage.getItem("asyncResult")){
          let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
        asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
        this.processList = [];
         this.processList = asyncData.traceResult.data; // 缓存的数据
        console.log(this.processList,'全部数据')
         if(this.processList.length==0){
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
      console.log(this.processList,'刷选页面有数据之前的')
      
      this.processList.forEach((val, index) => {
        
        if (val.totalInputQty != "0") {
          newArray.push(val);
        }
      });
      console.log(newArray,'刷选页面有数据的newArray')
      
      this.processList = [];
      this.processList = newArray;
      console.log(this.processList,'刷选页面有数据的')
        sessionStorage.setItem(
              "processList4",
              JSON.stringify(this.processList)
            );
             if(this.processList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
    },
    // 去往选择机制页面
    tochooseModel() {
      sessionStorage.setItem("s3", this.startTime);
      sessionStorage.setItem("e3", this.endTime);
      this.$router.push({
        path: "badModelList",
        query: {
          path: this.$route.query.path, // 判断是哪个流程进来的
          type: this.typeValue,
          target:"processInputOut"
        }
      });
    },
    // 选择开始时间
    chooseStartTime() {
     if(this.startTime){
          this.startTime = moment(this.startTime).format("YYYY-MM-DD");
        }else{
          this.startTime = ''
        }
         if(sessionStorage.getItem('processList4All')&&sessionStorage.getItem('processList4')){
        sessionStorage.removeItem('processList4All')
        sessionStorage.removeItem('processList4')
      }
       this.processList = [],
        this.showSelectProcess = false;
    },
    // 选择结束时间
    chooseEndTime() {
     
      if(this.endTime){
          this.endTime = moment(this.endTime).format("YYYY-MM-DD");
      }else{
        this.endTime = ''
      }
       if(sessionStorage.getItem('processList4All')&&sessionStorage.getItem('processList4')){
        sessionStorage.removeItem('processList4All')
        sessionStorage.removeItem('processList4')
      }
       this.processList = [],
        this.showSelectProcess = false;
    },
    ////////////////////////////发起异步请求///////////////////////////
     //启动异步任务机制
  startAsyncTask: function() {


     // 判断是否是同一天
      var start = moment(this.startTime).format("YYYY/MM/DD"); // 开始日期
      var end = moment(this.endTime).format("YYYY/MM/DD"); // 结束日期
      var now = moment().get("date");
      var nowTime = moment().format("YYYY/MM/DD");
      var nowDate = new Date(this.endTime).getDate();

      var sTimes = this.startTime.replace(/\-/g, "/");
      var eTimes = this.endTime.replace(/\-/g, "/");
      this.a = new Date(sTimes).getTime();
      this.b = new Date(eTimes).getTime();
      if (this.a > this.b) {
        this.errorMsg = "开始时间不能大于结束时间";
        return;
      }
       
      // 同一天，开始时间和结束时间都是白班的情况
      if (this.startShow && this.endShow && start == end) {
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
      } else if (!this.startShow && !this.endShow && start == end) {
        // 同一天，开始时间和结束时间都是晚班的情况
        this.sTime = moment(sTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
      } else if (this.startShow && !this.endShow && start == end) {
        // 同一天，开始时间是白班和结束时间是晚班的情况
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)
          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)
          .format("YYYY-MM-DD HH:mm");
      } else if (!this.startShow && this.endShow && start == end) {
        // 同一天，开始时间是晚班和结束时间是白班的情况  不成立的情况做提示
        this.errorMsg = "您查询的班次有误,请重新选择";
        return;
      }

      // 不同天，开始时间和结束时间都是白班的情况
      if (this.startShow && this.endShow && start != end) {
        this.a = "白班";
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .hour(20)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      } else if (!this.startShow && !this.endShow && start != end) {
        // 不同天，开始时间和结束时间都是晚班的情况
        this.sTime = moment(sTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .add(1, "days")
            .hour(8)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      } else if (this.startShow && !this.endShow && start != end) {
        // 不同天，开始时间是白班和结束时间是晚班的情况
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .add(1, "days")
            .hour(8)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      } else if (!this.startShow && this.endShow && start != end) {
        // 不同天，开始时间是晚班和结束时间是白班的情况
        this.sTime = moment(sTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .hour(20)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      }

    // 发起异步请求
     const info = {
          "tracePath":"processInputOut",
          "traceParams" : {
                  partId:this.bcModels[0].modelId,
                  startTime: this.sTime,
                  endTime: this.eTime
                },
          "traceApi":"http://ks-rinse/rinse/queryInputOutputInfoProcess.api",
          "traceContext":{
                  partNo: this.bcModels[0].partNo,
                  modelName: this.bcModels[0].modelName,
                  upccode: this.bcModels[0].partName,
                  colorEn:this.bcModels[0].colorEn,
                  title: "投入产出查询",
                  partId: this.bcModels[0].modelId,  // 请求参数
                  startTime: this.sTime, 
                  endTime: this.eTime, 
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
    // 点击查询按钮，出来制程数据
    search() {
      this.showNoData = false;
     if(!this.startTime || !this.endTime){
         this.errorMsg = '请重新选择时间'
         return;
       }
      this.selectActive = false;
      console.log(this.retryCount,'请求次数')
       if(sessionStorage.getItem('processList4All')&&sessionStorage.getItem('processList4')){
           sessionStorage.removeItem('processList4All')
           sessionStorage.removeItem('processList4')
           this.processList=[]
           this.showSelectProcess = false;
           
       }
      //如果没有选择机种，则提示
      this.errorMsg = ""; 
      // 判断是否是同一天
      var start = moment(this.startTime).format("YYYY/MM/DD"); // 开始日期
      var end = moment(this.endTime).format("YYYY/MM/DD"); // 结束日期
      var now = moment().get("date");
      var nowTime = moment().format("YYYY/MM/DD");
      var nowDate = new Date(this.endTime).getDate();

      var sTimes = this.startTime.replace(/\-/g, "/");
      var eTimes = this.endTime.replace(/\-/g, "/");
      this.a = new Date(sTimes).getTime();
      this.b = new Date(eTimes).getTime();
      if (this.a > this.b) {
        this.errorMsg = "开始时间不能大于结束时间";
        return;
      }
       
      // 同一天，开始时间和结束时间都是白班的情况
      if (this.startShow && this.endShow && start == end) {
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
      } else if (!this.startShow && !this.endShow && start == end) {
        // 同一天，开始时间和结束时间都是晚班的情况
        this.sTime = moment(sTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
      } else if (this.startShow && !this.endShow && start == end) {
        // 同一天，开始时间是白班和结束时间是晚班的情况
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
      } else if (!this.startShow && this.endShow && start == end) {
        // 同一天，开始时间是晚班和结束时间是白班的情况  不成立的情况做提示
        this.errorMsg = "您查询的班次有误,请重新选择";
        return;
      }

      // 不同天，开始时间和结束时间都是白班的情况
      if (this.startShow && this.endShow && start != end) {
        this.a = "白班";
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .hour(20)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      } else if (!this.startShow && !this.endShow && start != end) {
        // 不同天，开始时间和结束时间都是晚班的情况
        this.sTime = moment(sTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .add(1, "days")
            .hour(8)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      } else if (this.startShow && !this.endShow && start != end) {
        // 不同天，开始时间是白班和结束时间是晚班的情况
        this.sTime = moment(sTimes)
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .add(1, "days")
          .hour(8)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .add(1, "days")
            .hour(8)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      } else if (!this.startShow && this.endShow && start != end) {
        // 不同天，开始时间是晚班和结束时间是白班的情况
        this.sTime = moment(sTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        this.eTime = moment(eTimes)
          .hour(20)
          .minute(0)

          .format("YYYY-MM-DD HH:mm");
        if (!nowDate) {
          this.eTime = moment()
            .hour(20)
            .minute(0)

            .format("YYYY-MM-DD HH:mm");
        }
      }
      sessionStorage.setItem("s3", this.startTime);
      sessionStorage.setItem("e3", this.endTime);
      sessionStorage.setItem("sTimes", this.sTime);
      sessionStorage.setItem("eTimes", this.eTime);
      sessionStorage.setItem("startShow", this.startShow);
      sessionStorage.setItem("endShow", this.endShow);
      sessionStorage.setItem("queryPartId",this.bcModels[0].modelId);
      this.queryPartId = this.bcModels[0].modelId;
      if((this.bcModels[0].modelId).toString() == "" ){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      const info = {
        partId:this.bcModels[0].modelId,
        startTime: this.sTime,
        endTime: this.eTime
      };
      var nowTime = moment().format("X");
      //  console.log(this.eTime.getTime()-nowTime.getTime(),9009999999999)
      //604800
      var endtimeer = moment(this.eTime).format("X");
      var starttimeer = moment(this.sTime).format("X");
      endtimeer = Number(endtimeer) + 9000;
      if (Number(nowTime) - endtimeer < 0) {
        this.errorMsg = "结束时间班次暂无数据,请按提示查询";
        clearInterval(this.timer);
        this.isWaiting = false;
        return;
      }

      clearInterval(this.timer);
      this.timer= setInterval(() => {
          this.number = this.number + 1;
        }, 1000);
         this.isWaiting = true;
      this.$axiosHttp
        .axiosPost("ks-rinse/rinse/queryInputOutputInfoProcess.api", info)
        .then(res => {
          // this.showDrag = true;
          clearInterval(this.timer);
          this.number = 0;
          this.isWaiting = false;
           this.filterData()
          let { code, msg, data } = res;
          if (code == 200) {
             this.retryCount = 0;
          
            this.isWaitingProduction = false;
            this.processList = data;
            sessionStorage.setItem(
              "processList4All",
              JSON.stringify(this.processList)
            );
            this.showSelectProcess = true;
            this.filterData()
            if (data.length == 0) {
              this.errorMsg = "没有数据";
            }
          } else if (code == 500) {
             this.isWaiting = false;
               this.isWaitingProduction = false;
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (code == 10005 || res.code == 10002) {
             this.isWaiting = false;
               this.isWaitingProduction = false;
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (code == -404) {
               this.showDrag = true;
               
          } else {
            this.errorMsg = res.msg;
            this.isWaiting = false;
            this.isWaitingProduction = false;
          }
        });
    },

    // 点击制程，去往投入产出流程选择站点页面
    toChooseTerminal(item,partId) {
      console.log( sessionStorage.getItem("sTimes", this.sTime),'sTime');
      console.log(sessionStorage.getItem("eTimes", this.eTime),'eTime');
      sessionStorage.setItem("modelName4", this.$route.query.modelName);
      sessionStorage.setItem("upccode4", this.$route.query.upccode);
      if(sessionStorage.getItem('siteList4All')&&sessionStorage.getItem('siteList4')){
           sessionStorage.removeItem('siteList4All')
           sessionStorage.removeItem('siteList4')
           this.siteList=[]
       }
       this.$route.query.partId = partId;
       this.$route.query.modelName= this.bcModels[0].modelName;
       this.$route.query.upccode=this.bcModels[0].partName +'  '+this.bcModels[0].colorEn;
       this.$route.query.partNo=this.bcModels[0].partNo;
      this.$router.push({
        path: "terminnalInputOut",
        query: {
          processId: item.processId, // 制程ID
          partId: this.$route.query.partId, // 机种ID
          operateId: item.operateId, // 制程类型
          processDesc: item.processDesc, // 制程中文描述
          processName: item.processName, // 制程名
          totalInputQty: item.totalInputQty, // 投入产出滞留总数
          modelName: this.$route.query.modelName, //机种名
          seq: item.seq, // 途程序号
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo, // 机种号码
          startTime: this.startTime, // 开始时间（显示用）
          endTime: this.endTime, // 结束时间（显示用）
          sTime: this.sTime, // 开始时间（传参用）
          eTime: this.eTime, // 开始时间（传参用）
          startShow: this.startShow, //  开始时间白晚班的显示
          endShow: this.endShow ,// 结束时间白晚班的显示
          modelType:this.typeValue
        }
      });
    },

    // 关闭弹窗
    close() {
      this.cover = false;
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
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
  .select-lists{
    top: 170px;
  }
  .inquireri-date{
    top: 305px;
  }
  .inquire-list{
  top: 20px;
}
.no-data{
  min-height: 120px;
  margin-top: 5px;
}
</style>




