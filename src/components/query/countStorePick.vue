<template>
    <article>
        <nav class="nav"  v-show="showH5Title">
            <span class="left" @click="back">  
               <!-- @click="back" -->
                    <span class="icon icon-left"></span>
            </span>
            <h1>生产在制</h1>
            <span class="right" @click="handleSearch()" >
                <span class="or">
                    查询
                </span>
            </span>        
        </nav>
        <section class="section y_section y_overflow">
                 <ul class="y_section-nav">
                  <li>
                    <router-link to="/processProduction">
                      生产在制
                      </router-link>
                  </li>
                  <li class="active">
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
                <ul class="gray-list y_nav">
                    <li class="y_select" style="background:#f4f4f4;margin:0;">
                        <span class="y_select-text">类型选择</span>
                        <div class="y_select-r" >
                            <div v-for="(item,index) in modelType" :key="index">
                               <label for="y_radio1"  :class="{'act':activeIndex == index}" @click="selecType(item,index)">{{item}}</label>                  
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
                   <!-- 没有数据的时候显示 -->
                <div v-if="showNoDataICon" class="no-data"></div>
                 <div class="y_canvas" v-if="!showNoDataICon" v-show="storeData.length>0">
                    <p class="nav-canvas-title">unknown汇总数据</p>
                    <div class="nav-canvas-foot">
                        <span><i class="wip_bule"></i>wip</span>
                         <span><i class="un_ren"></i>unknown</span>
                    </div>
                    <nav class="nav-canvas-main">
                      <ul class="nav-canvas">
                        <!-- v-for="(item,index) in storeData" :key ="index" -->
                          <li v-for="(item,index) in storeData" :key ="index" @click="showToolip(index)">
                              <!-- 左边 -->
                              <div class="nav-canvas-left">
                                  <!-- <span>{{item.processName}}</span> -->
                                  <span>{{item.processName}}</span>
                              </div>
                              <!-- 右边 -->
                              <div class="nav-canvas-right" >
                                <!-- :style="{width:(item.reportUnkHNow/item.reportTotal)*100+'%'}" -->
                                  <span class="unkhnow" :style="{width:(item.reportUnkHNow/item.reportTotal)*100+'%'}"></span>
                                  <!-- :style="{width:(item.reportWip/item.reportTotal)*100+'%'}" -->
                                  <span class="wip" :style="{width:(item.reportWip/item.reportTotal)*100+'%'}"></span>
                                  <div class='nav-title'  v-show="toolip==index">
                                    <small>unknown: {{item.reportUnkHNow }}</small>
                                    <small>wip: {{item.reportWip }}</small>
                                  </div>
                              </div>
                          </li>
                      </ul>
                    </nav>
                    <div class="nav-canvas-kedu">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                   
                 </div>
                  <popup :errorMsg="errorMsg" ></popup>
                  <waiting v-show="isWaiting" :number="number"></waiting>
                  <asyncPop v-show="showDrag" ></asyncPop>
        </section>
    </article>
    
</template>

<script>
// let echarts = require("echarts");
import echarts from "echarts";
import moment from "moment";
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex'
export default {
   components: {
    popup,
    waiting,
    asyncPop
  },
  data() {
    return {
      showDrag: false, // 是否弹窗提示异步加载任务
      active:0,
      showH5Title: true, // 是否显示H5的头部，默认显示
      isWaiting: false,
      number: 0,
      showNoDataICon: false, // 显示数据不为0的时候显示
      storeData:[],
      bcModels: [],
      modelType: ["iPad", "Protable"], //类型选择
      activeIndex: 0, //类型索引
      typeValue: "", //类型属性值
      startTime: "",
      endTime: "",
      reportUnkHNow:[],
      reportWip:[],
      processName:[],
      errorMsg: "",
      toolip:-1
    };
  },
  created() {
    if(window.navigator.userAgent.indexOf('IOS')>-1||window.navigator.userAgent.slice(11)==='ANDROID-IAAPPCONTAINER'||window.navigator.userAgent.slice(11)==='PAD-IAAPPCONTAINER'){
          this.showH5Title = false;
      }
       const self =this;
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
           self.handleSearch();
        },
      });

    if (self.$store.state.storepickType) {
      self.typeValue = this.$store.state.storepickType;
      self.activeIndex = this.$store.state.storepickIndex;
    } else {
      self.typeValue = "iPad";
      self.activeIndex = 0;
    }
    if (this.$store.state.storepickStTime && !this.$store.state.storepickEdTime) {
      self.startTime = this.$store.state.storepickStTime;
      let day = new Date();
      day.setDate(day.getDate() - 1);
      self.endTime = moment(day).format("YYYY-MM-DD");
    } else if (
      !this.$store.state.storepickStTime &&
      this.$store.state.storepickEdTime
    ) {
      self.endTime = this.$store.state.storepickEdTime;
      let day = new Date();
      day.setDate(day.getDate() - 1);
      self.startTime = moment(day).format("YYYY-MM-DD");
    } else if (
      this.$store.state.storepickStTime &&
      this.$store.state.storepickEdTime
    ) {
      self.startTime = this.$store.state.storepickStTime;
      self.endTime = this.$store.state.storepickEdTime;
    } else {
      let day = new Date();
      day.setDate(day.getDate() - 1);
      self.startTime = moment(day).format("YYYY-MM-DD");
      self.endTime = moment(day).format("YYYY-MM-DD");
    }
    if (Object.keys(self.$store.state.countStorePickItem).length != 0) {
      self.bcModels.push(self.$store.state.countStorePickItem);
    } else {
      self.getinitModel();
    }

    if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){  
      // 如果有缓存异步数据
    let asyncData =JSON.parse(sessionStorage.getItem("asyncResult"));
    asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
    asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
   
      //原传递给服务端的参数
      this.bcModels=[];
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
      this.typeValue = asyncData.traceContext.modelType; 
      this.activeIndex=asyncData.traceContext.activeIndex;
      this.$store.commit("SET_STOREPICK_TYPE",  this.typeValue);
      this.$store.commit("SET_STOREPICK_INDEX", this.activeIndex);
      this.$store.commit("SET_STOREPICK_STARTTIME", this.startTime); 
      this.$store.commit("SET_STOREPICK_ENDTIME", this.endTime);  
      //界面渲染参数
      let items ={};
      items.modelName = asyncData.traceContext.modelName;
      items.modelId = asyncData.traceContext.partId;
      items.partName = asyncData.traceContext.upccode;
      items.partNo = asyncData.traceContext.partNo;
      items.colorEn =asyncData.traceContext.colorEn; 
      this.$store.commit('SET_COUNTSTOREPICK_ITEM',items);           
      this.bcModels.push(items);
      //将制程数据渲染到界面
      this.storeData = asyncData.traceResult.data;  // 缓存的数据
      this.$store.commit('SET_STOREPICK_DATA',this.storeData);
    } 
  },
  mounted() {      
    if(this.$store.state.storePickData.length!=0 ||this.$store.state.showStoreBar == true){
      this.storeData=this.$store.state.storePickData;
      this.showNoDataICon =this.$store.state.showStoreBar;
      // this.initEcharts();
    }
  },
  methods: {
      showToolip(index){
        this.toolip=index
      },
      // 初始化弹窗文本信息为空
      initTxt() {
        this.errorMsg = "";
      },
      ...mapActions([
        'deleteProProductionList'
      ]),
     // 返回上一页
      back() {
         this.deleteProProductionList();
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
        partId: (this.bcModels[0].modelId).toString(),
        startTime: this.startTime,
        endTime: this.endTime
      };
       var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      // this.$store.commit("SET_DAY_PARAMS", params);
      this.isWaiting = true;
      this.$store.commit("SET_BADCHART_SEARCHPARAMS", params);
      this.$axiosHttp
        .axiosPost("ks-newrep/WorkInProgress/findWorkInProgress.api", params)
        .then(res => {
          // this.showDrag = true;
          this.showNoDataICon = false;
          this.reportUnkHNow=[];
          this.reportWip=[];
          this.processName=[];
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;          
          let { code, msg, data } = res;          
          if (code == 200) {
            this.storeData=data;
            if(data==null ||data.length==0 ){
              this.showNoDataICon=true;
              this.storeData = new Array();               
            }
            this.$store.commit('SET_STOREPICK_SHOWSTATE',this.showNoDataICon);
            this.$store.commit('SET_STOREPICK_DATA',this.storeData);
          }else if(code ==-404){
            this.showDrag = true;
          } else{
            this.errorMsg = msg;
          }
        });
     },
       //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"/countStorePick",
          "traceParams" : {
                  partId:this.bcModels[0].modelId,
                  startTime: this.startTime,
                  endTime: this.endTime
                },
          "traceApi":"http://ks-newrep/WorkInProgress/findWorkInProgress.api",
          "traceContext":{
                  partNo: this.bcModels[0].partNo,
                  modelName: this.bcModels[0].modelName,
                  upccode: this.bcModels[0].partName,
                  colorEn:this.bcModels[0].colorEn,
                  title: "unknown汇总数据查询",
                  partId: this.bcModels[0].modelId,  // 请求参数
                  startTime: this.startTime, 
                  endTime: this.endTime,
                  modelType:this.typeValue,
                  activeIndex:this.activeIndex,      
          }

          
      }
       this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/sendAsynTask.api", info)
        .then(res => {
             
              if(res.code == 200){
                  this.unreadData(); // 当天未读数量获取
              }
        })
    },

  cancelAsync(){
    this.showDrag = false;
  },
  // 当天未读数量请求
  unreadData(){
     this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/querySaDayCount.api")
        .then(res => {
           
            let {code, msg, data} = res;
            switch (code){
              case 200:
                  this.$store.commit('SET_COUNT',data)
                  this.cancelAsync(); // 取消弹窗
              break;
            }
        })
    },
    chooseStartTime() {
      this.$store.commit("SET_STOREPICK_STARTTIME", this.startTime);
    },
    chooseEndTime() {
      this.$store.commit("SET_STOREPICK_ENDTIME", this.endTime);
    },
     // 跳到机种单选页面
    goModelList() {
      this.$router.push({
        path: "/singleModelList",
        query: {
          path: "countStorePick",
          type: this.typeValue
          // initModel:this.newParts
        }
      });
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
            this.$store.commit('SET_COUNTSTOREPICK_ITEM',data[0]); 
          } else {
            this.errorMsg = msg;
          }
        });
    },
      //类型选择
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_STOREPICK_TYPE", item);
      this.$store.commit("SET_STOREPICK_INDEX", index);
      this.getinitModel();
    },
  
    
  }
};
</script>
<style scoped>
.value > li {
  flex-direction: column;
  justify-content: center;
}
</style>
