<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                 <span class="icon icon-left"></span>
            </span>
            <h1>生产在制</h1>
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
                  <router-link to="/processProduction">
                    生产在制
                    </router-link>
                </li>
                <li >
                  <router-link to="/countStorePick">
                    unknown汇总数据
                  </router-link>
                </li>
                <li >
                  <router-link to="/compareStoreData">
                    汇总数据周对比
                  </router-link>
                </li>  
            </ul>
                    <div class="y_select" style="margin:0;border:1px solid rgba(0, 0, 0, 0.05)">
                        <span class="y_select-text">类型选择</span>
                        <div class="y_select-r" >
                            <div v-for="(item,index) in modelType" :key="index">
                                <label for="y_radio1"  :class="{'act':activeIndex == index}" @click="selecType(item,index)">{{item}}</label>                  
                            </div>
                        </div>
                    </div>
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
                            <span  class="s-time"   v-show="startTime" >{{ startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+startTime.split(' ')[1]}}</span>
                            <input type="datetime-local"  name="" id="" v-model="startDefaultTime" @change="chooseStartTime"> 
                        </div>
                      </li>
                      <li>
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time"   v-show="endTime">{{ endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+endTime.split(' ')[1]}}</span>
                              <input type="datetime-local"  name="" id="" v-model="endDefaultTime"  @change="chooseEndTime">                       
                        </div>
                        
                      </li> 
                    </ul>
                    
                    <div class="form">                                    
                        <h3 v-show="showSelectProcess" class="form-title">选择制程 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll('all')">全部</button><button :class="{active:!selectActive}" @click="filterData('noZero')">数量不为0</button></div></h3>                       
                        <p v-show="processList.length>0" class="y_down">
                          <span  class="y_down-text" v-show="asc" @click="handleAsc()">升序<i class="icon-sheng"  ></i></span>
                          <span class="y_down-text" v-show="desc"  @click="handleDesc()" >降序<i class="icon-next" ></i></span>
                        </p> 
                        <!-- <i class="icon-sheng" @click="handleAsc"></i> -->
                        <ul class="m-pro-list">
                          <li class="m-pro-list-item" v-for="(item,index) in processList" :key="index" @click="toChooseTerminal(item,queryPartId)" > 
                              <span class="type-icon " :class="{repar:item.operateId==1001,product:item.operateId==1006,inproducts:item.operateId==1008,warehouse:item.operateId==1004||1007||1009||1010,qc:item.operateId==1003,other:item.operateId==1005,pack:item.operateId==1002}"></span>
                              <div class="t-name">
                                <p class="en" v-text="item.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="item.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num">
                                <span class="num" v-text="item.production">80</span>
                                <span class="tex">在制总数</span>
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
          <div class="pop" v-show="processProductionPrompt">
            <!-- 我知道 -->
            <div class="ok"  @click="handlePrompt"></div>
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
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      processProductionPrompt:true,
      sendParams:"",
      asc:true,
      desc:true,
      bcModels:[],
      modelType: ["iPad", "Protable"], //类型选择
      processList: [], // 制程数据
      processListAll: [], // 制程数据
      showNoData: false, // 显示数据不为0的数据有的时候显示
      isWaiting: false,
      isWaitingProduction:false,
      number: 0,
      selectActive: false,
      showSelectProcess: false, // 选择制程
      startDefaultTime: '',
      endDefaultTime: '',
      flag: true,
      errorMsg: "", //错误信息
      startTime: "", // 开始时间 2018-01-30T11:00:52.738
      endTime: "", // 结束时间
      sTime: "", // 传给后台的实际开始时间
      eTime: "", // 传给后台的实际结束时间
      retryCount: 0,
      timer:null,
      showDrag: false, // 是否弹窗提示异步加载任务
      showH5Title: true,// 是否显示H5的头部，默认显示
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
        text: "生产在制", //控制显示文本，空字符串表示显示默认文本
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

   

    if (self.$store.state.processProductionType) {
      self.typeValue = this.$store.state.processProductionType;
      self.activeIndex = this.$store.state.processProductionIndex;
    } else {
      self.typeValue = "iPad";
      self.activeIndex = 0;
    }
      
    if (Object.keys(self.$store.state.processProductionItem).length != 0) {     
      self.bcModels.push(self.$store.state.processProductionItem);
    } else {
      self.getinitModel();
    }
    //  this.showDrag = true;

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
      this.$store.commit('SET_PROCESSPRODUCTION_ITEM',items); 
      this.bcModels.push(items);
      //将制程数据渲染到界面
      this.processList = asyncData.traceResult.data;  // 缓存的数据
         console.log(typeof asyncData.traceResult , '看看格式')
      //控制是否显示“选择制程”面板
       this.showSelectProcess = true;
      this.filterData();

      if (this.processList.length == 0) {
        this.errorMsg = "没有数据";
      }

    } else {
    this.getAllData();
    if (sessionStorage.getItem("s4") && sessionStorage.getItem("e4")) {
      this.startTime = sessionStorage.getItem("s4");
      this.endTime = sessionStorage.getItem("e4");
      this.sTime = moment(this.startTime).format("YYYY-MM-DD HH:mm");
      this.eTime = moment(this.endTime).format("YYYY-MM-DD HH:mm");
    } else {
        const nowselectTime = moment().format("X"); // 当前时间戳
        const zeroTime = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
        const zeroTimeTemp = moment(zeroTime).format('X'); // 当前0点时间戳
        const twoTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+2*60*60*1000); // 当天2点
        const twoTimeTemp = moment(twoTime).format('X'); // 当天2点时间戳
            if(nowselectTime>zeroTimeTemp&&nowselectTime<twoTimeTemp){
             this.startTime =  moment().subtract(1, 'days').hour(0).minute(0).format('YYYY-MM-DD HH:mm');
              }else{
             this.startTime = moment(zeroTime).format("YYYY-MM-DD HH:mm");
                
              }
          this.endTime = moment((nowselectTime-7200)*1000).format("YYYY-MM-DD HH:mm"); // 结束时间为当前时间的前两个个小时  时间戳*1000用moment转换

          console.log(this.endTime,'结束时间戳')
    }
      // 处理点击时间控件进去还是默认时间
       moment(this.startTime).format();
       moment(this.endTime).format();
      const cutsIndex = moment(this.startTime).format().indexOf('+');
      const cuteIndex = moment(this.endTime).format().indexOf('+');
    this.startDefaultTime= moment(this.startTime).format().substring(0,cutsIndex)
    this.endDefaultTime= moment(this.endTime).format().substring(0,cuteIndex)
    if (sessionStorage.getItem("processList5")) {      
      this.processList = JSON.parse(sessionStorage.getItem("processList5"));
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
    if(localStorage.getItem('processProductionPrompt') =='false'){
       this.processProductionPrompt=false;
    }
  },
  methods: {
      handlePrompt(){
        this.processProductionPrompt=false;
        localStorage.setItem('processProductionPrompt',this.processProductionPrompt);
      },
      handleAsc(){
          this.asc=false;
          this.desc=true;
          this.processList.sort((data0, data1)=>{
             if (data0.retentionQty - data1.retentionQty < 0){
                 return -1;
             } else if (data0.retentionQty - data1.retentionQty > 0){
                 return 1;
             } else {
                 return 0;
             }
          });
        
      },
      handleDesc(){
          this.desc=false;
          this.asc=true;
          this.processList.sort((data0, data1)=>{
             if (data0.retentionQty - data1.retentionQty > 0){
                 return -1;
             } else if (data0.retentionQty - data1.retentionQty < 0){
                 return 1;
             } else {
                 return 0;
             }
          });
      },
     selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_PROCESSPRODUCTION_TYPE", item);
      this.$store.commit("SET_PROCESSPRODUCTION_INDEX", index);
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
            this.$store.commit('SET_PROCESSPRODUCTION_ITEM',data[0]); 
          } else {
            this.errorMsg = msg;
          }
        });
    },
    ...mapActions([
        'deleteProProductionList'
    ]),
    // 返回上一页
    back() {
      this.deleteProProductionList(); 
      if(sessionStorage.getItem('processList5All')||sessionStorage.getItem('processList5')){
        sessionStorage.removeItem('processList5All')
        sessionStorage.removeItem('processList5') 
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
      this.processProductionPrompt=false;
      localStorage.setItem('processProductionPrompt',this.processProductionPrompt);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
     cancelAsync(){
      this.showDrag = false;
    },
    // 全部数据
    filterAll(data) {
      if(data =='all'){
          this.desc=true;
          this.asc=true;
      }
      this.selectActive = true;
      if (sessionStorage.getItem("processList5All")) {
        this.processListAll = JSON.parse(sessionStorage.getItem("processList5All"));
      }
        for(var i = 0; i<this.processListAll.length; i++){
          for(var j = 0; j<this.processList.length; j++){
            if(this.processListAll[i].processId==this.processList[j].processId){
            this.processListAll[i] = this.processList[j]
            }
          }
      }
      this.processList = this.processListAll;
      console.log(this.processList,'合并后的')
        if(this.processList.length==0){
              this.showNoData = true;
          }else{
              this.showNoData = false;
          }
           console.log(this.processList,'全部数据')
      
      
    },
    // 筛选有数据
    filterData(data) {
      if(data =='noZero'){
          this.desc=true;
          this.asc=true;
      }
      this.selectActive = false;
      let newArray = [];
       console.log(this.processList,'数据不为0，开始')
      //  if(sessionStorage.getItem('processList5')){
      //     this.processList = JSON.parse(sessionStorage.getItem("processList5"));
      //  }
      this.processList.forEach((val, index) => {
        if (val.production != "0") {
          newArray.push(val);
        }
      });
      this.processList = [];
      this.processList = newArray;
          if(this.processList.length==0){
              this.showNoData = true;
          }else{
              this.showNoData = false;
          }
        //  sessionStorage.setItem(
        //       "processList5",
        //       JSON.stringify(this.processList)
        //     );
           console.log(this.processList,'数据不为0')
          
    },
    getAllData(){
      console.log(this.$route.query.partId,'id2323')
      if(this.$route.query.partId==undefined){
       this.$route.query.partId='6000000086'
      }
       const info = {
        partId: this.$route.query.partId,
       
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceSort/queryProductionProcessAll.api", info)
        .then(res => {
          console.log(res,'全部数据')
          if(res.code==200){
            this.processListAll = res.data; // 全部数据
               sessionStorage.setItem(
                      "processList5All",
                      JSON.stringify(this.processListAll)
                    );
            console.log(this.processListAll,'全部数据数组')
          }else if (code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (code == -404) {
            this.errorMsg = "数据较大，请稍后重试";
          }else {
            this.errorMsg = res.msg;
          }
        })
    },
    // 去往选择机制页面
    tochooseModel() {
      sessionStorage.setItem("s4", this.startTime);
      sessionStorage.setItem("e4", this.endTime);
      this.$router.push({
        path: "badModelList",
        query: {
          path: this.$route.query.path, // 判断是哪个流程进来的
          type: this.typeValue,
          target:"processProduction",
          partId: 1
        }
      });
    
    },
    // 选择开始时间
    chooseStartTime() {
     if(this.startDefaultTime){
          this.startTime = moment(this.startDefaultTime).format("YYYY-MM-DD HH:mm");
        }else{
          this.startTime = ''
        }
         if(sessionStorage.getItem('processList5All')&&sessionStorage.getItem('processList5')){
        sessionStorage.removeItem('processList5All')
        sessionStorage.removeItem('processList5')
      }
        this.processList = [],
        this.showSelectProcess = false;
    },
    // 选择结束时间
    chooseEndTime() {
       if(this.endDefaultTime){
          this.endTime = moment(this.endDefaultTime).format("YYYY-MM-DD HH:mm");
      }else{
        this.endTime = ''
      }
       if(sessionStorage.getItem('processList5All')&&sessionStorage.getItem('processList5')){
        sessionStorage.removeItem('processList5All')
        sessionStorage.removeItem('processList5')
      }
       this.processList = [],
        this.showSelectProcess = false;
    },

    
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"processProduction",
          "traceParams" : {
                  partId:this.bcModels[0].modelId,
                  startTime: this.startTime,
                  endTime: this.endTime
                },
          "traceApi":"http://ks-trace/traceSort/queryProductionProcess.api",
          "traceContext":{
                  partNo: this.bcModels[0].partNo,
                  modelName: this.bcModels[0].modelName,
                  upccode: this.bcModels[0].partName,
                  colorEn:this.bcModels[0].colorEn,
                  title: "生产在制查询",
                  partId: this.bcModels[0].modelId,  // 请求参数
                  startTime: this.startTime, 
                  endTime: this.endTime, 
                
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
       this.selectActive = false;
        this.showNoData = false;
      if(!this.startTime || !this.endTime){
         this.errorMsg = '请重新选择时间'
         return;
       }
       if(sessionStorage.getItem('processList5All')&&sessionStorage.getItem('processList5')){
           sessionStorage.removeItem('processList5All')
           sessionStorage.removeItem('processList5')
           this.processList=[]
           this.showSelectProcess = false;
           
       }
     

      const start = moment(this.startTime).format("YYYY/MM/DD HH:mm"); // 开始日期
      const end = moment(this.endTime).format("YYYY/MM/DD HH:mm"); // 结束日期
      if (start > end) {
        this.errorMsg = "开始时间不能大于结束时间";
        return;
      }
        clearInterval(this.timer);
      this.timer= setInterval(() => {
          this.number = this.number + 1;
        }, 1000);
         this.isWaiting = true;
      sessionStorage.setItem("s4", this.startTime);
      sessionStorage.setItem("e4", this.endTime);
      sessionStorage.setItem("sTimes4", this.sTime);
      sessionStorage.setItem("eTimes4", this.eTime);
      this.isWaiting = true;
      
      // this.sTime = moment(this.startTime).format("YYYY-MM-DD HH:mm");
      // this.eTime = moment(this.endTime).format("YYYY-MM-DD HH:mm");
      sessionStorage.setItem("queryPartId",this.bcModels[0].modelId);
      this.queryPartId = this.bcModels[0].modelId;
       if((this.bcModels[0].modelId).toString() == "" ){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      const info = {
        partId: this.bcModels[0].modelId,
        startTime: this.startTime,
        endTime: this.endTime
      };
    
      this.$axiosHttp
        .axiosPost("ks-trace/traceSort/queryProductionProcess.api", info)
        .then(res => {
            // this.showDrag = true;
           this.filterData();
            clearInterval(this.timer);
            this.number = 0;
            this.isWaiting = false;
            let { code, msg, data } = res;
            if (code == 200) {
            this.processList = data;
            
            sessionStorage.setItem(
              "processList5",
              JSON.stringify(this.processList)
            );
            this.filterData('noZero');

            this.showSelectProcess = true;

            if (data.length == 0) {
               this.showNoData = true;
            }else{
               this.showNoData = false;
            }
          } else if (code == 500) {
            clearInterval(this.timer);
            this.number = 0;

            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (code == 10005 || res.code == 10002) {
            clearInterval(this.timer);
            this.number = 0;

            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (code == -404) {
            
             this.showDrag = true;
            
           
          } else {
            this.errorMsg = res.msg;
          }
        });
    },

    // 点击制程，去往生产在制流程选择站点页面
    toChooseTerminal(item,partId) {
      console.log(item,8888);
      sessionStorage.setItem("modelName5", this.$route.query.modelName);
      sessionStorage.setItem("upccode5", this.$route.query.upccode);
      console.log(this.$route.query.modelName, 333);
     
     if(sessionStorage.getItem('siteList5All')&&sessionStorage.getItem('siteList5')){
           sessionStorage.removeItem('siteList5All')
           sessionStorage.removeItem('siteList5')
           this.siteList=[]
       }
       this.$route.query.partId = partId;
       this.$route.query.modelName= this.bcModels[0].modelName;
       this.$route.query.upccode=this.bcModels[0].partName +'  '+this.bcModels[0].colorEn;
       this.$route.query.partNo=this.bcModels[0].partNo;
      this.$router.push({
        path: "terminalProduction",
        query: {
          processId: item.processId, // 制程ID
          partId: this.$route.query.partId, // 机种ID
          operateId: item.operateId, // 制程类型
          processDesc: item.processDesc, // 制程中文描述
          processName: item.processName, // 制程名
          production: item.production, // 生产在制总数
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
.inquire-list{
  top: 20px;
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
.failed .close,
.success .close {
  position: absolute;
  left: 50%;
  bottom: -62px;
  width: 30px;
  height: 30px;
  transform: translate3d(-50%, -50%, 0);
  background: url("../../assets/images/error.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.select-lists{
  top: 55px;
}
.select-jz{
  top: 140px;
}
.inquireri-date{
  top: 220px;
}
</style>


