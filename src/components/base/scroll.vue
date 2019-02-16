<template>
    <div ref="wrapper">  
            <slot></slot>
            <div class="tips">
                <PullingWord v-show="!inPullUp&&dataList.length>0&&showPullingWord" :loadingWord="beforePullUpWord"></PullingWord>
                <Loading v-show="inPullUp" :loadingWord='PullingUpWord'></Loading>
            </div>       

        <!-- <transition name="pullDown">
           <Loading class="pullDown" v-show="inPullDown" :loadingWord='PullingDownWord'></Loading>
        </transition>  -->
    </div>
</template>

<script >
import BScroll from "better-scroll";
import Loading from "./loading.vue";
import PullingWord from "./pulling-word.vue";

const PullingUpWord = "";
// const  PullingUpWord="正在拼命加载中...";
// const  beforePullUpWord="上拉加载更多";
const beforePullUpWord = "";
const finishPullUpWord = "加载完成";

const PullingDownWord = "加载中...";

export default {
  props: {
    dataList: {
      type: Array,
      default: []
    },

    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
      inPullUp: false,
      showPullingWord: false,
      inPullDown: false,
      beforePullUpWord,
      PullingUpWord,
      PullingDownWord,
      continuePullUp: true
    };
  },

  mounted() {
    setTimeout(() => {
      this.initScroll();

      this.scroll.on("pullingUp", () => {
        if (this.continuePullUp) {
          this.beforePullUp();
          this.$emit("onPullUp", "当前状态：上拉加载");
        }
      });

      this.scroll.on("pullingDown", () => {
        this.beforePullDown();
        this.$emit("onPullDown", "当前状态：下拉加载更多");
      });
    }, 20);
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad
      });
    },
    beforePullUp() {
      this.PullingUpWord = PullingUpWord;
      this.inPullUp = true;
    },
    beforePullDown() {
      this.disable();
      this.inPullDown = true;
    },
    finish(type) {
      this["finish" + type]();
      this.enable();
      this["in" + type] = false;
      this.inPullUp = false;
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    finishPullDown() {
      this.scroll && this.scroll.finishPullDown();
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
      this.inPullUp = false;
      this.showPullingWord = true;
      setTimeout(() => {
        this.showPullingWord = false;
      }, 500);
    }
  },

  watch: {
    dataList() {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  },
  components: {
    Loading,
    PullingWord
  }
};
</script>

<style>
.tips {
  position: absolute;
  bottom: 1rem;
  text-align: center;
  z-index: 100;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
}
</style>