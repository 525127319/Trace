import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

const state = {
  count: 0, // 异步请求后台挖掘的数量
  parts:[],
  dayParts:[],
  typeValue:"",
  typeIndex:"",
  daysTypeValue:"",
  daysTypeIndex:"",
  startTime:"",
  endTime:"",
  series:[],
  reporttimes:[],
  // dayParams:{},
  daysParams:{},
  badChartStTime:"",//不良统计图开始时间
  badChartEdTime:"",//不良统计图结束时间
  badChartType:"",//不良统计图机种选择类型
  badChartIndex:"",//不良统计图机种选择索引
  badChartItem:{},//不良统计图单个机种
  badChartSearchParams:{},//不良统计图搜索参数
  storepickType:"",//记录unknown汇总数据类型
  storepickIndex:"",//记录unknown汇总数据类型
  storepickStTime:"",//记录unknown汇总数据开始时间
  storepickEdTime:"",//记录unknown汇总数据结束时间
  compareStoreType:"",//保存wip与七天以上类型
  compareStoreIndex:"",//保存wip与七天以上索引
  compareStoreModels:[],//保存wip与七天以上机种
  badInformationType:"",
  badInformationIndex:"",
  badInformationItem:{},
  dayEntrepotInitEchart:[],//保存当天领料数据 
  globalModelNamelist:[],     
  globalPartNoList:[],
  globalReportTatolsList:[],
  daysEntrepotReporttimes:[],
  daysEntrepotReportSeries:[],
  daysEntrepotReportPartArr:[],
  badChartBackData:[],
  compareStoreChart:[],
  storePickData:[],
  showState:false,
  // showScrollBar:[],
  showScrollBar:-1,
  showStoreBar:false,
  modelSaleRatioType:"",//保存出货比例选择类型
  modelSaleRatioIndex:"",//保存出货比例选择索引
  modelSaleRatioStTime:"",//保存出货比例开始时间
  modelSaleRatioEdTime:"",//保存出货比例结束时间
  modelSaleRatioParts:[],//保存成品信息多选机种
  productDataType:'',
  productDataIndex:'',
  productDataStTime:'',
  productDataEdTime:'',
  productDataParts:[],
  productDataDetailList:[], 

  modelSaleRatioDetailType:'',
  modelSaleRatioDetailIndex:'',
  modelSaleRatioDetailStTime:'',
  modelSaleRatioDetailEdTime:'',
  modelSaleRatioDetailParts:[],
  modelSaleRatioDetailData:[],

  modelAndCode:[],
  classAndDate:[],
  reportTotalArr:[],
  gridData:[],
  formatGrid:[],
  concatObj:[],
  modelNameList:[],

  modelYieldType:"",
  modelYieldIndex:'',
  modelYieldStTime:'',
  modelYieldEdTime:'',
  modelYieldItem:{},
  modelYieldList:[],

  processProductionItem:{},
  processProductionIndex:"",
  processProductionType:"",

  processCustomerItem:{},
  processCustomerIndex:"",
  processCustomerType:"",
  countStorePickItem:{},

  processInputOutItem:{},
  processInputOutType:"",
  processInputOutIndex:"",
  countTotalAndYield:[],

  downPartName:[],
  downUppCode:[],
  processBadCodeModel:{},
  processBadCodeType:"",
  processBadCodeIndex:"",
  chooseWareHouseModel:{},
  chooseWareHouseType:"",
  chooseWareHouseIndex:"",
  productNoData:false,
  saleDetailNoData:false,
  saleRatioNoData:false,
  qrCodeArr:[],
  manyYieldData:[],
};
/*
 *       state: Vuex状态存储
 *       getters: 获取state状态信息
 *       mutations: 更改Vuex的store 中的状态的唯一方法是提交 mutation
 *       actions: 通过Action提交mutation,可以包含任意异步操作
 *       mutation-types: mutations类型，通过key值指向mutations
 */
// const debug = process.env.NODE_ENV !== 'production';   //非生产环境下，进入debug模式

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
});

