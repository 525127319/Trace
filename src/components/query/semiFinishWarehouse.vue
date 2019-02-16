<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
                 <span class="icon icon-left"></span>
            </span>
            <h1>通用查询</h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <ul class="gray-list">
                        <li>
                            <span class='key'>机种</span>
                             <div  class='m-val'>
                              <p class="e-name" ><span v-text="this.$route.query.modelName || 'Thor TC'"></span> <span v-text="this.$route.query.upccode || 'Sparrow'"></span></p>
                          <p class="c-name" v-text="this.$route.query.partNo ||'604-05132'"> </p>
                            </div>
                        </li>

                        <li>
                            <span class='key'>开始日期</span>
                            <span class="value"  >{{this.$route.query.startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.startTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>结束日期</span>
                            <span class="value">{{this.$route.query.endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.endTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>类别</span>
                            <span class="value" v-text="this.$route.query.selectTypeValue"></span>
                        </li>
                        <li>
                            <span class='key'>料仓</span>
                            <span class="value" v-text="this.$route.query.warehouseValue"></span></span>
                        </li>
                        <!-- 只有半成品仓有制程和站点 -->
                        <li>
                            <span class='key'>制程</span>
                            <span class="value" v-text="this.$route.query.processName"> </span>
                        </li>
                        <li>
                            <span class='key'>站点</span>
                            <span class="value" v-text="this.$route.query.terminalValue || '全部'"></span>
                        </li>

                    </ul>
                    <div class="pie">
                          <!-- 绘画柱状图 -->
                            <!-- <div class="chartWrap"> -->
                                 <div id="myChart" :style="{width: '100%', height: '100%'}"></div>
                            <!-- </div> -->
                    </div>
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
      categoryList: [], // 物料状态
      categoryQtyList: [], // 物料状态对应的数据
      isWaiting: true,
      number: 0,
      errorMsg: "", //错误信息
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


    this.getWarehouseList(); // 获取物料详情数据
    this.categoryList = this.categoryList.concat(
      this.$route.query.selectTypeList
    );
    
    console.log(this.$route.query.terminalValue,9090)
    console.log(this.$route.query.typeIndex,'索引')
     console.log(this.$route.query.selectTypeList, '选择类型')

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
    
    // 获取物料详情数据
    getWarehouseList() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var info = {
        whType: "2", // 半成品
        partId: this.$route.query.partId, // 只做其中一个，到时更改即可
        processId: this.$route.query.processId,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime

        // whType: "2",
        // partId: "1000004966",
        // processId: "",
        // terminalId: "",
        // startTime: "2013-08-02 00:00:00",
        // endTime: "2013-08-02 23:59:00"
      };
      this.$axiosHttp
        .axiosPost("ks-rinse/reality/queryCurrency.api", info)
        .then(res => {
          console.log(res, "---");
          console.log(this.$route.query.selectTypeList, "+++");
          clearInterval(timer);
           this.number = 0;
          this.isWaiting = false;
          if (res.code == 200) {
            console.log(this.$route.query.selectTypeList, "+++===");
             
            if (this.$route.query.typeIndex == 0) {
               this.categoryQtyList = [];
              this.categoryQtyList.push(res.data.categoryQty[0]);
              console.log(this.$route.query.selectTypeList, "++++++");
              console.log( this.categoryQtyList, "++0++");
            } else if (this.$route.query.typeIndex == 1) {
               this.categoryQtyList = [];
              this.categoryQtyList.push(res.data.categoryQty[1]);
               console.log( this.categoryQtyList, "++1++");
            } else if (this.$route.query.typeIndex == 2) {
               this.categoryQtyList = [];
              this.categoryQtyList.push(res.data.categoryQty[2]);
               console.log( this.categoryQtyList, "++3++");
            } else {
              this.categoryQtyList = res.data.categoryQty;
            }
            this.drawLine();
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
    // 绘画柱状图
    drawLine() {
      console.log(this.categoryQtyList,'++==')
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      var progressData = this.progressData;
      const self = this;
      // 绘制图表
      myChart.setOption({
        grid: {
          // 控制图的位置
          left: "5%",
          right: "15%",
          bottom: "16%",
          containLabel: true
        },
        xAxis: {
          name: "类别",
          type: "category",
          nameTextStyle: {
            color: "rgba(0,0,0,.6)"
          },
          data: this.categoryList,
          boundaryGap: [0, 0.01],
          nameGap: 1, //坐标轴名称与轴线之间的距离
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
            align: "middle", //top,middle,bottom
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
          name: "数量",
          type: "value",
          nameTextStyle: {
            color: "rgba(0,0,0,.6)"
          },
          splitLine: { show: false }, //去除网格线
          //坐标轴设置
          // axisLine: {
          //   show: true,
          //   onZero: true,
          //   //onZeroAxisIndex: ...,

          //   symbolSize: [30, 50],
          //   //轴线设置
          //   lineStyle: {
          //     color: "rgb(221,221,221)",
          //     width: 1,
          //     type: "solid", //'solid',dashed,dotted

          //     //shadowBlur: ...,
          //     //shadowColor: ...,
          //     shadowOffsetX: 0,
          //     shadowOffsetY: 0
          //     //opacity: ...,
          //   }
          // },
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
          // axisLabel: {
          //   show: true,
          //   interval: "auto",
          //   //formatter: '{value}%',
          //   interval: "auto",
          //   inside: false, //刻度标签朝内还是朝外

          //   margin: 40, //刻度标签与轴线之间的距离。
          //   formatter: function(value, index) {
          //     return value;
          //   },
          //   showMinLabel: null,
          //   showMaxLabel: null,
          //   color: "#000",
          //   fontStyle: "normal",
          //   fontWeight: "normal",
          //   fontFamily: "sans-serif",
          //   fontSize: 12,
          //   align: "bottom", //top,middle,bottom
          //   // verticalAlign: ...,
          //   // lineHeight: ...,
          //   backgroundColor: "transparent",
          //   borderColor: "transparent",
          //   borderWidth: 0,
          //   borderRadius: 0,
          //   padding: 0,
          //   shadowColor: "transparent",
          //   shadowBlur: 0,
          //   shadowOffsetX: 0,
          //   shadowOffsetY: 0,
          //   //  width: ...,
          //   //  height: ...,
          //   textBorderColor: "transparent",
          //   textBorderWidth: 0,
          //   textShadowColor: "transparent",
          //   textShadowBlur: 0,
          //   textShadowOffsetX: 0,
          //   textShadowOffsetY: 0
          // }
        },
        series: [
          {
            name: "",
            type: "bar",
            data: this.categoryQtyList,
            barWidth: 20,
            //顶部数字展示pzr

            //配置样式
            itemStyle: {
              //通常情况下：
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  if (self.$route.query.typeIndex == 0) {
                    var colorList = ["rgb(127,229,189)"];
                    return colorList[params.dataIndex];
                  } else if (self.$route.query.typeIndex == 1) {
                    var colorList = ["rgb(255,143,33)"];
                    return colorList[params.dataIndex];
                  } else if (self.$route.query.typeIndex == 2) {
                    var colorList = ["rgb(255,49,39)"];
                    return colorList[params.dataIndex];
                  } else {
                    var colorList = [
                      "rgb(127,229,189)",
                      "rgb(255,143,33)",
                      "rgb(255,49,39)",
                      // "rgb(195,229,235)"
                    ];
                    return colorList[params.dataIndex];
                  }
                },
                label: {
                  // 配置柱状的数值的显示
                  show: true, //是否展示
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    fontFamily: "微软雅黑"
                  },
                  position: "top"
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
    waiting
  }
};
</script>

