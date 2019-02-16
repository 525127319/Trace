import * as types from './mutation-types'

export const deleteProcessCustomerList = function ({commit}) {
    commit(types.SET_DOWNPARTNAME,[]);
    commit(types.SET_DOWNUPPCODE,[]);
    commit(types.SET_MODELSALERATIO_INDEX, "");
    commit(types.SET_MODELSALERATIO_STARTTIME,"");
    commit(types.SET_MODELSALERATIO_ENDTIME, "");
    commit(types.SET_MODELANDCODE,{});
    commit(types.SET_CLASSANDDATE,[] );
    commit(types.SET_REPORTTOTALARR, []);
    commit(types.SET_GRIDDATA, []);
    commit(types.SET_FORMATGRID, []);
    commit(types.SET_CONCATOBJ, []);
    commit(types.SET_MODELNAMELIST, []);
    commit(types.SET_MODELSALERATIO_PARTS, []);
    commit(types.SET_MODELSALEDETAIL_TYPE,"");
    commit(types.SET_MODELSALEDETAIL_INDEX,"");
    commit(types.SET_MODELSALEDETAIL_PARTS,[]); 
    commit(types.SET_PRODUCTDATA_STARTTIME,"")
    commit(types.SET_PRODUCTDATA_ENDTIME,"");
    commit(types.SET_MODELSALEDETAIL_DATADETAIL, []);
    commit(types.SET_PRODUCTDATA_TYPE,"");
    commit(types.SET_PRODUCTDATA_INDEX,"");
    commit(types.SET_PRODUCTDATA_STARTTIME,"");
    commit(types.SET_PRODUCTDATA_ENDTIME,"");
    commit(types.SET_PRODUCTDATA_DATADETAIL, []);
    commit(types.SET_PRODUCTDATA_PARTS,[]);
    commit(types.SET_MODELSALEDETAIL_ENDTIME, "");
    commit(types.SET_MODELSALEDETAIL_STARTTIME, "");
    commit(types.SET_PRODUCTDATA_NODATA,false);
    commit(types.SET_MODELSALEDETAIL_NODATA,false);
  }

  export const deletePickingList = function ({commit}) {
    commit(types.SET_DAYENTREPOT_INITECHART, []);
    commit(types.SET_DAYENTREPOT_MODELNAMELIST, []);
    commit(types.SET_DAYENTREPOT_PARTNOLIST, []);
    commit(types.SET_DAYENTREPOT_MODELREPORTTATOLSLIST, []);
    commit(types.SET_TYPE, "");
    commit(types.SET_TYPE_INDEX, "");
    commit(types.SET_PARTS, []);
    commit(types.SET_DAYS_TYPE, "");
    commit(types.SET_DAYS_TYPE_INDEX, "");
    commit(types.SET_STARTTIME, "");
    commit(types.SET_ENDTIME, "");
    commit(types.SET_DAYSENTREPOT_REPORTTIMES, []);
    commit(types.SET_DAYSENTREPOT_SERIES, []);
    commit(types.SET_DAYSENTREPOT_PARTARR, []);
    commit(types.SET_PARTS_DAYS, []);
  }

export const deleteProProductionList = function ({commit}) {
    commit(types.SET_COMPARESTORE_TYPE, "");
    commit(types.SET_COMPARESTORE_INDEX, "");
    commit(types.SET_COMPARESTORE_MODELS, []);
    commit(types.SET_COMPARESTORE_CHART, []);
    commit(types.SET_STOREPICK_SHOWSTATE, false);
    commit(types.SET_STOREPICK_DATA, []);
    commit(types.SET_STOREPICK_STARTTIME, "");
    commit(types.SET_STOREPICK_ENDTIME, "");
    commit(types.SET_STOREPICK_TYPE, "");
    commit(types.SET_STOREPICK_INDEX, "");
    commit(types.SET_COUNTSTOREPICK_ITEM, {});
  }

  export const deleteProInputOutList = function ({commit}) {
    commit(types.SET_MANYMODELYIELD_TYPE,"");
    commit(types.SET_MANYMODELYIELD_INDEX, "");
    commit(types.SET_MANYMODELYIELD_STARTTIME, "");
    commit(types.SET_MANYMODELYIELD_ENDTIME, "");
    commit(types.SET_MANYMODELYIELD_ITEM,{});
    commit(types.SET_MANYMODELYIELD_LIST, []);
    commit(types.SET_COUNTTOTALANDYIELD, []); 
  }

  export const deleteProBadList = function ({commit}) {
    commit(types.SET_BADCHART_ITEM,{}); 
    commit(types.SET_BADCHART_STARTTIME, "");
    commit(types.SET_BADCHART_ENDTIME, "");
    commit(types.SET_BADCHART_TYPE, "");
    commit(types.SET_BADCHART_TYPE_INDEX, "");
    commit(types.SET_BADCHART_BACKDATA,[]);
    commit(types.SET_BADCHART_SHOWSTATE,false);
  }

 