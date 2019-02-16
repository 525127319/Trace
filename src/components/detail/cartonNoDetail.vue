<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <!-- 列表渲染控制隐藏与显示-->
            <!-- 列表向右滑动选择站点-->
            <h1>箱号数量</h1>
            <span class="right" @click="filterTerminal">
                <span class="icon icon-filter "></span>
            </span>
        </nav>
        <section class="section" v-show="!isShowTerminal">
            <section class="main">
                <div class="content-box">
                    <ul class="gray-list">
                        <li class="box-number ">
                          <div class="box-con">
                            <span class='key' style='min-width:36px;'>箱号</span>
                             <!-- <span class="value"  v-show="noList.length == 1"> -->
                              <!-- {{this.$route.query.cartonNo.split(',')[0]}} -->
                              <!-- {{this.$route.query.cartonNo}} -->
                            <!-- </span> -->
                             <!-- v-show="noList.length >= 2" -->
                            <span style="display:block;min-width:292px;" class="value" >
                              <!-- <span>{{this.$route.query.cartonNo.split(',')[0]+',' }}</span>
                             
                              <span>{{this.$route.query.cartonNo.split(',')[1]+','}}</span> -->
                               <span class="y_span">
                                  <span>{{this.$route.query.cartonNo.replace(/,/g," ")}}</span>  
                                 
                                 </span>
                               <!-- <span>{{this.$route.query.cartonNo}}</span> -->
                            </span>
                          </div>
                            <div class="rest-box-number" v-show="noList.length > 2">  
                                <span v-for="(item,index) in noMoreList" :key="index" v-text="index==noMoreList.length-1?item:item+','"></span>
                            </div>
                        </li>
                        <li>
                            <span class='key'>类别</span>
                            <span class="value" v-text="this.$route.query.typeValue"></span>
                        </li>
                    </ul>
 
                    <ul class="all-box">
                        <li v-for="(item,index) in cartoNoList" :key="index">
                            <div class="box-num-tit">
                                <p>
                                    机种：<span v-text="item.boxQtyDetailVo.modelName"></span>
                                </p>
                                <p>
                                    <span> 工单类别：<span v-text="item.boxQtyDetailVo.workOrder"></span></span>

                                    <span class="name">产品数量
                                     <span class="number" v-text="item.boxQtyDetailVo.productQty"></span>
                                    </span>
                                </p>
                            </div>
                            <div class="box-detial " :class="{'open':itemPro.isShowScan}"  v-for="(itemPro,index) in item.boxDetailVos" :key="index"  >  
                                <div class="select-head" @click="showScan(item,itemPro,index)">
                                    <p>
                                        <span v-text="itemPro.serialNumber"></span>
                                        <span class="gr" v-text="itemPro.fatpNo"></span>
                                    </p>
                                    <!-- <span  class="icon icon-up"></span> -->
                                    <span  class="icon icon-down"></span>
                                </div>
                                <ul class="scan-del" v-show="itemPro.isShowScan">
                                    <li v-for="(teminalItem,index) in itemPro.nameAndTimeVos" :key="index">
                                        <span v-text="teminalItem.terminalName"></span>
                                        <span v-text="teminalItem.scanTime"></span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </section>

    </article>
    <div class="mask" v-show="isShowTerminal" @click="filterTerminal"></div>
    <transition name="slide-fade">
        <div class="select-station" v-show="isShowTerminal">
        <div class="form">
            <h3 class=form-title>选择站点</h3>
            <div class="check-group">
                <span class="check-item "  v-for="(item,index) in terminalIdAndNameList" :key="index" v-text="item.terminalName" :class="{checked:terminalIndex==index}" @click="selectTerminal(item,index)"></span>
            </div>
        </div>
        <div class="con-btn">
            <span class="cancel" @click="cancel">取消</span>
            <span class="enter" @click="toSure">确认</span>
        </div>
    </div>
    </transition>
        <popup :errorMsg="errorMsg" ></popup>
        <waiting v-show="isWaiting" :number="number"></waiting>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import moment from "moment";
import waiting from "../base/waiting.vue";

export default {
  data() {
    return {
      terminalIndex: -1, // 选择站点索引
      isShowTerminal: false, // 显示侧边栏站点筛选列表
      isShowScan: false,
      cartoNoList: [], // 箱号数量数据
      activeIndex: -1, // 是否展开
      terminalIdAndNameList: [], // 站点数据
      noList: [], // 输入的箱号数组
      noMoreList: [], // 输入的箱号数组大于2个
      terminalId: "", // 站点ID
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
        text: "箱号数量", //控制显示文本，空字符串表示显示默认文本
        textColor: "#212121", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
      });
      // 设置右侧按钮
      this.IM.setRight({
        isclickble: "1", //0 默认不受控    1受控   （必传）
        type: "1", //0：文字     1：图标   （必传）
        text: "", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "http://120.78.81.180/material/picture/fHMe5jPmkeMz4Ew4fphxkelWSvdKNCbN.png", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        onSuccess:function(result) {
           self.filterTerminal();
        },
      });

    this.noList= this.$route.query.cartonNo.split(','); // 输入的箱号数组
    if(this.noList.length>2){
      this.noMoreList = this.noList.slice(2);
      console.log(this.noMoreList,'大于两个箱号的数组，从第三个开始')
    }
    console.log(this.noList,'切割箱号')
    this.getCartonNoDetail(); // 获取箱号数量详情
    this.getTerminal();
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
    // 获取箱号数量详情
    getCartonNoDetail() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        cartonNo: this.$route.query.cartonNo,
        terminalId: this.terminalId,
        // 'type': this.$route.query.type,

        // cartonNo: "",
        // terminalId: "52203512",
        type: this.$route.query.type
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryBoxQtyDetailVo.api", data)
        .then(res => {
          console.log(res);
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
          if (res.code == 200) {
            if (res.data != null) {
              res.data.listMap.forEach(val => {
                val.boxDetailVos.forEach(ele => {
                  ele.isShowScan = false;
                  ele.nameAndTimeVos.forEach(value => {
                    value.scanTime = moment(value.scanTime).format(
                      "YYYY-MM-DD HH:mm"
                    ); //格式化时间
                  });
                });
              });
              this.cartoNoList = res.data.listMap; // 获取箱号数据
              // this.terminalIdAndNameList = res.data.terminalIdAndNameSet; // 站点数据
            } else {
              this.errorMsg = "没有数据";
            }

            // console.log(this.terminalIdAndNameList, "==");
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
    // 点击展开和收缩站点列表
    showScan(item, itemPro, index) {
      itemPro.isShowScan = !itemPro.isShowScan;
      console.log(itemPro, 66);
      console.log(itemPro.isShowScan, 76);
    },
    // 点击筛选站点
    filterTerminal() {
      this.isShowTerminal = !this.isShowTerminal;
    },
    getTerminal() {
      var data = {
        cartonNo: this.$route.query.cartonNo,
        terminalId: "",
        // 'type': this.$route.query.type,
        // cartonNo: "",
        // terminalId: "52203512",
        type: this.$route.query.type
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryBoxQtyDetailVo.api", data)
        .then(res => {
          console.log(res);
          this.isWaiting = false;
          if (res.code == 200) {
            if (res.data != null) {
              // res.data.listMap.forEach(val => {
              //   val.boxDetailVos.forEach(ele => {
              //     ele.isShowScan = false;
              //     ele.nameAndTimeVos.forEach(value => {
              //       value.scanTime = moment(value.scanTime).format(
              //         "YYYY-MM-DD HH:mm"
              //       ); //格式化时间
              //     });
              //   });
              // });
              // this.cartoNoList = res.data.listMap; // 获取箱号数据

              this.terminalIdAndNameList = res.data.terminalIdAndNameSet; // 站点数据
            } else {
              this.errorMsg = "没有数据";
            }
            console.log(this.terminalIdAndNameList, "==");
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
    // 选择站点
    selectTerminal(item, index) {
      this.terminalIndex = index;
      this.terminalId = item.terminalId;
    },
    // 取消
    cancel() {
      this.isShowTerminal = false;
    },
    // 点击确定按钮
    toSure() {
      this.getCartonNoDetail();
      this.isShowTerminal = false;
    }
  },

  components: {
    popup,
    waiting
  }
};
</script>
<style scoped>
.isShowbb {
  display: block;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(80%);
  /* opacity: 0; */
}
 .y_span{
   padding: 3px 0;
   display: inline-block;
   width: 50%;
   height: 40px;
   line-height: 30px;
   overflow-y: hidden;
   white-space: pre-wrap;
   font-size: 16px;
 }
 .y_span span{
   display: inline-block;
   width: 100%;
   height: 100%;
   overflow-y: auto;
 }
</style>



