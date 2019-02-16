<template>
    <article>
        <nav class="nav"  v-show="showH5Title">
            <span class="left"  @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>投入产出</h1>
            <span class="right" @click="handleSearch()">
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section y_section">
          <div class="y_overflow-main">
          <ul class="y_section-nav">
            <li  >
                <router-link to="/processInputOut">
                  投入产出
                </router-link>
            </li>
            <li class="active">
                <router-link to="/manyModelYield">
                  机种良率
                </router-link>
            </li>
            </ul>
            <ul class="gray-list y_nav">
                <li>
                    <div class="y_select" style="background:#f4f4f4;margin:0;padding:0;height:42px;line-height:42px;">
                        <span class="y_select-text">类型选择</span>
                        <div class="y_select-r">
                                <div v-for="(item,index) in modelType" :key="index">
                                <label for="y_radio1"  :class="{'act':activeIndex == index}" @click="selecType(item,index)">{{item}}</label>                  
                            </div>
                        </div>
                    </div>
                </li>
                <li @click="goModelList">
                      <span class='key'>机种选择</span>
                        <div class="y_ov">
                          <ul class="value"  v-for="(item,index) in bcModels" :key="index">
                            <li>
                                <span class="y_text">{{item.modelName}} {{item.partName}} {{item.colorEn}}</span>
                                <p class="gray-list-text">{{item.partNo}}</p>
                                <span class="icon icon-right y_span"></span>
                            </li>
                            </ul>
                        </div> 
                  </li>
                  <li>
                    <span class='key'>开始日期</span>
                    <span class="tiem"  v-text="startTime">年/月/日</span>
                    <input class="value" type="date" v-model="startTime"  @change="chooseStartTime" >
                </li>
                <li>
                    <span class='key'>结束日期</span>
                    <span class="tiem"  v-text="endTime">年/月/日</span>
                    <input class="value" type="date" v-model="endTime"  @change="chooseEndTime" >
                </li>
            </ul>
          </div>
            <div v-if="showNoDataICon" class="no-data"></div>
                 <div class="output">
                    <div id="output"></div>
                    <ul class="output-data" v-for="(item,index) in countTotalAndYield" :key="index" >
                        <li >
                            <span class="bg_g45">First Pass</span>
                            <span>{{(item.firstPassYields).toFixed(2)}}%</span>
                            <span>{{item.reportTotals}}</span>
                        </li>
                        <li>
                            <span class="bg_g32">Final Pass</span>
                            <span >{{(item.finalPassYields).toFixed(2)}}%</span>
                            <span>{{item.reportAndReworks}}</span>
                        </li>
                        <li>
                            <span class="bg_g42">Reworked</span>
                            <span>{{(item.reworkYields).toFixed(2)}}%</span>
                            <span>{{item.reworkTotals}}</span>
                        </li>
                        <li>
                            <span class="bg_rff">Scrappend</span>
                            <span>{{(item.scrappedYields).toFixed(2)}}%</span>
                            <span>{{item.scrappeds}}</span>
                        </li>
                        <li>
                            <span class="bg_fc0">WIP</span>
                            <span>{{(item.wipYields).toFixed(2)}}%</span>
                            <span>{{item.wips}}</span>
                        </li>
                        <li>
                            <span class="bg_b42">Unknown</span>
                            <span>{{(item.unknownYields).toFixed(2)}}%</span>
                            <span>{{item.unknowns}}</span>
                        </li>
                    </ul>
                 </div>
             <popup :errorMsg="errorMsg" ></popup>
            <waiting v-show="isWaiting" :number="number"></waiting>
             <asyncPop v-show="showDrag" ></asyncPop>
        </section>
    </article>
</template>

<script>
let echarts = require("echarts");
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import utils from "../../common/utils.js";
import asyncPop from "../base/asyncPop.vue";
import moment from "moment";
import {mapActions, mapMutations,mapGetters} from 'vuex'
export default {
  components: {
    popup,
    waiting,
    asyncPop
  },
  data() {
    return {
      showDrag: false, // 是否弹窗提示异步加载任务 
      yieldList: [],
      bcModels: [],
      showH5Title: true, // 是否显示H5的头部，默认显示
      isShowEchart: false,
      number: 0,
      showNoDataICon: false, // 显示数据不为0的数据有的时候显示
      isWaiting: false,
      activeIndex: 0,
      typeValue: "",
      modelType: ["iPad", "Protable"],
      startTime: "",
      endTime: "",
      errorMsg: "",
      firstPass: [],
      finalPass: [],
      reworked: [],
      scrappend: [],
      wip: [],
      unknown: [],
      reportTimeArr: [],
      countTotalAndYield:[],
      backData:[],
      manyYieldDatas:[],
      output:null,
    };
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
        self.back();
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
      text: "投入产出", //控制显示文本，空字符串表示显示默认文本
      textColor: "#212121", //字体颜色  16进制，关键字
      url: "", //控制标题文本，空字符串表示显示默认文本
      backcoler: "#ffffff" //背景色
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
        self.handleSearch();
      }
    });
     if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // 如果有缓存异步数据      
      let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
      asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
      asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
     
      //原传递给服务端的参数
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
      this.$store.commit("SET_MANYMODELYIELD_STARTTIME", this.startTime);
      this.$store.commit("SET_MANYMODELYIELD_ENDTIME", this.endTime);
      let items={};
      items.modelName = asyncData.traceContext.modelName;
      items.partName = asyncData.traceContext.upccode;
      items.partNo = asyncData.traceContext.partNo;
      items.colorEn =asyncData.traceContext.colorEn;      
      items.modelId = asyncData.traceContext.partId;
      this.typeValue=asyncData.traceContext.modelType
      this.activeIndex=asyncData.traceContext.activeIndex;
      this.$store.commit("SET_MANYMODELYIELD_TYPE", this.typeValue);
      this.$store.commit("SET_MANYMODELYIELD_INDEX", this.activeIndex);
      this.$store.commit('SET_MANYMODELYIELD_ITEM',items); 
      this.bcModels.push(items);
      //将制程数据渲染到界面
      this.backData = asyncData.traceResult.data; // 缓存的数据
            let st =new Date(this.startTime).getTime()/1000
            let ed = new Date(this.endTime).getTime()/1000;
            let days =(ed-st)/86400+1;
            let countTotal={};
            let countYield={};
            countTotal['reportTotals']=0;
            countTotal['reportAndReworks'] =0;
            countTotal['reworkTotals'] =0;
            countTotal['scrappeds']=0;
            countTotal['wips']=0;
            countTotal['unknowns']=0;

            countYield['firstPassYields'] =0;
            countYield['finalPassYields'] =0;
            countYield['reworkYields'] =0;
            countYield['scrappedYields'] =0;
            countYield['wipYields'] =0;
            countYield['unknownYields'] =0;

            this.backData.forEach(item =>{
               countTotal['reportTotals'] += item.reportTotal;
               countTotal['reportAndReworks']+=(item.reportTotal+item.reworkTotal);
               countTotal['reworkTotals'] +=item.reworkTotal;
               countTotal['scrappeds']+=item.scrapped;
               countTotal['wips'] +=item.wip;
               countTotal['unknowns']+=item.unknown;

            });
            this.backData.forEach(item =>{
              countYield['firstPassYields'] +=item.firstPassYield;
              countYield['finalPassYields'] +=item.finalPassYield;
              countYield['reworkYields'] +=item.reworkYield;
              countYield['scrappedYields'] +=item.scrappedYield;
              countYield['wipYields'] += item.wipYield;
              countYield['unknownYields'] +=item.unknownYield;
            })
          
            for(let key in countYield){
              if(countYield[key] != 0 && this.backData.length>1){
                  countYield[key] =(countYield[key]/days)*100;
              }else{
                  countYield[key] =countYield[key]*100;
              }  
            }
            let totalAndYield= Object.assign({},countYield,countTotal);
            this.countTotalAndYield.push(totalAndYield);
            this.yieldList = this.backData;
            this.yieldList.forEach(item =>{
                item.reportTime =new Date(item.reportTime).getTime()
            });
            this.yieldList.sort((data0, data1)=>{
             if (data0.reportTime - data1.reportTime < 0){
                 return -1;
             } else if (data0.reportTime - data1.reportTime > 0){
                 return 1;
             } else {
                 return 0;
             }
          });
          this.$store.commit("SET_MANYMODELYIELD_LIST", this.yieldList);
          this.$store.commit("SET_COUNTTOTALANDYIELD", this.countTotalAndYield);

          //控制是否显示“选择制程”面板
          //  this.showSelectProcess = true;
          //  this.filterData();
          // if (this.processList.length == 0) {
          //   this.errorMsg = "没有数据";
          // }
          // debugger;
     }else{
       if (self.$store.state.modelYieldType) {
          self.typeValue = this.$store.state.modelYieldType;
          self.activeIndex = this.$store.state.modelYieldIndex;
        } else {
          self.typeValue = "iPad";
          self.activeIndex = 0;
        }
        if(
        this.$store.state.modelYieldStTime &&
        !this.$store.state.modelYieldEdTime
        ) {
          self.startTime = this.$store.state.modelYieldStTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.endTime = moment(day).format("YYYY-MM-DD");
        } else if (
          !this.$store.state.modelYieldStTime &&
          this.$store.state.modelYieldEdTime
        ) {
          self.endTime = this.$store.state.modelYieldEdTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.startTime = moment(day).format("YYYY-MM-DD");
        } else if (
          this.$store.state.modelYieldStTime &&
          this.$store.state.modelYieldEdTime
        ) {
          self.startTime = this.$store.state.modelYieldStTime;
          self.endTime = this.$store.state.modelYieldEdTime;
        } else {
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.startTime = moment(day).format("YYYY-MM-DD");
          self.endTime = moment(day).format("YYYY-MM-DD");
        }

        if (Object.keys(self.$store.state.modelYieldItem).length != 0) {
          self.bcModels.push(self.$store.state.modelYieldItem);
        } else {
          self.getInitModel();
        }
     }
     
  },
  mounted() {
    if(this.$route.query.asyncFlag){
        this.initEcharts();
    }
    if (this.$store.state.modelYieldList.length > 0  && this.$store.state.countTotalAndYield.length>0) {
      // && this.$store.state.countTotalAndYield.length>0
       this.yieldList = this.$store.state.modelYieldList;
       this.countTotalAndYield =this.$store.state.countTotalAndYield;
       this.initEcharts();
    }
   
     
    
  },
  methods: {
    chooseStartTime() {
      this.$store.commit("SET_MANYMODELYIELD_STARTTIME", this.startTime);
    },
    chooseEndTime() {
      this.$store.commit("SET_MANYMODELYIELD_ENDTIME", this.endTime);
    },
    ...mapActions([
        'deleteProInputOutList'
    ]),
    // 返回上一页
    back() {
      this.deleteProInputOutList();
      if(this.$route.query.asyncFlag){
          this.$router.push({
            path: "/asyncTaskList",
        });
      }else{
          this.$router.push({
              path: "/index",
          });
      }
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_MANYMODELYIELD_TYPE", item);
      this.$store.commit("SET_MANYMODELYIELD_INDEX", index);
      this.getInitModel();
    },
    // 去往选择机制页面
    goModelList() {
      this.$router.push({
        path: "/singleModelList",
        query: {
          path: "manyModelYield",
          type: this.typeValue
        }
      });
    },
    //初始化机种
    getInitModel() {
      let self = this;
      self.bcModels = [];
      let params = { type: self.typeValue, keyWord: "" };
      this.$axiosHttp
        .axiosPost("ks-newrep/ReportTool/findModelByTypeName.api", params)
        .then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            self.bcModels.push(data[0]);
             this.$store.commit('SET_MANYMODELYIELD_ITEM',data[0]); 
          } else {
            this.errorMsg = msg;
          }
        });
    },
    handleSearch() {
      if (this.startTime == "" || this.endTime == "") {
        this.errorMsg = "请输入开始时间或结束时间";
        return;
      }
      if (this.startTime && this.endTime) {
        let stTime = new Date(this.startTime).getTime();
        let endTime = new Date(this.endTime).getTime();
        if (endTime < stTime) {
          this.errorMsg = "结束时间不能大于开始时间";
          return;
        }
      }
       if((this.bcModels[0].modelId).toString() == "" ){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      let params = {
        partId: this.bcModels[0].modelId,
        startTime: this.startTime,
        endTime: this.endTime
      };
     
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);

      this.isWaiting = true;
      this.$axiosHttp
        .axiosPost(
          "ks-newrep/InputOutputYield/findReportPartYieldVo.api",
          params
        )
        .then(res => {
          // this.showDrag = true; 
          this.countTotalAndYield=[];
          this.yieldList = [];
          this.firstPass = [];
          this.reportTimeArr = [];
          this.finalPass = [];
          this.reworked = [];
          this.scrappend = [];
          this.wip = [];
          this.unknown = [];
          this.showNoDataICon = false;
          this.number = 0;
          this.isWaiting = false;
          let { code, msg, data } = res;
          if (code == 200) {
            this.backData=data;

            sessionStorage.setItem("dateYields",JSON.stringify(data));

            // this.$store.commit("SET_MANYYIELD_DATA", data);
            //console.log(this.$store.state.manyYieldData,"aaaa");
            let st =new Date(this.startTime).getTime()/1000
            let ed = new Date(this.endTime).getTime()/1000;
            let days =(ed-st)/86400+1;
            let countTotal={};
            let countYield={};
            countTotal['reportTotals']=0;
            countTotal['reportAndReworks'] =0;
            countTotal['reworkTotals'] =0;
            countTotal['scrappeds']=0;
            countTotal['wips']=0;
            countTotal['unknowns']=0;

            countYield['firstPassYields'] =0;
            countYield['finalPassYields'] =0;
            countYield['reworkYields'] =0;
            countYield['scrappedYields'] =0;
            countYield['wipYields'] =0;
            countYield['unknownYields'] =0;
           
           this.backData.forEach(item =>{
               countTotal['reportTotals'] += item.reportTotal;
               countTotal['reportAndReworks']+=(item.reportTotal+item.reworkTotal);
               countTotal['reworkTotals'] +=item.reworkTotal;
               countTotal['scrappeds']+=item.scrapped;
               countTotal['wips'] +=item.wip;
               countTotal['unknowns']+=item.unknown;
            });
           this.backData.forEach(item =>{
              countYield['firstPassYields'] +=item.firstPassYield;
              countYield['finalPassYields'] +=item.finalPassYield;
              countYield['reworkYields'] +=item.reworkYield;
              countYield['scrappedYields'] +=item.scrappedYield;
              countYield['wipYields'] += item.wipYield;
              countYield['unknownYields'] +=item.unknownYield;
            })
            for(let key in countYield){
              if(countYield[key] != 0 && data.length>1){
                  countYield[key] =(countYield[key]/days)*100;
              } else{
                  countYield[key] =countYield[key]*100;
              }
            }
            let totalAndYield= Object.assign({},countYield,countTotal);
            this.countTotalAndYield.push(totalAndYield);
            console.log(this.countTotalAndYield,'this.countTotalAndYield');
            this.yieldList = this.backData;
            this.yieldList.forEach(item =>{
                item.reportTime =new Date(item.reportTime).getTime()
            });
            this.yieldList.sort((data0, data1)=>{
             if (data0.reportTime - data1.reportTime < 0){
                 return -1;
             } else if (data0.reportTime - data1.reportTime > 0){
                 return 1;
             } else {
                 return 0;
             }
          });
            if (this.backData == null || this.backData.length == 0) {
              this.showNoDataICon = true;
            } else {
              this.initEcharts();
            }
            this.$store.commit("SET_MANYMODELYIELD_LIST", this.yieldList);
            this.$store.commit("SET_COUNTTOTALANDYIELD", this.countTotalAndYield);
          } else if(code ==-404){
              this.showDrag = true; 
          }else{
              this.errorMsg = msg;
          }
          clearInterval(timer);
        });
    },
     cancelAsync(){
      this.showDrag = false;
    },
     //启动异步任务机制
    startAsyncTask: function() {
      // 发起异步请求
      const info = {
        tracePath: "/manyModelYield",
        traceParams: {
          partId: (this.bcModels[0].modelId).toString(),
          startTime:this.startTime,
          endTime:this.endTime
        },
        traceApi: "http://ks-newrep/InputOutputYield/findReportPartYieldVo.api",
        traceContext: {
          partNo:this.bcModels[0].partNo,
          colorEn: this.bcModels[0].colorEn,
          modelName: this.bcModels[0].modelName,
          upccode: this.bcModels[0].partName,
          title: "机种良率查询",
          partId: this.bcModels[0].modelId, // 请求参数
          modelType:this.typeValue,
          startTime: this.startTime, // 请求参数
          endTime: this.endTime, // 请求参数
          activeIndex:this.activeIndex
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
    initEcharts: function() {
      const self = this;
      this.output = echarts.init(document.getElementById("output"));
    
      if (this.yieldList.length > 0) {
        this.yieldList.forEach(item => {
          item.reportTime = moment(new Date(item.reportTime)).format("YYYY-MM-DD");
          this.reportTimeArr.push(item.reportTime.replace(/-/g,'/'));
          let total =
            item.reportTotal +
            item.reportTotal +item.reworkTotal +
            item.reworkTotal +
            item.scrapped +
            item.wip +
            item.unknown; 
          this.firstPass.push((item.reportTotal / total * 100).toFixed(2));
          this.finalPass.push(
            ((item.reportTotal + item.reworkTotal) / total * 100).toFixed(2)
          );
          this.reworked.push((item.reworkTotal / total * 100).toFixed(2));
          this.scrappend.push((item.scrapped / total * 100).toFixed(2));
          this.wip.push((item.wip / total * 100).toFixed(2));
          this.unknown.push((item.unknown / total * 100).toFixed(2));
        });
      }
        let setEnd =0;
        let setBarWidth = 0;
        if(this.reportTimeArr.length >= 1 && this.reportTimeArr.length <= 11){
          setBarWidth=30;
          setEnd = 100;
        }else if(this.reportTimeArr.length >=12 && this.reportTimeArr.length < 14){
          setBarWidth=30;
          setEnd = 87;
        } else if(this.reportTimeArr.length >=14 && this.reportTimeArr.length < 16){
          setBarWidth=30;
          setEnd = 74.5;
        } 
        else if(this.reportTimeArr.length >= 16 && this.reportTimeArr.length < 18){
          setBarWidth=30;
          setEnd = 65;
        } else if(this.reportTimeArr.length >= 18 && this.reportTimeArr.length < 20){
          setBarWidth=30;
          setEnd = 56;
        }else if(this.reportTimeArr.length >= 20 && this.reportTimeArr.length < 22){
          setBarWidth=30;
          setEnd = 50;
        }else if(this.reportTimeArr.length >= 22 && this.reportTimeArr.length <24){
          setBarWidth=30;
          setEnd = 46;
        }else if(this.reportTimeArr.length >= 24 && this.reportTimeArr.length <26){
          setBarWidth=30;
          setEnd = 43;
        }else if(this.reportTimeArr.length >= 26 && this.reportTimeArr.length <29){
          setBarWidth=30;
          setEnd = 38;
        }else if(this.reportTimeArr.length >= 29 && this.reportTimeArr.length <32){
          setBarWidth=30;
          setEnd = 34.5;
        } else if(this.reportTimeArr.length >= 32 && this.reportTimeArr.length <35){
          setBarWidth=30;
          setEnd = 31.5;
        }else if(this.reportTimeArr.length >= 35 && this.reportTimeArr.length <39){
          setBarWidth=30;
          setEnd = 28;
        }else if(this.reportTimeArr.length >= 39 && this.reportTimeArr.length <43){
          setBarWidth=30;
          setEnd = 25;
        }else if(this.reportTimeArr.length >= 43 && this.reportTimeArr.length <47){
          setBarWidth=30;
          setEnd = 23;
        }else if(this.reportTimeArr.length >=47 && this.reportTimeArr.length <51){
          setBarWidth=30;
          setEnd = 21;
        }else if(this.reportTimeArr.length >=51 && this.reportTimeArr.length <57){
          setBarWidth=30;
          setEnd = 19;
        }else if(this.reportTimeArr.length >=57 && this.reportTimeArr.length <63){
          setBarWidth=30;
          setEnd = 17;
        }else if(this.reportTimeArr.length >=63 && this.reportTimeArr.length <67){
          setBarWidth=30;
          setEnd = 16;
        }else if(this.reportTimeArr.length >=67 && this.reportTimeArr.length <74){
          setBarWidth=30;
          setEnd = 14.5;
        }else if(this.reportTimeArr.length >=74 && this.reportTimeArr.length <79){
          setBarWidth=30;
          setEnd = 13.5;
        }else if(this.reportTimeArr.length >=79 && this.reportTimeArr.length <85){
          setBarWidth=30;
          setEnd = 12.5;
        }else if(this.reportTimeArr.length >=85 && this.reportTimeArr.length <93){
          setBarWidth=30;
          setEnd = 11.5;
        }else if(this.reportTimeArr.length >=93 && this.reportTimeArr.length <101){
          setBarWidth=30;
          setEnd = 10.5;
        }else if(this.reportTimeArr.length >=101 && this.reportTimeArr.length <112){
          setBarWidth=30;
          setEnd = 9.5;
        }else if(this.reportTimeArr.length >=112 && this.reportTimeArr.length <118){
          setBarWidth=30;
          setEnd = 9;
        }else if(this.reportTimeArr.length >=118 && this.reportTimeArr.length <125){
          setBarWidth=30;
          setEnd = 8.5;
        }else if(this.reportTimeArr.length >=125 && this.reportTimeArr.length <133){
          setBarWidth=30;
          setEnd = 8;
        }else if(this.reportTimeArr.length >=133 && this.reportTimeArr.length <141){
          setBarWidth=30;
          setEnd = 7.5;
        }else if(this.reportTimeArr.length >=141 && this.reportTimeArr.length <151){
          setBarWidth=30;
          setEnd = 7;
        }else if(this.reportTimeArr.length >=151 && this.reportTimeArr.length <163){
          setBarWidth=30;
          setEnd = 6.5;
        }else if(this.reportTimeArr.length >=163 && this.reportTimeArr.length <176){
          setBarWidth=30;
          setEnd = 6;
        }else if(this.reportTimeArr.length >=176 && this.reportTimeArr.length <192){
          setBarWidth=30;
          setEnd = 5.5;
        }else if(this.reportTimeArr.length >=192 && this.reportTimeArr.length <211){
          setBarWidth=30;
          setEnd = 5;
        }else if(this.reportTimeArr.length >=211 && this.reportTimeArr.length <220){
          setBarWidth=30;
          setEnd = 4.8;
        }else if(this.reportTimeArr.length >=220 && this.reportTimeArr.length <235){
          setBarWidth=30;
          setEnd = 4.5;
        }else if(this.reportTimeArr.length >=235 && this.reportTimeArr.length <251){
          setBarWidth=30;
          setEnd = 4.2;
        }else if(this.reportTimeArr.length >=251 && this.reportTimeArr.length <278){
          setBarWidth=30;
          setEnd = 3.8;
        }else if(this.reportTimeArr.length >=278 && this.reportTimeArr.length <301){
          setBarWidth=30;
          setEnd = 3.5;
        }else if(this.reportTimeArr.length >=301 && this.reportTimeArr.length <330){
          setBarWidth=30;
          setEnd = 3.2;
        }else if(this.reportTimeArr.length >=330 && this.reportTimeArr.length <351){
          setBarWidth=30;
          setEnd = 3;
        }else if(this.reportTimeArr.length >=351 && this.reportTimeArr.length <377){
          setBarWidth=30;
          setEnd = 2.8;
        }else {
          setBarWidth=30;
          setEnd = 2.6;
        }
        
      this.output.on('click', function (params) {
        self.countTotalAndYield=[];
        let handleDate =params.name.replace(/[/]/g,'-')
        let strBackData =JSON.parse(sessionStorage.getItem("dateYields"));

          self.countTotalAndYield=[];

        strBackData.forEach(item =>{
          if(item.reportTime == handleDate){
            let obj = {};
            obj.reportTotals=item.reportTotal;
            obj.reportAndReworks=item.reportTotal+item.reworkTotal;
            obj.reworkTotals=item.reworkTotal;
            obj.scrappeds=item.scrapped;
            obj.wips=item.wip;
            obj.unknowns=item.unknown;
            obj.firstPassYields=item.firstPassYield*100;
            obj.finalPassYields=item.finalPassYield*100;
            obj.reworkYields=item.reworkYield*100;
            obj.scrappedYields=item.scrappedYield*100;
            obj.wipYields=item.wipYield*100;
            obj.unknownYields=item.unknownYield*100;

            self.$set(self.countTotalAndYield)
            self.$delete(self.countTotalAndYield)
            self.countTotalAndYield.push(obj);

          }
        });
        //console.log(this.countTotalAndYield,'过滤了吗');
        
      });
      this.output.setOption( 
        {
          // color: ["#349d35", "#45d84a", "#42bd3f","#ff433e","#c0c7d7","#424652"],
          title: {
            left: "center",
            text: "机种良率",
            top: 5,
            textStyle: {
              //文字颜色
              color: "#333",
              //字体风格,'normal','italic','oblique'
              fontStyle: "normal",
              //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
              fontWeight: "bold",
              //字体系列
              fontFamily: "sans-serif",
              //字体大小
              fontSize: 18
            }
          },
          grid: {
            left: "0%",
            right: "0%",
            bottom: "2%",
            containLabel: true
          },
          // tooltip: {
          //   trigger: "axis",
          //   position: function(pos, params, dom, rect, size) {
          //     // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          //     var obj = { top: 60 };
          //     obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          //     return obj;
          //   },
             
          //   formatter: function(params) {
          //     var relVal = params[0].name;
          //     for (var i = 0, l = params.length; i < l; i++) {
          //       relVal +=
          //         "<br/>" +
          //         params[i].seriesName +
          //         " : " +
          //         (params[i].value=='NaN'?0:params[i].value)+"%"
          //        ;
          //     }
          //     return relVal;
          //   }
          // },
          dataZoom: [
            {
              show: false,
              type: "inside",
              realtime: true,
              start: 0,
              end:setEnd,
              filterMode:'empty'
            }
          ],
          xAxis: [
            {
              type: "category",
              // ["2017.06.11", "2017.06.12", "2017.06.13"]
              data: this.reportTimeArr,
              axisPointer: {
                show: true,
                type: "shadow"
              },
              axisLabel: {
                //坐标轴刻度标签的相关设置。
                textStyle: {
                  color: "#c0c0c0",
                  fontStyle: "normal",
                  fontFamily: "微软雅黑",
                  fontSize: 10
                },
                interval:0,
                rotate: 45
              },
              // 多余的东西
              axisTick: { show: false,alignWithLabel:true},
              splitLine: { show: false },
              //  x轴线的颜色
              axisLine: {
                lineStyle: {
                  color: "#c0c0c0",
                  width: 1
                }
              },
            }
          ],
          yAxis: [
            {
              type: "value",
              // scale: true,
              boundaryGap: false,
              min: 0,
              max: 100,
              // 多余的东西
              axisTick: {
                show: false
              },
              splitLine: { show: false },
              axisLabel: {
                show: true,
                inside: false
              },
              axisLabel: {
                show: true,
                interval: 0,
                formatter: "{value} %"
              },
              axisLine: {
                // show: false,
                lineStyle: {
                  color: "#9d9d9d",
                  width: 1
                }
              }
            }
          ],
          series:
            // this.series
            [
            
              {
                name: "FirstPass",
                type: "bar",
                stack: "1",
                //  this.firstPass
                data: this.firstPass,
                color: "#349d35",
                barWidth: setBarWidth, //图表的粗细
                // barCategoryGap: "30%",
                //  barGap :30,
              },
              {
                name: "FinalPass",
                type: "bar",
                stack: "1",
                data: this.finalPass,
                color: "#45d84a",
                barWidth: setBarWidth, //图表的粗细
                // barCategoryGap: "30%",
                //  barGap :30,
              },
              {
                name: "Reworked",
                type: "bar",
                stack: "1",
                data: this.reworked,
                color: "#42bd3f",
                barWidth: setBarWidth, //图表的粗细
                // barCategoryGap: "30%",
                //  barGap :30,
              },
              {
                name: "Scrapped",
                type: "bar",
                stack: "1",
                data: this.scrappend,
                color: "#ff433e",
                // barCategoryGap: "30%",
                barWidth:setBarWidth, //图表的粗细,
                //  barGap :30,
              },
              {
                name: "WIP",
                type: "bar",
                stack: "1",
                data: this.wip,
                color: "#c0c7d7",
                // barCategoryGap: "30%",
                barWidth: setBarWidth, //图表的粗细
                //  barGap :30,
              },
              {
                name: "Unknown",
                type: "bar",
                stack: "1",
                data: this.unknown,
                color: "#424652",
                // barCategoryGap: "30%",
                barWidth: setBarWidth, //图表的粗细
                //  barGap :30,
              }
            ]
        },
        true
      );
      
    }
  }
};
</script>
<style scoped>
.value > li {
  flex-direction: column;
  justify-content: center;
}
.y_nav > li {
  position: relative;
}

.y_span {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
.y_text {
  white-space: nowrap;
}
.y_tbtop {
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 1rem;
}
.key {
  white-space: nowrap;
}
.y_section-nav {
  background: #f4f4f4;
}
.y_section-nav > li {
  margin-bottom: 12px;
}
.y_section-nav > li > a {
  color: #ff7400;
  display: block;
}
.y_section-nav > li.active > a {
  color: #fff;
}
.y_ov {
  width: 70%;
  height: 44px;
  overflow-y: auto;
  padding-right: 32px;
}
.y_ov > ul > li {
  border: none;
  padding-right: 0;
}
.y_ov > ul > li .gray-list-text,
.y_ov > ul > li .y_text {
  width: 100%;
  text-align: right;
}
.y_sum {
  height: 100%;
}
.section {
  background: #fff;
}
.output {
  overflow-y: auto;
}
</style>
