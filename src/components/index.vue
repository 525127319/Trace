<template>
  <div>
      <article>
        <nav class="nav"  v-show="showH5Title">
            <span class="left" @click="goBackApp">
               <span class="icon icon-left"></span>
            </span>
            <h1>Trace</h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <ul class="menus">
                        <li class="menu-list">
                            <div class="menu-item" @click="toProcessCustomerInformation">
                                <span class="img customerinformation"></span>
                                <span class="txt">成品信息</span>
                            </div>
                            <div class="menu-item" @click="toReceiptRecord">
                                <span class="img warehouse"></span>
                                <span class="txt">仓库领料</span>
                            </div>
                            <div class="menu-item" @click="toProcessProduction">
                                <span class="img produce"></span>
                                <span class="txt">生产在制</span>
                            </div>
                        </li>
                        <li class="menu-list">
                            <div class="menu-item" @click="toCartonNoQuery">
                                <span class="img casenumber"></span>
                                <span class="txt">箱号数量详情</span>
                            </div>
                            <div class="menu-item" @click="toChooseWarehouse">
                                <span class="img materials"></span>
                                <span class="txt">通用查询</span>
                            </div>
                            <div class="menu-item" @click="toProductRecord">
                                <span class="img productrecord"></span>
                                <span class="txt">产品履历</span>
                            </div>
                        </li>
                        <li class="menu-list">
                           
                             <div class="menu-item" @click="toProcessInputOut">
                                <span class="img  in-out"></span>
                                <span class="txt">投入产出</span>
                            </div>
                            <div class="menu-item" @click="toProcessBadCode">
                                <span class="img badcode"></span>
                                <span class="txt">不良代码</span>
                            </div>
                            <div class="menu-item" @click="toProcessBadInformation">
                                <span class="img badinformation"></span>
                                <span class="txt">不良信息</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </section> 
    </article>
    <asynindex></asynindex>
  </div>
</template>
<script>
import Utils from "../common/utils";
// import IM from "../common/WebViewJavascriptBridge.js";
import IM from "../common/WebViewJavascriptBridge.js";
import asynindex from './query/asynindex.vue';

export default {
  components: {
    asynindex,    
  },
  data() {
    return {
      flags: true, // 判断是否是从APP直接进入首页的
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
        state: "0", // 返回手机APP
        onSuccess: function(result) {
          alert(result)
           self.goBackApp();
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
        text: "Trace", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      
      });
      // 设置右侧按钮
      this.IM.setRight({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "0", //0：文字     1：图标   （必传）
        text: "", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ffffff", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });
   
   

    this.$router.beforeEach((to, from, next) => {
      this.flags = false;
      next();
      // `to` 和 `from` 都是路由对象
    });

    if (this.flags) { // 代表从APP端直接进来的时候
      this.unreadData();
    }
  },

  methods: {
    // 点击返回app页面
    goBackApp() {
      //返回app页
      if (typeof JSInterface === "undefined") {
        window.location.href =
          "next://http://iacloud.ceway.com.cn/app-xproject/";
      } else {
        JSInterface.changeActivity();
      }
    },
    show() {
      this.isShow = !this.isShow;
    },
    // 去往生产在制的选择制程页面
    toProcessProduction() {
      sessionStorage.removeItem('processList5All')
      sessionStorage.removeItem('processList5')
      this.$router.push({
        path: "processProduction",
        query: {
          path: "processProduction"
        }
      });
     
    },
    // 去往不良信息的选择制程页面
    toProcessBadInformation() {
       sessionStorage.removeItem('processList2All')
       sessionStorage.removeItem('processList2')
      this.$router.push({
        path: "processBadInformation",
        query: {
          path: "processBadInformation"
        }
      });
     
    },
    // 去往不良代码的选择制程页面
    toProcessBadCode() {
      sessionStorage.removeItem('processList1All')
      sessionStorage.removeItem('processList1')
      this.$router.push({
        path: "processBadCode",
        query: {
          path: "processBadCode"
        }
      });
     
    },
    // 去往投入产出的选择制程页面
    toProcessInputOut() {
        sessionStorage.removeItem('processList4All')
        sessionStorage.removeItem('processList4')
      this.$router.push({
        path: "processInputOut",
        query: {
          path: "processInputOut"
        }
      });
     
    },
    // 去往客户信息的选择制程页面
    toProcessCustomerInformation() {
       sessionStorage.removeItem('processList3')
       sessionStorage.removeItem('processList3All')
      this.$router.push({
        path: "processCustomerInformation",
        query: {
          path: "processCustomerInformation"
        }
      });
     
    },
    // 去往产品履历查询页面
    toProductRecord() {
      this.$router.push({ path: "productRecord" });

    },
    // 去往仓库领料记录查询页面
    toReceiptRecord() {
      this.$router.push({ path: "warehouseReceiptRecord" });
  
    },
    // 去往箱号数量查询页面
    toCartonNoQuery() {
      this.$router.push({ path: "cartonNoQuery" });
   
    },
    // 去往万能通用查询
    toChooseWarehouse() {
      this.$router.push({
        path: "chooseWarehouse",
        query: {
          path: "chooseWarehouse"
        }
      });
    
    },

    // 去选择制程页面
    toChooseProcess(val) {
    
      this.$router.push({
        path: "chooseProcess",
        query: {
          targetNumber: val // 代表哪里来的
        }
      });
    },

    // 当天未读数量请求
    unreadData() {
      console.log("进入了请求");
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/querySaDayCount.api")
        .then(res => {
          console.log("当天未读数量：res", res);
          let { code, msg, data } = res;
          switch (code) {
            case 200:
              this.$store.commit("SET_COUNT", data);
              break;
          }
        });
    }
  }
};
</script>



