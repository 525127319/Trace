<template>
  <div>
       <article> 
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>不良信息</h1>
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
                        <router-link to="/processBadInformation">
                         不良信息
                         </router-link>
                      </li>
                      <li > 
                        <router-link to="/badChart">
                         不良统计图
                        </router-link>
                      </li> 
                    </ul>
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
                            <span  class="s-time" v-show="startTime">{{ startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+startTime.split(' ')[1]}}</span>
                            <input type="datetime-local" name="" id="" v-model="startDefaultTime" @change="chooseStartTime"> 
                        </div>   
                      </li>
                      <li>
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time" v-show="endTime" >{{ endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+endTime.split(' ')[1]}}</span>
                              <input type="datetime-local" name="" id="" v-model="endDefaultTime"  @change="chooseEndTime">                       
                        </div>
                      </li>
                    </ul>
                    <div class="form" >
                        <h3 v-show="showSelectProcess"  class="form-title">选择制程 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>                       
                        <ul class="m-pro-list">
                          <li class="m-pro-list-item" v-for="(item,index) in processList" :key="index" @click="toChooseTerminal(item,queryPartId)" > 
                              <span class="type-icon " :class="{repar:item.operateId==1001,product:item.operateId==1006,inproducts:item.operateId==1008,warehouse:item.operateId==1004||1007||1009||1010,qc:item.operateId==1003,other:item.operateId==1005,pack:item.operateId==1002}"></span>
                              <div class="t-name">
                                <p class="en" v-text="item.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="item.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num">
                                <span class="num r" v-text="item.badnessCount">80</span>
                                <span class="tex">不良+报废</span>
                              </div>
                          </li>
                        </ul> 
                    </div>
                   <!-- 没有数据的时候显示 -->
                  <div v-show="showNoData" class="no-data"></div>
                </div>
            </section>
        </section>
     <popup :errorMsg="errorMsg"></popup>
     <waiting v-show="isWaiting" :number="number"></waiting>
     <asyncPop v-show="showDrag" ></asyncPop>
    </article>
          <div class="pop" v-show="processBadPrompt">
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
import moment from "moment";
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      processBadPrompt:true,
      bcModels:[],
      modelType: ["iPad", "Protable"], //类型选择
      processList: [], // 制程数据
      isWaiting: false,
      cover: false,
      selectActive: false,
      showSelectProcess: false, // 选择制程
      showNoData: false, // 显示数据不为0的数据有的时候显示
      startDefaultTime: '',
      endDefaultTime: '',
      error: "",
      number: 0,
      errorMsg: "", //错误信息
      startTime: "", // 开始时间 2018-01-30T11:00:52.738
      endTime: "", // 结束时间
      sTime: "", // 传给后台的实际开始时间
      eTime: "", // 传给后台的实际结束时间
      showDrag: false, // 是否弹窗提示异步加载任务
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
        text: "查询", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        onSuccess: function(result) {
           self.search();
        },
      });
     
    if (self.$store.state.badInformationType) {
      self.typeValue = this.$store.state.badInformationType;
      self.activeIndex = this.$store.state.badInformationIndex;
    } else {
      self.typeValue = "iPad";
      self.activeIndex = 0;
    }
      
    if (Object.keys(self.$store.state.badInformationItem).length != 0) {
      console.log(self.$store.state.badInformationItem, "参数");
      self.bcModels.push(self.$store.state.badInformationItem);
    } else {
      self.getinitModel();
    }
    
    
    // this.showDrag = true;

     ////////////////////////////////ASYNC异步任务跳转过来/////////////////
    if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // 如果有缓存异步数据      
      let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
      asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
      asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
      console.log(asyncData, "缓存数据的获取");
      console.log(asyncData.traceContext, "context");
      console.log(typeof asyncData);
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
      this.$store.commit('SET_BADINFORMATION_ITEM',items);
      this.bcModels.push(items);
      //将制程数据渲染到界面
      this.processList = asyncData.traceResult.data; // 缓存的数据
      console.log(typeof asyncData.traceResult, "看看格式");
      //控制是否显示“选择制程”面板
      this.showSelectProcess = true;
      this.filterData();

      if (this.processList.length == 0) {
        this.errorMsg = "没有数据";
      }

    } 
    else {
        if (sessionStorage.getItem("s2") && sessionStorage.getItem("e2")) {
          this.startTime = sessionStorage.getItem("s2");
          this.endTime = sessionStorage.getItem("e2");
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
        }
          // 处理点击时间控件进去还是默认时间
          moment(this.startTime).format();
          moment(this.endTime).format();
          const cutsIndex = moment(this.startTime).format().indexOf('+');
          const cuteIndex = moment(this.endTime).format().indexOf('+');
            this.startDefaultTime= moment(this.startTime).format().substring(0,cutsIndex)
            this.endDefaultTime= moment(this.endTime).format().substring(0,cuteIndex)
            if (sessionStorage.getItem("processList2")) {
              this.processList = JSON.parse(sessionStorage.getItem("processList2"));
            if(this.processList.length>0){
                this.showSelectProcess = true;
              }
             if (sessionStorage.getItem("queryPartId")) {
            this.queryPartId =  sessionStorage.getItem("queryPartId");
           }
            console.log( this.showNoDataICon,'fhdfhsdagasdgsdg');
            if(this.processList.length==0){
                this.showNoData = true;
               
            }else{
               this.showNoData = false;
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
    if(localStorage.getItem('processBadPrompt') =='false'){
       this.processBadPrompt=false;
    }       
  },
  methods: {
     handlePrompt(){
        this.processBadPrompt=false;
        localStorage.setItem('processBadPrompt',this.processBadPrompt);
      },
     //类型选择
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_BADINFORMATION_TYPE", item);
      this.$store.commit("SET_BADINFORMATION_INDEX", index);
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
            this.$store.commit('SET_BADINFORMATION_ITEM',data[0]);
          } else {
            this.errorMsg = msg;
          }
        });
    },
     ...mapActions([
        'deleteProBadList'
    ]),
    // 返回上一页
    back() {
       this.deleteProBadList();
       if(sessionStorage.getItem('processList2All')||sessionStorage.getItem('processList2')){
        sessionStorage.removeItem('processList2All')
        sessionStorage.removeItem('processList2')
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
      this.processBadPrompt=false;
      localStorage.setItem('processBadPrompt',this.processBadPrompt);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    cancelAsync(){
      this.showDrag = false;
    },
    // 去往选择机制页面
    tochooseModel() {
      sessionStorage.setItem("s2", this.startTime);
      sessionStorage.setItem("e2", this.endTime);
      this.$router.push({
        path: "badModelList",
        query: {
          path: this.$route.query.path, // 判断是哪个流程进来的
          type: this.typeValue,
          target:"processBadInformation"
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
         if(sessionStorage.getItem('processList2All')&&sessionStorage.getItem('processList2')){
        sessionStorage.removeItem('processList2All')
        sessionStorage.removeItem('processList2')
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
       if(sessionStorage.getItem('processList2All')&&sessionStorage.getItem('processList2')){
        sessionStorage.removeItem('processList2All')
        sessionStorage.removeItem('processList2')
      }
        this.processList = [],
        this.showSelectProcess = false;
    },
    // 全部数据
    filterAll() {
      this.selectActive = true;
      if (sessionStorage.getItem("processList2All")) {
        this.processList = [];
        this.processList = JSON.parse(sessionStorage.getItem("processList2All"));
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
      this.processList.forEach((val, index) => {
        if (val.badnessCount != "0") {
          newArray.push(val);
        }
      });
      this.processList = [];
      this.processList = newArray;
       sessionStorage.setItem(
              "processList2",
              JSON.stringify(this.processList)
            );
             if(this.processList.length==0){
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
        tracePath: "processBadInformation",
        traceParams: {
          partId: (this.bcModels[0].modelId).toString(),
          startTime: this.startTime,
          endTime: this.endTime
        },
        traceApi: "http://ks-trace/traceSort/queryBadnessInfoProcess.api",
        traceContext: {
          partNo: this.bcModels[0].partNo,
          modelName: this.bcModels[0].modelName,
          upccode: this.bcModels[0].partName,
          colorEn:this.bcModels[0].colorEn,
          title: "不良信息查询",
          partId: this.bcModels[0].modelId, // 请求参数
          // path: this.$route.query.path,
          startTime: this.startTime, // 请求参数
          endTime: this.endTime // 请求参数
        }
      };
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/sendAsynTask.api", info)
        .then(res => {
          console.log("异步请求查询res", res);
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



    // 点击查询按钮，出来制程数据
    search() {
       if(!this.startTime || !this.endTime){
         this.errorMsg = '请重新选择时间'
         return;
       }
       clearInterval(timer);
     this.selectActive = false;
       if(sessionStorage.getItem('processList2All')&&sessionStorage.getItem('processList2')){
           sessionStorage.removeItem('processList2All')
           sessionStorage.removeItem('processList2')
           this.processList=[]
           this.showSelectProcess = false;
           
       }
      const start = moment(this.startTime).format("YYYY/MM/DD HH:mm"); // 开始日期
      const end = moment(this.endTime).format("YYYY/MM/DD HH:mm"); // 结束日期
      if (start > end) {
        this.errorMsg = "开始时间不能大于结束时间";
        return;
      }
      sessionStorage.setItem("s2", this.startTime);
      sessionStorage.setItem("e2", this.endTime);
      sessionStorage.setItem("sTimes2", this.sTime);
      sessionStorage.setItem("eTimes2", this.eTime);
       sessionStorage.setItem("queryPartId",this.bcModels[0].modelId);
      this.queryPartId = this.bcModels[0].modelId;
      this.isWaiting = true;
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      this.sTime = moment(this.startTime).format("YYYY-MM-DD HH:mm");
      this.eTime = moment(this.endTime).format("YYYY-MM-DD HH:mm");
      if((this.bcModels[0].modelId).toString() == "" ){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      const info = {
        partId:this.bcModels[0].modelId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceSort/queryBadnessInfoProcess.api", info)
        .then(res => {
          //  this.showDrag = true; 
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
           this.filterData()
          let { code, msg, data } = res;
          if (code == 200) {
            this.processList = data;
            sessionStorage.setItem(
              "processList2All",
              JSON.stringify(this.processList)
            );
            this.showSelectProcess = true;
            this.filterData()
            if (data.length == 0) {
              this.errorMsg = "没有数据";
            }
          } else if (code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";

          } else if (code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (code == -404) {
            this.showDrag = true; 
          } else {
            this.errorMsg = res.msg;
          }
        });
    },

    // 点击制程，去往不良信息流程选择站点页面
    toChooseTerminal(item,partId) {
      console.log(item,'item');
      sessionStorage.setItem("modelName2", this.$route.query.modelName);
      sessionStorage.setItem("upccode2", this.$route.query.upccode);
      if(sessionStorage.getItem('siteList2All')&&sessionStorage.getItem('siteList2')){
           sessionStorage.removeItem('siteList2All')
           sessionStorage.removeItem('siteList2')
           this.siteList=[]
       }
        this.$route.query.partId = partId;
       this.$route.query.modelName= this.bcModels[0].modelName;
       this.$route.query.upccode=this.bcModels[0].partName +'  '+this.bcModels[0].colorEn;
       this.$route.query.partNo=this.bcModels[0].partNo;
      this.$router.push({
        path: "terminalBadInformation",
        query: {
          processId: item.processId, // 制程ID
          partId:this.$route.query.partId, // 机种ID
          operateId: item.operateId, // 制程类型
          processDesc: item.processDesc, // 制程中文描述
          processName: item.processName, // 制程名
          badnessCount: item.badnessCount, // 不良信息总数
          modelName: this.$route.query.modelName, //机种名
          upccode: this.$route.query.upccode,  //upccode
          partNo: this.$route.query.partNo, // 机种号码
          sTime: this.startTime, // 开始时间（传参用）
          eTime: this.endTime, // 开始时间（传参用）
          startTime: this.startTime, // 开始时间
          endTime: this.endTime, // 结束时间
          modelType:this.typeValue,
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
.y_section-nav{
    width: 100%;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    padding: 0 0.75rem;
    min-height: 52px;
}
.y_section-nav > li{
    flex: 1;
    height: 1.75rem;
    line-height: 1.75rem;
    text-align: center;
    margin-top: 12px;
    color: #ff7400;
    border: 1px solid #ff7400;
    margin-left: -1px;
    font-size: 0.75rem;
    margin-bottom: 12px;
}
.select-lists{
  top: 55px;
}
.select-jz{
  top: 155px;
}
.inquireri-date{
  top: 260px;
}
.inquire-list{
  top: 20px;
}
</style>
