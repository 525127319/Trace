<template>
  <div>
      <article>
        <nav class="nav" v-show="showH5Title">
            <span class="left"  @click="back">
               <span class="icon icon-left"></span>
            </span>
            <h1>选择日期、类别和料仓</h1>
            <span class="right" @click="toSure">
                <span class="or">
                    确认
                </span>
            </span>
        </nav>
        <section class="section">
            <section class="main">
                <div class="content-box">
                 <div class="gental-tip" style='min-height:44px;'>
                     <span class="tip-title">温馨提示：</span>
                     <div class="tip-content">
                    <p>您可以查询<span v-text=" beforeTime"></span>之前的数据</p>
                       <!-- <p>仅提供一个小时之前数据</p>
                       <p>仅提供一个小时之前数据</p> -->
                      </div>
                     </div>
                  
                     <div class="mache-type  c"  @click="tochooseModel" style="margin-top:0;">
                        <div  class="m-name">机种选择</div>
                        <div  class='m-val'>
                         <p class="e-name" ><span v-text="this.$route.query.modelName"></span> <span v-text="this.$route.query.upccode"></span></p>
                          <p class="c-name" v-text="this.$route.query.partNo"> </p>
                        </div>
                        <span class="icon icon-right"></span>
                    </div>
                    
                    <div class="form" style="margin-top:-1rem;">
                        <h3 class="form-title">选择日期</h3>
                        <div class="time-select">
                            <p>
                                <span v-show="startTime">{{startTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+startTime.split(' ')[1]}}</span>
                                <input type="datetime-local" v-model="startDefaultTime" @change="chooseStartTime">
                            </p>
                            <p>
                                <span  v-show="endTime">{{endTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;'+endTime.split(' ')[1]}}</span>
                                <input type="datetime-local" v-model="endDefaultTime"  @change="chooseEndTime">
                            </p>
                        </div>
                    </div>
                    <div class="form">
                        <h3 class=form-title>选择类别</h3>
                        <div class="check-group">
                            <span class="check-item " :class="{checked:flag}" @click="selectAll">全部</span>
                            <span class="check-item" :class="{checked:typeIndex==index }" v-for="(item,index) in typeList" :key="index" v-text="item" @click="selectType(item,index)" ></span>
                            
                        </div>
                    </div>
                    <div class="form">
                        <h3 class=form-title>选择料仓</h3>
                        <div class="check-group">
                            <span class="check-item " v-for="(item,index) in warehouseList" :key="index" :class="{checked:warehouseIndex==index}" v-text="item" @click="selectWarehouse(item,index)" ></span>
                        </div>
                    </div>
                </div>
            </section>
        </section>
            <popup :errorMsg="errorMsg"></popup>   
    </article>
        <div class="pop" v-show="chooseWarehousePrompt">
        <!-- 我知道 -->
        <div class="ok"  @click="handlePrompt"></div>
        <!-- 点击查询 -->
        <div class="inquire"></div>
        <!-- 选择机种 -->
        <div class="select-jz"></div>
        <!-- 选择查询查询日期 -->
        <div class="inquireri-date"></div>
        <!-- 仓库领料页面 -->
        <div class="warehouses"></div>
        <!-- 选择类别 -->
        <div class="se-lb"></div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import popup from "../base/popup .vue";
export default {
  data() {
    return {
      chooseWarehousePrompt:true,
      startTime: "", // 开始时间 2018-01-30T11:00:52.738
      endTime: "", // 结束时间
      beforeTime: '',
      startDefaultTime: '',
      endDefaultTime: '',
      warehouseList: ["半成品仓", "成品仓"], // 料仓数据
      warehouseIndex: 0, //选择料仓索引
      warehouseValue: "半成品仓", // 选中的料仓值
      typeList: ["OK", "NG", "报废"], // 选择类别数据
      flag: true, // 是否全选类别
      typeIndex: -1, // 类别索引
      selectTypeList: ["OK", "NG", "报废"], // 选中的类别值数组
      selectTypeValue: "全部", // 选中的类别值
      errorMsg: "", //错误信息
      showPopup: false, // 显示弹窗
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
        text: "确定", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        onSuccess: function(result) {
           self.toSure();
        },
      });

    

    const zeroTime = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
    const zeroTimeTemp = moment(zeroTime).format('X');
    const twoTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+2*60*60*1000); // 当天2点
    const twoTimeTemp = moment(twoTime).format('X');
    const yestoday = moment().subtract(1, 'days').hour(0).minute(0).format('YYYY-MM-DD HH:mm');

    const nowTimeSelect = moment().format('X'); // 当前时间戳
    const beforeTwoHours = nowTimeSelect - 7200;
    const end =  new Date(beforeTwoHours*1000);
     this.beforeTime = moment(end).format("YYYY-MM-DD HH:mm");
    if (sessionStorage.getItem("s") && sessionStorage.getItem("e")) {
      // 存储有值的情况
      this.startTime = sessionStorage.getItem("s");
      this.endTime = sessionStorage.getItem("e");
       const start = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      );  
    } else {
      // 没有存储值的情况
      const start = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      );
        if(nowTimeSelect>zeroTimeTemp&&nowTimeSelect<twoTimeTemp){
             this.startTime =  moment().subtract(1, 'days').hour(0).minute(0).format('YYYY-MM-DD HH:mm');
        }else{
            this.startTime = moment(start).format("YYYY-MM-DD HH:mm");
        }
      this.endTime = moment(end).format("YYYY-MM-DD HH:mm");
    }
      // 处理点击时间控件进去还是默认时间
       moment(this.startTime).format();
       moment(this.endTime).format();
      const cutsIndex = moment(this.startTime).format().indexOf('+');
      const cuteIndex = moment(this.endTime).format().indexOf('+');
      this.startDefaultTime= moment(this.startTime).format().substring(0,cutsIndex)
      this.endDefaultTime= moment(this.endTime).format().substring(0,cuteIndex)

     if (this.$route.query.modelName === null) {
      this.$route.query.modelName = "";
    }
     if (this.$route.query.modelName == undefined) {
      this.$route.query.modelName = "Flash TC";
    }
    if (this.$route.query.upccode == undefined) {
      this.$route.query.upccode = "Sparrow";
    }
     if (this.$route.query.upccode === null) {
      this.$route.query.upccode = "";
    }
    if (this.$route.query.partNo == undefined) {
      this.$route.query.partNo = "604-70711";
    }
     if(localStorage.getItem('chooseWarehousePrompt') =='false'){
       this.chooseWarehousePrompt=false;
    }
    
  },
  methods: {
    handlePrompt(){
        this.chooseWarehousePrompt=false;
        localStorage.setItem('chooseWarehousePrompt',this.chooseWarehousePrompt);
    },
    // 返回上一页
    back() {
      this.$router.push({
        path: "index"
      });
        if(sessionStorage.getItem('processList6All')&&sessionStorage.getItem('processList6')){
        sessionStorage.removeItem('processList6All')
        sessionStorage.removeItem('processList6')
      }
      this.chooseWarehousePrompt=false;
      localStorage.setItem('chooseWarehousePrompt',this.chooseWarehousePrompt);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    // 去往选择机制页面
    tochooseModel() {
      sessionStorage.setItem("s", this.startTime);
      sessionStorage.setItem("e", this.endTime);
      this.$router.push({
        path: "modelList",
        query: {
          path: this.$route.query.path // 判断是哪个流程进来的
        }
      });
    },
    // 选择开始时间
    chooseStartTime() {
      if(this.startDefaultTime){
          this.startTime = moment(this.startDefaultTime).format("YYYY-MM-DD HH:mm");
        }else{
          this.startTime = ''
        }
         if(sessionStorage.getItem('processList6All')&&sessionStorage.getItem('processList6')){
        sessionStorage.removeItem('processList6All')
        sessionStorage.removeItem('processList6')
      }
       this.processList = [],
        this.showSelectProcess = false;
    },
    // 选择结束时间
    chooseEndTime() {
      if(this.endDefaultTime){
          this.endTime = moment(this.endDefaultTime).format("YYYY-MM-DD HH:mm");
      }else{
          this.endTime = ''
      }
      if(sessionStorage.getItem('processList6All')&&sessionStorage.getItem('processList6')){
          sessionStorage.removeItem('processList6All')
          sessionStorage.removeItem('processList6')
      }
          this.processList =[],
          this.showSelectProcess = false;
    },
    // 选择全部类别
    selectAll() {
      this.flag = !this.flag;
      if (this.flag) {
        this.selectTypeList = this.typeList; // 全部类别
        this.selectTypeValue = "全部";
          this.typeIndex = -1;
      } else {
        this.typeIndex = -1;
        this.selectTypeList = []; // 取消全选
      }
    },
    // 选择一个类别
    selectType(item, index) {
      this.typeIndex = index;
      if (index == 0) {
        this.selectTypeList = ["OK"];
        this.selectTypeValue = "OK";
        this.flag = false;
      } else if (index == 1) {
        this.selectTypeList = ["NG"];
        this.selectTypeValue = "NG";
        this.flag = false;
      } else if (index == 2) {
        this.selectTypeList = ["报废"];
        this.selectTypeValue = "报废";
        this.flag = false;  
      }
    },
    // 选择料仓
    selectWarehouse(item, index) {
      this.warehouseIndex = index;
      this.warehouseValue = item;
    },
    // 点击确定按钮跳转
    toSure() {
       if(!this.startTime || !this.endTime){
         this.errorMsg = '请重新选择时间'
         return;
       }
     if(sessionStorage.getItem('processList6All')&&sessionStorage.getItem('processList6')){
           sessionStorage.removeItem('processList6All')
           sessionStorage.removeItem('processList6')
           this.processList=[]
           this.showSelectProcess = false;    
       }
      if (this.startTime > this.endTime) {
        this.errorMsg = "开始时间不能大于结束时间";
        this.startTime = moment(this.startTime).format("YYYY-MM-DD HH:mm");
        return;
      } else if (this.endTime < this.startTime) {
        this.errorMsg = "结束时间不能小于开始时间";
        this.endTime = moment(this.endTime).format("YYYY-MM-DD HH:mm");
        return;
      }

      if (!this.flag && this.typeIndex == -1) {
        this.errorMsg = "请选择类别";
        return;
      } else if (this.warehouseIndex == -1) {
        this.errorMsg = "请选择料仓";
        return;
      }
      var nowTime = moment().format('X'); // 现在时间
      var endtimeer = moment(this.endTime).format('X'); // 结束时间
      if (Number(nowTime) - Number(endtimeer) < 7200) {
          this.errorMsg = "结束时间前两小时暂无数据,请按提示查询";
        clearInterval(timer);
        this.isWaiting = false;
        return;
      }
      // 存选择的时间
      sessionStorage.setItem("s", this.startTime);
      sessionStorage.setItem("e", this.endTime);
      if(this.$route.query.partId == undefined){
        this.$route.query.partId = '6000000086'
      }
      if (this.warehouseValue == "半成品仓") {
        var data = {
          partId: this.$route.query.partId,
          startTime: this.startTime,
          endTime: this.endTime,
          whType: 2 // 代表半成品
        };
        this.$axiosHttp 
          .axiosPost("ks-rinse/rinse/queryCommonInfoProcess.api", data)
          .then(res => {
            console.log(res);
            if (res.code == 200) {
              if (res.data.length == 0) {
                // 没有制程数据的时候跳到warehouseQuery页面  // 先判断制程数据，没有则跳到图表展示页面
                this.$router.push({
                  // path: "semiFinishWarehouse",
                  // query: {
                  //   terminalValue: this.terminalValue,
                  //   typeIndex: this.$route.query.typeIndex,
                  //   processName: this.$route.query.processName,
                  //   selectTypeValue: this.$route.query.selectTypeValue,
                  //   selectTypeList: this.$route.query.selectTypeList,
                  //   warehouseValue: this.$route.query.warehouseValue,
                  //   startTime: this.$route.query.startTime,
                  //   endTime: this.$route.query.endTime
                  // }
                  path: "warehouseQuery",
                  query: {
                    partId: this.$route.query.partId,
                    whType: 2, // 代表半成品
                    typeIndex: this.typeIndex,
                    selectTypeValue: this.selectTypeValue,
                    selectTypeList: this.selectTypeList,
                    warehouseValue: this.warehouseValue,
                    modelName: this.$route.query.modelName,
                    partNo: this.$route.query.partNo,
                    startTime: this.startTime,
                    endTime: this.endTime
                  }
                });
              }
              if (res.data.length > 0) {
                // 有制程数据才去选择半成品制程页面
                this.$router.push({
                  path: "chooseSemiFinishedProcess",
                  query: {
                    partId: this.$route.query.partId,
                    whType: 2, // 代表半成品 ()
                    typeIndex: this.typeIndex,
                    selectTypeList: this.selectTypeList,
                    selectTypeValue: this.selectTypeValue,
                    warehouseValue: this.warehouseValue,
                    modelName: this.$route.query.modelName,
                    partNo: this.$route.query.partNo,
                    startTime: this.startTime,
                    endTime: this.endTime
                  }
                });
              }
            } else if (res.code == 500) {
              this.errorMsg = "网络速度太慢，加载不出来";
            } else if (res.code == 10005 || res.code == 10002) {
              this.errorMsg = "您的身份校验已过期，请重新登录";
            } else {
              this.errorMsg = res.msg;
            }
          });
      } else {
        this.$router.push({
          // 去成品仓页面
          path: "warehouseQuery",
          query: {
            partId: this.$route.query.partId,
            whType: 1, // 代表成品 ()
            typeIndex: this.typeIndex,
            selectTypeValue: this.selectTypeValue,
            selectTypeList: this.selectTypeList,
            warehouseValue: this.warehouseValue,
            modelName: this.$route.query.modelName,
            partNo: this.$route.query.partNo,
            startTime: this.startTime,
            endTime: this.endTime
          }
        }); 
      }
    },
    close() {
      this.showPopup = false;
    }
  },
  components: {
    popup
  }
};
</script>
<style scoped>
  .se-lb{
    top: 340px;
    left: 0;
  }
  .select-jz{
    top: 110px;
  }
  .inquireri-date{
    top: 205px;
    left: 2rem;
  }
  .warehouses{
    top: 520px;
    /* left: 30%; */
    /* transform: translateX(-50%); */
  }
</style>


