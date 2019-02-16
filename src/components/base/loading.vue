<template>
	<div class="loading"><img src="../../assets/images/loading.gif"  alt=""><span>{{loadingWord}}</span></div>
</template>

<script>
export default {
  name: "loading",
  props: {
    loadingWord: {
      type: String
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/_base.scss";
.loading {
  text-align: center;
  z-index: 100;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
   margin-bottom: 1rem;
  img {
    margin: 0 auto;
    width: 1.65rem;
    height: 1.65rem;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
    margin-left: 0.14rem;
    @include fz(14px);
  }
}
</style>