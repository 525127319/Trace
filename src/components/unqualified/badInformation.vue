<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>不良信息</h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <ul class="gray-list">
                        <li>
                            <span class='key'>机种类型</span>
                             <span>{{this.$route.query.modelType}}</span>
                        </li>                     
                        <li>
                            <span class='key'>机种</span>
                            <div  class='m-val'>
                               <p class="e-name" ><span v-text="this.$route.query.modelName || 'Thor TC'"></span> <span v-text="this.$route.query.upccode || 'Sparrow'"></span></p>
                          <p class="c-name" v-text="this.$route.query.partNo ||'604-05132'"> </p>
                            </div>
                        </li>
                        <li>
                            <span class='key'>制程</span>
                             <span class="value" v-text="this.$route.query.processName"></span>
                        </li>
                        <li>
                            <span class='key'>开始日期</span>
                             <span class="value" >{{ this.$route.query.startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.startTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>结束日期</span>
                            <span class="value" >{{ this.$route.query.endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.endTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>站点</span>
                            <span class="value" v-text="this.$route.query.terminalValue || '全部'"></span>
                        </li>

                    </ul>
                    <div class="select-list open " > 
                        <p class="tit" @click="showBadInformation">
                            <span>不良统计</span>
                            <span class=" icon-down" :class="{icon:isshowBadInformation}">  </span>
                        </p>
                         
                                <ul class="bad-list" v-show="isshowBadInformation">
                                    <li v-for="(item,index) in badInformationList" :key="index" @click="badInformationDetail(item)">
                                        <p>
                                            <span class="en-del" v-text="item.englishDefectDesc"></span>
                                            <span class="bad-type">不良：<span v-text="item.defectQty"></span></span>
                                        </p>
                                        <p>
                                            <span class="cn-del" v-text="item.chineseDefectDesc"></span>
                                            <span class="person">报废：<span style="padding-right:0" v-text="item.scrapQty"></span></span>
                                        </p>
                                    </li>
                                </ul>
                   
                    </div>
                    <div class="select-list open" >
                        <p class="tit" @click="showDuty">
                            <span> 责任归属统计</span>
                            <span class="icon-down" :class="{icon:isshowDuty}"> </span>
                        </p>
                        <ul class="bad-for" v-show="isshowDuty">
                            <!-- <li v-for="(item,index) in dutyList" :key="index" @click="dutyDetail(item)"> -->
                            <li v-for="(item,index) in dutyList" :key="index" >
                                <p v-text="item.responsibilityUnit"></p>
                                <p>
                                    <span class="bad">不良: {{item.defectQty}}</span>
                                    <span class="scrap"> 报废: {{item.scrapQty}}</span>
                                </p>
                            </li>
                           
                        </ul>
                    </div>

                </div>
            </section>
        </section>
         <popup :errorMsg="errorMsg" ></popup>
         <waiting v-show="isWaiting" :number="number"></waiting>
         <asyncPop v-show="showDrag" ></asyncPop>
    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      badInformationList: [], // 不良统计项数据
      dutyList: [], // 责任归属统计数据
      isshowBadInformation: false, // 展开与收缩不良信息列表
      isshowDuty: false, // 展开与收缩责任归属列表
      isWaiting: true,
      number: 0,
      errorMsg: "", //错误信息
      showDrag: false, // 是否弹窗提示异步加载任务
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
        text: "不良信息", //控制显示文本，空字符串表示显示默认文本
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


    this.isshowBadInformation = sessionStorage.getItem("isshowBadInformation");

    
        //  this.showDrag = true;

   if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){  
     this.isWaiting = false; // 异步过来的已经有数据了，不需要动画
      // 如果有缓存异步数据
    let asyncData =JSON.parse(sessionStorage.getItem("asyncResult"));
    asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
    asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
    console.log(asyncData,'缓存数据的获取')
    console.log(asyncData.traceContext ,'context')
    console.log(typeof asyncData)
      //原传递给服务端的参数
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
      this.$route.query.partId = asyncData.traceContext.partId;
      this.$route.query.terminalId = asyncData.traceContext.terminalId;
      this.$route.query.processId = asyncData.traceContext.processId;
      
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.modelType=asyncData.traceContext.modelType;
       //将制程数据渲染到界面
       this.badInformationList = asyncData.traceResult.data.queryDefectInfo; // 不良统计项数据
       this.dutyList = asyncData.traceResult.data.dutyBelongVoList; // 责任归属统计数据
        this.dutyList.forEach(element => {
          if (element.responsibilityUnit == null) {
            element.responsibilityUnit = this.$route.query.processName;
            }
         });
         console.log(typeof asyncData.traceResult , '看看格式')
      //控制是否显示“选择制程”面板

    

    } else {
       this.getBadInformation(); // 获取不良信息数据
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
     cancelAsync(){
      this.showDrag = false;
    },

          ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"badInformation",
          "traceParams" : {
                  partId: this.$route.query.partId,
                  processId: this.$route.query.processId,
                  terminalId: this.$route.query.terminalId,
                  startTime: this.$route.query.startTime,
                  endTime: this.$route.query.endTime
                },
          "traceApi":"http://ks-trace/traceReport/queryDefectInfoVo.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "不良信息查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  processName: this.$route.query.processName,
                  terminalId: this.$route.query.terminalId,
                  processId: this.$route.query.processId,
                  modelType:this.$route.query.modelType
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


    // 获取不良信息数据
    getBadInformation() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        partId: this.$route.query.partId,
        processId: this.$route.query.processId,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryDefectInfoVo.api", data)
        .then(res => {
          //  this.showDrag = true;
          console.log(res);
          clearInterval(timer);
           this.number = 0;
          this.isWaiting = false;
          if (res.code == 200) {
            this.badInformationList = res.data.queryDefectInfo; // 不良统计项数据
            this.dutyList = res.data.dutyBelongVoList; // 责任归属统计数据
            this.dutyList.forEach(element => {
              if (element.responsibilityUnit == null) {
                element.responsibilityUnit = this.$route.query.processName;
              }
            });
            if (
              this.badInformationList.length === 0 &&
              this.dutyList.length === 0
            ) {
              this.errorMsg = "没有数据";
            }
          } else if (res.code == 500) {
            this.errorMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
               this.showDrag = true;
          } else {
            this.errorMsg = res.msg;
          }
        });
    },

    // 展开和收缩不良统计信息
    showBadInformation() {
      this.isshowBadInformation = !this.isshowBadInformation;
      this.isshowDuty = false;
    },
    // 展开和收缩责任归属信息
    showDuty() {
      this.isshowDuty = !this.isshowDuty;
      this.isshowBadInformation = false;
    },
    // 去往不良统计信息详情页面
    badInformationDetail(item) {
      sessionStorage.setItem("isshowBadInformation", this.isshowBadInformation);

      this.$router.push({
        path: "badInformationDetail",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          terminalId: this.$route.query.terminalId,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode,
          defectCode: item.defectCode
        }
      });
    },
    // 去往责任归属统计信息详情页面
    dutyDetail(item) {
      this.$router.push({
        path: "dutyDetail",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          terminalId: this.$route.query.terminalId,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          responsibilityUnit: item.responsibilityUnit
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
    .c-name{
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
    margin-top: 4px;
    text-align: right;
  }
</style>


