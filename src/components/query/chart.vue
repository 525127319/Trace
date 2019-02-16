<template>
    <div :id="id" class="seven"></div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import utils from "../../common/utils.js";
export default {
  data() {
    return {
      chart:"",
      reportUnkHNow:[],
      reportWeek:[],
      reportWip:[],
      partNo:[],
    };
  },
  props:['chartData','id'],
  mounted() {
    window.addEventListener("resize", function() {
     this.chart.resize();
    });
     this.initEchart();
  },
  methods:{
    initEchart(){
      this.chart = echarts.init(document.getElementById(this.id));
      this.chartData.forEach(item => {
        this.reportUnkHNow.push(item.reportUnkHNow) 
        this.reportWeek.push(item.reportWeek.replace(/-/g,'/'));
        this.reportWip.push(item.reportWip)
        this.partNo.push(item.partNo);   
      });
      let newData = utils.formatData(this.chartData);
      this.chart.setOption({
        title: {
          text: Object.keys(newData),
          left: "right",
          min:0,
          y: "20",
          textStyle: {
            color: "#000000",
            fontWeight: "normal",
            fontSize: "13"
          },
          subtext: this.chartData[0].partNo, //副标题文本样式
          subtextStyle: {
            fontSize: "10"
          }
        },
        color: "#404040",
        grid:{ 
          left: 80,
        },
        xAxis: {
          axisLabel: {
            interval: 0
          },
          alignWithLabel:true,
          fontWeight:'normal',
          fontStyle:'normal',
          // ["第一周", "第二周", "第二周", "第二周"],
          data:  this.reportWeek,
          // 多余的东西
          axisTick: { show: false },
          splitLine: { show: false },
          		axisLabel:{
	    		    	interval:0,
	    			    rotate:45,//倾斜度 -90 至 90 默认为0
	    			    margin:2,
	    			}, 
        },
        yAxis: {
          // 多余的东西
          axisTick: { show: false },
          splitLine: { show: false },
          
        },
        legend:{
          show:true,
        },
        tooltip: {
          trigger: "axis",
            position: function (pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = {top: 60};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
          }
        },
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: false
              }
            },
            // [3, 8, 41, 2],
            data:  this.reportUnkHNow,
            name: "unknown",
            itemStyle: { normal: { color: "#c0504d" } }
          },
          {
            type: "bar",
            label: {
              normal: {
                // show: false
              }
            },
            // [1, 1, 21, 0.6666666666666666]
            data:  this.reportWip,
            name: "WIP",
            itemStyle: { normal: { color: "#4f81bd" } }
          }
        ],
        legend: {
          data: ["unknown", "WIP"],
          left: 0,
          top:'7%'
        }
      });
    }
  } 
  
};
</script>
<style scoped>

</style>
