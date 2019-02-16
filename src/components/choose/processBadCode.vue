<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>不良代码</h1>
             <span class="right" @click="search">
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <li class="y_select" style="margin:0;border-top:1px solid rgba(0, 0, 0, 0.05)">
                        <span class="y_select-text">类型选择</span>
                        <div class="y_select-r" >
                            <div v-for="(item,index) in modelType" :key="index">
                               <label for="y_radio1"  :class="{'act':activeIndex == index}" @click="selecType(item,index)">{{item}}</label>                  
                            </div>
                        </div>
                    </li>
                    <div class="mache-type c" @click="tochooseModel">
                        <!-- <div  class="m-name">机种选择</div>
                        <div  class='m-val'>
                           <p class="e-name" ><span v-text="this.$route.query.modelName"></span> <span v-text="this.$route.query.upccode"></span></p>
                          <p class="c-name" v-text="this.$route.query.partNo"> </p>
                        </div>
                        <span class="icon icon-right"></span> -->
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
                    <div class="form" style="margin-top:-1rem;">
                        <h3 v-show="showSelectProcess" class="form-title">选择制程   <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>                       
                        <ul class="m-pro-list">
                          <li class="m-pro-list-item" v-for="(item,index) in processList" :key="index" @click="toChooseTerminal(item)" > 
                              <span class="type-icon " :class="{repar:item.operateId==1001,product:item.operateId==1006,inproducts:item.operateId==1008,warehouse:item.operateId==1004||1007||1009||1010,qc:item.operateId==1003,other:item.operateId==1005,pack:item.operateId==1002}"></span>
                              <div class="t-name">
                                <p class="en" v-text="item.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="item.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num">
                                <span class="num r" v-text="item.badnessCount">80</span>
                                <span class="tex">不良项总数</span>
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
     
    </article>
        <div class="pop" v-show="processBadCodePrompt">
        <!-- 我知道 -->
        <div class="ok"  @click="handlePrompt"></div>
        <!-- 点击查询 -->
        <div class="inquire"></div>
        <!-- 选择机种 -->
        <div class="select-jz"></div>
    </div>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import moment from "moment";
export default {
  data() {
    return {
      bcModels:[],
      modelType: ["iPad", "Protable"], //类型选择
      activeIndex: 0, //类型索引
      typeValue: "", //类型属性值
      processBadCodePrompt:true,
      processList: [], // 制程数据
      isWaiting: false,
      cover: false,
      selectActive: false,
      showSelectProcess: false, // 选择制程
        showNoData: false, // 显示数据不为0的数据有的时候显示
      number: 0,
      errorMsg: "", //错误信息
      startTime: "", // 开始时间 2018-01-30T11:00:52.738
      endTime: "", // 结束时间
      showH5Title: true // 是否显示H5的头部，默认显示
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
        text: "不良代码", //控制显示文本，空字符串表示显示默认文本
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
  
    if (self.$store.state.processBadCodeType) {
      self.typeValue = this.$store.state.processBadCodeType;
      self.activeIndex = this.$store.state.processBadCodeIndex;
     
    } else {
      self.typeValue = "iPad";
      self.activeIndex = 0;
    }

    if (Object.keys(self.$store.state.processBadCodeModel).length != 0) {
      self.bcModels.push(self.$store.state.processBadCodeModel);
    } else {
      self.getinitModel();
    }

   
    if (sessionStorage.getItem("processList1")) {
      this.processList = JSON.parse(sessionStorage.getItem("processList1"));
      if(this.processList.length>0){
        this.showSelectProcess = true;
        
      }

      // this.$route.query.modelName = sessionStorage.getItem('modelName1')
      // this.$route.query.upccode = sessionStorage.getItem('upccode1')
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
     if(localStorage.getItem('processBadCodePrompt') =='false'){
       this.processBadCodePrompt=false;
    }
  },
  methods: {
     selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_PROCESSBADCODE_TYPE", item);
      this.$store.commit("SET_PROCESSBADCODE_INDEX", index);
      this.getinitModel();
    },
     handlePrompt(){
        this.processBadCodePrompt=false;
        localStorage.setItem('processBadCodePrompt',this.processBadCodePrompt);
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
             this.$store.commit('SET_PROCESSBADCODE_ITEM',data[0]);
          } else {
            this.errorMsg = msg;
          }
        });
    },
    // 返回上一页
    back() {
     
      if(sessionStorage.getItem('processList1All')||sessionStorage.getItem('processList1')){
        sessionStorage.removeItem('processList1All')
        sessionStorage.removeItem('processList1')
      }
      this.$router.push({
        path: "index"
      });
       this.processBadCodePrompt=false;
      localStorage.setItem('processBadCodePrompt',this.processBadCodePrompt);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    // 去往选择机制页面
    tochooseModel() {
      this.$router.push({
        path: "/badModelList",
        query: {
          path: this.$route.query.path, // 判断是哪个流程进来的
          type: this.typeValue,
          target:"processBadCode"
        }
      });
    
    },
    // 选择开始时间
    chooseStartTime() {
      this.startTime = moment(this.startTime).format("YYYY-MM-DD HH:mm");
    },
    // 选择结束时间
    chooseEndTime() {
      this.endTime = moment(this.endTime).format("YYYY-MM-DD HH:mm");
    },
    // 全部数据
    filterAll() {
      this.selectActive = true;
      if (sessionStorage.getItem("processList1All")) {
        this.processList = [];
        this.processList = JSON.parse(sessionStorage.getItem("processList1All"));
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
              "processList1",
              JSON.stringify(this.processList)
            );
             if(this.processList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
    },
    // 点击查询按钮，出来制程数据
    search() {
       clearInterval(timer);
       this.selectActive = false;
       if(sessionStorage.getItem('processList1All')&&sessionStorage.getItem('processList1')){
           sessionStorage.removeItem('processList1All')
           sessionStorage.removeItem('processList1')
           this.processList=[]
           this.showSelectProcess = false;
           
       }
      this.isWaiting = true;
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);

      const info = {
        // partId: this.$route.query.partId
        partId:this.bcModels[0].modelId
        // startTime: this.startTime,
        // endTime: this.endTime
        //  startTime: "2013-12-12 12:00:00",
        // endTime: "2013-12-13 12:00:00"
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceSort/queryBadnessCodeProcess.api", info)
        .then(res => {
          console.log(res);
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
           this.filterData()
          let { code, msg, data } = res;
          if (code == 200) {
            this.processList = data;
            sessionStorage.setItem(
              "processList1All",
              JSON.stringify(this.processList)
            );
             this.filterData()
            this.showSelectProcess = true;
            if (data.length == 0) {
              this.errorMsg = "没有数据";
            }
          } else if (code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (code == -404) {
            this.errorMsg = "数据较大，请稍后重试";
          } else {
            this.errorMsg = res.msg;
          }
        });
    },

    // 点击制程，去往不良代码查询页面
    toChooseTerminal(item) {
      sessionStorage.setItem("modelName1", this.$route.query.modelName);
      sessionStorage.setItem("upccode1", this.$route.query.upccode);
      //   if (
      //   this.$route.query.modelName == undefined &&
      //   this.$route.query.partNo == undefined
      // ) {
      //   console.log(this.$route.query.modelName);
      //   console.log(this.$route.query.partNo);
      //   this.errorMsg = "请选择机种";
      //   return;
      // }
      this.$router.push({
        path: "badCodeDetail",
        query: {
          processId: item.processId, // 制程ID
          partId: this.bcModels[0].modelId, // 机种ID
          operateId: item.operateId, // 制程类型
          processDesc: item.processDesc, // 制程中文描述
          processName: item.processName, // 制程名
          badnessCount: item.badnessCount, // 不良信息总数
          modelName: this.$route.query.modelName, //机种名
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo, // 机种号码
          startTime: this.startTime, // 开始时间
          endTime: this.endTime // 结束时间
        }
      });

    }
  },
  components: {
    popup,
    waiting
  }
};
</script>
<style scoped>
  .select-jz{
    top: 50px;
    left: 5rem;
  }
</style>


