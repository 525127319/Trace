<template>
    <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>生产在制</h1>
            <span class="right" @click="handleSearch()">
                <span class="or">
                    查询
                </span>
            </span>         
        </nav> 
        <section class="section y_section y_overflow">
                 <ul class="y_section-nav">
                  <li>
                    <router-link to="/processProduction">
                      生产在制
                      </router-link>
                  </li>
                  <li >
                    <router-link to="/countStorePick">
                      unknown汇总数据
                    </router-link>
                  </li>
                  <li class="active">
                    <router-link to="/compareStoreData">
                      汇总数据周对比
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
                  <!-- 没有数据的时候显示 -->
                  <div v-if="showNoDataICon" class="no-data"></div>
                  <p class="nav-canvas-ipp" v-show="Object.keys(newData).length>0">汇总数据周对比</p>
                 <div class="seven-max" v-if="!showNoDataICon"  v-for="(item,index) in newData " :key="index">
                    <!-- <div id="seven1" class="seven">1</div>
                    <div id="seven2" class="seven">2</div>
                    <div id="seven3" class="seven">3</div> -->

                    <chart  :chartData="item" :id="index" ></chart>
                 </div>
                <popup :errorMsg="errorMsg" ></popup>
                <waiting v-show="isWaiting" :number="number"></waiting>
                <asyncPop v-show="showDrag" ></asyncPop>
        </section>
    </article>
    
</template>

<script>
import echarts from "echarts";
import chart from "./chart.vue";
import popup from "../base/popup .vue";
import waiting from "../base/waiting.vue";
import utils from "../../common/utils.js";
import asyncPop from "../base/asyncPop.vue";
import {mapActions} from 'vuex';
export default {
  components: {
    chart,
    popup,
    waiting,
    asyncPop
  },
  data() {
    return {
      showDrag: false, // 是否弹窗提示异步加载任务
      newData: {},
      // initModelList:[],
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
      modelStrs: ""
    };
  },
  mounted() {
    if (this.$store.state.compareStoreChart.length != 0) {
      this.newData = this.$store.state.compareStoreChart;
    }
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
      text: "生产在制", //控制显示文本，空字符串表示显示默认文本
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
      this.activeIndex=asyncData.traceContext.activeIndex;
      this.$store.commit("SET_COMPARESTORE_TYPE", this.typeValue);
      this.$store.commit("SET_COMPARESTORE_INDEX", this.activeIndex);
      this.$store.commit("SET_COMPARESTORE_MODELS", this.newParts);
      //将制程数据渲染到界面
      this.newData = utils.formatOtherData(asyncData.traceResult.data); // 缓存的数据
      this.$store.commit("SET_COMPARESTORE_CHART", this.newData);
    }else{
         if (self.$store.state.compareStoreType) {
          self.typeValue = this.$store.state.compareStoreType;
          self.activeIndex = this.$store.state.compareStoreIndex;
        } else {
          self.typeValue = "iPad";
          self.activeIndex = 0;
        }

        if (this.$store.state.compareStoreModels.length != 0) {
          this.newParts = this.$store.state.compareStoreModels;
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
  methods: {
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      this.$store.commit("SET_COMPARESTORE_TYPE", item);
      this.$store.commit("SET_COMPARESTORE_INDEX", index);
      this.getinitModel();
    },
    ...mapActions([
        'deleteProProductionList'
    ]),
    // 返回上一页
    back() {
      this.deleteProProductionList();
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
          "ks-newrep/WorkInProgress/findWorkInProgressWeek.api",
          params
        )
        .then(res => {
          //  this.showDrag=true;
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          let { code, msg, data } = res;
          if ((code = 200)) {
            if (data == null) {
              this.errorMsg = msg;
            }
            this.newData = utils.formatOtherData(data);
            this.$store.commit("SET_COMPARESTORE_CHART", this.newData);
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
        tracePath: "/compareStoreData",
        traceParams: {
          partId: this.modelStrs,
          startTime: this.startTime,
          endTime: this.endTime
        },
        traceApi: "http://ks-newrep/WorkInProgress/findWorkInProgressWeek.api",
        traceContext: {
          manyModels: this.newParts,
          title: "汇总数据周对比查询",
          partId: this.modelStrs,
          modelType: this.typeValue,
          activeIndex:this.activeIndex, 
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
          path: "compareStore",
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
            this.$store.commit("SET_COMPARESTORE_MODELS", self.newParts);
          } else {
            this.errorMsg = msg;
          }
        });
    }
    // initEcharts: function() {
    //   let seven1 = echarts.init(document.getElementById("seven1"));
    //   let seven2 = echarts.init(document.getElementById("seven2"));
    //   let seven3 = echarts.init(document.getElementById("seven3"));
    //   seven1.setOption({
    //     title: {
    //       text: "av9 bc sp",
    //       left: "right",
    //       y: "20",
    //       textStyle: {
    //         color: "#000000",
    //         fontWeight: "normal",
    //         fontSize: "13"
    //       },
    //       subtext: "607-07-01", //副标题文本样式
    //       subtextStyle: {
    //         fontSize: "10"
    //       }
    //     },
    //     color: "#404040",
    //     xAxis: {
    //       axisLabel: {
    //         interval: 0
    //       },
    //       data: ["第一周", "第二周", "第二周", "第二周"],
    //       // 多余的东西
    //       axisTick: { show: false },
    //       splitLine: { show: false }
    //     },
    //     yAxis: {
    //       // 多余的东西
    //       axisTick: { show: false },
    //       splitLine: { show: false }
    //     },
    //     series: [
    //       {
    //         type: "bar",
    //         label: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [3, 8, 41, 2],
    //         name: "unkhnow",
    //         itemStyle: { normal: { color: "#c0504d" } }
    //       },
    //       {
    //         type: "bar",
    //         label: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [1, 1, 21, 0.6666666666666666],
    //         name: "WIP",
    //         itemStyle: { normal: { color: "#4f81bd" } }
    //       }
    //     ],
    //     legend: {
    //       data: ["unkhnow", "WIP"],
    //       top: "90%"
    //     }
    //   });

    //   seven2.setOption({
    //     title: {
    //       text: "av9 bc sp",
    //       left: "right",
    //       y: "20",
    //       textStyle: {
    //         color: "#000000",
    //         fontWeight: "normal",
    //         fontSize: "13"
    //       },
    //       subtext: "607-07-01", //副标题文本样式
    //       subtextStyle: {
    //         fontSize: "10"
    //       }
    //     },
    //     color: "#404040",
    //     xAxis: {
    //       axisLabel: {
    //         interval: 0
    //       },
    //       data: ["第一周", "第二周", "第二周", "第二周"],
    //       // 多余的东西
    //       axisTick: { show: false },
    //       splitLine: { show: false }
    //     },
    //     yAxis: {
    //       // 多余的东西
    //       axisTick: { show: false },
    //       splitLine: { show: false }
    //     },
    //     series: [
    //       {
    //         type: "bar",
    //         label: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [3, 8, 41, 2],
    //         name: "unkhnow",
    //         itemStyle: { normal: { color: "#c0504d" } }
    //       },
    //       {
    //         type: "bar",
    //         label: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [1, 1, 21, 0.6666666666666666],
    //         name: "WIP",
    //         itemStyle: { normal: { color: "#4f81bd" } }
    //       }
    //     ],
    //     legend: {
    //       data: ["unkhnow", "WIP"],
    //       top: "90%"
    //     }
    //   });

    //   seven3.setOption({
    //     title: {
    //       text: "av9 bc sp",
    //       left: "right",
    //       y: "20",
    //       textStyle: {
    //         color: "#000000",
    //         fontWeight: "normal",
    //         fontSize: "13"
    //       },
    //       subtext: "607-07-01", //副标题文本样式
    //       subtextStyle: {
    //         fontSize: "10"
    //       }
    //     },
    //     color: "#404040",
    //     xAxis: {
    //       axisLabel: {
    //         interval: 0
    //       },
    //       data: ["第一周", "第二周", "第二周", "第二周"],
    //       // 多余的东西
    //       axisTick: { show: false },
    //       splitLine: { show: false }
    //     },
    //     yAxis: {
    //       // 多余的东西
    //       axisTick: { show: false },
    //       splitLine: { show: false }
    //     },
    //     series: [
    //       {
    //         type: "bar",
    //         label: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [3, 8, 41, 2],
    //         name: "unkhnow",
    //         itemStyle: { normal: { color: "#c0504d" } }
    //       },
    //       {
    //         type: "bar",
    //         label: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [1, 1, 21, 0.6666666666666666],
    //         name: "WIP",
    //         itemStyle: { normal: { color: "#4f81bd" } }
    //       }
    //     ],
    //     legend: {
    //       data: ["unkhnow", "WIP"],
    //       top: "90%"
    //     }
    //   });

    // }
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
  /* margin-bottom: 12px; */
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

.y_section-nav {
  /* padding-top: 12px; */
  align-items: center;
  /* margin-top: 1rem; */
  /* padding-top: 1rem; */
  border-bottom: 1rem solid #f4f4f4;
  border-top: 1rem solid #f4f4f4;
  padding: 0 1rem;
  min-height: 60px;
}
.y_section-nav > li {
  margin-bottom: 0;
  margin-top: 0;
}
.seven-max {
  height: 300px;
  min-height: 300px;
}
/* tiitle */
.nav-canvas-ipp {
  height: 30px;
  line-height: 60px;
  text-align: center;
  font-weight: 700;
}
</style>


                                                                                                                                                                       