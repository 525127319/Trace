<template>
  <div>
     <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>生产在制</h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <ul class="gray-list">
                         <div class="mache-type  no-bg">
                          <div  class="m-name">机种类型</div>
                          <div  class='m-val'>
                              <p>{{this.$route.query.modelType}}</p>
                          </div>
                        </div>      
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
                            <!-- <span class="value"  >{{this.$route.query.startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.startTime.split(' ')[1]}} </span> -->
                            <span class="value"  >{{this.$route.query.startTime}}</span>
                        </li>
                        <li>
                            <span class='key'>结束日期</span>
                            <!-- {{this.$route.query.endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.endTime.split(' ')[1]}} -->
                            <span class="value"  >{{this.$route.query.endTime}}</span>
                        </li>
                        <li>
                            <span class='key'>站点</span>
                            <span class="value" v-text="this.$route.query.terminalValue || '全部'"></span>
                        </li>

                    </ul>
                  
                    <p class="tab-num">
                      <span :class="{active:activeIndex==1}"  @click="showAll(1)">全部</span>
                      <span :class="{active:activeIndex==2}"  @click="showData(2)">7天内滞留数</span>
                      <span :class="{active:activeIndex==3}" @click="showMoreData(3)">7天外滞留数</span>
                    </p>
                    <div class="pie">
                         <!-- <h3 class="tit">制程名称：<span v-text="this.$route.query.processName"></span></h3> -->
                         <div class="showRate" v-if="this.progressData.length>0 || this.progressData2.length>0">
                            <div class="unquailified"><span class="square redCol"></span> <span class="redColor">不良率 <span v-text="unquailifiedRate"></span></span></div>
                            <div class="bad"><span class="square yellow"></span> <span class="yellowColor">报废率 <span v-text="brokenRare"></span></span></div>
                            <!-- <div class="unquailified"><span class="square redCol"></span> <span class="redColor">不良率 <span >100.00%</span></span></div>
                            <div class="bad"><span class="square yellow"></span> <span class="yellowColor">报废率 <span >100.00%</span></span></div> -->
                         </div>
                                 <!-- 绘画柱状图 继承父容器的大小 可以是百分比-->
                                 <div id="myChart" :style="{width: '100%', height: '86%'}"></div>
                                 <!-- 绘画柱状图  大小固定，写死 -->
                                 <!-- <div id="myChart" :style="{width: '300px', height: '300px'}"></div> -->
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
import Utils from "../../common/utils";
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      progressList: [], // 生产在制查询数据
      progressData: [], // 生产在制用于显示柱状图的数据
      progressData2: [], // 生产在制用于显示柱状图的数据，七天外
      progressData3: [], // 生产在制用于显示柱状图的数据,全部数据
      brokenRare: "", // 报废率
      errorMsg: "", //错误信息
      unquailifiedRate: "", // 不良率
      isWaiting: true,   
      activeIndex: 1, 
      number: 0,
      processName: "", // 后台返回的进程名
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
        text: "生产在制", //控制显示文本，空字符串表示显示默认文本
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

  //  this.getProgressList2(); // 获取生产在制查询情况，七天外的数据
    // this.getProgressList(); // 获取生产在制查询情况,默认情况是七天内的数据
    
  

    
    
  },
  mounted(){
      // this.showDrag = true;

    if(sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag){  
     this.isWaiting = false; // 异步过来的已经有数据了，不需要动画
      // 如果有缓存异步数据
    let asyncData =JSON.parse(sessionStorage.getItem("asyncResult"));
    asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
    asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
    // asyncData.traceResult.data = JSON.parse(asyncData.traceResult.data); // 转换成JSON格式
    console.log(asyncData,'缓存数据的获取')
    console.log(asyncData.traceContext ,'context')
    console.log(typeof asyncData.traceResult.data.productionManufactureVoList)
      //原传递给服务端的参数
      this.startTime = asyncData.traceContext.startTime;
      this.endTime = asyncData.traceContext.endTime;
      this.$route.query.partId = asyncData.traceContext.partId;
      this.terminalId = asyncData.traceContext.terminalId;
      this.$route.query.processId = asyncData.traceContext.processId;
      
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.production = asyncData.traceContext.production;
      this.$route.query.processDesc = asyncData.traceContext.processDesc;
      this.progressList3 = asyncData.traceResult.data.productionManufactureVoList;
      this.progressList = asyncData.traceResult.data.productionManufactureVoLister;
      this.progressList2 = asyncData.traceResult.data.productionManufactureVoListsan;
      this.$route.query.modelType=asyncData.traceContext.modelType;
      console.log(this.progressList2,'七天外的数据')

       // 全部数据
            // this.processName = res.data[0].processName; // 制程名
            this.progressData3.push(this.progressList3[0].scrapQty); // 报废数
            this.progressData3.push(this.progressList3[0].defectQty); // 不良数
            this.progressData3.push(this.progressList3[0].retentionQty); // 滞留数

            // 七天外数据
             this.progressData2.push(this.progressList2[0].scrapQty); // 报废数
            this.progressData2.push(this.progressList2[0].defectQty); // 不良数
            this.progressData2.push(this.progressList2[0].retentionQty); // 滞留数

            // 七天内数据
             this.progressData.push(this.progressList[0].scrapQty); // 报废数
            this.progressData.push(this.progressList[0].defectQty); // 不良数
            this.progressData.push(this.progressList[0].retentionQty); // 滞留数

              // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList3[0].scrapQty,
              this.progressList3[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList3[0].defectQty,
              this.progressList3[0].retentionQty
            ); // 不良率


            console.log(this.brokenRare, "aaa");
            console.log(this.unquailifiedRate, "bbb");

            this.drawLine3(); // 绘画柱状图全部数据的
       
    }else{
      this.getProgressAll(); // 获取全部数据
      
    }
  },
 
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
      if(sessionStorage.getItem('progressData')&&sessionStorage.getItem('progressData2')&&sessionStorage.getItem('progressData3')){
        sessionStorage.removeItem('progressData')
        sessionStorage.removeItem('progressData2')
        sessionStorage.removeItem('progressData3')

        sessionStorage.removeItem('unquailifiedRate')
        sessionStorage.removeItem('unquailifiedRate2')
        sessionStorage.removeItem('unquailifiedRate3')
        sessionStorage.removeItem('brokenRare')
        sessionStorage.removeItem('brokenRare2')
        sessionStorage.removeItem('brokenRare3')
      }
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
     cancelAsync(){
      this.showDrag = false;
    },
    showAll(index){
      this.activeIndex = index;
        //  this.progressData3=[];
      
      //  if(sessionStorage.getItem('progressData3')){
      //     this.progressData3 = JSON.parse(sessionStorage.getItem('progressData3'))
      //     this.brokenRare = sessionStorage.getItem('brokenRare3')
      //     this.unquailifiedRate = sessionStorage.getItem('unquailifiedRate3')
      //   }
       this.drawLine3(); // 绘画柱状图全部数据的
      // console.log(this.progressData3,'全部的数据')
      // console.log(this.unquailifiedRate,'全部的不良率')
      // console.log(this.brokenRare,'全部的报废率')
         // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList3[0].scrapQty,
              this.progressList3[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList3[0].defectQty,
              this.progressList3[0].retentionQty
            ); // 不良率
    },
    // 七天内的
    showData(index){
      this.activeIndex = index;
        // if(sessionStorage.getItem('progressData')){
        //   this.progressData = JSON.parse(sessionStorage.getItem('progressData'))
        //   this.brokenRare = sessionStorage.getItem('brokenRare')
        //   this.unquailifiedRate = sessionStorage.getItem('unquailifiedRate')
        // }
       this.drawLine(); // 绘画柱状图七天内的
      // console.log(this.progressData,'七天内的数据')
      // console.log(this.unquailifiedRate,'七天内的不良率')
      // console.log(this.brokenRare,'七天内的报废率')

        // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList[0].scrapQty,
              this.progressList[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList[0].defectQty,
              this.progressList[0].retentionQty
            ); // 不良率
    },
    // 七天外的
    showMoreData(index){
      this.activeIndex = index;
        //  if(sessionStorage.getItem('progressData2')){
        //   this.progressData2 = JSON.parse(sessionStorage.getItem('progressData2'))
        //   this.brokenRare = sessionStorage.getItem('brokenRare2')
        //   this.unquailifiedRate = sessionStorage.getItem('unquailifiedRate2')
        // }
      //    console.log(this.progressData2,'七天外的数据')
      // console.log(this.unquailifiedRate,'七天外的不良率')
      // console.log(this.brokenRare,'七天外的报废率')
            this.drawLine2(); // 绘画柱状图七天外的
      // console.log(this.progressData2,123456789)

         // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList2[0].scrapQty,
              this.progressList2[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList2[0].defectQty,
              this.progressList2[0].retentionQty
            ); // 不良率
    },


       ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"productionQuery",
          "traceParams" : {
                  partId: this.$route.query.partId, // 只做其中一个，到时更改即可
                  isWeek: '',
                  processId: this.$route.query.processId,
                  terminalId: this.$route.query.terminalId,
                  startTime: this.$route.query.startTime,
                  endTime: this.$route.query.endTime
                },
          "traceApi":"http://ks-trace/traceReport/queryProductionManufactureVo.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "生产在制查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  processName: this.$route.query.processName,
                  terminalId: this.terminalId,
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


    // 全部数据
     getProgressAll() {
     this.isWaiting = true;
       var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var info = {
        partId: this.$route.query.partId, // 只做其中一个，到时更改即可
        isWeek: '',
        processId: this.$route.query.processId,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime
      };
      this.$axiosHttp
        .axiosPost(
          "ks-trace/traceReport/queryProductionManufactureVo.api",
          info
        )
        .then(res => {
          // this.showDrag = true;
          console.log(res, '全部');
           clearInterval(timer);
           this.number = 0;
          this.isWaiting = false;
          this.progressData3 = []
          if (res.code == 200) {
             this.progressData3 = [];
            // this.progressList = res.data; // 生产在制查询数据
            this.progressList3 = res.data.productionManufactureVoList; // 全部数据
            this.progressList = res.data.productionManufactureVoLister; // 七天内数据
            this.progressList2 = res.data.productionManufactureVoListsan; // 七天外数据
           
            // 全部数据
            // this.processName = res.data[0].processName; // 制程名
            this.progressData3.push(this.progressList3[0].scrapQty); // 报废数
            this.progressData3.push(this.progressList3[0].defectQty); // 不良数
            this.progressData3.push(this.progressList3[0].retentionQty); // 滞留数

            // 七天外数据
             this.progressData2.push(this.progressList2[0].scrapQty); // 报废数
            this.progressData2.push(this.progressList2[0].defectQty); // 不良数
            this.progressData2.push(this.progressList2[0].retentionQty); // 滞留数

            // 七天内数据
             this.progressData.push(this.progressList[0].scrapQty); // 报废数
            this.progressData.push(this.progressList[0].defectQty); // 不良数
            this.progressData.push(this.progressList[0].retentionQty); // 滞留数


            console.log(this.progressData3,'全部数据新')


             // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList3[0].scrapQty,
              this.progressList3[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList3[0].defectQty,
              this.progressList3[0].retentionQty
            ); // 不良率


            console.log(this.brokenRare, "aaa");
            console.log(this.unquailifiedRate, "bbb");

            this.drawLine3(); // 绘画柱状图
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
    // 获取生产在制查询情况，默认情况是七天内的数据
    getProgressList() {
      // var timer = setInterval(() => {
      //   this.number = this.number + 1;
      // }, 1000);
      var info = {
        // partId: 1000004963, // 只做其中一个，到时更改即可
        // partId: 1000004963, // 只做其中一个，到时更改即可
        partId: this.$route.query.partId, // 只做其中一个，到时更改即可
        // processId: "100771",
        // processId: "100491",
        isWeek: 1,
        processId: this.$route.query.processId,
        // terminalId: "52204255",
        // terminalId: "",
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTimeZore,
        endTime: this.$route.query.endTimeZore
        // endTime: "2017-01-01 11:11:11"
      };
      this.$axiosHttp
        .axiosPost(
          "ks-trace/traceReport/queryProductionManufactureVo.api",
          info
        )
        .then(res => {
          console.log(res, '七天内');
          // clearInterval(timer);
           this.number = 0;
          this.isWaiting = false;
          this.progressData = []
          if (res.code == 200) {
            this.progressList = res.data; // 生产在制查询数据
            this.processName = res.data[0].processName; // 制程名
            this.progressData.push(this.progressList[0].scrapQty); // 报废数
            this.progressData.push(this.progressList[0].defectQty); // 不良数
            this.progressData.push(this.progressList[0].retentionQty); // 滞留数

            // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList[0].scrapQty,
              this.progressList[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList[0].defectQty,
              this.progressList[0].retentionQty
            ); // 不良率
            console.log(this.brokenRare, "aaa");
            console.log(this.unquailifiedRate, "bbb");
            sessionStorage.setItem('progressData',JSON.stringify(this.progressData))
            sessionStorage.setItem('brokenRare',this.brokenRare)
            sessionStorage.setItem('unquailifiedRate',this.unquailifiedRate)
            // this.drawLine(); // 绘画柱状图
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
     // 获取生产在制查询情况，默认情况是七天外的数据
    getProgressList2() {
      // var timer = setInterval(() => {
      //   this.number = this.number + 1;
      // }, 1000);
      var info = {
        // partId: 1000004963, // 只做其中一个，到时更改即可

        // partId: 1000004963, // 只做其中一个，到时更改即可

        partId: this.$route.query.partId, // 只做其中一个，到时更改即可
        // processId: "100771",

        // processId: "100491",
        isWeek: 2, // 七天外
        processId: this.$route.query.processId,
        // terminalId: "52204255",

        // terminalId: "",

        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTimeZore,
        endTime: this.$route.query.endTimeZore
        // endTime: "2017-01-01 11:11:11"
      };
      this.$axiosHttp
        .axiosPost(
          "ks-trace/traceReport/queryProductionManufactureVo.api",
          info
        )
        .then(res => {
          console.log(res, '七天外');
          // clearInterval(timer);
           this.number = 0;
          this.isWaiting = false;
             this.progressData2 = []
          if (res.code == 200) {
            this.progressList = res.data; // 生产在制查询数据
            this.processName = res.data[0].processName; // 制程名
            this.progressData2.push(this.progressList[0].scrapQty); // 报废数
            this.progressData2.push(this.progressList[0].defectQty); // 不良数
            this.progressData2.push(this.progressList[0].retentionQty); // 滞留数

            // 求得三项的百分比，取两位小数点
            this.brokenRare = Utils.drawProgressNum(
              this.progressList[0].scrapQty,
              this.progressList[0].retentionQty
            ); // 报废率
            this.unquailifiedRate = Utils.drawProgressNum(
              this.progressList[0].defectQty,
              this.progressList[0].retentionQty
            ); // 不良率

            console.log(this.brokenRare, "ccc");
            console.log(this.unquailifiedRate, "ddd");
             sessionStorage.setItem('progressData2',JSON.stringify(this.progressData2))
            sessionStorage.setItem('brokenRare2',this.brokenRare)
            sessionStorage.setItem('unquailifiedRate2',this.unquailifiedRate)
            // this.drawLine2(); // 绘画柱状图七天外的
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
    // 绘画柱状图，七天内数据
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      var progressData = this.progressData;
     
      // 绘制图表
      myChart.setOption({
        // 本坐标系特定的 tooltip 设定
        tooltip: {
          trigger: "axis", // 触发类型
          axisPointer: {
            // 坐标轴指示器配置项
            type: "shadow"
          }
        },
        // 例组件展现了不同系列的标记(symbol)，颜色和名字，看项目需求，一般不需要
        legend: {
          data: ["2011年", "2012年"]
        },
        grid: {
          // 控制图的位置
          left: "-5%",
          right: "15%",
          bottom: "16%",
          containLabel: true
        },
        xAxis: {
          name: "数量",
          type: "value",
          nameTextStyle: {
            // X轴的名称的样式，可以配置除了color,还有fontsize等等
            color: "rgba(0,0,0,.6)"
          },
          boundaryGap: [0, 0.01],
          nameGap: 2, //坐标轴名称与轴线之间的距离
          splitLine: { show: false }, //去除网格线
          splitNumber:4,
          //坐标轴设置
          axisLine: {
            show: true,
            onZero: true,
            //onZeroAxisIndex: ...,

            symbolSize: [30, 50],
            //轴线设置
            lineStyle: {
              color: "rgb(221,221,221)",
              width: 1,
              type: "solid", //'solid',dashed,dotted

              //shadowBlur: ...,
              //shadowColor: ...,
              shadowOffsetX: 0,
              shadowOffsetY: 0
              //opacity: ...,
            }
          },
          //坐标轴刻度设置
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: "auto",
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          //刻度标签设置
          axisLabel: {
            show: true,
            interval: "auto",
            //formatter: '{value}%',
            interval: "auto",
            inside: false, //刻度标签朝内还是朝外

            // margin: 35,//刻度标签与轴线之间的距离。
            formatter: function(value, index) {
              return value;
            },
            showMinLabel: null,
            showMaxLabel: null,
            color: "#000",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12,
            align: "bottom", //top,middle,bottom
            // verticalAlign: ...,
            // lineHeight: ...,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            shadowColor: "transparent",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            //  width: ...,
            //  height: ...,
            textBorderColor: "transparent",
            textBorderWidth: 0,
            textShadowColor: "transparent",
            textShadowBlur: 0,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          }
        },
        yAxis: {
          type: "category",
          data: ["报废数", "不良数", "滞留数"],
          splitLine: { show: false }, //去除网格线
          //坐标轴设置
          axisLine: {
            show: true,
            onZero: true,
            //onZeroAxisIndex: ...,

            symbolSize: [30, 50],
            //轴线设置
            lineStyle: {
              color: "rgb(221,221,221)",
              width: 1,
              type: "solid", //'solid',dashed,dotted

              //shadowBlur: ...,
              //shadowColor: ...,
              shadowOffsetX: 0,
              shadowOffsetY: 0
              //opacity: ...,
            }
          },
          //坐标轴刻度设置
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: "auto",
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          //刻度标签设置
          axisLabel: {
            show: true,
            interval: "auto",
            //formatter: '{value}%',
            interval: "auto",
            inside: false, //刻度标签朝内还是朝外

            margin: 45, //刻度标签与轴线之间的距离。
            formatter: function(value, index) {
              return value;
            },
            showMinLabel: null,
            showMaxLabel: null,
            color: "#000",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12,
            align: "bottom", //top,middle,bottom
            // verticalAlign: ...,
            // lineHeight: ...,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            shadowColor: "transparent",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            //  width: ...,
            //  height: ...,
            textBorderColor: "transparent",
            textBorderWidth: 0,
            textShadowColor: "transparent",
            textShadowBlur: 0,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            data: progressData,
            barWidth: 20,
            //顶部数字展示pzr

            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  var colorList = [
                    "rgb(255,49,39)", // 报废 红色
                    "rgb(255,143,33)", // 不良 橙色
                    "rgb(127,229,189)" // 滞留  浅绿
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //是否展示
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    fontFamily: "微软雅黑"
                  },
                  position: "right"
                }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
     
      
    },
     // 绘画柱状图，七天外数据
    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      var progressData = this.progressData2;
      // 绘制图表
      myChart.setOption({
        // 本坐标系特定的 tooltip 设定
        tooltip: {
          trigger: "axis", // 触发类型
          axisPointer: {
            // 坐标轴指示器配置项
            type: "shadow"
          }
        },
        // 例组件展现了不同系列的标记(symbol)，颜色和名字，看项目需求，一般不需要
        legend: {
          data: ["2011年", "2012年"]
        },
        grid: {
          // 控制图的位置
          left: "-5%",
          right: "15%",
          bottom: "16%",
          containLabel: true
        },
        xAxis: {
          name: "数量",
          type: "value",
          nameTextStyle: {
            // X轴的名称的样式，可以配置除了color,还有fontsize等等
            color: "rgba(0,0,0,.6)"
          },
          boundaryGap: [0, 0.01],
          splitNumber: 4,
          nameGap: 2, //坐标轴名称与轴线之间的距离
          splitLine: { show: false }, //去除网格线
          //坐标轴设置
          axisLine: {
            show: true,
            onZero: true,
            //onZeroAxisIndex: ...,

            symbolSize: [30, 50],
            //轴线设置
            lineStyle: {
              color: "rgb(221,221,221)",
              width: 1,
              type: "solid", //'solid',dashed,dotted

              //shadowBlur: ...,
              //shadowColor: ...,
              shadowOffsetX: 0,
              shadowOffsetY: 0
              //opacity: ...,
            }
          },
          //坐标轴刻度设置
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: "auto",
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          //刻度标签设置
          axisLabel: {
            show: true,
            interval: "auto",
            //formatter: '{value}%',
            interval: "auto",
            inside: false, //刻度标签朝内还是朝外

            // margin: 35,//刻度标签与轴线之间的距离。
            formatter: function(value, index) {
              return value;
            },
            showMinLabel: null,
            showMaxLabel: null,
            color: "#000",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12,
            align: "bottom", //top,middle,bottom
            // verticalAlign: ...,
            // lineHeight: ...,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            shadowColor: "transparent",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            //  width: ...,
            //  height: ...,
            textBorderColor: "transparent",
            textBorderWidth: 0,
            textShadowColor: "transparent",
            textShadowBlur: 0,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          }
        },
        yAxis: {
          type: "category",
          data: ["报废数", "不良数", "滞留数"],
          splitLine: { show: false }, //去除网格线
          //坐标轴设置
          axisLine: {
            show: true,
            onZero: true,
            //onZeroAxisIndex: ...,

            symbolSize: [30, 50],
            //轴线设置
            lineStyle: {
              color: "rgb(221,221,221)",
              width: 1,
              type: "solid", //'solid',dashed,dotted

              //shadowBlur: ...,
              //shadowColor: ...,
              shadowOffsetX: 0,
              shadowOffsetY: 0
              //opacity: ...,
            }
          },
          //坐标轴刻度设置
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: "auto",
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          //刻度标签设置
          axisLabel: {
            show: true,
            interval: "auto",
            //formatter: '{value}%',
            interval: "auto",
            inside: false, //刻度标签朝内还是朝外

            margin: 45, //刻度标签与轴线之间的距离。
            formatter: function(value, index) {
              return value;
            },
            showMinLabel: null,
            showMaxLabel: null,
            color: "#000",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12,
            align: "bottom", //top,middle,bottom
            // verticalAlign: ...,
            // lineHeight: ...,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            shadowColor: "transparent",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            //  width: ...,
            //  height: ...,
            textBorderColor: "transparent",
            textBorderWidth: 0,
            textShadowColor: "transparent",
            textShadowBlur: 0,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            data: progressData,
            // data: [1,2,3],
            barWidth: 20,
            //顶部数字展示pzr

            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  var colorList = [
                    "rgb(255,49,39)", // 报废 红色
                    "rgb(255,143,33)", // 不良 橙色
                    "rgb(127,229,189)" // 滞留  浅绿
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //是否展示
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    fontFamily: "微软雅黑"
                  },
                  position: "right"
                }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
      // 绘画柱状图，全部数据
    drawLine3() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      var progressData = this.progressData3;
      // 绘制图表
      myChart.setOption({
        // 本坐标系特定的 tooltip 设定
        tooltip: {
          trigger: "axis", // 触发类型
          axisPointer: {
            // 坐标轴指示器配置项
            type: "shadow"
          }
        },
        // 例组件展现了不同系列的标记(symbol)，颜色和名字，看项目需求，一般不需要
        legend: {
          data: ["2011年", "2012年"]
        },
        grid: {
          // 控制图的位置
          left: "-5%",
          right: "15%",
          bottom: "16%",
          containLabel: true
        },
        xAxis: {
          name: "数量",
          type: "value",
          nameTextStyle: {
            // X轴的名称的样式，可以配置除了color,还有fontsize等等
            color: "rgba(0,0,0,.6)"
          },
          boundaryGap: [0, 0.01],
           splitNumber:4,
          nameGap: 2, //坐标轴名称与轴线之间的距离
          splitLine: { show: false }, //去除网格线
          //坐标轴设置
          axisLine: {
            show: true,
            onZero: true,
            //onZeroAxisIndex: ...,

            symbolSize: [30, 50],
            //轴线设置
            lineStyle: {
              color: "rgb(221,221,221)",
              width: 1,
              type: "solid", //'solid',dashed,dotted

              //shadowBlur: ...,
              //shadowColor: ...,
              shadowOffsetX: 0,
              shadowOffsetY: 0
              //opacity: ...,
            }
          },
          //坐标轴刻度设置
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: "auto",
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          //刻度标签设置
          axisLabel: {
            show: true,
            interval: "auto",
            //formatter: '{value}%',
            interval: "auto",
            inside: false, //刻度标签朝内还是朝外

            // margin: 35,//刻度标签与轴线之间的距离。
            formatter: function(value, index) {
              return value;
            },
            showMinLabel: null,
            showMaxLabel: null,
            color: "#000",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12,
            align: "bottom", //top,middle,bottom
            // verticalAlign: ...,
            // lineHeight: ...,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            shadowColor: "transparent",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            //  width: ...,
            //  height: ...,
            textBorderColor: "transparent",
            textBorderWidth: 0,
            textShadowColor: "transparent",
            textShadowBlur: 0,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          }
        },
        yAxis: {
          type: "category",
          data: ["报废数", "不良数", "滞留数"],
          splitLine: { show: false }, //去除网格线
          //坐标轴设置
          axisLine: {
            show: true,
            onZero: true,
            //onZeroAxisIndex: ...,

            symbolSize: [30, 50],
            //轴线设置
            lineStyle: {
              color: "rgb(221,221,221)",
              width: 1,
              type: "solid", //'solid',dashed,dotted

              //shadowBlur: ...,
              //shadowColor: ...,
              shadowOffsetX: 0,
              shadowOffsetY: 0
              //opacity: ...,
            }
          },
          //坐标轴刻度设置
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: "auto",
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          //刻度标签设置
          axisLabel: {
            show: true,
            interval: "auto",
            //formatter: '{value}%',
            interval: "auto",
            inside: false, //刻度标签朝内还是朝外

            margin: 45, //刻度标签与轴线之间的距离。
            formatter: function(value, index) {
              return value;
            },
            showMinLabel: null,
            showMaxLabel: null,
            color: "#000",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            fontSize: 12,
            align: "bottom", //top,middle,bottom
            // verticalAlign: ...,
            // lineHeight: ...,
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            shadowColor: "transparent",
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            //  width: ...,
            //  height: ...,
            textBorderColor: "transparent",
            textBorderWidth: 0,
            textShadowColor: "transparent",
            textShadowBlur: 0,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          }
        },
        series: [
          {
            name: "",
            type: "bar",
            data: progressData,
            // data: [1,2,3],
            barWidth: 20,
            //顶部数字展示pzr

            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  var colorList = [
                    "rgb(255,49,39)", // 报废 红色
                    "rgb(255,143,33)", // 不良 橙色
                    "rgb(127,229,189)" // 滞留  浅绿
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //是否展示
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    fontFamily: "微软雅黑"
                  },
                  position: "right"
                }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
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
.pie .showRate {
  position: absolute;
  top: 1rem;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  display: flex;
  justify-content: center;
  /* text-align: center; */
  /* background-color: hotpink; */
}
.pie .showRate .unquailified {
  /* position: absolute; */
  /* left: 18%; */
  /* width: 30%; */
  height: 2rem;
  line-height: 2rem;
  margin-right: 1rem;
}
.pie .showRate .bad {
  /* position: absolute; */
  /* right: 18%; */
  /* width: 30%; */
  height: 2rem;
  line-height: 2rem;
  margin-left: 1rem;
}
.pie .showRate .redColor {
  color: rgb(255, 143, 33);
}
.pie .showRate .yellowColor {
  color: rgb(255, 49, 39);
}
.pie .showRate .square {
  display: inline-block;
  width: 0.8rem;
  height: 0.4rem;
}
.redCol {
  background: rgb(255, 143, 33);
}
.yellow {
  background: rgb(255, 49, 39);
}
.chartWrap {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}
/* .tab-lazy{
  position: relative;
  min-height: 2.5rem;
  background-color:white;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  color: rgba(0,0,0,0.53);
  border-bottom: 1px solid rgba(0,0,0,0.1);
  font-size: 12px;
}
.tab-lazy span{
  position: relative;
  display: block;
  width: 14px;
  min-width: 14px;
  height: 14px;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 2px;
  margin-right: 0.5rem;
  font-size: 12px;
  text-align: 14px;
}
.tab-lazy.c span{
  border-color: #ff7e00;
  line-height: 12px;
  
}
.tab-lazy.c span:before{

  content: '\e927';
  color: #ff7e00;
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} */
.tab-num{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 3.25rem;
  min-height: 3.25rem;
  background-color: white;
  padding:  0 1rem;
}
.tab-num span{
  display: block;
  height: 1.75rem;
  line-height:1.75rem;
  margin-left: 1rem;
  font-size: 12px;
  padding: 0 1rem;
  margin-top: 0.5rem;
  border-radius: 2px;
 
  color: rgba(0,0,0,0.53);
  background-color: #ffebd7;
  color: #ff7e00;
}
.tab-num span.active{
  background-color: #ff7e00;
  color: #ffffff;
}
  .c-name{
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
    margin-top: 4px;
    text-align: right;
  }
</style>


