<template>
  <div>
      <transition name="side-down">
          <div class="error-s" v-show="failed"  v-text="errorMsg">  </div>
      </transition>      
  </div>
</template>
<script>
export default {
  data() {
    return {
      failed: false // 提交失败弹窗
    };
  },
  props: {
    errorMsg: "" // 显示错误信息
  },

  methods: {},
  watch: {
    errorMsg: function(val, oldVal) {
      //  console.log(val,"+")
      //  console.log(oldVal,"+-=")
      var self = this;
      console.log(this.errorMsg, "=======");
      if (this.errorMsg) {
        self.failed = true;
        const timer = setTimeout(function() {
          self.failed = false;
          self.$parent.initTxt(); // 调用父级方法，确保errorMsg一直有改变
        }, 1500);
      } else {
        self.failed = false;
      }
    }
  }
};
</script>


