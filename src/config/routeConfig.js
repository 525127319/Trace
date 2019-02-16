'use strict'
// 路由配置页面
// 懒加载配置组件，提高渲染效率

// 入口页面
const index = resolve => {
  require.ensure(['../components/index.vue'], () => {
    resolve(require('../components/index.vue'))
  })
}

// 选择机种页面
const modelList = resolve => {
  require.ensure(['../components/choose/modelList.vue'], () => {
    resolve(require('../components/choose/modelList.vue'))
  })
}

// 选择机种页面
const baseModelList = resolve => {
  require.ensure(['../components/choose/baseModelList.vue'], () => {
    resolve(require('../components/choose/baseModelList.vue'))
  })
}

// 生产在制流程选择制程页面
const processProduction = resolve => {
  require.ensure(['../components/choose/processProduction.vue'], () => {
    resolve(require('../components/choose/processProduction.vue'))
  })
}

// 不良信息流程选择制程页面
const processBadInformation = resolve => {
  require.ensure(['../components/choose/processBadInformation.vue'], () => {
    resolve(require('../components/choose/processBadInformation.vue'))
  })
}

// 不良代码流程选择制程页面
const processBadCode = resolve => {
  require.ensure(['../components/choose/processBadCode.vue'], () => {
    resolve(require('../components/choose/processBadCode.vue'))
  })
}

// 投入产出流程选择制程页面
const processInputOut = resolve => {
  require.ensure(['../components/choose/processInputOut.vue'], () => {
    resolve(require('../components/choose/processInputOut.vue'))
  })
}

// 客户信息流程选择制程页面
const processCustomerInformation = resolve => {
  require.ensure(['../components/choose/processCustomerInformation.vue'], () => {
    resolve(require('../components/choose/processCustomerInformation.vue'))
  })
}

// 选择半成品仓制程页面
const chooseSemiFinishedProcess = resolve => {
  require.ensure(['../components/choose/chooseSemiFinishedProcess.vue'], () => {
    resolve(require('../components/choose/chooseSemiFinishedProcess.vue'))
  })
}

// 选择半成品仓站点页面
const chooseSemiFinishTerminal = resolve => {
  require.ensure(['../components/choose/chooseSemiFinishTerminal.vue'], () => {
    resolve(require('../components/choose/chooseSemiFinishTerminal.vue'))
  })
}


// 生产在制流程选择站点页面
const terminalProduction = resolve => {
  require.ensure(['../components/choose/terminalProduction.vue'], () => {
    resolve(require('../components/choose/terminalProduction.vue'))
  })
}

// 不良信息流程选择站点页面
const terminalBadInformation = resolve => {
  require.ensure(['../components/choose/terminalBadInformation.vue'], () => {
    resolve(require('../components/choose/terminalBadInformation.vue'))
  })
}

// 投入产出流程选择站点页面
const terminnalInputOut = resolve => {
  require.ensure(['../components/choose/terminnalInputOut.vue'], () => {
    resolve(require('../components/choose/terminnalInputOut.vue'))
  })
}

// 投入产出流程选择站点页面
const terminalCustomerInformation = resolve => {
  require.ensure(['../components/choose/terminalCustomerInformation.vue'], () => {
    resolve(require('../components/choose/terminalCustomerInformation.vue'))
  })
}

// 选择时间和类别和料仓页面
const chooseWarehouse = resolve => {
  require.ensure(['../components/choose/chooseWarehouse.vue'], () => {
    resolve(require('../components/choose/chooseWarehouse.vue'))
  })
}

// 生产在制查询页面
const productionQuery = resolve => {
  require.ensure(['../components/query/productionQuery.vue'], () => {
    resolve(require('../components/query/productionQuery.vue'))
  })
}

// 投入产出查询页面
const inputAndOutputQuery = resolve => {
  require.ensure(['../components/query/inputAndOutputQuery.vue'], () => {
    resolve(require('../components/query/inputAndOutputQuery.vue'))
  })
}

// 产品履历查询页面
const productRecord = resolve => {
  require.ensure(['../components/query/productRecord.vue'], () => {
    resolve(require('../components/query/productRecord.vue'))
  })
}

// 仓库领料记录查询页面
const warehouseReceiptRecord = resolve => {
  require.ensure(['../components/query/warehouseReceiptRecord.vue'], () => {
    resolve(require('../components/query/warehouseReceiptRecord.vue'))
  })
}

// 箱号数量查询页面
const cartonNoQuery = resolve => {
  require.ensure(['../components/query/cartonNoQuery.vue'], () => {
    resolve(require('../components/query/cartonNoQuery.vue'))
  })
}

// 物料详情查询页面
const warehouseQuery = resolve => {
  require.ensure(['../components/query/warehouseQuery.vue'], () => {
    resolve(require('../components/query/warehouseQuery.vue'))
  })
}

// 半成品仓物料详情查询页面
const semiFinishWarehouse = resolve => {
  require.ensure(['../components/query/semiFinishWarehouse.vue'], () => {
    resolve(require('../components/query/semiFinishWarehouse.vue'))
  })
}

// 客户信息导出页面
const customerInformationExport = resolve => {
  require.ensure(['../components/query/customerInformationExport.vue'], () => {
    resolve(require('../components/query/customerInformationExport.vue'))
  })
}

// 投入产出明细页面
const inputOutputDetail = resolve => {
  require.ensure(['../components/detail/inputOutputDetail.vue'], () => {
    resolve(require('../components/detail/inputOutputDetail.vue'))
  })
}

// 投入产出制程分布页面
const processDistribution = resolve => {
  require.ensure(['../components/detail/processDistribution.vue'], () => {
    resolve(require('../components/detail/processDistribution.vue'))
  })
}

// 不良代码详情页面
const badCodeDetail = resolve => {
  require.ensure(['../components/unqualified/badCodeDetail.vue'], () => {
    resolve(require('../components/unqualified/badCodeDetail.vue'))
  })
}

// 不良信息详情页面
const badInformation = resolve => {
  require.ensure(['../components/unqualified/badInformation.vue'], () => {
    resolve(require('../components/unqualified/badInformation.vue'))
  })
}


// 箱号数量详情页面
const cartonNoDetail = resolve => {
  require.ensure(['../components/detail/cartonNoDetail.vue'], () => {
    resolve(require('../components/detail/cartonNoDetail.vue'))
  })
}

// 客户信息导出详情页面
const customerInformationDetail = resolve => {
  require.ensure(['../components/detail/customerInformationDetail.vue'], () => {
    resolve(require('../components/detail/customerInformationDetail.vue'))
  })
}

// 不良统计信息详情页面
const badInformationDetail = resolve => {
  require.ensure(['../components/detail/badInformationDetail.vue'], () => {
    resolve(require('../components/detail/badInformationDetail.vue'))
  })
}

// 责任归属统计信息详情页面
const dutyDetail = resolve => {
  require.ensure(['../components/detail/dutyDetail.vue'], () => {
    resolve(require('../components/detail/dutyDetail.vue'))
  })
}

// 异步任务列表页面
const asyncTaskList = resolve => {
  require.ensure(['../components/choose/asyncTaskList.vue'], () => {
    resolve(require('../components/choose/asyncTaskList.vue'))
  })
}

//当天仓库机种领料页面 
const dayEntrepot = resolve => {
  require.ensure(['../components/query/dayEntrepot.vue'], () => {
    resolve(require('../components/query/dayEntrepot.vue'))
  })
}

//多天仓库机种领料详情页面 
const dayEntrepotDetail = resolve => {
  require.ensure(['../components/query/dayEntrepotDetail.vue'], () => {
    resolve(require('../components/query/dayEntrepotDetail.vue'))
  })
}

//多天仓库机种领料页面 
const daysEntrepot = resolve => {
  require.ensure(['../components/query/daysEntrepot.vue'], () => {
    resolve(require('../components/query/daysEntrepot.vue'))
  })
}
// ========================
//多天仓库机种领料页面 
const badChart = resolve => {
  require.ensure(['../components/query/badChart.vue'], () => {
    resolve(require('../components/query/badChart.vue'))
  })
}

//多天仓库机种领料页面 
const compareStoreData = resolve => {
  require.ensure(['../components/query/compareStoreData.vue'], () => {
    resolve(require('../components/query/compareStoreData.vue'))
  })
}

//不良趋势图页面 
const countBadChart = resolve => {
  require.ensure(['../components/query/countBadChart.vue'], () => {
    resolve(require('../components/query/countBadChart.vue'))
  })
}

//当天仓库领料总数页面 
const countStorePick = resolve => {
  require.ensure(['../components/query/countStorePick.vue'], () => {
    resolve(require('../components/query/countStorePick.vue'))
  })
}

//各机种良率页面 
const manyModelYield = resolve => {
  require.ensure(['../components/query/manyModelYield.vue'], () => {
    resolve(require('../components/query/manyModelYield.vue'))
  })
}

//机种出货详情页面 
const modelSaleDetail = resolve => {
  require.ensure(['../components/query/modelSaleDetail.vue'], () => {
    resolve(require('../components/query/modelSaleDetail.vue'))
  })
}

//各机种出货比例页面 
const modelSaleRatio = resolve => {
  require.ensure(['../components/query/modelSaleRatio.vue'], () => {
    resolve(require('../components/query/modelSaleRatio.vue'))
  })
}

//产出数据页面 
const productData = resolve => {
  require.ensure(['../components/query/productData.vue'], () => {
    resolve(require('../components/query/productData.vue'))
  })
}

//单选机种
const singleModelList = resolve => {
  require.ensure(['../components/choose/singleModelList.vue'], () => {
    resolve(require('../components/choose/singleModelList.vue'))
  })
}

const badModelList = resolve => {
  require.ensure(['../components/choose/badModelList.vue'], () => {
    resolve(require('../components/choose/badModelList.vue'))
  })
}

const processModelList = resolve => {
  require.ensure(['../components/choose/processModelList.vue'], () => {
    resolve(require('../components/choose/processModelList.vue'))
  })
}

const goodsModelList = resolve => {
  require.ensure(['../components/choose/goodsModelList.vue'], () => {
    resolve(require('../components/choose/goodsModelList.vue'))
  })
}

const customerModelList = resolve => {
  require.ensure(['../components/choose/customerModelList.vue'], () => {
    resolve(require('../components/choose/customerModelList.vue'))
  })
}

export default {
  routes: [{
      path: "/",
      redirect: "./index"
    },
    {
      name: "index",
      path: "/index", //  首页页面
      component: index,
    },
    {
      name: "asyncTaskList",
      path: "/asyncTaskList", //  页面
      component: asyncTaskList,
    },
    {
      name: "modelList",
      path: "/modelList", //  选择机种页面
      component: modelList,
    },
    {
      name: "processProduction",
      path: "/processProduction", //  生产在制流程选择制程页面
      component: processProduction,
    },
    
    {
      name: "processBadInformation",
      path: "/processBadInformation", //  不良信息流程选择制程页面
      component: processBadInformation,
    },
    {
      name: "processBadCode",
      path: "/processBadCode", //  不良代码流程选择制程页面
      component: processBadCode,
    },
    {
      name: "processInputOut",
      path: "/processInputOut", //  投入产出流程选择制程页面
      component: processInputOut,
    },
    {
      name: "processCustomerInformation",
      path: "/processCustomerInformation", //  客户信息流程选择制程页面
      component: processCustomerInformation,
    },
    {
      name: "terminalProduction",
      path: "/terminalProduction", //  生产在制流程选择站点页面
      component: terminalProduction,
    },
    {
      name: "terminalBadInformation",
      path: "/terminalBadInformation", //  不良信息流程选择站点页面
      component: terminalBadInformation,
    },
    {
      name: "terminnalInputOut",
      path: "/terminnalInputOut", //  投入产出流程选择站点页面
      component: terminnalInputOut,
    },
    {
      name: "terminalCustomerInformation",
      path: "/terminalCustomerInformation", //  客户信息流程选择站点页面
      component: terminalCustomerInformation,
    },
    {
      name: "chooseSemiFinishedProcess",
      path: "/chooseSemiFinishedProcess", //  半成品仓时选择制程页面
      component: chooseSemiFinishedProcess,
    },
    {
      name: "chooseSemiFinishTerminal",
      path: "/chooseSemiFinishTerminal", //  半成品仓时选择站点页面
      component: chooseSemiFinishTerminal,
    },
    {
      name: "chooseWarehouse",
      path: "/chooseWarehouse", //  选择类别和料仓页面
      component: chooseWarehouse,
    },
    {
      name: "productionQuery",
      path: "/productionQuery", // 生产在制查询页面
      component: productionQuery,
    },
    {
      name: "inputAndOutputQuery",
      path: "/inputAndOutputQuery", // 投入产出查询页面
      component: inputAndOutputQuery,
    },
    {
      name: "productRecord",
      path: "/productRecord", // 产品履历查询页面
      component: productRecord,
    },
    {
      name: "warehouseReceiptRecord",
      path: "/warehouseReceiptRecord", // 仓库领料记录查询页面
      component: warehouseReceiptRecord,
    },
    {
      name: "cartonNoQuery",
      path: "/cartonNoQuery", // 仓库领料记录查询页面
      component: cartonNoQuery,
    },
    {
      name: "warehouseQuery",
      path: "/warehouseQuery", // 物料详情查询页面
      component: warehouseQuery,
    },
    {
      name: "semiFinishWarehouse",
      path: "/semiFinishWarehouse", // 半成品仓物料详情查询页面
      component: semiFinishWarehouse,
    },
    {
      name: "inputOutputDetail",
      path: "/inputOutputDetail", // 投入产出明细页面
      component: inputOutputDetail,
    },
    {
      name: "processDistribution",
      path: "/processDistribution", // 投入产出制程分布页面
      component: processDistribution,
    },
    {
      name: "badCodeDetail",
      path: "/badCodeDetail", // 不良代码查询页面
      component: badCodeDetail,
    },
    {
      name: "badInformation",
      path: "/badInformation", // 不良信息查询页面
      component: badInformation,
    },
    {
      name: "cartonNoDetail",
      path: "/cartonNoDetail", // 箱号数量详情页面
      component: cartonNoDetail,
    },
    {
      name: "customerInformationExport",
      path: "/customerInformationExport", // 客户信息导出页面
      component: customerInformationExport,
    },
    {
      name: "customerInformationDetail",
      path: "/customerInformationDetail", // 客户信息导出详情页面
      component: customerInformationDetail,
    },
    {
      name: "badInformationDetail",
      path: "/badInformationDetail", // 不良统计信息详情页面
      component: badInformationDetail,
    },
    {
      name: "dutyDetail",
      path: "/dutyDetail", // 责任归属统计信息详情页面
      component: dutyDetail,
    },
    {
      name: "dayEntrepot",
      path: "/dayEntrepot",  //当天仓库机种领料页面 
      component: dayEntrepot,
    },
    {
      name: "daysEntrepot",
      path: "/daysEntrepot",  //当天仓库机种领料页面 
      component: daysEntrepot,
    },
    {
      name: "dayEntrepotDetail",
      path: "/dayEntrepotDetail",//多天仓库机种领料详情页面 
      component: dayEntrepotDetail,
    },
    {
      name: "badChart",
      path: "/badChart", //不良趋势图页面 
      component: badChart,
    },
    {
      name: "compareStoreData",
      path: "/compareStoreData", //WIP和七天以上数据对比页面 
      component: compareStoreData,
    },
    {
      name: "countBadChart",
      path: "/countBadChart", //不良统计页面 
      component: countBadChart,
    },
    {
      name: "countStorePick",
      path: "/countStorePick", //当天仓库领料总数页面 
      component: countStorePick,
    },
    {
      name: "manyModelYield",
      path: "/manyModelYield", //各机种良率页面 
      component: manyModelYield,
    },
    {
      name: "modelSaleDetail",
      path: "/modelSaleDetail", //机种出货详情页面 
      component: modelSaleDetail,
    },
    {
      name: "modelSaleRatio",
      path: "/modelSaleRatio", //各机种出货比例页面 
      component: modelSaleRatio,
    },
    {
      name: "productData",
      path: "/productData", //产出数据页面 
      component:productData,
    },
    {
      name: "baseModelList",
      path: "/baseModelList", //  选择机种页面
      component: baseModelList,
    },
    {
      name: "singleModelList",
      path: "/singleModelList", //  单选机种页面
      component: singleModelList,
    },
    {
      name:"badModelList",
      path: "/badModelList", //  单选机种页面
      component: badModelList,
    },
    {
      name:"processModelList",
      path: "/processModelList", //  单选机种页面
      component: processModelList,
    },
    {
      name:"goodsModelList",
      path: "/goodsModelList", //  成品机种选择页面
      component:goodsModelList,
    },
    {
      name:"customerModelList",
      path: "/customerModelList", //  成品机种选择页面
      component:customerModelList,
    }
  ]
}