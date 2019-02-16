<template>
    <article>
        <nav class="nav"  v-show="showH5Title">
            <span class="left"  @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>不良统计图</h1>
            <span class="right" @click="handleSearch()" >
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section y_section y_overflow">
                 <ul class="y_section-nav">
                      <li >
                        <router-link to="/processBadInformation">
                         不良信息
                         </router-link>
                      </li>
                      <li class="active" >
                        <router-link to="/badChart">
                         不良统计图
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
                  <div v-if="showNoDataICon" class="no-data"></div>
                 <div class="y_canvas " v-if="!showNoDataICon">
                   <p v-show="backData.length >0" class="y_canvas-t">不良统计图</p>
                   <!-- 添加.m_t -->
                     <nav class="y_buliang " :class="{'m_t':backData.length < 5,'m_t_er':backData.length >= 5 && backData.length <= 9}">
                         <ul>
                             <li v-for="(item,index) in backData" :key="index">
                                 <!-- 左边文字 -->
                                 <span class="bl-left">{{item.defectDesc}}</span>
                                 <!-- 右边东西 -->
                                 <!-- <div class="bl-right " @click="goTarget(item,item.activeId)" :class="{'visited':item.check}"> -->
                                    <div class="bl-right " @click="goTarget(item,index)">
                                   <!-- :class="{'visited':item.activeId==active}" -->
                                     <!-- 颜色区域 -->
                                     <!-- style="width: 10%;" -->
                                    <span class="r-progress" :style="{ width: (item.reportRercentages )*mulriple+'%' }">
                                    </span>
                                    <div class="r-data">
                                        <!-- 数据一 -->
                                        <!-- <span>{{item.reportRece}}</span> -->
                                        <!-- 数据二 -->
                                        <span class="data-col">{{item.reportRercentages}}%</span>
                                    </div>
                                    <div  class="visited" v-show="current==index"></div>
                                 </div>
                             </li>         
                         </ul> 
                         <!-- <ul class="kedu" v-show="backData.length >0">
                           <li>0%</li>
                            <li>25%</li> 
                           <li>50%</li>
                            <li>75%</li>
                           <li>100%</li>
                         </ul> -->
                     </nav>
                 </div>
                  <popup :errorMsg="errorMsg" ></popup>
                  <waiting v-show="isWaiting" :number="number"></waiting>
                  <asyncPop v-show="showDrag" ></asyncPop>
        </section>
       
    </article>    
</template>

<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
import echarts from "echarts";
import moment from "moment";
import {mapActions} from 'vuex'
export default {
   components: {
    popup,
    waiting,
    asyncPop
  },
  data() {
    return {
      active:[],
      showH5Title: true, // 是否显示H5的头部，默认显示
      errorMsg: "",
      number: 0,
      showNoDataICon: false, // 显示数据不为0的数据有的时候显示
      isWaiting: false,
      backData:[],
      bcModels: [],
      modelType: ["iPad", "Protable"], //类型选择
      activeIndex: 0, //类型索引
      typeValue: "", //类型属性值
      startTime: "",
      endTime: "",
      defectDesc: [],
      reportRece: [],
      day_sum:"",  
      showDrag: false, // 是否弹窗提示异步加载任务 
      current:-1,
      id:"",   
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
         self.handleSearch();
      }
    });
   
      // if(this.$store.state.badChartBackData ==null){
      //   return;
      // }
    if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // 如果有缓存异步数据      
      let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
      asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
      asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
     
      //  this.current=-1;
      //  this.$store.commit("SET_BADCHART_SCROLLBAR", -1);
       this.backData=[];
      //原传递给服务端的参数
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
      this.$store.commit("SET_BADCHART_ENDTIME", this.endTime);
      this.$store.commit("SET_BADCHART_STARTTIME", this.startTime);

      //界面渲染参数
      // this.$route.query.modelName = asyncData.traceContext.modelName;
      // this.$route.query.upccode = asyncData.traceContext.upccode;
      // this.$route.query.partNo = asyncData.traceContext.partNo;
      let items={};
      items.modelName = asyncData.traceContext.modelName;
      items.partName = asyncData.traceContext.upccode;
      items.partNo = asyncData.traceContext.partNo;
      items.colorEn =asyncData.traceContext.colorEn;
      items.modelId = asyncData.traceContext.partId;
      this.id =asyncData.traceContext.partId;
      this.typeValue=asyncData.traceContext.modelType
      this.activeIndex =asyncData.traceContext.activeIndex
      if(this.$route.query.target=='countBadChart'){
         this.current =this.$store.state.showScrollBar;
      }
      this.current =asyncData.traceContext.current;
     
      
      // console.log(this.current,'this.current');
      // this.$store.commit("SET_BADCHART_SCROLLBAR", this.current );
      // this.modeldata.partNo = asyncData.traceContext.partNo;
      this.$store.commit("SET_BADCHART_TYPE", this.typeValue);
      this.$store.commit('SET_BADCHART_ITEM',items); 
      this.$store.commit("SET_BADCHART_TYPE_INDEX", this.activeIndex);
      this.bcModels.push(items);
      //将制程数据渲染到界面
       this.backData = asyncData.traceResult.data; // 缓存的数据
       this.$store.commit('SET_BADCHART_BACKDATA',this.backData)
      //控制是否显示“选择制程”面板
      //  this.showSelectProcess = true;
      //  this.filterData();
      // if (this.processList.length == 0) {
      //   this.errorMsg = "没有数据";
      // }

    } else{
       
        if (self.$store.state.badChartType) {
          self.typeValue = this.$store.state.badChartType;
          self.activeIndex = this.$store.state.badChartIndex;
        } else {
          self.typeValue = "iPad";
          self.activeIndex = 0;
        }
        if (this.$store.state.badChartStTime && !this.$store.state.badChartEdTime) {
          self.startTime = this.$store.state.badChartStTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.endTime = moment(day).format("YYYY-MM-DD");
        } else if (
          !this.$store.state.badChartStTime &&
          this.$store.state.badChartEdTime
        ) {
          self.endTime = this.$store.state.badChartEdTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.startTime = moment(day).format("YYYY-MM-DD");
        } else if (
          this.$store.state.badChartStTime &&
          this.$store.state.badChartEdTime
          
        ) {
          self.startTime = this.$store.state.badChartStTime;
          self.endTime = this.$store.state.badChartEdTime;
        } else {
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.startTime = moment(day).format("YYYY-MM-DD");
          self.endTime = moment(day).format("YYYY-MM-DD");
        }
       
        if (Object.keys(self.$store.state.badChartItem).length != 0) {
          self.bcModels.push(self.$store.state.badChartItem);
        } else {
          self.getinitModel();
        }
          
        if(this.$store.state.showState ==true && this.$store.state.badChartBackData.length==0){  
            this.showNoDataICon =this.$store.state.showState;  
        }else{
          this.backData = this.$store.state.badChartBackData;
        }
      
        if(this.$store.state.showScrollBar>=0){
          this.current = this.$store.state.showScrollBar; 
          
      }  
       
    }  

    
    
  },
  mounted() {
  //  if(this.$store.state.badChartBackData.length>0 ||this.$store.state.showState ==true){
  //     this.backData = this.$store.state.badChartBackData;     
  //     this.showNoDataICon =this.$store.state.showState;
     
  //  }
   
  //  if(this.$store.state.showScrollBar ==true){
    
      // this.current = this.$store.state.showScrollBar;   
      // if (this.active.length != 0) {
      //     this.active.forEach(item =>{          
      //       for (var i = 0; i < this.backData.length; i++) {
      //         if (item == i+"") {
      //           this.backData[i].check = true;
      //         }
      //       }
      //     });
      // }   
    // }
  },
  computed:{
      mulriple(){
        let firstData =this.backData[0].reportRercentages;
        let mul = (100/firstData);
        mul = mul.toFixed(2);
        return mul;
      }
  },
  methods: {
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },                     
     handleSearch() {
      this.number = 0;            
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
    
      this.isWaiting = true;
      // this.active = new Array();
      this.$store.commit("SET_BADCHART_SEARCHPARAMS", params);
      this.$axiosHttp
        .axiosPost("ks-newrep/ReportDefect/findDefectDescCenSus.api", params)
        .then(res => { 
          // this.showDrag = true; 
          this.showNoDataICon = false;
          this.number = 0;
          this.isWaiting = false;
          let { code, msg, data } = res;
         
          if (code == 200) { 
            this.current=-1; 
           
                                     
            if(data==null || data.length ==0){
              this.showNoDataICon = true; 
              // this.backData = new Array();  
               this.$store.commit('SET_BADCHART_SHOWSTATE',this.showNoDataICon); 
                 this.$store.commit('SET_BADCHART_BACKDATA',[]);             
            } else {              
              // for (var i = 0; i < this.backData.length; i++) {
              //   this.backData[i].activeId = i+"";
              //   this.backData[i].check = false;
              // }
               this.backData = data; 
               this.$store.commit('SET_BADCHART_BACKDATA',this.backData)
               
            }            
           
           
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
        tracePath: "/badChart",
        traceParams: {
          partId: (this.bcModels[0].modelId).toString(),
          startTime:this.startTime,
          endTime:this.endTime
        },
        traceApi: "http://ks-newrep/ReportDefect/findDefectDescCenSus.api",
        traceContext: {
          partNo:this.bcModels[0].partNo,
          colorEn: this.bcModels[0].colorEn,
          modelName: this.bcModels[0].modelName,
          upccode: this.bcModels[0].partName,
          title: "不良统计图查询",
          partId: this.bcModels[0].modelId, // 请求参数
          // path: this.$route.query.path,
          modelType:this.typeValue,
          startTime: this.startTime, // 请求参数
          endTime: this.endTime, // 请求参数
          activeIndex:this.activeIndex,
          current:this.current
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
    chooseStartTime() {
      this.$store.commit("SET_BADCHART_STARTTIME", this.startTime);
    },
    chooseEndTime() {
      this.$store.commit("SET_BADCHART_ENDTIME", this.endTime);
    },
    ...mapActions([
        'deleteProBadList'
    ]),
    // 返回上一页
    back() {
       this.deleteProBadList();
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
    //类型选择
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_BADCHART_TYPE", item);
      this.$store.commit("SET_BADCHART_TYPE_INDEX", index);
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
             this.$store.commit('SET_BADCHART_ITEM',data[0]); 
           
          } else {
            this.errorMsg = msg;
          }
        });
    },
    // 跳到机种单选页面
    goModelList() {

      this.$router.push({
        path: "/singleModelList",
        query: {
          path: "badChart",
          type: this.typeValue
          // initModel:this.newParts
        }
      });
    },
    goTarget(item,index){ 
      this.current =index;                  
      // let isExist = false;      
      // if (this.active.length != 0) {
      //   this.active.forEach(item => {
      //     if (item==index) {
      //       isExist = true;
      //     }
      //   });
      // }
      // if (!isExist) {
      //   this.active.push(index);
      // }
      this.$store.commit("SET_BADCHART_SCROLLBAR", this.current);
      this.$router.push({
            path: "countBadChart",
            query:{
              name:item.defectDesc,
              partId:(this.bcModels[0].modelId).toString(),
              startTime:this.startTime,
              endTime:this.endTime,             
            }
        });
    }
    // initEcharts: function() {
    //   let self = this;
    //   this.day_sum = echarts.init(document.getElementById("day_sum"));
    //   let reportRece = this.reportRece;
    //   let defectDesc = this.defectDesc;
    //   window.addEventListener("resize", function() {
    //     this.day_sum.resize();
    //   });
    //   this.day_sum.setOption(
    //     {
    //       color: ["#ff7e00"],
    //       tooltip: {
    //         trigger: "axis",
    //         axisPointer: {
    //           type: "shadow"
    //         }
    //       },
    //       /*legend: {
    //             data: [date]
    //         },*/
    //       grid: {
    //         left: "4%",
    //         right: "8%",
    //         bottom: "2%",
    //         containLabel: true
    //       },
    //       xAxis: {
    //         type: "value",
    //         boundaryGap: [0, 0.01],
    //         min: 0,
    //         max: 100,
    //         interval: 20,
    //         axisLine: {
    //           // show: false,
    //           lineStyle: {
    //             color: "#9d9d9d",
    //             width: 1
    //           }
    //         },
    //         axisLabel: {              
    //           show: true,
    //           interval: "auto",
    //           formatter: "{value} %"
    //         },
    //         // 多余的东西
    //         axisTick: { show: false },
    //         splitLine: { show: false }
    //       },
    //       yAxis: [
    //         {
    //           type: "category",
    //           axisLabel: {
    //             fontSize:8,
    //             margin: 5,
    //             show: true,
    //             interval: 0,
    //             rotate: 0,
    //             margin: 0,
    //             inside: false
    //           },
    //           axisLine: {                
    //             show: false,
    //             lineStyle: {
    //               color: "#9d9d9d",
    //               width: 1
    //             }
    //           },
    //           axisTick: { show: false },
    //           data: defectDesc
    //         }
    //       ],
    //       series: [
    //         {
    //           type: "bar",
    //           data: reportRece,
    //           barWidth: "10",
    //           label: {
    //             normal: {                  
    //               show: true,
    //               position: "right",
    //               formatter: "{c}%"
    //             }
    //           }
    //         }
    //       ]
    //     },
    //     true
    //   );
    //   this.day_sum.on("click", function (param){
    //       self.$router.push({
    //          path: "countBadChart",
    //          query:{
    //            name:param.name
    //          }
    //       });
    //   }); 
    // }
  }
};
</script>
<style scoped>
.value > li {
  flex-direction: column;
  justify-content: center;
}
.y_buliang{
  position: relative;
  margin-top:0px;
}
.y_buliang.m_t{
  margin-top: 15%;
}
.y_buliang.m_t_er{
  margin-top: 9%;
}
/* .y_buliang>p{
  width: 100%;
  position: absolute;
  top: -25px;
  text-align: center;
  font-weight: 700;
} */
.y_canvas-t{
    text-align: center;
  font-weight: 700;
  line-height: 50px;
}
.kedu{
    width: 135px;
    display: flex;
    position: absolute;
    right: 65px;
    bottom: -31px;
    justify-content: space-between;
    font-size: 12px;
    color: #ccc;
}
.visited{
  background-color: rgba(0, 0, 0, .25);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.kedu{
  /* padding-right: 150px; */
}
</style>
