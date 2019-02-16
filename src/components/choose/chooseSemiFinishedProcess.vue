<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>选择制程</h1>
            <span class="right">
                
            </span>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <ul class="gray-list">
                        <li>
                            <span class='key'>机种</span>
                             <div  class='m-val'>
                              <p class="e-name" ><span v-text="this.$route.query.modelName"></span> <span v-text="this.$route.query.upccode"></span></p>
                               <p class="c-name" v-text="this.$route.query.partNo"> </p>
                            </div>
                        </li>

                        <li>
                            <span class='key'>开始日期</span>
                            <span class="value" >{{this.$route.query.startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.startTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>结束日期</span>
                            <span class="value" >{{this.$route.query.endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.endTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>类别</span>
                            <span class="value" v-text="this.$route.query.selectTypeValue"></span>
                        </li>
                        <li>
                            <span class='key'>料仓</span>
                            <span class="value" v-text="this.$route.query.warehouseValue"></span>
                        </li>

                    </ul>
                    <!-- <div class="form">
                        <h3 class="form-title">选择制程</h3>
                        <ul class="program-list">
                          <li class="program-list-item" v-for="(item,index) in processList" :key="index" @click="selectProcess(item)">
                               
                                <span class="image" :class="item.smallIcon"></span>
                                <span class="name" v-text="item.processName">
                                </span>
                            </li>
                           
                        </ul>
                    </div> -->
                     <div class="form" >
                        <h3 class="form-title">选择制程 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>                       
                        <ul class="m-pro-list">
                          <li class="m-pro-list-item" v-for="(item,index) in processList" :key="index" @click="toChooseTerminal(item)" > 
                              <span class="type-icon " :class="{repar:item.operateId==1001,product:item.operateId==1006,inproducts:item.operateId==1008,warehouse:item.operateId==1004||1007||1009||1010,qc:item.operateId==1003,other:item.operateId==1005,pack:item.operateId==1002}"></span>
                              <div class="t-name">
                                <p class="en" v-text="item.processName">BVCS Post ANO1 QC</p>
                                <p class="cn" v-text="item.processDesc">BVCS 一次投入</p>
                              </div>
                              <div class="r-num" v-show="status == '全部'">
                                <span class="num r" v-text="item.allNum" >80</span>
                                <span class="tex">全部数量</span>
                              </div>
                             <div class="r-num" v-show="status == 'OK'">
                                <span class="num r" v-text="item.okqty" >80</span>
                                <span class="tex">OK数量</span>
                              </div>
                            <div class="r-num" v-show="status == 'NG'">
                              <span class="num r" v-text="item.ngqty" >80</span>
                              <span class="tex">NG数量</span>
                            </div>
                             <div class="r-num" v-show="status =='报废'">
                              <span class="num r" v-text="item.scrapqty" >80</span>
                              <span class="tex">报废数量</span>
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

    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";

export default {
  data() {
    return {
      processList: [], // 制程数据
      isWaiting: true,
      selectActive: false,
       showNoData: false, // 显示数据不为0的数据有的时候显示
      number: 0,
      errorMsg: "", //错误信息
      status: this.$route.query.selectTypeValue,
      showH5Title: true // 是否显示H5的头部，默认显示
    };
  },
  created() {
    console.log(this.$route.query,'什么参数');
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
        text: "通用查询", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });
      // 设置右侧按钮
      this.IM.setRight({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "0", //0：文字     1：图标   （必传）
        text: "", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });


    if (sessionStorage.getItem("processList6")) {
      this.processList = JSON.parse(sessionStorage.getItem("processList6"));
        this.isWaiting = false;
    }else{
    this.checkProcess(); // 查询制程
      
    }
    if (
      sessionStorage.getItem("modelName6") &&
      sessionStorage.getItem("upccode6")
    ) {
      this.$route.query.modelName = sessionStorage.getItem("modelName6");
      this.$route.query.upccode = sessionStorage.getItem("upccode6");
    }
    console.log(this.$route.query.modelName, 123);
    console.log(this.$route.query.upccode, 1234);
    console.log(this.$route.query.partNo, 12345);
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
  },
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    // 全部数据
    filterAll() {
      this.selectActive = true;
      if (sessionStorage.getItem("processList6All")) {
        this.processList = [];
        this.processList = JSON.parse(sessionStorage.getItem("processList6All"));
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
      if (this.status == "全部") {
        let newArray = [];
        this.processList.forEach((val, index) => {
          if (val.allNum != "0") {
            newArray.push(val);
          }
        });
        this.processList = [];
        this.processList = newArray;
      } else if (this.status == "OK") {
        let newArray = [];
        this.processList.forEach((val, index) => {
          if (val.okqty != "0") {
            newArray.push(val);
          }
        });
        this.processList = [];
        this.processList = newArray;
      } else if (this.status == "NG") {
        let newArray = [];
        this.processList.forEach((val, index) => {
          if (val.ngqty != "0") {
            newArray.push(val);
          }
        });
        this.processList = [];
        this.processList = newArray;
      } else if (this.status == "报废") {
        let newArray = [];
        this.processList.forEach((val, index) => {
          if (val.scrapqty != "0") {
            newArray.push(val);
          }
        });
        this.processList = [];
        this.processList = newArray;
      }
        sessionStorage.setItem(
              "processList6",
              JSON.stringify(this.processList)
            );
             if(this.processList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
    },
    // 查询制程
    checkProcess() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        // partId: "1000004968", // 只做其中一个，到时更改即可
        partId: this.$route.query.partId, // 只做其中一个，到时更改即可
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        whType: 2 // 代表半成品
      };
      this.$axiosHttp
        .axiosPost("ks-rinse/rinse/queryCommonInfoProcess.api", data)
        .then(res => {
          console.log(res);
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          if (res.code == 200) {
            this.processList = res.data; // 制程数据
            sessionStorage.setItem(
              "processList6All",
              JSON.stringify(this.processList)
            );
             this.filterData()
          } else if (res.code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
            this.errorMsg = "数据较大，请稍后重试";
          } else {
            this.errorMsg = res.msg;
          }
        });
    },
    // 选择制程 去往半成品仓选择站点页面
    toChooseTerminal(item) {
      sessionStorage.setItem("modelName6", this.$route.query.modelName);
      sessionStorage.setItem("upccode6", this.$route.query.upccode);
       if(sessionStorage.getItem('siteList6All')&&sessionStorage.getItem('siteList6')){
           sessionStorage.removeItem('siteList6All')
           sessionStorage.removeItem('siteList6')
           this.siteList=[]
       }
      this.$router.push({
        path: "chooseSemiFinishTerminal",
        query: {
          processId: item.processId, // 制程ID
          partId: this.$route.query.partId, // 机种ID
          operateId: item.operateId, // 制程类型
          processDesc: item.processDesc, // 制程中文描述
          processName: item.processName, // 制程名
          typeIndex: this.$route.query.typeIndex,
          badnessCount: item.badnessCount, // 不良信息总数
          modelName: this.$route.query.modelName, //机种名
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo, // 机种号码
          selectTypeValue: this.$route.query.selectTypeValue,
          selectTypeList: this.$route.query.selectTypeList,
          warehouseValue: this.$route.query.warehouseValue,
          // sTime: this.sTime, // 开始时间（传参用）
          // eTime: this.eTime, // 开始时间（传参用）
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime
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
