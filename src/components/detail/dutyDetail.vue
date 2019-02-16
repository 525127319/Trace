<template>
  <div>
      <article>
        <!-- <nav class="nav">
            <span class="left"  @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1 v-text="this.$route.query.responsibilityUnit"></h1>
        </nav> -->
        <section class="section">
            <section class="main">
                <div class="content-box">
                      <scroll class="wrapper"
                            ref="scroll"
                            :dataList="dutyDetail"
                            :pullUpLoad="pullUpLoad"
                            @onPullUp="pullUpHandle"
                           >
                    <ul class="bad-detial">
                        <li v-for="(item,index) in dutyDetail" :key="index">
                            <p class="tit">
                                <span class="name" v-text="item.serialNumber"></span>
                                <span class="status red" v-text="item.status"></span>
                            </p>
                            <p class="cn" v-text="item.chineseDefectDesc"></p>
                            <p>
                                <span v-text="item.englishDefectDesc"></span>
                                <span v-text="item.empName"></span>
                            </p>
                            <p class="gr">
                                <span v-text="item.processName"></span>
                                <span v-text="item.responsibilityUnit"></span>
                            </p>
                            <p class="gr">
                                <span v-text="item.terminalName"></span>
                                <span v-text="item.recTime"></span>
                            </p>
                        </li>
                    </ul>
                    </scroll>
                </div>
            </section>
        </section>
    <popup :errorMsg="errorMsg"></popup>
         <waiting v-show="isWaiting" :number="number"></waiting>
    
    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import Loading from "../base/loading.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import jsBridge from "../../common/bridging";
export default {
  data() {
    return {
      dutyDetail: [], // 不良统计信息数据
      scrollY: 0,
      pullUpLoad: {
        threshold: -50
      },
      pageNum: 1, // 初始页面
      errorMsg: "", //错误信息
      isWaiting: true,
      number: 0,
      flag: true // 用来判断请求的与否
    };
  },
  created() {
    this.pullUpHandle(); // 获取不良统计信息详情数据
      jsBridge.registerHandler(
      "toGoBack",
      function(response) {
        this.back();
      }.bind(this)
    );
  },
  computed: {
    scrollElement() {
      return this.$refs.scroll;
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
    // 获取不良统计信息详情数据
    pullUpHandle() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        partId: this.$route.query.partId,
        processId: this.$route.query.processId,
        terminalId: this.$route.query.terminalId,
        startTime: this.$route.query.startTimeZore,
        endTime: this.$route.query.endTimeZore,
        // responsibilityUnit: this.$route.query.responsibilityUnit,
        // pageNum: this.pageNum

        // partId: "1000005030",
        // processId: "105153",
        // terminalId: "60011604",
        // startTime: "2017-11-29 00:00:00",
        // endTime: "2017-11-29 23:59:00",
        responsibilityUnit: this.$route.query.responsibilityUnit,
        pageNum: this.pageNum
      };
      console.log(data, "+++");
      if (this.flag) {
        this.flag = false;
        this.$axiosHttp
          .axiosPost("ks-trace/traceReport/queryDefectInfoDetail.api", data)
          .then(res => {
            console.log(res, 123);
            clearInterval(timer);
            this.number = 0;
            this.isWaiting = false;
            if (res.code == 200) {
              if (res.data.length == 0 && this.pageNum == 1) {
                this.errorMsg = "没有数据";
              }
              if (res.data.length > 0) {
                setTimeout(() => {
                  this.scrollElement.finishPullUp();
                  this.dutyDetail = this.dutyDetail.concat(res.data);
                  console.log(this.dutyDetail, "AAA");
                }, 500);
              } else {
                setTimeout(() => {
                  this.scrollElement.finishPullUp();
                  this.scrollElement.beforePullUpWord = "暂无更多数据";
                }, 100);
              }
            } else if (res.code == 500) {
              this.errorMsg = "网络速度太慢，加载不出来";
            } else if (res.code == 10005 || res.code == 10002) {
              this.errorMsg = "您的身份校验已过期，请重新登录";
            } else if (res.code == -404) {
              this.errorMsg = "数据较大，请稍后重试";
            } else {
              this.errorMsg = res.msg;
            }
            this.flag = true;
          });
      }
      this.pageNum++;
    }
  },
  components: {
    scroll,
    Loading,
    popup,
    waiting
  }
};
</script>
<style scoped>
.wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.bad-detial {
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.tips {
  position: absolute;
  bottom: 1rem;
  text-align: center;
  z-index: 100;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
}
</style>


