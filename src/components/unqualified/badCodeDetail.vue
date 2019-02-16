<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                    <span class="icon icon-left"></span>
            </span>
            <h1>不良代码</h1>
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
                            <span class='key'>制程</span>
                             <span class="value" v-text="this.$route.query.processName"> </span>
                        </li>

                    </ul>
                    <!-- <scroll class="wrapper"
                             ref="scroll"
                            :dataList="badCodeList"
                            :pullUpLoad="pullUpLoad"
                            @onPullUp="pullUpHandle"
                           > -->
                             <ul class="bad-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                                <li v-for="(item,index) in badCodeList" :key="index">
                                    <p>
                                        <span class="en-del" v-text="item.englishDefectDesc"></span>
                                        <span class="bad-type" v-text="item.defectType"></span>
                                    </p>
                                    <p>
                                        <span class="cn-del" v-text="item.chineseDefectDesc"></span>
                                        <span class="person">责任归属：<span style="padding-right:0;" v-text="item.responsibilityUnit"></span></span>
                                    </p>
                                </li>
                                
                            </ul>
                             <Loading class="loading" v-show="showLoading" ></Loading>
                         <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>
                         
                    <!-- </scroll> -->
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
import Loading from "../base/loading.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import pullingWord from "../base/pulling-word.vue";
export default {
  data() {
    return {
      badCodeList: [], // 不良代码数据
      scrollY: 0,
      pullUpLoad: {
        threshold: -50
      },
      pageNum: 1, // 初始页面
      errorMsg: "", //错误信息
      showLoading: false, // 显示加载动画
      showWord: false, // 显示文字提示
      loadingWord: "", // 提示文字
      busy: false,
      isWaiting: true,
      number: 0,
      flag: true, // 用来判断请求的与否
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
        text: "不良代码", //控制显示文本，空字符串表示显示默认文本
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
    loadMore() {
      this.busy = true;
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        partId: this.$route.query.partId, // 料号ID
        processId: this.$route.query.processId, //'制程id'
        processName: this.$route.query.processName, //'制程名称'
        pageNum: this.pageNum
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryDefectCodeVo.api", data)
        .then(res => {
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          console.log(res, "123");
          console.log(res.data.length, "长度是否为0");
          if (res.data.length === 0) {
             this.showLoading = false;
            this.showWord = true;
            this.loadingWord = "没有更多数据";
          }
          if (res.code == 200 && res.data.length != 0) {
            this.badCodeList = this.badCodeList.concat(res.data);
            this.showLoading = true;
            this.busy = false;
            this.pageNum++;
            if (res.data.length < 20) {
              this.showLoading = false;
            }
          } else if (res.code == 500) {
            this.errorMsgMsg = "网络速度太慢，加载不出来";
          } else if (res.code == 10005 || res.code == 10002) {
            this.errorMsg = "您的身份校验已过期，请重新登录";
          } else if (res.code == -404) {
            this.errorMsg = "数据较大，请稍后重试";
          } else {
            this.errorMsgMsg = res.msg;
          }
        })
        .catch(() => {
          this.errorMsg = "数据较大，请稍后重试";
        });
      console.log(this.modelList, 5656);
      console.log(this.pageNum, 777777);
    }

    // 获取不良代码数据
    // pullUpHandle() {
    //   var timer = setInterval(() => {
    //     this.number = this.number + 1;
    //   }, 1000);
    //   var data = {
    //     partId: this.$route.query.partId, // 料号ID
    //     processId: this.$route.query.processId, //'制程id'
    //     processName: this.$route.query.processName, //'制程名称'
    //     pageNum: this.pageNum
    //   };
    //   console.log(data, "+++");
    //   if (this.flag) {
    //     this.flag = false;
    //     this.$axiosHttp
    //       .axiosPost("ks-trace/traceReport/queryDefectCodeVo.api", data)
    //       .then(res => {
    //         console.log(res, 123);
    //         clearInterval(timer);
    //          this.number = 0;
    //         this.isWaiting = false;
    //         if (res.code == 200) {
    //           if (res.data.length == 0 && this.pageNum == 1) {
    //             this.errorMsg = "没有数据";
    //           }
    //           if (res.data.length > 0) {
    //             setTimeout(() => {
    //               this.scrollElement.finishPullUp();
    //               this.badCodeList = this.badCodeList.concat(res.data);
    //               console.log(this.badCodeList, "AAA");
    //             }, 500);
    //           } else {
    //             setTimeout(() => {
    //               this.scrollElement.finishPullUp();
    //               this.scrollElement.beforePullUpWord = "暂无更多数据";
    //             }, 100);
    //           }
    //         } else if (res.code == 500) {
    //           this.errorMsg = "网络速度太慢，加载不出来";
    //         } else if (res.code == 10005 || res.code == 10002) {
    //           this.errorMsg = "您的身份校验已过期，请重新登录";
    //         } else if (res.code == -404) {
    //           this.errorMsg = "数据较大，请稍后重试";
    //         } else {
    //           this.errorMsg = res.msg;
    //         }
    //         this.flag = true;
    //       });
    //   }
    //           this.pageNum++;

    // }
  },
  components: {
     scroll,
    waiting,
    Loading,
    popup,
    pullingWord
  }
};
</script>
<style scoped>
.wrapper {
  position: absolute;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.bad-list {
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
</style>


