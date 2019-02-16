<template>
    <article>
        <nav class="nav" v-show="showH5Title" >
            <span class="left" @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>仓库领料</h1>
            <span class="right" @click="handleSearch()">
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section y_section y_overflow">
                   <ul class="y_section-nav">
                      <li >
                        <router-link to="/warehouseReceiptRecord">
                         领料
                         </router-link>
                      </li>
                      <li >
                        <router-link to="/dayEntrepot">
                          当天仓库机种领料
                        </router-link>
                      </li>
                      <li class="active" >
                        <router-link to="/daysEntrepot">
                         多天仓库机种领料
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
                            <ul class="value"  v-for="(item,index) in newParts" :key="index">
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
                <div v-if="showNoDataICon" class="no-data"></div>
                 <div class="y_canvas y_sum"  v-if="!showNoDataICon">
                     <!-- 图表 -->
                     <div style="width:100%;height:100%">
                      <div id="sum" class="sum"></div>
                      <ul class="sum-title" >
                          <li  v-for="(item,index) in partArr" :key="index" @click="selectModel(item,index)">
                              <!-- 图像 -->
                              <span class="sum-ico bg_zi" :class="classMap[index]"></span>
                              <!-- 文字说明 -->
                              <div>
                                  <p class="y_tbtop">{{item.modelName}} {{item.upcCode}}</p>
                                  <span>{{item.partNo}}</span>
                              </div>
                          </li>
                      </ul>
                    </div>
                 </div>
        </section>
        <popup :errorMsg="errorMsg" ></popup>
        <waiting v-show="isWaiting" :number="number"></waiting>
        <asyncPop v-show="showDrag" ></asyncPop>
    </article>
</template>
<script>
let echarts = require("echarts");
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import utils from "../../common/utils.js";
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex'
import moment from "moment";
export default {
  name: "daysEntrepot",
  components: {
    popup,
    waiting,
    asyncPop
  },
  data() {
    return {
      showDrag: false, // 是否弹窗提示异步加载任务
      showH5Title: true, // 是否显示H5的头部，默认显示
      isShowEchart: false,
      number: 0,
      showNoDataICon: false, // 显示数据不为0的数据有的时候显示
      isWaiting: false,
      series: [],
      newParts: [],
      activeIndex: 0,
      typeValue: "",
      modelType: ["iPad", "Protable"],
      startTime: "",
      endTime: "",
      reportTimes: [],
      partArr: [],
      errorMsg: "",
      modelStrs: "",
      classMap: ["bg_z2", "bg_z4", "bg_z3", "bg_z1","bg_z5"],
      idStr:{},
      backDataList:[],
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
        text: "仓库领料", //控制显示文本，空字符串表示显示默认文本
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
  

    if(this.$store.state.startTime && !this.$store.state.endTime){
        self.startTime=this.$store.state.startTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.endTime = moment(day).format("YYYY-MM-DD");   
    }else if(!this.$store.state.startTime && this.$store.state.endTime){
         self.endTime=this.$store.state.endTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.startTime = moment(day).format("YYYY-MM-DD");
    }else if(this.$store.state.startTime && this.$store.state.endTime){
          self.startTime=this.$store.state.startTime;
          self.endTime=this.$store.state.endTime;
    }else{
        let day = new Date();
        day.setDate(day.getDate() - 1);
        self.startTime = moment(day).format("YYYY-MM-DD");
        self.endTime = moment(day).format("YYYY-MM-DD");
    }
   
   
    if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){  
        // 如果有缓存异步数据
        let asyncData =JSON.parse(sessionStorage.getItem("asyncResult"));        
        asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
        asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
       
        this.typeValue = asyncData.traceContext.modelType; 
        this.modelStrs = asyncData.traceContext.partId;
        this.newParts =asyncData.traceContext.manyModels;
        this.startTime=asyncData.traceContext.startTime;
        this.endTime =asyncData.traceContext.endTime;
        this.activeIndex= asyncData.traceContext.activeIndex;
        this.$store.commit('SET_DAYS_TYPE',this.typeValue);
        this.$store.commit('SET_DAYS_TYPE_INDEX',this.activeIndex);
         this.$store.commit('SET_PARTS_DAYS',this.newParts); 
        this.$store.commit('SET_STARTTIME',this.startTime)
        this.$store.commit('SET_ENDTIME',this.endTime); 
        //将制程数据渲染到界面
        this.backDataList =asyncData.traceResult.data;  // 缓存的数据
        this.backDataList.forEach(item => {
                this.reportTimes.push(item.reportTime.replace(/-/g,'/'));
                this.reportTimes = utils.uniqueArr(this.reportTimes);
              });

              let newData = utils.formatData(this.backDataList);              
              for (let key in newData) {
                let arr = [];
                newData[key].forEach(item => {
                  arr.push(item.reportTotal);
                });
                let items = {
                  name: key,
                  symbol: "circle",
                  type: "line",
                  data: arr
                };
                this.series.push(items);
              }
              this.partArr =  this.backDataList;
                            
              var hash = {};
              this.partArr = this.partArr.reduce(function(item, next) {
                hash[next.partNo]
                  ? ""
                  : (hash[next.partNo] = true && item.push(next));
                return item;
              }, []);
              this.$store.commit('SET_DAYSENTREPOT_REPORTTIMES',this.reportTimes);
              this.$store.commit('SET_DAYSENTREPOT_SERIES',this.series);
              this.$store.commit('SET_DAYSENTREPOT_PARTARR',this.partArr);
              // this.$store.commit('SET_PARTS_DAYS', asyncData.traceContext.manyModels); 
      }else{
            if(self.$store.state.daysTypeValue){
              self.typeValue =this.$store.state.daysTypeValue;
              self.activeIndex=this.$store.state.daysTypeIndex;
            }else{
              self.typeValue ="iPad";
              self.activeIndex=0;
            }

          if (self.$store.state.dayParts.length != 0) {
            self.newParts = this.$store.state.dayParts;
              var hash = {};
              self.newParts = self.newParts.reduce(function(item, next) {
                hash[next.modelId]
                  ? ""
                  : (hash[next.modelId] = true && item.push(next));
                  return item;
                }, []);
          } else {
            self.getInitModel();
          }

      } 

  },
  mounted() {
    if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){
        this.initEcharts();
    }
    if(this.$store.state.daysEntrepotReporttimes.length>0 && 
    this.$store.state.daysEntrepotReportSeries.length>0 &&
     this.$store.state.daysEntrepotReportPartArr.length>0
    ){
      this.reportTimes =this.$store.state.daysEntrepotReporttimes;
      this.series=this.$store.state.daysEntrepotReportSeries;
      this.partArr = this.$store.state.daysEntrepotReportPartArr;
      this.initEcharts();
    }
    
  },
  methods: {
    chooseStartTime(){
      this.$store.commit('SET_STARTTIME',this.startTime)
    },
    chooseEndTime(){
      this.$store.commit('SET_ENDTIME',this.endTime);
    },
    selectModel(data,index) {
      this.newParts.forEach(item =>{
        if(item.partNo == data.partNo){
            this.idStr.id = item.modelId;
        }
      })
      let modelStr =JSON.stringify(this.idStr);
      let str =modelStr.slice(6,-1);
      this.$router.push({
        path: "/dayEntrepotDetail",
        query: {
          startTime: this.startTime,
          endTime: this.endTime,
          modelStrs: str,
          sendData: data,
          target:"daysEntrepot"
        }
      });
    },
    ...mapActions([
        'deletePickingList'
    ]),
    // 返回上一页
    back() {
      this.deletePickingList();
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
      this.$store.commit('SET_DAYS_TYPE',item);
      this.$store.commit('SET_DAYS_TYPE_INDEX',index);
      this.getInitModel();
    },
    // 去往选择机制页面
    goModelList() {
      this.$router.push({
        path: "/baseModelList",
        query: {
          path: "daysEntrepot",
          type: this.typeValue
        }
      });
    },
    getInitModel() {
      let self = this;
      self.newParts = [];
      let params = { type: self.typeValue, keyWord: "" };      
      this.$axiosHttp.axiosPost("ks-newrep/ReportTool/findModelByTypeName.api", params).then(res => {
          self.newParts.push(res.data[0]);
          this.$store.commit('SET_PARTS_DAYS',self.newParts); 
        });
    },
    handleSearch() {
       clearInterval(timer);
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
      let modelIds = [];
      this.newParts.forEach(item => {
        modelIds.push(item.modelId);
      });      
      this.modelStrs = modelIds.join(",");
      if(this.modelStrs.length == 0){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      let params = {
        partId: this.modelStrs,
        startTime: this.startTime,
        endTime: this.endTime
      };
     
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      // this.$store.commit('SET_DAYS_PARAMS',params)
      this.isWaiting = true;
      this.$axiosHttp
        .axiosPost(
          "ks-newrep/RepertoryMaterial/findReperMaterialDateSection.api",
          params
        )
        .then(res => { 
          // this.showDrag=true;         
          this.series=[];
          this.reportTimes=[];
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          let { code, msg, data } = res;
          if (code == 200) {
            if (data.length == 0) {
              this.showNoDataICon = true;
              return;
            } else {
              this.showNoDataICon = false;
              this.backDataList=data;
             this.backDataList.forEach(item => {
                this.reportTimes.push(item.reportTime.replace(/-/g,'/'));
                this.reportTimes = utils.uniqueArr(this.reportTimes);
              });

              let newData = utils.formatData(this.backDataList);              
              for (let key in newData) {
                let arr = [];
                newData[key].forEach(item => {
                  arr.push(item.reportTotal);
                });
                let items = {
                  name: key,
                  symbol: "circle", 
                  type: "line",
                  data: arr
                };
                this.series.push(items);
              }
              this.partArr =  this.backDataList;           
              var hash = {};
              this.partArr = this.partArr.reduce(function(item, next) {
                hash[next.partNo]
                  ? ""
                  : (hash[next.partNo] = true && item.push(next));
                return item;
              }, []);
              this.$store.commit('SET_DAYSENTREPOT_REPORTTIMES',this.reportTimes);
              this.$store.commit('SET_DAYSENTREPOT_SERIES',this.series);
              this.$store.commit('SET_DAYSENTREPOT_PARTARR',this.partArr);
              this.initEcharts();
            }
          }else if(code ==-404){
            this.showDrag=true; 
          } else {
            this.errorMsg = msg;
          }
        });
    },
     //启动异步任务机制
    startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"/daysEntrepot",
          "traceParams" : {
                  partId:this.modelStrs,
                  startTime: this.startTime,
                  endTime: this.endTime
                },
          "traceApi":"http://ks-newrep/RepertoryMaterial/findReperMaterialDateSection.api",
          "traceContext":{
                  manyModels:this.newParts,
                  title:"多天仓库机种领料查询",
                  partId:this.modelStrs,
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
    initEcharts() {
      let sum = echarts.init(document.getElementById("sum"));
      let series= this.series;     
      let reportTime = this.reportTimes;
      let setEnd =0;
      if(reportTime.length<7) {   //一周之内
            setEnd=60
          } else if(reportTime.length>=7 && reportTime.length<15) {   //半个月
            setEnd=50
          } else if (reportTime.length>=15 && reportTime.length<30) {   //一个月
            setEnd=30
          } else if (reportTime.length>=30 && reportTime.length<=60) {   //2个月
            setEnd=10
          }else if (reportTime.length>60 && reportTime.length<=90) {      //3 个月
            setEnd=5
          }else if (reportTime.length>90 && reportTime.length<=120) {     //4个月
            setEnd=4
          } else if (reportTime.length>120 && reportTime.length<=150) {   //5个月
            setEnd=3
          } else {
            setEnd=2
          }
      sum.setOption({
        title:{
            text:'领料趋势图',
             left:'center',
             top:'10',
            textStyle:{
                color:'#333',
                fontStyle:'normal',
                fontWeight:'bold',
                fontFamily:'sans-serif',
        　　　　 fontSize:18
            }
        },
        tooltip: {
          trigger: "axis",
            position: function (pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = {top: 60};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
          },
          // axisPointer:{
          //     triggerOn:'mousemove'
          // }
        
        },
        grid: {
          left: "5%",
          right: "0%",
          bottom: "3%",
          containLabel: true
        },
      dataZoom: [
      {
          show: false,
          type: 'inside',
          realtime: true,
          start: 0,
          end:setEnd,
          filterMode: 'empty'
      }],
        xAxis: [
          {
            type: "category",
            // reportTimes
            data: reportTime,
            axisPointer: {
              show: true,
              type: "shadow"
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#9d9d9d"
              }
            },
            // 多余的东西
            axisTick: { show: false },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0,
              rotate: "45"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            // scale: true,
            // boundaryGap:false,
            min: 0,
            axisLine: {
              // show: false,
              lineStyle: {
                color: "#9d9d9d",
                width: 1
              }
            },
            // 多余的东西
            axisTick: { show: false },
            splitLine: { show: false }
          }
        ],
        series: series
        //     {
        //     name: '1',
        //     type: 'line',
        //     symbolSize: 6,
        //     // 实现原点
        //     symbol: 'circle',
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     data: [],
        //     itemStyle: {
        //     normal: {
        //             color: '#8e6fb3'
        //         }
        //     }
        // }, {
        //     name: '2',
        //     type: 'line',
        //     symbol: 'circle',
        //     symbolSize: 6,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     // 130, 182, 191, 234,42,232
        //     data:[] ,
        //     itemStyle: {
        //     normal: {
        //             color: '#5082bd '
        //         }
        //     }
        // }, {
        //     name: '3',
        //     type: 'line',

        //     symbol: 'circle',
        //     symbolSize: 6,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     // 150, 232, 201, 154,111,222
        //     data: [],
        //     itemStyle: {
        //     normal: {
        //             color: '#9aba58',
        //         }
        //     },
        // }, {
        //     name: '4',
        //     type: 'line',

        //     symbol: 'circle',
        //     symbolSize: 6,
        //     lineStyle: {
        //         normal: {
        //             width: 1
        //         }
        //     },
        //     // 200, 22, 150, 54,50,66
        //     data: [],
        //     itemStyle: {
        //     normal: {
        //             color: '#c0504d',
        //         }
        //     },
        // }
      },true);

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
</style>
