import "babel-polyfill";
import Vue from "vue";
import app from "./app.vue";
import vueRouter from "vue-router";
import Utils from "./common/utils.js";
import store from "./store/index";
import AxiosConfig from "./config/axiosConfig.js";
import AxiosHttp from "./common/axiosHttp.js";
import "./assets/css/index.css";
import RouteConfig from "./config/routeConfig.js";
import moment from 'moment';
import BScroll from 'better-scroll'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
 

import IM from "./common/WebViewJavascriptBridge";

import Cube from 'cube-ui'
Vue.use(Cube)
import "./assets/css/index.css";
// 引入echarts
import echarts from 'echarts';
// 把echarts注册到vue的原型上，方便在组件直接通过this.$echarts来使用
Vue.prototype.$echarts = echarts;


// 改写原型链，注册全局方法
Vue.prototype.$axios_config = AxiosConfig;
Vue.prototype.$utils = Utils;
Vue.prototype.$axiosHttp = AxiosHttp;
Vue.prototype.IM =IM;


// 关闭生产模式下给出的提示
Vue.config.productionTip = false;
// 定义并配置路由
Vue.use(vueRouter);
const router = new vueRouter({
  routes: RouteConfig.routes
});

var vue = new Vue({
  el: "#app",
  router,
  store,
  created: function () {
    // pro的环境请取消以下代码注释
    // 添加手机端传过来的token放入请求头中
    const token = Utils.getUrlKey("token");
    AxiosConfig.headers.Authorization = 'Bearer ' + token;
       
  },
  render: h => h(app)
});
