<template>
 <div >
  <article class="white" >
        <nav class="nav" v-show="showH5Title">
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>机种选择</h1>
        </nav>
        <section class="section" >
          <header data-v-37af1f68="" class="header">
            <div data-v-37af1f68="" class="search">
              <!-- <input data-v-37af1f68="" type="text" placeholder="请输入机种关键字" v-model="keyWord" @keyup="goSearch()"> 
              <span data-v-37af1f68="" class="icon icon-search-right" @click="goSearch()"></span> -->
              <form style="width:100%" action="javascript:void(0);"> <input style="width:100%; " type="search" ref='search' placeholder="请输入机种关键字" v-model.trim="keyWord" @keyup="goSearch()" /> </form>
            </div>
          </header>
            <section class="main" >
                <div class="content-box" >
                        <!-- <scroll class="wrapper"
                                ref="scroll"
                                :dataList="modelList"
                                :pullUpLoad="pullUpLoad"
                                @onPullUp="getModelList"
                            >
                        <ul class="select-mec">
                            <li class="m-item" v-for="(item,index) in modelList" :key="index"  @click="selectModel(item)">
                                <p class="en" ><span v-text="item.modelName "></span> <span v-text="item.upccode"></span></p>
                                <p class="cn" v-text="item.partNo">604-5526</p>
                            </li>
                        </ul>
                    </scroll> -->
                    <ul class="select-mec">
                          <li class="m-item" v-for="(item,index) in modelList" :key="index" @click="selectModels(item)">
                             <p class="en" ><span v-text="item.modelName +' '+ item.partName"></span> <span v-text="item.colorEn"></span></p>
                             <p class="cn" v-text="item.partNo">604-5526</p>
                          </li>
                         <!-- <Loading class="loading" v-show="showLoading" ></Loading> -->
                         <!-- <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord> -->
                     </ul>
                </div>
                    <!-- <waiting v-show="isWaiting" :number="number"></waiting> -->
            </section>
                    <popup :errorMsg="errorMsg"></popup>
        </section>
    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import utils from "../../common/utils.js";
//import Loading from "../base/loading.vue";
//import pullingWord from "../base/pulling-word.vue";
//import scroll from "../base/scroll.vue";
//import waiting from "../base/waiting.vue";
export default {
  name: 'singleModelList',
  components: {
  //  scroll,
    //waiting,
  //  Loading,
    popup,
  //  pullingWord
  },
  data() {
    return {
      active:true,
      isChoose:0,
      isShowIcon:true,
      partIds:[],
      newPartIds:[],
      modelList: [], // 机种列表数据
      data: [],
      busy: false,
      pageNum: 1, // 页码
      loadingWord: "", // 提示文字
      scrollY: 0,
      pullUpLoad: {
        threshold: 0
      },
      isWaiting: true, // 加载动画
      showLoading: false, // 显示加载动画
      showWord: false, // 显示文字提示
      inSearching: false, // 点击搜索
      errorMsg: "", //错误信息
      keyWord: "", // 搜索关键字
      number: 0, // 加载的时间
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
        text: "机种选择", //控制显示文本，空字符串表示显示默认文本
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
      this.loadMore(); 
  },
  methods: {
    //单选
    selectByOne(item,index){
      this.singlePartIds=item;
      this.isChoose =index;
    },
    // 返回上一页
    back() {
      this.$router.go(-1);
    },        
    // 初始化弹窗文本信息为空
    initTxt() {
      this.errorMsg = "";
    },
    loadMore() {
      var data = {
        keyWord: this.keyWord, // 搜索内容
        type: this.$route.query.type
      };

      this.$axiosHttp.axiosPost("ks-newrep/ReportTool/findModelByTypeName.api", data)
        .then(res => {
          let {code, msg, data} = res;
          if (code == 200 ) {
            this.modelList = data;   
            console.log(this.modelList)        
          } else {
            this.errorMsg =msg;
          }
      })
    },

    // 点击搜索
    goSearch() {
      this.loadMore(); 
    },
    // 选择机种,跳回上一页
    selectModels(data) {    
      console.log(data); 
      if(this.$route.query.path =='badChart'){
         this.$router.push({
          path: "/badChart",
        }); 
        this.$store.commit('SET_BADCHART_ITEM',data);  
      }else if(this.$route.query.path =='countStorePick'){
        this.$router.push({
          path: "/countStorePick",
        }); 
        this.$store.commit('SET_COUNTSTOREPICK_ITEM',data);   
      }else if(this.$route.query.path =='manyModelYield'){
        this.$router.push({
          path: "/manyModelYield",
        }); 
        this.$store.commit('SET_MANYMODELYIELD_ITEM',data); 
      }    
    }
  },  
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
.select-mec {
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
.icon-no_sel{
  float: right;
}
/* .white{
  background-color: white;
} */
/* .select-mec{
  margin-top: 0 !important;
  border-top: 1rem solid #f4f4f4;
} */
.value{
  display: block;
 flex: 1;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}
.y_none{
  display: none !important;
}
</style>


