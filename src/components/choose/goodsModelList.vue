<template>
 <div >
  <article class="white" >
        <nav class="nav" v-show="showH5Title" >
            <span class="left" @click="back">
                <span class="icon icon-left"></span>
            </span>
            <h1>机种选择</h1>
        </nav>
        <section class="section">
          <header data-v-37af1f68="" class="header">
            <div data-v-37af1f68="" class="search">
              <form style="width:100%" action="javascript:void(0);"> <input style="width:100%; " type="search" ref='search' placeholder="请输入机种关键字" v-model.trim="keyWord" @keyup="goSearch()" /> </form>
            </div>
          </header>
            <section class="main" >
                <div class="content-box y_pb" >
                    <div class="y_check"  style="overflow:hidden;">
                      <ul class="y_check-nav" style="background:white;overflow-x:hidden;overflow-y:auto;" >
                          <li class="m-item"   v-for="(item,index) in modelList" :key="index">
                            <div>
                              <p class="en" ><span >{{item.modelName}} {{item.partName}} {{item.colorEn}}</span> <span v-text="item.upccode"></span></p>
                              <p class="cn" v-text="item.partNo">604-5526</p>
                            </div>
                            <span class="icon-no_sel y_ico" :class="{'icon-yes_sel':item.isShowIcon==true}"  @click="selectMany(item,index)"></span>
                          </li>
                      </ul>
                       <div class="y_check-fot" v-if="partIds.length>0">
                            <span >已选中机种:{{partIds.length}}个</span>
                            <span class="y_but"  @click.stop="selectModel">确认</span>
                       </div>
                    </div>  
                </div>
            </section>
            <popup :errorMsg="errorMsg"></popup>
        </section>
    </article>
  </div>
</template>
<script>
import popup from "../base/popup .vue";
import utils from "../../common/utils.js";
export default {
  name: 'baseModelList',
  components: {
    popup, 
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
    //多选
    selectMany(item,index) {
       let idIndex =this.partIds.findIndex((data) =>{
          return item.modelId == data.modelId;
       });               
       if(idIndex >= 0){   
         item.isShowIcon=!item.isShowIcon;               
         this.partIds.splice(idIndex,1);
          let partsId =this.partIds;
           if(this.$route.query.path == "modelSaleRatio"){
                this.$store.commit('SET_MODELSALERATIO_PARTS', partsId);  
              }else if(this.$route.query.path == "productData"){
                  this.$store.commit('SET_PRODUCTDATA_PARTS', partsId);
              }else if(this.$route.query.path =="modelSaleDetail"){
                 this.$store.commit('SET_MODELSALEDETAIL_PARTS',partsId) 
              }           
        }else{
          if(this.partIds.length>=5){
            this.errorMsg ="机种最多能选5个";
            return;
          }else{
            item.isShowIcon=!item.isShowIcon;
            this.partIds.push(item);
            let partsId =this.partIds;
            if(this.$route.query.path == "modelSaleRatio"){
                this.$store.commit('SET_MODELSALERATIO_PARTS', partsId);  
              }else if(this.$route.query.path == "productData"){
                  this.$store.commit('SET_PRODUCTDATA_PARTS', partsId);
              }else if(this.$route.query.path =="modelSaleDetail"){
                this.$store.commit('SET_MODELSALEDETAIL_PARTS',partsId) 
              }         
          }
      }

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
            this.modelList.forEach(item=>{
              item.isShowIcon = false;
            })
            if(this.$route.query.path == "modelSaleRatio"){
               this.$store.state.modelSaleRatioParts.forEach(item => {
                  this.modelList.forEach(data=>{
                      if(item.modelId == data.modelId){
                        data.isShowIcon=!data.isShowIcon;
                        this.partIds.push(data);
                        var hash = {}; 
                        this.partIds = this.partIds.reduce(function(item, next) {
                          hash[next.modelId]
                            ? ""
                            : (hash[next.modelId] = true && item.push(next));
                          return item;
                        }, []);
                      }
                  }); 
                  this.partIds.forEach(item =>{
                     this.modelList.forEach(data=>{
                           if(item.modelId == data.modelId){
                            data.isShowIcon=true;
                         }
                     })
                  }) 
              });
            }else if(this.$route.query.path == "productData"){
              if(this.$store.state.productDataParts){
                  this.$store.state.productDataParts.forEach(item => {
                    this.modelList.forEach(data=>{
                      if(item.modelId == data.modelId){
                        data.isShowIcon=!data.isShowIcon;
                        this.partIds.push(data);
                        var hash = {};
                        this.partIds = this.partIds.reduce(function(item, next) {
                          hash[next.modelId]
                            ? ""
                            : (hash[next.modelId] = true && item.push(next));
                            return item;
                          }, []);
                        }
                    });
                  });
              }
              this.partIds.forEach(item =>{
                    this.modelList.forEach(data=>{
                          if(item.modelId == data.modelId){
                          data.isShowIcon=true;
                        }
                    })
                }) 
            }else if(this.$route.query.path == "modelSaleDetail"){
                 if(this.$store.state.modelSaleRatioDetailParts){
                  this.$store.state.modelSaleRatioDetailParts.forEach(item => {
                    this.modelList.forEach(data=>{
                      if(item.modelId == data.modelId){
                        data.isShowIcon=!data.isShowIcon;
                        this.partIds.push(data);
                        var hash = {};
                        this.partIds = this.partIds.reduce(function(item, next) {
                          hash[next.modelId]
                            ? ""
                            : (hash[next.modelId] = true && item.push(next));
                            return item;
                          }, []);
                        }
                    });
                  });
              }
                this.partIds.forEach(item =>{
                    this.modelList.forEach(data=>{
                          if(item.modelId == data.modelId){
                          data.isShowIcon=true;
                        }
                    })
                }) 
            }   
          } else {
            this.errorMsg = res.msg;
          }
      })
    },

    // 点击搜索
    goSearch() {
      this.loadMore();
      
    },
    // 选择机种,跳回上一页
    selectModel() {
        
        this.$router.go(-1);
        
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


