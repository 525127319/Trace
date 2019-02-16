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
            <section class="main"  @click="blurEvent()"  @touchmove="blurEvent()">
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
                    <ul class="select-mec" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-throttle-delay="300">
                          <li class="m-item" v-for="(item,index) in modelList" :key="index" @click="selectModel(item)">
                             <p class="en" ><span v-text="item.modelName "></span> <span v-text="item.upccode"></span></p>
                             <p class="cn" v-text="item.partNo">604-5526</p>
                          </li>
                         <Loading class="loading" v-show="showLoading" ></Loading>
                         <pullingWord class="loadingWord" :loadingWord="loadingWord" v-show="showWord"></pullingWord>
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
import Loading from "../base/loading.vue";
import pullingWord from "../base/pulling-word.vue";
import scroll from "../base/scroll.vue";
import waiting from "../base/waiting.vue";
export default {
  data() {
    return {
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
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1);
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
       this.pageNum = 1,
       this.modelList = [],
       this.showLoading = false
       this.inSearching = false
       this.loadingWord = ''
       this.showWord = false
     }
      var data = {
        keyWord: this.keyWord, // 搜索内容
        pageNum: this.pageNum
      };
      this.$axiosHttp
        .axiosPost("ks-trace/traceReport/queryPartVo.api", data)
        .then(res => {
          console.log(res, "123");
          console.log(res.data.length,'长度是否为0')
          if(res.data.length === 0){
              this.showWord = true
              this.loadingWord = '没有更多数据'
            }
          if (res.code == 200 && res.data.length != 0) {
            this.modelList = this.modelList.concat(res.data);
            this.showLoading = true;
            this.busy = false;
            this.pageNum++;
            if (res.data.length < 20) {
              this.showLoading = false;
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
        })
        .catch(() => {
          this.errorMsg = "数据较大，请稍后重试";
        });
    },

    // 点击搜索
    goSearch() { 
      // if (!this.keyWord) {
      //   this.errorMsg = "搜索内容不能为空";
      //   return;
      // }
      // this.$refs.search.type='search';
      this.inSearching = true;
      this.loadMore()
    },
// 选择机种,跳回上一页
    selectModel(item) {
      console.log(item,'怎么点不动了')
      const partId = sessionStorage.getItem('partId');
      console.log(this.$route.query.path,'进来的路由')
      console.log(partId,'开始ID')
      console.log(item.partId,'选择ID')
      console.log(partId==item.partId)

      if(partId!=item.partId){
         sessionStorage.removeItem('processList1All')
         sessionStorage.removeItem('processList1')
          sessionStorage.removeItem('processList2All')
         sessionStorage.removeItem('processList2')
          sessionStorage.removeItem('processList3All')
         sessionStorage.removeItem('processList3')
          sessionStorage.removeItem('processList4All')
         sessionStorage.removeItem('processList4')
          sessionStorage.removeItem('processList5All')
         sessionStorage.removeItem('processList5')
          sessionStorage.removeItem('processList6All')
         sessionStorage.removeItem('processList6')
      }
      if (this.$route.query.path == "processProduction") {
     sessionStorage.setItem('partId', item.partId)
        
        this.$router.push({
          path: "processProduction",
          query: {
            path: this.$route.query.path,
            modelName: item.modelName,
            upccode: item.upccode,
            partNo: item.partNo,
            partId: item.partId,
              isChangeModel: true,
          }
        });
      
      } else if (this.$route.query.path == "processBadInformation") {
         sessionStorage.setItem('partId', item.partId)
         console.log("走了吗");
        this.$router.push({
          path: "/processBadInformation",
          query: {
            path: this.$route.query.path,
            modelName: item.modelName,
             upccode: item.upccode,
            partNo: item.partNo,
            partId: item.partId,
              isChangeModel: true,
          }
        });
       
      } else if (this.$route.query.path == "processBadCode") {
         sessionStorage.setItem('partId', item.partId)
        this.$router.push({
          path: "processBadCode",
          query: {
            path: this.$route.query.path,
            modelName: item.modelName,
             upccode: item.upccode,
            partNo: item.partNo,
            partId: item.partId,
              isChangeModel: true,
          }
        });
       
      } else if (this.$route.query.path == "processInputOut") {
         sessionStorage.setItem('partId', item.partId)
        this.$router.push({
          path: "processInputOut",
          query: {
            path: this.$route.query.path,
            modelName: item.modelName,
             upccode: item.upccode,
            partNo: item.partNo,
            partId: item.partId,
              isChangeModel: true,
          }
        });
       
      } else if (this.$route.query.path == "processCustomerInformation") {
         sessionStorage.setItem('partId', item.partId)
        this.$router.push({
          path: "processCustomerInformation",
          query: {
            path: this.$route.query.path,
            modelName: item.modelName,
             upccode: item.upccode,
            partNo: item.partNo,
            partId: item.partId,
            isChangeModel: true,
            
          }
        });
      
      }else if (this.$route.query.path == "chooseWarehouse") {
         sessionStorage.setItem('partId', item.partId)
        this.$router.push({
          path: "chooseWarehouse",
          query: {
            path: this.$route.query.path,
            modelName: item.modelName,
             upccode: item.upccode,
            partNo: item.partNo,
            partId: item.partId,
              isChangeModel: true,
          }
        });
       
      }
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
.select-mec {
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
/* .white{
  background-color: white;
} */
/* .select-mec{
  margin-top: 0 !important;
  border-top: 1rem solid #f4f4f4;
} */
</style>


