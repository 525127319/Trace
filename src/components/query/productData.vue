<template>
    <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>成品信息</h1>
             <span class="right" @click="handleSearch()">
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section y_overflow">
            <ul class="y_section-nav">
                <li  >
                  <router-link to="/processCustomerInformation">
                    成品信息
                    </router-link>
                </li>
                <li class="active">
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
            <div class="particulars-tab" v-if="!showNoDataICon" v-show="productList.length>0">
                <table class="tab-top">
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>机种</th>
                            <th>类型</th>
                            <th>产出数据</th>
                            <th>班别</th>
                        </tr>
                    </thead>
                </table>
                <div class="tab-fot">
                  <table>
                     <tbody>
                        <tr v-for="(item,index) in productList" :key="index">
                            <td>
                               {{item.reportTime.replace(/-/g,'/')}}
                            </td>
                            <td>
                              <p>{{item.modelName}}</p>
                                 {{item.partName}} 
                              <p>{{item.upcCode}}</p> 
                            </td>
                            <td>
                               {{item.modelType}}
                            </td>
                            <td>
                               {{item.reportTotal}}
                            </td>
                            <td>
                               {{item.dorn}}
                            </td>
                        </tr>     
                    </tbody>                   
                  </table>
                </div>
            </div>
        </section>
        <popup :errorMsg="errorMsg" ></popup>
        <waiting v-show="isWaiting" :number="number"></waiting>
        <asyncPop v-show="showDrag" ></asyncPop>
    </article>    
</template>
<script type="text/ecmascript-6">
let echarts = require("echarts");
 import {mapActions} from 'vuex'
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import utils from "../../common/utils.js";
import Cache from "../../common/Cache";
import asyncPop from "../base/asyncPop.vue";
import moment from "moment";
export default {
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
      productList:[],

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
           self.handleSearch();
        },
      });
    
    if(this.$store.state.productDataStTime && !this.$store.state.productDataEdTime){
        self.startTime=this.$store.state.productDataStTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.endTime = moment(day).format("YYYY-MM-DD");   
    }else if(!this.$store.state.productDataStTime && this.$store.state.productDataEdTime){
         self.endTime=this.$store.state.endTime;
          let day = new Date();
          day.setDate(day.getDate() - 1);
          self.startTime = moment(day).format("YYYY-MM-DD");
    }else if(this.$store.state.productDataStTime && this.$store.state.productDataEdTime){
          self.startTime=this.$store.state.productDataStTime;
          self.endTime=this.$store.state.productDataEdTime;
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
        this.$store.commit('SET_PRODUCTDATA_PARTS',this.newParts); 
        this.$store.commit('SET_PRODUCTDATA_STARTTIME',this.startTime)
        this.$store.commit('SET_PRODUCTDATA_ENDTIME',this.endTime);
        //将制程数据渲染到界面
        this.productList =asyncData.traceResult.data;  // 缓存的数据
        this.$store.commit('SET_PRODUCTDATA_DATADETAIL', this.productList);
        // this.$store.commit('SET_PRODUCTDATA_PARTS', partsId);
      }else{
          if(self.$store.state.productNoData){
            self.showNoDataICon = self.$store.state.productNoData;
          }
          if(self.$store.state.productDataType){
            self.typeValue =this.$store.state.productDataType;
            self.activeIndex=this.$store.state.productDataIndex;
          }else{
            self.typeValue ="iPad";
            self.activeIndex=0;
          }
          if (self.$store.state.productDataParts.length != 0) {
            self.newParts = this.$store.state.productDataParts;
              var hash = {};
              self.newParts = self.newParts.reduce(function(item, next) {
                hash[next.modelId]
                  ? ""
                  : (hash[next.modelId] = true && item.push(next));
                  return item;
                }, []);
          } else {
            self.getInitModel();
            setTimeout(this.yanchi(),5000);
          }
      } 
  },

  mounted() {
    if(this.$store.state.productDataDetailList.length>0  
    ){
      this.productList =this.$store.state.productDataDetailList;
     
    }
    
  },
  methods: {
    ...mapActions([
        'deleteProcessCustomerList'
    ]),
    chooseStartTime(){
      this.$store.commit('SET_PRODUCTDATA_STARTTIME',this.startTime)
    },
    chooseEndTime(){
      this.$store.commit('SET_PRODUCTDATA_ENDTIME',this.endTime);
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
          sendData: data
        }
      });
    },
    
    yanchi() {
      //只做延迟，其他任何操作都没有
    },

    // 返回上一页
    back() {
      this.deleteProcessCustomerList();
      this.$store.commit("SET_SALERATIONODATA",false);
      if(sessionStorage.getItem('processList3') || sessionStorage.getItem('processList3All')){
        sessionStorage.removeItem('processList3');
        sessionStorage.removeItem('processList3All');
      }
      this.Cache = Cache.create("processCustomerInformation");
      this.Cache.del("processList").store();

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
      this.$store.commit('SET_PRODUCTDATA_TYPE',item);
      this.$store.commit('SET_PRODUCTDATA_INDEX',index);
      this.getInitModel();
    },
    // 去往选择机制页面
    goModelList() {
      this.$router.push({
        path: "/goodsModelList",
        query: {
          path: "productData",
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
          this.$store.commit('SET_PRODUCTDATA_PARTS',self.newParts); 
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
          "ks-newrep/InformationInfo/findInformationInfoOutputData.api",
          params
        )
        .then(res => {
            // this.showDrag =true;
            clearInterval(timer);
            this.number = 0; 
            this.isWaiting = false;
            let {msg,code,data} =res;
            if(code ==200){
              if (data.length == 0) {
                 this.showNoDataICon = true
              }else{
                this.showNoDataICon = false;
                this.productList =data;
                this.$store.commit('SET_PRODUCTDATA_DATADETAIL', this.productList);
              }
              this.$store.commit('SET_PRODUCTDATA_NODATA',this.showNoDataICon);
            }else if(code ==-404){
                this.showDrag =true;
            }else{
                this.errorMsg = msg;
            }          
        });
    },
     //启动异步任务机制
    startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"/productData",
          "traceParams" : {
                  partId:this.modelStrs,
                  startTime: this.startTime,
                  endTime: this.endTime
                },
          "traceApi":"http://ks-newrep/InformationInfo/findInformationInfoOutputData.api",
          "traceContext":{
                  manyModels:this.newParts,
                  title:"产出数据查询",
                  partId:this.modelStrs,
                  modelType:this.typeValue,
                  startTime: this.startTime,
                  endTime: this.endTime  
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
</style>
