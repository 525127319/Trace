<template>
        <article>
                <nav class="nav" v-show="showH5Title">
                    <span class="left" @click="back">
                            <span class="icon icon-left"></span>
                    </span>
                    <h1>不良趋势图</h1>
                </nav>
                <div v-if="showNoDataICon" class="no-data"></div>
                <section class="section y_bg">
                    <div class="badness_dj" id="badness-top" >

                    </div>
                    <div class="badness_dj" id="badness-fot" >

                    </div>
                </section>
                <popup :errorMsg="errorMsg" ></popup>
                <waiting v-show="isWaiting" :number="number"></waiting>
                 <asyncPop v-show="showDrag" ></asyncPop>
            </article>
</template>

<script>
// let echarts = require("echarts");
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import asyncPop from "../base/asyncPop.vue";
import echarts from "echarts";
export default { 
  components: {
    popup,
    waiting,
    asyncPop
  },  
  data() {
    return {
      modelName:'',
      showH5Title: true, // 是否显示H5的头部，默认显示
      errorMsg: "",
      number: 0,
      showNoDataICon: false, // 显示数据不为0的数据有的时候显示
      isWaiting: false,
      processEchart:"",
      badEchart:"",
      reportTime:[],
      reportRercentages:[],
      processName:[],
      reportRer:[],
      reportName:"",
      interval:0,
      sendData:{},
      badChartData:[],
      processEchartData:[],
      showDrag: false, // 是否弹窗提示异步加载任务    
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
      this.IM.setTitle({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "0", //0：文字     1：图标   （必传）
        text: "不良趋势图", //控制显示文本，空字符串表示显示默认文本
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
       
       
       if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
          // 如果有缓存异步数据      
          let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
          asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
          asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
         
          //原传递给服务端的参数
          this.$route.query.startTime = asyncData.traceContext.startTime;
          this.$route.query.endTime = asyncData.traceContext.endTime;
          this.modelName = asyncData.traceContext.modelName;
          this.badChartData = asyncData.traceResult.data.defectList; // 缓存的数据

          this.processEchartData =asyncData.traceResult.data.defectProcessList; 
          if (this.badChartData.length == 0 &&  this.processEchartData.length ==0) {
            this.errorMsg = "没有数据";
          }
      }else {
        this.getInitEchart();
      }
      
  },
  mounted() {
    if(this.$route.query.asyncFlag){
      this.initBadEchart();
      this.initProcessEchart();
    }   
  },
  methods: {
    getInitEchart(){
        this.sendData =this.$store.state.badChartSearchParams;
        this.modelName=this.$route.query.name;
        let modelId ;
        if(this.$route.query.partId){
           modelId=this.$route.query.partId
        }else if(Object.keys(this.$store.state.badChartSearchParams).length!=0) {
           modelId =(this.sendData.partId).toString()
         
        }
        let params =
        {partId:modelId,startTime:this.$route.query.startTime,endTime:this.$route.query.endTime,defectInfo:this.modelName}
         clearInterval(timer);
        var timer = setInterval(() => {
          this.number = this.number + 1;
        }, 1000);
        this.isWaiting = true;
       this.$axiosHttp
        .axiosPost("ks-newrep/ReportDefect/findDefectDescTrend.api", params)
        .then(res => {
          // this.showDrag = true; 
          clearInterval(timer);
            this.number = 0;
            this.isWaiting = false;
            let {code,msg,data} =res;
            if(code ==200 ){
                if(data.length ==0){
                 this.showNoDataICon = true;              
              }else{
                this.badChartData =data.defectList;
                this.processEchartData =data.defectProcessList;
                if( this.badChartData.length>0 ||  this.processEchartData.length>0) {
                     this.initBadEchart();
                    this.initProcessEchart();
                }
               
               
              }             
            } else if(code ==-404){
                this.showDrag = true; 
            }else{              
              this.errorMsg = msg;
            }
        })
        
       
        // let dataJson ={
        //   partId:(this.sendData.partId).toString(),
        //   startTime:this.sendData.startTime,
        //   endTime:this.sendData.endTime,
        //   defectInfo:this.$route.query.name
        //   }
        // this.processEchart= this.$axiosHttp
        // .axiosPost("ks-newrep/ReportDefect/findDefectDescProcessSection.api", dataJson)
        // .then(res => {
        //     let {code,msg,data} =res;
        //     if(code ==200 ){
        //       if(data.length ==0){
        //          this.showNoDataICon = true;
        //          return;
        //       }else{
        //         this.processEchartData =data; 
        //       }             
        //     }else if(code ==-404){
        //         this.showDrag = true; 
        //     }else{
        //      this.errorMsg = msg;
        //     }
        // });
        // clearInterval(timer);
        // var timer = setInterval(() => {
        //   this.number = this.number + 1;
        // }, 1000);
        // this.isWaiting = true;
        // Promise.all([this.badEchart,this.processEchart])
        // .then(results => {
        //     clearInterval(timer);
        //     this.number = 0;
        //     this.isWaiting = false;
        //     this.initBadEchart();
        //     this.initProcessEchart();             
        // })
        // .catch(function(r) {
        //     console.log(r,88);   
        // });
    },
    cancelAsync(){
      this.showDrag = false;
    },
    //启动异步任务机制
    startAsyncTask: function() {
      // 发起异步请求
      const info = {
        tracePath: "/countBadChart",
        traceParams: {
          partId: (this.$route.query.partId).toString(),
          startTime:this.$route.query.startTime,
          endTime:this.$route.query.endTime,
          defectInfo:this.modelName
        },
        traceApi: "http://ks-newrep/ReportDefect/findDefectDescTrend.api",
        traceContext: {
          startTime:this.$route.query.startTime,
          endTime:this.$route.query.endTime,
          modelName:this.modelName,
          title: "不良趋势图查询",
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
    // 返回上一页
    back() {
       if(this.$route.query.asyncFlag){
          this.$router.push({
            path: "/asyncTaskList",
        });
      }else{
          this.$router.push({
          path: "/badChart",
          query:{
            target:"countBadChart"
          }
        }); 
      }
       
    },
    initBadEchart(){
      let badnessTop = echarts.init(document.getElementById("badness-top"));
       this.interval = parseInt(this.badChartData.length / 10);
          this.badChartData.forEach( item=> {
            this.reportTime.push(item.reportTime.replace(/-/g,'/'));
            this.reportRercentages.push(item.reportRercentages);
          }); 
         
          let st = this.$route.query.startTime;
          let ed = this.$route.query.endTime;   
        
          this.reportName = st.replace(/-/g,"/") + '--' + ed.replace(/-/g,"/") + '\n\n' + this.modelName+'\r\n';
          let reportTime =this.reportTime;
         
          let reportRercentages=this.reportRercentages;
          let reportName =this.reportName;
          let setEnd = 0;

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
      badnessTop.setOption({
        title: {
          text: reportName,
          left: "center",
          y: "-5",
          textStyle: {
            color: "#000",
            fontWeight: "normal",
            fontSize: "11"
          }
        },
        tooltip: {
          formatter: "{b}:{c} %",
          position:'left'
        },
     dataZoom: [
      {
          show: false,
          type: 'inside',
          realtime: true,
          start: 0,
          end: setEnd,
          filterMode: 'empty'
      }],
        grid: {
          left: "-4%",
          right: "4%",
          bottom: "6%",
          containLabel: true
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            // 多余的东西
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "#9d9d9d",
                width: 1
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
            //  interval: this.interval,      //动态变化
              interval: 0,      //动态变化
              rotate: "-70"          
            },
            splitNumber:5,
            axisTick: {
            show: false,
            alignWithLabel: true,
            length: 4, //刻度长度
          },
            data: reportTime
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            boundaryGap: false,
            min: 0,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#fff",
                width: 0
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ["#c9c9c9"]
              }
            }
          }
        ],
        series: [
          {
            type: "line",
            clickable: false,
            color: "#ff7e00", //折线图颜色
            smooth: true, //是否平滑处理值0-1,true相当于0.5
            data: reportRercentages,
            label: {
              normal: {
                show: true,
                formatter: "{c}%"
              }
            }
          }
        ]
      }); 
    },
    initProcessEchart(){
      let badnessFop = echarts.init(document.getElementById("badness-fot"));
        this.processEchartData.forEach( item=> {
                this.processName.push(item.processName);
                this.reportRer.push(item.reportRercentages);
        })
      let processName =this.processName;
      let reportRer =this.reportRer;
      let reportText = this.modelName + " by process";
      badnessFop.setOption({
        title: {
          text: reportText,
          left: "center",
          y: "10",
          textStyle: {
            color: "#000000",
            fontWeight: "normal",
            fontSize: "11"
          }
        },
      //        dataZoom: [
      // {
      //     show: false,
      //     type: 'inside',
      //     realtime: true,
      //     start: 0,
      //     end: 100,
      //     filterMode: 'empty'
      // }],
        tooltip: {
          show:false,
          formatter: "{c} %"
        },
        grid: {
          left: "-4%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            // 多余的东西
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "#9d9d9d",
                width: 1
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0,
              rotate: "-70"
            },
            data: processName
            //  data: ['2d-bc-le', '2d-bc-le', '2d-bc-le','2d-bc-le','2d-bc-le'],  

          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#fff",
                width: 0
              }
            },
            // 多余的东西
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: ["#c9c9c9"]
              }
            }
          }
        ],
        series: [
          {
            name: "机件",
            type: "bar",
            data: reportRer,
            //  data:[5, 10, 40,20,30,50],

            barWidth: "20%",
            label: {
              normal: {
                show: true,
                formatter: "{c}%",
                position: "top",
                color: "#ff7e00"
              }
            },
            itemStyle: { normal: { color: "#ff7e00" } }
          }
        ]
      }); 
    }
  }
};


</script>
<style scoped>
.y_bg{
  background: #fff;
}
.section{
  overflow-y: auto;
}
.badness_dj{
  height: 400px !important;
  min-height: 400px !important;
}
</style>
