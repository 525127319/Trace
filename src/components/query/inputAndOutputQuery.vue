<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>投入产出</h1>
        </nav>
        <section class="section">

            <section class="main">
                <div class="content-box">
                    <div class="mache-type  no-bg">
                      <div  class="m-name">机种类型</div>
                      <div  class='m-val'>
                          <p>{{this.$route.query.modelType}}</p>
                      </div>
                    </div>      
                    <ul class="gray-list">
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
                        <ul class="time-selects">
                      <li style="border-bottom:none">
                        <span  class="key">开始时间</span>
                        <div class="val">
                            <span  class="s-time" v-text="this.$route.query.startTime">2018-03-02</span>
                            <!-- <input type="date" name="" id="" v-model="startTime">  -->
                        </div>
                        <div class="d-n" >
                            <span class="day" v-show='this.$route.query.startShow'>白班</span>
                            <span class='night' v-show='!this.$route.query.startShow'>晚班</span>
                        </div>
                      </li>
                      <li style="border-bottom:none">
                        <span  class="key">结束时间</span>
                        <div class="val">   
                              <span  class="s-time" v-text="this.$route.query.endTime">2018-03-02</span>
                              <!-- <input type="date" name="" id="" v-model="endTime">                        -->
                        </div>
                        <div class="d-n" >
                            <span class="day" v-show="this.$route.query.endShow">白班</span>
                            <span class='night' v-show='!this.$route.query.endShow'>晚班</span>
                        </div>
                      </li>
                    </ul>
                        <li>
                            <span class='key'>站点</span>
                            <span class="value" v-text="this.$route.query.terminalValue || '全部'"></span>
                        </li>

                    </ul>
                    <!-- <div class="detial-bar" :class="[{detialBar:isDetailBar},{detailBar2:isDetailBar2},{detailBar3:isDetailBar3}]"> -->
                    <div class="detial-bar" :style="{height:height + 'rem'}" v-show="typeList.length !=0">
                        <div class="con-btn">
                            <span @click="showPopupDetail()">查看当前明细</span>
                            <span @click="showPopupDistribution()">查看制程分布</span>
                        </div>
                        <span class="progressNum">途程序号：<span v-text="routeSeqList"></span></span>

                           <!-- 绘画柱状图 -->
                         <div id="myChart" :style="{width: '100%', height: '86%'}" ></div>
                    </div>
                </div>
            </section>
        </section>

    </article>
<!-- 弹窗 -->
    <div class="mask" v-show="isshowPopupDetail" v-if="isshowPopupDetail" @click="closePopup"></div>
    <aside class="select" v-show="isshowPopupDetail">
        <h3 class="title">
            选择类型
        </h3>
        <p @click="toinputOutputDetail(item)" v-for="(item,index) in typeList" :key="index" v-text="item">
            
        </p>
       
    </aside>
 <div class="mask" v-show="isshowPopupDistribution" v-if="isshowPopupDistribution" @click="closePopup"></div>
    <aside class="select" v-show="isshowPopupDistribution">
        <h3 class="title">
            选择类型
        </h3>
        <p @click="toProcessDistribution(item)" v-for="(item,index) in typeList" :key="index" v-text="item">
        
        </p>
        <!-- <p>
            RAMP
        </p> -->
    </aside>
         <popup :errorMsg="errorMsg" ></popup>
         <waiting v-show="isWaiting" :number="number"></waiting>
         <asyncPop v-show="showDrag" ></asyncPop>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
export default {
  data() {
    return {
      inputOutputList: [], // 投入产出查询数据，用于展示柱状图
      isshowPopupDetail: false, // 投入产出明细遮罩层的显示
      isshowPopupDistribution: false, // 投入产出制程分布显示
      typeList: [], // 工单类型数据
      totalList: [], // 总投入数
      NGList: [], // 过站时NG数
      OKList: [], // 过站时OK数
      freezeList: [], // 过站时冻结数
      routeSeqList: "", // 途程序号
      isDetailBar: false, // 1-2个类别
      isDetailBar2: false, // 3-4个类别
      isDetailBar3: false, // 5-6个类别
      isWaiting: true,
      number: 0,
      height: 17, // 默认高度
      errorMsg: "", //错误信息
      showDrag: false, // 是否弹窗提示异步加载任务
      showH5Title: true // 是否显示H5的头部，默认显示
    };
  },
  created() {
    console.log(this.$route.query.modelType,'caonima');
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
        text: "投入产出", //控制显示文本，空字符串表示显示默认文本
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
    
  },
  mounted() {
    
        //  this.showDrag = true;

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
      this.$route.query.terminalId = asyncData.traceContext.terminalId;
      this.$route.query.processId = asyncData.traceContext.processId;
      
      //界面渲染参数
      this.$route.query.modelName = asyncData.traceContext.modelName;
      this.$route.query.upccode = asyncData.traceContext.upccode;
      this.$route.query.partNo = asyncData.traceContext.partNo;
      this.$route.query.startTime = asyncData.traceContext.startTime;
      this.$route.query.endTime = asyncData.traceContext.endTime;
      this.$route.query.startTimeZore = asyncData.traceContext.startTimeZore;
      this.$route.query.endTimeZore = asyncData.traceContext.endTimeZore;
      this.$route.query.processName = asyncData.traceContext.processName;
      this.$route.query.production = asyncData.traceContext.production;
      this.$route.query.processDesc = asyncData.traceContext.processDesc;
      this.$route.query.startShow = asyncData.traceContext.startShow;
      this.$route.query.endShow = asyncData.traceContext.endShow;
      this.$route.query.seq = asyncData.traceContext.seq;
      this.$route.query.terminalId = asyncData.traceContext.terminalId;
      this.$route.query.modelType=asyncData.traceContext.modelType;
      this.typeList = asyncData.traceResult.data.woType; // 工单类型数据
            if (this.typeList.length == 0) {
              this.errorMsg = "没有数据";
            } else if (this.typeList.length > 2 && this.typeList.length <= 4) {
              this.height = 22;
            } else if (this.typeList.length > 4  && this.typeList.length <= 6) {
              this.height = 27;
            }else if(this.typeList.length > 6  && this.typeList.length <= 10){
              this.height = 30;
            }
            this.totalList = asyncData.traceResult.data.总投入数; // 总投入数据
            this.NGList = asyncData.traceResult.data.过站时NG数; // 过站时NG数
            this.OKList = asyncData.traceResult.data.过站时OK数; // 过站时OK数
            this.freezeList = asyncData.traceResult.data.过站时冻结数; // 过站时冻结数
            this.routeSeqList = asyncData.traceResult.data.routeSeqList.join(','); // 途程序号
            setTimeout(() => {
              this.drawLine(); // 绘画层叠柱状图
            });
       
    }else{
    
        this.getInputOutList(); // 投入产出查询数据

        if (
          sessionStorage.getItem("startShow") &&
          sessionStorage.getItem("endShow")
        ) {
          this.$route.query.startShow = (sessionStorage.getItem("startShow")) == 'false'? false: true;
          this.$route.query.endShow = (sessionStorage.getItem("endShow")) == 'true'? true: false;
          
          console.log(typeof this.startShow,'++++')
          console.log(typeof this.endShow,'----')
        }else{
          this.startShow = true;
          this.endShow = true;
        }
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
    // 绘画柱状图
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      var progressData = this.progressData;
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["过站时OK数", "过站时NG数", "过站时冻结数", "总投入数"]
          // top: 4      // 图例的位置
          //  left:'left',
          //  right:'right'
        },
        grid: {
          left: "-5%",
          right: "10%",
          bottom: "16%",
          // top:'5%',
          containLabel: true
        },
        xAxis: {
          name: "数量",
          type: "value",
          nameGap: 2, //坐标轴名称与轴线之间的距离
          splitNumber: 3, // 坐标轴的分割段数，需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整, 在类目轴中无效。
          nameTextStyle: {
            color: "rgba(0,0,0,.6)"
          },
          //   // 坐标轴名称的位置
          // nameLocation:'middle',
          splitLine: { show: false }, //去除网格线
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
            interval: 2,
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5, //刻度长度
            lineStyle: {
              color: "blue",
              width: 3,
              type: "solid"
            }
          },
          // 坐标轴刻度标签的文字设置
          axisLabel: {
            color: "rgba(0,0,0,.6)",
          }
        },
        yAxis: {
          name: "工单类型",
          nameTextStyle: {
            color: "rgba(0,0,0,.6)"
          },
          // 坐标轴名称的位置
          // nameLocation:'start',
          type: "category",
          nameGap: 2, //坐标轴名称与轴线之间的距离
          data: this.typeList,

          // data: ['AMPE','BMP','CMPA'],
          // data: ['AMPE','BMP','CMPA','DMPT',],
          // data: ['AMPE','BMP','CMPA','DMPT','EMP'],
          // data: ['AMPE','BMP','CMPA','DMPT','EMP','FMP'],
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

            margin: 50, //刻度标签与轴线之间的距离。
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
            name: "总投入数",
            type: "bar",
            stack: "总量",
            // label: {
            //   normal: {
            //     show: true,
            //     position: "inside"
            //   }
            // },
            data: this.totalList,
            barWidth: 30,
            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: "#2196f3"
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          {
            name: "过站时OK数",
            type: "bar",
            stack: "总量",
            // label: {
            //   normal: {
            //     show: true,
            //     position: "inside"
            //   }
            // },
            data: this.OKList,
            barWidth: 30,
            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                // color: "rgb(255,189,32)"
                color: "rgb(127,229,189)"
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          {
            name: "过站时NG数",
            type: "bar",
            stack: "总量",
            // label: {
            //   normal: {
            //     show: true,
            //     position: "bottom"
            //   }
            // },
            data: this.NGList,

            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                // color: "rgb(69,218,190)"
                color: "rgb(255,143,33)"
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          {
            name: "过站时冻结数",
            type: "bar",
            stack: "总量",
            // label: {
            //   normal: {
            //     show: true,
            //     position: "top"
            //   }
            // },
            data: this.freezeList,

            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: "rgb(191,103,255)"
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

    
       ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////数据请求部分////////////////////////////////////////////////////

  //启动异步任务机制
  startAsyncTask: function() {
    // 发起异步请求
     const info = {
          "tracePath":"inputAndOutputQuery",
          "traceParams" : {
                  partId: this.$route.query.partId,
                  processId: this.$route.query.processId,
                  terminalId: this.$route.query.terminalId,
                  startTime: this.$route.query.startTimeZore,
                  endTime: this.$route.query.endTimeZore,
                  seq: this.$route.query.seq,
                },
          "traceApi":"http://ks-rinse/reality/queryInputOutput.api",
          "traceContext":{
                  partNo:  this.$route.query.partNo,
                  modelName: this.$route.query.modelName,
                  upccode:  this.$route.query.upccode,
                  title: "投入产出查询",
                  partId: this.$route.query.partId,  // 请求参数
                  startTime: this.$route.query.startTime, 
                  endTime: this.$route.query.endTime, 
                  startTimeZore: this.$route.query.startTimeZore,
                  endTimeZore: this.$route.query.endTimeZore,
                  processName: this.$route.query.processName,
                  terminalId: this.$route.query.terminalId,
                  processId: this.$route.query.processId,
                  seq: this.$route.query.seq,
                  startShow: this.$route.query.startShow,
                  endShow: this.$route.query.endShow,
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



    // 投入产出查询数据获取
    getInputOutList() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var info = {
        partId: this.$route.query.partId,
        processId: this.$route.query.processId,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTimeZore,
        endTime: this.$route.query.endTimeZore,
        seq: this.$route.query.seq,

        // partId: 1000004968,
        // processId: "100774",
        // terminalId: "52203917",
        // startTime: "2013-08-02 00:00:00",
        // endTime: "2013-08-02 23:59:00"
      };
      this.$axiosHttp
        .axiosPost("ks-rinse/reality/queryInputOutput.api", info)
        .then(res => {
          console.log(res, 15);
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          if (res.code == 200) {
            this.typeList = res.data.woType; // 工单类型数据
            if (this.typeList.length == 0) {
              this.errorMsg = "没有数据";
            } else if (this.typeList.length > 2 && this.typeList.length <= 4) {
              this.height = 22;
            } else if (this.typeList.length > 4  && this.typeList.length <= 6) {
              this.height = 27;
            }else if(this.typeList.length > 6  && this.typeList.length <= 10){
              this.height = 30;
            }
            this.totalList = res.data.总投入数; // 总投入数据
            this.NGList = res.data.过站时NG数; // 过站时NG数
            this.OKList = res.data.过站时OK数; // 过站时OK数
            this.freezeList = res.data.过站时冻结数; // 过站时冻结数
            this.routeSeqList = res.data.routeSeqList.join(','); // 途程序号
            setTimeout(() => {
              this.drawLine(); // 绘画层叠柱状图
            });

            // console.log(this.totalList,1)
            // console.log(this.NGList,2)
            // console.log(this.OKList,3)
            // console.log(this.freezeList,4)
            // console.log(this.typeList,5)
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
    // 显示查看明细弹窗
    showPopupDetail() {
      this.isshowPopupDetail = true;
    },
    // 显示制程分布弹窗
    showPopupDistribution() {
      this.isshowPopupDistribution = true;
    },
    // 去往投入产出明细页面
    toinputOutputDetail(item) {
      this.$router.push({
        path: "inputOutputDetail",
        query: {
          // partId: "1000004968",
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          terminalId: this.$route.query.terminalId,
          startTimeZore: this.$route.query.startTimeZore, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.endTimeZore, // 用来下一个页面发请求的
          startTime: this.$route.query.startTime,
          startShow: this.$route.query.startShow,
          endShow: this.$route.query.endShow,
          endTime: this.$route.query.endTime,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode,
          woType: item

          // 'partId':'1000004968',
          // 'processId':'100774',
          // 'terminalId':'52204656',
          // 'startTime':'2013-08-02 00:10:00',
          // 'endTime':'2013-08-02 23:59:00',
          // 'woType': item
        }
      });
    
    },
    // 去往投入产出制程分布明细
    toProcessDistribution(item) {
      this.$router.push({
        path: "processDistribution",
        query: {
          // partId: "1000004968",
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          terminalId: this.$route.query.terminalId,
          startTimeZore: this.$route.query.startTimeZore, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.endTimeZore, // 用来下一个页面发请求的
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
           startShow: this.$route.query.startShow,
          endShow: this.$route.query.endShow,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode,
          woType: item

          //    'partId':'1000004968',
          //    'processId':'100774',
          //    'terminalId':'52204656',
          //    'startTime':'2013-08-02 00:10:00',
          //    'endTime':'2013-08-02 23:59:00',
          //     'woType': item
        }
      });
   
    },
    // 点击其它关闭弹窗
    closePopup() {
      this.isshowPopupDetail = false;
      this.isshowPopupDistribution = false;
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
.progressNum {
  position: absolute;
  top: 3rem;
  right: 1rem;
  color: rgba(0, 0, 0, 0.6);
}
.time-selects {
  position: relative;
  background-color: #f4f4f4;
}
  .c-name{
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
    margin-top: 4px;
    text-align: right;
  }
</style>


