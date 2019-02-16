<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title" style="overflow:inherit;">
            <span class="left" @click="back">
                  <span class="icon icon-left"></span>
            </span>
            <h1>仓库领料</h1>
        </nav>
        <section class="section">
            <header class="header">
                   <ul class="y_section-nav">
                      <li class="active" >
                        <router-link to="/warehouseReceiptRecord">
                         领料
                         </router-link>
                      </li>
                      <li >
                        <router-link to="/dayEntrepot">
                          当天仓库机种领料
                        </router-link>
                      </li>
                      <li>
                        <router-link to="/daysEntrepot">
                         多天仓库机种领料
                         </router-link>
                      </li>
                    </ul>
                <div class="search">
                    <!-- <input type="text" placeholder="如查询多个请以英文逗号隔开" v-model.trim="content">
                    <span class="icon icon-search-right" @click="goSearch"></span> -->
                     <form style="width:100%" action="javascript:void(0);"> <input style="width:100%; " type="search" ref='search'  placeholder="如查询多个请以英文逗号隔开" v-model.trim="content" @keyup="goSearch()" /> </form>
                </div>
            </header>
            <section class="main"  @click="blurEvent()"  @touchmove="blurEvent()">
                <div class="content-box">
                     <!-- <scroll class="wrapper"
                             ref="scroll"
                            :dataList="receipteRecordList"
                            :pullUpLoad="pullUpLoad"
                            @onPullUp="pullUpHandle"
                    > -->
                  
                     <ul class="use-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                        <li v-for="(item,index) in receipteRecordList" :key="index">
                            <p>
                                 <span v-text="item.terminalName" class="break" ></span> 
                               
                            </p>
                            <p>
                                <span>扫描箱号：<span v-text="item.cartonNo"></span></span>
                            </p>
                            <p class="partment">
                           
                                <span class="part-name" v-text="item.deptName"></span>
                            </p>
                            <p>
                                <span v-text="item.empName"></span>
                                 <span class="in" v-text="item.operaterType"></span>
                            </p> 
                            <p>
                                <span class="gar">应用程序：<span v-text="item.applicationName"></span></span>
                                <span class="gar" v-text="item.updateTime"></span>
                            </p>
                        </li>
                         <Loading class="loading" v-show="showLoading" ></Loading>
                         <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>
                    </ul>
                    <!-- </scroll> -->

                </div>
            </section>
        </section>
            <popup :errorMsg="errorMsg" ></popup>
           <waiting v-show="isWaiting" :number="number"></waiting>
       
    </article>
          <div class="pop" v-show="warehouseReceiptRecordPrompt">
        <!-- 我知道 -->
        <div class="ok"  @click="handlePrompt"></div>
            <!-- 点击查询 -->
        <!-- <div class="inquire"></div> -->
        <!-- 切换查询类别 -->
        <div class="inquire-list"></div>
        <div class="ck"></div>
      </div>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import Loading from "../base/loading.vue";
import pullingWord from "../base/pulling-word.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      warehouseReceiptRecordPrompt:true,
      isActive:false,
      receipteRecordList: [], // 仓库领料记录数据
      content: "", // 搜索内容
      scrollY: 0,
      pullUpLoad: {
        threshold: -20
      },
      pageNum: 1, // 初始页面
      showPopup: false, // 显示弹窗
      errorMsg: "", //错误信息
      showLoading: false, // 显示加载动画
      showWord: false, // 显示文字提示
      loadingWord: "", // 提示文字
      busy: false,
      isWaiting: false,
      number: 0,
      isShow:false,
      inSearching: false, // 是否搜索
      showH5Title: true, // 是否显示H5的头部，默认显示
      flag: true, // 用来判断请求的与否
      address:[
          {name:"当天仓库机种领料总数",path:"/dayEntrepot"},
          {name:"多天仓库机种领料总数",path:"/daysEntrepot"},
      ]
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
        text: "仓库领料", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      
      });
      // 设置右侧按钮
      this.IM.setRight({
          backcoler: "#ffffff",
          isclickble: "0",
          text: "",
          textColor: "#ff7e00",
          type: "0",
          url: ""
      });
      

    if(localStorage.getItem('warehouseReceiptRecordPrompt') =='false'){
       this.warehouseReceiptRecordPrompt=false;
    }

    this.content = sessionStorage.getItem("contentRecord") || "";
    

  },
  computed: {
    scrollElement() {
      return this.$refs.scroll;
    }
  },
  methods: {
     handlePrompt(){
        this.warehouseReceiptRecordPrompt=false;
        localStorage.setItem('warehouseReceiptRecordPrompt',this.warehouseReceiptRecordPrompt);
    },
    showMenu(){
       this.isShow = !this.isShow
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
      this.warehouseReceiptRecordPrompt=false;
      localStorage.setItem('warehouseReceiptRecordPrompt',this.warehouseReceiptRecordPrompt);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
     blurEvent(){
     this.$refs.search.blur();
    },
     loadMore() {
      this.busy = true;
     if(this.inSearching){ // 点击搜索的时候，重置相关条件
        console.log(9);
       this.pageNum = 1,
      //  this.inSearching = false,
       this.receipteRecordList = [],
       this.showLoading = false
       this.loadingWord = ''
       this.showWord = false;
     }
      // if(this.inSearching){
      //     this.pageNum = 1;
      //   }
      var data = {
        cartonNo: this.content, // 搜索内容
        pageNum: this.pageNum
      };
       if (this.content) {
      //  this.isWaiting = true;
      //   var timer = setInterval(() => {
      //   this.number = this.number + 1;
      // }, 1000);
     
      
      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryPickingVo.api", data)
        .then(res => {
          //  clearInterval(timer);
          //  this.number = 0;
          // this.isWaiting = false;
           this.inSearching = false,
          console.log(res, "123");
          console.log(res.data.length,'长度是否为0')
          if(res.data.length === 0){
            this.showWord = true
              this.loadingWord = '没有更多数据'
            }
          if (res.code == 200 && res.data.length != 0) {
              this.receipteRecordList = this.receipteRecordList.concat(res.data);
            
              this.showLoading = true;
            if (res.data.length < 20) {
              this.showLoading = false;
            }
           this.pageNum++;
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
       }
            this.busy = false; // 放请求后面，避免多次请求
       
      console.log(this.modelList, 5656);
      console.log(this.pageNum, 777777);
    },

    // 点击搜索
    goSearch() {
      // if (this.content) {
      //  this.inSearching =true;
      // }
      //  this.pageNum = 1,
       this.inSearching = !this.inSearching;
       console.log(this.inSearching,'搜索标识')
       sessionStorage.setItem("contentRecord", this.content);   
       if(this.inSearching){
            this.loadMore()
         
       }
    },
















    // 点击搜索
    // goSearch() {
    //   if (!this.content) {
    //     this.errorMsg = "搜索内容不能为空";
    //     return;
    //   }
    //   sessionStorage.setItem("contentRecord", this.content);
    //   this.number = 0;
    //   this.isWaiting = true;
    //   this.inSearching = true;
    //   this.receipteRecordList = [];
    //   this.pageNum = 1;
    //   this.fetchData(res => {
    //     this.receipteRecordList = res;

    //     console.log(this.receipteRecordList, "____+");
    //   });
    //         this.pageNum++;
    // },
    // pullUpHandle(val) {
    //   this.fetchData(res => {
    //     // this.scrollElement.PullingUpWord = "加载完成";
    //     setTimeout(() => {
    //       this.scrollElement.finish("PullUp");
    //       this.receipteRecordList = this.receipteRecordList.concat(res);
    //       console.log(this.receipteRecordList, "____++");
    //     }, 1000);
    //   });
    //         this.pageNum++;
      
    // },
    // fetchData(callback) {
    //   var timer = setInterval(() => {
    //     this.number = this.number + 1;
    //   }, 1000);
    //   var data = {
    //     cartonNo: this.content, // 搜索内容
    //     pageNum: this.pageNum
    //   };
    //   console.log(data, "+++");
    //   this.$axiosHttp
    //     .axiosPost("ks-trace/traceReport/queryPickingVo.api", data)
    //     .then(res => {
    //       console.log(res, "123");
    //       clearInterval(timer);
    //        this.number = 0;
    //       this.isWaiting = false;

    //       // res = res.data;
    //       if (res.code == 200) {
    //         res = res.data;
    //         if (res.length == 0) {
    //           this.errorMsg = "没有数据";
    //         } else if (res.length > 0) {
    //           callback && callback(res);
    //         } else {
    //           setTimeout(() => {
    //             this.scrollElement.finishPullUp();
    //             this.scrollElement.beforePullUpWord = "暂无更多数据";
    //           }, 100);
    //         }
    //         this.inSearching = false;
    //       } else if (res.code == 500) {
    //         this.inSearching = false;
    //         this.errorMsgMsg = "网络速度太慢，加载不出来";
    //       } else if (res.code == 10005 || res.code == 10002) {
    //         this.errorMsg = "您的身份校验已过期，请重新登录";
    //       } else if (res.code == -404) {
    //         this.errorMsg = "数据较大，请稍后重试";
    //       } else {
    //         this.inSearching = false;
    //         this.errorMsgMsg = res.msg;
    //       }
    //     })
    //     .catch(() => {
    //       this.inSearching = false;
    //       this.errorMsg = "数据较大，请稍后重试";
    //     });
    // },
    close() {
      this.showPopup = false;
    }
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
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.use-list {
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
.break {
  word-break: break-all;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 1000;
}
.failed {
  position: absolute;
  left: 50%;
  top: 182px;
  width: 18rem;
  height: 11.8rem;
  transform: translate3d(-50%, 0, 0);
  /* border: 1px solid #fff; */
  box-shadow: 0 0 5px #fff;
  border-radius: 4px;
  background: #ffffff;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success {
  position: absolute;
  left: 50%;
  top: 182px;
  width: 18rem;
  height: 11.8rem;
  transform: translate3d(-50%, 0, 0);
  /* border: 1px solid #fff; */
  box-shadow: 0 0 5px #fff;
  border-radius: 4px;
  background: #ffffff;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.failed .warn {
  width: 34px;
  height: 34px;
  margin-top: 29px;
  background: url("../../assets/images/warn.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.success .congratulations {
  width: 34px;
  height: 34px;
  margin-top: 29px;
  background: url("../../assets/images/right.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.failed .text,
.success .text {
  /* width: 34px; */
  font-size: 18px;
  margin-top: 2rem;
}
.failed .check {
  width: 96px;
  height: 26px;
  font-size: 13px;
  line-height: 26px;
  color: #2196f3;
  opacity: 0.87;
  border: 1px solid rgb(81, 166, 245);
  text-align: center;
  margin-top: 20px;
}
.success .check {
  width: 86px;
  height: 26px;
  font-size: 13px;
  line-height: 26px;
  color: rgb(153, 153, 153);
  opacity: 0.87;
  border: 1px solid rgba(153, 153, 153, 0.3);
  text-align: center;
  margin-top: 20px;
}
.inquire-list{
  top: 15px;
}



</style>

