<template>
    <div id="app">
        <span v-show="this.$route.path !=='/index'" class="home-btn"  @click="backTo"></span>
        <!-- draging是挖掘动画    -->
        <span v-show="this.$route.path !=='/asyncTaskList'" class="drag" :class="{'draging':this.$store.state.count>0}" @click="gotoAsyncTask">
          <span class="bdg" v-show="this.$store.state.count>0" v-text="this.$store.state.count"></span>
        </span>
        <transition name="fade" mode="out-in">
            <!--视口-->
            <router-view>

            </router-view>
            
        </transition>
              
        
    </div>
</template>
<script >
import Cache from "./common/Cache";
import {mapActions} from 'vuex'
export default {
  methods: {
     ...mapActions([
        'deleteProcessCustomerList',
        'deletePickingList',
        'deleteProProductionList',
        'deleteProInputOutList',
        'deleteProBadList'
    ]),
    backTo: function() {
      this.$router.push("/");
      sessionStorage.removeItem("processList1All");
      sessionStorage.removeItem("processList1");
      sessionStorage.removeItem("processList2All");
      sessionStorage.removeItem("processList2");
      sessionStorage.removeItem("processList3All");
      sessionStorage.removeItem("processList3");
      sessionStorage.removeItem("processList4All");
      sessionStorage.removeItem("processList4");
      sessionStorage.removeItem("processList5All");
      sessionStorage.removeItem("processList5");
      sessionStorage.removeItem("processList6All");
      sessionStorage.removeItem("processList6");
      //离开本页面，清除掉制程的缓存
      sessionStorage.removeItem("processCustomerInformation");
      this.deleteProcessCustomerList();
      this.deletePickingList();
      this.deleteProProductionList();
      this.deleteProInputOutList();
      this.deleteProBadList();
    },

    gotoAsyncTask: function() {
      this.$router.push({
        path: "asyncTaskList"
      });
    }
  }
};
</script>

<style type="text/css" scoped>
/*过渡效果*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>