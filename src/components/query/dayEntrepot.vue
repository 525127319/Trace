<template>
    <article>
        <nav class="nav" v-show="showH5Title" >
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>仓库领料</h1>
            <span class="right" @click="handleSearch()">
                <span class="or">
                    查询
                </span>
            </span>
        </nav>
        <section class="section y_section">
                   <ul class="y_section-nav">
                      <li >
                        <router-link to="/warehouseReceiptRecord">
                         领料
                         </router-link>
                      </li>
                      <li class="active" >
                        <router-link to="/dayEntrepot">
                          当天仓库机种领料
                        </router-link>
                      </li>
                      <li >
                        <router-link to="/daysEntrepot">
                         多天仓库机种领料
                         </router-link>
                      </li>
                    </ul>
                <ul class="gray-list y_nav">
                    <li>
                      <div class="y_select" style="background:#f4f4f4;margin:0;border-bottom:1px solid rgba(0, 0, 0, 0.05);padding:0;">
                          <span class="y_select-text">类型选择</span>
                          <div class="y_select-r" >
                              <div v-for="(item,index) in modelType" :key="index">
                                <label for="y_radio1"  :class="{'act':activeIndex == index}" @click="selecType(item,index)">{{item}}</label>                  
                              </div>
                          </div>
                      </div>
                    </li>
                     <li @click="goModelList" >
                        <span class='key'>机种选择</span>
                        <div class="y_ov">
                            <ul class="value" v-for="(item,index) in newParts" :key="index">
                                <li>
                                    <span>{{item.modelName}} {{item.partName}} {{item.colorEn}}</span>
                                    <p class="gray-list-text">{{item.partNo}}</p>
                                </li> 
                            </ul>
                        </div>
                        <span class="icon icon-right y_span"></span>
                    </li>
                 </ul>
                 <div class="y_canvas"  v-if="!showNoDataICon">
                     <!-- 图表 -->
                    <div id="day_sum"></div>
                 </div>
                <popup :errorMsg="errorMsg" ></popup>
                <waiting v-show="isWaiting" :number="number"></waiting>
                <!-- 没有数据的时候显示 -->
                <div v-if="showNoDataICon" class="no-data"></div>
                <asyncPop v-show="showDrag" ></asyncPop>
        </section>
    </article>
</template>
<script>
let echarts = require("echarts");
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import utils from "../../common/utils.js";
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex';
export default {
  name: "dayEntrepot",
  components: {
    popup,
    waiting,
    asyncPop
  },
  data() {
    return {
      showDrag: false, // 是否弹窗提示异步加载任务
      initModelList: [],
      showH5Title: true, // 是否显示H5的头部，默认显示
      isWaiting: false,
      number: 0,
      showNoDataICon: false, // 显示数据不为0的时候显示
      activeIndex: 0,
      typeValue: "",
      newParts: [],
      modelType: ["iPad", "Protable"],
      modelNames: [],
      partNos: [],
      reportTotals: [],
      errorMsg: "",
      barWidth: "",
      modelStrs: "",
      backDataList: []
    };
  },
  created() {
    if (
      window.navigator.userAgent.indexOf("IOS") > -1 ||
      window.navigator.userAgent.slice(11) === "ANDROID-IAAPPCONTAINER" ||
      window.navigator.userAgent.slice(11) === "PAD-IAAPPCONTAINER"
    ) {
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
      }
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
      text: "仓库领料", //控制显示文本，空字符串表示显示默认文本
      textColor: "#212121", //字体颜色  16进制，关键字
      url: "", //控制标题文本，空字符串表示显示默认文本
      backcoler: "#ffffff" //背景色
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

    if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // 如果有缓存异步数据
      let asyncData = JSON.parse(sessionStorage.getItem("asyncResult"));
      asyncData.traceContext = JSON.parse(asyncData.traceContext); // 转换成JSON格式
      asyncData.traceResult = JSON.parse(asyncData.traceResult); // 转换成JSON格式
      this.typeValue = asyncData.traceContext.modelType;
      this.modelStrs = asyncData.traceContext.partId;
      this.newParts = asyncData.traceContext.manyModels;
      this.activeIndex = asyncData.traceContext.activeIndex;
      this.$store.commit("SET_TYPE", this.typeValue);
      this.$store.commit("SET_TYPE_INDEX", this.activeIndex);
      this.$store.commit("SET_PARTS", self.newParts);
      //将制程数据渲染到界面
      this.backDataList = asyncData.traceResult.data; // 缓存的数据
      this.backDataList.forEach(item => {
        this.modelNames.push(item.modelName + " " + item.upcCode);
        this.partNos.push(item.partNo);
        this.reportTotals.push(item.reportTotal);
      });
      this.$store.commit("SET_DAYENTREPOT_MODELNAMELIST", this.modelNames);
      this.$store.commit("SET_DAYENTREPOT_PARTNOLIST", this.partNos);
      this.$store.commit(
        "SET_DAYENTREPOT_MODELREPORTTATOLSLIST",
        this.reportTotals
      );
      this.$store.commit(
        "SET_DAYENTREPOT_INITECHART",
        asyncData.traceResult.data
      );
      this.$store.commit("SET_PARTS", asyncData.traceContext.manyModels);
    } else {
      if (self.$store.state.typeValue) {
        self.typeValue = this.$store.state.typeValue;
        self.activeIndex = this.$store.state.typeIndex;
      } else {
        self.typeValue = "iPad";
        self.activeIndex = 0;
      }
      if (this.$store.state.parts.length != 0) {
        this.newParts = this.$store.state.parts;
        var hash = {};
        self.newParts = self.newParts.reduce(function(item, next) {
          hash[next.modelId]
            ? ""
            : (hash[next.modelId] = true && item.push(next));
          return item;
        }, []);
      } else {
        this.getinitModel();
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem("asyncResult") && this.$route.query.asyncFlag) {
      // this.backDataList.forEach(item => {
      //   this.modelNames.push(item.modelName);
      //   this.partNos.push(item.partNo);
      //   this.reportTotals.push(item.reportTotal);
      // });
      this.initEcharts();
    }
    let staticData = this.$store.state.dayEntrepotInitEchart;
    if (staticData.length > 0) {
      this.backDataList = [];
      this.initModelList = staticData;
      this.modelNames = this.$store.state.globalModelNamelist;
      this.partNos = this.$store.state.globalPartNoList;
      this.reportTotals = this.$store.state.globalReportTatolsList;
      this.initEcharts();
    }
  },

  methods: {
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_TYPE", item);
      this.$store.commit("SET_TYPE_INDEX", index);
      this.getinitModel();
    },
    ...mapActions([
        'deletePickingList'
    ]),
    // 返回上一页
    back() {
      this.deletePickingList();
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
    handleSearch() {
      clearInterval(timer);
      let modelIds = [];
      this.newParts.forEach(item => {
        modelIds.push(item.modelId);
      });
      this.modelStrs = modelIds.join(",");
      if(this.modelStrs.length == 0){
        this.errorMsg = "机种加载中，稍等片刻...";
        return;
      }
      let params = { partId: this.modelStrs };
     
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      // this.$store.commit("SET_DAY_PARAMS", params);
      this.isWaiting = true;
      this.$axiosHttp
        .axiosPost(
          "ks-newrep/RepertoryMaterial/findReperMaterialCurrDay.api",
          params
        )
        .then(res => {
          // this.showDrag = true;
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          let { code, msg, data } = res;
          if (code == 200) {
            if (data.length == 0) {
              this.showNoDataICon = false;
            } else {
              this.modelNames = [];
              this.partNos = [];
              this.reportTotals = [];
              if (data.length == 3) {
                this.barWidth = "80";
              } else if (data.length == 4) {
                this.barWidth = "50";
              } else if (data.length <= 2) {
                this.barWidth = "100";
              } else {
                this.barWidth = "40";
              }
              this.backDataList = data;
              this.backDataList.forEach(item => {
                this.modelNames.push(item.modelName + "  " + item.upcCode);
                this.partNos.push(item.partNo);
                this.reportTotals.push(item.reportTotal);
              });
              // this.initModelList = data;
              // console.log(this.initModelList,'赋值');
              this.$store.commit("SET_DAYENTREPOT_INITECHART", data);
              this.$store.commit(
                "SET_DAYENTREPOT_MODELNAMELIST",
                this.modelNames
              );
              this.$store.commit("SET_DAYENTREPOT_PARTNOLIST", this.partNos);
              this.$store.commit(
                "SET_DAYENTREPOT_MODELREPORTTATOLSLIST",
                this.reportTotals
              );
              this.initEcharts();
            }
          } else if (code == -404) {
             this.showDrag = true;
          } else {
            this.errorMsg = msg;
          }
        });
    },
    //启动异步任务机制
    startAsyncTask: function() {
      // 发起异步请求
      const info = {
        tracePath: "/dayEntrepot",
        traceParams: {
          partId: this.modelStrs
        },
        traceApi:
          "http://ks-newrep/RepertoryMaterial/findReperMaterialCurrDay.api",
        traceContext: {
          manyModels: this.newParts,
          title: "当天仓库机种领料查询",
          partId: this.modelStrs,
          modelType: this.typeValue,
          activeIndex: this.activeIndex
        }
      };
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/sendAsynTask.api", info)
        .then(res => {
         
          if (res.code == 200) {
            this.unreadData(); // 当天未读数量获取
          }
        });
    },
    cancelAsync() {
      this.showDrag = false;
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
    // 去往选择机制页面
    goModelList() {
      this.$router.push({
        path: "/baseModelList",
        query: {
          path: "dayEntrepot",
          type: this.typeValue,
          initModel: this.newParts
        }
      });
    },
    getinitModel() {
      let self = this;
      self.newParts = [];
      let params = { type: self.typeValue, keyWord: "" };
      this.$axiosHttp
        .axiosPost("ks-newrep/ReportTool/findModelByTypeName.api", params)
        .then(res => {
          let { code, msg, data } = res;
          if (code == 200) {
            self.newParts.push(data[0]);
            this.$store.commit("SET_PARTS", self.newParts);
          } else {
            this.errorMsg = msg;
          }
        });
    },
    initEcharts: function() {
      let barWidth;
      if (this.initModelList.length > 0) {
        if (this.initModelList.length == 3) {
          barWidth = "80";
        } else if (this.initModelList.length == 4) {
          barWidth = "50";
        } else if (this.initModelList.length <= 2) {
          barWidth = "100";
        } else {
          barWidth = "40";
        }
      }
      let day_sum = echarts.init(document.getElementById("day_sum"));

      day_sum.setOption({
        color: ["#4f81bd"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        /*legend: {
                    data: [date]
                },*/
        grid: {
          left: "2%",
          right: "8%",
          bottom: "2%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          min: 0,
          nameGap: 2, //坐标轴名称与轴线之间的距离
          splitNumber: 3, // 坐标轴的分割段数，需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整, 在类目轴中无效。
          axisLine: {
            // show: false,
            lineStyle: {
              color: "#9d9d9d",
              width: 1
            }
          },
          // 多余的东西
          axisTick: { show: false },
          splitLine: { show: false },
          axisTick: {
            show: false,
            alignWithLabel: false,
            interval: 2,
            inside: false, //坐标轴刻度是从内还是从无外
            length: 5 //刻度长度
          }
        },
        yAxis: [
          {
            type: "category",
            axisLabel: {
              show: true,
              interval: 0,
              rotate: 0,
              // margin: 10,
              inside: false
            },
            axisLine: {
              // show: false,
              lineStyle: {
                color: "#9d9d9d",
                width: 1
              }
            },
            minInterval: 1,
            axisTick: { show: false },
            data: this.modelNames
          },
          {
            // type: 'category',
            axisLabel: {
              show: true,
              interval: 0,
              rotate: 0,
              // margin: 10,
              inside: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#9d9d9d",
                width: 1
              }
            },
            axisTick: { show: false },
            position: "left",
            data: this.partNos,
            axisLabel: {
              formatter: function(value, index) {
                return "\n\n" + value;
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: this.reportTotals,
            barWidth: barWidth,
            label: {
              normal: {
                show: true,
                position: "right"
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style scoped>
.value {
  display: block;
  flex: 1;
  display: flex;
  white-space: nowrap;
  margin-left: 10px;
  /* justify-content: flex-end; */
}
.value > li {
  display: flex;
  width: 100%;
  flex-direction: column;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-content: center;
}
.gray-list-text,
.value > li > span {
  display: block;
  width: 100%;
  text-align: right;
  white-space: nowrap;
}
.gray-list li {
  position: relative;
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
  position: relative;
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
.y_span {
  position: absolute;
  right: 1rem;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
