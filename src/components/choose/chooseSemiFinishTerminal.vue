<template>
  <div>
       <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
                 <span class="icon icon-left"></span>
            </span>
            <h1>选择站点</h1>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                    <ul class="gray-list">
                        <li>
                            <span class='key'>机种</span>
                             <div  class='m-val'>
                              <p class="e-name" ><span v-text="this.$route.query.modelName"></span> <span v-text="this.$route.query.upccode"></span></p>
                                <p class="c-name" v-text="this.$route.query.partNo">604-05312</p>
                            </div>
                        </li>

                        <li>
                            <span class='key'>开始日期</span>
                            <span class="value" >{{this.$route.query.startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.startTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>结束日期</span>
                            <span class="value" >{{this.$route.query.endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+this.$route.query.endTime.split(' ')[1]}}</span>
                        </li>
                        <li>
                            <span class='key'>类别</span>
                            <span class="value" v-text="this.$route.query.selectTypeValue"></span>
                        </li>
                        <li>
                            <span class='key'>料仓</span>
                            <span class="value" v-text="this.$route.query.warehouseValue"></span>
                        </li>
                        <li>
                            <span class='key'>制程</span>
                            <span class="value" v-text="this.$route.query.processName"></span>
                        </li>

                    </ul>
                   <div class="form">
                        <h3 class=form-title>选择站点 <div class="tab-btns"><button :class="{active:selectActive}" @click="filterAll()">全部</button><button :class="{active:!selectActive}" @click="filterData()">数量不为0</button></div></h3>
                        <!-- <div class="check-group">
                            <span class="check-item " @click="selectAll($event)" :class="{checked:flag}">全部</span>
                            <span class="check-item " v-for="(item,index) in siteList" :key="index"  v-text="item.terminalName" @click="selectSite(item,index)" :class="{checked:activeIndex==index || flag == true}"></span>
                           
                        </div> -->

                         <ul class="station-list" v-show="!showNoData">
                            <li class="station-item" @click="selectAll">
                            <div class="station-name">全部</div>
                            
                          </li>

                          <li class="station-item" v-for="(item,index) in siteList" :key="index" @click="selectSite(item)">
                            <div class="station-name" v-text="item.terminalName">BVCS Post AN01 QC-1</div>
                             <div class="r-num" v-show="status == '全部'">
                                <p class="num r" v-text="item.allNum" >80</p>
                                <p class="tex">全部数量</p>
                              </div>
                             <div class="r-num" v-show="status == 'OK'">
                                <p class="num r" v-text="item.okqty" >80</p>
                                <p class="tex">OK数量</p>
                              </div>
                            <div class="r-num" v-show="status == 'NG'">
                              <p class="num r" v-text="item.ngqty" >80</p>
                              <p class="tex">NG数量</p>
                            </div>
                             <div class="r-num" v-show="status =='报废'">
                              <p class="num r" v-text="item.scrapqty" >80</p>
                              <p class="tex">报废数量</p>
                            </div>
                          </li>
                         
                        </ul>
                    </div>
                     <!-- 没有数据的时候显示 -->
                  <div v-show="showNoData" class="no-data"></div>
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
      flag: false, // 是否选择全部
      activeIndex: -1, // 站点点中索引
      selectList: [], // 站点选中的数据
      siteList: [], // 站点数据
      terminalId: "", // 站点ID
      terminalValue: "", // 选中的站点值
      cover: false, // 显示弹窗
       selectActive: false,
         showNoData: false, // 显示数据不为0的数据有的时候显示
      isWaiting: true,
      status: this.$route.query.selectTypeValue,
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
     if (sessionStorage.getItem("siteList6")) {
      this.siteList = JSON.parse(sessionStorage.getItem("siteList6"));
       this.isWaiting = false;
    }else{
       this.getSite(); // 获取站点
    }
  },
  methods: {
    // 返回上一页
    back() {
       if(sessionStorage.getItem('siteList6All')||sessionStorage.getItem('siteList6')){
           sessionStorage.removeItem('siteList6All')
           sessionStorage.removeItem('siteList6')
           this.siteList=[]
       }
      this.$router.go(-1);
      
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
        // 全部数据
    filterAll() {
      this.selectActive = true;
      if (sessionStorage.getItem("siteList6All")) {
        this.siteList = [];
        this.siteList = JSON.parse(sessionStorage.getItem("siteList6All"));
         if(this.siteList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
      }
    },
    // 筛选有数据
    filterData() {
      this.selectActive = false;
      if(this.status == '全部'){
         let newArray = [];
      this.siteList.forEach((val, index) => {
        if (val.allNum != "0") {
          newArray.push(val);
        }
      });
      this.siteList = [];
      this.siteList = newArray;
      }else if(this.status == 'OK'){
          let newArray = [];
      this.siteList.forEach((val, index) => {
        if (val.okqty != "0") {
          newArray.push(val);
        }
      });
      this.siteList = [];
      this.siteList = newArray;
      }else if(this.status == 'NG'){
          let newArray = [];
      this.siteList.forEach((val, index) => {
        if (val.ngqty != "0") {
          newArray.push(val);
        }
      });
      this.siteList = [];
      this.siteList = newArray;
      }else if(this.status == '报废'){
          let newArray = [];
      this.siteList.forEach((val, index) => {
        if (val.scrapqty != "0") {
          newArray.push(val);
        }
      });
      this.siteList = [];
      this.siteList = newArray;
      }
        sessionStorage.setItem(
              "siteList6",
              JSON.stringify(this.siteList)
            );
      if(this.siteList.length==0){
                this.showNoData = true;
            }else{
               this.showNoData = false;
            }
    },
    // 获取站点
    getSite() {
      var timer = setInterval(() => {
        this.number = this.number + 1;
      }, 1000);
      var data = {
        processId: this.$route.query.processId,
        partId: this.$route.query.partId,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime
      };
      this.$axiosHttp
        .axiosPost("ks-rinse/rinse/queryCommonStation.api", data)
        .then(res => {
          console.log(res);
          clearInterval(timer);
          this.number = 0;
          this.isWaiting = false;
            // this.filterData()
          if (res.code == 200) {
            this.siteList = res.data; // 站点数据
             this.siteList = res.data; // 站点数据
             sessionStorage.setItem(
              "siteList6All",
              JSON.stringify(this.siteList)
            );
             this.filterData()
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
    // 选择全部站点
    selectAll(event) {
      // 去往半成品查询页面
      this.terminalId = ""; // 全选，默认传空字符串即可
      this.$router.push({
        path: "semiFinishWarehouse",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode, //upccode
          typeIndex: this.$route.query.typeIndex,
          partNo: this.$route.query.partNo,
          terminalId: this.terminalId,
          terminalValue: this.terminalValue,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          selectTypeValue: this.$route.query.selectTypeValue,
          selectTypeList: this.$route.query.selectTypeList,
          warehouseValue: this.$route.query.warehouseValue,
          startTimeZore: this.$route.query.sTime, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.eTime // 用来下一个页面发请求的
        }
      });
      // sessionStorage.setItem('startShow',this.$route.query.startShow)
      // sessionStorage.setItem('endShow',this.$route.query.endShow)
    },
    // 选择站点
    selectSite(item, index) {
      this.terminalId = item.terminalId;
      this.terminalValue = item.terminalName;
      this.$router.push({
        path: "semiFinishWarehouse",
        query: {
          partId: this.$route.query.partId,
          processId: this.$route.query.processId,
          processName: this.$route.query.processName,
          modelName: this.$route.query.modelName,
          upccode: this.$route.query.upccode, //upccode
          partNo: this.$route.query.partNo,
          typeIndex: this.$route.query.typeIndex,
          terminalId: this.terminalId,
          terminalValue: this.terminalValue,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          selectTypeValue: this.$route.query.selectTypeValue,
          selectTypeList: this.$route.query.selectTypeList,
          warehouseValue: this.$route.query.warehouseValue,
          startTimeZore: this.$route.query.sTime, // 用来下一个页面发请求的
          endTimeZore: this.$route.query.eTime // 用来下一个页面发请求的
        }
      });
    
    },

  
    close() {
      this.cover = false;
    }
  },
  components: {
    popup,
    waiting
  }
};
</script>
<style scoped>
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
.failed .close,
.success .close {
  position: absolute;
  left: 50%;
  bottom: -62px;
  width: 30px;
  height: 30px;
  transform: translate3d(-50%, -50%, 0);
  background: url("../../assets/images/error.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
