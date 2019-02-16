<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="goBack">
               <span class="icon icon-left"></span>
            </span>
            <h1>成品信息</h1>
             <span class="right" @click="doSearch()">
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
                  <router-link to="/processCustomerInformation">
                    成品信息
                    </router-link>
                </li>
                <li >
                  <router-link to="/productData">
                    产出数据
                  </router-link>
                </li>
                <li >
                  <router-link to="/modelSaleRatio">
                  出货比例
                  </router-link>
                </li>
                <li >
                  <router-link to="/modelSaleDetail">
                    出货详情
                  </router-link>
                </li>    
              </ul>
                   <div class="gental-tip" style="min-height:44px;">
                     <span class="tip-title" >温馨提示：</span>
                     <div class="tip-content">
                       <p>您可以查询<span v-text=" beforeTime"></span>之前的数据</p>
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
                            <span  class="s-time" v-show="startTime" >{{startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+startTime.split(' ')[1]}}</span>
                            <input type="datetime-local"  name="" id="" v-model="startControlTime" @change="setupStartControlTime()"> 
                        </div>
                       
                      </li>
                      <li>
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time"  v-show="endTime">{{endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+endTime.split(' ')[1]}}</span>
                              <input type="datetime-local"  name="" id="" v-model="endControlTime"  @change="setupEndControlTime">                       
                        </div>
                        
                      </li>
                    </ul>
                    <div class="form" >
                        <h3 v-show="showSelectProcessPanel" class="form-title">选择制程 <div class="tab-btns"><button :class="{active:selectActive}" @click="renderAllProcessList()">全部</button><button :class="{active:!selectActive}" @click="renderNoneZeroProcessList()">数量不为0</button></div></h3>                      
                        <ul class="m-pro-list">
                          <li class="m-pro-list-item" v-for="(item,index) in processList" :key="index" @click="goChooseTerminal(item,queryPartId)" > 
                              <span class="type-icon " :class="{repar:item.operateId==1001,product:item.operateId==1006,inproducts:item.operateId==1008,warehouse:item.operateId==1004||1007||1009||1010,qc:item.operateId==1003,other:item.operateId==1005,pack:item.operateId==1002}"></span>
                              <div class="t-name">
                                <p class="en" v-text="item.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="item.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num">
                                <span class="num" v-text="item.totalCount"></span>
                                <span class="tex">出货量汇总</span>
                              </div>
                          </li>
                         
                        </ul>
                        
                    </div>
                   
                   <!-- 没有数据的时候显示 -->
                  <div v-show="showNoDataICon" class="no-data"></div>

                
                </div>
            </section>
        </section>
      <popup :errorMsg="errorMsg" ></popup>
      <waiting v-show="isInSearching" :number="tickNumber"></waiting>
      <asyncPop v-show="showDrag" ></asyncPop>
    </article>
      <div class="pop" v-show="processCustomerPrompt">
        <!-- 我知道 -->
        <div class="ok" @click="handlePrompt"></div>
        <!-- 点击查询 -->
        <div class="inquire"></div>
        <!-- 切换查询类别 -->
        <div class="inquire-list"></div>
        <!-- 选择查询条件 -->
        <div class="select-lists"></div>
      </div>
  </div> 
</template>
<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import waitingProduction from "../base/waitingProduction.vue";
import moment from "moment";
import ASYNCTask from "../../common/ASYNCTask";
import Cache from "../../common/Cache";
import IAAPPContainer from "../../common/IAAPPContainer";
import asyncPop from "../base/asyncPop.vue";
import utils from '../../common/utils';
 import {mapActions} from 'vuex'
//默认的时间格式
const DATE_FORMAT = "YYYY-MM-DD HH:mm";
export default {
  data() {
    return {
      processCustomerPrompt:true,
      bcModels:[],
      modelType: ["iPad", "Protable"], //类型选择
      processList: [], // 制程数据
      //////////////////////界面渲染参数//////////////
      modelName: "",
      upccode: "",
      partNo: "",

      ///////////////////传递给服务端参数//////////////
      partId: "",
      startTime: "",
      endTime: "",

      ///////////////////服务端数据接口返回数据参数//////////////
      processList: [], // 制程数据

      //////////////////界面逻辑控制参数//////////////

      selectActive: false,
      showSelectProcessPanel: false, // 是否显示“选择制程”面板
      showNoDataICon: false, // 显示数据不为0的数据有的时候显示

      beforeTime: "",

      //界面上时间控件的时间
      startControlTime: "",
      endControlTime: "",

      isInSearching: false, //是否正处在查询状态
      showDrag: false, // 是否弹窗提示异步加载任务
      tickNumber: 0, //定时器的秒数显示
      timer: null, //loading定时器
      errorMsg: "", //错误信息
      showH5Title: true, // 是否显示H5的头部，默认显示
      activeIndex: 0, //类型索引
      typeValue: "", //类型属性值
      modeldata:{},  //机种数据
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
           self.goBack();
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
        text: "查询", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        onSuccess: function(result) {
           self.doSearch();
        },
      });
    
   

    if (self.$store.state.processCustomerType) {
      self.typeValue = this.$store.state.processCustomerType;
      self.activeIndex = this.$store.state.processCustomerIndex;
    } else {
      self.typeValue = "iPad";
      self.activeIndex = 0;
    }
      
    if (Object.keys(self.$store.state.processCustomerItem).length != 0) {
      self.bcModels.push(self.$store.state.processCustomerItem);
    } else {
      self.getinitModel();
    }
    // this.showDrag = true;
   
    this.Cache = Cache.create("processCustomerInformation");

    ////////////////////////////////ASYNC异步任务跳转过来/////////////////
    if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // 如果有缓存异步数据
      let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
      asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
      asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
     
      //原传递给服务端的参数
      this.bcModels=[];
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
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
      this.$store.commit('SET_PROCESSCUSTOMER_ITEM',items);
      this.bcModels.push(items);

      //将制程数据渲染到界面
      this.processList = asyncData.traceResult.data; // 缓存的数据
     
      //控制是否显示“选择制程”面板
      this.showSelectProcessPanel = true;
      this.renderNoneZeroProcessList();

      if (this.processList.length == 0) {
        this.errorMsg = "没有数据";
      }

      //缓存制程数据
      this.Cache.put("processList", this.processList).store();
    } else {
      /////////////////////////////////////////////////NORMAL正常的页面流////////////////////////////////////////////
      //默认时间设置

      //如果缓存中有最近一次设置的时间，则用最近一次的时间，否则用当前时间，采用默认时间规则
      this.startTime = this.Cache.get("startTime");
      this.endTime = this.Cache.get("endTime");
      this.beforeTime = moment((moment().format("X") - 7200) * 1000).format(
        DATE_FORMAT
      );
      // var moment = moment();
      this.startTime =
        this.startTime ||
        moment()
          .subtract(moment().hours() < 2 ? 1 : 0, "days")
          .hour(0)
          .minute(0)
          .format(DATE_FORMAT); //小于当天2点，开始时间挪到昨天
      this.endTime =
        this.endTime ||
        moment()
          .subtract(2, "hour")
          .format(DATE_FORMAT);
       if (sessionStorage.getItem("queryPartId")) {
        this.queryPartId =  sessionStorage.getItem("queryPartId");
      }
      //机种ID从机种选择界面传递过来
      // this.partId = this.$route.query.partId || "6000000086";

      //界面渲染参数,从机种选择界面传递过来或者从首页进入，首页进入时设置默认数值
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
      //最近一次制程的缓存列表
      var cProcessList = this.Cache.get("processList");
      if (cProcessList) {
      cProcessList.length>0? this.showSelectProcessPanel = true: this.showSelectProcessPanel = false;
        
        this.processList = cProcessList;
         this.renderNoneZeroProcessList();
       
      }
    }

    // 时间控件上显示默认时间，时间控制需要通过格林时间来设置
    var sControlTime = moment(this.startTime).format(); // 格林时间时
    var eControlTime = moment(this.endTime).format(); // 格林时间时
    this.startControlTime = eControlTime.substring(
      0,
      sControlTime.indexOf("+")
    );
    this.endControlTime = eControlTime.substring(0, eControlTime.indexOf("+"));          
    
    if( localStorage.getItem('processCustomerPrompt') ==='false'
     ){
        this.processCustomerPrompt=false;
    }
   
  },

  methods: {
     handlePrompt(){
        this.processCustomerPrompt=false;
        localStorage.setItem('processCustomerPrompt',this.processCustomerPrompt);
    },
     selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_PROCESSCUSTOMER_TYPE", item);
      this.$store.commit("SET_PROCESSCUSTOMER_INDEX", index);
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
             this.$store.commit('SET_PROCESSCUSTOMER_ITEM',data[0]);
          } else {
            this.errorMsg = msg;
          }
        });
    },
     ...mapActions([
        'deleteProcessCustomerList'
    ]),
    ///////////////////////////////////////////////////////跳转方法入口///////////////////////////////////////////////
    // 返回上一页
    goBack() {
      this.deleteProcessCustomerList();
       this.$store.commit("SET_SALERATIONODATA",false);
      if(sessionStorage.getItem('processList3') || sessionStorage.getItem('processList3All')){
        sessionStorage.removeItem('processList3');
        sessionStorage.removeItem('processList3All');
      }
      //离开本页面，清除掉制程的缓存
      this.Cache.del("processList").store();      

        //跳转到首页
      if(this.$route.query.asyncFlag){
          this.$router.push({
            path: "/asyncTaskList",
        });
      }else{
          this.$router.push({
              path: "/index",
          });
      }

      this.processCustomerPrompt=false;
      localStorage.setItem('processCustomerPrompt',this.processCustomerPrompt);
      
    },
     cancelAsync(){
      this.showDrag = false;
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    // 去往选择机制页面
    tochooseModel() {
      this.Cache.put("startTime", this.startTime)
        .put("endTime", this.endTime)
        .del("processList")
        .store();

      this.$router.push({
        path: "/badModelList",
        query: {
          path: this.$route.query.path, // 判断是哪个流程进来的
          type: this.typeValue,
          target:"processCustomerInformation"
        }
      });

    },

    // 点击制程，去往客户信息流程选择站点页面
    goChooseTerminal(item,partId) {
      this.Cache.put("modelName", this.$route.query.modelName)
        .put("upccode", this.$route.query.upccode)
        .put("partNo", this.$route.query.partNo)
        .store();
         if(sessionStorage.getItem('siteList3All')&&sessionStorage.getItem('siteList3')){
           sessionStorage.removeItem('siteList3All')
           sessionStorage.removeItem('siteList3')
           this.siteList=[]
       }
       this.$route.query.partId = partId;
       this.$route.query.modelName= this.bcModels[0].modelName;
       this.$route.query.upccode=this.bcModels[0].partName +'  '+this.bcModels[0].colorEn;
       this.$route.query.partNo=this.bcModels[0].partNo;
      this.$router.push({
        path: "terminalCustomerInformation",
        query: {
          processId: item.processId, // 制程ID
          partId: this.$route.query.partId, // 机种ID
          operateId: item.operateId, // 制程类型
          processDesc: item.processDesc, // 制程中文描述
          processName: item.processName, // 制程名
          totalCount: item.totalCount, // 客户信息总数
          modelName: this.$route.query.modelName, //机种名
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo, // 机种号码
          sTime: this.startTime, // 开始时间（传参用）
          eTime: this.endTime, // 开始时间（传参用）
          startTime: this.startTime, // 开始时间
          endTime: this.endTime, // 结束时间
          modelType:this.typeValue
        }
      });

    },

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////界面渲染////////////////////////////////////////////////////

    //设置开始时间控件的时间值
    setupStartControlTime() {
      this.startTime = this.startControlTime
        ? moment(this.startControlTime).format(DATE_FORMAT)
        : "";

      (this.processList = []), (this.showSelectProcessPanel = false);
      this.Cache.del("processList").store();
    },

    // 设置结束时间控件的时间值
    setupEndControlTime() {
      this.endTime = this.endControlTime
        ? moment(this.endControlTime).format(DATE_FORMAT)
        : "";

      (this.processList = []), (this.showSelectProcessPanel = false);
      this.Cache.del("processList").store();
    },

    // 渲染全部制程的数据
    renderAllProcessList() {
      // this.selectActive = true;
      // this.processList = this.Cache.get("processList") || [];
      // this.showNoDataICon = this.processList.length == 0;
      // console.log(this.processList,'全部制程数据')

        this.selectActive = true;
      if (sessionStorage.getItem("processList3All")) {
        this.processList = [];
        this.processList = JSON.parse(sessionStorage.getItem("processList3All"));
       
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
       
         if(this.processList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
      }
    },

    // 渲染结果不为0的制程数据
    renderNoneZeroProcessList() {
      // this.selectActive = false;
      // var cProcessList = this.Cache.get("processList") || [];
      // this.showSelectProcessPanel = cProcessList.length > 0;
      //  console.log(cProcessList,'全部制程数据')
      // if (!this.showSelectProcessPanel) {
      //   return;
      // }

      // let noneZeroArr = [];
      // this.processList.forEach((val, index) => {
      //   if (val.totalCount != "0") {
      //     noneZeroArr.push(val);
      //   }
      // });

      // //清空制程列表，并且显示非0的制程
      // this.processList = noneZeroArr;
      // this.showNoDataICon = this.processList.length == 0;


       this.selectActive = false;
      let newArray = [];
      this.processList.forEach((val, index) => {
        if (val.totalCount != "0") {
          newArray.push(val);
        }
      });
      this.processList = [];
      this.processList = newArray;
       sessionStorage.setItem(
              "processList3",
              JSON.stringify(this.processList)
            );
            if(this.processList.length==0){
                this.showNoDataICon = true;
            }else{
               this.showNoDataICon = false;
            }
    },

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////计时器控制////////////////////////////////////////////////////

    startTick: function() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.tickNumber++;
      }, 1000);
    },
    endTick: function() {
      clearInterval(this.timer);
      this.tickNumber = 0;
    },

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

    //启动异步任务机制
    startAsyncTask: function() {
      // 发起异步请求
      const info = {
        tracePath: "processCustomerInformation",
        traceParams: {
          partId:this.bcModels[0].modelId,
          startTime: this.startTime,
          endTime: this.endTime
        },
        traceApi: "http://ks-rinse/rinse/queryCustomerInfoProcess.api",
        traceContext: {
          partNo: this.bcModels[0].partNo,
          modelName: this.bcModels[0].modelName,
          upccode: this.bcModels[0].partName,
          colorEn:this.bcModels[0].colorEn,
          title: "成品信息查询",
          partId: this.bcModels[0].modelId,  // 请求参数
          startTime: this.startTime, 
          endTime: this.endTime, 
        }
      };
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/sendAsynTask.api", info)
        .then(res => {
         
          if (res.code == 200) {
            // this.$store.commit("SET_COUNT", this.$store.state.count + 1);
            this.unreadData(); // 当天未读数量获取
          }
        });
    },
    // 当天未读数量请求
    unreadData() {
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/querySaDayCount.api")
        .then(res => {
         
          let { code, msg, data } = res;
          switch (code) {
            case 200:
              this.$store.commit("SET_COUNT", data);
              this.cancelAsync(); // 取消弹窗
              break;
          }
        });
    },

    // 点击查询按钮，开始查询
    doSearch() {

      //正在查询中就不需要再查
      // if (this.isInSearching) {
      //   return;
      // }
      //查询条件检测
      if (!this.startTime || !this.endTime) {
        this.errorMsg = "请重新选择时间";
        return;
      }
      const start = moment(this.startTime); // 开始日期
      const end = moment(this.endTime); // 结束日期
      if (moment.max(start, end) != end) {
        this.errorMsg = "开始时间不能大于结束时间";
        return;
      }

      //结束时间必须是当前时间的前2个小时
      var nowMoment = moment();
      var endMoment = moment(this.endTime); // 结束时间

      if (endMoment.add(2, "hours").isAfter(nowMoment)) {
        this.errorMsg = "结束时间前两小时暂无数据,请按提示查询";
        this.isInSearching = false;
        return;
      }

      //设置查询启动标识
      this.isInSearching = true;

      //重置界面状态
      this.Cache.del("processList").store();
      this.selectActive = false;
      this.processList = [];
      this.showSelectProcessPanel = true;
      this.showNoDataICon = false;

      //定时器准备
      this.startTick();

      //////////////////进入数据查询阶段/////////////////////////
      sessionStorage.setItem("queryPartId",this.bcModels[0].modelId);
      this.queryPartId = this.bcModels[0].modelId;
       if((this.bcModels[0].modelId).toString() == "" ){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      this.$axiosHttp
        .axiosPost("ks-rinse/rinse/queryCustomerInfoProcess.api", {
          partId: this.bcModels[0].modelId,
          startTime: this.startTime,
          endTime: this.endTime
        })
        .then(res => {
          // this.showDrag = true;
          this.isInSearching = false;
          this.endTick();

          let { code, msg, data } = res;

          switch (code) {
            case 200:
              {
                //对制程数据进行缓存
                this.processList = data;
                
                this.Cache.put("processList", this.processList);
                this.Cache.put("startTime", this.startTime)
                  .put("endTime", this.endTime)
                  .store();
                  sessionStorage.setItem(
                    "processList3All",
                    JSON.stringify(this.processList)
                  );
                //渲染界面
                this.renderNoneZeroProcessList();

                if (data.length == 0) {
                  this.errorMsg = "当前条件下没有数据";
                  return;
                }
              }
              break;

            case -404:
              {
                this.showDrag = true;
               
              }

              break;

            case 500: {
              this.errorMsg = "网络速度太慢，加载不出来";
              break;
            }

            case 10005:
            case 10002:
              this.errorMsg = "您的身份校验已过期，请重新登录";
              break;
            default: {
              this.errorMsg = res.msg;
            }
          }
        });
    }
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
  .no-data{
    margin-top: 0;
  }
 article .section .main .content-box{
    padding-bottom: 0;
  }
  .time-selects{
    min-height: 88px;
  }
  .inquire-list{
    top:20px;
  }
  .select-lists{
    top: 130px;
  }
  .select-jz{
    top: 210px;
  }
</style>




