<template>
  <div>
       <article >
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>箱号数量</h1>
            <!-- @click="sure" -->
            <span class="right" @click="sure">
                <span class="or">确认</span>
            </span>
        </nav>
        <section class="section" id="mainS">
            <section class="main" >
                <div class="content-box">
                    <div class="form">
                        <h3 class="form-title  y_h3">输入箱号<i @click="scan"></i></h3>
                        <textarea placeholder="输入17位箱号,如查询多个请以英文逗号隔开" ref='search' id="search" v-model.trim="content"></textarea>
                    </div>
                    <div class="form"  >
                        <!-- <div  style="color:red" v-text="scanText"></div>   
                        <div v-text="testText"></div>                   
                        <div  style="color:red">8888888888888</div>                       -->
                        <h3 class=form-title>选择类别</h3>  
                        <div class="check-group">
                            <span class="check-item " v-for="(item,index) in typeList" :key="index" v-text="item" :class="{checked:activeIndex == index}" @click="selecType(item,index)"></span>
                        </div>
                    </div>
                </div>
            </section>
        </section>
      <div class="pop" v-show="cartonNoQueryPrompt">
          <!-- 我知道 -->
          <div class="ok" @click="handlePrompt"></div>
          <!-- 点击查询 -->
          <div class="inquire"></div>
          <!-- 箱号数量详情页面 -->
          <div class="quantity"></div>
            <!-- 选择类别 -->
        <div class="se-lb" style="top:220px;left: 6rem;"></div>
        </div>
    </article>
   <popup :errorMsg="errorMsg" ></popup>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
// import jsBridge from "../../common/bridging.js"
import IM from "../../common/WebViewJavascriptBridge.js";
export default {
  data() {
    return {
      cartonNoQueryPrompt:true,
      typeList: ["当前状态", "过站记录"], // 选择类别
      activeIndex: 0, // 选择类别索引判断
      cover: false, // 提示弹窗
      content: "", // 输入内容
      errorMsg: "",
      typeValue: "当前状态", // 类别
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
        type: "0", //0：文字     1：图标   （必传）
        text: "确定", //控制显示文本，空字符串表示显示默认文本
        textColor: "#ff7e00", //字体颜色  16进制，关键字
        url: "", //控制标题文本，空字符串表示显示默认文本
        backcoler: "#ffffff", //背景色
        fcname: "toSure", // 定义点击事件方法名
        onSuccess: function(result) {
         self.sure();         
        },
      });
    
        //设置二维码
      // IM.scan({
      //   isclickble: "1", //0 默认不受控    1受控   （必传）
      //   type: "1", //0：文字     1：图标   （必传）
      //   //  type: String , // type 为 all、qrCode、barCode，默认是all。
      //    onSuccess: function(result) {
      //     //  onSuccess将在扫码成功之后回调
      //     //  result结构
      //     //  {'text':String}
      //     self.handleScan(result);
      //     this.content = result;
      //   },
      // });

      if(localStorage.getItem('cartonNoQueryPrompt') =='false'){
          this.cartonNoQueryPrompt=false;
      }
  },
  mounted() {
    this.content = sessionStorage.getItem("cartonNo");
    const main = document.getElementById("mainS");
    const myDiv = document.getElementById("search");
    main.addEventListener("touchend",function(){
       myDiv.blur();
    });

    main.addEventListener("click",function(){
       myDiv.blur();
    });

    myDiv.addEventListener("click",function(event){
        event=event||window.event;
        event.stopPropagation();
    });

    myDiv.addEventListener("touchend",function(event){
        event=event||window.event;
        event.stopPropagation();
        myDiv.focus(); 
    });
   
  },
  methods: {
    // 扫一扫，扫描二维码，调用摄像头
    scan() {
      const self = this;
      IM.scan_code128({onSuccess : function(result){
        let qrCodeVlue = JSON.parse(result).qrCode;
        if (self.content==="" || self.content==null) {
          self.content = qrCodeVlue;
        } else {
          self.content = self.content + "," + qrCodeVlue;
        }
      }});
    },
   
    handlePrompt(){
        this.cartonNoQueryPrompt=false;
        localStorage.setItem('cartonNoQueryPrompt',this.cartonNoQueryPrompt);
    },
    // 返回上一页
    back() {
      this.$router.go(-1);
      this.cartonNoQueryPrompt=false;
      localStorage.setItem('cartonNoQueryPrompt',this.cartonNoQueryPrompt);
    },
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    // 选择类别
    selecType(item, index) {
      this.activeIndex = index;
      this.typeValue = item;
      // console.log(index)
    },
    // 返回选择站点
    backToPage() {
      this.cover = false;
    },
    // 点击确定
    sure() { 
      var self = this;
      if (!this.content) {
        // 没有输入箱号显示
        this.errorMsg = "请输入箱号";
        return;
      }
      if (typeof this.content == "string") {
        // 如果是字符串
        var content = this.content.split(","); // 转换成数组
       
      }
      for (var i = 0; i < content.length; i++) {
        if (content[i].length != 17) {
          self.errorMsg = "输入箱号有误";
          return;
          break;
        }
      }

      sessionStorage.setItem("cartonNo", this.content);
      self.$router.push({
        path: "cartonNoDetail",
        query: {
          cartonNo: self.content, //'箱号',
          type: self.activeIndex + 1, //'类别,1-当前状态,2-过站记录'
          typeValue: self.typeValue //'类别,当前状态,过站记录'
        }
      });

      console.log(this.content, "+=+==+");
      // sessionStorage.setItem("cartonNo", this.content);
      // this.$router.push({
      //   path: "cartonNoDetail",
      //   query: {
      //     cartonNo: this.content, //'箱号',
      //     type: this.activeIndex + 1, //'类别,1-当前状态,2-过站记录'
      //     typeValue: this.typeValue //'类别,当前状态,过站记录'
      //   }
      // });
    },
    close() {
      this.cover = false;
    }
  },
  components: {
    popup
  }
};
</script>


