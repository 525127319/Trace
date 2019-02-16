<template>
 <div class="drag-list swipe-wrapper">
   
   <cube-scroll v-show='!showNoDataICon'
       ref="scroll"
      :data="asyncTaskListData"
      :options="options"
      @pulling-down="onPullingDown"
      @pulling-up="onPullingUp">
      <cube-swipe  >
        <transition-group name="swipe" tag="ul">
          <!-- traceIsRead：（0：未读，1：已读） -->
          <li class="swipe-item-wrapper " :class="{'not-read':item.traceIsRead=='0'}" v-for="(item,index) in asyncTaskListData" :key="item.uuid">
            <cube-swipe-item
                 ref="swipeItem"
                :btns="item.btns"
                :index="index"
                @btn-click="onBtnClick"
                @active="onItemActive">
              <div @click="onItemClick(item, index)" class="item-inner">
                 <div class="d-tit">
                    <h3 v-text="item.traceContext.title">客户信息查询</h3>
                    <span class="tim" v-text="item.traceCreaTime"></span>
                </div>
                <ul class="m-list" v-show="item.traceContext.manyModels" v-for="(data,i) in item.traceContext.manyModels" :key="i">
                    <li >{{ item.traceContext.modelType }}   {{data.modelName }}  {{data.partName}}  {{data.colorEn}}+</li>
                </ul>
                <p v-show="item.traceContext.manyModels" class="y_nav-date">{{item.traceContext.startTime}}  <span v-show="item.traceContext.startTime">/</span>  {{item.traceContext.endTime}}<span v-show="item.traceContext.endTime">+</span> </p>   
                <ul class="m-list" v-show="!item.traceContext.manyModels">
                    <li >{{ item.traceContext.modelType }}   {{item.traceContext.modelName }}  {{item.traceContext.upccode}}  {{item.traceContext.colorEn}}+</li>   
                    <li v-text="item.traceContext.startTime + '/' + item.traceContext.endTime + '+'"></li>
                    <!-- 制程名 -->
                    <li v-text="item.traceContext.processName"></li>
                    <!-- 选中的站点是全部还是单个站点名 -->
                    <li v-text="item.traceContext.terminalValue"></li>
                    <!-- 通用查询的选择类别 -->
                    <li v-text="item.traceContext.selectTypeValue"></li>
                    <!-- 通用查询选择料仓 -->
                    <li v-text="item.traceContext.warehouseValue"></li>
                </ul>
                <!-- over in  error  queue-->
                <!-- 0: 已完成  1： 进行中 2：错误  3：正在排队 -->
                <span class="status" :class="{'over':item.traceStatus=='完成','in':item.traceStatus=='进行中','error':item.traceStatus=='错误','queue':item.traceStatus=='正在排队'||item.traceStatus=='再次排队'}" v-text="item.traceStatus"></span>
              </div>
            </cube-swipe-item>
          </li>
        </transition-group>
          <!-- 没有数据的时候显示 -->
      </cube-swipe>
    </cube-scroll>
    <div v-show="showNoDataICon" class="no-data" style="height:100%"></div> 
  </div>
</template>
<script>
import pullingWord from '../base/pulling-word.vue';
export default {
  data() {
    return {
      options: {
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: "上拉加载更多",
            noMore: "没有更多数据"
          }
        },
        pullDownRefresh: {
          threshold: 90,
          stop: 40,
          txt: '更新成功'
        }
      },
      asyncTaskListData: [], // 异步列表数据
      pageNum: 1, // 分页
      showWord: false, // 显示提示语
      showNoDataICon: false, // 显示没有数据时的图片
      freshFlag: false, // 上拉刷新标识
      loadingWord: '没有更多数据'
    };
  },
  created() {
     this.activeIndex = -1;
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
        text: "挖掘任务", //控制显示文本，空字符串表示显示默认文本
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
    this.onPullingUp();
  },
  methods: {
    // 点击单个异步任务，如果成功修改已读和未读的状态   traceIsRead：（0：未读，1：已读）
    // 并且要把页面需要还原的数据带回去
     back() {
        this.$router.push({
           path: "index"
        });
      },
    onItemClick(item) {
      console.log("click item:", item);
      if (item.traceStatus !== "完成") {
        return;
      }
      const data = {
        uuid: item.uuid
      };
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/queryAsynTaskByUUid.api", data)
        .then(res => {
          console.log("异步单个res", res);
          let { code, msg, data } = res;
          switch (code) {
            case 200:
              if (item.traceIsRead == "0") {
                this.$store.commit("SET_COUNT", this.$store.state.count - 1);
              }
              console.log(this.$store.state.count,888)
              console.log(data,'什么数据');
              this.modifyReadStatus(item, data); // 修改已读和未读状态
              //缓存异步取得的结果数据              
              sessionStorage.setItem("asyncResult", JSON.stringify(data));
              // 跳转到异步请求的那个页面
              this.$router.push({
                path: item.tracePath,
                query: {
                  asyncFlag: true
                }
              });
              break;
          }
        });
    },
    // 修改已读和未读状态
    modifyReadStatus(item, data) {
      console.log(data,'修改未读');
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/updAsynTaskRead.api", data)
        .then(res => {
          console.log("修改异步任务状态：res", res);
          let { code, msg, data } = res;
          switch (code) {
            case 200:
              item.traceIsRead = "1"; // 状态更改为已读
              this.unreadData();
            
          }
        });
    },
    // 当天未读数量请求
    unreadData() {
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
    },
    // 点击删除单个异步任务
    onBtnClick(btn, index) {
      if (btn.action === "delete") {
        this.$createActionSheet({
          title: "确认要删除吗",
          active: 0,
          data: [{ content: "删除" }],
          onSelect: () => {
            console.log("删除单个的btn,index", btn, index);
            this.asyncTaskListData.forEach((el, indexAsync) => {
              if (index === indexAsync) {
                console.log(el.uuid, "uuid");
                this.uuid = el.uuid;
              }
            });
            const data = {
              uuid: this.uuid
            };
            console.log(data, "kk  uuid");
            this.$axiosHttp
              .axiosPost("ks-asyntask/aspect/delAsynTask.api", data)
              .then(res => {
                console.log("删除单个异步res", res);
                let { code, msg, data } = res;
                switch (code) {
                  case 200:
                    this.asyncTaskListData.splice(index, 1);
                    this.unreadData();
                    break;
                }
              });
          }
        }).show();
      } else {
        this.$refs.swipeItem[index].shrink();
      }
    },
    onItemActive(index) {
      if (index === this.activeIndex) {
        return;
      }
      if (this.activeIndex !== -1) {
        const activeItem = this.$refs.swipeItem[this.activeIndex];
        activeItem.shrink();
      }
      this.activeIndex = index;
    },
    //  获取异步列表数据
    onPullingUp() {
      const info = {
        pageNum: this.pageNum
      };
      this.$axiosHttp
        .axiosPost("ks-asyntask/aspect/queryAsynTaskList.api", info)
        .then(res => {
          console.log("异步列表res", res);
          let { code, msg, data } = res;
          data.forEach(val => {
            //  <!-- 0: 已完成  1： 进行中 2：错误  3：正在排队 -->
            switch (val.traceStatus) {
              case "0":
                val.traceStatus = "完成";
                break;
              case "1":
                val.traceStatus = "进行中";
                break;
              case "2":
                val.traceStatus = "错误";
                break;
              case "3":
                val.traceStatus = "正在排队";
                break;
              case "4":
                val.traceStatus = "再次排队";
                break;
            }
            val.traceContext = JSON.parse(val.traceContext);
            val.btns = [
              {
                action: "clear",
                text: "不再关注",
                color: "#c8c7cd"
              },
              {
                action: "delete",
                text: "删除",
                color: "#ff3a32"
              }
            ];
          });
          switch (code) {
            case 200:
              // this.asyncTaskListData = data;
              console.log(data, "数组长度看看");
              if (data.length > 0) {
                if(this.freshFlag){
                  if(this.pageNum==1){
                      this.asyncTaskListData=[]
                  }
                  this.asyncTaskListData = this.asyncTaskListData.concat(data);
                  this.showNoDataICon=false;
                  this.pageNum++;
                  return;
                }
                this.asyncTaskListData = this.asyncTaskListData.concat(data);
                this.showNoDataICon=false;
                this.pageNum++;
              } else {
     
                 this.pageNum==1?this.showNoDataICon=true:this.showNoDataICon=false;
                
                // If no new data, you need use the method forceUpdate to tell us the load is done.
                this.$refs.scroll.forceUpdate();
              }
              console.log(this.asyncTaskListData, "异步新数组");
              break;
          }
        });
    },
      onPullingDown() {
      // Mock async load.
        this.freshFlag = true;
        if (this.asyncTaskListData.length>0) {
          // If have new data, just update the data property.
           this.pageNum = 1;
          this.onPullingUp()
        } else {
          // If no new data, you need use the method forceUpdate to tell us the load is done.
          this.$refs.scroll.forceUpdate()
        }
     
    }
    
  },
  components:{
    pullingWord
  }
};
</script>
<style scoped>
.y_nav-date{
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54)
}
</style>



