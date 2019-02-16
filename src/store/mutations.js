import * as types from "./mutation-types";

export default {
  //  异步后台请求挖掘数量
  [types.SET_COUNT](state, num) {
    state.count = num;
  },
  [types.SET_PARTS](state, data) {
    state.parts = data;
  },
  [types.SET_PARTS_DAYS](state, data) {
    state.dayParts = data;
  },
  [types.SET_STARTTIME](state, data) {
    state.startTime = data;
  },
  [types.SET_ENDTIME](state, data) {
    state.endTime = data;
  },
  [types.SET_TYPE](state, data) {
    state.typeValue = data;
  },
  [types.SET_TYPE_INDEX](state, data) {
    state.typeIndex = data;
  },
  [types.SET_DAYS_TYPE](state, data) {
    state.daysTypeValue = data;
  },
  [types.SET_DAYS_TYPE_INDEX](state, data) {
    state.daysTypeIndex = data;
  },
  [types.SET_DAYS_SERIES](state, data) {
    state.series = data;
  },
  [types.SET_DAYS_REPORTTIMES](state, data) {
    state.reporttimes = data;
  },
  // [types.SET_DAY_PARAMS](state, data) {
  //   state.dayParams = data;
  // },
  [types.SET_BADCHART_STARTTIME](state, data) {//记录不良统计图开始时间
    state.badChartStTime = data;
  },
  [types.SET_BADCHART_ENDTIME](state, data) {//记录不良统计图结束时间
    state.badChartEdTime = data;
  },
  [types.SET_BADCHART_TYPE](state, data) {//记录不良统计图机种类型
    state.badChartType = data;
  },
  [types.SET_BADCHART_TYPE_INDEX](state, data) {//记录不良统计图机种索引
    state.badChartIndex = data;
  },
  [types.SET_BADCHART_ITEM](state, data) {//记录不良统计图单个机种
    state.badChartItem = data;
  },
  [types.SET_BADCHART_SEARCHPARAMS](state, data) {//记录不良统计图单个机种
    state.badChartSearchParams = data;
  },
  [types.SET_STOREPICK_TYPE](state, data) {//记录unknown汇总数据类型
    state.storepickType = data;
  },
  [types.SET_STOREPICK_INDEX](state, data) {//记录unknown汇总数据类型
    state.storepickIndex = data;
  },
  [types.SET_STOREPICK_STARTTIME](state, data) {//保存unknown汇总数据开始时间
    state.storepickStTime = data;
  },
  [types.SET_STOREPICK_ENDTIME](state, data) {//保存unknown汇总数据结束时间
    state.storepickEdTime = data;
  },
  [types.SET_COMPARESTORE_TYPE](state, data) {//保存unknown汇总数据开始时间
    state.compareStoreType = data;
  },
  [types.SET_COMPARESTORE_INDEX](state, data) {//保存unknown汇总数据结束时间
    state.compareStoreIndex = data;
  },
  [types.SET_COMPARESTORE_MODELS](state, data) {//保存unknown汇总数据结束时间
    state.compareStoreModels = data;
  },
  //不良信息类型与样式索引
  [types.SET_BADINFORMATION_TYPE](state, data) {
    state.badInformationType = data;
  },
  [types.SET_BADINFORMATION_INDEX](state, data) {
    state.badInformationIndex = data;
  },
  [types.SET_BADINFORMATION_ITEM](state, data) {
    state.badInformationItem = data;
  },
  [types.SET_DAYENTREPOT_INITECHART](state, data) {//保存当天领料仓库的数据
    state.dayEntrepotInitEchart = data;
  },

  [types.SET_DAYENTREPOT_MODELNAMELIST](state, data) {
    state.globalModelNamelist = data;
  },
  [types.SET_DAYENTREPOT_PARTNOLIST](state, data) {
    state.globalPartNoList = data;
  },
  [types.SET_DAYENTREPOT_MODELREPORTTATOLSLIST](state, data) {//保存当天领料仓库的数据
    state.globalReportTatolsList = data;
  },
  [types.SET_DAYSENTREPOT_REPORTTIMES](state, data) {
    state.daysEntrepotReporttimes = data;
  },
  [types.SET_DAYSENTREPOT_SERIES](state, data) {//保存当天领料仓库的数据
    state.daysEntrepotReportSeries = data;
  },
  [types.SET_DAYSENTREPOT_PARTARR](state, data) {//保存当天领料仓库的数据
    state.daysEntrepotReportPartArr = data;
  },
  [types.SET_BADCHART_BACKDATA](state, data) {//保存当天领料仓库的数据
    state.badChartBackData = data;
  },
  [types.SET_COMPARESTORE_CHART](state, data) {//保存当天领料仓库的数据
    state.compareStoreChart = data;
  },
  [types.SET_STOREPICK_DATA](state, data) {//保存当天领料仓库的数据
    state.storePickData = data;
  },
  [types.SET_BADCHART_SHOWSTATE](state, data) {//保存状态
    state.showState = data;
  },
  [types.SET_BADCHART_SCROLLBAR](state, data) {//保存状态
    state.showScrollBar = data;
  },
  [types.SET_STOREPICK_SHOWSTATE](state, data) {//保存状态
    state.showStoreBar = data;
  },

  [types.SET_MODELSALERATIO_TYPE](state, data) {//保存出货比例选择类型
    state.modelSaleRatioType = data;
  },
  [types.SET_MODELSALERATIO_INDEX](state, data) {//保存出货比例选择索引
    state.modelSaleRatioIndex = data;
  },
  [types.SET_MODELSALERATIO_STARTTIME](state, data) {
    state.modelSaleRatioStTime = data;
  },
  [types.SET_MODELSALERATIO_ENDTIME](state, data) {
    state.modelSaleRatioEdTime = data;
  },
  [types.SET_MODELSALERATIO_PARTS](state, data) {
    state.modelSaleRatioParts = data;
  },

  [types.SET_PRODUCTDATA_TYPE](state, data) {
    state.productDataType = data;
  },
  [types.SET_PRODUCTDATA_INDEX](state, data) {
    state.productDataIndex = data;
  },
  [types.SET_PRODUCTDATA_STARTTIME](state, data) {
    state.productDataStTime = data;
  },
  [types.SET_PRODUCTDATA_ENDTIME](state, data) {
    state.productDataEdTime = data;
  },
  [types.SET_PRODUCTDATA_PARTS](state, data) {
    state.productDataParts = data;
  },

  [types.SET_MODELSALEDETAIL_TYPE](state, data) {
    state.modelSaleRatioDetailType = data;
  },
  [types.SET_MODELSALEDETAIL_INDEX](state, data) {
    state.modelSaleRatioDetailIndex = data;
  },
  [types.SET_MODELSALEDETAIL_STARTTIME](state, data) {
    state.modelSaleRatioDetailStTime = data;
  },
  [types.SET_MODELSALEDETAIL_ENDTIME](state, data) {
    state.modelSaleRatioDetailEdTime = data;
  },
  [types.SET_MODELSALEDETAIL_PARTS](state, data) {
    state.modelSaleRatioDetailParts = data;
  },
  [types.SET_MODELSALEDETAIL_DATADETAIL](state, data) {
    state.modelSaleRatioDetailData = data;
  },
  [types.SET_PRODUCTDATA_DATADETAIL](state, data) {
    state.productDataDetailList = data;
  },


  [types.SET_MODELANDCODE](state, data) {
    state.modelAndCode = data;
  },
  [types.SET_CLASSANDDATE](state, data) {
    state.classAndDate = data;
  },
  [types.SET_REPORTTOTALARR](state, data) {
    state.reportTotalArr = data;
  },
  [types.SET_GRIDDATA](state, data) {
    state.gridData = data;
  },
  [types.SET_FORMATGRID](state, data) {
    state.formatGrid = data;
  },
  [types.SET_CONCATOBJ](state, data) {
    state.concatObj = data;
  },
  [types.SET_MODELNAMELIST](state, data) {
    state.modelNameList = data;
  },

  [types.SET_MANYMODELYIELD_TYPE](state, data) {
    state.modelYieldType = data;
  },
  [types.SET_MANYMODELYIELD_INDEX](state, data) {
    state.modelYieldIndex = data;
  },
  [types.SET_MANYMODELYIELD_STARTTIME](state, data) {
    state.modelYieldStTime = data;
  },
  [types.SET_MANYMODELYIELD_ENDTIME](state, data) {
    state.modelYieldEdTime = data;
  },
  [types.SET_MANYMODELYIELD_ITEM](state, data) {
    state.modelYieldItem = data;
  },

  [types.SET_MANYMODELYIELD_LIST](state, data) {
    state.modelYieldList = data;
  },
  [types.SET_COUNTTOTALANDYIELD](state, data) {
    state.countTotalAndYield = data;
  },
  
  [types.SET_PROCESSPRODUCTION_TYPE](state, data) {
    state.processProductionType = data;
  },
  [types.SET_PROCESSPRODUCTION_INDEX](state, data) {
    state.processProductionIndex = data;
  },
  [types.SET_PROCESSPRODUCTION_ITEM](state, data) {
    state.processProductionItem = data;
  },

  [types.SET_PROCESSCUSTOMER_TYPE](state, data) {
    state.processCustomerType = data;
  },
  [types.SET_PROCESSCUSTOMER_INDEX](state, data) {
    state.processCustomerIndex = data;
  },
  [types.SET_PROCESSCUSTOMER_ITEM](state, data) {
    state.processCustomerItem = data;
  },
  [types.SET_COUNTSTOREPICK_ITEM](state, data) {
    state.countStorePickItem = data;
  },
  [types.SET_PROCESSINPUTOUT_TYPE](state, data) {
    state.processInputOutType = data;
  },
  [types.SET_PROCESSINPUTOUT_INDEX](state, data) {
    state.processInputOutIndex = data;
  },
  [types.SET_PROCESSINPUTOUT_ITEM](state, data) {
    state.processInputOutItem = data;
  },

  [types.SET_DOWNPARTNAME](state, data) {
    state.downPartName = data;
  },
  [types.SET_DOWNUPPCODE](state, data) {
    state.downUppCode = data;
  },

  [types.SET_PROCESSBADCODE_ITEM](state, data) {
    state.processBadCodeModel = data;
  },
  [types.SET_PROCESSBADCODE_TYPE](state, data) {
    state.processBadCodeType = data;
  },
  [types.SET_PROCESSBADCODE_INDEX](state, data) {
    state.processBadCodeIndex = data;
  },

  [types.SET_CHOOSEWAREHOUSE_ITEM](state, data) {
    state.chooseWareHouseModel = data;
  },
  [types.SET_CHOOSEWAREHOUSE_TYPE](state, data) {
    state.chooseWareHouseType = data;
  },
  [types.SET_CHOOSEWAREHOUSE_INDEX](state, data) {
    state.chooseWareHouseIndex = data;
  },
  [types.SET_PRODUCTDATA_NODATA](state, data) {
    state.productNoData = data;
  },
  
  [types.SET_MODELSALEDETAIL_NODATA](state, data) {
    state.saleDetailNoData = data;
  },
  [types.SET_SALERATIONODATA](state, data) {
    state.saleRatioNoData = data;
  },
  [types.SET_CARTONNOQUERY_QCCODE](state, data) {
    state.qrCodeArr = data;
  },
  [types.SET_MANYYIELD_DATA](state, data) {
    state.manyYieldData = data;
  },
};
